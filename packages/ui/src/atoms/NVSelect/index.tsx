import React from 'react';

export interface NVSelectOption {
  value: string;
  label: string;
}

export interface NVSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  icon?: React.ReactNode;
  options: NVSelectOption[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const NVSelect: React.FC<NVSelectProps> = ({ 
  icon, 
  options, 
  className = '', 
  size = 'md',
  ...props 
}) => {
  const sizeStyles = {
    xs: 'h-[24px] px-2 text-[10px] gap-1',
    sm: 'h-[28px] px-2.5 text-[11px] gap-1',
    md: 'h-[36px] px-3.5 text-sm gap-2',
    lg: 'h-[44px] px-4 text-sm gap-2.5',
    xl: 'h-[52px] px-5 text-base gap-3'
  };

  const roundedStyles = {
    xs: 'rounded-md',
    sm: 'rounded-lg',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl'
  };

  const containerClasses = `
    flex items-center bg-white/5 border border-white/10 ${roundedStyles[size]}
    transition-all focus-within:border-indigo-500 focus-within:bg-white/10
    relative
    has-[:disabled]:opacity-40 has-[:disabled]:pointer-events-none
    ${sizeStyles[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const selectClasses = `
    bg-transparent border-none text-slate-400 outline-none 
    cursor-pointer appearance-none w-full pr-5
  `.replace(/\s+/g, ' ').trim();

  const iconSizes = {
    xs: 7,
    sm: 8,
    md: 10,
    lg: 12,
    xl: 14
  };

  return (
    <div className={containerClasses}>
      {icon && <div className="text-slate-500 flex-shrink-0">{icon}</div>}
      <select className={selectClasses} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-900 text-slate-50">
            {option.label}
          </option>
        ))}
      </select>
      <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500`}>
        <svg width={iconSizes[size]} height={iconSizes[size] * 0.6} viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

