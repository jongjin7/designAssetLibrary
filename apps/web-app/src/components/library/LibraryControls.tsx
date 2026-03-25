'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@nova/lib/utils';
import { NVGlassPanel, NVPopoverHeader, NVSearchBar } from '@nova/ui';
import { FilterChips } from './FilterChips';
import { LibraryFilters } from '@nova/hooks/useLibraryFilters';
import { 
  ArrowLeftRight, Plus,
  ChevronRight, ChevronLeft, 
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Cloud, 
  Zap, 
  LayoutGrid, 
  Filter, 
  Pin,
  Image as ImageIcon,
  Menu, PanelLeft
} from 'lucide-react';
import { ViewOptionsPopover } from './ViewOptionsPopover';
import { processFileToAsset } from '@nova/lib/assetProcessor';
import { useDesktopShell } from '../layout/DesktopShell';
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
import Link from 'next/link';



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
  const shell = useDesktopShell();
  const isSidebarCollapsed = shell?.isSidebarCollapsed ?? false;
  const isDesktopApp = shell?.isDesktopApp ?? false;
  const handleToggleSidebar = shell?.handleToggleSidebar ?? (() => {});

  const [showToggle, setShowToggle] = useState(isSidebarCollapsed);

  useEffect(() => {
    if (isSidebarCollapsed) {
      setShowToggle(true);
    } else {
      const timer = setTimeout(() => {
        setShowToggle(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isSidebarCollapsed]);

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
        className={
          cn("flex items-center justify-between px-4 bg-slate-950/40 backdrop-blur-2xl border-b border-white/[0.05] sticky top-0 z-30 no-select app-drag-region",
            isDesktopApp ? "h-10" : "h-12"
          )
        }
      >
        
        {showToggle ? (
          <div className={cn(
            "shrink-0 h-full flex items-center px-2 gap-6 border-white/[0.05] border-r",
            isDesktopApp ? "pl-15" : ""
          )}>
            {!isDesktopApp?  (<h1 className="pl-2 text-2xl font-black bg-gradient-to-br from-indigo-400 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                <Link href="/">T</Link>
            </h1> ): undefined}
            <NVIconButton
              icon={PanelLeft}
              variant="ghost"
              size="sm"
              onClick={handleToggleSidebar}
              className="app-no-drag"
              title="메뉴 확장"
            /> 
          </div>
        ):undefined}
            

        <div className="flex items-center gap-1 ml-2 app-no-drag">
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
          <NVIconButton icon={ArrowLeftRight} variant="ghost" size="sm" onClick={onSearchToggle}
            title="이동 (Cmd+F)" />
          <NVIconButton icon={ChevronLeft} variant="ghost" size="sm" />
          <NVIconButton icon={ChevronRight} variant="ghost" size="sm" />
        </div>

        {/* Title */}
        <div className="ml-4 text-xs font-semibold text-slate-300 tracking-tight whitespace-nowrap truncate min-w-0 flex-shrink">
          현재 선택될 폴더
        </div>

        {/* Zoom Slider with Icons */}
        <div className="flex items-center gap-3 px-6 app-no-drag">
          <NVIconButton icon={LayoutGrid} variant="ghost" size="sm"  className="shrink-0"/>
          <NVSlider 
            value={zoom} 
            onChange={(v) => onZoomChange?.(v)} 
            size="sm" 
            className="w-24" 
          />
          <NVIconButton icon={ImageIcon} variant="ghost" size="sm" className="shrink-0" />
        </div>

        <div className="flex-1 max-w-[320px] mx-auto px-4 app-no-drag">
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
            "flex items-center gap-1 pl-6 relative transition-all duration-300",
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
      </header>

      <div className="px-8 py-2 border-b border-white/[0.05]">
        <FilterChips active={activeFilter} size="sm" onChange={onFilterChange ?? (() => {})} />
      </div>
    </div>
  );
}
