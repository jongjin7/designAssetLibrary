import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { NVButton } from '../../../atoms/NVButton';
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
    "flex items-center  w-full gap-1.5 pr-1"
  )}>
    <div className={cn(" flex items-center gap-1.5", isDesktop ? "justify-between" : "flex-1")}>
      {SEARCH_PERIODS.map((p) => {
        const isActive = period === p.value;
        return (
          <NVButton
            key={p.value}
            size="sm"
            variant={isActive ? (isDesktop ? "glass-primary" : "primary") : "glass"}
            onClick={() => setPeriod(p.value)}
            className={cn(
              "transition-all text-center font-bold px-0",
              isDesktop ? "min-w-[50px] rounded-xl" : "flex-1 rounded-lg",
              !isActive && "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
            )}
          >
            {p.label}
          </NVButton>
        );
      })}
    </div>
    
    <div className={cn("w-[1px] bg-white/5 ml-1", isDesktop ? "h-4" : "h-3")} />
    
    <NVIconButton 
      icon={Calendar} 
      size="sm" 
      iconSize={20}
      strokeWidth={1.5}
      variant="ghost" 
      className={cn("!w-6 text-slate-500 hover:text-white shrink-0")} 
      title="직접 선택"
    />
  </div>
);
