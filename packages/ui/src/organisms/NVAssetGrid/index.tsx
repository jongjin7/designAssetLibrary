import React from 'react';

export interface NVAssetGridProps {
  children: React.ReactNode;
  className?: string;
}

export const NVAssetGrid: React.FC<NVAssetGridProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        columns-2 md:columns-3 lg:columns-2 xl:columns-3 2xl:columns-5
        gap-4 space-y-4
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {children}
    </div>
  );
};
