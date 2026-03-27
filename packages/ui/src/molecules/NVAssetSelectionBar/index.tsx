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
  /** 모바일 환경 레이아웃 여부 */
  isMobile?: boolean;
  /** 테마 테마 (기본: 'light') */
  theme?: 'light' | 'dark';
  /** 추가 스타일 클래스 */
  className?: string;
}

/**
 * 다수의 에셋을 선택했을 때 나타나는 일괄 관리 도구 바입니다.
 * 브랜드 아이덴티티가 강조된 배지와 테마별 최적화된 명도 대비를 제공합니다.
 */
export function NVAssetSelectionBar({
  selectedCount,
  onCancel,
  onMove,
  onDelete,
  isMobile = false,
  theme = 'light',
  className = ''
}: NVAssetSelectionBarProps) {
  if (selectedCount === 0) return null;

  const isDark = theme === 'dark';

  return (
    <NVGlassPanel
      theme={theme}
      blur="xl"
      className={cn(
        "flex items-center justify-between transition-all duration-500 animate-in fade-in slide-in-from-bottom-2 border-white/10",
        isMobile ? "w-[calc(100%-40px)] rounded-2xl !p-2" : "!p-3 w-[380px] rounded-3xl",
        className
      )}
    >
      {/* Selected Indicator Section: Organic Information Unit */}
      <div className="flex items-center gap-2 pl-2.5 shrink-0">
        <span className={cn(
          "relative rounded-full flex items-center justify-center w-[22px] h-[22px] text-[10px] font-black tracking-tighter bg-indigo-500 text-white transition-all duration-300",
          isDark && "shadow-[0_0_12px_rgba(99,102,241,0.4)]"
        )}>
          {selectedCount}
        </span>
        <span className={cn(
          "tracking-tight text-sm font-medium transition-colors duration-300",
          isDark ? "text-slate-300" : "text-slate-600"
        )}>
          선택한 항목
        </span>
      </div>
      
      {/* Action Buttons Section */}
      <div className="flex shrink-0 items-center gap-2 ml-auto pr-1">
        <NVButton 
          variant="ghost"
          size={isMobile ? "sm" : "md"}
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
            size={isMobile ? "sm" : "md"}
            onClick={onMove}
          >
            이동
          </NVButton>
        )}
        
        <NVButton 
          variant={isDark ? "glass-danger" : "danger"}
          size={isMobile ? "sm" : "md"}
          onClick={onDelete}
        >
          삭제
        </NVButton>
      </div>
    </NVGlassPanel>
  );
}
