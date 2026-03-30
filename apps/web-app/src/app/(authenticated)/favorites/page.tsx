'use client';

import { useIsDesktop } from '@nova/hooks/useIsDesktop';
import DesktopLibraryView from '@nova/app/(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '@nova/app/(mobile)/library/MobileLibraryView';
import { MobileShell } from '@nova/components/layout/MobileShell';
import { usePathname } from 'next/navigation';
import { DesktopShell } from '@nova/components/layout/DesktopShell/index';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAssets } from '@nova/hooks/useAssets';
import { useLibraryFilters } from '@nova/hooks/useLibraryFilters';
import { useAssetSelection } from '@nova/hooks/useAssetSelection';
import { SearchPalette } from '@nova/components/library/SearchPalette';
import { NVSplashScreen } from '@nova/ui';

import { useDesktopShell } from '@nova/components/layout/DesktopShell/index';

export default function FavoritesPage() {
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const desktopShell = useDesktopShell();
  
  const { assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset, addAsset } = useAssets();

  // Filter assets to only include favorites
  const favoriteAssets = useMemo(() => assets.filter(a => a.isFavorite), [assets]);

  const { 
    searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset 
  } = useLibraryFilters(favoriteAssets);
  
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

  if (isDesktop === null || (loading && assets.length === 0)) {
     return <NVSplashScreen message="즐겨찾는 에셋 불러오는 중..." mode="syncing" />;
  }

  const isSearchVisible = isDesktop && desktopShell ? desktopShell.isSearchVisible : isMobileSearchVisible;
  const onSearchToggle = isDesktop && desktopShell ? desktopShell.onSearchToggle : () => setIsMobileSearchVisible(!isMobileSearchVisible);

  const commonProps = {
    assets: favoriteAssets, 
    loading, 
    filter, 
    setFilter, 
    selectedAsset, 
    openDetail, 
    closeDetail, 
    deleteAsset, 
    updateAsset, 
    addAsset,
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
    title: "즐겨찾기"
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
    />
  );
}
