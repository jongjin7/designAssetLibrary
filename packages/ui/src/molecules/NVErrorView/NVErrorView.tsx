'use client';

import React from 'react';
import { WifiOff, Home, RotateCcw, AlertCircle, LucideIcon } from 'lucide-react';
import { NVButton } from '../../atoms/NVButton';
import { NVGlassPanel } from '../../atoms/NVGlassPanel';
import { NVEmptyState } from '../../atoms/NVEmptyState';

export interface NVErrorViewProps {
  /** 에러 코드 (ex: 404, 500, Offline) */
  statusCode?: number | string;
  /** 메인 제목 */
  title: string;
  /** 상세 설명 */
  description: string;
  /** 사용할 아이콘 (Lucide Icon) */
  icon?: LucideIcon;
  /** 색상 변주 (기본색 또는 에러색 강조) */
  variant?: 'default' | 'danger' | 'warning';
  /** 데스크톱 배경에 거대 배경 코드를 노출할지 여부 */
  showBackgroundCode?: boolean;
  /** 주 액션 버튼 설정 */
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon | React.ComponentType<any>;
  };
  /** 보조 액션 버튼 설정 */
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon | React.ComponentType<any>;
  };
  /** 추가적인 상단 내용 헤더 (ex: 데스크톱 진단 바) */
  header?: React.ReactNode;
  footer?: React.ReactNode;
  fullScreen?: boolean;
}

/**
 * NOVA 디자인 시스템 통합 에러 뷰 컴포넌트.
 * 데스크톱 앱과 웹앱에서 공통으로 사용하며 일관된 프리미엄 에러 경험을 제공합니다.
 */
export const NVErrorView: React.FC<NVErrorViewProps> = ({
  statusCode,
  title,
  description,
  icon: CustomIcon,
  variant = 'default',
  showBackgroundCode = true,
  fullScreen = true,
  header,
  primaryAction,
  secondaryAction,
  footer
}) => {
  // 상태 코드나 variant에 기반해 위험 상태 인지
  const isDanger = variant === 'danger' || (typeof statusCode === 'number' && statusCode >= 500);
  const isWarning = variant === 'warning';
  
  // 기본 아이콘 결정 전략
  const Icon = CustomIcon || (statusCode === 404 ? Home : isDanger ? AlertCircle : WifiOff);

  const containerClasses = fullScreen 
    ? "min-h-screen w-full bg-[#0B0E14] text-white" 
    : "h-full w-full bg-transparent";

  return (
    <div className={`flex flex-col p-4 sm:p-6 overflow-hidden relative font-sans ${containerClasses}`}>
      {/* 상단 헤더 영역 */}
      {header && (
        <div className="absolute top-0 left-0 right-0 z-20">
          {header}
        </div>
      )}

      {/* 중앙 메인 함체 */}
      <div className="flex-1 flex flex-col items-center justify-center">
      {/* 배경 장식 (Glow) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full -z-10 animate-pulse-slow ${
        isDanger ? 'bg-rose-500/5' : isWarning ? 'bg-amber-500/5' : 'bg-indigo-500/5'
      }`} />
      
      {/* 배경 상태 코드 (데스크톱 전용 시각적 효과) */}
      {showBackgroundCode && statusCode && (
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none overflow-hidden hidden sm:flex">
          <span className="text-[min(420px,25vw)] font-black tracking-tighter translate-y-10">
            {statusCode}
          </span>
        </div>
      )}

      <div className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-1000">
        <NVGlassPanel variant="modal" className="p-6 sm:p-10 border-white/5 bg-slate-950/40 backdrop-blur-3xl shadow-2xl overflow-hidden group">
          {/* 상단 액센트 라인 */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent ${
            isDanger ? 'via-rose-500/50' : isWarning ? 'via-amber-500/50' : 'via-indigo-500/50'
          } to-transparent`} />

          <NVEmptyState
            icon={
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border shadow-inner transition-colors duration-500 ${
                isDanger ? 'bg-rose-500/10 border-rose-500/20' : isWarning ? 'bg-amber-500/10 border-amber-500/20' : 'bg-indigo-500/10 border-indigo-500/20'
              }`}>
                {/* @ts-ignore icon rendering */}
                <Icon className={`w-10 h-10 ${
                  isDanger ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-indigo-400'
                } opacity-60`} strokeWidth={1.5} />
              </div>
            }
            title={title}
            description={description}
            action={
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center mt-6">
                {primaryAction && (
                  <NVButton 
                    variant="primary" 
                    size="xl" 
                    onClick={primaryAction.onClick}
                    className={`w-full sm:w-auto min-w-[160px]`}
                  >
                    {primaryAction.icon && React.createElement(primaryAction.icon as any, { className: "w-4 h-4" })}
                    {primaryAction.label}
                  </NVButton>
                )}
                
                {secondaryAction && (
                  <NVButton 
                    variant="secondary" 
                    size="xl" 
                    onClick={secondaryAction.onClick}
                    className="w-full sm:w-auto min-w-[160px]"
                  >
                    {secondaryAction.icon && React.createElement(secondaryAction.icon as any, { className: "w-4 h-4" })}
                    {secondaryAction.label}
                  </NVButton>
                )}
              </div>
            }
          />
        </NVGlassPanel>
        
        {footer}
      </div>
    </div>
    </div>
  );
};
