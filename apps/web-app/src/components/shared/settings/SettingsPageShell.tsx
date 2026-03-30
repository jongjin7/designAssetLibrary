'use client';

import React from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DesktopPageHeader } from '@nova/components/layout/DesktopShell';
import { useIsDesktop } from '@nova/hooks/useIsDesktop';
import { NVIconButton } from '@nova/ui';

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
  maxWidth?: number;
}

/**
 * 설정 서브페이지의 데스크탑 / 모바일 레이아웃 분기를 처리합니다.
 * 공통화된 DesktopPageHeader 레이아웃을 최상단에 적용합니다.
 */
export const SettingsPageShell: React.FC<SettingsPageShellProps> = ({ children, maxWidth = 720 }) => {
  const isDesktop = useIsDesktop();
  const router = useRouter();

  if (isDesktop) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        {/* 공통 최상단 툴바 레이아웃 적용 */}
        <DesktopPageHeader 
          left={
            <>
              <div className="flex items-center gap-2 ml-4">
                <Settings size={14} className="text-slate-500" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest opacity-80 select-none">
                  App Settings
                </span>
              </div>
            </>
          }
          
        />
        
        {/* 스크롤 가능한 본문 영역 */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center p-6 lg:p-10 min-h-full">
            <div className="w-full" style={{ maxWidth: `${maxWidth}px` }}>
              {children(false)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children(true)}</>;
};
