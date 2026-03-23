import React from 'react';

import { cn } from '../../lib/utils';

export interface NVAssetGridProps {
  children: React.ReactNode;
  className?: string;
  zoom?: number;
  isMobile?: boolean;
}

export const NVAssetGrid: React.FC<NVAssetGridProps> = ({ children, className = '', zoom = 50, isMobile = false }) => {
  // Calculate column width based on zoom (0-100) and device type
  // Mobile: Mapping 0 -> 125px, 50 -> 150px, 100 -> 175px (Mostly 2 columns)
  // Desktop: Mapping 0 -> 150px, 50 -> 260px, 100 -> 365px (Varied)
  const columnWidth = isMobile 
    ? 125 + (zoom * 0.5) 
    : 150 + (zoom * 1.5);

  return (
    <div 
      className={cn(
        isMobile? "gap-3 space-y-3" : "gap-4 space-y-4",
        className
      )}
      style={{
        columnWidth: `${columnWidth}px`,
      } as React.CSSProperties}
    >
      {React.Children.map(children, child => (
        <div className="break-inside-avoid">
          {child}
        </div>
      ))}
    </div>
  );
};
