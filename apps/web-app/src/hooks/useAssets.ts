'use client';

import { useState, useMemo, useEffect } from 'react';
import { Asset } from '@nova/types/asset';
import { Folder } from '@nova/types/folder';
import { useAssetStore } from '../store/useAssetStore';

type FilterType = 'all' | 'recent' | 'favorites' | 'inbox' | 'folder';

export function useAssets(allFolders: Folder[] = [], options: { initialFilter?: FilterType, initialFolderId?: string | null } = {}) {
  const { 
    assets: rawAssets, 
    loading, 
    refreshAssets, 
    addAsset, 
    deleteAsset, 
    updateAsset, 
    toggleFavorite,
    isMoving,
    moveAssets,
    filter,
    setFilter,
    folderId,
    setFolderId,
    searchText,
    setSearchText,
    isFilterOpen,
    setIsFilterOpen,
    setIsSearchVisible
  } = useAssetStore();
  
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Use provided initial values as primary source if they differ from store,
  // this ensures that when we navigate to a new route, the list reflects it immediately
  // before the useEffect has a chance to update the global store.
  const effectiveFilter = options.initialFilter || filter;
  const effectiveFolderId = options.initialFolderId !== undefined ? options.initialFolderId : folderId;

  useEffect(() => {
    setMounted(true);
    refreshAssets();
  }, [refreshAssets]);

  // Sync store with page intent
  useEffect(() => {
    if (options.initialFilter && options.initialFilter !== filter) {
      setFilter(options.initialFilter);
    }
  }, [options.initialFilter, filter, setFilter]);

  useEffect(() => {
    if (options.initialFolderId !== undefined && options.initialFolderId !== folderId) {
      setFolderId(options.initialFolderId);
    }
  }, [options.initialFolderId, folderId, setFolderId]);

  const inboxCount = useMemo(() => 
    rawAssets.filter(a => !a.folderId).length
  , [rawAssets]);

  const selectedAsset = useMemo(() => 
    rawAssets.find(a => a.id === selectedAssetId) || null
  , [rawAssets, selectedAssetId]);

  const filteredAssets = useMemo(() => {
    switch (effectiveFilter) {
      case 'recent':
        return [...rawAssets].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'favorites':
        return rawAssets.filter(a => a.isFavorite);
      case 'inbox':
        return rawAssets.filter(a => !a.folderId);
      case 'folder': {
        if (!effectiveFolderId) return rawAssets;
        const getChildIds = (id: string): string[] => {
          const children = allFolders.filter(f => f.parentId === id);
          return [id, ...children.flatMap(c => getChildIds(c.id))];
        };
        const targetFolderIds = getChildIds(effectiveFolderId);
        return rawAssets.filter(a => a.folderId && targetFolderIds.includes(a.folderId));
      }
      default:
        return rawAssets;
    }
  }, [rawAssets, effectiveFilter, effectiveFolderId, allFolders]);

  return { 
    assets: filteredAssets, 
    filter, 
    setFilter, 
    folderId,
    setFolderId,
    inboxCount,
    selectedAsset, 
    openDetail: (asset: Asset) => setSelectedAssetId(asset.id), 
    closeDetail: () => setSelectedAssetId(null), 
    addAsset,
    deleteAsset,
    updateAsset,
    moveAssets,
    toggleFavorite,
    loading,
    isMoving,
    mounted 
  };
}
