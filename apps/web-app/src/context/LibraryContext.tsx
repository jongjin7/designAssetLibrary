'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Asset } from '@nova/types/asset';
import { assetRepository } from '@nova/lib/dataService';
import { Folder } from '@nova/types/folder';
import { useFolders } from '@nova/hooks';

interface LibraryContextType {
  assets: Asset[];
  loading: boolean;
  refreshAssets: () => Promise<void>;
  addAsset: (asset: Partial<Asset>, file?: Blob) => Promise<Asset | undefined>;
  deleteAsset: (id: string) => Promise<void>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  getFolderCount: (folderId: string) => number;
  inboxCount: number;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const { folders } = useFolders();

  const refreshAssets = useCallback(async () => {
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
    refreshAssets();
  }, [refreshAssets]);

  const inboxCount = useMemo(() => 
    assets.filter(a => !a.folderId).length
  , [assets]);

  const getFolderCount = useCallback((folderId: string) => {
    const getChildIds = (id: string): string[] => {
      const children = folders.filter(f => f.parentId === id);
      return [id, ...children.flatMap(c => getChildIds(c.id))];
    };
    const targetFolderIds = getChildIds(folderId);
    return assets.filter(a => a.folderId && targetFolderIds.includes(a.folderId)).length;
  }, [assets, folders]);

  const addAsset = async (asset: Partial<Asset>, file?: Blob) => {
    const newAsset = await assetRepository.saveAsset(asset, file);
    await refreshAssets();
    return newAsset;
  };

  const deleteAsset = async (id: string) => {
    await assetRepository.deleteAsset(id);
    await refreshAssets();
  };

  const updateAsset = async (id: string, updates: Partial<Asset>) => {
    await assetRepository.updateAsset(id, updates);
    await refreshAssets();
  };

  const toggleFavorite = async (id: string) => {
    await assetRepository.toggleFavorite(id);
    await refreshAssets();
  };

  return (
    <LibraryContext.Provider value={{
      assets,
      loading,
      refreshAssets,
      addAsset,
      deleteAsset,
      updateAsset,
      toggleFavorite,
      getFolderCount,
      inboxCount
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
