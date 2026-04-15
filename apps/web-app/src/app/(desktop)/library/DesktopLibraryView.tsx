import { useState, useEffect, useRef } from 'react';
import { PanelRightOpen, PanelRightClose, ArrowLeftRight, FolderInput, ChevronRight, ChevronLeft, MoreVertical, Trash2, Edit2, ArrowRightLeft } from 'lucide-react';
import { processFileToAsset } from '@nova/lib/assetProcessor';
import { AssetGrid } from '@nova/components/library/AssetGrid';
import { LibraryControls } from '@nova/components/library/LibraryControls';
import { MoveAssetPopover } from '@nova/components/library/MoveAssetPopover';
import { DropZone } from '@nova/components/shared/DropZone';
import { 
  NVLoadingState, 
  NVAssetSelectionBar, 
  NVAssetDetailSidebar, 
  Asset, 
  NVIconButton, 
  NVEmptyState, 
  NVSectionHeader, 
  NVFolderCard,
  NVDialog,
  NVDialogContent,
  NVDialogHeader,
  NVDialogTitle,
  NVDialogDescription,
  NVDialogFooter,
  NVButton,
  NVDialogBody,
  NVPopover,
  NVPopoverTrigger,
  NVPopoverContent,
  useToast,
} from '@nova/ui';
import { useRouter } from 'next/navigation';
import { cn } from '@nova/lib/utils';
import { extractColors } from '@nova/lib/colorExtractor';
import { LibraryFilters } from '@nova/hooks';
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
  
  // Folder Operations
  deleteFolder: (id: string) => Promise<void>;
  moveFolder: (id: string, targetId: string | null) => Promise<void>;
  renameFolder: (id: string, name: string) => Promise<void>;
  createFolder: (name: string, parentId?: string | null) => Promise<void>;
  
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
  
  // Folders & Data
  subFolders?: any[];
  allAssets?: Asset[];
  setFolderId?: (id: string | null) => void;
  parentFolderId?: string | null;
  parentFolder?: any;
  breadcrumbs?: any[];
  title?: string;
}

import { filterSupportedFiles, chunkArray, SUPPORTED_EXTENSIONS } from '@nova/lib/fileValidation';
import { useNavHistory } from '@nova/hooks';

