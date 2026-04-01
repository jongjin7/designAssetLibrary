import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NVIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'neutral' | 'muted' | 'vivid' | 'danger' | 'ghost' | 'glass' | 'glass-primary' | 'glass-danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  iconSize?: number;
  iconProps?: LucideProps;
  strokeWidth?: number;
  iconClassName?: string;
  hoverEffect?: 'none' | 'scale' | 'brightness' | 'saturate';
  rounded?: boolean;
}

export const NVIconButton: React.FC<NVIconButtonProps> = ({ 
  icon: Icon, 
  variant = 'secondary', 
  size = 'md', 
  iconSize,
  iconProps,
  iconClassName,
  className = '', 
  strokeWidth=1.5,
  hoverEffect = 'none',
  rounded = false,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center transition-all duration-300 active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none [&_svg]:text-inherit';
  
  const roundedStyles = {
    xs: 'rounded-md',
    sm: 'rounded-lg',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl'
  };

  const variants = {
    primary: 'bg-indigo-500 text-white hover:brightness-[1.2] hover:saturate-[1.1]',
    secondary: 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 hover:text-indigo-300',
    neutral: 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200',
    muted: 'bg-white/[0.03] text-slate-600 hover:text-slate-500',
    vivid: 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white hover:brightness-[1.1] hover:saturate-[1.1]',
    danger: 'bg-rose-500/10 border border-rose-500/25 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500',
    ghost: 'bg-transparent text-slate-500 hover:text-slate-50 hover:bg-white/5',
    glass: 'bg-gray-400/10 backdrop-blur-md border border-gray-400/20 text-gray-400 hover:bg-gray-400/40 hover:text-white hover:border-gray-400',
    'glass-primary': 'bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40 hover:text-white hover:border-indigo-500',
    'glass-danger': 'bg-rose-500/10 backdrop-blur-md border border-rose-500/20 text-rose-400 hover:bg-rose-500/40 hover:text-white hover:border-rose-500'
  };

  const sizes = {
    xs: 'w-[24px] h-[24px]',
    sm: 'w-[28px] h-[28px]',
    md: 'w-[36px] h-[36px]',
    lg: 'w-[44px] h-[44px]',
    xl: 'w-[52px] h-[52px]'
  };

  const defaultIconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };

  const finalIconSize = iconSize || defaultIconSizes[size];
  const finalRoundedStyle = rounded ? 'rounded-full' : roundedStyles[size];
  
  const hoverStyles = {
    none: '',
    scale: 'hover:scale-110',
    brightness: 'hover:brightness-110',
    saturate: 'hover:saturate-150'
  };

  const combinedClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    finalRoundedStyle,
    hoverStyles[hoverEffect],
    className
  );

  return (
    <button className={combinedClasses} {...props}>
      <Icon size={finalIconSize} {...iconProps} className={cn(iconClassName, iconProps?.className)} strokeWidth={strokeWidth}/>
    </button>
  );
};
