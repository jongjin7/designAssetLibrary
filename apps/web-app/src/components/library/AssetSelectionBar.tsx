import React from 'react';
import { cn } from '../../lib/utils';
import { NVButton } from '@nova/ui';

interface AssetSelectionBarProps {
  selectedCount: number;
  onCancel: () => void;
  onMove?: () => void;
  onDelete: () => void;
  isMobile?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * AssetSelectionBar provides actions for multiple selected assets.
 */
export function AssetSelectionBar({
  selectedCount,
  onCancel,
  onMove,
  onDelete,
  isMobile = false,
  theme = 'light' // Default to light for high-end pop
}: AssetSelectionBarProps) {
  if (selectedCount === 0) return null;

  const isLight = theme === 'light';

  return (
    <div className={cn(
      "flex items-center justify-between transition-all duration-700 animate-in slide-in-from-top-4",
      "backdrop-blur-3xl border shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]",
      isLight 
        ? "bg-white/[0.08] border-white/20" 
        : "bg-black/60 border-white/10",
      isMobile 
        ? "fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50 p-2 rounded-2xl" 
        : "sticky top-4 z-40 mx-auto w-fit min-w-[400px] p-2 rounded-2xl mb-8"
    )}>

      {/* Selected Indicator */}
      <div className={cn("flex items-center gap-2", isMobile ? "px-2" : "px-4")}>
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
        <NVButton 
          variant="ghost"
          size={isMobile ? "xs" : "sm"}
          onClick={onCancel}
          className="text-slate-400 font-bold hover:text-white h-9 px-4"
        >
          취소
        </NVButton>
        
        {onMove && (
          <NVButton 
            variant="glass-neutral"
            size={isMobile ? "xs" : "sm"}
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
    </div>
  );
}
