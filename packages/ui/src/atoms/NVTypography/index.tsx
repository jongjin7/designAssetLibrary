import React from 'react';
import { cn } from '../../lib/utils';

export type NVTypographyVariant = 
  | 'hero' 
  | 'header' 
  | 'body' 
  | 'secondary' 
  | 'label' 
  | 'caption';

interface NVTypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: NVTypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label' | 'div';
}

const variantMap: Record<NVTypographyVariant, string> = {
  hero: "text-4xl font-extrabold tracking-tighter",
  header: "text-2xl font-extrabold tracking-tight",
  body: "text-base font-normal leading-relaxed text-slate-100",
  secondary: "text-xs font-semibold text-slate-400",
  label: "text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none",
  caption: "text-[10px] font-medium text-slate-600 uppercase tracking-widest leading-relaxed",
};

export const NVTypography: React.FC<NVTypographyProps> = ({
  variant = 'body',
  children,
  className,
  as,
  ...props
}) => {
  const Component = as || (
    variant === 'hero' ? 'h1' : 
    variant === 'header' ? 'h2' : 
    variant === 'label' ? 'label' : 'p'
  ) as any;

  return (
    <Component className={cn(variantMap[variant], className)} {...props}>
      {children}
    </Component>
  );
};
