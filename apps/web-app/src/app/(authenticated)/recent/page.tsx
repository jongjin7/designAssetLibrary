'use client';

import { useLibraryPage } from '@nova/hooks/useLibraryPage';
import DesktopLibraryView from '@nova/app/(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '@nova/app/(mobile)/library/MobileLibraryView';
import { SearchPalette } from '@nova/components/library/SearchPalette';
import { NVSplashScreen } from '@nova/ui';

export default function RecentPage() {
  const { isDesktop, desktopShell, loading, assets, isSelectionMode, setIsSelectionMode, commonProps } =
    useLibraryPage({ initialFilter: 'recent', title: '최근 항목' });

  if (isDesktop === null || (loading && assets.length === 0)) {
    return <NVSplashScreen message="최근 항목 불러오는 중..." mode="syncing" />;
  }

  if (isDesktop) {
    return (
      <>
        <DesktopLibraryView {...commonProps} />
        <SearchPalette
          isOpen={commonProps.isSearchVisible}
          onClose={() => desktopShell?.setIsSearchVisible(false)}
          value={commonProps.searchText}
          onChange={commonProps.setSearchText}
        />
      </>
    );
  }

  return (
    <MobileLibraryView
      {...commonProps}
      isSelectionMode={isSelectionMode}
      setIsSelectionMode={setIsSelectionMode}
    />
  );
}
