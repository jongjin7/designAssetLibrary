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
  const { assets: allAssets, isSearchVisible: storeIsSearchVisible, setIsSearchVisible } = useAssetStore();
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

  const subFolders = useMemo(() => {
    // 하위 폴더 노출 조건: '전체' 뷰이거나 특정 '폴더' 뷰일 때만
    if (filter !== 'all' && filter !== 'folder') return [];
    
    const filteredFolders = folders.filter(f => f.parentId === folderId);
    
    // 정렬 로직: 스마트 폴더 우선 -> 이름순(A-Z) -> 최신순
    return [...filteredFolders].sort((a, b) => {
      // 1. 스마트 폴더(스페셜 그룹)를 상단에 고정
      if (a.isSmartFolder && !b.isSmartFolder) return -1;
      if (!a.isSmartFolder && b.isSmartFolder) return 1;
      
      // 2. 가나다순/알파벳순 정렬
      const nameCompare = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
      if (nameCompare !== 0) return nameCompare;
      
      // 3. 이름이 같다면 최신순 정렬
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [folders, folderId, filter]);

  const commonProps = {
    assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail,
    deleteAsset, updateAsset, addAsset, moveAssets, isMoving,
    selectedIds, setSelectedIds,
    searchText, setSearchText, isFilterOpen, setIsFilterOpen,
    filteredAssets, handleFilterApply, handleFilterReset,
    isSearchVisible, onSearchToggle,
    zoom, setZoom,
    subFolders,
    allAssets,
    setFolderId, // 폴더 이동을 위해 추가
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
