'use client';

import { useState } from 'react';
import { useLibraryFilters } from '../../../hooks/useLibraryFilters';
import { TopBar } from '../../../components/layout/TopBar';
import { LibraryControls } from '../../../components/library/LibraryControls';
import { AssetSelectionBar } from '../../../components/library/AssetSelectionBar';
import { FilterChips } from '../../../components/library/FilterChips';
import { AssetGrid } from '../../../components/library/AssetGrid';
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
      <div className="sticky top-0 z-[60] bg-slate-950/80 backdrop-blur-3xl border-b border-white/[0.08] shadow-2xl">
        <TopBar sticky={false} className="bg-transparent backdrop-blur-none border-none px-5" />
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
          onDelete={handleBulkDelete}
        />
      </div>

      <section className="px-5">
        {loading ? (
          <div className="library-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: 'var(--color-slate-400)' }}>
            <p>자산을 불러오는 중...</p>
          </div>
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

