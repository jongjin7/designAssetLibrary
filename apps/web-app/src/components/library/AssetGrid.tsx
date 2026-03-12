'use client';

import { Asset } from '../../types/asset';
import { AssetCard } from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
  onAssetTap: (asset: Asset) => void;
  selectedIds?: Set<string>;
  onSelect?: (id: string, e: React.MouseEvent) => void;
}

export function AssetGrid({ assets, onAssetTap, selectedIds, onSelect }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__icon">📭</p>
        <p className="empty-state__text">에셋이 없습니다</p>
        <p className="empty-state__sub">카메라로 디자인 자산을 수집해 보세요</p>
      </div>
    );
  }

  return (
    <div className="asset-grid">
      {assets.map(asset => (
        <AssetCard 
          key={asset.id} 
          asset={asset} 
          onTap={onAssetTap} 
          isSelected={selectedIds?.has(asset.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
