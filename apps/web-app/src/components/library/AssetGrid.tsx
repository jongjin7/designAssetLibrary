import { NVAssetGrid, NVEmptyState } from '@nova/ui';
import { Asset } from '@nova/types/asset';
import { AssetCard } from '@nova/components/library/AssetCard';

interface AssetGridProps {
  assets: Asset[];
  onAssetTap: (asset: Asset, e: React.MouseEvent) => void;
  selectedIds?: Set<string>;
  onSelect?: (id: string, e: React.MouseEvent) => void;
  isMobile?: boolean;
  zoom?: number;
}

export function AssetGrid({ assets, onAssetTap, selectedIds, onSelect, isMobile, zoom }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <NVEmptyState
        icon="📭"
        title="에셋이 없습니다"
        description="디자인 자산을 수집해 보세요"
        className="h-full"
      />
    );
  }

  return (
    <NVAssetGrid zoom={zoom} isMobile={isMobile}>
      {assets.map(asset => (
        <AssetCard 
          key={asset.id} 
          asset={asset} 
          onTap={onAssetTap} 
          isSelected={selectedIds?.has(asset.id)}
          onSelect={onSelect}
          onAssetTap={onAssetTap}
          isMobile={isMobile}
        />
      ))}
    </NVAssetGrid>
  );
}

