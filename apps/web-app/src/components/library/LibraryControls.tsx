import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { SearchBar } from '../shared/SearchBar';
import { AdvancedFilter } from './AdvancedFilter';
import { LibraryFilters } from '../../hooks/useLibraryFilters';
import { 
  ArrowLeftRight, Plus,
  ChevronRight, ChevronLeft, 
  Cloud, 
  Zap, 
  LayoutGrid, 
  Filter, 
  Pin,
} from 'lucide-react';
import { ViewOptionsPopover } from './ViewOptionsPopover';
import { 
  NVPopover, 
  NVPopoverTrigger, 
  NVPopoverContent,
  NVIconButton,
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
  onSearchToggle
}: LibraryControlsProps) {
  const [zoom, setZoom] = useState(50);

  const handleSearchChange = (value: string) => {
    onSearchChange(value);
    onSearchToggle?.();
  };

  if (isMobile) {
    return (
      <div className="flex flex-col w-full">
      <div className="px-5 py-0.5">
        <SearchBar 
          size="sm"
          value={searchText}
          onChange={onSearchChange}
          onFilterClick={onFilterToggle}
          placeholder="에셋 이름, 태그로 검색..."
          showFilter={true}
          isFilterActive={isFilterOpen}
        />
      </div>

      {isFilterOpen && (
        <div className="px-5 py-1.5 border-b border-white/5 bg-white/[0.01]">
            <AdvancedFilter 
              className={isFilterOpen ? "!bg-white/3" : ""}
              isMobile={isMobile}
              onApply={onFilterApply}
              onReset={onFilterReset}
            />
        </div>
      )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full select-none">
      {/* Premium Desktop Toolbar (macOS Style) */}
      <header 
        className="h-12 flex items-center justify-between px-4 bg-slate-950/40 backdrop-blur-2xl border-b border-white/[0.05] sticky top-0 z-30"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-0 ml-2">
          <NVIconButton icon={Plus} variant="ghost" size="sm" className="text-slate-400 hover:text-white" />
          <NVIconButton icon={ArrowLeftRight} variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={onSearchToggle}
            title="이동 (Cmd+F)" />
          <NVIconButton icon={ChevronLeft} variant="ghost" size="sm" className="text-slate-600" />
          <NVIconButton icon={ChevronRight} variant="ghost" size="sm" className="text-slate-600" />
        </div>

        {/* Title */}
        <div className="ml-4 text-sm font-semibold text-slate-300 tracking-tight">
          현재 선택될 폴더
        </div>

        {/* Zoom Slider */}
        <div className="flex items-center gap-3 px-6" style={{ WebkitAppRegion: 'no-drag' } as any}>
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
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-0.5 pl-6 relative" style={{ WebkitAppRegion: 'no-drag' } as any}>
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
          
          <NVIconButton 
            icon={Filter} 
            variant="ghost" 
            size="sm" 
            className={isFilterOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'} 
            onClick={onFilterToggle}
          />

          <NVIconButton icon={Pin} variant="ghost" size="sm" className="ml-1 text-slate-500 hover:text-slate-300" />
        </div>
      </header>

      {isFilterOpen && (
        <AdvancedFilter 
          isMobile={false}
          onApply={onFilterApply}
          onReset={onFilterReset}
        />
      )}
    </div>
  );
}
