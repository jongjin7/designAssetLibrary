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
      <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest leading-none mb-2">태그</p>
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
