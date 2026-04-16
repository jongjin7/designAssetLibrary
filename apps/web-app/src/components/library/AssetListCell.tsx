import { NVAssetListCell } from '@nova/ui';
import { Asset } from '@nova/types/asset';
import { ViewOptions } from '@nova/store/useAssetStore';

interface AssetListCellProps {
  asset: Asset;
  onTap: (asset: Asset, e: React.MouseEvent) => void;
  isSelected?: boolean;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onFavoriteToggle?: (id: string, isFavorite: boolean) => void;
  isMobile?: boolean;
  isSelectMode?: boolean;
  isDimmed?: boolean;
  thumbnailQuality?: 'speed' | 'quality';
  viewOptions: ViewOptions;
}

export function AssetListCell({
  asset,
  onTap,
  isSelected,
  onSelect,
  onFavoriteToggle,
  isMobile,
  isSelectMode,
  isDimmed,
  thumbnailQuality = 'quality',
  viewOptions,
}: AssetListCellProps) {
  return (
    <NVAssetListCell
      id={asset.id}
      fileName={asset.fileName}
      extension={asset.extension}
      fileSize={asset.fileSize}
      thumbnail={asset.thumbnail}
      thumbnailGradient={asset.thumbnailGradient}
      palette={asset.palette}
      isFavorite={asset.isFavorite}
      isSelected={isSelected}
      isDimmed={isDimmed}
      isMobile={isMobile}
      isSelectMode={isSelectMode}
      thumbnailQuality={thumbnailQuality}
      showName={viewOptions.showName}
      showAnnotation={viewOptions.showAnnotation}
      onTap={(e) => onTap(asset, e)}
      onSelect={(e) => onSelect?.(asset.id, e)}
      onFavoriteToggle={(e) => {
        e.stopPropagation();
        onFavoriteToggle?.(asset.id, !asset.isFavorite);
      }}
    />
  );
}
