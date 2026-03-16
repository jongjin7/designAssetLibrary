import { Sparkles } from 'lucide-react';
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
      <aside className="w-80 bg-white/[0.02] border-l border-white/[0.06] flex items-center justify-center p-10 text-center animate-in fade-in duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-600">
            <Sparkles size={24} />
          </div>
          <p className="text-sm leading-relaxed text-slate-500 font-medium">
            에셋을 선택하여 상세 정보를 확인하세요.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white/[0.02] border-l border-white/[0.06] flex flex-col overflow-y-auto animate-in slide-in-from-right-4 fade-in duration-300">
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

