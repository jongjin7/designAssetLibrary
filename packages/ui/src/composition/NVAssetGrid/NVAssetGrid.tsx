import React from 'react';

import { cn } from '../../lib/utils';

export interface NVAssetGridProps {
  children: React.ReactNode;
  className?: string;
  zoom?: number;
}

export const NVAssetGrid: React.FC<NVAssetGridProps> = ({ children, className = '', zoom = 50 }) => {
  // Calculate column width based on zoom (0-100)
  // Mapping 0 -> 150px, 50 -> 260px, 100 -> 365px
  const columnWidth = 150 + (zoom * 2.2);

  return (
    <div 
      className={cn(
        "gap-4 space-y-4",
        className
      )}
      style={{
        columnWidth: `${columnWidth}px`,
        columnGap: '1rem',
      } as React.CSSProperties}
    >
      {React.Children.map(children, child => (
        <div className="break-inside-avoid mb-4">
          {child}
        </div>
      ))}
    </div>
  );
};
