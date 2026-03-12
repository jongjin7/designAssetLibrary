import { Asset } from '../../types/asset';
import { BottomSheet } from './BottomSheet';
import { AssetDetailContent } from './AssetDetailContent';

interface AssetDetailProps {
  asset: Asset | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Asset>) => void;
}

export function AssetDetail({ asset, onClose, onDelete, onMove, onUpdate }: AssetDetailProps) {
  if (!asset) return null;

  return (
    <BottomSheet isOpen={!!asset} onClose={onClose}>
      <AssetDetailContent 
        asset={asset} 
        onClose={onClose} 
        onDelete={onDelete} 
        onMove={onMove} 
        onUpdate={onUpdate} 
      />
    </BottomSheet>
  );
}
