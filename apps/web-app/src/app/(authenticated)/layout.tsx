'use client';

import { useIsDesktop } from '@nova/hooks';
import { DesktopShell } from '@nova/components/layout/DesktopShell/index';
import { MobileShell, MobileLibraryHeader } from '@nova/components/layout/MobileShell/index';
import { NVSplashScreen } from '@nova/ui';
import { usePathname } from 'next/navigation';

import { LibraryProvider } from '@nova/context/LibraryContext';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const pathname = usePathname();

  // Prevent flash of content before screen size is detected
  if (isDesktop === null) {
    return <NVSplashScreen message="디자인 라이브러리 불러오는 중..." mode="syncing" />;
  }

  if (isDesktop) {
    return (
      <LibraryProvider>
        <DesktopShell>
          {children}
        </DesktopShell>
      </LibraryProvider>
    );
  }

  return (
    <LibraryProvider>
      <MobileShell showTabs={!pathname.includes('/capture')}>
        <MobileLibraryHeader />
        {children}
      </MobileShell>
    </LibraryProvider>
  );
}
