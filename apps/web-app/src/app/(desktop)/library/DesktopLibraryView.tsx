import { useState, useEffect, useRef } from 'react';
import { PanelRightOpen, PanelRightClose } from 'lucide-react';
import { processFileToAsset } from '../../../lib/assetProcessor';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { LibraryControls } from '../../../components/library/LibraryControls';
import { DropZone } from '../../../components/shared/DropZone';
import { NVLoadingState, NVAssetSelectionBar, NVAssetDetailSidebar, Asset, NVIconButton } from '@nova/ui';
import { cn } from '../../../lib/utils';
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
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // Automatically show sidebar when a new asset is selected
  useEffect(() => {
    if (selectedAsset) {
      // Only auto-open if we have enough screen space
      if (window.innerWidth >= 760) {
        setIsSidebarVisible(true);
      }
    }
  }, [selectedAsset]);

  const lastWidthRef = typeof window !== 'undefined' ? useRef(window.innerWidth) : { current: 1024 };

  // Handle automatic collapse on resize CROSSING the 1024px threshold
  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const wasAbove = lastWidthRef.current >= 1024;
      const nowBelow = currentWidth < 1024;

      if (wasAbove && nowBelow) {
        setIsSidebarVisible(false);
      }
      
      lastWidthRef.current = currentWidth;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    const nextVisible = !isSidebarVisible;
    setIsSidebarVisible(nextVisible);
    
    // If we are closing the sidebar, also clear the current asset selection
    if (!nextVisible) {
      closeDetail();
    }
  };
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
    setIsSidebarVisible(true);
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
          onSearchToggle={onSearchToggle}
          activeFilter={filter}
          onFilterChange={(f) => setFilter(f as any)}
          isSidebarVisible={isSidebarVisible}
        />

        {/* Floating Sidebar Toggle - Fixed to FAR RIGHT Edge of Browser */}
        <div className="fixed top-2 h-8 right-1 z-50 flex items-center pl-2 border-l border-white/10">
           <NVIconButton 
             icon={isSidebarVisible ? PanelRightClose : PanelRightOpen}
             variant="ghost" 
             size="sm"
             onClick={handleToggleSidebar}
             className={cn(
               "transition-colors",
               isSidebarVisible ? "text-indigo-400 hover:text-indigo-300" : "text-slate-500 hover:text-white"
             )}
             title={isSidebarVisible ? "사이드바 닫기" : "사이드바 열기 (상세 정보)"}
           />
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative cursor-default">
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

      {/* Desktop Sidebar Inspector with Slide-in Transition */}
      <div 
        className={cn(
          "h-full overflow-hidden transition-all duration-300 ease-in-out border-l border-white/[0.04] bg-[#0A0C13]",
          isSidebarVisible ? "w-[380px] opacity-100" : "w-0 opacity-0 border-l-0"
        )}
      >
        <NVAssetDetailSidebar 
          asset={selectedAsset} 
          onClose={handleToggleSidebar} 
          onDelete={deleteAsset} 
          onUpdate={updateAsset} 
          onExtractAI={extractColorsAI}
          onExtractBasic={extractColors}
          className="w-[380px]"
        />
      </div>
    </div>
  );
}
