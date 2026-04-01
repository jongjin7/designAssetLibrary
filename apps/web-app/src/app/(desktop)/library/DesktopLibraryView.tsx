import { useState, useEffect, useRef } from 'react';
import { PanelRightOpen, PanelRightClose, ArrowLeftRight, FolderInput } from 'lucide-react';
import { processFileToAsset } from '@nova/lib/assetProcessor';
import { AssetGrid } from '@nova/components/library/AssetGrid';
import { LibraryControls } from '@nova/components/library/LibraryControls';
import { MoveAssetPopover } from '@nova/components/library/MoveAssetPopover';
import { DropZone } from '@nova/components/shared/DropZone';
import { NVLoadingState, NVAssetSelectionBar, NVAssetDetailSidebar, Asset, NVIconButton, NVEmptyState } from '@nova/ui';
import { cn } from '@nova/lib/utils';
import { extractColors } from '@nova/lib/colorExtractor';
import { LibraryFilters } from '@nova/hooks/useLibraryFilters';
import { useDesktopShell } from '../../../components/layout/DesktopShell/index';
import { LibraryEmptyState } from '../../../components/library/LibraryEmptyState';

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
  addAsset: (data: any, file?: File | Blob) => Promise<any>;
  moveAssets: (ids: string[], folderId: string | null) => Promise<void>;
  isMoving: boolean;
  
  // Selection
  selectedIds: Set<string>;
  setSelectedIds: (s: Set<string>) => void;
  
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
}

