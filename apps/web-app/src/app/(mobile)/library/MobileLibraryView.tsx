'use client';

import { useState } from 'react';
import { useLibraryFilters } from '../../../hooks/useLibraryFilters';
import { TopBar } from '../../../components/layout/TopBar';
import { LibraryControls } from '../../../components/library/LibraryControls';
import { AssetSelectionBar } from '../../../components/library/AssetSelectionBar';
import { FilterChips } from '../../../components/library/FilterChips';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { NVLoadingState } from '@nova/ui';
import { AssetDetail } from '../../../components/detail/AssetDetail';
import { Asset } from '../../../types/asset';

interface MobileLibraryViewProps {
  assets: Asset[];
  loading: boolean;
  filter: string;
  setFilter: (f: any) => void;
  selectedAsset: any;
  openDetail: (asset: any) => void;
  closeDetail: () => void;
  deleteAsset: (id: string) => Promise<void>;
  updateAsset: (id: string, data: any) => Promise<void>;
  
  // Selection
  selectedIds: Set<string>;
  setSelectedIds: (s: Set<string>) => void;
  isSelectionMode: boolean;
  setIsSelectionMode: (m: boolean) => void;
  
  // Filtering
  searchText: string;
  setSearchText: (v: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
  filteredAssets: Asset[];
  handleFilterApply: (f: any) => void;
  handleFilterReset: () => void;
}

export default function MobileLibraryView({
  assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset,
  selectedIds, setSelectedIds, isSelectionMode, setIsSelectionMode,
  searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset
}: MobileLibraryViewProps) {

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    if (newSelected.size > 0) setIsSelectionMode(true);
    else setIsSelectionMode(false);
  };

  const handleAssetTap = (asset: any, e: React.MouseEvent) => {
    if (isSelectionMode || selectedIds.size > 0) {
      handleSelect(asset.id);
      return;
    }
    openDetail(asset);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`${selectedIds.size}개의 에셋을 삭제하시겠습니까?`)) {
      setSelectedIds(new Set());
      setIsSelectionMode(false);
    }
  };

  


  return (
    <>
      <TopBar className="mb-0">
        <LibraryControls 
          isMobile={true}
          searchText={searchText}
          onSearchChange={setSearchText}
          isFilterOpen={isFilterOpen}
          onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          onFilterApply={handleFilterApply}
          onFilterReset={handleFilterReset}
        />
        <FilterChips active={filter} onChange={(f) => setFilter(f as any)} />
        <AssetSelectionBar 
          isMobile={true}
          selectedCount={selectedIds.size}
          onCancel={() => {
            setSelectedIds(new Set());
            setIsSelectionMode(false);
          }}
          onMove={() => {}}
          onDelete={handleBulkDelete}
        />
      </TopBar>

      <section className="px-5 py-6">
        {loading ? (
          <NVLoadingState fullHeight />
        ) : (
          <AssetGrid 
            assets={filteredAssets} 
            onAssetTap={handleAssetTap} 
            selectedIds={selectedIds}
            onSelect={(id) => handleSelect(id)}
            isMobile={true}
          />
        )}
      </section>

      <AssetDetail 
        asset={selectedAsset} 
        onClose={closeDetail} 
        onDelete={deleteAsset} 
        onUpdate={updateAsset}
      />
    </>
  );
}

