'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useIsDesktop } from './useIsDesktop';
import { useAssets } from './useAssets';
import { useLibraryFilters } from './useLibraryFilters';
import { useAssetSelection } from './useAssetSelection';
import { useFolders } from './useFolders';
import { useAssetStore } from '@nova/store/useAssetStore';
import { useDesktopShell } from '@nova/components/layout/DesktopShell/index';

interface UseLibraryPageConfig {
  initialFilter: string;
  title?: string;
  folderId?: string | null;
}

export function useLibraryPage({ initialFilter, title, folderId = null }: UseLibraryPageConfig) {
  const isDesktop = useIsDesktop();
  const desktopShell = useDesktopShell();
  const { folders } = useFolders();

  const {
    assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail,
    deleteAsset, updateAsset, addAsset, moveAssets, isMoving, setFolderId,
  } = useAssets(folders, {
    initialFilter: initialFilter as any,
    ...(folderId ? { initialFolderId: folderId } : {}),
  });

  useEffect(() => {
    setFilter(initialFilter as any);
    setFolderId(folderId);
  }, [folderId, initialFilter, setFilter, setFolderId]);

  const currentFolder = useMemo(
    () => folders.find(f => f.id === folderId),
    [folders, folderId]
  );

  const {
    searchText, setSearchText, isFilterOpen, setIsFilterOpen,
    filteredAssets, handleFilterApply, handleFilterReset,
  } = useLibraryFilters(assets);

  const { selectedIds, setSelectedIds } = useAssetSelection();
  const { isSearchVisible: storeIsSearchVisible, setIsSearchVisible } = useAssetStore();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [zoom, setZoom] = useState(50);

  const prevIsDesktopRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (isDesktop === null) return;
    if (prevIsDesktopRef.current === null) {
      prevIsDesktopRef.current = isDesktop;
      return;
    }
    if (prevIsDesktopRef.current !== isDesktop) {
      if (!isDesktop) setZoom(50);
      closeDetail();
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      setIsSearchVisible(false);
      setIsFilterOpen(false);
      setSearchText('');
      setFilter(initialFilter as any);
      handleFilterReset();
      prevIsDesktopRef.current = isDesktop;
    }
  }, [isDesktop, closeDetail, setSelectedIds, setIsFilterOpen, setSearchText, setFilter, handleFilterReset, initialFilter]);

  const isSearchVisible = isDesktop && desktopShell
    ? desktopShell.isSearchVisible
    : storeIsSearchVisible;

  const onSearchToggle = isDesktop && desktopShell
    ? desktopShell.onSearchToggle
    : () => setIsSearchVisible((v: boolean) => !v);

  const resolvedTitle = currentFolder?.name || title;

  const commonProps = {
    assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail,
    deleteAsset, updateAsset, addAsset, moveAssets, isMoving,
    selectedIds, setSelectedIds,
    searchText, setSearchText, isFilterOpen, setIsFilterOpen,
    filteredAssets, handleFilterApply, handleFilterReset,
    isSearchVisible, onSearchToggle,
    zoom, setZoom,
    ...(resolvedTitle ? { title: resolvedTitle } : {}),
  };

  return {
    isDesktop,
    desktopShell,
    loading,
    assets,
    isSelectionMode,
    setIsSelectionMode,
    commonProps,
  };
}
