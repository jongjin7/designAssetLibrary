'use client';

import { Palette, Calendar, Tag, X, Check, RotateCcw, Search } from 'lucide-react';
import { NVCard, NVButton, NVInput, NVSelect } from '@nova/ui';
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
      isMobile ? "gap-2 px-5 py-2" : "gap-4 px-8 py-2.5"
    )}>
      {/* Top Row: Color & Period */}
      <div className={cn(
        "flex gap-4",
        isMobile ? "flex-col items-start" : "flex-wrap items-center justify-between"
      )}>
        {/* Color Palette Section */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-500/60 ml-0.5">색상 팔레트</span>
          <div className="flex flex-wrap items-center gap-2 px-0.5">
            {colors.map((c) => (
              <button
                key={c.value}
                onClick={() => setFilters({ ...filters, color: c.value })}
                className={cn(
                  "w-4 h-4 rounded-full transition-all duration-300 relative",
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
        <div className="flex flex-col gap-1.5 items-start">
          <span className="text-xs text-slate-500/60 ml-0.5">기간 설정</span>
          <div className="flex p-0.5 bg-white/[0.03] border border-white/[0.05] rounded-lg items-center">
            {periods.map((p) => (
              <button
                key={p.value}
                onClick={() => setFilters({ ...filters, date: p.value })}
                className={cn(
                  "px-3 py-1 text-[10px] font-bold rounded-md transition-all",
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
              className="p-1.5 text-slate-600 hover:text-indigo-400"
              title="날짜 직접 선택"
            >
              <Calendar size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Tag Input Expansion */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-slate-500/60 ml-0.5">태그 및 검색어</span>
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Tag size={12} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-white/[0.02] border border-white/[0.05] focus:border-indigo-500/30 focus:bg-white/[0.04] rounded-lg py-1.5 pl-9 pr-10 text-[11px] text-slate-200 placeholder:text-slate-600 outline-none transition-all"
            placeholder="에셋 태그 입력..."
            value={filters.tags}
            onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
          />
          <button 
            onClick={handleReset}
            className="absolute inset-y-0 right-3 flex items-center text-slate-600 hover:text-white transition-colors"
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div className={cn("flex justify-end pt-3 border-t border-white/5 mt-2")}>
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
      "w-full bg-slate-950/20 backdrop-blur-md overflow-hidden  rounded-lg",
      className
    )}>
      {content}
    </div>
  );
}
