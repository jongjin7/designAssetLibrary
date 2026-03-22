import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { NVIconButton } from '../../../atoms/NVIconButton';

export const SEARCH_PERIODS = [
  { value: '', label: '전체' },
  { value: 'today', label: '오늘' },
  { value: 'week', label: '7일' },
  { value: 'month', label: '30일' },
];

interface NVSearchPeriodPartProps {
  period: string;
  setPeriod: (period: string) => void;
  isDesktop?: boolean;
}

export const NVSearchPeriodPart = ({ period, setPeriod, isDesktop = false }: NVSearchPeriodPartProps) => (
  <div className={cn(
    "flex items-center justify-between shadow-inner w-full",
    isDesktop ? "gap-2" : "bg-white/[0.03] border border-white/5 rounded-xl p-1.5"
  )}>
    {SEARCH_PERIODS.map((p) => (
      <button
        key={p.value}
        onClick={() => setPeriod(p.value)}
        className={cn(
          "transition-all text-center",
          isDesktop 
            ? "px-4 py-1.5 text-sm rounded-xl font-medium"
            : "flex-1 py-1.5 text-[13px] font-bold rounded-lg",
          period === p.value 
            ? (isDesktop ? "bg-white/10 text-white shadow-sm ring-1 ring-white/20" : "bg-indigo-500 text-white shadow-md border border-indigo-500/50") 
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
        )}
      >
        {p.label}
      </button>
    ))}
    <div className={cn("w-[1px] bg-white/10", isDesktop ? "h-5 mx-1" : "h-4 mx-2")} />
    <NVIconButton 
      icon={Calendar} 
      size="sm" 
      variant="ghost" 
      className={cn("text-slate-400 hover:text-white shrink-0", isDesktop ? "" : "!w-8 !h-8")} 
      title="직접 선택"
    />
  </div>
);
