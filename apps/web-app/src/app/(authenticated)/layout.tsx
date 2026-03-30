'use client';

import { useIsDesktop } from '@nova/hooks/useIsDesktop';
import { DesktopShell } from '@nova/components/layout/DesktopShell/index';
import { MobileShell } from '@nova/components/layout/MobileShell';
import { NVSplashScreen } from '@nova/ui';
import { usePathname } from 'next/navigation';

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();
  const pathname = usePathname();

  // Prevent flash of content before screen size is detected
  if (isDesktop === null) {
    return <NVSplashScreen message="디자인 라이브러리 불러오는 중..." mode="syncing" />;
  }

  if (isDesktop) {
    return (
      <DesktopShell>
        {children}
      </DesktopShell>
    );
  }

  return (
    <MobileShell showTabs={!pathname.includes('/capture')}>
      {children}
    </MobileShell>
  );
}
