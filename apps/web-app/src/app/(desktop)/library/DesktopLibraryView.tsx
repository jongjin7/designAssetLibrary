'use client';

import { processFileToAsset } from '../../../lib/assetProcessor';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { LibraryControls } from '../../../components/library/LibraryControls';
import { DropZone } from '../../../components/shared/DropZone';
import { NVLoadingState, NVAssetSelectionBar, NVAssetInspector, Asset } from '@nova/ui';
import { extractColors } from '../../../lib/colorExtractor';
import { extractColorsAI } from '../../../lib/colorExtractorAI';

interface DesktopLibraryViewProps {
  assets: Asset[];
  loading: boolean;
  filter: string;
  setFilter: (f: any) => void;
  selectedAsset: any;
  openDetail: (asset: any) => void;
  closeDetail: () => void;
  deleteAsset: (id: string) => Promise<void>;
  updateAsset: (id: string, data: any) => Promise<void>;
  addAsset: (data: any) => Promise<void>;
  
  // Selection
  selectedIds: Set<string>;
  setSelectedIds: (s: Set<string>) => void;
  
  // Filtering
  searchText: string;
  setSearchText: (v: string) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
  filteredAssets: Asset[];
  handleFilterApply: (f: any) => void;
  handleFilterReset: () => void;
  isSearchVisible?: boolean;
  onSearchToggle?: () => void;
}

export default function DesktopLibraryView({
  assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset, addAsset,
  selectedIds, setSelectedIds,
  searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset,
  isSearchVisible, onSearchToggle
}: DesktopLibraryViewProps) {
  
  const handleAssetTap = (asset: Asset, e: React.MouseEvent) => {
    // Selection mode: Cmd/Ctrl or Shift or if we already have a selection
    if (e.metaKey || e.ctrlKey || e.shiftKey || selectedIds.size > 0) {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(asset.id)) {
        newSelected.delete(asset.id);
      } else {
        newSelected.add(asset.id);
      }
      setSelectedIds(newSelected);
      return;
    }
    
    // Default mode: open inspector
    openDetail(asset);
  };

  const handleSelect = (id: string, e: React.MouseEvent) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`${selectedIds.size}개의 에셋을 삭제하시겠습니까?`)) {
      setSelectedIds(new Set());
    }
  };

  const handleDrop = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      try {
        const assetData = await processFileToAsset(file);
        await addAsset(assetData);
      } catch (err) {
        console.error('Failed to process dropped file:', err);
      }
    }
  };


  return (
    <div className="flex h-full w-full overflow-hidden bg-[#0A0C13]">
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <DropZone onDrop={handleDrop} />
        
        <LibraryControls
          searchText={searchText}
          onSearchChange={setSearchText}
          isFilterOpen={isFilterOpen}
          onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          onFilterApply={handleFilterApply}
          onFilterReset={handleFilterReset}
          isSearchVisible={isSearchVisible}
          onSearchToggle={onSearchToggle}
          activeFilter={filter}
          onFilterChange={(f) => setFilter(f as any)}
        />

        <div className="flex-1 overflow-y-auto p-8 relative">
          <NVAssetSelectionBar
            selectedCount={selectedIds.size}
            className="fixed bottom-4 z-40 left-[calc(50%-180px)] -translate-x-1/2"
            onCancel={() => setSelectedIds(new Set())}
            onMove={() => {}}
            onDelete={handleBulkDelete}
          />

          <div className="mx-auto">
            {loading ? (
              <NVLoadingState className="py-20" />
            ) : (
              <AssetGrid 
                assets={filteredAssets} 
                onAssetTap={handleAssetTap} 
                selectedIds={selectedIds}
                onSelect={handleSelect}
              />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar Inspector */}
      <NVAssetInspector 
        asset={selectedAsset} 
        onClose={closeDetail} 
        onDelete={deleteAsset} 
        onUpdate={updateAsset} 
        onExtractAI={extractColorsAI}
        onExtractBasic={extractColors}
      />
    </div>
  );
}
