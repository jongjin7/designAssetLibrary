import React from 'react';
import { 
  NVSectionHeader,
  Asset 
} from '@nova/ui';
import { AssetGrid } from './AssetGrid';
import { LibraryEmptyState } from './LibraryEmptyState';
import { cn } from '@nova/lib/utils';

interface LibraryAssetGridSectionProps {
  assets: Asset[];
  filteredAssets: Asset[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAssetTap: (asset: Asset, e: any) => void;
  selectedIds: Set<string>;
  onSelect: (id: string, e: any) => void;
  onFavoriteToggle: (id: string, isFavorite: boolean) => void;
  isMobile?: boolean;
  isSelectMode: boolean;
  zoom: number;
  filter: string;
  searchText: string;
  hasSubFolders?: boolean;
  
  // Desktop only
  isSidebarOpen?: boolean;
  activeAssetId?: string;
}

export const LibraryAssetGridSection: React.FC<LibraryAssetGridSectionProps> = ({
  assets,
  filteredAssets,
  isExpanded,
  onToggleExpand,
  onAssetTap,
  selectedIds,
  onSelect,
  onFavoriteToggle,
  isMobile = false,
  isSelectMode,
  zoom,
  filter,
  searchText,
  hasSubFolders = false,
  isSidebarOpen,
  activeAssetId
}) => {
  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-700 delay-150">
      {hasSubFolders && (
        <NVSectionHeader 
          title="목차" 
          count={filteredAssets.length} 
          className={cn(isMobile ? "mb-4" : "mb-6")}
          hasDropdown={true}
          isExpanded={isExpanded}
          onDropdownClick={onToggleExpand}
        />
      )}
      
      {isExpanded && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          {filteredAssets.length > 0 ? (
            <AssetGrid 
              assets={filteredAssets} 
              onAssetTap={onAssetTap} 
              selectedIds={selectedIds}
              onSelect={onSelect}
              onFavoriteToggle={onFavoriteToggle}
              isMobile={isMobile}
              isSelectMode={isSelectMode}
              zoom={zoom}
              isSidebarOpen={isSidebarOpen}
              activeAssetId={activeAssetId}
            />
          ) : hasSubFolders ? (
            <div className={cn(
              "flex flex-col items-center justify-center bg-slate-900/10 rounded-2xl border border-dashed border-white/5",
              isMobile ? "py-12" : "py-20"
            )}>
              <p className="text-slate-500 text-xs font-medium">
                {isMobile ? "이 폴더에는 에셋이 없습니다." : "이 폴더에는 직접 포함된 에셋이 없습니다."}
              </p>
            </div>
          ) : (
            <div className={cn(
              "flex items-center justify-center",
              isMobile ? "min-h-[60vh]" : (filter === 'folder' ? "py-20" : "h-full")
            )}>
              <LibraryEmptyState 
                assets={assets}
                filteredAssets={filteredAssets}
                filter={filter}
                searchText={searchText}
              />
            </div>
          ) }
        </div>
      )}
    </div>
  );
};
