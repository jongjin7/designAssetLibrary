import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';

interface NVIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'vivid' | 'danger' | 'ghost' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg';
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
    lg: 'rounded-xl'
  };

  const variants = {
    primary: 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-[0_8px_20px_-6px_rgba(79,70,229,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(79,70,229,0.6)] hover:-translate-y-0.5',
    secondary: 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20',
    vivid: 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white shadow-[0_8px_20px_-6px_rgba(6,182,212,0.5)] hover:shadow-[0_12px_24px_-6px_rgba(6,182,212,0.6)] hover:-translate-y-0.5',
    danger: 'bg-rose-500/10 border border-rose-500/25 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-[0_4px_12px_rgba(244,63,94,0.15)] hover:shadow-[0_8px_20px_rgba(244,63,94,0.4)] hover:-translate-y-0.5',
    ghost: 'bg-transparent text-slate-500 hover:text-slate-50 hover:bg-white/5',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
  };

  const sizes = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const defaultIconSizes = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20
  };

  const finalIconSize = iconSize || defaultIconSizes[size];
  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${roundedStyles[size]} ${className}`;

  return (
    <button className={combinedClasses} {...props}>
      <Icon size={finalIconSize} {...iconProps} strokeWidth={strokeWidth}/>
    </button>
  );
};
