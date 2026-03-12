import { Asset } from '../../types/asset';
import { AssetDetailContent } from './AssetDetailContent';

interface AssetInspectorProps {
  asset: Asset | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Asset>) => void;
}

export function AssetInspector({ asset, onClose, onDelete, onMove, onUpdate }: AssetInspectorProps) {
  if (!asset) {
    return (
      <aside className="desktop-inspector desktop-inspector--empty">
        <div className="empty-inspector">
          <p>에셋을 선택하여 상세 정보를 확인하세요.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="desktop-inspector">
      <AssetDetailContent 
        asset={asset} 
        onClose={onClose} 
        onDelete={onDelete} 
        onMove={onMove} 
        onUpdate={onUpdate}
        isInspector={true}
      />
    </aside>
  );
}
