import { NVAssetCard } from '@nova/ui';
import { Asset } from '@nova/types/asset';
import { useAssetStore } from '@nova/store/useAssetStore';

interface AssetCardProps {
  asset: Asset;
  onTap: (asset: Asset, e: React.MouseEvent) => void;
  isSelected?: boolean;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  onAssetTap?: (asset: Asset, e: React.MouseEvent) => void;
  isMobile?: boolean;
  isSelectMode?: boolean;
  isDimmed?: boolean;
  thumbnailQuality?: 'speed' | 'quality';
  isGridLayout?: boolean;
}

export function AssetCard({ asset, onTap, isSelected, onSelect, onFavoriteToggle, onAssetTap, isMobile, isSelectMode, isDimmed, thumbnailQuality = 'quality', isGridLayout = false }: AssetCardProps) {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(asset.id, e);
  };

  const viewOptions = useAssetStore(state => state.viewOptions);
  const displayOptions = {
    showName: viewOptions.showName,
    showAnnotation: viewOptions.showAnnotation,
  };

  return (
    <NVAssetCard
      id={asset.id}
      fileName={asset.fileName}
      extension={asset.extension}
      fileSize={asset.fileSize}
      thumbnail={asset.thumbnail}
      thumbnailGradient={asset.thumbnailGradient}
      palette={asset.palette}
      isFavorite={asset.isFavorite}
      isSelected={isSelected}
      isMobile={isMobile || isSelectMode}
      isDimmed={isDimmed}
      thumbnailQuality={thumbnailQuality}
      isGridLayout={isGridLayout}
      displayOptions={displayOptions}
      onTap={(e) => onTap(asset, e)}
      onSelect={handleSelect}
      onFavoriteToggle={(e) => {
        e.stopPropagation();
        onFavoriteToggle?.(asset.id, !asset.isFavorite);
      }}
      onMaximize={(e) => onTap(asset, e)}
    />
  );
}

