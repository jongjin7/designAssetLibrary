"use client";

import React from 'react';
import { X, Search, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { NVField } from '../../atoms/NVField';
import { NVButton } from '../../atoms/NVButton';
import { NVGlassPanel } from '../../atoms/NVGlassPanel';
import { useSearchFilters, SearchFilterState } from './hooks/useSearchFilters';
import { NVSearchKeywordPart } from './parts/NVSearchKeywordPart';
import { NVSearchColorPart } from './parts/NVSearchColorPart';
import { NVSearchPeriodPart } from './parts/NVSearchPeriodPart';
import { NVSearchTagPart } from './parts/NVSearchTagPart';

export interface NVDesktopSearchPanelProps {
  onSearch?: (filters: SearchFilterState) => void;
  onClose?: () => void;
  layout?: 'basic' | 'desktop';
}

export const NVDesktopSearchPanel: React.FC<NVDesktopSearchPanelProps> = ({ 
  onSearch, 
  onClose,
  layout = 'desktop'
}) => {
  const isDesktop = layout === 'desktop';
  const { filters, toggleColor, toggleTag, setKeyword, setPeriod, handleApply, handleReset } = useSearchFilters({}, onSearch, onClose);

  return (
    <NVGlassPanel 
      variant="modal" 
      blur="xl" 
      noPadding
      className={cn(
        "relative overflow-hidden border-white/10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.5)]",
        isDesktop ? "w-[780px] rounded-[32px] p-0" : "w-full max-w-[420px] rounded-3xl p-6"
      )}
    >
      {!isDesktop && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">상세 옵션 검색</h3>
          {onClose && (
            <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      )}

      <div className={cn("flex", isDesktop ? "flex-row" : "flex-col gap-8")}>
        {/* Left Side: Main Form Fields */}
        <div className={cn("flex-1", isDesktop ? "p-10 pr-6 border-r border-white/5" : "")}>
          <div className="space-y-8">
            <NVField label="에셋 검색" size="sm" row={isDesktop} labelWidth={isDesktop ? "120px" : undefined}>
              <NVSearchKeywordPart keyword={filters.keyword} setKeyword={setKeyword} isDesktop={isDesktop} />
            </NVField>

            <NVField label="색상 팔레트" size="sm" row={isDesktop} labelWidth={isDesktop ? "120px" : undefined}>
               <NVSearchColorPart colors={filters.colors} toggleColor={toggleColor} isDesktop={isDesktop} />
            </NVField>
            
            <NVField label="기간 설정" size="sm" row={isDesktop} labelWidth={isDesktop ? "120px" : undefined}>
               <NVSearchPeriodPart period={filters.period} setPeriod={setPeriod} isDesktop={isDesktop} />
            </NVField>

            <NVField label="태그 필터" size="sm" row={isDesktop} labelWidth={isDesktop ? "120px" : undefined}>
               <NVSearchTagPart tags={filters.tags} toggleTag={toggleTag} isDesktop={isDesktop} />
            </NVField>
          </div>
        </div>

        {/* Right Side / Sidebar: Actions & Summaries */}
        <div className={cn(isDesktop ? "w-[240px] bg-slate-950/30 p-10 flex flex-col justify-between" : "flex flex-col gap-4")}>
          <div className="space-y-6">
            {isDesktop && (
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Selected Items</p>
                <p className="text-sm font-medium text-slate-200">
                  {filters.colors.length + filters.tags.length + (filters.period ? 1 : 0) + (filters.keyword ? 1 : 0)}개의 조건 선택됨
                </p>
              </div>
            )}
            
            <div className="space-y-3">
              <NVButton variant="primary" className="w-full justify-center shadow-lg shadow-indigo-500/10" onClick={handleApply}>
                <Search size={18} className="mr-2" /> 상세 조건으로 검색
              </NVButton>
              <NVButton variant="secondary" className="w-full justify-center border-none hover:bg-white/5" onClick={handleReset}>
                <RotateCcw size={14} className="mr-2" /> 초기화
              </NVButton>
            </div>
          </div>

          {isDesktop && onClose && (
            <button onClick={onClose} className="text-[11px] font-bold text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest text-center py-2">
              ESC 닫기
            </button>
          )}
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 blur-[80px] pointer-events-none -z-10" />
    </NVGlassPanel>
  );
};
