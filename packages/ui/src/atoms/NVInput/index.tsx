import React from 'react';

export interface NVInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
  size?: 'sm' | 'md' | 'lg';
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


