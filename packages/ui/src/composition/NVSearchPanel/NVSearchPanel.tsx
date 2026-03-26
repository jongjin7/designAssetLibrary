"use client";

import React from 'react';
import { X, Search, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { NVField } from '../../atoms/NVField';
import { NVButton } from '../../atoms/NVButton';
import { NVIconButton } from '../../atoms/NVIconButton';
import { NVGlassPanel } from '../../atoms/NVGlassPanel';
import { useSearchFilters, SearchFilterState } from './hooks/useSearchFilters';
import { NVSearchKeywordPart } from './parts/NVSearchKeywordPart';
import { NVSearchColorPart } from './parts/NVSearchColorPart';
import { NVSearchPeriodPart } from './parts/NVSearchPeriodPart';
import { NVSearchTagPart } from './parts/NVSearchTagPart';
import { NVPopoverHeader } from '../../atoms/NVPopover';

export interface NVSearchPanelProps {
  /** 검색 적용 시 호출되는 콜백 */
  onSearch?: (filters: SearchFilterState) => void;
  /** 검색 적용 시 호출되는 콜백 (onSearch의 별칭) */
  onApply?: (filters: SearchFilterState) => void;
  /** 닫기 버튼 클릭 시 호출되는 콜백 */
  onClose?: () => void;
  /** 검색 레이아웃 스타일 */
  layout?: 'basic' | 'desktop';
  /** 초기 필터 상태 */
  initialFilters?: Partial<SearchFilterState>;
  /** 추가 클래스 */
  className?: string;
  /** 초기화 시 호출되는 콜백 */
  onReset?: () => void;
}

export const NVSearchPanel: React.FC<NVSearchPanelProps> = ({ 
  onSearch, 
  onApply,
  onClose,
  onReset,
  layout = 'basic',
  initialFilters,
  className
}) => {
  const isDesktop = layout === 'desktop';
  
  const { filters, toggleColor, toggleTag, setKeyword, setPeriod, handleApply, handleReset } = useSearchFilters(initialFilters || {}, onSearch || onApply, onReset);

  return (
    <NVGlassPanel 
      variant="modal" 
      blur="xl" 
      noPadding
      className={cn(
        "relative overflow-scroll scrollbar-hide border-white/10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.5)] transition-all duration-300",
        isDesktop ? "w-[680px] rounded-[32px] p-0" : "w-full rounded-3xl p-5",
        className
      )}
    >
      {/* Title Header (Mobile/Basic) */}
      {/* {(!isDesktop && !isPopover) && (
        <div className="z-1 flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white tracking-tight leading-none">상세 옵션 검색</h3>
          {onClose && (
            <NVIconButton 
              icon={X} 
              variant="ghost" 
              size="sm"
              iconSize={16}
              onClick={onClose} 
              className="-mr-1 text-slate-500 hover:text-white"
            />
          )}
        </div>
      )} */}

      {isDesktop && (
        <NVPopoverHeader>
          <div className="relative flex items-center justify-between">
            <h3 className="leading-none text-sm font-bold text-slate-300 uppercase tracking-widest">상세 검색</h3>
            <NVIconButton 
              icon={X} 
              variant="ghost" 
              size="sm"
              iconSize={16}
              onClick={onClose} 
              className="absolute -right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              />
          </div>
        </NVPopoverHeader>)
      }



      <div className={cn("flex", isDesktop ? "flex-row" : "flex-col")}>
        {/* Main Content Area */}
        <div className={cn("flex-1", 
          isDesktop ? "pl-4 pr-6 py-5 border-r border-white/5" : ""
        )}>
          <div className="space-y-3.5">
            <NVField label="에셋 검색" size="sm" row={isDesktop} labelWidth={isDesktop ? "100px" : undefined}>
              <NVSearchKeywordPart keyword={filters.keyword} setKeyword={setKeyword} isDesktop={isDesktop} />
            </NVField>

            <NVField label="색상 팔레트" size="sm" row={isDesktop} labelWidth={isDesktop ? "100px" : undefined}>
               <NVSearchColorPart colors={filters.colors} toggleColor={toggleColor} isDesktop={isDesktop} />
            </NVField>

            <NVField label="기간 설정" size="sm" row={isDesktop} labelWidth={isDesktop ? "100px" : undefined}>
               <NVSearchPeriodPart period={filters.period} setPeriod={setPeriod} isDesktop={isDesktop} />
            </NVField>

            <NVField label="태그 필터" size="sm" row={isDesktop} labelWidth={isDesktop ? "100px" : undefined}>
               <NVSearchTagPart tags={filters.tags} toggleTag={toggleTag} isDesktop={isDesktop} />
            </NVField>
          </div>
        </div>

        {/* Sidebar / Actions Area */}
        <div className={cn(
          isDesktop ? "w-[200px] bg-slate-950/30 px-8 py-6 flex flex-col justify-between" : "flex flex-col gap-4 mt-4"
        )}>
          <div className="space-y-6">
            {isDesktop && (
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Selected Items</p>
                <p className="text-sm font-medium text-slate-200">
                  {filters.colors.length + filters.tags.length + (filters.period ? 1 : 0) + (filters.keyword ? 1 : 0)}개의 조건 선택됨
                </p>
              </div>
            )}
            
            <div className={cn(isDesktop ? "space-y-3" : "mt-2 space-y-3")}>
              <NVButton 
                variant="primary" 
                size="md"
                className="w-full" 
                onClick={handleApply}
              >
                <Search size={16} /> 
                상세 검색
              </NVButton>
              <NVButton 
                variant="secondary" 
                size="md"
                className="w-full justify-center border-none hover:bg-white/5" 
                onClick={handleReset}
              >
                <RotateCcw size={16} /> 초기화
              </NVButton>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 blur-[80px] pointer-events-none -z-10" />
    </NVGlassPanel>
  );
};
