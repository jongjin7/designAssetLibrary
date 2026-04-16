import { useMemo, useCallback } from 'react';
import { Asset } from '@nova/types/asset';
import { useAssetStore, LibraryFilters } from '@nova/store/useAssetStore';

export function useLibraryFilters(assets: Asset[]) {
  const {
     searchText, setSearchText, isFilterOpen, setIsFilterOpen,
     activeFilters, setActiveFilters, handleFilterReset: resetAll,
     viewOptions,
  } = useAssetStore();
  
  const filteredAssets = useMemo(() => {
    let result = assets;
    
    // Quick search text
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
        const now = new Date();
        result = result.filter(a => {
          const createdAt = new Date(a.createdAt);
          const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
          
          if (activeFilters.period === 'today') return diffInDays < 1;
          if (activeFilters.period === 'week') return diffInDays < 7;
          if (activeFilters.period === 'month') return diffInDays < 30;
          return true;
        });
      }
    }

    // Sort
    const { sortMethod, sortOrder } = viewOptions;
    if (sortMethod === 'default') {
      // 기본: 최근 등록순 (createdAt 내림차순)
      result = [...result].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortMethod === 'name') {
          cmp = a.fileName.localeCompare(b.fileName, undefined, { numeric: true, sensitivity: 'base' });
        } else if (sortMethod === 'date') {
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortOrder === 'desc' ? -cmp : cmp;
      });
    }
    
    return result;
  }, [assets, searchText, activeFilters, viewOptions]);

  const handleFilterApply = useCallback((filters: LibraryFilters) => {
    setActiveFilters(filters);
  }, [setActiveFilters]);

  const handleFilterReset = useCallback(() => {
    resetAll();
  }, [resetAll]);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen(prev => !prev);
  }, [setIsFilterOpen]);

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

export type { LibraryFilters };
