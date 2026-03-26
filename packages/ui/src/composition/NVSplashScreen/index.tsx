import React from 'react';
import { NVLogo } from '../../atoms/NVLogo';
import { NVLoadingState, LoadingMode } from '../../atoms/NVLoadingState';
import { NVTypography } from '../../atoms/NVTypography';
import { cn } from '../../lib/utils';

interface NVSplashScreenProps {
  /** 로딩 상태 메시지 (기본: 디자인 시스템 동기화 중...) */
  message?: string;
  /** 현재 로딩 모드 */
  mode?: LoadingMode;
  /** 하단에 표시될 보조 텍스트 (기본: Sprint 1 Mobile Collector) */
  footerText?: string;
  /** 브랜드 설명 문구 */
  brandDescription?: string;
  /** 추가 스타일 클래스 */
  className?: string;
}

/**
 * 프로젝트 표준 가이드를 준수하는 스플래시 화면 컴포넌트입니다.
 * 300ms의 표준 애니메이션 타이밍과 rounded-xl 곡률 기반의 백그라운드 효과를 사용합니다.
 */
export const NVSplashScreen: React.FC<NVSplashScreenProps> = ({
  message = "디자인 시스템 동기화 중...",
  mode = "syncing",
  footerText = "Sprint 1 Mobile Collector",
  brandDescription = "Premium Design Asset Library",
  className,
}) => {
  return (
    <div className={cn(
      "bg-[#050505] flex flex-col items-center justify-center p-10 selection:bg-indigo-500/30 overflow-hidden",
      className || "fixed inset-0 z-[100]"
    )}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {/* 백그라운드 그래디언트 (표준 Glassmorphism 배경 효과) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full" />
      
      <div className="relative flex flex-col items-center opacity-0 animate-[fadeIn_300ms_ease-out_forwards]">
        {/* 통합 브랜드 로고 (표준 사이즈 lg) */}
        <div className="mb-8">
          <NVLogo size="lg" />
        </div>
        
        <div className="space-y-6 text-center max-w-[280px]">
            <div className="flex flex-col items-center space-y-4">
                <NVLoadingState mode={mode} message={message} />
                <NVTypography variant="secondary" className="text-slate-600 text-[10px] tracking-[0.2em] uppercase text-center opacity-70 leading-relaxed">
                  {brandDescription}
                </NVTypography>
            </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-20">
        <NVTypography variant="caption" className="tracking-[0.4em] italic font-bold text-slate-500">
          {footerText}
        </NVTypography>
      </div>
    </div>
  );
};
