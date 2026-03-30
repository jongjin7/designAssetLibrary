'use client';

import { useState, useMemo, useEffect } from 'react';
import { Asset } from '@nova/types/asset';
import { Folder } from '@nova/types/folder';
import { useAssetStore } from '../store/useAssetStore';

type FilterType = 'all' | 'recent' | 'favorites' | 'inbox' | 'folder';

export function useAssets(allFolders: Folder[] = []) {
  const { 
    assets: rawAssets, 
    loading, 
    refreshAssets, 
    addAsset, 
    deleteAsset, 
    updateAsset, 
    toggleFavorite,
    isMoving,
    moveAssets
  } = useAssetStore();
  
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [folderId, setFolderId] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    refreshAssets();
  }, [refreshAssets]);

  const inboxCount = useMemo(() => 
    rawAssets.filter(a => !a.folderId).length
  , [rawAssets]);

  const selectedAsset = useMemo(() => 
    rawAssets.find(a => a.id === selectedAssetId) || null
  , [rawAssets, selectedAssetId]);

  const filteredAssets = useMemo(() => {
    if (!mounted) return [];
    
    switch (filter) {
      case 'recent':
        return [...rawAssets].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'favorites':
        return rawAssets.filter(a => a.isFavorite);
      case 'inbox':
        return rawAssets.filter(a => !a.folderId);
      case 'folder': {
        if (!folderId) return rawAssets;
        const getChildIds = (id: string): string[] => {
          const children = allFolders.filter(f => f.parentId === id);
          return [id, ...children.flatMap(c => getChildIds(c.id))];
        };
        const targetFolderIds = getChildIds(folderId);
        return rawAssets.filter(a => a.folderId && targetFolderIds.includes(a.folderId));
      }
      default:
        return rawAssets;
    }
  }, [rawAssets, filter, folderId, mounted, allFolders]);

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
