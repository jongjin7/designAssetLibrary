"use client";

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { NVButton } from '../../atoms/NVButton';
import { NVIconButton } from '../../atoms/NVIconButton';
import { useSearchFilters, SearchFilterState } from './hooks/useSearchFilters';
import { NVSearchKeywordPart } from './parts/NVSearchKeywordPart';
import { NVSearchColorPart } from './parts/NVSearchColorPart';
import { NVSearchPeriodPart } from './parts/NVSearchPeriodPart';
import { NVSearchTagPart } from './parts/NVSearchTagPart';

export interface NVSearchPanelProps {
  onApply?: (filters: SearchFilterState) => void;
  onReset?: () => void;
  className?: string;
  initialFilters?: Partial<SearchFilterState>;
}

export const NVSearchPanel: React.FC<NVSearchPanelProps> = ({
  onApply,
  onReset,
  className = '',
  initialFilters
}) => {
  const { filters, toggleColor, toggleTag, setKeyword, setPeriod, handleApply, handleReset } = useSearchFilters(initialFilters, onApply, onReset);

  return (
    <div className={cn(
      "w-full bg-slate-950/40 backdrop-blur-2xl border border-white/5 rounded-[24px] flex flex-col gap-6 p-6 shadow-2xl", 
      className
    )}>
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <h3 className="text-[15px] font-bold text-white tracking-tight">상세 옵션 검색</h3>
        <NVIconButton icon={RotateCcw} variant="ghost" size="sm" className="text-slate-500 hover:text-slate-300 !w-8 !h-8" onClick={handleReset} title="초기화" />
      </div>

      <div className="flex flex-col gap-7">
        <div className="flex flex-col gap-3.5">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Keywords</span>
          <NVSearchKeywordPart keyword={filters.keyword} setKeyword={setKeyword} />
        </div>
        
        <div className="flex flex-col gap-3.5">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Color Filter</span>
          <NVSearchColorPart colors={filters.colors} toggleColor={toggleColor} />
        </div>
        
        <div className="flex flex-col gap-3.5">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Time Period</span>
          <NVSearchPeriodPart period={filters.period} setPeriod={setPeriod} />
        </div>
        
        <div className="flex flex-col gap-3.5">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-1">Tag Filter</span>
          <NVSearchTagPart tags={filters.tags} toggleTag={toggleTag} />
        </div>
      </div>

      <div className="pt-4 border-t border-white/[0.06] mt-2 flex gap-2">
        <NVButton variant="primary" size="md" onClick={handleApply} className="w-full justify-center shadow-[0_8px_20px_-6px_rgba(99,102,241,0.5)] font-bold tracking-wide">
          <Search size={16} className="mr-2" /> 조건으로 검색하기
        </NVButton>
      </div>
    </div>
  );
};
