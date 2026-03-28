import type { ExtMessage } from '../types'

// Content script — injected into all pages
// Handles element selection mode

let isSelecting = false
let overlay: HTMLElement | null = null
let highlightBox: HTMLElement | null = null

// ── Message listener ──────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener(
  (message: ExtMessage, _sender, sendResponse) => {
    if (message.type === 'CAPTURE_ELEMENT_START') {
      startElementSelection()
      sendResponse({ ok: true })
      return true
    }

    if (message.type === 'CAPTURE_ELEMENT_CANCEL') {
      stopElementSelection()
      sendResponse({ ok: true })
      return true
    }

    return false
  }
)

// ── Element selection ─────────────────────────────────────────────────────────

function startElementSelection() {
  if (isSelecting) return
  isSelecting = true

  // Semi-transparent overlay for visual feedback
  overlay = document.createElement('div')
  overlay.id = '__trove_overlay__'
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '2147483646',
    cursor: 'crosshair',
    pointerEvents: 'none',
  })
  document.body.appendChild(overlay)

  // Highlight box
  highlightBox = document.createElement('div')
  highlightBox.id = '__trove_highlight__'
  Object.assign(highlightBox.style, {
    position: 'fixed',
    zIndex: '2147483647',
    border: '2px solid #6366f1',
    borderRadius: '3px',
    background: 'rgba(99, 102, 241, 0.08)',
    pointerEvents: 'none',
    transition: 'all 0.05s',
    display: 'none',
    boxSizing: 'border-box',
  })
  document.body.appendChild(highlightBox)

  document.addEventListener('mouseover', onMouseOver, true)
  document.addEventListener('mouseout', onMouseOut, true)
  document.addEventListener('click', onClick, true)
  document.addEventListener('keydown', onKeyDown, true)
}

function stopElementSelection() {
  if (!isSelecting) return
  isSelecting = false

  document.removeEventListener('mouseover', onMouseOver, true)
  document.removeEventListener('mouseout', onMouseOut, true)
  document.removeEventListener('click', onClick, true)
  document.removeEventListener('keydown', onKeyDown, true)

  overlay?.remove()
  highlightBox?.remove()
  overlay = null
  highlightBox = null
}

function onMouseOver(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target || target.id === '__trove_overlay__' || target.id === '__trove_highlight__') {
    return
  }

  const rect = target.getBoundingClientRect()
  if (highlightBox) {
    Object.assign(highlightBox.style, {
      display: 'block',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    })
  }
}

function onMouseOut(_e: MouseEvent) {
  if (highlightBox) {
    highlightBox.style.display = 'none'
  }
}

function onClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()

  const target = e.target as HTMLElement
  if (!target || target.id === '__trove_overlay__' || target.id === '__trove_highlight__') {
    return
  }

  const rect = target.getBoundingClientRect()
  const selector = buildSelector(target)

  stopElementSelection()

  // Notify popup
  chrome.runtime.sendMessage({
    type: 'ELEMENT_SELECTED',
    selector,
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      bottom: rect.bottom,
      right: rect.right,
      x: rect.x,
      y: rect.y,
    },
  })
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    stopElementSelection()
    chrome.runtime.sendMessage({ type: 'CAPTURE_ERROR', message: '요소 선택이 취소되었습니다.' })
  }
}

// ── Selector builder ──────────────────────────────────────────────────────────

function buildSelector(el: HTMLElement): string {
  if (el.id) return `#${CSS.escape(el.id)}`

  const parts: string[] = []
  let current: HTMLElement | null = el

  while (current && current !== document.body) {
    let part = current.tagName.toLowerCase()

    if (current.id) {
      part = `#${CSS.escape(current.id)}`
      parts.unshift(part)
      break
    }

    const classes = Array.from(current.classList)
      .filter((c) => !c.startsWith('__trove'))
      .slice(0, 2)
    if (classes.length) {
      part += '.' + classes.map((c) => CSS.escape(c)).join('.')
    }

    // nth-child for disambiguation
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (s) => s.tagName === current!.tagName
      )
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        part += `:nth-of-type(${index})`
      }
    }

    parts.unshift(part)
    current = current.parentElement
  }

  return parts.join(' > ')
}
