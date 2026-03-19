'use client';

import React, { useState, useEffect } from 'react';
import { Share2, FolderInput, Trash2, Sparkles, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Asset } from '../../types/asset';
import { NVPaletteStrip } from '../../molecules/NVPaletteStrip';
import { NVTagList } from '../../molecules/NVTagList';
import { NVIconButton } from '../../atoms/NVIconButton';

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
    <div className={cn(
      "flex flex-col bg-[#0A0C13]", 
      isInspector ? "h-full" : "max-h-[90vh]", 
      className
    )}>
      {isInspector && (
        <header className="flex items-center justify-between px-6 py-2 border-b border-white/[0.04] shrink-0">
          <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Asset Detail</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all active:scale-95"
          >
            <X size={16} />
          </button>
        </header>
      )}

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto overscroll-contain pb-3">
        {/* Preview Section - Prominent 4:3 Aspect */}
        <div className="relative w-full aspect-[4/3] bg-black shrink-0">
          {asset.thumbnail ? (
            <img 
              src={asset.thumbnail} 
              alt={asset.fileName} 
              className="w-full h-full object-contain" 
            />
          ) : (
            <div 
              className="w-full h-full opacity-20" 
              style={{ background: asset.thumbnailGradient }} 
            />
          )}
          {!isInspector && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0C13] to-transparent pointer-events-none" />
          )}
        </div>

        {/* Metadata Section */}
        <div className="px-5 pt-3 pb-2">
          <div className="flex items-baseline justify-between gap-3 mb-1">
            <h2 className="text-lg font-extrabold text-slate-50 tracking-tight leading-tight truncate flex-1">
              {asset.fileName}
            </h2>
          </div>
          <p className="text-[12px] font-semibold text-slate-500 flex items-center gap-1.5">
            <span>{formatDate(asset.createdAt)}</span>
            <span className="w-1 h-1 rounded-full bg-slate-800" />
            <span className="text-[10px] opacity-60 uppercase font-bold">{asset.fileName.split('.').pop()}</span>
            <span className="w-1 h-1 rounded-full bg-slate-800" />
            <span className="text-[10px] opacity-60 uppercase font-bold">{asset.fileSize}</span>
          </p>
        </div>

        <div className="h-px bg-white/[0.04] mx-5 mb-2" />

        {/* Colors & AI Section */}
        <div className="flex items-end justify-between px-5">
          <NVPaletteStrip colors={palette} isAiRefined={isAiRefined} />
          
          {asset.thumbnail && onExtractAI && (
             <div className="transition-transform active:scale-95">
               <button 
                 className={cn(
                   "h-9 px-3.5 rounded-xl flex items-center justify-center gap-1.5 text-[11px] font-bold transition-all border relative overflow-hidden",
                   isAiRefined 
                     ? "bg-cyan-500/5 border-cyan-500/20 text-cyan-500 shadow-sm" 
                     : "bg-white/[0.02] border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-200",
                   isExtracting && "border-indigo-500/10 text-indigo-400 pointer-events-none"
                 )}
                 onClick={handleAIExtraction}
                 disabled={isExtracting}
                 aria-label="AI 분석"
               >
                 {isExtracting ? (
                   <>
                     <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-indigo-500/10 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                     <Sparkles size={14} className="animate-spin text-indigo-400 relative z-10" />
                     <span className="relative z-10 text-indigo-400">분석 중...</span>
                   </>
                 ) : (
                   <>
                     <Sparkles 
                       size={14} 
                       className={cn(
                         "transition-all duration-300",
                         isAiRefined ? "text-cyan-500" : "text-slate-500"
                       )} 
                     />
                     <span>AI 분석</span>
                   </>
                 )}
               </button>
             </div>
          )}
        </div>
        
        {/* Tags Section */}
        <div className="px-5 mt-3">
          <NVTagList tags={asset.tags} />
        </div>
      </div>

      {/* Balanced Icon-only Actions Section */}
      <footer className={cn(
        "shrink-0 border-t border-white/[0.04] bg-[#0A0C13]",
        isInspector ? "pb-6" : "pb-[env(safe-area-inset-bottom,28px)]"
      )}>
        <div className="flex items-center justify-center gap-14 p-3 mx-auto">
          <NVIconButton 
            icon={Share2}
            variant="secondary"
            size="lg"
            className="!rounded-2xl"
            iconSize={24}
            strokeWidth={1}
            onClick={handleShare}
            aria-label="공유"
          />
          
          <NVIconButton 
            icon={FolderInput}
            variant="secondary"
            size="lg"
            className="!rounded-2xl"
            iconSize={24}
            strokeWidth={1}
            onClick={() => onMove?.(asset.id)}
            aria-label="이동"
          />
          
          <NVIconButton 
            icon={Trash2}
            variant="danger"
            size="lg"
            className="!rounded-2xl"
            iconSize={24}
            strokeWidth={1}
            onClick={() => onDelete?.(asset.id)}
            aria-label="삭제"
          />
        </div>
      </footer>
    </div>
  );
}
