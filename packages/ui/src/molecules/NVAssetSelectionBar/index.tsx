import React from 'react';
import { cn } from '../../lib/utils';
import { NVButton } from '../../atoms/NVButton';
import { NVGlassPanel } from '../../atoms/NVGlassPanel';

interface NVAssetSelectionBarProps {
  selectedCount: number;
  onCancel: () => void;
  onMove?: () => void;
  onDelete: () => void;
  isMobile?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

/**
 * NVAssetSelectionBar provides actions for multiple selected assets.
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

  const isLight = theme === 'light';

  return (
    <NVGlassPanel
      theme={theme}
      className={cn(
        "w-[340px] flex items-center justify-between transition-all duration-700 animate-in slide-in-from-top-4 !p-2",
        className
      )}
    >
      {/* Selected Indicator */}
      <div className="flex items-center gap-0.5 shrink-0 ">
        <span className="relative rounded-full flex items-center justify-center bg-white/20 w-6 h-6 tracking-tight font-semibold">
          {selectedCount}
        </span>
        <span className="tracking-tight text-sm text-slate-600 text-semibold">
          개 항목 선택
        </span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex shrink-0 items-center gap-1 ml-6">
        <NVButton 
          variant='ghost'
          size="sm"
          onClick={onCancel}
        >
          취소
        </NVButton>
        
        {onMove && (
          <NVButton 
            variant="glass"
            size="sm"
            onClick={onMove}
          >
            이동
          </NVButton>
        )}
        
        <NVButton 
          variant="danger"
          size="sm"
          onClick={onDelete}
        >
          {isMobile ? '삭제' : '항목 삭제'}
        </NVButton>
      </div>
    </NVGlassPanel>
  );
}
