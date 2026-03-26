'use client';

import { useIsDesktop } from '@nova/hooks/useIsDesktop';
import DesktopLibraryView from '@nova/app/(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '@nova/app/(mobile)/library/MobileLibraryView';
import { MobileShell } from '@nova/components/layout/MobileShell';
import { usePathname } from 'next/navigation';
import { DesktopShell } from '@nova/components/layout/DesktopShell';

import { useState, useEffect, useRef } from 'react';
import { useAssets } from '@nova/hooks/useAssets';
import { useLibraryFilters } from '@nova/hooks/useLibraryFilters';
import { useAssetSelection } from '@nova/hooks/useAssetSelection';
import { SearchPalette } from '@nova/components/library/SearchPalette';
import { NVLoadingState, NVSplashScreen } from '@nova/ui';

export default function UnifiedLibraryPage() {

  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  
  // Lifted state to persist across mobile <-> desktop transitions
  const { assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset, addAsset } = useAssets();

  const { 
    searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset 
  } = useLibraryFilters(assets);
  const { selectedIds, setSelectedIds } = useAssetSelection();
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [zoom, setZoom] = useState(50);

  const prevIsDesktopRef = useRef<boolean | null>(null);

  // Reset all transient UI states ONLY when switching between mobile and desktop
  useEffect(() => {
    // Skip if isDesktop is still null
    if (isDesktop === null) return;
    
    // Initial mount: set the ref and skip reset if it's already in the correct state
    if (prevIsDesktopRef.current === null) {
      prevIsDesktopRef.current = isDesktop;
      return;
    }

    // Only reset if the mode has actually changed
    if (prevIsDesktopRef.current !== isDesktop) {
      // Reset zoom to 0 when moving to mobile view
      if (!isDesktop) {
        setZoom(50);
      }
      
      closeDetail();
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      setIsSearchVisible(false);
      setIsFilterOpen(false);
      setSearchText('');
      setFilter('all');
      handleFilterReset();
      
      prevIsDesktopRef.current = isDesktop;
    }
  }, [isDesktop, closeDetail, setSelectedIds, setIsSelectionMode, setIsSearchVisible, setIsFilterOpen, setSearchText, setFilter, handleFilterReset, setZoom]);

  // Prevent flash of wrong view before isDesktop is detected on mount
  if (isDesktop === null || (loading && assets.length === 0)) {
     return <NVSplashScreen message="라이브러리 에셋 동기화 중..." mode="syncing" />;
  }

  const commonProps = {
    assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset, addAsset,
    selectedIds, setSelectedIds,
    searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset,
    isSearchVisible, 
    onSearchToggle: () => setIsSearchVisible(!isSearchVisible),
    zoom,
    setZoom
  };

  if (isDesktop) {
    return (
      <DesktopShell onSearchToggle={() => setIsSearchVisible(!isSearchVisible)}>
        <DesktopLibraryView 
          {...commonProps} 
        />
        <SearchPalette 
          isOpen={isSearchVisible} 
          onClose={() => setIsSearchVisible(false)}
          value={searchText}
          onChange={setSearchText}
        />
      </DesktopShell>
    );
  }

  return (
    <MobileShell 
      showTabs={!pathname.includes('/capture')}
    >
      <MobileLibraryView 
        {...commonProps} 
        isSelectionMode={isSelectionMode} 
        setIsSelectionMode={setIsSelectionMode} 
      />
    </MobileShell>
  );
}

