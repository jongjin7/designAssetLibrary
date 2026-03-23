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
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const refreshAssets = useCallback(async () => {
    // We don't want to set loading to true every time on resize if we already have data
    if (assets.length === 0) setLoading(true);
    try {
      const data = await assetRepository.getAssets();
      setAssets(data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  }, [assets.length]);

  useEffect(() => {
    setMounted(true);
    refreshAssets();
  }, [refreshAssets]);

  const selectedAsset = useMemo(() => 
    assets.find(a => a.id === selectedAssetId) || null
  , [assets, selectedAssetId]);

  const addAsset = useCallback(async (asset: Partial<Asset>, file?: Blob) => {
    try {
      const newAsset = await assetRepository.saveAsset(asset, file);
      await refreshAssets();
      return newAsset;
    } catch (error) {
      console.error('Failed to add asset:', error);
    }
  }, [refreshAssets]);

  const filteredAssets = useMemo(() => {
    // On SSR or initial hydration, we might want to show nothing or a skeleton
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
    setSelectedAssetId(asset.id);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedAssetId(null);
  }, []);

  const deleteAsset = useCallback(async (id: string) => {
    try {
      await assetRepository.deleteAsset(id);
      if (selectedAssetId === id) setSelectedAssetId(null);
      await refreshAssets();
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  }, [refreshAssets, selectedAssetId]);
  
  const updateAsset = useCallback(async (id: string, updates: Partial<Asset>) => {
    try {
      await assetRepository.updateAsset(id, updates);
      await refreshAssets();
    } catch (error) {
      console.error('Failed to update asset:', error);
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
    updateAsset,
    toggleFavorite,
    loading,
    mounted 
  };
}
