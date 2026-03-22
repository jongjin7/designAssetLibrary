'use client';

import { useState, useEffect } from 'react';
import { Asset } from '../../../types/asset';

interface UseAssetColorsProps {
  asset: Asset;
  onUpdate?: (id: string, updates: Partial<Asset>) => void;
  onExtractAI?: (imageUrl: string) => Promise<string[]>;
  onExtractBasic?: (imageUrl: string) => Promise<string[]>;
}

export function useAssetColors({ 
  asset, 
  onUpdate, 
  onExtractAI, 
  onExtractBasic 
}: UseAssetColorsProps) {
  const [palette, setPalette] = useState<string[]>(asset.palette || []);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAiRefined, setIsAiRefined] = useState(false);

  useEffect(() => {
    setPalette(asset.palette || []);
    setIsAiRefined(false);
    
    // Auto-extract if palette is empty
    if (asset.thumbnail && (!asset.palette || asset.palette.length === 0)) {
      handleBasicExtraction();
    }
  }, [asset.id, asset.palette]);

  const handleBasicExtraction = async () => {
    if (!asset.thumbnail || !onExtractBasic) return;
    try {
      const extracted = await onExtractBasic(asset.thumbnail);
      setPalette(extracted);
      if (!asset.palette || asset.palette.length === 0) {
        onUpdate?.(asset.id, { palette: extracted });
      }
    } catch (err) {
      console.warn('Basic color extraction failed:', err);
    }
  };

  const handleAIExtraction = async () => {
    if (!asset.thumbnail || !onExtractAI) return;
    
    setIsExtracting(true);
    try {
      const extracted = await onExtractAI(asset.thumbnail);
      setPalette(extracted);
      setIsAiRefined(true);
      onUpdate?.(asset.id, { palette: extracted });
    } catch (err) {
      console.warn('AI Color extraction failed:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  return {
    palette,
    isExtracting,
    isAiRefined,
    handleAIExtraction,
    handleBasicExtraction
  };
}
