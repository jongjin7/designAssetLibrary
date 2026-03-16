'use client';

import { useEffect, useState } from 'react';
import DashboardView from '../(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '../(mobile)/library/MobileLibraryView';
import { NetworkStatus } from '../../components/shared/NetworkStatus';
import { BottomTabs } from '../../components/layout/BottomTabs';

export default function UnifiedLibraryPage() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  if (isDesktop === null) return null;

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <DashboardView />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] max-w-[760px] mx-auto relative has-[.capture-screen]:pb-0">
      <NetworkStatus />
      <div className="flex-1 overflow-y-auto pb-[calc(72px+env(safe-area-inset-bottom,0px))] has-[.capture-screen]:pb-0 has-[.network-status]:pt-[calc(var(--safe-area-top,0px)+28px)]">
        <MobileLibraryView />
      </div>
      <div className="has-[.capture-screen]:hidden">
        <BottomTabs />
      </div>
    </div>
  );
}
