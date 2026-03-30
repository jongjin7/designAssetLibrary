'use client';

import { useIsDesktop } from '@nova/hooks/useIsDesktop';
import DesktopLibraryView from '@nova/app/(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '@nova/app/(mobile)/library/MobileLibraryView';
import { useParams, usePathname } from 'next/navigation';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAssets } from '@nova/hooks/useAssets';
import { useFolders } from '@nova/hooks/useFolders';
import { useLibraryFilters } from '@nova/hooks/useLibraryFilters';
import { useAssetSelection } from '@nova/hooks/useAssetSelection';
import { SearchPalette } from '@nova/components/library/SearchPalette';
import { NVSplashScreen } from '@nova/ui';

import { useDesktopShell } from '@nova/components/layout/DesktopShell/index';

export default function FolderPage() {
  const params = useParams();
  const folderId = params?.id as string;
  const isDesktop = useIsDesktop();
  const desktopShell = useDesktopShell();
  const { folders } = useFolders();
  
  const { 
    assets: filteredAssetsRaw, 
    loading, 
    filter, 
    setFilter, 
    setFolderId,
    selectedAsset, 
    openDetail, 
    closeDetail, 
    deleteAsset, 
    updateAsset, 
    addAsset,
    moveAssets,
    isMoving
  } = useAssets(folders, { initialFilter: 'folder', initialFolderId: folderId });

  useEffect(() => {
     setFilter('folder');
     setFolderId(folderId);
  }, [folderId, setFilter, setFolderId]);

  // Find current folder info
  const currentFolder = useMemo(() => 
    folders.find(f => f.id === folderId)
  , [folders, folderId]);

  const { 
    searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset 
  } = useLibraryFilters(filteredAssetsRaw);
  
  const { selectedIds, setSelectedIds } = useAssetSelection();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
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
      setIsMobileSearchVisible(false);
      setIsFilterOpen(false);
      setSearchText('');
      setFilter('all');
      handleFilterReset();
      prevIsDesktopRef.current = isDesktop;
    }
  }, [isDesktop, closeDetail, setSelectedIds, setIsSelectionMode, setIsMobileSearchVisible, setIsFilterOpen, setSearchText, setFilter, handleFilterReset, setZoom]);

  if (isDesktop === null || (loading && filteredAssetsRaw.length === 0)) {
     return <NVSplashScreen message="폴더 에셋 불러오는 중..." mode="syncing" />;
  }

  const isSearchVisible = isDesktop && desktopShell ? desktopShell.isSearchVisible : isMobileSearchVisible;
  const onSearchToggle = isDesktop && desktopShell ? desktopShell.onSearchToggle : () => setIsMobileSearchVisible(!isMobileSearchVisible);

  const commonProps = {
    assets: filteredAssetsRaw, 
    loading, 
    filter, 
    setFilter, 
    selectedAsset, 
    openDetail, 
    closeDetail, 
    deleteAsset, 
    updateAsset, 
    addAsset,
    moveAssets,
    isMoving,
    selectedIds, 
    setSelectedIds,
    searchText, 
    setSearchText, 
    isFilterOpen, 
    setIsFilterOpen, 
    filteredAssets, 
    handleFilterApply, 
    handleFilterReset,
    isSearchVisible, 
    onSearchToggle,
    zoom,
    setZoom,
    title: currentFolder?.name || "폴더"
  };

  if (isDesktop) {
    return (
      <>
        <DesktopLibraryView {...commonProps} />
        <SearchPalette 
          isOpen={isSearchVisible} 
          onClose={() => desktopShell?.setIsSearchVisible(false)}
          value={searchText}
          onChange={setSearchText}
        />
      </>
    );
  }

  return (
    <MobileLibraryView 
      {...commonProps} 
      isSelectionMode={isSelectionMode} 
      setIsSelectionMode={setIsSelectionMode} 
      activeKey={`folder_${folderId}`}
    />
  );
}
