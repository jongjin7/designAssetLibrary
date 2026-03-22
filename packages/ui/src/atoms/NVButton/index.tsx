import React from 'react';

interface NVButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'vivid' | 'danger' | 'ghost' | 'glass' | 'glass-primary' | 'glass-danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const NVButton: React.FC<NVButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-300 active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none tracking-tight [&_svg]:text-inherit select-none cursor-pointer';
  
  const roundedStyles = {
    xs: 'rounded-md',
    sm: 'rounded-lg',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl'
  };
  
  const variants = {
    // ... (rest of variants)
    primary: 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5',
    secondary: 'bg-slate-900 text-slate-300 hover:text-white hover:bg-white/5',
    vivid: 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-[0_8px_20px_-6px_rgba(6,182,212,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(6,182,212,0.6)] hover:-translate-y-0.5',
    danger: 'bg-rose-500/10 border border-rose-500/25 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.15)] hover:shadow-[0_8px_20px_rgba(244,63,94,0.4)] hover:-translate-y-0.5',
    ghost: 'bg-transparent text-slate-500 hover:text-slate-50 hover:bg-white/5',
    glass: 'bg-gray-400/10 backdrop-blur-md border border-gray-400/20 text-gray-400 hover:bg-gray-400/40 hover:text-white hover:border-gray-400',
    'glass-primary': 'bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40 hover:text-white hover:border-indigo-500 shadow-[0_4px_12px_rgba(99,102,241,0.15)]',
    'glass-danger': 'bg-rose-500/5 backdrop-blur-md border border-rose-500/20 text-rose-400 hover:bg-rose-500/40 hover:text-white hover:border-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.1)]'
  }; 

  const sizes = {
    xs: 'h-[24px] px-2 text-[10px] gap-1',
    sm: 'h-[28px] px-2.5 text-[11px] gap-1',
    md: 'h-[36px] px-4 text-sm gap-2', 
    lg: 'h-[44px] px-6 text-sm gap-2.5',
    xl: 'h-[52px] px-8 text-base gap-3'
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${roundedStyles[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
