import React, { useState, useCallback } from 'react'
import type { CaptureMode, AppStatus, CaptureResult, StoredCapture } from '../types'

// ─── Styles ──────────────────────────────────────────────────────────────────

const S = {
  root: {
    width: 300,
    minHeight: 380,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 13,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    padding: '14px 16px 12px',
    borderBottom: '1px solid #e8e8e8',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  logoMark: {
    width: 24,
    height: 24,
    borderRadius: 6,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  logoText: {
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: '-0.3px',
    color: '#111',
  },
  logoSub: {
    fontSize: 11,
    color: '#888',
    marginLeft: 'auto',
  },
  body: {
    padding: '14px 16px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: 6,
  },
  tabGroup: {
    display: 'flex',
    gap: 4,
    background: '#f4f4f5',
    borderRadius: 8,
    padding: 3,
  },
  tab: (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '5px 4px',
    fontSize: 11,
    fontWeight: active ? 600 : 500,
    color: active ? '#6366f1' : '#555',
    background: active ? '#ffffff' : 'transparent',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.15s',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
    whiteSpace: 'nowrap' as const,
  }),
  captureBtn: (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '9px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
    background: disabled
      ? '#c4b5fd'
      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'opacity 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  }),
  preview: {
    border: '1px solid #e8e8e8',
    borderRadius: 8,
    overflow: 'hidden',
    background: '#f9f9fb',
    position: 'relative' as const,
  },
  previewImg: {
    width: '100%',
    display: 'block',
    maxHeight: 140,
    objectFit: 'cover' as const,
    objectPosition: 'top',
  },
  previewMeta: {
    padding: '6px 10px',
    fontSize: 11,
    color: '#888',
    borderTop: '1px solid #e8e8e8',
    display: 'flex',
    justifyContent: 'space-between',
  },
  saveBtn: (disabled: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    color: disabled ? '#aaa' : '#6366f1',
    background: disabled ? '#f4f4f5' : '#ede9fe',
    border: 'none',
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s',
  }),
  statusBar: (type: 'info' | 'success' | 'error'): React.CSSProperties => ({
    padding: '7px 12px',
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 500,
    color: type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#6366f1',
    background:
      type === 'error' ? '#fef2f2' : type === 'success' ? '#f0fdf4' : '#eef2ff',
    textAlign: 'center' as const,
  }),
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.src = dataUrl
  })
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState<CaptureMode>('visible')
  const [status, setStatus] = useState<AppStatus>('idle')
  const [capture, setCapture] = useState<CaptureResult | null>(null)
  const [statusMsg, setStatusMsg] = useState('')

  const isBusy = status === 'capturing' || status === 'saving' || status === 'selecting'

  // ── Message listener for responses from background/content ─────────────────
  React.useEffect(() => {
    function handleMessage(msg: Record<string, unknown>) {
      if (msg.type === 'CAPTURE_RESULT') {
        const dataUrl = msg.dataUrl as string
        const width = msg.width as number
        const height = msg.height as number
        setCapture({ dataUrl, width, height, capturedAt: Date.now() })
        setStatus('captured')
        setStatusMsg('캡처 완료')
      } else if (msg.type === 'CAPTURE_ERROR') {
        setStatus('error')
        setStatusMsg((msg.message as string) || '캡처 중 오류가 발생했습니다.')
      } else if (msg.type === 'ELEMENT_SELECTED') {
        // Element selected — now ask background to capture visible area
        // (element region is cropped client-side after capture)
        chrome.runtime.sendMessage({ type: 'CAPTURE_VISIBLE_AREA' })
        setStatusMsg('요소 캡처 중...')
      }
    }
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [])

  // ── Capture ────────────────────────────────────────────────────────────────
  const handleCapture = useCallback(async () => {
    setCapture(null)
    setStatus('capturing')
    setStatusMsg('캡처 중...')

    try {
      if (mode === 'element') {
        // Inject content script interaction
        setStatus('selecting')
        setStatusMsg('캡처할 요소를 클릭하세요. (ESC 취소)')
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        if (!tab.id) throw new Error('활성 탭을 찾을 수 없습니다.')
        await chrome.tabs.sendMessage(tab.id, { type: 'CAPTURE_ELEMENT_START' })
        // Result arrives via onMessage listener above
      } else {
        // Visible or full page → delegate to background
        const msgType =
          mode === 'visible' ? 'CAPTURE_VISIBLE_AREA' : 'CAPTURE_FULL_PAGE'
        chrome.runtime.sendMessage({ type: msgType })
      }
    } catch (err) {
      setStatus('error')
      setStatusMsg(err instanceof Error ? err.message : '캡처 실패')
    }
  }, [mode])

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!capture) return
    setStatus('saving')
    setStatusMsg('저장 중...')

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      const dims = await getImageDimensions(capture.dataUrl)

      const stored: StoredCapture = {
        id: `capture_${Date.now()}`,
        mode,
        dataUrl: capture.dataUrl,
        width: dims.width,
        height: dims.height,
        capturedAt: capture.capturedAt,
        pageUrl: tab.url ?? '',
        pageTitle: tab.title ?? '',
      }

      // Load existing captures, append, persist
      const existing = await chrome.storage.local.get('captures')
      const list: StoredCapture[] = Array.isArray(existing.captures) ? existing.captures : []
      list.unshift(stored)
      // Keep latest 50
      if (list.length > 50) list.length = 50
      await chrome.storage.local.set({ captures: list })

      setStatus('saved')
      setStatusMsg('저장 완료!')
    } catch (err) {
      setStatus('error')
      setStatusMsg(err instanceof Error ? err.message : '저장 실패')
    }
  }, [capture, mode])

  // ── Status message type ────────────────────────────────────────────────────
  const msgType =
    status === 'error' ? 'error' : status === 'saved' ? 'success' : 'info'

  return (
    <div style={S.root}>
      {/* Header */}
      <header style={S.header}>
        <div style={S.logoMark}>T</div>
        <span style={S.logoText}>Trove</span>
        <span style={S.logoSub}>Capture</span>
      </header>

      <div style={S.body}>
        {/* Mode selector */}
        <div>
          <div style={S.label}>캡처 모드</div>
          <div style={S.tabGroup}>
            {(['visible', 'fullpage', 'element'] as CaptureMode[]).map((m) => (
              <button
                key={m}
                style={S.tab(mode === m)}
                onClick={() => setMode(m)}
                disabled={isBusy}
              >
                {m === 'visible' ? 'Visible' : m === 'fullpage' ? 'Full Page' : 'Element'}
              </button>
            ))}
          </div>
        </div>

        {/* Capture button */}
        <button style={S.captureBtn(isBusy)} onClick={handleCapture} disabled={isBusy}>
          {status === 'capturing' || status === 'selecting' ? (
            <>
              <Spinner />
              {status === 'selecting' ? '요소 선택 중...' : '캡처 중...'}
            </>
          ) : (
            <>
              <CameraIcon />
              캡처하기
            </>
          )}
        </button>

        {/* Status message */}
        {statusMsg && <div style={S.statusBar(msgType)}>{statusMsg}</div>}

        {/* Preview */}
        {capture && (
          <div>
            <div style={S.label}>미리보기</div>
            <div style={S.preview}>
              <img src={capture.dataUrl} alt="capture preview" style={S.previewImg} />
              <div style={S.previewMeta}>
                <span>
                  {capture.width} × {capture.height}
                </span>
                <span>{new Date(capture.capturedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Save button */}
        {capture && (
          <button
            style={S.saveBtn(isBusy || status === 'saved')}
            onClick={handleSave}
            disabled={isBusy || status === 'saved'}
          >
            {status === 'saved' ? '✓ 저장됨' : '라이브러리에 저장'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Micro icons (inline SVG, no external dep) ───────────────────────────────

function CameraIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
