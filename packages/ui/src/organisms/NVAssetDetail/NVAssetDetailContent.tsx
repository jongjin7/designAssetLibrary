'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { Asset } from '../../types/asset';
import { useAssetColors } from './hooks/useAssetColors';
import { NVAssetDetailHeader } from './parts/NVAssetDetailHeader';
import { NVAssetDetailPreview } from './parts/NVAssetDetailPreview';
import { NVAssetDetailInfo } from './parts/NVAssetDetailInfo';
import { NVAssetDetailColors } from './parts/NVAssetDetailColors';
import { NVAssetDetailTags } from './parts/NVAssetDetailTags';
import { NVAssetDetailFooter } from './parts/NVAssetDetailFooter';

interface NVAssetDetailContentProps {
  asset: Asset;
  onClose?: () => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Asset>) => void;
  onExtractAI?: (imageUrl: string) => Promise<string[]>;
  onExtractBasic?: (imageUrl: string) => Promise<string[]>;
  onShare?: (asset: Asset) => void;
  isInspector?: boolean;
  className?: string;
}

export function NVAssetDetailContent({ 
  asset, 
  onClose, 
  onDelete, 
  onMove, 
  onUpdate,
  onExtractAI,
  onExtractBasic,
  onShare,
  isInspector = false,
  className = ''
}: NVAssetDetailContentProps) {
  const { 
    palette, 
    isExtracting, 
    isAiRefined, 
    handleAIExtraction 
  } = useAssetColors({
    asset,
    onUpdate,
    onExtractAI,
    onExtractBasic
  });

  return (
    <div className={cn(
      "flex flex-col bg-[#0A0C13]", 
      isInspector ? "h-full" : "max-h-[90vh]", 
      className
    )}>
      {isInspector && (
        <NVAssetDetailHeader title="Asset Detail" onClose={onClose} />
      )}

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className={cn(
          "min-h-full flex flex-col",
          isInspector ? "justify-center py-12" : "pb-3"
        )}>
          <NVAssetDetailPreview asset={asset} isInspector={isInspector} />
          <NVAssetDetailInfo asset={asset} />
          <div className="h-px bg-white/[0.04] mx-5 mb-3" />
          <NVAssetDetailColors 
            palette={palette} 
            isAiRefined={isAiRefined} 
            isExtracting={isExtracting} 
            onExtractAI={handleAIExtraction} 
          />
          <NVAssetDetailTags tags={asset.tags} />
        </div>
      </div>

      <NVAssetDetailFooter 
        isInspector={isInspector} 
        onShare={() => onShare?.(asset)}
        onMove={() => onMove?.(asset.id)}
        onDelete={() => onDelete?.(asset.id)}
      />
    </div>
  );
}
