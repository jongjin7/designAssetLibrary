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
    <div className={cn("px-5 mt-3", className)}>
      <NVTagList tags={tags} />
    </div>
  );
}
