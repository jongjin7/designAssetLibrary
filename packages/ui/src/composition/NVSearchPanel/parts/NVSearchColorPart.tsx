import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { NVIconButton } from '../../../atoms/NVIconButton';

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
    {SEARCH_COLORS.map((c) => {
      const isActive = colors.includes(c.value);
      return (
        <NVIconButton
          key={c.value}
          icon={Check}
          onClick={() => toggleColor(c.value)}
          size={isDesktop ? "sm" : "xs"}
          className={cn(
            "!rounded-full transition-all duration-300 relative border-2",
            isActive 
              ? "border-white scale-110 ring-2 ring-white/20 ring-offset-2 ring-offset-slate-950" 
              : "border-transparent opacity-60 hover:opacity-100 hover:scale-[1.05]"
          )}
          style={{ backgroundColor: c.hex }}
          title={c.name}
          iconClassName={cn(
            "text-white transition-opacity",
            isActive ? "opacity-100" : "opacity-0"
          )}
          strokeWidth={4}
        />
      );
    })}
  </div>
);
