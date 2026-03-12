'use client';

import { Star, Maximize2, Check } from 'lucide-react';
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

  const nameWithoutExt = asset.fileName.split('.').slice(0, -1).join('.');

  return (
    <div 
      className={`asset-card ${isSelected ? 'is-selected' : ''}`} 
      onClick={() => onTap(asset)} 
      role="button"
      tabIndex={0}
      aria-label={asset.fileName}
      onKeyDown={(e) => e.key === 'Enter' && onTap(asset)}
    >
      <div className="asset-card__thumb">
        {asset.thumbnail ? (
          <img src={asset.thumbnail} alt={asset.fileName} loading="lazy" className="asset-card__img" />
        ) : (
          <div className="asset-card__gradient" style={{ background: asset.thumbnailGradient }} />
        )}
        
        {/* Hover Overlay */}
        <div className="asset-card__overlay">
          <button 
            className={`asset-card__checkbox ${isSelected ? 'checked' : ''}`}
            onClick={handleSelect}
          >
            {isSelected && <Check size={12} />}
          </button>
          
          <div className="asset-card__quick-actions">
            <button className={`quick-action-btn ${asset.isFavorite ? 'active' : ''}`}>
              <Star size={14} fill={asset.isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="quick-action-btn">
              <Maximize2 size={14} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="asset-card__footer">
        <div className="asset-card__palette">
          {asset.palette.slice(0, 3).map((color, i) => (
            <span key={i} className="asset-card__dot" style={{ background: color }} />
          ))}
        </div>
        <p className="asset-card__name">{nameWithoutExt || asset.fileName}</p>
      </div>
    </div>
  );
}
