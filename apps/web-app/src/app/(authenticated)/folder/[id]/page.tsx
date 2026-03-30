'use client';

import { useParams } from 'next/navigation';
import { useLibraryPage } from '@nova/hooks/useLibraryPage';
import DesktopLibraryView from '@nova/app/(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '@nova/app/(mobile)/library/MobileLibraryView';
import { SearchPalette } from '@nova/components/library/SearchPalette';
import { NVSplashScreen } from '@nova/ui';

export default function FolderPage() {
  const { id: folderId } = useParams() as { id: string };

  const { isDesktop, desktopShell, loading, assets, isSelectionMode, setIsSelectionMode, commonProps } =
    useLibraryPage({ initialFilter: 'folder', title: '폴더', folderId });

  if (isDesktop === null || (loading && assets.length === 0)) {
    return <NVSplashScreen message="폴더 에셋 불러오는 중..." mode="syncing" />;
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
      activeKey={`folder_${folderId}`}
    />
  );
}
