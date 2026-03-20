import React from 'react';

import { cn } from '../../lib/utils';

export interface NVAssetGridProps {
  children: React.ReactNode;
  className?: string;
}

export const NVAssetGrid: React.FC<NVAssetGridProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={cn(
        "columns-[180px] sm:columns-[220px] md:columns-[240px]",
        "gap-4 space-y-4 px-1",
        className
      )}
    >
      {React.Children.map(children, child => (
        <div className="break-inside-avoid mb-4">
          {child}
        </div>
      ))}
    </div>
  );
};
