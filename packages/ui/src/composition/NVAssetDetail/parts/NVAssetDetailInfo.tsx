'use client';

import React from 'react';
import { Asset } from '../../../types/asset';
import { cn } from '../../../lib/utils';

interface NVAssetDetailInfoProps {
  asset: Asset;
  className?: string;
}

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
  } catch {
    return dateStr;
  }
};

export function NVAssetDetailInfo({ asset, className = '' }: NVAssetDetailInfoProps) {
  return (
    <div className={cn("px-5 pt-3 pb-2", className)}>
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h2 className="text-lg font-extrabold text-slate-50 tracking-tight leading-tight truncate flex-1">
          {asset.fileName}
        </h2>
      </div>
      <p className="text-[12px] font-semibold text-slate-500 flex items-center gap-1.5">
        <span>{formatDate(asset.createdAt)}</span>
        <span className="w-1 h-1 rounded-full bg-slate-800" />
        <span className="text-[10px] opacity-60 uppercase font-bold">{asset.extension}</span>
        <span className="w-1 h-1 rounded-full bg-slate-800" />
        <span className="text-[10px] opacity-60 uppercase font-bold">{asset.fileSize}</span>
      </p>
    </div>
  );
}
