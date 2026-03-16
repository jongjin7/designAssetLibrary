'use client';

import { useEffect, useState } from 'react';
import DashboardView from '../(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '../(mobile)/library/MobileLibraryView';
import { MobileShell } from '../../components/layout/MobileShell';
import { usePathname } from 'next/navigation';

export default function UnifiedLibraryPage() {
  const pathname = usePathname();
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
    <MobileShell 
      showTabs={!pathname.includes('/capture')}
    >
      <MobileLibraryView />
    </MobileShell>
  );
}
