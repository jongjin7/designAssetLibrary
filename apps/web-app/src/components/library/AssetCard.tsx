import { NVAssetCard } from '@nova/ui';
import { Asset } from '../../types/asset';

interface AssetCardProps {
  asset: Asset;
  onTap: (asset: Asset, e: React.MouseEvent) => void;
  isSelected?: boolean;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  onAssetTap?: (asset: Asset, e: React.MouseEvent) => void;
  isMobile?: boolean;
}

export function AssetCard({ asset, onTap, isSelected, onSelect, onAssetTap, isMobile }: AssetCardProps) {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(asset.id, e);
  };

  return (
    <NVAssetCard
      id={asset.id}
      fileName={asset.fileName}
      thumbnail={asset.thumbnail}
      thumbnailGradient={asset.thumbnailGradient}
      palette={asset.palette}
      isFavorite={asset.isFavorite}
      isSelected={isSelected}
      isMobile={isMobile}
      onTap={(e) => onTap(asset, e)}
      onSelect={handleSelect}
      onFavoriteToggle={() => {
        // Handle favorite toggle (would need action in app)
      }}
      onMaximize={(e) => onTap(asset, e)}
    />
  );
}

