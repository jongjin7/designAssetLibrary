import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const SEARCH_COLORS = [
  { value: 'red', label: 'R', hex: '#f43f5e', name: 'Rose' },
  { value: 'orange', label: 'O', hex: '#f97316', name: 'Orange' },
  { value: 'yellow', label: 'Y', hex: '#f59e0b', name: 'Amber' },
  { value: 'green', label: 'G', hex: '#10b981', name: 'Emerald' },
  { value: 'blue', label: 'B', hex: '#6366f1', name: 'Indigo' },
  { value: 'purple', label: 'P', hex: '#a855f7', name: 'Purple' },
];

interface NVSearchColorPartProps {
  colors: string[];
  toggleColor: (color: string) => void;
  isDesktop?: boolean;
}

export const NVSearchColorPart = ({ colors, toggleColor, isDesktop = false }: NVSearchColorPartProps) => (
  <div className={cn("flex flex-wrap items-center", isDesktop ? "gap-2.5 py-1" : "gap-3 pl-1")}>
    {SEARCH_COLORS.map((c) => (
      <button
        key={c.value}
        onClick={() => toggleColor(c.value)}
        className={cn(
          "rounded-full transition-all duration-300 relative border flex items-center justify-center",
          isDesktop ? "w-8 h-8" : "w-[26px] h-[26px]",
          colors.includes(c.value) 
            ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)] ring-2 ring-white/40 ring-offset-2 ring-offset-slate-950" 
            : "border-transparent opacity-60 hover:opacity-100 hover:scale-[1.05]"
        )}
        style={{ backgroundColor: c.hex }}
        title={c.name}
      >
        {colors.includes(c.value) && (
          <Check size={isDesktop ? 14 : 12} className="text-white/90 drop-shadow-md" strokeWidth={3} />
        )}
      </button>
    ))}
  </div>
);
