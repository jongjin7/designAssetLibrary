'use client';

import React from 'react';
import { cn } from '../../lib/utils';

import { NVChip } from '../../atoms/NVChip';

interface NVTagListProps {
  tags: string[];
  className?: string;
}

export function NVTagList({ tags, className = '' }: NVTagListProps) {
  return (
    <div className={cn("", className)}>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">태그</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <NVChip 
            key={tag} 
            label={`#${tag}`} 
            variant="tag" 
            size="sm" 
          />
        ))}
      </div>
    </div>
  );
}
