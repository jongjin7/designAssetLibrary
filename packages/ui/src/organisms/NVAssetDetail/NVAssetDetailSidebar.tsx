'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Asset } from '../../types/asset';
import { NVAssetDetailContent } from './NVAssetDetailContent';
import { cn } from '../../lib/utils';

interface NVAssetDetailSidebarProps {
  asset: Asset | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Asset>) => void;
  onExtractAI?: (imageUrl: string) => Promise<string[]>;
  onExtractBasic?: (imageUrl: string) => Promise<string[]>;
  className?: string;
}

export function NVAssetDetailSidebar({ 
  asset, 
  onClose, 
  onDelete, 
  onMove, 
  onUpdate,
  onExtractAI,
  onExtractBasic,
  className = ''
}: NVAssetDetailSidebarProps) {
  if (!asset) {
    return (
      <aside className={cn("w-[380px] h-full bg-[#0A0C13] border-l border-white/[0.04] flex items-center justify-center p-10 text-center", className)}>
        <div className="flex flex-col items-center gap-4 opacity-40">
          <div className="w-16 h-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-400">
            <Sparkles size={32} strokeWidth={1} />
          </div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-2">Inspector</p>
          <p className="text-sm leading-relaxed text-slate-500 font-medium max-w-[180px]">
            기능을 확인하려면 에셋을 먼저 선택해 주세요.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className={cn("w-[380px] h-full bg-[#0A0C13] border-l border-white/[0.04] flex flex-col overflow-hidden", className)}> 
      <NVAssetDetailContent 
        asset={asset} 
        onClose={onClose} 
        onDelete={onDelete} 
        onMove={onMove} 
        onUpdate={onUpdate}
        onExtractAI={onExtractAI}
        onExtractBasic={onExtractBasic}
        isInspector={true}
        className="h-full"
      />
    </aside>
  );
}
