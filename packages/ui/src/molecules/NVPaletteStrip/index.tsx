'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useToast } from '../NVToast';

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
  const { toast } = useToast();

  const copyToClipboard = async (color: string) => {
    if (onColorCopy) {
      onColorCopy(color);
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(color);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = color;
        textArea.style.position = "absolute";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      toast(`${color} 색상 코드가 복사되었습니다.`, { type: 'success' });
    } catch (err) {
      console.error('Failed to copy color:', err);
      toast('색상 코드 복사에 실패했습니다.', { type: 'error' });
    }
  };

  return (
    <div className={cn("", className)}>
      <div className="flex items-center gap-2 mb-1.5">
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
