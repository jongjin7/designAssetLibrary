'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface NVPaletteStripProps {
  colors: string[];
  isAiRefined?: boolean;
  onColorCopy?: (color: string) => void;
  className?: string;
}

export function NVPaletteStrip({ 
  colors, 
  isAiRefined, 
  onColorCopy,
  className = '' 
}: NVPaletteStripProps) {
  const copyToClipboard = (color: string) => {
    if (onColorCopy) {
      onColorCopy(color);
      return;
    }
    navigator.clipboard.writeText(color);
    // Generic alert handled in UI library if needed, but usually parent handles feedback
  };

  return (
    <div className={cn("px-5 py-2", className)}>
      <div className="flex items-center gap-2 mb-2.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          추출된 핵심 컬러
        </p>
        {isAiRefined && (
          <span className="text-[9px] font-extrabold text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
            AI Refined
          </span>
        )}
      </div>
      <div className="flex gap-2">
        {colors.map((color, i) => (
          <button 
            key={i} 
            className="w-9 h-9 rounded-xl border border-white/10 transition-transform active:scale-125 hover:scale-115" 
            style={{ background: color }} 
            onClick={() => copyToClipboard(color)}
            title={`클릭하여 복사: ${color}`}
          />
        ))}
      </div>
    </div>
  );
}
