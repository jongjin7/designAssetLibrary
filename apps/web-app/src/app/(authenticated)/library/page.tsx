'use client';

import { useLibraryPage } from '@nova/hooks';
import DesktopLibraryView from '@nova/app/(desktop)/library/DesktopLibraryView';
import MobileLibraryView from '@nova/app/(mobile)/library/MobileLibraryView';
import { SearchPalette } from '@nova/components/library/SearchPalette';
import { NVSplashScreen, NVLoadingState } from '@nova/ui';
import { useAssetStore } from '@nova/store/useAssetStore';

export default function UnifiedLibraryPage() {
  const { isDesktop, desktopShell, loading, assets, isSelectionMode, setIsSelectionMode, commonProps } =
    useLibraryPage({ initialFilter: 'all' });

  const { isAnalyzing } = useAssetStore();

  if (isDesktop === null || (loading && assets.length === 0)) {
    return <NVSplashScreen message="라이브러리 에셋 동기화 중..." mode="syncing" />;
  }

  const renderContent = () => {
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
  };

  return (
    <>
      {renderContent()}
      
      {isAnalyzing && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0A0C13]/80 backdrop-blur-md transition-all animate-in fade-in duration-300">
           <NVLoadingState 
             message="AI가 에셋에서 사물과 분위기를 분석하고 있습니다..." 
           />
        </div>
      )}
    </>
  );
}
