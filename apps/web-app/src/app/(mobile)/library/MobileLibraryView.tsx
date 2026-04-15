'use client';

import React, { useState } from 'react';
import { Search, X, ChevronRight, ChevronLeft, MoreVertical, Trash2, Edit2, ArrowRightLeft, FolderInput } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLibraryFilters, LibraryFilters } from '@nova/hooks';
import { LibraryControls } from '@nova/components/library/LibraryControls';
import { FilterChips } from '@nova/components/library/FilterChips';
import { AssetGrid } from '@nova/components/library/AssetGrid';
import {
  NVLoadingState,
  NVIconButton,
  NVAssetSelectionBar,
  NVAssetDetailSheet,
  Asset,
  NVButton,
  NVEmptyState,
  NVSectionHeader,
  NVFolderCard,
  NVDialog,
  NVDialogContent,
  NVDialogHeader,
  NVDialogTitle,
  NVDialogDescription,
  NVDialogFooter,
  NVDialogBody,
  useToast,
} from '@nova/ui';
import { extractColors } from '@nova/lib/colorExtractor';
import { LibraryEmptyState } from '../../../components/library/LibraryEmptyState';
import { MoveAssetPopover } from '@nova/components/library/MoveAssetPopover';
import { cn } from '@nova/lib/utils';
import { 
  NVPopover, 
  NVPopoverTrigger, 
  NVPopoverContent,
} from '@nova/ui';

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
  activeKey,
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeleteAssetId, setPendingDeleteAssetId] = useState<string | null>(null);

  // Section Toggle States
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);
  const [isAssetsExpanded, setIsAssetsExpanded] = useState(true);

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
    if (selectedIds.size === 0) return;
    setIsDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    const count = selectedIds.size;
    try {
      const idsToDelete = Array.from(selectedIds);
      await Promise.all(idsToDelete.map(id => deleteAsset(id)));
      setSelectedIds(new Set());
      setIsSelectionMode(false);
      setIsDeleteDialogOpen(false);
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

  const handleDetailDelete = (id: string) => {
    setPendingDeleteAssetId(id);
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
        onDelete={handleBulkDelete}
      />
      
      <main className={cn("px-5 py-4", (filteredAssets.length === 0 && subFolders.length === 0) && "h-[calc(100%-128px)]")}>
        {loading ? (
          <NVLoadingState fullHeight />
        ) : (filteredAssets.length > 0 || subFolders.length > 0 || filter === 'folder') ? (
          <div className="flex flex-col gap-8 pb-20">
             {/* 1. 하위 폴더 섹션 (모바일) */}
             {(subFolders.length > 0 || filter === 'folder') && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                  <div className="flex flex-col items-start gap-1 mb-6">
                    {filter === 'folder' && (
                      <NVButton 
                        variant="ghost" 
                        size="md" 
                        className="-ml-2 pl-1 pr-2 !h-auto !py-1"
                        onClick={() => router.push(parentFolderId ? `/folder/${parentFolderId}` : '/library')}
                      >
                        <ChevronLeft className="w-3 h-3 mr-1" />
                        {parentFolder?.name || "Library"}
                      </NVButton>
                    )}
                    <NVSectionHeader 
                      title={title} 
                      count={filteredAssets.length} 
                      className="mb-0 !p-0"
                      hasDropdown={true}
                      isExpanded={isFoldersExpanded}
                      onDropdownClick={() => setIsFoldersExpanded(!isFoldersExpanded)}
                    />
                  </div>
                  {isFoldersExpanded && (
                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {subFolders.map(folder => (
                        <NVFolderCard 
                          key={folder.id}
                          id={folder.id}
                          name={folder.name}
                          assetCount={folder.aggregatedAssetCount || 0}
                          assetThumbnails={folder.aggregatedThumbnails || []}
                          hasSubfolders={folder.hasSubfolders}
                          isMobile={true}
                          onClick={(id) => handleFolderClick(id)}
                          moreMenu={
                            <NVPopover>
                              <NVPopoverTrigger asChild>
                                <button className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition-colors border border-white/10 shadow-lg">
                                  <MoreVertical size={16} />
                                </button>
                              </NVPopoverTrigger>
                              <NVPopoverContent align="end" className="w-40 p-1 bg-slate-900/90 border-white/10 backdrop-blur-2xl">
                                <button 
                                  onClick={() => handleFolderRename(folder.id, folder.name)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                  <Edit2 size={14} /> 이름 변경
                                </button>
                                <MoveAssetPopover 
                                  onMove={(targetId) => moveFolder(folder.id, targetId)}
                                  trigger={
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 rounded-lg transition-colors">
                                      <ArrowRightLeft size={14} /> 위치 이동
                                    </button>
                                  }
                                />
                                <div className="h-px bg-white/5 my-1" />
                                <button 
                                  onClick={() => handleFolderDelete(folder.id)}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                >
                                  <Trash2 size={14} /> 폴더 삭제
                                </button>
                              </NVPopoverContent>
                            </NVPopover>
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
             )}

             {/* 2. 에셋 목록 (목차) */}
             <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
                {subFolders.length > 0 && (
                  <NVSectionHeader 
                    title="목차" 
                    count={filteredAssets.length} 
                    className="mb-4"
                    hasDropdown={true}
                    isExpanded={isAssetsExpanded}
                    onDropdownClick={() => setIsAssetsExpanded(!isAssetsExpanded)}
                  />
                )}
                {isAssetsExpanded && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
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
        onDelete={handleDetailDelete}
        onUpdate={updateAsset}
        onShare={handleShare}
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
      />

      <NVDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <NVDialogContent className="w-[calc(100%-40px)] rounded-2xl max-w-sm">
          <NVDialogHeader className="px-5 pt-6 pb-2">
            <NVDialogTitle className="text-lg">에셋 삭제 확인</NVDialogTitle>
            <NVDialogDescription className="text-xs">
              선택한 {selectedIds.size}개의 에셋을 라이브러리에서 완전히 삭제하시겠습니까?
            </NVDialogDescription>
          </NVDialogHeader>
          <NVDialogBody className="px-5 pb-6">
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 mb-2">
              <p className="text-[10px] text-rose-400 font-medium leading-relaxed">
                * 삭제된 에셋은 복구할 수 없습니다.
              </p>
            </div>
          </NVDialogBody>
          <NVDialogFooter className="flex-row gap-2 px-5 py-3">
            <NVButton variant="ghost" className="flex-1 h-11 rounded-xl" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </NVButton>
            <NVButton variant="primary" className="flex-1 h-11 rounded-xl bg-rose-500 hover:bg-rose-600 border-none" onClick={confirmBulkDelete}>
              삭제
            </NVButton>
          </NVDialogFooter>
        </NVDialogContent>
      </NVDialog>

      <NVDialog open={pendingDeleteAssetId !== null} onOpenChange={(open) => { if (!open) setPendingDeleteAssetId(null); }}>
        <NVDialogContent className="w-[calc(100%-40px)] rounded-2xl max-w-sm">
          <NVDialogHeader className="px-5 pt-6 pb-2">
            <NVDialogTitle className="text-lg">에셋 삭제 확인</NVDialogTitle>
            <NVDialogDescription className="text-xs">
              이 에셋을 라이브러리에서 완전히 삭제하시겠습니까?
            </NVDialogDescription>
          </NVDialogHeader>
          <NVDialogBody className="px-5 pb-6">
            <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 mb-2">
              <p className="text-[10px] text-rose-400 font-medium leading-relaxed">
                * 삭제된 에셋은 복구할 수 없습니다.
              </p>
            </div>
          </NVDialogBody>
          <NVDialogFooter className="flex-row gap-2 px-5 py-3">
            <NVButton variant="ghost" className="flex-1 h-11 rounded-xl" onClick={() => setPendingDeleteAssetId(null)}>
              취소
            </NVButton>
            <NVButton variant="primary" className="flex-1 h-11 rounded-xl bg-rose-500 hover:bg-rose-600 border-none" onClick={confirmDetailDelete}>
              삭제
            </NVButton>
          </NVDialogFooter>
        </NVDialogContent>
      </NVDialog>
    </>
  );
}
