import { useState, useEffect } from 'react';
import { NVAssetGrid } from '@nova/ui';
import { Asset } from '@nova/types/asset';
import { AssetCard } from '@nova/components/library/AssetCard';
import { useAssetStore } from '@nova/store/useAssetStore';

interface AssetGridProps {
  assets: Asset[];
  onAssetTap: (asset: Asset, e: React.MouseEvent) => void;
  selectedIds?: Set<string>;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  isMobile?: boolean;
  isSelectMode?: boolean;
  zoom?: number;
  activeAssetId?: string | null;
  isSidebarOpen?: boolean;
}

export function AssetGrid({ 
  assets, 
  onAssetTap, 
  selectedIds, 
  onSelect, 
  onFavoriteToggle, 
  isMobile, 
  isSelectMode = false,
  zoom,
  activeAssetId,
  isSidebarOpen 
}: AssetGridProps) {
  const [isHovered, setIsHovered] = useState(false);
  const viewOptions = useAssetStore(state => state.viewOptions);
  const layout = isMobile ? 'masonry' : viewOptions.layout;

  // Auto-scroll to active asset when isSidebarOpen changes or activeAssetId changes
  useEffect(() => {
    const scrollToActive = () => {
      if (isSidebarOpen && activeAssetId) {
        const element = document.getElementById(`asset-card-${activeAssetId}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }
    };

    if (isSidebarOpen && activeAssetId) {
       // Wait for layout transition or initial mount
       const timer = setTimeout(scrollToActive, 350);
       
       // Also listen for resize events while sidebar is open
       window.addEventListener('resize', scrollToActive);
       
       return () => {
         clearTimeout(timer);
         window.removeEventListener('resize', scrollToActive);
       };
    }
  }, [activeAssetId, isSidebarOpen]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      className="h-full w-full"
    >
      <NVAssetGrid zoom={zoom} isMobile={isMobile} layout={layout}>
        {assets.map(asset => {
          // Dim other assets when a detail sidebar is open, UNLESS the grid is being hovered
          const isDimmed = isSidebarOpen && activeAssetId && !isHovered && asset.id !== activeAssetId;
          
          return (
            <AssetCard 
              key={asset.id} 
              asset={asset} 
              onTap={onAssetTap} 
              isSelected={selectedIds?.has(asset.id)}
              onSelect={onSelect}
              onFavoriteToggle={onFavoriteToggle}
              isMobile={isMobile}
              isSelectMode={isSelectMode}
              isDimmed={isDimmed}
              thumbnailQuality={viewOptions.thumbnail}
              isGridLayout={layout === 'grid'}
            />
          );
        })}
      </NVAssetGrid>
    </div>
  );
}

