'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLibraryFilters } from '../../../hooks/useLibraryFilters';
import { MobileTopBar } from '../../../components/layout/MobileTopBar';
import { LibraryControls } from '../../../components/library/LibraryControls';
import { FilterChips } from '../../../components/library/FilterChips';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { NVLoadingState, NVIconButton, NVAssetSelectionBar, NVAssetDetailSheet, Asset, NVButton } from '@nova/ui';
import { extractColors } from '../../../lib/colorExtractor';
import { extractColorsAI } from '../../../lib/colorExtractorAI';

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchToggle = () => {
    if (isSearchOpen) {
      setSearchText('');
      setIsFilterOpen(false);
    }
    setIsSearchOpen(!isSearchOpen);
  };

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
      <MobileTopBar
        rightElement={
          <NVIconButton
            icon={isSearchOpen ? X : Search}
            variant="ghost"
            size="sm"
            iconSize={24} 
            onClick={handleSearchToggle}
            className={isSearchOpen ? 'text-white' : 'text-slate-400 hover:text-white'}
          />
        }
      >
        {/* 검색 영역: 아이콘 탭 후 접근 */}
        {isSearchOpen && (
          <LibraryControls
              isMobile={true}
              searchText={searchText}
              onSearchChange={setSearchText}
              isFilterOpen={isFilterOpen}
              onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
              onFilterApply={handleFilterApply}
              onFilterReset={handleFilterReset}
              className="px-5 py-2"
            />
        )}

        <div className="px-5 py-2 shadow-md shadow-black/20">
          <FilterChips active={filter} onChange={(f) => setFilter(f as any)} />
        </div>
      </MobileTopBar>

      <NVAssetSelectionBar
        isMobile={true} 
        selectedCount={selectedIds.size}
        className="fixed bottom-20 z-40 left-1/2 -translate-x-1/2"
        onCancel={() => {
          setSelectedIds(new Set());
          setIsSelectionMode(false);
        }}
        onMove={() => {}}
        onDelete={handleBulkDelete}
      />
      
      <main className="px-5 py-6">
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
      </main>

      <NVAssetDetailSheet 
        asset={selectedAsset} 
        onClose={closeDetail} 
        onDelete={deleteAsset} 
        onUpdate={updateAsset}
        onExtractAI={extractColorsAI}
        onExtractBasic={extractColors}
      />
    </>
  );
}

