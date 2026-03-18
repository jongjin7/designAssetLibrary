'use client';

import React, { useState, useEffect } from 'react';
import { Share2, FolderInput, Trash2, Sparkles, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Asset } from '../../types/asset';
import { NVPaletteStrip } from '../../molecules/NVPaletteStrip';
import { NVTagList } from '../../molecules/NVTagList';

interface NVAssetDetailContentProps {
  asset: Asset;
  onClose?: () => void;
  onDelete?: (id: string) => void;
  onMove?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Asset>) => void;
  onExtractAI?: (imageUrl: string) => Promise<string[]>;
  onExtractBasic?: (imageUrl: string) => Promise<string[]>;
  onShare?: (asset: Asset) => void;
  isInspector?: boolean;
  className?: string;
}

export function NVAssetDetailContent({ 
  asset, 
  onClose, 
  onDelete, 
  onMove, 
  onUpdate,
  onExtractAI,
  onExtractBasic,
  onShare,
  isInspector = false,
  className = ''
}: NVAssetDetailContentProps) {
  const [palette, setPalette] = useState<string[]>(asset.palette || []);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAiRefined, setIsAiRefined] = useState(false);

  useEffect(() => {
    setPalette(asset.palette);
    setIsAiRefined(false);
    
    // Auto-extract if palette is empty
    if (asset.thumbnail && (!asset.palette || asset.palette.length === 0)) {
      handleBasicExtraction();
    }
  }, [asset.id, asset.palette]);

  const handleBasicExtraction = async () => {
    if (!asset.thumbnail || !onExtractBasic) return;
    try {
      const extracted = await onExtractBasic(asset.thumbnail);
      setPalette(extracted);
      if (!asset.palette || asset.palette.length === 0) {
        onUpdate?.(asset.id, { palette: extracted });
      }
    } catch (err) {
      console.warn('Basic color extraction failed:', err);
    }
  };

  const handleAIExtraction = async () => {
    if (!asset.thumbnail || !onExtractAI) return;
    
    setIsExtracting(true);
    try {
      const extracted = await onExtractAI(asset.thumbnail);
      setPalette(extracted);
      setIsAiRefined(true);
      onUpdate?.(asset.id, { palette: extracted });
    } catch (err) {
      console.warn('AI Color extraction failed:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
    } catch {
      return dateStr;
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare(asset);
      return;
    }
    // Fallback if needed
  };

  return (
    <div className={cn("flex flex-col bg-slate-950/20", className)}>
      {isInspector && (
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-bold text-slate-200">상세 정보</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </header>
      )}

      {/* Preview Section */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950">
        {asset.thumbnail ? (
          <img 
            src={asset.thumbnail} 
            alt={asset.fileName} 
            className="w-full h-full object-contain rounded-b-3xl" 
          />
        ) : (
          <div 
            className="w-full h-full rounded-b-3xl opacity-60" 
            style={{ background: asset.thumbnailGradient }} 
          />
        )}
        {!isInspector && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 rounded-b-3xl pointer-events-none" />
        )}
      </div>

      {/* Metadata Section */}
      <div className="px-5 py-6">
        <div className="flex justify-between items-start gap-3 mb-1">
          <h2 className="text-lg font-bold text-slate-50 flex-1 break-all line-clamp-2">
            {asset.fileName}
          </h2>
          <div className="flex items-center gap-1 text-[13px] font-semibold text-slate-400 whitespace-nowrap">
             <span>{asset.fileSize}</span>
             <span className="opacity-30">·</span>
             <span className="uppercase">{asset.mimeType.split('/')[1]}</span>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500 mt-1">{formatDate(asset.createdAt)}</p>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-4 pb-6">
        <div className="flex items-end justify-between pr-5">
          <NVPaletteStrip colors={palette} isAiRefined={isAiRefined} />
          
          {asset.thumbnail && onExtractAI && (
            <button 
              className={cn(
                "h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-[11px] font-semibold transition-all mb-2 whitespace-nowrap",
                isAiRefined 
                  ? "bg-cyan-500/10 text-cyan-500" 
                  : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-indigo-400 active:scale-95"
              )}
              onClick={handleAIExtraction}
              disabled={isExtracting}
            >
              <Sparkles size={14} className={isExtracting ? 'animate-pulse' : ''} />
              <span>{isAiRefined ? 'AI 다시 분석' : 'AI 분석'}</span>
            </button>
          )}
        </div>
        
        <NVTagList tags={asset.tags} />
      </div>

      {/* Actions Section */}
      <div className="flex gap-1 px-3 py-4 bg-white/[0.02] border-t border-white/[0.06] mb-[env(safe-area-inset-bottom,0px)]">
        <button 
          className="flex-1 flex flex-col items-center gap-2 p-3 font-medium transition-all active:scale-95 text-slate-400 group"
          onClick={handleShare}
        >
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center bg-white/[0.04] border border-white/[0.06] text-slate-50 group-hover:bg-white/10 transition-colors">
            <Share2 size={20} />
          </div>
          <span className="text-[11px]">공유</span>
        </button>
        
        <button 
          className="flex-1 flex flex-col items-center gap-2 p-3 font-medium transition-all active:scale-95 text-slate-400 group"
          onClick={() => onMove?.(asset.id)}
        >
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center bg-white/[0.04] border border-white/[0.06] text-slate-50 group-hover:bg-white/10 transition-colors">
            <FolderInput size={20} />
          </div>
          <span className="text-[11px]">이동</span>
        </button>
        
        <button 
          className="flex-1 flex flex-col items-center gap-2 p-3 font-medium transition-all active:scale-95 text-slate-400 group"
          onClick={() => onDelete?.(asset.id)}
        >
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center bg-rose-500/10 border border-rose-500/15 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
            <Trash2 size={20} />
          </div>
          <span className="text-[11px]">삭제</span>
        </button>
      </div>
    </div>
  );
}
