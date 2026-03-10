'use client';

import { Asset } from '../../types/asset';

interface AssetCardProps {
  asset: Asset;
  onTap: (asset: Asset) => void;
}

export function AssetCard({ asset, onTap }: AssetCardProps) {
  return (
    <div 
      className="asset-card" 
      onClick={() => onTap(asset)} 
      role="button"
      tabIndex={0}
      aria-label={asset.fileName}
      onKeyDown={(e) => e.key === 'Enter' && onTap(asset)}
    >
      <div className="asset-card__thumb">
        {asset.thumbnail ? (
          <img src={asset.thumbnail} alt={asset.fileName} className="asset-card__img" />
        ) : (
          <div className="asset-card__gradient" style={{ background: asset.thumbnailGradient }} />
        )}
      </div>
      <div className="asset-card__footer">
        <div className="asset-card__palette">
          {asset.palette.slice(0, 3).map((color, i) => (
            <span key={i} className="asset-card__dot" style={{ background: color }} />
          ))}
        </div>
        <p className="asset-card__name">{asset.fileName.replace(/\.\w+$/, '')}</p>
      </div>
    </div>
  );
}
