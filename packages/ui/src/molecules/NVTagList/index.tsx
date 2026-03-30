'use client';

import React from 'react';
import { cn } from '../../lib/utils';

import { NVChip } from '../../atoms/NVChip';

interface NVTagListProps {
  tags: string[];
  onDeleteTag?: (tag: string) => void;
  className?: string;
}

export function NVTagList({ tags, onDeleteTag, className = '' }: NVTagListProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map(tag => (
        <NVChip 
          key={tag} 
          label={`#${tag}`} 
          variant="tag" 
          size="sm" 
          onDelete={onDeleteTag ? () => onDeleteTag(tag) : undefined}
          className='hover:bg-white/10 hover:text-slate-300'
        />
      ))}
    </div>
  );
}
