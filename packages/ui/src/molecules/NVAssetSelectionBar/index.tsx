import React from 'react';
import { cn } from '../../lib/utils';
import { NVButton } from '../../atoms/NVButton';
import { NVGlassPanel } from '../../atoms/NVGlassPanel';

interface NVAssetSelectionBarProps {
  /** 선택된 에셋의 총 개수 */
  selectedCount: number;
  /** 선택 취소(해제) 시 호출되는 콜백 */
  onCancel: () => void;
  /** 선택된 에셋들을 이동할 때 호출되는 콜백 */
  onMove?: () => void;
  /** 선택된 에셋들을 삭제할 때 호출되는 콜백 */
  onDelete: () => void;
  /** 모바일 환경 레이아웃 여부 (true일 경우 컴팩트하게 조절됨) */
  isMobile?: boolean;
  /** 컴포넌트의 전체적인 크기 (sm, md, lg) */
  size?: 'sm' | 'md' | 'lg';
  /** 테마 (기본: 'light') */
  theme?: 'light' | 'dark';
  /** 추가 스타일 클래스 */
  className?: string;
}

/**
 * 다수의 에셋을 선택했을 때 나타나는 일괄 관리 도구 바입니다.
 * 브랜드 아이덴티티가 강조된 배지와 테마/사이즈별 최적화된 시각적 구성을 제공합니다.
 */
export function NVAssetSelectionBar({
  selectedCount,
  onCancel,
  onMove,
  onDelete,
  isMobile = false,
  size,
  theme = 'light',
  className = ''
}: NVAssetSelectionBarProps) {
  if (selectedCount === 0) return null;

  const isDark = theme === 'dark';
  
  // size prop이 없으면 isMobile 여부에 따라 기본값 결정
  const effectiveSize = size || (isMobile ? 'sm' : 'md');

  // 사이즈별 스타일 맵
  const sizeStyles = {
    sm: {
      panel: "!p-2 rounded-2xl",
      badge: "w-5 h-5 text-xs",
      text: "text-[13px] gap-1.5",
      buttons: "sm" as const,
      containerGap: "gap-1.5",
      width: isMobile ? "w-[calc(100%-40px)]" : "w-[340px]"
    },
    md: {
      panel: "!p-2.5 rounded-[22px]",
      badge: "w-[22px] h-[22px] text-sm",
      text: "text-sm gap-2",
      buttons: "sm" as const,
      containerGap: "gap-2",
      width: isMobile ? "w-[calc(100%-32px)]" : "w-[390px]"
    },
    lg: {
      panel: "!p-3 rounded-[28px]",
      badge: "w-7 h-7 text-base",
      text: "text-base gap-3",
      buttons: "md" as const,
      containerGap: "gap-3",
      width: isMobile ? "w-[calc(100%-24px)]" : "w-[440px]"
    }
  };

  const currentStyle = sizeStyles[effectiveSize];

  return (
    <NVGlassPanel
      theme={theme}
      blur="xl"
      className={cn(
        "flex items-center justify-between transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 border-white/10",
        currentStyle.panel,
        currentStyle.width,
        className
      )}
    >
      {/* Selected Indicator Section: Organic Information Unit */}
      <div className={cn("flex items-center shrink-0 font-medium tracking-tight pl-0.5", currentStyle.text)}>
        <span className={cn(
          "relative rounded-full flex items-center justify-center font-semibold tracking-tighter bg-indigo-500 text-white transition-all duration-300",
          currentStyle.badge,
          isDark && "shadow-[0_0_12px_rgba(99,102,241,0.4)]"
        )}>
          {selectedCount}
        </span>
        <span className={cn(
          "transition-colors duration-300",
          isDark ? "text-slate-200" : "text-slate-600"
        )}>
          선택한 항목
        </span>
      </div>
      
      {/* Action Buttons Section */}
      <div className={cn("flex shrink-0 items-center ml-auto", currentStyle.containerGap)}>
        <NVButton 
          variant="ghost"
          size={currentStyle.buttons}
          onClick={onCancel}
          className={cn(
            "transition-colors duration-200",
            isDark ? "text-slate-200 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-800"
          )}
        >
          취소
        </NVButton>
        
        {onMove && (
          <NVButton 
            variant={isDark ? "neutral" : "secondary"}
            size={currentStyle.buttons}
            onClick={onMove}
          >
            이동
          </NVButton>
        )}
        
        <NVButton 
          variant={isDark ? "glass-danger" : "danger"}
          size={currentStyle.buttons}
          onClick={onDelete}
        >
          삭제
        </NVButton>
      </div>
    </NVGlassPanel>
  );
}
