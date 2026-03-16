'use client';

import { useIsDesktop } from '../../hooks/useIsDesktop';
import DashboardView from '../(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '../(mobile)/library/MobileLibraryView';
import { MobileShell } from '../../components/layout/MobileShell';
import { usePathname } from 'next/navigation';
import { DesktopShell } from '../../components/layout/DesktopShell';

import { useState } from 'react';
import { useAssets } from '../../hooks/useAssets';
import { useLibraryFilters } from '../../hooks/useLibraryFilters';
import { useAssetSelection } from '../../hooks/useAssetSelection';

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

  if (isDesktop === null) return null;

  const commonProps = {
    assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset, addAsset,
    selectedIds, setSelectedIds,
    searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset
  };

  if (isDesktop) {
    return (
      <DesktopShell>
        <DashboardView {...commonProps} />
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

