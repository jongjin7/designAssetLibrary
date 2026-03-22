'use client';

import React from 'react';
import { NVTagList } from '../../../molecules/NVTagList';
import { cn } from '../../../lib/utils';

interface NVAssetDetailTagsProps {
  tags: string[];
  className?: string;
}

export function NVAssetDetailTags({ tags, className = '' }: NVAssetDetailTagsProps) {
  return (
    <div className={cn("px-5 mt-4 space-y-2", className)}>
      <p className="text-xs text-slate-700 font-semibold uppercase tracking-widest leading-none px-0.5">추출된 태그</p>
      <NVTagList tags={tags} />
    </div>
  );
}
