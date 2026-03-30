'use client';

import React from 'react';
import { Share2, FolderInput, Trash2, Star } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { NVIconButton } from '../../../atoms/NVIconButton';

interface NVAssetDetailFooterProps {
  isInspector?: boolean;
  isFavorite?: boolean;
  onShare?: () => void;
  onMove?: () => void;
  moveTrigger?: React.ReactNode;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  className?: string;
}

export function NVAssetDetailFooter({ 
  isInspector = false, 
  isFavorite = false,
  onShare, 
  onMove, 
  moveTrigger,
  onDelete, 
  onToggleFavorite,
  className = '' 
}: NVAssetDetailFooterProps) {
  return (
    <footer className={cn(
      "shrink-0 border-t border-white/[0.04] bg-[#0A0C13]",
      isInspector ? "" : "pb-[env(safe-area-inset-bottom,28px)]",
      className
    )}>
      <div className="flex items-center justify-between px-10 py-3 mx-auto max-w-sm">
        <NVIconButton 
          icon={Star}
          variant="secondary"
          size="md"
          className={cn(
            "!rounded-2xl", 
            isFavorite && "text-yellow-400"
          )}
          iconSize={20}
          strokeWidth={2}
          iconProps={{
             fill: isFavorite ? 'currentColor' : 'none'
          }}
          onClick={onToggleFavorite}
          aria-label="즐겨찾기"
        />

        <NVIconButton 
          icon={Share2}
          variant="secondary"
          size="md"
          className="!rounded-2xl"
          iconSize={20}
          strokeWidth={1.5}
          onClick={onShare}
          aria-label="공유"
        />
        
        {moveTrigger ? (
          moveTrigger
        ) : onMove ? (
          <NVIconButton 
            icon={FolderInput}
            variant="secondary"
            size="md"
            className="!rounded-2xl"
            iconSize={20}
            strokeWidth={1.5}
            onClick={onMove}
            aria-label="이동"
          />
        ) : null}
        
        <NVIconButton 
          icon={Trash2}
          variant="danger"
          size="md"
          className="!rounded-2xl"
          iconSize={20}
          strokeWidth={1.5}
          onClick={onDelete}
          aria-label="삭제"
        />
      </div>
    </footer>
  );
}
