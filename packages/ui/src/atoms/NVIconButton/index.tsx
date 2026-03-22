import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

interface NVIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'vivid' | 'danger' | 'ghost' | 'glass' | 'glass-primary'|'glass-danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  iconSize?: number;
  iconProps?: LucideProps;
  strokeWidth?: number;
}

export const NVIconButton: React.FC<NVIconButtonProps> = ({ 
  icon: Icon, 
  variant = 'secondary', 
  size = 'md', 
  iconSize,
  iconProps,
  className = '', 
  strokeWidth=2,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-200 active:scale-90 disabled:opacity-40 disabled:pointer-events-none [&_svg]:text-inherit';
  
  const roundedStyles = {
    xs: 'rounded-md',
    sm: 'rounded-lg',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl'
  };

  const variants = {
    primary: 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5',
    secondary: 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10',
    vivid: 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-[0_8px_20px_-6px_rgba(6,182,212,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(6,182,212,0.6)] hover:-translate-y-0.5',
    danger: 'bg-rose-500/10 border border-rose-500/25 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.15)] hover:shadow-[0_8px_20px_rgba(244,63,94,0.4)] hover:-translate-y-0.5',
    ghost: 'bg-transparent text-slate-500 hover:text-slate-50 hover:bg-white/5',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/20',
    'glass-primary': 'bg-indigo-500/10 backdrop-blur-md border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500 hover:text-white hover:border-indigo-500 shadow-[0_4px_12px_rgba(99,102,241,0.15)]',
    'glass-danger': 'bg-rose-500/5 backdrop-blur-md border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.1)]'
  };

  const sizes = {
    xs: 'w-[24px] h-[24px]',
    sm: 'w-[28px] h-[28px]',
    md: 'w-[36px] h-[36px]',
    lg: 'w-[44px] h-[44px]',
    xl: 'w-[52px] h-[52px]'
  };

  const defaultIconSizes = {
    xs: 11,
    sm: 13,
    md: 16,
    lg: 20,
    xl: 24
  };

  const finalIconSize = iconSize || defaultIconSizes[size];
  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${roundedStyles[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      <Icon size={finalIconSize} {...iconProps} strokeWidth={strokeWidth}/>
    </button>
  );
};
