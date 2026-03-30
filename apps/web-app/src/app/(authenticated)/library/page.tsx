'use client';

import { useIsDesktop } from '@nova/hooks/useIsDesktop';
import DesktopLibraryView from '@nova/app/(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '@nova/app/(mobile)/library/MobileLibraryView';
import { MobileShell } from '@nova/components/layout/MobileShell';
import { usePathname } from 'next/navigation';

import { useState, useEffect, useRef } from 'react';
import { useAssets } from '@nova/hooks/useAssets';
import { useLibraryFilters } from '@nova/hooks/useLibraryFilters';
import { useAssetSelection } from '@nova/hooks/useAssetSelection';
import { SearchPalette } from '@nova/components/library/SearchPalette';
import { NVLoadingState, NVSplashScreen } from '@nova/ui';

import { useDesktopShell } from '@nova/components/layout/DesktopShell/index';

export default function UnifiedLibraryPage() {

  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const desktopShell = useDesktopShell();
  
  // Lifted state to persist across mobile <-> desktop transitions
  const { assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset, addAsset, moveAssets, isMoving } = useAssets([], { initialFilter: 'all' });

  const { 
    searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset 
  } = useLibraryFilters(assets);
  const { selectedIds, setSelectedIds } = useAssetSelection();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // Local search state for mobile, for desktop we use desktopShell context
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(false);
  const [zoom, setZoom] = useState(50);

  const prevIsDesktopRef = useRef<boolean | null>(null);

  // Reset all transient UI states ONLY when switching between mobile and desktop
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

  // Prevent flash of wrong view before isDesktop is detected on mount
  if (isDesktop === null || (loading && assets.length === 0)) {
     return <NVSplashScreen message="라이브러리 에셋 동기화 중..." mode="syncing" />;
  }

  const isSearchVisible = isDesktop && desktopShell ? desktopShell.isSearchVisible : isMobileSearchVisible;
  const onSearchToggle = isDesktop && desktopShell ? desktopShell.onSearchToggle : () => setIsMobileSearchVisible(!isMobileSearchVisible);

  const commonProps = {
    assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset, addAsset, moveAssets, isMoving,
    selectedIds, setSelectedIds,
    searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset,
    isSearchVisible, 
    onSearchToggle,
    zoom,
    setZoom
  };

  if (isDesktop) {
    return (
      <>
        <DesktopLibraryView 
          {...commonProps} 
        />
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

