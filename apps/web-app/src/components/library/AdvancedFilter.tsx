'use client';

import { Palette, Calendar, Tag, X, Check, RotateCcw } from 'lucide-react';
import { NVCard, NVButton } from '@nova/ui';
import { useState } from 'react';

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
    setFilters({ color: '', tags: '', date: '' });
    onReset?.();
  };

  const content = (
    <div className={`advanced-filter-content flex flex-wrap items-center gap-3 ${isMobile ? 'flex-col items-stretch p-4' : ''}`}>
      <div className={`filter-group flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl px-3 py-2 transition-all focus-within:border-nv-primary focus-within:bg-black/40 ${isMobile ? 'w-full' : ''}`}>
        <Palette size={14} className="text-nv-text-tertiary" />
        <select 
          className="bg-transparent border-none text-nv-text-secondary text-sm outline-none cursor-pointer appearance-none pr-4 w-full"
          value={filters.color}
          onChange={(e) => setFilters({ ...filters, color: e.target.value })}
        >
          <option value="">모든 색상</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="yellow">Yellow</option>
          <option value="purple">Purple</option>
        </select>
      </div>

      <div className={`filter-group flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl px-3 py-2 transition-all focus-within:border-nv-primary focus-within:bg-black/40 ${isMobile ? 'w-full' : ''}`}>
        <Tag size={14} className="text-nv-text-tertiary" />
        <input 
          type="text" 
          className="bg-transparent border-none text-nv-text-primary text-sm outline-none w-full" 
          placeholder="태그 입력 (예: #ui)" 
          value={filters.tags}
          onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
        />
      </div>

      <div className={`filter-group flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl px-3 py-2 transition-all focus-within:border-nv-primary focus-within:bg-black/40 ${isMobile ? 'w-full' : ''}`}>
        <Calendar size={14} className="text-nv-text-tertiary" />
        <select 
          className="bg-transparent border-none text-nv-text-secondary text-sm outline-none cursor-pointer appearance-none pr-4 w-full"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        >
          <option value="">모든 기간</option>
          <option value="today">오늘</option>
          <option value="week">최근 7일</option>
          <option value="month">최근 30일</option>
        </select>
      </div>

      <div className={`filter-actions flex gap-2 ${isMobile ? 'mt-2 justify-end' : 'ml-auto'}`}>
        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 text-nv-text-tertiary hover:text-nv-text-primary text-sm font-medium transition-colors"
          onClick={handleReset}
        >
          <RotateCcw size={14} />
          초기화
        </button>
        <NVButton 
          variant="primary" 
          size="sm" 
          onClick={handleApply}
          className="!h-9"
        >
          적용
        </NVButton>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <NVCard className={`mx-4 mb-4 !p-0 overflow-hidden border-nv-primary/20 ${className}`} hoverEffect={false}>
        <div className="bg-nv-primary/10 px-4 py-2 border-bottom border-white/5">
          <span className="text-xs font-bold text-nv-primary uppercase tracking-wider">상세 필터</span>
        </div>
        {content}
      </NVCard>
    );
  }

  return (
    <div className={`advanced-filter-bar w-full bg-white/[0.02] border-b border-white/[0.06] px-8 py-3 animate-in fade-in slide-in-from-top-2 duration-300 ${className}`}>
      {content}
    </div>
  );
}
