'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@nova/lib/utils';
import { NVSearchBar } from '@nova/ui';
import { LibraryFilters } from '@nova/hooks';
import { 
  ArrowLeftRight, Plus,
  ChevronRight, ChevronLeft, 
  LayoutGrid, 
  Pin,
  Image as ImageIcon,
  ListChecks,
  FolderSearch
} from 'lucide-react';
import { ViewOptionsPopover } from './ViewOptionsPopover';
import { processFileToAsset } from '@nova/lib/assetProcessor';
import { 
  NVPopover, 
  NVPopoverTrigger, 
  NVPopoverContent,
  NVPopoverAnchor,
  NVIconButton,
  NVSlider,
  NVDialog,
  NVDialogTrigger,
  NVDialogContent,
  NVSearchPanel,
  NVDesktopUploadPanel,
} from '@nova/ui';
import { DesktopPageHeader } from '../layout/DesktopShell';
import { MoveAssetPopover } from './MoveAssetPopover';

interface LibraryControlsProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  onFilterApply: (filters: LibraryFilters) => void;
  onFilterReset: () => void;
  isMobile?: boolean;
  isSearchVisible?: boolean;
  onSearchToggle?: () => void;
  onFilterChange?: (filter: string) => void;
  className?: string;
  isSidebarVisible?: boolean;
  isManagementMode?: boolean;
  onManagementToggle?: () => void;
  onAddAsset?: (data: any, file?: File) => Promise<void>;
  onMoveAsset?: (folderId: string | null) => void;
  zoom?: number;
  onZoomChange?: (value: number) => void;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  hasParent?: boolean;
  breadcrumbs?: any[];
  title?: string;
}

