'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '../../../components/layout/TopBar';
import { SearchBar } from '../../../components/shared/SearchBar';
import { FilterChips } from '../../../components/library/FilterChips';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { AssetDetail } from '../../../components/detail/AssetDetail';
import { useAssets } from '../../../hooks/useAssets';

export default function LibraryPage() {
  const router = useRouter();
  const { assets, loading, filter, setFilter, selectedAsset, openDetail, closeDetail, deleteAsset, updateAsset } = useAssets();
  const [searchText, setSearchText] = useState('');

  // Inline filtering for text search
  const filteredAssets = useMemo(() => {
    if (!searchText) return assets;
    const term = searchText.toLowerCase();
    return assets.filter(a => 
      a.fileName.toLowerCase().includes(term) ||
      a.tags.some(t => t.toLowerCase().includes(term))
    );
  }, [assets, searchText]);

  return (
    <>
      <TopBar />

      <section className="library-screen">
        <SearchBar 
          value={searchText}
          onChange={setSearchText}
          onFilterClick={() => router.push('/search')}
          placeholder="에셋 이름, 태그로 검색..." 
        />
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
