'use client';

import { useState, useMemo, useCallback } from 'react';
import { Asset } from '../types/asset';
import { mockAssets } from '../data/mockAssets';

type FilterType = 'all' | 'recent' | 'favorites';

export function useAssets() {
  const [assets] = useState<Asset[]>(mockAssets);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const filteredAssets = useMemo(() => {
    switch (filter) {
      case 'recent':
        return [...assets].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 6);
      case 'favorites':
        return assets.filter(a => a.isFavorite);
      default:
        return assets;
    }
  }, [assets, filter]);

  const openDetail = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedAsset(null);
  }, []);

  return { assets: filteredAssets, filter, setFilter, selectedAsset, openDetail, closeDetail };
}
