import { NVAssetCard } from '@nova/ui';
import { Asset } from '../../types/asset';

interface AssetCardProps {
  asset: Asset;
  onTap: (asset: Asset) => void;
  isSelected?: boolean;
  onSelect?: (id: string, e: React.MouseEvent) => void;
}

export function AssetCard({ asset, onTap, isSelected, onSelect }: AssetCardProps) {
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
      onTap={() => onTap(asset)}
      onSelect={handleSelect}
      onFavoriteToggle={() => {
        // Handle favorite toggle (would need action in app)
      }}
      onMaximize={() => onTap(asset)}
    />
  );
}