export function LibraryControls({
  searchText,
  onSearchChange,
  isFilterOpen,
  onFilterToggle,
  onFilterApply,
  onFilterReset,
  isMobile = false,
  onSearchToggle,
  onFilterChange,
  className,
  isSidebarVisible = false,
  isManagementMode = false,
  onManagementToggle,
  onAddAsset,
  onMoveAsset,
  zoom = 50,
  onZoomChange,
  onBack,
  onForward,
  canGoBack = false,
  canGoForward = false,
  hasParent = false,
  breadcrumbs = [],
  title,
}: LibraryControlsProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const handleSetWatchFolder = async () => {
    if ((window as any).electron) {
      const path = await (window as any).electron.invoke('select-folder');
      if (path) {
        console.log('Watched folder set to:', path);
        // We could add a toast notification here
      }
    }
  };

  if (isMobile) {
    return (
      <div className={cn("flex flex-col w-full select-none", className)}>
        <NVSearchBar
            value={searchText}
            onChange={onSearchChange}
            onFilterClick={onFilterToggle}
            isFilterActive={isFilterOpen}
            className={isMobile? '!text-base' : '' }
            placeholder="에셋 이름, 태그로 검색..."
          />
        <div className={cn(
          "grid transition-all duration-300 ease-in-out",
          isFilterOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 pointer-events-none"
        )}>
          <div className="overflow-hidden">
            <NVSearchPanel
              onApply={(filters) => {
                onFilterApply(filters);
                onFilterToggle();
              }}
              onReset={onFilterReset}
              onClose={onFilterToggle}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <DesktopPageHeader
      className={className}
      left={
        <div className="flex items-center gap-1 min-w-0 flex-1">
          {typeof window !== 'undefined' && (window as any).electron && (
            <NVIconButton 
              icon={FolderSearch} 
              variant="ghost" 
              size="sm" 
              className="hover:text-indigo-400 animate-in fade-in zoom-in duration-500"
              title="감시 폴더 설정 (Monitor Folder)"
              onClick={handleSetWatchFolder}
            />
          )}

          <NVDialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <NVDialogTrigger asChild>
              <NVIconButton 
                icon={Plus} 
                variant="ghost" 
                size="sm"
                title="새 에셋 등록"
              />
            </NVDialogTrigger>
            <NVDialogContent className="max-w-lg p-0 border-white/10 shadow-2xl z-[100]">
              <NVDesktopUploadPanel 
                onAdd={async (data, file) => {
                  let finalAsset = data;
                  if (file) {
                    const processed = await processFileToAsset(file);
                    finalAsset = { ...processed, ...data };
                    if (data.tags && data.tags.length > 0) {
                       finalAsset.tags = [...new Set([...(processed.tags || []), ...data.tags])];
                    }
                  }
                  await onAddAsset?.(finalAsset, file);
                }} 
                onClose={() => setIsAddOpen(false)} 
              />
            </NVDialogContent>
          </NVDialog>
          
          <MoveAssetPopover 
            onMove={onMoveAsset || (() => {})}
            trigger={
              <NVIconButton 
                icon={ArrowLeftRight} 
                variant="ghost" 
                size="sm" 
                title="폴더로 이동 (F)" 
              />
            }
          />

          <NVIconButton 
            icon={ChevronLeft} 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            disabled={!canGoBack}
            className={cn(!canGoBack && "opacity-20 cursor-not-allowed")}
            title="이전 페이지로 이동"
          />
          <NVIconButton 
            icon={ChevronRight} 
            variant="ghost" 
            size="sm" 
            onClick={onForward}
            disabled={!canGoForward}
            className={cn(!canGoForward && "opacity-20 cursor-not-allowed")}
            title="다음 페이지로 이동"
          />
          
          <div className="ml-4 hidden lg:flex items-center gap-1.5 overflow-hidden min-w-0 flex-1">
            <button 
              onClick={() => onBack?.()}
              className={cn(
                "text-xs font-semibold transition-colors whitespace-nowrap shrink-0",
                breadcrumbs.length === 0 ? "text-slate-200 cursor-default" : "text-slate-500 hover:text-indigo-400"
              )}
            >
              {breadcrumbs.length === 0 ? (title || "Library") : "Library"}
            </button>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id}>
                <ChevronRight size={12} className="text-slate-600 shrink-0" />
                <button 
                  onClick={() => {
                    // Navigate to this crumb's folder
                    if (idx < breadcrumbs.length - 1) {
                      // Only if it's not the current one
                      window.location.href = `/folder/${crumb.id}`;
                    }
                  }}
                  className={cn(
                    "text-xs font-semibold truncate transition-colors",
                    idx === breadcrumbs.length - 1 
                      ? "text-slate-200 cursor-default" 
                      : "text-slate-500 hover:text-indigo-400"
                  )}
                  style={{ maxWidth: '100px' }}
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>
      }
      center={
        <div className="flex items-center gap-2 lg:gap-6 w-full max-w-[600px] justify-center min-w-0 px-2 lg:px-4">
          <div className="hidden lg:flex items-center gap-3 px-2 shrink-0">
            <NVIconButton icon={LayoutGrid} variant="ghost" size="sm" className="shrink-0"/>
            <NVSlider 
              value={zoom} 
              onChange={(v) => onZoomChange?.(v)} 
              size="sm" 
              className="w-24" 
            />
            <NVIconButton icon={ImageIcon} variant="ghost" size="sm" className="shrink-0" />
          </div>

          <div className="flex-1 min-w-[140px] max-w-[220px] md:max-w-[480px]">
            <NVPopover open={isFilterOpen} onOpenChange={(open) => {
              if (open !== isFilterOpen) onFilterToggle();
            }}>
              <NVPopoverAnchor asChild>
                <div className="w-full relative" id="search-bar-wrapper">
                  <NVSearchBar 
                    size="sm"
                    value={searchText}
                    onChange={onSearchChange}
                    placeholder="에셋 이름, 태그로 검색..."
                    showFilter={true}
                    onFilterClick={onFilterToggle}
                    isFilterActive={isFilterOpen}
                  />
                </div>
              </NVPopoverAnchor>
              <NVPopoverContent 
                align="center" 
                sideOffset={12} 
                className="p-0 border-none shadow-none bg-transparent w-auto -mt-[5px]"
                onInteractOutside={(e) => {
                  const searchBar = document.getElementById('search-bar-wrapper');
                  if (searchBar?.contains(e.target as Node)) {
                    e.preventDefault();
                  }
                }}
              >
                <NVSearchPanel 
                    layout="desktop"
                    onSearch={(filters) => {
                      onFilterApply(filters);
                      onFilterToggle();
                    }}
                    onClose={onFilterToggle}
                  />
              </NVPopoverContent>
            </NVPopover>
          </div>
        </div>
      }
      right={
        <div 
          className={cn(
            "flex items-center gap-1 pl-2 relative transition-all duration-300",
            isSidebarVisible ? "pr-2" : "pr-13"
          )} 
        >
          <div className="hidden sm:flex items-center gap-1">
            <NVPopover>
              <NVPopoverTrigger asChild>
                <NVIconButton 
                  icon={LayoutGrid} 
                  variant="ghost" 
                  size="sm" 
                  className="app-no-drag"
                  title="보기 옵션"
                />
              </NVPopoverTrigger>
              <NVPopoverContent align="end" sideOffset={8} className="z-[9999]">
                <ViewOptionsPopover />
              </NVPopoverContent>
            </NVPopover>
          </div>

          <NVIconButton 
            icon={ListChecks} 
            variant={isManagementMode ? "secondary" : "ghost"} 
            size="sm" 
            className={cn(
              "app-no-drag hover:text-indigo-400",
              isManagementMode && "text-indigo-400 bg-indigo-400/10"
            )}
            title={isManagementMode ? "에셋 관리 종료" : "에셋 관리"}
            onClick={onManagementToggle}
          />

          
        </div>
      }
    />
  );
}
