import React from 'react';

export interface NVInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
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
    xs: 'px-2 py-0.5 md:text-xs text-base gap-1',
    sm: 'px-3 py-1.5 md:text-sm text-base gap-1.5',
    md: 'px-3.5 py-2.5 text-base gap-2',
    lg: 'px-5 py-4 text-lg gap-3'
  };

  const roundedStyles = {
    xs: 'rounded-md',
    sm: 'rounded-lg',
    md: 'rounded-lg',
    lg: 'rounded-xl'
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


