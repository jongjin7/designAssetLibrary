'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@nova/lib/utils';
import { NVSearchBar } from '@nova/ui';
import { FilterChips } from './FilterChips';
import { LibraryFilters } from '@nova/hooks/useLibraryFilters';
import { 
  ArrowLeftRight, Plus,
  ChevronRight, ChevronLeft, 
  LayoutGrid, 
  Pin,
  Image as ImageIcon
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
  onSearchToggle,
  onFilterChange,
  className,
  isSidebarVisible = false,
  onAddAsset,
  zoom = 50,
  onZoomChange,
}: LibraryControlsProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);

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
        <>
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
          <NVIconButton icon={ArrowLeftRight} variant="ghost" size="sm" onClick={onSearchToggle}
            title="이동 (Cmd+F)" />
          <NVIconButton icon={ChevronLeft} variant="ghost" size="sm" />
          <NVIconButton icon={ChevronRight} variant="ghost" size="sm" />
          
          <div className="ml-4 text-xs font-semibold text-slate-300 tracking-tight whitespace-nowrap truncate min-w-0 flex-shrink">
            현재 선택될 폴더
          </div>
        </>
      }
      center={
        <div className="flex items-center gap-6 w-full max-w-[600px] justify-center">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 px-2">
            <NVIconButton icon={LayoutGrid} variant="ghost" size="sm" className="shrink-0"/>
            <NVSlider 
              value={zoom} 
              onChange={(v) => onZoomChange?.(v)} 
              size="sm" 
              className="w-24" 
            />
            <NVIconButton icon={ImageIcon} variant="ghost" size="sm" className="shrink-0" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-[320px]">
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
          <NVPopover>
            <NVPopoverTrigger asChild>
              <NVIconButton 
                icon={LayoutGrid} 
                variant="ghost" 
                size="sm" 
                className="data-[state=open]:text-white app-no-drag"
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

          <NVIconButton icon={Pin} variant="ghost" size="sm" className="app-no-drag"/>
        </div>
      }
    />
  );
}
