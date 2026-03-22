import React from 'react';

export interface NVInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const NVInput: React.FC<NVInputProps> = ({ 
  icon, 
  rightElement, 
  className = '', 
  containerClassName = '', 
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

  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-13 h-13'
  };

  const defaultIconSizes = {
    xs: 11,
    sm: 13,
    md: 16,
    lg: 20,
    xl: 24
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
    ${containerClassName}
  `.replace(/\s+/g, ' ').trim();


  const inputClasses = `
    bg-transparent border-none text-slate-50 outline-none w-full
    placeholder:text-slate-500
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className={containerClasses}>
      {icon && <div className="text-slate-500 flex-shrink-0">{icon}</div>}
      <input className={inputClasses} {...props} />
      {rightElement && <div className="flex items-center gap-1 flex-shrink-0">{rightElement}</div>}
    </div>
  );
};


