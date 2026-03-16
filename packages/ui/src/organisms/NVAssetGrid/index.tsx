import React from 'react';

export interface NVAssetGridProps {
  children: React.ReactNode;
  className?: string;
}

export const NVAssetGrid: React.FC<NVAssetGridProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5
        gap-6  
        ${className}
      `.replace(/\s+/g, ' ').trim()}
    >
      {children}
    </div>
  );
};
