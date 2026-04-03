'use client';

import { useAssetStore } from '../store/useAssetStore';

/**
 * useFolders is now a stable hook that consumes the global AssetStore.
 * This ensures that folder data is persistent across all pages and layouts,
 * eliminating the 'blink' effect caused by local state re-fetching.
 */
export function useFolders() {
  const {
    folders,
    fetchFolders,
    createFolder,
    deleteFolder,
    moveFolder,
    renameFolder,
    copyFolder,
  } = useAssetStore();

  return {
    folders,
    loading: false,
    fetchFolders,
    createFolder,
    deleteFolder,
    moveFolder,
    renameFolder,
    copyFolder,
  };
}
