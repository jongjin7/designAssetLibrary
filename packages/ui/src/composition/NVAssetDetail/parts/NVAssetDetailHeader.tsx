'use client';

import React from 'react';
import { PanelRightClose } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface NVAssetDetailHeaderProps {
  title: string;
  onClose?: () => void;
  className?: string;
  isDesktopApp?: boolean;
}

export function NVAssetDetailHeader({ title, className = '', isDesktopApp }: NVAssetDetailHeaderProps) {
  return (
    <header className={cn(" flex items-center justify-between px-6 py-2 border-b border-white/[0.04] bg-slate-950/40 shrink-0", isDesktopApp ? "h-10" :"h-12", className)}>
      <h3 className="text-[11px] font-bold tracking-widest uppercase text-slate-500">{title}</h3>
    </header>
  );
}
