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

export interface NVSearchPanelProps {
  /** 검색 적용 시 호출되는 콜백 */
  onSearch?: (filters: SearchFilterState) => void;
  /** 검색 적용 시 호출되는 콜백 (onSearch의 별칭) */
  onApply?: (filters: SearchFilterState) => void;
  /** 닫기 버튼 클릭 시 호출되는 콜백 */
  onClose?: () => void;
  /** 검색 레이아웃 스타일 */
  layout?: 'basic' | 'desktop' | 'popover';
  /** 초기 필터 상태 */
  initialFilters?: Partial<SearchFilterState>;
  /** 추가 클래스 */
  className?: string;
  /** 초기화 시 호출되는 콜백 */
  onReset?: () => void;
}

/**
 * 에셋 라이브러리 전체에서 공통으로 사용되는 상세 검색 패널입니다.
 * 가로형 데스크탑 레이아웃, 세로형 기본 레이아웃, 그리고 macOS 스타일의 팝오버 레이아웃을 모두 지원합니다.
 */
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
  const isPopover = layout === 'popover';
  
  const { filters, toggleColor, toggleTag, setKeyword, setPeriod, handleApply, handleReset } = useSearchFilters(initialFilters || {}, onSearch || onApply, onReset);

  return (
    <NVGlassPanel 
      variant="modal" 
      blur="xl" 
      noPadding
      className={cn(
        "relative overflow-scroll scrollbar-hide border-white/10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.5)] transition-all duration-300",
        isDesktop ? "w-[780px] rounded-[32px] p-0" : 
        isPopover ? "w-[280px] rounded-3xl p-0 ring-1 ring-white/5" : "w-full rounded-3xl p-5 max-h-[50vh]",
        className
      )}
    >
      {/* Title Header (Mobile/Basic) */}
      {(!isDesktop && !isPopover) && (
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
      )}

      {/* Title Header (Popover/macOS) */}
      {isPopover && (
        <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">상세 검색 필터</h3>
          {onClose && (
            <NVIconButton 
              icon={X} 
              variant="ghost" 
              size="xs" 
              onClick={onClose} 
              className="-mr-1.5 text-slate-500 hover:text-white"
            />
          )}
        </div>
      )}

      <div className={cn("flex", (isDesktop && !isPopover) ? "flex-row" : "flex-col")}>
        {/* Main Content Area */}
        <div className={cn("flex-1", 
          isDesktop && !isPopover ? "p-10 pr-6 border-r border-white/5" : 
          isPopover ? "p-5 pb-3" : ""
        )}>
          <div className={cn(isPopover ? "space-y-6" : "space-y-5")}>
            <NVField label="에셋 검색" size={(isPopover) ? "xs" : "sm"} row={isDesktop && !isPopover} labelWidth={isDesktop && !isPopover ? "120px" : undefined} labelClassName={isPopover ? "text-slate-500" : ""}>
              <NVSearchKeywordPart keyword={filters.keyword} setKeyword={setKeyword} isDesktop={isDesktop || isPopover} />
            </NVField>

            <NVField label="색상 팔레트" size={(isPopover) ? "xs" : "sm"} row={isDesktop && !isPopover} labelWidth={isDesktop && !isPopover ? "120px" : undefined} labelClassName={isPopover ? "text-slate-500" : ""}>
               <NVSearchColorPart colors={filters.colors} toggleColor={toggleColor} isDesktop={isDesktop || isPopover} />
            </NVField>
            
            {(isPopover) && <div className="h-[1px] bg-white/5 -mx-5" />}

            <NVField label="기간 설정" size={(isPopover) ? "xs" : "sm"} row={isDesktop && !isPopover} labelWidth={isDesktop && !isPopover ? "120px" : undefined} labelClassName={isPopover ? "text-slate-500" : ""}>
               <NVSearchPeriodPart period={filters.period} setPeriod={setPeriod} isDesktop={isDesktop || isPopover} />
            </NVField>

            <NVField label="태그 필터" size={(isPopover) ? "xs" : "sm"} row={isDesktop && !isPopover} labelWidth={isDesktop && !isPopover ? "120px" : undefined} labelClassName={isPopover ? "text-slate-500" : ""}>
               <NVSearchTagPart tags={filters.tags} toggleTag={toggleTag} isDesktop={isDesktop || isPopover} />
            </NVField>
          </div>
        </div>

        {/* Sidebar / Actions Area */}
        <div className={cn(
          (isDesktop && !isPopover) ? "w-[240px] bg-slate-950/30 p-10 flex flex-col justify-between" : 
          isPopover ? "p-5 pt-3 border-t border-white/5 bg-slate-950/20" : "flex flex-col gap-4 mt-4"
        )}>
          <div className={cn(isPopover ? "flex flex-col gap-3" : "space-y-6")}>
            {(isDesktop && !isPopover) && (
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Selected Items</p>
                <p className="text-sm font-medium text-slate-200">
                  {filters.colors.length + filters.tags.length + (filters.period ? 1 : 0) + (filters.keyword ? 1 : 0)}개의 조건 선택됨
                </p>
              </div>
            )}
            
            <div className={cn(isPopover ? "flex flex-col gap-2" : isDesktop ? "space-y-3" : "mt-2 space-y-3")}>
              <NVButton 
                variant="primary" 
                size={isPopover ? "sm" : "md"}
                className="w-full justify-center shadow-lg shadow-indigo-500/10" 
                onClick={handleApply}
              >
                <Search size={isPopover ? 14 : 18} className="mr-2" /> 
                {isPopover ? "검색 적용" : "상세 조건으로 검색"}
              </NVButton>
              <NVButton 
                variant="secondary" 
                size={isPopover ? "sm" : "md"}
                className="w-full justify-center border-none hover:bg-white/5" 
                onClick={handleReset}
              >
                <RotateCcw size={isPopover ? 12 : 14} className="mr-2" /> 초기화
              </NVButton>
            </div>
          </div>

          {(isDesktop && !isPopover) && onClose && (
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
