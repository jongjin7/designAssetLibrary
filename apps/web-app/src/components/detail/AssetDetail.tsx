'use client';

import { Share2, FolderInput, Trash2 } from 'lucide-react';
import { Asset } from '../../types/asset';
import { BottomSheet } from './BottomSheet';
import { PaletteStrip } from './PaletteStrip';
import { TagList } from './TagList';

interface AssetDetailProps {
  asset: Asset | null;
  onClose: () => void;
}

export function AssetDetail({ asset, onClose }: AssetDetailProps) {
  if (!asset) return null;

  return (
    <BottomSheet isOpen={!!asset} onClose={onClose}>
      <div className="asset-detail">
        <div className="asset-detail__preview" style={{ background: asset.thumbnailGradient }} />

        <div className="asset-detail__meta">
          <p className="asset-detail__name">{asset.fileName}</p>
          <p className="asset-detail__info">{asset.fileSize} · {asset.createdAt}</p>
        </div>

        <PaletteStrip colors={asset.palette} />
        <TagList tags={asset.tags} />

        <div className="asset-detail__actions">
          <button className="action-btn" aria-label="공유">
            <Share2 size={18} />
            <span>공유</span>
          </button>
          <button className="action-btn" aria-label="이동">
            <FolderInput size={18} />
            <span>이동</span>
          </button>
          <button className="action-btn action-btn--danger" aria-label="삭제">
            <Trash2 size={18} />
            <span>삭제</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
