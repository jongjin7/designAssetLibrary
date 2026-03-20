'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { NVPaletteStrip } from '../../../molecules/NVPaletteStrip';

interface NVAssetDetailColorsProps {
  palette: string[];
  isAiRefined: boolean;
  isExtracting: boolean;
  onExtractAI?: () => void;
  className?: string;
}

export function NVAssetDetailColors({ 
  palette, 
  isAiRefined, 
  isExtracting, 
  onExtractAI, 
  className = '' 
}: NVAssetDetailColorsProps) {
  return (
    <div className={cn("flex items-end justify-between px-5", className)}>
      <NVPaletteStrip colors={palette} isAiRefined={isAiRefined} />
      
      {onExtractAI && (
        <div className="transition-transform active:scale-95">
          <button 
            className={cn(
              "h-9 px-3.5 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all border relative overflow-hidden",
              isAiRefined 
                ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-500 shadow-sm" 
                : "bg-white/[0.02] border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-200",
              isExtracting && "border-indigo-500/10 text-indigo-400 pointer-events-none"
            )}
            onClick={onExtractAI}
            disabled={isExtracting}
            aria-label="AI 분석"
          >
            {isExtracting ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-indigo-500/10 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                <Sparkles size={14} className="animate-spin text-indigo-400 relative z-10" />
                <span className="relative z-10 text-indigo-400">분석 중...</span>
              </>
            ) : (
              <>
                <Sparkles 
                  size={14} 
                  className={cn(
                    "transition-all duration-300",
                    isAiRefined ? "text-cyan-500" : "text-slate-500"
                  )} 
                />
                <span>AI 분석</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
