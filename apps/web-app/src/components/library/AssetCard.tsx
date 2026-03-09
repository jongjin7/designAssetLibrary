'use client';

import { Asset } from '../../types/asset';

interface AssetCardProps {
  asset: Asset;
  onTap: (asset: Asset) => void;
}

export function AssetCard({ asset, onTap }: AssetCardProps) {
  return (
    <button className="asset-card" onClick={() => onTap(asset)} aria-label={asset.fileName}>
      <div className="asset-card__thumb" style={{ background: asset.thumbnailGradient }} />
      <div className="asset-card__footer">
        <div className="asset-card__palette">
          {asset.palette.slice(0, 3).map((color, i) => (
            <span key={i} className="asset-card__dot" style={{ background: color }} />
          ))}
        </div>
        <p className="asset-card__name">{asset.fileName.replace(/\.\w+$/, '')}</p>
      </div>
    </button>
  );
}
