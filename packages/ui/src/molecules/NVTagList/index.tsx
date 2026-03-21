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
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map(tag => (
        <NVChip 
          key={tag} 
          label={`#${tag}`} 
          variant="tag" 
          size="sm" 
        />
      ))}
    </div>
  );
}