export default function DesktopLibraryView({
  assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset, addAsset, moveAssets, isMoving,
  selectedIds, setSelectedIds,
  searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset,
  isSearchVisible, onSearchToggle,
  zoom, setZoom
}: DesktopLibraryViewProps) {
  
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isManagementMode, setIsManagementMode] = useState(false);
  const shell = useDesktopShell();
  const isDesktopApp = shell?.isDesktopApp ?? false;

  // Clear management mode when selection is cancelled or successful
  useEffect(() => {
    if (selectedIds.size === 0 && !isManagementMode) {
      // Nothing to do
    }
  }, [selectedIds, isManagementMode]);

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

  const handleToggleManagementMode = () => {
    setIsManagementMode(prev => !prev);
  };

  const handleAssetTap = (asset: Asset, e: React.MouseEvent) => {
    // Selection mode: Management mode active OR Cmd/Ctrl or Shift
    if (isManagementMode || e.metaKey || e.ctrlKey || e.shiftKey || selectedIds.size > 0) {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(asset.id)) {
        newSelected.delete(asset.id);
      } else {
        newSelected.add(asset.id);
      }
      setSelectedIds(newSelected);
      return;
    }
    
    // Default mode: toggle inspector (re-click same asset to close)
    if (selectedAsset?.id === asset.id && isSidebarVisible) {
      handleToggleSidebar();
      return;
    }
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

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    
    if (window.confirm(`${selectedIds.size}개의 에셋을 삭제하시겠습니까?`)) {
      try {
        const idsToDelete = Array.from(selectedIds);
        // Sequential deletion for safety or Parallel with Promise.all
        await Promise.all(idsToDelete.map(id => deleteAsset(id)));
        setSelectedIds(new Set());
        console.log(`Successfully deleted ${idsToDelete.length} assets`);
      } catch (err) {
        console.error('Failed to delete assets in bulk:', err);
        alert('일부 에셋 삭제에 실패했습니다.');
      }
    }
  };

  const handleMoveAsset = async (id: string, folderId: string | null) => {
    try {
      await updateAsset(id, { folderId });
      // If we are in the sidebar, the asset will update automatically via props
      console.log(`Moved asset ${id} to folder ${folderId}`);
    } catch (err) {
      console.error('Failed to move asset:', err);
    }
  };

  const handleBulkMove = async (folderId: string | null) => {
    try {
      const ids = Array.from(selectedIds);
      await moveAssets(ids, folderId);
      setSelectedIds(new Set());
      console.log(`Moved ${ids.length} assets to folder ${folderId}`);
    } catch (err) {
      console.error('Failed to move assets:', err);
    }
  };

  const handleShare = async (asset: Asset) => {
    const shareUrl = `${window.location.origin}/asset/${asset.id}`;
    
    // Copy to clipboard first as a fallback/primary on desktop
    try {
      await navigator.clipboard.writeText(shareUrl);
      console.log('Share link copied to clipboard');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: asset.fileName,
          text: `디자인 라이브러리에서 '${asset.fileName}' 에셋을 확인해보세요.`,
          url: shareUrl,
        });
      } catch (err: any) {
        // Silently handle user cancellation
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
       // On platforms without navigator.share, the clipboard copy above is enough
       // Show a simple alert if not already handled by a toast system
       alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  const handleDrop = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      try {
        const assetData = await processFileToAsset(file);
        const newAsset = await addAsset(assetData, file);
        if (newAsset) {
          openDetail(newAsset);
          setIsSidebarVisible(true);
        }
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
          isSidebarVisible={isSidebarVisible}
          isManagementMode={isManagementMode}
          onManagementToggle={handleToggleManagementMode}
          onAddAsset={async (data, file) => {
            const newAsset = await addAsset(data, file);
            if (newAsset) {
              openDetail(newAsset);
              setIsSidebarVisible(true);
            }
          }}
          zoom={zoom}
          onZoomChange={setZoom}
        />

        {/* Floating Sidebar Toggle - Fixed to FAR RIGHT Edge of Browser */}
        <div className={cn(
          "fixed h-8 right-6 z-50 flex items-center app-no-drag",
          isDesktopApp ? "top-[3px]" : "top-[7px]"
        )}>
           <NVIconButton 
             icon={isSidebarVisible ? PanelRightClose : PanelRightOpen}
             variant="ghost" 
             size="sm"
             onClick={handleToggleSidebar}
             title={isSidebarVisible ? "사이드바 닫기" : "사이드바 열기 (상세 정보)"}
           />
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative cursor-default">
          {isMoving && (
            <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-sm transition-all animate-in fade-in duration-300">
               <NVLoadingState message={`${selectedIds.size}개의 에셋 이동 중...`} />
            </div>
          )}
          <div className="mx-auto h-full">
            {loading ? (
              <NVLoadingState className="h-full" />
            ) : filteredAssets.length > 0 ? (
              <AssetGrid 
                assets={filteredAssets} 
                onAssetTap={handleAssetTap} 
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onFavoriteToggle={(id, isFavorite) => {
                  updateAsset(id, { isFavorite });
                }}
                isSelectMode={isManagementMode}
                zoom={zoom}
                isSidebarOpen={isSidebarVisible}
                activeAssetId={selectedAsset?.id}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
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

        <NVAssetSelectionBar
          theme="dark"
          size="md"
          selectedCount={selectedIds.size}
          isManagementMode={isManagementMode}
          className="absolute bottom-10 z-40 left-1/2 -translate-x-1/2"
          onCancel={() => {
            setSelectedIds(new Set());
            if (isManagementMode) handleToggleManagementMode();
          }}
          moveTrigger={
            <MoveAssetPopover 
              onMove={handleBulkMove}
              trigger={
                <NVIconButton 
                  icon={ArrowLeftRight} 
                  variant="ghost" 
                  size="sm" 
                  className="px-6 h-10 rounded-xl hover:bg-white/10"
                  title="폴더로 이동"
                >
                   <span className="text-sm font-semibold ml-2">이동</span>
                </NVIconButton>
              }
            />
          }
          onDelete={handleBulkDelete}
        />
      </div>

      {/* Desktop Sidebar Inspector with Slide-in Transition */}
      <div 
        className={cn(
          "h-full overflow-hidden transition-all duration-300 ease-in-out border-l border-white/[0.04]",
          isSidebarVisible ? "w-[380px] opacity-100" : "w-0 opacity-0 border-l-0"
        )}
      >
        <NVAssetDetailSidebar 
          asset={selectedAsset} 
          onClose={handleToggleSidebar} 
          onDelete={deleteAsset} 
          onUpdate={updateAsset} 
          onShare={handleShare}
          onMove={(id) => handleMoveAsset(id, null)} // Default to inbox if somehow triggered directly
          moveTrigger={
            <MoveAssetPopover 
              variant="context"
              onMove={(folderId) => {
                if (selectedAsset) handleMoveAsset(selectedAsset.id, folderId);
              }}
              trigger={
                <NVIconButton 
                  icon={FolderInput}
                  variant="secondary"
                  size="md"
                  className="!rounded-2xl"
                  iconSize={20}
                  strokeWidth={1.5}
                  aria-label="이동"
                />
              }
            />
          }
          onExtractAI={extractColors}
          onExtractBasic={extractColors}
          isDesktopApp={isDesktopApp}
        />
      </div>
    </div>
  );
}
