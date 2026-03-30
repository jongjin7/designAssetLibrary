'use client';

import { Search, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useAssetStore } from '@nova/store/useAssetStore';
import { useLibraryFilters } from '@nova/hooks/useLibraryFilters';
import { MobileTopBar } from '@nova/components/layout/MobileTopBar';
import { LibraryControls } from '@nova/components/library/LibraryControls';
import { FilterChips } from '@nova/components/library/FilterChips';
import { NVIconButton } from '@nova/ui';

export function MobileLibraryHeader() {
  const router = useRouter();
  const pathname = usePathname();
  
  const { 
    assets,
    filter, 
    searchText, 
    setSearchText, 
    isFilterOpen, 
    setIsFilterOpen,
    isSearchVisible,
    setIsSearchVisible
  } = useAssetStore();

  // We actually need the library filters logic for advanced filtering if any,
  // but for the persistent header, the core search and chips are enough.
  const { handleFilterApply, handleFilterReset } = useLibraryFilters(assets);

  const handleFilterChange = (key: string) => {
    if (key.startsWith('folder_')) {
      const folderId = key.replace('folder_', '');
      router.push(`/folder/${folderId}`);
      return;
    }

    const pathMap: Record<string, string> = {
      all: '/library',
      inbox: '/inbox',
      favorites: '/favorites',
      recent: '/recent'
    };
    const target = pathMap[key] || '/library';
    router.push(target);
  };

  const handleSearchToggle = () => {
    if (isSearchVisible) {
      setSearchText('');
      setIsFilterOpen(false);
    }
    setIsSearchVisible(!isSearchVisible);
  };

  // Only show this header on library-related routes
  const isLibraryRoute = pathname.startsWith('/library') || 
                           pathname.startsWith('/inbox') || 
                           pathname.startsWith('/favorites') || 
                           pathname.startsWith('/recent') || 
                           pathname.startsWith('/folder');

  if (!isLibraryRoute) return null;

  return (
    <MobileTopBar
      rightElement={
        <NVIconButton
          icon={isSearchVisible ? X : Search}
          variant="ghost"
          size="sm"
          iconSize={24} 
          onClick={handleSearchToggle}
          className={isSearchVisible ? 'text-white' : 'text-slate-400 hover:text-white'}
        />
      }
    >
      {/* 검색 영역: 아이콘 탭 후 접근 */}
      {isSearchVisible && (
        <LibraryControls
            isMobile={true}
            searchText={searchText}
            onSearchChange={setSearchText}
            isFilterOpen={isFilterOpen}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            onFilterApply={handleFilterApply}
            onFilterReset={handleFilterReset}
            className="px-5 py-2"
          />
      )}

      {!isFilterOpen && <div className="px-5 py-2 shadow-md shadow-black/20">
        <FilterChips active={filter} onChange={handleFilterChange} />
      </div>}
    </MobileTopBar>
  );
}
