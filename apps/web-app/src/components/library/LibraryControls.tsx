'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { SearchBar } from '../shared/SearchBar';
// Removed AdvancedFilter import
import { FilterChips } from './FilterChips';
import { LibraryFilters } from '../../hooks/useLibraryFilters';
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
import { DesktopAssetForm } from './DesktopAssetForm';
import { 
  NVPopover, 
  NVPopoverTrigger, 
  NVPopoverContent,
  NVIconButton,
  NVDialog,
  NVDialogContent,
  NVDesktopSearchPanel,
  NVSearchPanel,
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
}: LibraryControlsProps) {
  const [zoom, setZoom] = useState(50);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    onSearchToggle?.();
  };

  if (isMobile) {
    return (
      <div className={cn("flex flex-col w-full select-none gap-2", className)}>
        <SearchBar
            size="sm"
            value={searchText}
            onChange={onSearchChange}
            onFilterClick={onFilterToggle}
            placeholder="에셋 이름, 태그로 검색..."
            showFilter={true}
            isFilterActive={isFilterOpen}
          />

        {isFilterOpen && (
          <NVSearchPanel
              className="!bg-white/3 rounded-xl mt-2 !backdrop-blur-xl"
              onApply={onFilterApply}
              onReset={onFilterReset}
            />
        )}
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
          <NVPopover open={isAddOpen} onOpenChange={setIsAddOpen}>
            <NVPopoverTrigger asChild>
              <NVIconButton 
                icon={Plus} 
                variant="ghost" 
                size="sm" 
                className={cn("text-slate-400 hover:text-white transition-colors", isAddOpen && "text-indigo-400 bg-indigo-500/10")} 
                title="새 에셋 등록"
              />
            </NVPopoverTrigger>
            <NVPopoverContent align="start" sideOffset={8} className="p-0 border-white/10 shadow-2xl z-[100]">
              <DesktopAssetForm 
                onAdd={onAddAsset ?? (async () => {})} 
                onClose={() => setIsAddOpen(false)} 
              />
            </NVPopoverContent>
          </NVPopover>
          <NVIconButton icon={ArrowLeftRight} variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={onSearchToggle}
            title="이동 (Cmd+F)" />
          <NVIconButton icon={ChevronLeft} variant="ghost" size="sm" className="text-slate-600" />
          <NVIconButton icon={ChevronRight} variant="ghost" size="sm" className="text-slate-600" />
        </div>

        {/* Title */}
        <div className="ml-4 text-sm font-semibold text-slate-300 tracking-tight whitespace-nowrap truncate min-w-0 flex-shrink">
          현재 선택될 폴더
        </div>

        {/* Zoom Slider */}
        <div className="flex-shrink-0 flex items-center gap-3 px-6" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            className="w-28 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500" 
          />
        </div>

        <div className="flex-1 max-w-[320px] mx-auto px-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <SearchBar 
            size="sm"
            value={searchText}
            onChange={onSearchChange}
            placeholder="에셋 이름, 태그로 검색..."
            showFilter={true}
            onFilterClick={onFilterToggle}
            isFilterActive={isFilterOpen}
          />
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
      
      {/* Desktop Advanced Filter Modal */}
      <NVDialog open={!isMobile && isFilterOpen} onOpenChange={onFilterToggle}>
        <NVDialogContent className="max-w-3xl p-0 border-none bg-transparent shadow-none">
          <NVDesktopSearchPanel 
            layout="desktop"
            onSearch={(filters) => {
              onFilterApply(filters);
              onFilterToggle();
            }}
            onClose={onFilterToggle}
          />
        </NVDialogContent>
      </NVDialog>

      <div className="px-8 py-2 border-b border-white/[0.05]">
        <FilterChips active={activeFilter} onChange={onFilterChange ?? (() => {})} />
      </div>

      
    </div>
  );
}
