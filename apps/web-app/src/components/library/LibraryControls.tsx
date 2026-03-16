import React, { useState } from 'react';
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
  Search,
  ChevronDown
} from 'lucide-react';
import { NVIconButton } from '@nova/ui';

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
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isSearchVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchVisible]);

  if (isMobile) {
    return (
      <div className="flex flex-col w-full">
        <div className="">
          <SearchBar 
            value={searchText}
            onChange={onSearchChange}
            onFilterClick={onFilterToggle}
            placeholder="에셋 이름, 태그로 검색..."
            showFilter={true}
          />
        </div>

        {isFilterOpen && (
          <div className="">
            <AdvancedFilter 
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
        className="h-12 flex items-center px-4 bg-slate-950/40 backdrop-blur-2xl border-b border-white/[0.05] sticky top-0 z-30"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-0 ml-2">
          <NVIconButton icon={Plus} variant="ghost" size="sm" className="text-slate-400 hover:text-white" />
            <NVIconButton icon={ArrowLeftRight} variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={onSearchToggle}
              title="검색 (Cmd+F)" />
          <NVIconButton icon={ChevronLeft} variant="ghost" size="sm" className="text-slate-600" />
          <NVIconButton icon={ChevronRight} variant="ghost" size="sm" className="text-slate-600" />
        </div>

        {/* Title */}
        <div className="ml-4 text-[13px] font-semibold text-slate-300 tracking-tight">
          InteriorDesign
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

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-0.5" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <NVIconButton icon={Cloud} variant="ghost" size="sm" className="text-slate-400" />
          <NVIconButton icon={Zap} variant="ghost" size="sm" className="text-slate-400" />
          <NVIconButton icon={LayoutGrid} variant="ghost" size="sm" className="text-slate-400" />
          <NVIconButton 
            icon={Filter} 
            variant="ghost" 
            size="sm" 
            className={isFilterOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400'} 
            onClick={onFilterToggle}
          />
          
          {/* Integrated Search Bar (Toggleable on Desktop) */}
          <div className={`relative ml-2 overflow-hidden transition-all duration-300 ease-in-out flex items-center ${isSearchVisible ? 'w-56 opacity-100' : 'w-0 opacity-0'}`} style={{ WebkitAppRegion: 'no-drag' } as any}>
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-500 pointer-events-none">
              <Search size={13} />
              <ChevronDown size={10} className="opacity-50" />
            </div>
            <input 
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search assets..."
              className="w-full h-7 bg-white/[0.05] border border-white/[0.1] rounded-md pl-10 pr-3 text-[12px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner"
            />
          </div>

          <NVIconButton icon={Pin} variant="ghost" size="sm" className="ml-1 text-slate-500 hover:text-slate-300" />
        </div>
      </header>

      {isFilterOpen && (
        <div className="bg-slate-900/50 backdrop-blur-md border-b border-white/5 animate-in slide-in-from-top-1 duration-200">
          <AdvancedFilter 
            isMobile={false}
            onApply={onFilterApply}
            onReset={onFilterReset}
          />
        </div>
      )}
    </div>
  );
}
