import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NVLoadingStateProps {
  message?: string;
  className?: string;
  fullHeight?: boolean;
}

/**
 * NVLoadingState is a reusable loading indicator component.
 * It provides a consistent visual experience across the application.
 */
export const NVLoadingState = ({ 
  message = "자산을 불러오는 중...", 
  className,
  fullHeight = false
}: NVLoadingStateProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3 p-10 text-slate-400 animate-in fade-in duration-500",
      fullHeight && "min-h-[60dvh]",
      className
    )}>
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500/80" />
      <p className="text-sm font-medium tracking-tight opacity-80">{message}</p>
    </div>
  );
};
