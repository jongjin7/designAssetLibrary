import { useState, useEffect, useRef } from 'react';
import { PanelRightOpen, PanelRightClose, ArrowLeftRight, FolderInput, ChevronLeft } from 'lucide-react';
import { processFileToAsset } from '@nova/lib/assetProcessor';
import { LibraryControls } from '@nova/components/library/LibraryControls';
import { MoveAssetPopover } from '@nova/components/library/MoveAssetPopover';
import { DropZone } from '@nova/components/shared/DropZone';
import { 
  NVLoadingState, 
  NVAssetSelectionBar, 
  NVAssetDetailSidebar, 
  Asset, 
  NVIconButton, 
  NVButton,
  useToast,
} from '@nova/ui';
import { useRouter } from 'next/navigation';
import { cn } from '@nova/lib/utils';
import { extractColors } from '@nova/lib/colorExtractor';
import { LibraryFilters } from '@nova/hooks';
import { useDesktopShell } from '../../../components/layout/DesktopShell/index';
import { LibraryFolderSection } from '../../../components/library/LibraryFolderSection';
import { LibraryAssetGridSection } from '../../../components/library/LibraryAssetGridSection';
import { LibraryDeleteDialogs } from '../../../components/library/LibraryDeleteDialogs';

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
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
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

  const lastWidthRef = typeof window !== 'undefined' ? useRef(window.innerWidth) : { current: 1024 };

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
    
    if (!nextVisible) {
      closeDetail();
    }
  };

  const handleToggleManagementMode = () => {
    setIsManagementMode(prev => !prev);
  };

  const handleAssetTap = (asset: Asset, e: React.MouseEvent) => {
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

  const confirmBulkDelete = async () => {
    const count = selectedIds.size;
    try {
      const idsToDelete = Array.from(selectedIds);
      await Promise.all(idsToDelete.map(id => deleteAsset(id)));
      setSelectedIds(new Set());
      setIsBulkDeleteDialogOpen(false);
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

  const handleFolderMove = async (id: string, targetId: string | null) => {
    try {
      await moveFolder(id, targetId);
      toast('폴더 위치를 이동했습니다.', { type: 'success' });
    } catch (err) {
      console.error('Failed to move folder:', err);
      toast('폴더 이동 중 오류가 발생했습니다.', { type: 'error' });
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
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
       alert('링크가 클립보드에 복사되었습니다.');
    }
  };

  const handleDrop = async (files: File[]) => {
    const { validFiles, unsupportedCount } = filterSupportedFiles(files);
    if (unsupportedCount > 0) {
      console.warn(`${unsupportedCount}개의 지원하지 않는 파일 형식이 제외되었습니다.`);
    }
    if (validFiles.length === 0) return;

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
                {(subFolders.length > 0 || filter === 'folder') && (
                  <div>
                    {filter === 'folder' && (
                      <NVButton 
                        variant="ghost" 
                        size="md" 
                        className="-ml-2 pl-1 pr-2 mb-4 !h-auto !py-1"
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
                      onFolderClick={(id) => router.push(`/folder/${id}`)}
                      onFolderRename={handleFolderRename}
                      onFolderMove={handleFolderMove}
                      onFolderDelete={handleFolderDelete}
                    />
                  </div>
                )}

                <LibraryAssetGridSection 
                  assets={assets}
                  filteredAssets={filteredAssets}
                  isExpanded={isAssetsExpanded}
                  onToggleExpand={() => setIsAssetsExpanded(!isAssetsExpanded)}
                  onAssetTap={handleAssetTap}
                  selectedIds={selectedIds}
                  onSelect={handleSelect}
                  onFavoriteToggle={(id, isFavorite) => updateAsset(id, { isFavorite })}
                  isSelectMode={isManagementMode}
                  zoom={zoom}
                  filter={filter}
                  searchText={searchText}
                  hasSubFolders={subFolders.length > 0}
                  isSidebarOpen={isSidebarVisible}
                  activeAssetId={selectedAsset?.id}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <LibraryAssetGridSection 
                  assets={assets}
                  filteredAssets={filteredAssets}
                  isExpanded={true}
                  onToggleExpand={() => {}}
                  onAssetTap={handleAssetTap}
                  selectedIds={selectedIds}
                  onSelect={handleSelect}
                  onFavoriteToggle={(id, isFavorite) => updateAsset(id, { isFavorite })}
                  isSelectMode={isManagementMode}
                  zoom={zoom}
                  filter={filter}
                  searchText={searchText}
                  hasSubFolders={false}
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
          onDelete={() => setIsBulkDeleteDialogOpen(true)}
        />
      </div>

      <div 
        className={cn(
          "h-full overflow-hidden transition-all duration-300 ease-in-out border-l border-white/[0.04]",
          isSidebarVisible ? "w-[380px] opacity-100" : "w-0 opacity-0 border-l-0"
        )}
      >
        <NVAssetDetailSidebar
          asset={selectedAsset}
          onClose={handleToggleSidebar}
          onDelete={(id) => setPendingDeleteAssetId(id)}
          onUpdate={updateAsset} 
          onShare={handleShare}
          onMove={(id) => handleMoveAsset(id, null)}
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

      <LibraryDeleteDialogs 
        isBulkDeleteDialogOpen={isBulkDeleteDialogOpen}
        onBulkDeleteOpenChange={setIsBulkDeleteDialogOpen}
        selectedCount={selectedIds.size}
        onConfirmBulkDelete={confirmBulkDelete}
        pendingDeleteAssetId={pendingDeleteAssetId}
        onPendingDeleteAssetIdChange={setPendingDeleteAssetId}
        onConfirmSingleDelete={confirmDetailDelete}
        isMobile={false}
      />
    </div>
  );
}
