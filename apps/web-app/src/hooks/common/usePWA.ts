'use client';

import { useState, useEffect } from 'react';
import { getDeferredPrompt, clearDeferredPrompt, subscribePWAPrompt } from '../lib/pwaPromptStore';

const STORAGE_KEY = 'nova-pwa-installable';

export function usePWA() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isPromptReady, setIsPromptReady] = useState(false);

  useEffect(() => {
    // 이미 설치된 앱(standalone 모드)이면 즉시 종료
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const syncState = () => {
      const prompt = getDeferredPrompt();
      const ready = !!prompt;
      setIsPromptReady(ready);
      console.log('[PWA] Hook Sync: prompt=', prompt ? 'EXISTS' : 'NULL', 'ready=', ready);

      if (ready) {
        setIsInstallable(true);
        localStorage.setItem(STORAGE_KEY, 'true');
      } else if (localStorage.getItem(STORAGE_KEY) === 'true') {
        // 이미 캡처된 기록이 있으면 설치 가능 버튼은 유지
        setIsInstallable(true);
      }
    };

    syncState();
    const unsubscribe = subscribePWAPrompt(syncState);
    return () => unsubscribe();
  }, []);

  const install = async () => {
    const prompt = getDeferredPrompt();

    if (!prompt) {
      console.warn('[PWA] No install prompt available');
      return 'unavailable' as const;
    }

    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    console.log('[PWA] User choice:', outcome);

    clearDeferredPrompt();
    if (outcome === 'accepted') {
      localStorage.removeItem(STORAGE_KEY);
      setIsInstallable(false);
      setIsPromptReady(false);
      return 'installed' as const;
    } else {
      setIsPromptReady(false);
      return 'dismissed' as const;
    }
  };

  return { isInstallable, isPromptReady, install };
}
