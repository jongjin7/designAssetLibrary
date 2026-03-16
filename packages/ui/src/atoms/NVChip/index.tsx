import React from 'react';

export interface NVChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'filter' | 'tag' | 'status';
  size?: 'sm' | 'md';
  disabled?: boolean;
}

export const NVChip: React.FC<NVChipProps> = ({
  label,
  isActive = false,
  onClick,
  className = '',
  variant = 'filter',
  size = 'md',
  disabled = false
}) => {
  const baseStyles = 'rounded-full font-medium transition-all duration-200 whitespace-nowrap border cursor-pointer flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed';

  
  const sizeStyles = {
    sm: 'px-3 py-1 text-[11px] gap-1',
    md: 'px-4 py-1.5 text-sm gap-1.5'
  };

  const variantStyles = {
    filter: isActive 
      ? 'bg-nv-primary/20 border-nv-primary text-nv-primary shadow-[0_4px_12px_rgba(99,102,241,0.2)]'
      : 'bg-white/5 border-white/10 text-nv-text-secondary hover:bg-white/10 hover:border-white/20 hover:text-nv-text-primary',
    tag: 'bg-white/5 border-transparent text-nv-text-tertiary hover:bg-white/10',
    status: 'bg-nv-vivid/10 border-nv-vivid/20 text-nv-vivid'
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

