import React, { useState } from 'react';
import { ChevronLeft, FolderInput } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LibraryFilters } from '@nova/hooks';
import {
  NVLoadingState,
  NVIconButton,
  NVAssetSelectionBar,
  NVAssetDetailSheet,
  Asset,
  NVButton,
  useToast,
} from '@nova/ui';
import { extractColors } from '@nova/lib/colorExtractor';
import { MoveAssetPopover } from '@nova/components/library/MoveAssetPopover';
import { cn } from '@nova/lib/utils';
import { LibraryFolderSection } from '../../../components/library/LibraryFolderSection';
import { LibraryAssetGridSection } from '../../../components/library/LibraryAssetGridSection';
import { LibraryDeleteDialogs } from '../../../components/library/LibraryDeleteDialogs';

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
  moveAssets: (ids: string[], folderId: string | null) => Promise<void>;
  
  // Folder Operations
  deleteFolder: (id: string) => Promise<void>;
  moveFolder: (id: string, targetId: string | null) => Promise<void>;
  renameFolder: (id: string, name: string) => Promise<void>;
  createFolder: (name: string, parentId?: string | null) => Promise<void>;
  
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
  breadcrumbs?: any[];
  parentFolderId?: string | null;
  parentFolder?: any;
  title?: string;
}

export default function MobileLibraryView({
  assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset,
  selectedIds, setSelectedIds, isSelectionMode, setIsSelectionMode,
  searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset,
  isSearchVisible = false, onSearchToggle,
  zoom, setZoom,
  subFolders = [],
  allAssets = [],
  parentFolderId = null,
  parentFolder = null,
  title = "라이브러리",
  moveAssets,
  deleteFolder,
  moveFolder,
  renameFolder,
  createFolder,
}: MobileLibraryViewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [pendingDeleteAssetId, setPendingDeleteAssetId] = useState<string | null>(null);

  // Section Toggle States
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);
  const [isAssetsExpanded, setIsAssetsExpanded] = useState(true);

  const handleFolderClick = (id: string) => {
    router.push(`/folder/${id}`);
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

  const confirmBulkDelete = async () => {
    const count = selectedIds.size;
    try {
      const idsToDelete = Array.from(selectedIds);
      await Promise.all(idsToDelete.map(id => deleteAsset(id)));
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      setIsBulkDeleteDialogOpen(false);
      toast(`${count}개의 에셋이 삭제되었습니다.`, { type: 'success' });
    } catch (err) {
      console.error('Failed to delete assets in bulk:', err);
      toast('에셋 삭제 중 오류가 발생했습니다.', { type: 'error' });
    }
  };

  const handleBulkMove = async (folderId: string | null) => {
    const count = selectedIds.size;
    try {
      const ids = Array.from(selectedIds);
      await moveAssets(ids, folderId);
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      toast(`${count}개의 에셋을 이동했습니다.`, { type: 'success' });
    } catch (err) {
      console.error('Failed to move assets:', err);
      toast('에셋 이동 중 오류가 발생했습니다.', { type: 'error' });
    }
  };

  const handleFolderDelete = async (id: string) => {
    if (confirm('폴더를 삭제하시겠습니까? 내부의 에셋은 삭제되지 않고 인박스로 이동됩니다.')) {
      try {
        await deleteFolder(id);
        toast('폴더가 삭제되었습니다.', { type: 'success' });
      } catch (err) {
        console.error('Failed to delete folder:', err);
        toast('폴더 삭제 중 오류가 발생했습니다.', { type: 'error' });
      }
    }
  };

  const handleFolderRename = async (id: string, currentName: string) => {
    const newName = prompt('새로운 폴더 이름을 입력하세요:', currentName);
    if (newName && newName !== currentName) {
      try {
        await renameFolder(id, newName);
        toast(`폴더 이름이 "${newName}"으로 변경되었습니다.`, { type: 'success' });
      } catch (err) {
        console.error('Failed to rename folder:', err);
        toast('폴더 이름 변경 중 오류가 발생했습니다.', { type: 'error' });
      }
    }
  };

  const handleFolderMove = async (id: string, targetId: string | null) => {
    try {
      await moveFolder(id, targetId);
      toast('폴더 위치를 이동했습니다.', { type: 'success' });
    } catch (err) {
      console.error('Failed to move folder:', err);
      toast('폴더 이동 중 오류가 발생했습니다.', { type: 'error' });
    }
  };

  const confirmDetailDelete = async () => {
    if (!pendingDeleteAssetId) return;
    try {
      await deleteAsset(pendingDeleteAssetId);
      setPendingDeleteAssetId(null);
      closeDetail();
      toast('에셋이 삭제되었습니다.', { type: 'success' });
    } catch (err) {
      console.error('Failed to delete asset:', err);
      toast('에셋 삭제 중 오류가 발생했습니다.', { type: 'error' });
    }
  };

  const handleShare = async (asset: Asset) => {
    const shareUrl = `${window.location.origin}/asset/${asset.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: asset.fileName,
          text: `디자인 라이브러리에서 '${asset.fileName}' 에셋을 확인해보세요.`,
          url: shareUrl,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('링크가 클립보드에 복사되었습니다.');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const handleMoveAsset = async (id: string, folderId: string | null) => {
    try {
      await updateAsset(id, { folderId });
      closeDetail();
      toast('에셋을 이동했습니다.', { type: 'success' });
    } catch (err) {
      console.error('Failed to move asset:', err);
      toast('에셋 이동 중 오류가 발생했습니다.', { type: 'error' });
    }
  };

  return (
    <>
      <NVAssetSelectionBar
        theme="dark"
        size="sm"
        isMobile={true} 
        selectedCount={selectedIds.size}
        className="fixed z-40 left-1/2 -translate-x-1/2 bottom-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px)+16px)] w-[calc(100%-40px)]"
        onCancel={() => {
          setSelectedIds(new Set());
          setIsSelectionMode(false);
        }}
        moveTrigger={
          <MoveAssetPopover 
            onMove={handleBulkMove}
            trigger={
              <NVButton 
                variant="secondary"
                size="sm"
                className="bg-white/10 text-white border-white/10 hover:bg-white/20"
              >
                이동
              </NVButton>
            }
          />
        }
        onDelete={() => setIsBulkDeleteDialogOpen(true)}
      />
      
      <main className={cn("px-5 py-4", (filteredAssets.length === 0 && subFolders.length === 0) && "h-[calc(100%-128px)]")}>
        {loading ? (
          <NVLoadingState fullHeight />
        ) : (filteredAssets.length > 0 || subFolders.length > 0 || filter === 'folder') ? (
          <div className="flex flex-col gap-8 pb-20">
             {/* 1. 하위 폴더 섹션 */}
             {(subFolders.length > 0 || filter === 'folder') && (
                <div>
                  {filter === 'folder' && (
                    <NVButton 
                      variant="ghost" 
                      size="md" 
                      className="-ml-2 pl-1 pr-2 mb-2 !h-auto !py-1"
                      onClick={() => router.push(parentFolderId ? `/folder/${parentFolderId}` : '/library')}
                    >
                      <ChevronLeft className="w-3 h-3 mr-1" />
                      {parentFolder?.name || "Library"}
                    </NVButton>
                  )}
                  <LibraryFolderSection 
                    title={title}
                    folders={subFolders}
                    isExpanded={isFoldersExpanded}
                    onToggleExpand={() => setIsFoldersExpanded(!isFoldersExpanded)}
                    onFolderClick={handleFolderClick}
                    onFolderRename={handleFolderRename}
                    onFolderMove={handleFolderMove}
                    onFolderDelete={handleFolderDelete}
                    isMobile={true}
                  />
                </div>
             )}

             {/* 2. 에셋 목록 */}
             <LibraryAssetGridSection 
                assets={assets}
                filteredAssets={filteredAssets}
                isExpanded={isAssetsExpanded}
                onToggleExpand={() => setIsAssetsExpanded(!isAssetsExpanded)}
                onAssetTap={handleAssetTap}
                selectedIds={selectedIds}
                onSelect={handleSelect}
                onFavoriteToggle={(id, isFavorite) => updateAsset(id, { isFavorite })}
                isMobile={true}
                isSelectMode={isSelectionMode}
                zoom={zoom}
                filter={filter}
                searchText={searchText}
                hasSubFolders={subFolders.length > 0}
             />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <LibraryAssetGridSection 
              assets={assets}
              filteredAssets={filteredAssets}
              isExpanded={true}
              onToggleExpand={() => {}}
              onAssetTap={handleAssetTap}
              selectedIds={selectedIds}
              onSelect={handleSelect}
              onFavoriteToggle={(id, isFavorite) => updateAsset(id, { isFavorite })}
              isMobile={true}
              isSelectMode={isSelectionMode}
              zoom={zoom}
              filter={filter}
              searchText={searchText}
              hasSubFolders={false}
            />
          </div>
        )}
      </main>

      <NVAssetDetailSheet
        asset={selectedAsset}
        onClose={closeDetail}
        onDelete={(id) => setPendingDeleteAssetId(id)}
        onUpdate={updateAsset}
        onShare={handleShare}
        moveTrigger={
          <MoveAssetPopover
            variant="context"
            onMove={(fId) => {
              if (selectedAsset) handleMoveAsset(selectedAsset.id, fId);
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
      />

      <LibraryDeleteDialogs 
        isBulkDeleteDialogOpen={isBulkDeleteDialogOpen}
        onBulkDeleteOpenChange={setIsBulkDeleteDialogOpen}
        selectedCount={selectedIds.size}
        onConfirmBulkDelete={confirmBulkDelete}
        pendingDeleteAssetId={pendingDeleteAssetId}
        onPendingDeleteAssetIdChange={setPendingDeleteAssetId}
        onConfirmSingleDelete={confirmDetailDelete}
        isMobile={true}
      />
    </>
  );
}
