'use client';

import { SettingsContent } from '../../components/shared/settings/SettingsContent';
import { DesktopShell } from '../../components/layout/DesktopShell';
import { MobileShell } from '../../components/layout/MobileShell';
import { useIsDesktop } from '../../hooks/useIsDesktop';

export default function ProfileSettingsPage() {

  const isDesktop = useIsDesktop();


  // 공통 설정 화면
  const content = <SettingsContent isMobile={!isDesktop} onLogout={() => console.log('Logout')} />;

  if (isDesktop) {
    // 데스크탑 레이아웃 쉘 (사이드바 포함)
    return (
      <DesktopShell>
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 overflow-y-auto">
          <div className="flex justify-center p-6 lg:p-10 min-h-full">
            <div className="w-full max-w-[1200px]">
              {content}
            </div>
          </div>
        </div>
      </DesktopShell>
    );
  }

  // 모바일 레이아웃 쉘 (default)
  return (
    <MobileShell>
      {content}
    </MobileShell>
  );
}

