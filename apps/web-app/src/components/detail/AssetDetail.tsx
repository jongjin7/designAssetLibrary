'use client';

import { Share2, FolderInput, Trash2 } from 'lucide-react';
import { Asset } from '../../types/asset';
import { BottomSheet } from './BottomSheet';
import { PaletteStrip } from './PaletteStrip';
import { TagList } from './TagList';

interface AssetDetailProps {
  asset: Asset | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string) => void;
}

export function AssetDetail({ asset, onClose, onDelete, onMove }: AssetDetailProps) {
  if (!asset) return null;

  const handleShare = async () => {
    const shareData = {
      title: 'NOVA Design Asset',
      text: `${asset.fileName} 에셋을 확인해 보세요.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('링크가 클립보드에 복사되었습니다.');
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // User cancelled share - ignore
      }
      console.error('Share failed:', err);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`'${asset.fileName}' 에셋을 정말 삭제하시겠습니까?`)) {
      onDelete?.(asset.id);
      onClose();
    }
  };

  const handleMove = () => {
    const folderName = window.prompt('이동할 폴더 이름을 입력하세요:', 'Project A');
    if (folderName) {
      onMove?.(asset.id);
      alert(`'${asset.fileName}' 에셋이 '${folderName}' 폴더로 이동되었습니다.`);
      onClose();
    }
  };

  return (
    <BottomSheet isOpen={!!asset} onClose={onClose}>
      <div className="asset-detail">
        <div className="asset-detail__preview-container">
          <div className="asset-detail__preview" style={{ background: asset.thumbnailGradient }} />
          <div className="asset-detail__preview-overlay" />
        </div>

        <div className="asset-detail__meta">
          <h2 className="asset-detail__name">{asset.fileName}</h2>
          <p className="asset-detail__info">{asset.fileSize} · {asset.createdAt}</p>
        </div>

        <div className="asset-detail__content">
          <PaletteStrip colors={asset.palette} />
          <TagList tags={asset.tags} />
        </div>

        <div className="asset-detail__actions">
          <button className="action-btn" onClick={handleShare}>
            <div className="action-btn__icon"><Share2 size={20} /></div>
            <span>공유하기</span>
          </button>
          <button className="action-btn" onClick={handleMove}>
            <div className="action-btn__icon"><FolderInput size={20} /></div>
            <span>이동하기</span>
          </button>
          <button className="action-btn action-btn--danger" onClick={handleDelete}>
            <div className="action-btn__icon"><Trash2 size={20} /></div>
            <span>삭제하기</span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
