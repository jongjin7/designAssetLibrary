import React from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';

export interface NVChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
  variant?: 'filter' | 'tag' | 'status';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  count?: number;
}

export const NVChip: React.FC<NVChipProps> = ({
  label,
  isActive = false,
  onClick,
  onDelete,
  className = '',
  variant = 'filter',
  size = 'md',
  disabled = false,
  count
}) => {
  const baseStyles = cn(
    'rounded-full font-medium transition-all duration-300 active:scale-[0.96] whitespace-nowrap border flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed',
    onClick ? 'cursor-pointer' : 'cursor-default'
  );

  const sizeStyles = {
    sm: 'px-3 py-1 text-xs gap-1',
    md: 'px-4 py-1.5 text-sm gap-1.5',
    lg: 'px-5 py-2 text-base gap-2'
  };

  const variantStyles = {
    filter: isActive 
      ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/25 hover:text-indigo-300'
      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20 hover:text-white',
    tag: cn('bg-white/5 border-transparent text-slate-500', onClick ? 'hover:bg-white/10 hover:text-slate-300' : ''),
    status: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300'
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component 
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      onClick={onClick}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className={cn(
          "px-1.5 py-0.5 ml-1.5 rounded-full text-[10px] font-bold min-w-[18px] text-center transition-all duration-300",
          isActive 
            ? "bg-white/20 text-white" 
            : "bg-white/10 text-slate-500 group-hover:bg-white/20 group-hover:text-slate-300"
        )}>
          {count}
        </span>
      )}
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-white/20 hover:text-white transition-colors"
        >
          <X size={12} strokeWidth={3} />
        </button>
      )}
    </Component>
  );
};

