'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { useToast } from '../../atoms/NVToast';

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
    <div className={cn("flex gap-2", className)}>
      {colors.map((color, i) => (
        <button 
          key={i} 
          className={cn(
            "w-9 h-9 rounded-xl border transition-all duration-300 hover:scale-110 active:scale-125 hover:z-10 group relative",
            isAiRefined 
              ? "border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
              : "border-white/10 hover:border-white/30"
          )}
          style={{ background: color }} 
          onClick={() => copyToClipboard(color)}
          title={`클릭하여 복사: ${color}`}
       />   
      ))}
    </div>
  );
}
