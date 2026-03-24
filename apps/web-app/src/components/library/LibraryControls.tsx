'use client';

import React, { useState } from 'react';
import { cn } from '@nova/lib/utils';
import { NVGlassPanel, NVPopoverHeader, NVSearchBar } from '@nova/ui';
import { FilterChips } from './FilterChips';
import { LibraryFilters } from '@nova/hooks/useLibraryFilters';
import { 
  ArrowLeftRight, Plus,
  ChevronRight, ChevronLeft, 
  Cloud, 
  Zap, 
  LayoutGrid, 
  Filter, 
  Pin,
  Image as ImageIcon,
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
  NVAssetSelectionBar,
  NVDialog,
  NVDialogTrigger,
  NVDialogContent,
  NVSearchPanel,
  NVDesktopUploadPanel,
  NVBottomSheet,
} from '@nova/ui';

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
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  className?: string;
  isSidebarVisible?: boolean;
  onAddAsset?: (data: any, file?: File) => Promise<void>;
  zoom?: number;
  onZoomChange?: (value: number) => void;
}

export function LibraryControls({
  searchText,
  onSearchChange,
  isFilterOpen,
  onFilterToggle,
  onFilterApply,
  onFilterReset,
  isMobile = false,
  isSearchVisible = false,
  onSearchToggle,
  activeFilter = 'all',
  onFilterChange,
  className,
  isSidebarVisible = false,
  onAddAsset,
  zoom = 50,
  onZoomChange,
}: LibraryControlsProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    onSearchToggle?.();
  };

  if (isMobile) {
    return (
      <div className={cn("flex flex-col w-full select-none", className)}>
        <NVSearchBar
            value={searchText}
            onChange={onSearchChange}
            onFilterClick={ onFilterToggle}
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
    <div className={cn("flex flex-col w-full select-none", className)}>
      {/* Premium Desktop Toolbar (macOS Style) */}
      <header 
        className="h-12 flex items-center justify-between px-4 bg-slate-950/40 backdrop-blur-2xl border-b border-white/[0.05] sticky top-0 z-30"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-0 ml-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <NVDialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <NVDialogTrigger asChild>
              <NVIconButton 
                icon={Plus} 
                variant="ghost" 
                size="sm" 
                className={cn("text-slate-400 hover:text-white transition-colors", isAddOpen && "text-white bg-white/10")} 
                title="새 에셋 등록"
              />
            </NVDialogTrigger>
            <NVDialogContent className="max-w-lg p-0 border-white/10 shadow-2xl z-[100]">
              <NVDesktopUploadPanel 
                onAdd={async (data, file) => {
                  let finalAsset = data;
                  if (file) {
                    const processed = await processFileToAsset(file);
                    // Merge processed metadata with user input (tags, name)
                    finalAsset = { ...processed, ...data };
                    // If the user manually provided tags, we should combine them or prioritize user input
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
          <NVIconButton icon={ArrowLeftRight} variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={onSearchToggle}
            title="이동 (Cmd+F)" />
          <NVIconButton icon={ChevronLeft} variant="ghost" size="sm" className="text-slate-600" />
          <NVIconButton icon={ChevronRight} variant="ghost" size="sm" className="text-slate-600" />
        </div>

        {/* Title */}
        <div className="ml-4 text-sm font-semibold text-slate-300 tracking-tight whitespace-nowrap truncate min-w-0 flex-shrink">
          현재 선택될 폴더
        </div>

        {/* Zoom Slider with Icons */}
        <div className="flex-shrink-0 flex items-center gap-2 px-6" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <LayoutGrid size={14} className="text-slate-500 flex-shrink-0" />
          <NVSlider 
            value={zoom} 
            onChange={(v) => onZoomChange?.(v)} 
            size="sm" 
            className="w-24" 
          />
          <ImageIcon size={14} className="text-slate-500 flex-shrink-0" />
        </div>

        <div className="flex-1 max-w-[320px] mx-auto px-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
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

        {/* Right Actions */}
        <div 
          className={cn(
            "flex items-center gap-0.5 pl-6 relative transition-all duration-300",
            isSidebarVisible ? "pr-2" : "pr-10"
          )} 
          style={{ WebkitAppRegion: 'no-drag' } as any}
        >
          <NVPopover>
            <NVPopoverTrigger asChild>
              <NVIconButton 
                icon={LayoutGrid} 
                variant="ghost" 
                size="sm" 
                className="data-[state=open]:text-white"
                title="보기 옵션"
              />
            </NVPopoverTrigger>
            
            <NVPopoverContent 
              align="end" 
              sideOffset={8}
              className="z-[9999]"
            >
              <ViewOptionsPopover />
            </NVPopoverContent>
          </NVPopover>

          <NVIconButton icon={Pin} variant="ghost" size="sm" className="ml-1 text-slate-500 hover:text-slate-300" />
        </div>
      </header>
      

      

      <div className="px-8 py-2 border-b border-white/[0.05]">
        <FilterChips active={activeFilter} onChange={onFilterChange ?? (() => {})} />
      </div>
    </div>
  );
}
