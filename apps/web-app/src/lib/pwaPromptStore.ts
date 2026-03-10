'use client';

// window.__pwaPrompt는 layout.tsx의 인라인 스크립트에서 번들 로드 전에 캡처됨
// 이 모듈은 그 값을 React 훅에서 사용할 수 있도록 브릿지 역할을 함

export function subscribePWAPrompt(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('pwa-prompt-ready', callback);
  return () => window.removeEventListener('pwa-prompt-ready', callback);
}

export function getDeferredPrompt(): any {
  if (typeof window === 'undefined') return null;
  return (window as any).__pwaPrompt ?? null;
}

export function clearDeferredPrompt() {
  if (typeof window === 'undefined') return;
  (window as any).__pwaPrompt = null;
  window.dispatchEvent(new Event('pwa-prompt-ready'));
}
