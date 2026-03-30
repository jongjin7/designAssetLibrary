'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { NVIconButton } from '../../../atoms/NVIconButton';
import { NVInput } from '../../../atoms/NVInput';
import { NVButton } from '../../../atoms/NVButton';
import { NVTagList } from '../../../molecules/NVTagList';
import { cn } from '../../../lib/utils';

interface NVAssetDetailTagsProps {
  tags: string[];
  onAddTag?: (tag: string) => void;
  onDeleteTag?: (tag: string) => void;
  className?: string;
}

export function NVAssetDetailTags({ 
  tags, 
  onAddTag, 
  onDeleteTag, 
  className = '' 
}: NVAssetDetailTagsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAdd = () => {
    if (newTag.trim() && onAddTag) {
      onAddTag(newTag.trim());
      setNewTag('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTag('');
    }
  };

  return (
    <div className={cn("px-5 mt-4 space-y-3", className)}>
      <p className="text-xs text-slate-700 font-semibold uppercase tracking-widest leading-none px-0.5">태그</p>
      {isAdding && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <NVInput
            autoFocus
            size="sm"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="태그 입력 후 Enter..."
            containerClassName="flex-1"
          />
          <NVButton
            size="sm"
            onClick={handleAdd}
            disabled={!newTag.trim()}
          >
            추가
          </NVButton>
        </div>
      )}
        
      <div className="flex items-center gap-2">
        <NVTagList 
          tags={tags} 
          onDeleteTag={onDeleteTag}
          className="gap-x-2 gap-y-2.5"
        />
        <NVIconButton 
          icon={Plus}
          onClick={() => setIsAdding(!isAdding)}
          variant={isAdding ? 'primary' : 'ghost'}
          size="sm"
          rounded={true}
          strokeWidth={2.5}
          className={cn(isAdding && "rotate-45")}
        />
      </div>
    </div>
  );
}
