'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLibraryFilters, LibraryFilters } from '@nova/hooks/useLibraryFilters';
import { LibraryControls } from '@nova/components/library/LibraryControls';
import { FilterChips } from '@nova/components/library/FilterChips';
import { AssetGrid } from '@nova/components/library/AssetGrid';
import { NVLoadingState, NVIconButton, NVAssetSelectionBar, NVAssetDetailSheet, Asset, NVButton, NVEmptyState, NVSectionHeader, NVFolderCard } from '@nova/ui';
import { extractColors } from '@nova/lib/colorExtractor';
import { LibraryEmptyState } from '../../../components/library/LibraryEmptyState';
import { cn } from '@nova/lib/utils';

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
  handleFilterApply: (f: LibraryFilters) => void;
  handleFilterReset: () => void;
  isSearchVisible?: boolean;
  onSearchToggle?: () => void;
  zoom: number;
  setZoom: (v: number) => void;
  activeKey?: string;
  
  // Folders & Data
  subFolders?: any[];
  allAssets?: Asset[];
}

export default function MobileLibraryView({
  assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset,
  selectedIds, setSelectedIds, isSelectionMode, setIsSelectionMode,
  searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset,
  isSearchVisible = false, onSearchToggle,
  zoom, setZoom,
  activeKey,
  subFolders = [],
  allAssets = []
}: MobileLibraryViewProps) {
  const router = useRouter();

  const handleFolderClick = (id: string) => {
    router.push(`/folder/${id}`);
  };

  const handleFilterChange = (key: string) => {
    if (key.startsWith('folder_')) {
      const folderId = key.replace('folder_', '');
      router.push(`/folder/${folderId}`);
      return;
    }

    const pathMap: Record<string, string> = {
      all: '/library',
      inbox: '/inbox',
      favorites: '/favorites',
      recent: '/recent'
    };
    const target = pathMap[key] || '/library';
    router.push(target);
  };

  const handleSearchToggle = () => {
    if (isSearchVisible) {
      setSearchText('');
      setIsFilterOpen(false);
    }
    onSearchToggle?.();
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

  const handleAssetTap = (asset: any) => {
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
      <NVAssetSelectionBar
        theme="dark"
        size="sm"
        isMobile={true} 
        selectedCount={selectedIds.size}
        className="fixed z-40 left-1/2 -translate-x-1/2 bottom-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px)+8px)] w-[calc(100%-70px)]"
        onCancel={() => {
          setSelectedIds(new Set());
          setIsSelectionMode(false);
        }}
        onMove={() => {}}
        onDelete={handleBulkDelete}
      />
      
      <main className={cn("px-5 py-4", (filteredAssets.length === 0 && subFolders.length === 0) && "h-[calc(100%-128px)]")}>
        {loading ? (
          <NVLoadingState fullHeight />
        ) : (filteredAssets.length > 0 || subFolders.length > 0) ? (
          <div className="flex flex-col gap-8 pb-20">
             {/* 1. 하위 폴더 섹션 (모바일) */}
             {subFolders.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  <NVSectionHeader title="하위 폴더" count={subFolders.length} />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {subFolders.map(folder => {
                      const folderAssets = allAssets.filter(a => a.folderId === folder.id);
                      return (
                        <NVFolderCard 
                          key={folder.id}
                          id={folder.id}
                          name={folder.name}
                          assetCount={folderAssets.length}
                          assetThumbnails={folderAssets.slice(0, 3).map(a => a.thumbnail).filter(Boolean) as string[]}
                          isMobile={true}
                          onClick={(id) => handleFolderClick(id)}
                        />
                      );
                    })}
                  </div>
                </div>
             )}

             {/* 2. 에셋 목록 (목차) */}
             <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
                {subFolders.length > 0 && (
                  <NVSectionHeader title="목차" count={filteredAssets.length} className="mb-4" />
                )}
                {filteredAssets.length > 0 ? (
                  <AssetGrid 
                    assets={filteredAssets} 
                    onAssetTap={handleAssetTap} 
                    selectedIds={selectedIds}
                    onSelect={(id) => handleSelect(id)}
                    onFavoriteToggle={(id, isFavorite) => {
                      updateAsset(id, { isFavorite });
                    }}
                    isMobile={true}
                    isSelectMode={isSelectionMode}
                    zoom={zoom}
                  />
                ) : subFolders.length > 0 ? (
                   <div className="flex flex-col items-center justify-center py-12 bg-slate-900/10 rounded-2xl border border-dashed border-white/5">
                      <p className="text-slate-500 text-xs font-medium">이 폴더에는 에셋이 없습니다.</p>
                   </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <LibraryEmptyState 
                      assets={assets}
                      filteredAssets={filteredAssets}
                      filter={filter}
                      searchText={searchText}
                    />
                  </div>
                )}
             </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LibraryEmptyState 
              assets={assets}
              filteredAssets={filteredAssets}
              filter={filter}
              searchText={searchText}
            />
          </div>
        )}
      </main>

      <NVAssetDetailSheet 
        asset={selectedAsset} 
        onClose={closeDetail} 
        onDelete={deleteAsset} 
        onUpdate={updateAsset}
        onExtractAI={extractColors}
        onExtractBasic={extractColors}
      />
    </>
  );
}
