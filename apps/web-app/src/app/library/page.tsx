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
      <div className="desktop-shell">
        <DashboardView />
      </div>
    );
  }

  return (
    <div className="mobile-shell">
      <NetworkStatus />
      <div className="mobile-shell__content">
        <MobileLibraryView />
      </div>
      <BottomTabs />
    </div>
  );
}
