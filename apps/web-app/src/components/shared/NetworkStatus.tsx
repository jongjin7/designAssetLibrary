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
    <div className="network-status">
      <WifiOff size={14} />
      <span>오프라인 모드: 로컬에만 저장됩니다</span>
    </div>
  );
}
