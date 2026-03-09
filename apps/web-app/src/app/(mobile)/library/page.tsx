'use client';

import { useRouter } from 'next/navigation';
import { TopBar } from '../../../components/layout/TopBar';
import { SearchBar } from '../../../components/shared/SearchBar';
import { FilterChips } from '../../../components/library/FilterChips';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { AssetDetail } from '../../../components/detail/AssetDetail';
import { useAssets } from '../../../hooks/useAssets';

export default function LibraryPage() {
  const router = useRouter();
  const { assets, filter, setFilter, selectedAsset, openDetail, closeDetail } = useAssets();

  return (
    <>
      <TopBar />

      <section className="library-screen">
        <SearchBar readOnly onClick={() => router.push('/search')} placeholder="🔍 에셋 검색..." />
        <FilterChips active={filter} onChange={(f) => setFilter(f as any)} />
        <AssetGrid assets={assets} onAssetTap={openDetail} />
      </section>

      <AssetDetail asset={selectedAsset} onClose={closeDetail} />
    </>
  );
}
