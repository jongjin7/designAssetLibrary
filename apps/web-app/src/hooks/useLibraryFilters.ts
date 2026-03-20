import { useState, useMemo, useCallback } from 'react';
import { Asset } from '../types/asset';

export interface LibraryFilters {
  color?: string;
  tags?: string;
}

export function useLibraryFilters(assets: Asset[]) {
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<LibraryFilters | null>(null);

  const filteredAssets = useMemo(() => {
    let result = assets;
    
    if (searchText) {
      const term = searchText.toLowerCase();
      result = result.filter(a => 
        a.fileName.toLowerCase().includes(term) ||
        a.tags.some(t => t.toLowerCase().includes(term))
      );
    }
    
    if (activeFilters) {
      if (activeFilters.color) {
        const colorTerm = activeFilters.color.toLowerCase();
        result = result.filter(a => 
          a.tags.some(t => t.toLowerCase().includes(colorTerm)) ||
          a.palette?.some(p => p.toLowerCase().includes(colorTerm))
        );
      }
      
      if (activeFilters.tags) {
        const tagTerm = activeFilters.tags.toLowerCase().replace('#', '');
        result = result.filter(a => a.tags.some(t => t.toLowerCase().includes(tagTerm)));
      }
    }
    
    return result;
  }, [assets, searchText, activeFilters]);

  const handleFilterApply = useCallback((filters: LibraryFilters) => {
    setActiveFilters(filters);
  }, []);

  const handleFilterReset = useCallback(() => {
    setActiveFilters(null);
  }, []);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, []);

  return {
    searchText,
    setSearchText,
    isFilterOpen,
    setIsFilterOpen,
    activeFilters,
    filteredAssets,
    handleFilterApply,
    handleFilterReset,
    toggleFilter
  };
}
