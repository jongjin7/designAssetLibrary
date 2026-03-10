'use client';

import { useRouter } from 'next/navigation';
import { TopBar } from '../../../components/layout/TopBar';
import { SearchBar } from '../../../components/shared/SearchBar';
import { RecentSearchChips } from '../../../components/search/RecentSearchChips';
import { ColorPaletteFilter } from '../../../components/search/ColorPaletteFilter';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { AssetDetail } from '../../../components/detail/AssetDetail';
import { useSearch } from '../../../hooks/useSearch';
import { useState } from 'react';
import { Asset } from '../../../types/asset';

export default function SearchPage() {
  const router = useRouter();
  const { query, setQuery, results, recentSearches, addRecentSearch, deleteAsset, inputRef, hasQuery } = useSearch();
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleSearchTap = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
  };

  return (
    <>
      <TopBar />
      
      <section className="search-screen">
        <SearchBar
          value={query}
          onChange={setQuery}
          showFilter={false}
          autoFocus
          inputRef={inputRef}
          placeholder="태그, 컬러, 파일명 검색..."
        />

        {!hasQuery ? (
          <div className="search-screen__discover">
            <RecentSearchChips searches={recentSearches} onTap={handleSearchTap} />
            <ColorPaletteFilter onColorTap={handleSearchTap} />
          </div>
        ) : (
          <div className="search-screen__results">
            {results.length === 0 ? (
              <div className="empty-state">
                <p className="empty-state__icon">🔍</p>
                <p className="empty-state__text">검색 결과가 없습니다</p>
                <p className="empty-state__sub">&apos;{query}&apos;에 대한 결과를 찾을 수 없습니다</p>
              </div>
            ) : (
              <AssetGrid assets={results} onAssetTap={setSelectedAsset} />
            )}
          </div>
        )}

        <AssetDetail asset={selectedAsset} onClose={() => setSelectedAsset(null)} onDelete={deleteAsset} />
      </section>
    </>
  );
}
