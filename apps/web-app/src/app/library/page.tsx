'use client';

import { useIsDesktop } from '../../hooks/useIsDesktop';
import DesktopLibraryView from '../(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '../(mobile)/library/MobileLibraryView';
import { MobileShell } from '../../components/layout/MobileShell';
import { usePathname } from 'next/navigation';
import { DesktopShell } from '../../components/layout/DesktopShell';

import { useState, useEffect } from 'react';
import { useAssets } from '../../hooks/useAssets';
import { useLibraryFilters } from '../../hooks/useLibraryFilters';
import { useAssetSelection } from '../../hooks/useAssetSelection';
import { SearchPalette } from '../../components/library/SearchPalette';
import { NVLoadingState } from '@nova/ui';

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

  // Reset all transient UI states when switching between mobile and desktop as per user UX preference
  useEffect(() => {
    if (isDesktop !== null) {
      closeDetail();
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      setIsSearchVisible(false);
      setIsFilterOpen(false);
      setSearchText('');
      setFilter('all');
      handleFilterReset();
    }
  }, [isDesktop, closeDetail, setSelectedIds, setIsSelectionMode, setIsSearchVisible, setIsFilterOpen, setSearchText, setFilter, handleFilterReset]);

  // Prevent flash of wrong view before isDesktop is detected on mount
  if (isDesktop === null) {
     return (
       <div className="fixed inset-0 flex items-center justify-center bg-slate-950 z-[100]">
         <NVLoadingState message="NOVA 라이브러리 준비 중..." />
       </div>
     );
  }

  const commonProps = {
    assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset, addAsset,
    selectedIds, setSelectedIds,
    searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset,
    isSearchVisible, 
    onSearchToggle: () => setIsSearchVisible(!isSearchVisible)
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

