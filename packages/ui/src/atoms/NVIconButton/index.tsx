import React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NVIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'vivid' | 'danger' | 'ghost' | 'glass' | 'glass-primary'|'glass-danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  iconSize?: number;
  iconProps?: LucideProps;
  strokeWidth?: number;
  iconClassName?: string;
}

export const NVIconButton: React.FC<NVIconButtonProps> = ({ 
  icon: Icon, 
  variant = 'secondary', 
  size = 'md', 
  iconSize,
  iconProps,
  iconClassName,
  className = '', 
  strokeWidth=2,
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
    primary: 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white hover:brightness-[1.2] hover:saturate-[1.1]',
    secondary: 'bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 hover:text-indigo-300',
    vivid: 'bg-gradient-to-br from-cyan-400 to-cyan-600 text-white hover:brightness-[1.1] hover:saturate-[1.1]',
    danger: 'bg-rose-500/10 border border-rose-500/25 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500',
    ghost: 'bg-transparent text-slate-500 hover:text-slate-50 hover:bg-white/5',
    glass: 'bg-white/5 backdrop-blur-md border border-white/10 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/20',
    'glass-primary': 'bg-indigo-500/10 backdrop-blur-md border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/40 hover:text-white hover:border-indigo-500',
    'glass-danger': 'bg-rose-500/5 backdrop-blur-md border border-rose-500/20 text-rose-400 hover:bg-rose-500/40 hover:text-white hover:border-rose-500'
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
      <Icon size={finalIconSize} {...iconProps} className={cn(iconClassName, iconProps?.className)} strokeWidth={strokeWidth}/>
    </button>
  );
};
