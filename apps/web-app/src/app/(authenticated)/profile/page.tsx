'use client';

import { SettingsContent } from '@nova/components/shared/settings/SettingsContent';
import { useIsDesktop } from '@nova/hooks/useIsDesktop';

import { useAuth } from '@nova/providers/AuthProvider';

export default function ProfileSettingsPage() {
  const isDesktop = useIsDesktop();
  const { signOut } = useAuth();

  // 공통 설정 화면
  const content = <SettingsContent isMobile={!isDesktop} onLogout={signOut} />;

  if (isDesktop) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 overflow-y-auto">
        <div className="flex justify-center p-6 lg:p-10 min-h-full">
          <div className="w-full max-w-[1200px]">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {content}
    </>
  );
}

