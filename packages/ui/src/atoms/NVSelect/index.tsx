import React from 'react';

export interface NVSelectOption {
  value: string;
  label: string;
}

export interface NVSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  icon?: React.ReactNode;
  options: NVSelectOption[];
  size?: 'sm' | 'md' | 'lg';
}

export const NVSelect: React.FC<NVSelectProps> = ({ 
  icon, 
  options, 
  className = '', 
  size = 'md',
  ...props 
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-3.5 py-2.5 text-sm gap-2',
    lg: 'px-5 py-4 text-base gap-3'
  };

  const containerClasses = `
    flex items-center bg-white/5 border border-white/10 rounded-xl
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
    sm: 8,
    md: 10,
    lg: 12
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

