import React from 'react';
import { cn } from '../../lib/utils';

export type NVLogoSize = 'xs' | 'sm' | 'md' | 'lg';

interface NVLogoProps {
  className?: string;
  size?: NVLogoSize;
}

const sizeMap: Record<NVLogoSize, string> = {
  xs: 'text-sm',
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-3xl font-black tracking-[-0.05em]',
};

export const NVLogo: React.FC<NVLogoProps> = ({ 
  size = 'md', 
  className 
}) => {
  return (
    <span className={cn(
      "font-black tracking-tighter bg-gradient-to-br from-indigo-400 via-indigo-500 to-cyan-400 bg-clip-text text-transparent select-none py-1",
      sizeMap[size] || size,
      className
    )}>
      Trove
    </span>
  );
};
