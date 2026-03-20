import React from 'react';
import { cn } from '../../lib/utils';

export interface NVFormGroupProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
  spacing?: 'xs' | 'sm' | 'md';
}

export const NVFormGroup: React.FC<NVFormGroupProps> = ({
  label,
  children,
  className = '',
  labelClassName = '',
  spacing = 'sm'
}) => {
  const spacingStyles = {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-3'
  };

  return (
    <div className={cn(spacingStyles[spacing], className)}>
      {label && (
        <label className={cn(
          "text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1 block mb-1.5",
          labelClassName
        )}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
};
