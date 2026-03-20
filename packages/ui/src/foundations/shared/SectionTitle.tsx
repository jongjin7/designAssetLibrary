'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface SectionTitleProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function SectionTitle({ children, variant = 'primary', className }: SectionTitleProps) {
  if (variant === 'secondary') {
    return (
      <h3 className={cn(
        "text-[11px] font-bold text-indigo-400/80 uppercase tracking-[0.3em] flex items-center gap-2",
        className
      )}>
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        {children}
      </h3>
    );
  }

  return (
    <h3 className={cn(
      "text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3",
      className
    )}>
      <span className="shrink-0">{children}</span>
      <div className="h-px bg-white/5 flex-grow" />
    </h3>
  );
}
