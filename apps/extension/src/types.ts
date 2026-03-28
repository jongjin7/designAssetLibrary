export type CaptureMode = 'visible' | 'fullpage' | 'element'

export type AppStatus =
  | 'idle'
  | 'capturing'
  | 'captured'
  | 'selecting'
  | 'saving'
  | 'saved'
  | 'error'

export interface CaptureResult {
  dataUrl: string
  width: number
  height: number
  capturedAt: number
}

export interface StoredCapture extends CaptureResult {
  id: string
  mode: CaptureMode
  pageUrl: string
  pageTitle: string
}

// Message types between popup / content / background
export type ExtMessage =
  | { type: 'CAPTURE_VISIBLE_AREA' }
  | { type: 'CAPTURE_FULL_PAGE' }
  | { type: 'CAPTURE_ELEMENT_START' }
  | { type: 'CAPTURE_ELEMENT_CANCEL' }
  | { type: 'CAPTURE_RESULT'; dataUrl: string; width: number; height: number }
  | { type: 'ELEMENT_SELECTED'; selector: string; rect: DOMRect }
  | { type: 'CAPTURE_ERROR'; message: string }
