import type { ExtMessage } from '../types'

// Background service worker
// Handles chrome.tabs.captureVisibleTab (only available in background context)

chrome.runtime.onMessage.addListener(
  (message: ExtMessage, _sender, sendResponse) => {
    if (message.type === 'CAPTURE_VISIBLE_AREA') {
      captureVisible(sendResponse)
      return true // keep channel open for async response
    }

    if (message.type === 'CAPTURE_FULL_PAGE') {
      // Full-page capture via scripting API: scroll + stitch
      captureFullPage(sendResponse)
      return true
    }

    return false
  }
)

// ── Visible area capture ──────────────────────────────────────────────────────

async function captureVisible(
  sendResponse: (msg: ExtMessage) => void
): Promise<void> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab.id) {
      sendResponse({ type: 'CAPTURE_ERROR', message: '활성 탭을 찾을 수 없습니다.' })
      return
    }

    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: 'png',
    })

    // Get image dimensions
    const { width, height } = await getImageSize(dataUrl)
    sendResponse({ type: 'CAPTURE_RESULT', dataUrl, width, height })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '캡처 실패'
    sendResponse({ type: 'CAPTURE_ERROR', message: msg })
  }
}

// ── Full-page capture (scroll + stitch) ───────────────────────────────────────

async function captureFullPage(
  sendResponse: (msg: ExtMessage) => void
): Promise<void> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab.id) {
      sendResponse({ type: 'CAPTURE_ERROR', message: '활성 탭을 찾을 수 없습니다.' })
      return
    }

    const tabId = tab.id
    const windowId = tab.windowId

    // Get page dimensions and viewport via scripting
    const [dims] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => ({
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      }),
    })

    if (!dims?.result) {
      sendResponse({ type: 'CAPTURE_ERROR', message: '페이지 정보를 가져올 수 없습니다.' })
      return
    }

    const { scrollHeight, viewportHeight } = dims.result

    // Save original scroll position
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => window.scrollTo(0, 0),
    })

    const strips: string[] = []
    let scrollY = 0

    while (scrollY < scrollHeight) {
      // Scroll to position
      await chrome.scripting.executeScript({
        target: { tabId },
        func: (y: number) => window.scrollTo(0, y),
        args: [scrollY],
      })

      // Wait for scroll + paint to settle.
      // captureVisibleTab quota = 2 calls/sec → minimum 500ms between calls.
      // Using 600ms to stay safely under the limit.
      await delay(600)

      const strip = await chrome.tabs.captureVisibleTab(windowId, { format: 'png' })
      strips.push(strip)
      scrollY += viewportHeight
    }

    // Restore scroll
    await chrome.scripting.executeScript({
      target: { tabId },
      func: () => window.scrollTo(0, 0),
    })

    // Stitch strips using OffscreenCanvas
    const stitched = await stitchStrips(strips, dims.result)
    const { width, height } = await getImageSize(stitched)
    sendResponse({ type: 'CAPTURE_RESULT', dataUrl: stitched, width, height })
  } catch (err) {
    const msg = err instanceof Error ? err.message : '전체 페이지 캡처 실패'
    sendResponse({ type: 'CAPTURE_ERROR', message: msg })
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

async function getImageSize(dataUrl: string): Promise<{ width: number; height: number }> {
  // In service worker context, use createImageBitmap
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  const bitmap = await createImageBitmap(blob)
  const { width, height } = bitmap
  bitmap.close()
  return { width, height }
}

async function stitchStrips(
  strips: string[],
  dims: {
    scrollWidth: number
    scrollHeight: number
    viewportWidth: number
    viewportHeight: number
    devicePixelRatio: number
  }
): Promise<string> {
  const { scrollHeight, viewportWidth, viewportHeight, devicePixelRatio } = dims
  const dpr = devicePixelRatio || 1

  const canvas = new OffscreenCanvas(
    viewportWidth * dpr,
    scrollHeight * dpr
  )
  const ctx = canvas.getContext('2d')!

  let offsetY = 0
  for (let i = 0; i < strips.length; i++) {
    const res = await fetch(strips[i])
    const blob = await res.blob()
    const bitmap = await createImageBitmap(blob)

    // Last strip may overlap — only draw the remaining portion
    const remaining = scrollHeight * dpr - offsetY
    const srcHeight = Math.min(bitmap.height, remaining)

    ctx.drawImage(
      bitmap,
      0, 0, bitmap.width, srcHeight,
      0, offsetY, bitmap.width, srcHeight
    )
    bitmap.close()
    offsetY += viewportHeight * dpr
  }

  const blob = await canvas.convertToBlob({ type: 'image/png' })
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
  })
}