export default function DesktopLibraryView({
  assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset, addAsset, moveAssets, isMoving,
  selectedIds, setSelectedIds,
  searchText, setSearchText, isFilterOpen, setIsFilterOpen, filteredAssets, handleFilterApply, handleFilterReset,
  isSearchVisible, onSearchToggle,
  zoom, setZoom,
  subFolders = [],
  allAssets = [],
  setFolderId,
  parentFolderId = null,
  parentFolder = null,
  breadcrumbs = [],
  title = "라이브러리",
  deleteFolder,
  moveFolder,
  renameFolder,
  createFolder,
}: DesktopLibraryViewProps) {
  
  const { canGoBack, canGoForward } = useNavHistory();
  const { toast } = useToast();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingDeleteAssetId, setPendingDeleteAssetId] = useState<string | null>(null);

  // Section Toggle States
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);
  const [isAssetsExpanded, setIsAssetsExpanded] = useState(true);
  const router = useRouter();
  const shell = useDesktopShell();
  const isDesktopApp = shell?.isDesktopApp ?? false;

  // Watch for files from Electron (Monitored Folder)
  useEffect(() => {
    if (!isDesktopApp || !(window as any).electron) return;

    const handleFileFromMain = async (fileData: { path: string, name: string, type: string, size: number }) => {
      console.log('File detected in watched folder:', fileData.name);
      try {
        // Fetch the file content via our custom protocol
        const response = await fetch(`nova-asset://${fileData.path}`);
        if (!response.ok) throw new Error('Failed to fetch file content');
        
        const blob = await response.blob();
        const file = new File([blob], fileData.name, { type: fileData.type });
        
        const assetData = await processFileToAsset(file, ['monitored', 'new']);
        await addAsset(assetData, file);
        console.log(`Successfully imported monitored file: ${fileData.name}`);
      } catch (err) {
        console.error('Failed to import monitored file:', err);
      }
    };

    const unsubscribe = (window as any).electron.receive('file-added', handleFileFromMain);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isDesktopApp, addAsset]);

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

  const handleBack = () => {
    if (parentFolderId) {
      router.push(`/folder/${parentFolderId}`);
    } else {
      router.push('/library');
    }
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
    setIsDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    const count = selectedIds.size;
    try {
      const idsToDelete = Array.from(selectedIds);
      await Promise.all(idsToDelete.map(id => deleteAsset(id)));
      setSelectedIds(new Set());
      setIsDeleteDialogOpen(false);
      toast(`${count}개의 에셋이 삭제되었습니다.`, { type: 'success' });
    } catch (err) {
      console.error('Failed to delete assets in bulk:', err);
      toast('에셋 삭제 중 오류가 발생했습니다.', { type: 'error' });
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

  const handleMoveAsset = async (id: string, folderId: string | null) => {
    try {
      await updateAsset(id, { folderId });
      handleToggleSidebar();
      toast('에셋을 이동했습니다.', { type: 'success' });
    } catch (err) {
      console.error('Failed to move asset:', err);
      toast('에셋 이동 중 오류가 발생했습니다.', { type: 'error' });
    }
  };

  const handleBulkMove = async (folderId: string | null) => {
    const count = selectedIds.size;
    try {
      const ids = Array.from(selectedIds);
      await moveAssets(ids, folderId);
      setSelectedIds(new Set());
      toast(`${count}개의 에셋을 이동했습니다.`, { type: 'success' });
    } catch (err) {
      console.error('Failed to move assets:', err);
      toast('에셋 이동 중 오류가 발생했습니다.', { type: 'error' });
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
      handleToggleSidebar();
      toast('에셋이 삭제되었습니다.', { type: 'success' });
    } catch (err) {
      console.error('Failed to delete asset:', err);
      toast('에셋 삭제 중 오류가 발생했습니다.', { type: 'error' });
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

  const handleDrop = async (files: File[]) => {
    const { validFiles, unsupportedCount } = filterSupportedFiles(files);

    if (unsupportedCount > 0) {
      console.warn(`${unsupportedCount}개의 지원하지 않는 파일 형식이 제외되었습니다. (지원: ${SUPPORTED_EXTENSIONS.join(', ').toUpperCase()})`);
    }

    if (validFiles.length === 0) return;

    // Process in batches
    const batches = chunkArray(validFiles, 5);
    for (const batch of batches) {
      await Promise.all(batch.map(async (file) => {
        try {
          const assetData = await processFileToAsset(file);
          const newAsset = await addAsset(assetData, file);
          
          if (validFiles.length === 1 && newAsset) {
            openDetail(newAsset);
            setIsSidebarVisible(true);
          }
        } catch (err) {
          console.error(`Failed to process file ${file.name}:`, err);
        }
      }));
    }

    console.log(`Successfully processed ${validFiles.length} files`);
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
          onBack={() => router.back()}
          onForward={() => router.forward()}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          hasParent={filter === 'folder' || parentFolderId !== null}
          breadcrumbs={breadcrumbs}
          title={title}
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
          <div className="mx-auto h-full max-w-[1600px]">
            {loading ? (
              <NVLoadingState className="h-full" />
            ) : (filteredAssets.length > 0 || subFolders.length > 0 || filter === 'folder') ? (
              <div className="flex flex-col pb-20">
                {/* 1. 하위 폴더 섹션 (하위 폴더 또는 폴더 뷰인 경우 노출) */}
                {(subFolders.length > 0 || filter === 'folder') && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex flex-col items-start gap-3 mb-6">
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
                      
                      <div className="flex items-center justify-between w-full">
                        <NVSectionHeader 
                          title={title} 
                          count={filteredAssets.length} 
                          hasDropdown={true} 
                          isExpanded={isFoldersExpanded}
                          onDropdownClick={() => setIsFoldersExpanded(!isFoldersExpanded)}
                          className="mb-0 !p-0" 
                        />
                      </div>
                    </div>
                    {isFoldersExpanded && (
                      <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6", subFolders.length > 0 && "mb-12 animate-in fade-in slide-in-from-top-2 duration-300")}>
                        {subFolders.map(folder => (
                          <NVFolderCard 
                            key={folder.id}
                            id={folder.id}
                            name={folder.name}
                            assetCount={folder.aggregatedAssetCount || 0}
                            assetThumbnails={folder.aggregatedThumbnails || []}
                            hasSubfolders={folder.hasSubfolders}
                            onClick={(id) => {
                              router.push(`/folder/${id}`);
                            }}
                            moreMenu={
                              <NVPopover>
                                <NVPopoverTrigger asChild>
                                  <button className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition-colors border border-white/10 shadow-lg opacity-0 group-hover:opacity-100">
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

                {/* 2. 목차 섹션 (에셋 목록) */}
                <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
                  {subFolders.length > 0 && (
                    <NVSectionHeader 
                      title="목차" 
                      count={filteredAssets.length} 
                      className="mb-6"
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
                          onSelect={handleSelect}
                          onFavoriteToggle={(id, isFavorite) => {
                            updateAsset(id, { isFavorite });
                          }}
                          isSelectMode={isManagementMode}
                          zoom={zoom}
                          isSidebarOpen={isSidebarVisible}
                          activeAssetId={selectedAsset?.id}
                        />
                      ) : subFolders.length > 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/10 rounded-2xl border border-dashed border-white/5">
                           <p className="text-slate-500 font-medium">이 폴더에는 직접 포함된 에셋이 없습니다.</p>
                        </div>
                      ) : (
                        <LibraryEmptyState 
                          assets={assets}
                          filteredAssets={filteredAssets}
                          filter={filter}
                          searchText={searchText}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
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
          onDelete={handleDetailDelete}
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

      <NVDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <NVDialogContent className="max-w-md">
          <NVDialogHeader>
            <NVDialogTitle>에셋 삭제 확인</NVDialogTitle>
            <NVDialogDescription>
              선택한 {selectedIds.size}개의 에셋을 라이브러리에서 완전히 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </NVDialogDescription>
          </NVDialogHeader>
          <NVDialogBody className="pt-2 pb-6">
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
              <p className="text-xs text-rose-400 font-medium leading-relaxed">
                * 삭제된 에셋은 복구할 수 없으며, 연결된 모든 폴더 및 즐겨찾기 정보가 함께 제거됩니다.
              </p>
            </div>
          </NVDialogBody>
          <NVDialogFooter>
            <NVButton variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>
              취소
            </NVButton>
            <NVButton variant="primary" className="bg-rose-500 hover:bg-rose-600 border-rose-400/20" onClick={confirmBulkDelete}>
              에셋 삭제하기
            </NVButton>
          </NVDialogFooter>
        </NVDialogContent>
      </NVDialog>

      <NVDialog open={pendingDeleteAssetId !== null} onOpenChange={(open) => { if (!open) setPendingDeleteAssetId(null); }}>
        <NVDialogContent className="max-w-md">
          <NVDialogHeader>
            <NVDialogTitle>에셋 삭제 확인</NVDialogTitle>
            <NVDialogDescription>
              이 에셋을 라이브러리에서 완전히 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </NVDialogDescription>
          </NVDialogHeader>
          <NVDialogBody className="pt-2 pb-6">
            <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
              <p className="text-xs text-rose-400 font-medium leading-relaxed">
                * 삭제된 에셋은 복구할 수 없으며, 연결된 모든 폴더 및 즐겨찾기 정보가 함께 제거됩니다.
              </p>
            </div>
          </NVDialogBody>
          <NVDialogFooter>
            <NVButton variant="ghost" onClick={() => setPendingDeleteAssetId(null)}>
              취소
            </NVButton>
            <NVButton variant="primary" className="bg-rose-500 hover:bg-rose-600 border-rose-400/20" onClick={confirmDetailDelete}>
              에셋 삭제하기
            </NVButton>
          </NVDialogFooter>
        </NVDialogContent>
      </NVDialog>
    </div>
  );
}
