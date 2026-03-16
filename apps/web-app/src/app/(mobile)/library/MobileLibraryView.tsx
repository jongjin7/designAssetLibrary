'use client';

import { useState, useMemo } from 'react';
import { TopBar } from '../../../components/layout/TopBar';
import { SearchBar } from '../../../components/shared/SearchBar';
import { AdvancedFilter } from '../../../components/library/AdvancedFilter';
import { FilterChips } from '../../../components/library/FilterChips';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { AssetDetail } from '../../../components/detail/AssetDetail';
import { useAssets } from '../../../hooks/useAssets';

export default function LibraryPage() {
  const { assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset } = useAssets();
  const [searchText, setSearchText] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>(null);

  // Inline filtering for text search
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
        // Simple color matching based on tags or future palette analysis
        result = result.filter(a => 
          a.tags.some(t => t.toLowerCase().includes(activeFilters.color.toLowerCase())) ||
          a.palette?.some(p => p.toLowerCase().includes(activeFilters.color.toLowerCase()))
        );
      }
      if (activeFilters.tags) {
        const tagTerm = activeFilters.tags.toLowerCase().replace('#', '');
        result = result.filter(a => a.tags.some(t => t.toLowerCase().includes(tagTerm)));
      }
    }
    return result;
  }, [assets, searchText, activeFilters]);

  const handleFilterApply = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleFilterReset = () => {
    setActiveFilters(null);
  };

  return (
    <>
      <TopBar />

      <section className="library-screen">
        <SearchBar 
          value={searchText}
          onChange={setSearchText}
          onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
          placeholder="에셋 이름, 태그로 검색..." 
        />
        
        {isFilterOpen && (
          <AdvancedFilter 
            isMobile={true}
            onApply={handleFilterApply}
            onReset={handleFilterReset}
          />
        )}

        <FilterChips active={filter} onChange={(f) => setFilter(f as any)} />
        
        {loading ? (
          <div className="library-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', color: 'var(--color-nv-text-secondary)' }}>
            <p>자산을 불러오는 중...</p>
          </div>
        ) : (
          <AssetGrid assets={filteredAssets} onAssetTap={openDetail} />
        )}
      </section>

      <AssetDetail asset={selectedAsset} onClose={closeDetail} onDelete={deleteAsset} />
    </>
  );
}
