'use client';

import React from 'react';
import { Asset } from '../../types/asset';
import { NVBottomSheet } from '../../molecules/NVBottomSheet';
import { NVAssetDetailContent } from './NVAssetDetailContent';

interface NVAssetDetailProps {
  asset: Asset | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Asset>) => void;
  onExtractAI?: (imageUrl: string) => Promise<string[]>;
  onExtractBasic?: (imageUrl: string) => Promise<string[]>;
}

export function NVAssetDetail({ 
  asset, 
  onClose, 
  onDelete, 
  onMove, 
  onUpdate,
  onExtractAI,
  onExtractBasic
}: NVAssetDetailProps) {
  const [lastAsset, setLastAsset] = React.useState<Asset | null>(asset);

  React.useEffect(() => {
    if (asset) {
      setLastAsset(asset);
    } else {
      // Clear after the transition time (300~400ms) to unmount
      const timer = setTimeout(() => setLastAsset(null), 500);
      return () => clearTimeout(timer);
    }
  }, [asset]);

  // Keep rendering if we have a lastAsset, letting NVBottomSheet handle the transition based on isOpen prop
  if (!asset && !lastAsset) return null;

  return (
    <NVBottomSheet isOpen={!!asset} onClose={onClose}>
      <NVAssetDetailContent 
        asset={asset || lastAsset!} 
        onClose={onClose} 
        onDelete={onDelete} 
        onMove={onMove} 
        onUpdate={onUpdate}
        onExtractAI={onExtractAI}
        onExtractBasic={onExtractBasic}
      />
    </NVBottomSheet>
  );
}
