'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Asset } from '../types/asset';
import { mockAssets } from '../data/mockAssets';
import { assetStore } from '../store/assetStore';

type FilterType = 'all' | 'recent' | 'favorites';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const refreshAssets = useCallback(() => {
    setAssets([...assetStore.getAssets()]);
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshAssets();
  }, [refreshAssets]);

  const addAsset = useCallback((asset: Asset) => {
    assetStore.addAsset(asset);
    refreshAssets();
  }, [refreshAssets]);

  const filteredAssets = useMemo(() => {
    if (!mounted) return [];
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
  }, [assets, filter, mounted]);

  const openDetail = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedAsset(null);
  }, []);

  return { 
    assets: filteredAssets, 
    filter, 
    setFilter, 
    selectedAsset, 
    openDetail, 
    closeDetail, 
    addAsset,
    mounted 
  };
}
