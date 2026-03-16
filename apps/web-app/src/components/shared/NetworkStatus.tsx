'use client';

import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';

export function NetworkStatus() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-[env(safe-area-inset-top,0)] left-0 right-0 h-7 bg-amber-500/90 backdrop-blur-md text-slate-950 flex items-center justify-center gap-1.5 text-[11px] font-bold z-[2000] animate-in slide-in-from-top duration-300">
      <WifiOff size={14} />
      <span>오프라인 모드: 로컬에만 저장됩니다</span>
    </div>
  );
}

