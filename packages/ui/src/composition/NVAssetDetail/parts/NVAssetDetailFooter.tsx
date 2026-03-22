'use client';

import React from 'react';
import { Share2, FolderInput, Trash2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { NVIconButton } from '../../../atoms/NVIconButton';

interface NVAssetDetailFooterProps {
  isInspector?: boolean;
  onShare?: () => void;
  onMove?: () => void;
  onDelete?: () => void;
  className?: string;
}

export function NVAssetDetailFooter({ 
  isInspector = false, 
  onShare, 
  onMove, 
  onDelete, 
  className = '' 
}: NVAssetDetailFooterProps) {
  return (
    <footer className={cn(
      "shrink-0 border-t border-white/[0.04] bg-[#0A0C13]",
      isInspector ? "" : "pb-[env(safe-area-inset-bottom,28px)]",
      className
    )}>
      <div className="flex items-center justify-center gap-14 p-3 mx-auto">
        <NVIconButton 
          icon={Share2}
          variant="secondary"
          size="md"
          className="!rounded-2xl"
          iconSize={22}
          strokeWidth={1.5}
          onClick={onShare}
          aria-label="공유"
        />
        
        <NVIconButton 
          icon={FolderInput}
          variant="secondary"
          size="md"
          className="!rounded-2xl"
          iconSize={22}
          strokeWidth={1.5}
          onClick={onMove}
          aria-label="이동"
        />
        
        <NVIconButton 
          icon={Trash2}
          variant="danger"
          size="md"
          className="!rounded-2xl"
          iconSize={22}
          strokeWidth={1.5}
          onClick={onDelete}
          aria-label="삭제"
        />
      </div>
    </footer>
  );
}
