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
  if (!asset) return null;

  return (
    <NVBottomSheet isOpen={!!asset} onClose={onClose}>
      <NVAssetDetailContent 
        asset={asset} 
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
