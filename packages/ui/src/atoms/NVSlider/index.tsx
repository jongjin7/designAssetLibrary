import React from 'react';
import { cn } from '../../lib/utils';

interface NVSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const NVSlider: React.FC<NVSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className = '',
  size = 'md',
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const sizeMetrics = {
    sm: { trackHeight: 'h-[3px]', thumbSize: 'w-3 h-3' },
    md: { trackHeight: 'h-1', thumbSize: 'w-4 h-4' },
    lg: { trackHeight: 'h-1.5', thumbSize: 'w-5 h-5' },
  };

  const { trackHeight, thumbSize } = sizeMetrics[size];

  return (
    <div className={cn("relative flex items-center w-full min-w-[80px] h-6 group", className)}>
      {/* Track Background */}
      <div 
        className={cn(
          "absolute w-full rounded-full bg-white/[0.08] transition-colors group-hover:bg-white/[0.12]", 
          trackHeight,
          disabled && "opacity-40"
        )} 
      />
      
      {/* Track Progress (Gradient) */}
      <div 
        className={cn(
          "absolute rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]", 
          trackHeight
        )} 
        style={{ width: `${percentage}%` }}
      />

      {/* Input Range (for interaction) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={cn(
          "absolute w-full opacity-0 cursor-pointer z-10 h-6",
          disabled && "cursor-not-allowed"
        )}
      />

      {/* Custom Thumb (Visual) */}
      <div 
        className={cn(
          "absolute pointer-events-none rounded-full bg-white shadow-lg border border-indigo-400/30 flex items-center justify-center transition-transform group-active:scale-95 group-hover:scale-110",
          thumbSize,
          disabled && "bg-slate-700 border-none shadow-none"
        )}
        style={{ 
          left: `calc(${percentage}% - (${thumbSize.split(' ')[0].replace('w-', '') === '3' ? 6 : thumbSize.split(' ')[0].replace('w-', '') === '4' ? 8 : 10}px))` 
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
      </div>
    </div>
  );
};
