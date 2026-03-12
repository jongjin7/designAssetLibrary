import { useState, useEffect } from 'react';
import { Share2, FolderInput, Trash2, Sparkles, X } from 'lucide-react';
import { Asset } from '../../types/asset';
import { PaletteStrip } from './PaletteStrip';
import { TagList } from './TagList';
import { extractColorsAI } from '../../lib/colorExtractorAI';
import { extractColors } from '../../lib/colorExtractor';

interface AssetDetailContentProps {
  asset: Asset;
  onClose?: () => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Asset>) => void;
  isInspector?: boolean;
}

export function AssetDetailContent({ 
  asset, 
  onClose, 
  onDelete, 
  onMove, 
  onUpdate,
  isInspector = false
}: AssetDetailContentProps) {
  const [palette, setPalette] = useState<string[]>(asset.palette || []);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAiRefined, setIsAiRefined] = useState(false);

  useEffect(() => {
    setPalette(asset.palette);
    setIsAiRefined(false);
    
    // Only auto-extract if the palette is empty
    if (asset.thumbnail && (!asset.palette || asset.palette.length === 0)) {
      handleBasicExtraction();
    }
  }, [asset.id, asset.palette]);

  const handleBasicExtraction = async () => {
    if (!asset.thumbnail) return;
    try {
      const extracted = await extractColors(asset.thumbnail);
      setPalette(extracted);
      if (!asset.palette || asset.palette.length === 0) {
        onUpdate?.(asset.id, { palette: extracted });
      }
    } catch (err) {
      console.warn('Basic color extraction failed:', err);
    }
  };

  const handleAIExtraction = async () => {
    if (!asset.thumbnail) return;
    
    setIsExtracting(true);
    try {
      const extracted = await extractColorsAI(asset.thumbnail);
      setPalette(extracted);
      setIsAiRefined(true);
      onUpdate?.(asset.id, { palette: extracted });
    } catch (err) {
      console.warn('AI Color extraction failed:', err);
      alert('AI 분석 중 오류가 발생했습니다.');
    } finally {
      setIsExtracting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}. ${m}. ${d}`;
    } catch {
      return dateStr;
    }
  };

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
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('Share failed:', err);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`'${asset.fileName}' 에셋을 정말 삭제하시겠습니까?`)) {
      onDelete?.(asset.id);
      onClose?.();
    }
  };

  const handleMove = () => {
    const folderName = window.prompt('이동할 폴더 이름을 입력하세요:', 'Project A');
    if (folderName) {
      onMove?.(asset.id);
      alert(`'${asset.fileName}' 에셋이 '${folderName}' 폴더로 이동되었습니다.`);
      onClose?.();
    }
  };

  return (
    <div className={`asset-detail ${isInspector ? 'asset-detail--inspector' : ''}`}>
      {isInspector && (
        <header className="inspector-header">
          <h3>상세 정보</h3>
          <button onClick={onClose} className="inspector-close">
            <X size={20} />
          </button>
        </header>
      )}

      <div className="asset-detail__preview-container">
        {asset.thumbnail ? (
          <img src={asset.thumbnail} alt={asset.fileName} className="asset-detail__preview asset-detail__preview--image" />
        ) : (
          <div className="asset-detail__preview asset-detail__preview--gradient" style={{ background: asset.thumbnailGradient }} />
        )}
        {!isInspector && <div className="asset-detail__preview-overlay" />}
      </div>

      <div className="asset-detail__meta">
        <div className="asset-detail__header">
          <h2 className="asset-detail__name">{asset.fileName}</h2>
          <div className="asset-detail__specs">
             <span className="asset-detail__size">{asset.fileSize}</span>
             <span className="asset-detail__divider">·</span>
             <span className="asset-detail__type">{asset.mimeType.split('/')[1].toUpperCase()}</span>
          </div>
        </div>
        <p className="asset-detail__date">{formatDate(asset.createdAt)}</p>
      </div>

      <div className="asset-detail__content">
        <div className="palette-section">
          <div className="palette-section__header">
            <PaletteStrip colors={palette} isAiRefined={isAiRefined} />
          </div>
          {asset.thumbnail && (
            <button 
              className={`extract-btn ${isExtracting ? 'is-loading' : ''} ${isAiRefined ? 'is-refined' : ''}`}
              onClick={handleAIExtraction}
              disabled={isExtracting}
            >
              <Sparkles size={14} className={isExtracting ? 'animate-pulse' : ''} />
              <span>{isAiRefined ? 'AI 다시 분석' : 'AI 분석'}</span>
            </button>
          )}
        </div>
        <TagList tags={asset.tags} />
      </div>

      <div className="asset-detail__actions">
        <button className="action-btn" onClick={handleShare}>
          <div className="action-btn__icon"><Share2 size={20} /></div>
          <span>공유</span>
        </button>
        <button className="action-btn" onClick={handleMove}>
          <div className="action-btn__icon"><FolderInput size={20} /></div>
          <span>이동</span>
        </button>
        <button className="action-btn action-btn--danger" onClick={handleDelete}>
          <div className="action-btn__icon"><Trash2 size={20} /></div>
          <span>삭제</span>
        </button>
      </div>
    </div>
  );
}
