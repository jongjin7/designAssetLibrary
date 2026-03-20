'use client';

import React from 'react';
import { PanelRightClose } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface NVAssetDetailHeaderProps {
  title: string;
  onClose?: () => void;
  className?: string;
}

export function NVAssetDetailHeader({ title, className = '' }: NVAssetDetailHeaderProps) {
  return (
    <header className={cn("h-12 flex items-center justify-between px-6 py-2 border-b border-white/[0.04] shrink-0", className)}>
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-500">{title}</h3>
    </header>
  );
}
