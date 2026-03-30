'use client';

import { useLibraryPage } from '@nova/hooks/useLibraryPage';
import DesktopLibraryView from '@nova/app/(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '@nova/app/(mobile)/library/MobileLibraryView';
import { SearchPalette } from '@nova/components/library/SearchPalette';
import { NVSplashScreen } from '@nova/ui';

export default function InboxPage() {
  const { isDesktop, desktopShell, loading, assets, isSelectionMode, setIsSelectionMode, commonProps } =
    useLibraryPage({ initialFilter: 'inbox', title: '인박스' });

  if (isDesktop === null || (loading && assets.length === 0)) {
    return <NVSplashScreen message="인박스 에셋 불러오는 중..." mode="syncing" />;
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
