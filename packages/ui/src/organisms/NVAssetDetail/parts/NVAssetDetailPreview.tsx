'use client';

import React from 'react';
import { Asset } from '../../../types/asset';
import { cn } from '../../../lib/utils';

interface NVAssetDetailPreviewProps {
  asset: Asset;
  isInspector?: boolean;
  className?: string;
}

export function NVAssetDetailPreview({ asset, isInspector = false, className = '' }: NVAssetDetailPreviewProps) {
  return (
    <div className={cn("relative w-full aspect-[4/3] bg-black shrink-0", className)}>
      {asset.thumbnail ? (
        <img 
          src={asset.thumbnail} 
          alt={asset.fileName} 
          className="w-full h-full object-contain" 
        />
      ) : (
        <div 
          className="w-full h-full opacity-20" 
          style={{ background: asset.thumbnailGradient }} 
        />
      )}
      {!isInspector && (
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0C13] to-transparent pointer-events-none" />
      )}
    </div>
  );
}
