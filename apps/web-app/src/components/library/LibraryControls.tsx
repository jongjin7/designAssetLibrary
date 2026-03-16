import React from 'react';
import { SearchBar } from '../shared/SearchBar';
import { AdvancedFilter } from './AdvancedFilter';
import { LibraryFilters } from '../../hooks/useLibraryFilters';

interface LibraryControlsProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  isFilterOpen: boolean;
  onFilterToggle: () => void;
  onFilterApply: (filters: LibraryFilters) => void;
  onFilterReset: () => void;
  isMobile?: boolean;
}

export function LibraryControls({
  searchText,
  onSearchChange,
  isFilterOpen,
  onFilterToggle,
  onFilterApply,
  onFilterReset,
  isMobile = false
}: LibraryControlsProps) {
  return (
    <div className="flex flex-col w-full">
      <div className={isMobile ? '' : 'h-16 px-8 flex items-center border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-20'}>
        <SearchBar 
          value={searchText}
          onChange={onSearchChange}
          onFilterClick={onFilterToggle}
          placeholder="에셋 이름, 태그로 검색..."
          showFilter={true}
        />
      </div>

      {isFilterOpen && (
        <div className={isMobile ? '' : 'bg-slate-900 border-b border-white/5'}>
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
