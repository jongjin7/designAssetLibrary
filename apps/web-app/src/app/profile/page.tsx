'use client';

import { SettingsContent } from '../../components/shared/profile/SettingsContent';
import { BottomTabs } from '../../components/layout/BottomTabs';
import { NetworkStatus } from '../../components/shared/NetworkStatus';
import { DesktopShell } from '../../components/layout/DesktopShell';
import { useEffect, useState } from 'react';

export default function UnifiedProfilePage() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // 공통 설정 화면
  const content = <SettingsContent isMobile={!isDesktop} onLogout={() => console.log('Logout')} />;

  if (isDesktop) {
    // 데스크탑 레이아웃 쉘 (사이드바 포함)
    return (
      <DesktopShell>
        <div className="desktop-dashboard__content settings-view-scroll">
          <div className="settings-container-outer">
            <div className="settings-container-inner">
              {content}
            </div>
          </div>
        </div>
      </DesktopShell>
    );
  }

  // 모바일 레이아웃 쉘 (default)
  return (
    <div className="mobile-shell">
      <NetworkStatus />
      <main className="mobile-shell__content" style={{ flex: 1, overflowY: 'auto' }}>
        {content}
      </main>
      <BottomTabs />
    </div>
  );
}
