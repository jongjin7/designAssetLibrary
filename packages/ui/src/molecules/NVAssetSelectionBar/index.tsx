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
      noPadding
      blur="xl"
      className={cn(
        "flex items-center justify-between transition-all duration-700 animate-in slide-in-from-top-4",
        "p-2 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]",
        className
      )}
    >

      {/* Selected Indicator */}
      <div className="flex items-center gap-2 px-2">
        <div className="relative flex items-center justify-center h-5 w-5 mr-1">
          <div className="absolute inset-0 bg-indigo-500 blur-[8px] opacity-40 rounded-full animate-pulse" />
          <span className="relative text-[10px] font-black text-white/90">
            {selectedCount}
          </span>
        </div>
        <span className={cn(
          "font-bold tracking-tight",
          isLight ? "text-white" : "text-slate-300",
          isMobile ? "text-[11px]" : "text-xs"
        )}>
          개의 항목 선택됨
        </span>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-2 ml-6">
        <button 
          onClick={onCancel}
          className="text-slate-400 font-bold hover:text-white transition-colors h-9 px-4 text-xs"
        >
          취소
        </button>
        
        {onMove && (
          <NVButton 
            variant="glass-neutral"
            size={isMobile ? "xs" : "sm"}
            onClick={onMove}
            className="font-bold h-9"
          >
            이동
          </NVButton>
        )}
        
        <NVButton 
          variant="glass-danger"
          size={isMobile ? "xs" : "sm"}
          onClick={onDelete}
          className="font-bold h-9"
        >
          {isMobile ? '삭제' : '항목 삭제'}
        </NVButton>
      </div>
    </NVGlassPanel>
  );
}
