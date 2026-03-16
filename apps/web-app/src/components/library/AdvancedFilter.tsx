'use client';

import { Palette, Calendar, Tag, X, Check, RotateCcw } from 'lucide-react';
import { NVCard, NVButton, NVInput, NVSelect } from '@nova/ui';
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
    <div className={`flex flex-wrap items-center gap-3 ${isMobile ? 'flex-col items-stretch p-4' : ''}`}>
      <NVSelect
        icon={<Palette size={14} />}
        className={isMobile ? 'w-full' : 'w-[160px]'}
        value={filters.color}
        onChange={(e) => setFilters({ ...filters, color: e.target.value })}
        options={[
          { value: '', label: '모든 색상' },
          { value: 'red', label: 'Red' },
          { value: 'blue', label: 'Blue' },
          { value: 'green', label: 'Green' },
          { value: 'yellow', label: 'Yellow' },
          { value: 'purple', label: 'Purple' },
        ]}
      />

      <NVInput
        icon={<Tag size={14} />}
        className={isMobile ? 'w-full' : 'w-[200px]'}
        placeholder="태그 입력 (예: #ui)"
        value={filters.tags}
        onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
      />

      <NVSelect
        icon={<Calendar size={14} />}
        className={isMobile ? 'w-full' : 'w-[160px]'}
        value={filters.date}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        options={[
          { value: '', label: '모든 기간' },
          { value: 'today', label: '오늘' },
          { value: 'week', label: '최근 7일' },
          { value: 'month', label: '최근 30일' },
        ]}
      />

      <div className={`flex gap-2 ${isMobile ? 'mt-2 justify-end' : 'ml-auto'}`}>
        <NVButton 
          variant="ghost"
          size="sm"
          onClick={handleReset}
        >
          <RotateCcw size={14} />
          초기화
        </NVButton>
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
      <NVCard className={`mx-4 mb-4 !p-0 overflow-hidden border-indigo-500/20 ${className}`} hoverEffect={false}>
        <div className="bg-indigo-500/10 px-4 py-2 border-bottom border-white/5">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">상세 필터</span>
        </div>
        {content}
      </NVCard>
    );
  }

  return (
    <div className={`w-full bg-white/[0.02] border-b border-white/[0.06] px-8 py-3 animate-in fade-in slide-in-from-top-2 duration-300 ${className}`}>
      {content}
    </div>
  );
}
