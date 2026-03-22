import { useState, useMemo, useCallback } from 'react';
import { Asset } from '../types/asset';

export interface LibraryFilters {
  keyword: string;
  colors: string[];
  tags: string[];
  period: string;
}

export function useLibraryFilters(assets: Asset[]) {
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<LibraryFilters>({
    keyword: '',
    colors: [],
    tags: [],
    period: '',
  });

  const filteredAssets = useMemo(() => {
    let result = assets;
    
    // Quick search text (independent of advanced filters)
    if (searchText) {
      const term = searchText.toLowerCase();
      result = result.filter(a => 
        a.fileName.toLowerCase().includes(term) ||
        a.tags.some(t => t.toLowerCase().includes(term))
      );
    }
    
    // Advanced filters
    if (activeFilters) {
      if (activeFilters.keyword) {
        const term = activeFilters.keyword.toLowerCase();
        result = result.filter(a => 
          a.fileName.toLowerCase().includes(term) ||
          a.tags.some(t => t.toLowerCase().includes(term))
        );
      }

      if (activeFilters.colors.length > 0) {
        result = result.filter(a => 
          activeFilters.colors.some(colorTerm => {
            const term = colorTerm.toLowerCase();
            return a.tags.some(t => t.toLowerCase().includes(term)) ||
                   a.palette?.some(p => p.toLowerCase().includes(term));
          })
        );
      }
      
      if (activeFilters.tags.length > 0) {
        result = result.filter(a => 
          activeFilters.tags.some(tagTerm => {
            const term = tagTerm.toLowerCase().replace('#', '');
            return a.tags.some(t => t.toLowerCase().includes(term));
          })
        );
      }

      if (activeFilters.period) {
        // Logic for period filtering could be added here if needed
        // For now, it's just a placeholder in the state
      }
    }
    
    return result;
  }, [assets, searchText, activeFilters]);

  const handleFilterApply = useCallback((filters: LibraryFilters) => {
    setActiveFilters(filters);
  }, []);

  const handleFilterReset = useCallback(() => {
    setActiveFilters({
      keyword: '',
      colors: [],
      tags: [],
      period: '',
    });
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
