'use client';

import { Palette, Calendar, Tag, X, Check, RotateCcw, Search } from 'lucide-react';
import { NVCard, NVButton, NVInput, NVSelect, NVIconButton } from '@nova/ui';
import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface AdvancedFilterProps {
  onApply?: (filters: any) => void;
  onReset?: () => void;
  className?: string;
  isMobile?: boolean;
}

export function AdvancedFilter({ onApply, onReset, className = '', isMobile = false }: AdvancedFilterProps) {
  const [filters, setFilters] = useState({
    color: '',
    tags: '',
    date: ''
  });

  const handleApply = () => {
    onApply?.(filters);
  };

  const handleReset = () => {
    const resetFilters = { color: '', tags: '', date: '' };
    setFilters(resetFilters);
    onApply?.(resetFilters);
    onReset?.();
  };

  const colors = [
    { value: '', label: 'All', hex: 'bg-slate-800' },
    { value: 'red', label: 'R', hex: 'bg-rose-500' },
    { value: 'blue', label: 'B', hex: 'bg-indigo-500' },
    { value: 'green', label: 'G', hex: 'bg-emerald-500' },
    { value: 'yellow', label: 'Y', hex: 'bg-amber-400' },
    { value: 'purple', label: 'P', hex: 'bg-purple-500' },
  ];

  const periods = [
    { value: '', label: '전체' },
    { value: 'today', label: '오늘' },
    { value: 'week', label: '7일' },
    { value: 'month', label: '30일' },
  ];

  const content = (
    <div className={cn(
      "w-full flex flex-col",
      isMobile ? "gap-4 px-4 pt-2 pb-4" : "gap-4 px-8 py-2.5"
    )}>
      {/* Top Row: Color & Period */}
      <div className={cn(
        "flex gap-4",
        isMobile ? "flex-col items-start" : "flex-wrap items-center justify-between"
      )}>
        {/* Color Palette Section */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-slate-500/60 ml-0.5">색상 팔레트</span>
          <div className="flex flex-wrap items-center gap-2 px-0.5">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilters({ ...filters, color: c.value })}
                className={cn(
                  "w-5 h-5 rounded-full transition-all duration-300 relative",
                  c.hex,
                  filters.color === c.value 
                    ? "ring-1 ring-white ring-offset-1 ring-offset-slate-950 scale-110 shadow-lg" 
                    : "opacity-40 hover:opacity-100",
                  c.value === '' && "border border-white/20"
                )}
              >
                {filters.color === c.value && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check size={10} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Time Period Section */}
        <div className="flex flex-col gap-2 items-start">
          <span className="text-sm text-slate-500/60 ml-0.5">기간 설정</span>
          <div className="flex px-1 py-1 bg-white/3 border border-white/5 rounded-lg items-center">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setFilters({ ...filters, date: p.value })}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-all", 
                  filters.date === p.value 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {p.label}
              </button>
            ))}
            <div className="w-[1px] h-3 bg-white/10 mx-1.5" />
            <button 
              className="p-1.5 mr-1 text-slate-600 hover:text-white"
              title="날짜 직접 선택"
            >
              <Calendar size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Tag Input Expansion */}
      <div className="flex flex-col gap-2">
        <span className="text-sm text-slate-500/60 ml-0.5">태그 및 검색어</span>
        <NVInput
          size="sm"
          icon={<Tag size={14} />}
          placeholder="에셋 태그 입력..."
          value={filters.tags}
          onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
          rightElement=
            {
              filters.tags && (<NVIconButton
                icon={X}
                variant="ghost"
                size="xs"
                className="!h-5 !w-5"
                onClick={handleReset}
                title="태그 초기화"
              aria-label="입력 초기화"
              />)}
        /> 
      </div>

      <div className={cn("flex justify-end pt-3 border-t border-white/5 ")}>
        <NVButton 
          variant="glass" 
          size="sm" 
          onClick={handleApply}
          className={cn(
            "!border-transparent !hover:border-transparent",
            isMobile ? "w-full" : "h-9 px-8"
          )}
        >
          <Search size={14} className="mr-2 text-indigo-400" />
          <span className="text-slate-200">필터 적용하여 결과 검색</span>
        </NVButton>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "w-full bg-slate-950/20 backdrop-blur-md overflow-hidden",
      className
    )}>
      {content}
    </div>
  );
}
