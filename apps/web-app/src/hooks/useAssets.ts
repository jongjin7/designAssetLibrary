'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Asset } from '../types/asset';
import { assetRepository } from '../lib/dataService';

type FilterType = 'all' | 'recent' | 'favorites';

export function useAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const refreshAssets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await assetRepository.getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    refreshAssets();
  }, [refreshAssets]);

  const addAsset = useCallback(async (asset: Partial<Asset>, file?: Blob) => {
    try {
      await assetRepository.saveAsset(asset, file);
      await refreshAssets();
    } catch (error) {
      console.error('Failed to add asset:', error);
    }
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

  const deleteAsset = useCallback(async (id: string) => {
    try {
      await assetRepository.deleteAsset(id);
      await refreshAssets();
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  }, [refreshAssets]);

  const toggleFavorite = useCallback(async (id: string) => {
    try {
      await assetRepository.toggleFavorite(id);
      await refreshAssets();
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  }, [refreshAssets]);

  return { 
    assets: filteredAssets, 
    filter, 
    setFilter, 
    selectedAsset, 
    openDetail, 
    closeDetail, 
    addAsset,
    deleteAsset,
    toggleFavorite,
    loading,
    mounted 
  };
}
