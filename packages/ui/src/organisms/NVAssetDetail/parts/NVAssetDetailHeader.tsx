'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface NVAssetDetailHeaderProps {
  title: string;
  onClose?: () => void;
  className?: string;
}

export function NVAssetDetailHeader({ title, onClose, className = '' }: NVAssetDetailHeaderProps) {
  return (
    <header className={cn("h-12 flex items-center justify-between px-6 py-2 border-b border-white/[0.04] shrink-0", className)}>
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-500">{title}</h3>
      {onClose && (
        <button 
          onClick={onClose} 
          className="p-1 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all active:scale-95"
        >
          <X size={16} />
        </button>
      )}
    </header>
  );
}
