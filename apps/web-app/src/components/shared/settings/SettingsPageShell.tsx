'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DesktopShell } from '@nova/components/layout/DesktopShell/index';
import { MobileShell } from '@nova/components/layout/MobileShell';
import { useIsDesktop } from '@nova/hooks/useIsDesktop';

// ─── 페이지 헤더 ─────────────────────────────────────────────────────────────

interface SettingsPageHeaderProps {
  title: string;
  subtitle?: string;
  isMobile?: boolean;
  onBack?: () => void;
}

export const SettingsPageHeader: React.FC<SettingsPageHeaderProps> = ({
  title,
  subtitle,
  isMobile = false,
  onBack,
}) => {
  const router = useRouter();

  return (
    <header className={`flex items-center gap-3 ${isMobile ? 'px-5 pt-2 pb-6' : 'mb-10'}`}>
      <button
        onClick={onBack ?? (() => router.back())}
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.10] transition-all flex-shrink-0"
        aria-label="뒤로 가기"
      >
        <ArrowLeft size={18} />
      </button>
      <div>
        <h1
          className={`${isMobile ? 'text-2xl' : 'text-[28px]'} font-extrabold text-white tracking-tight leading-none`}
        >
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
    </header>
  );
};

// ─── 페이지 래퍼 ─────────────────────────────────────────────────────────────

interface SettingsPageShellProps {
  children: (isMobile: boolean) => React.ReactNode;
}

/**
 * 설정 서브페이지의 데스크탑 / 모바일 레이아웃 분기를 처리합니다.
 * children은 isMobile을 받는 render prop 형태로 전달합니다.
 */
export const SettingsPageShell: React.FC<SettingsPageShellProps> = ({ children }) => {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <DesktopShell>
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 overflow-y-auto">
          <div className="flex justify-center p-6 lg:p-10 min-h-full">
            <div className="w-full max-w-[720px]">
              {children(false)}
            </div>
          </div>
        </div>
      </DesktopShell>
    );
  }

  return <MobileShell>{children(true)}</MobileShell>;
};
