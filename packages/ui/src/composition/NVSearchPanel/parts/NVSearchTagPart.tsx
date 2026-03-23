import React from 'react';
import { Tag } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { NVChip } from '../../../atoms/NVChip';
import { NVButton } from '../../../atoms/NVButton';

export const SEARCH_TAGS = ['3d', 'Study', '素材', '그래픽', '그림', '녹색', '사진', '일러스트'];

interface NVSearchTagPartProps {
  tags: string[];
  toggleTag: (tag: string) => void;
  isDesktop?: boolean;
}

export const NVSearchTagPart = ({ tags, toggleTag, isDesktop = false }: NVSearchTagPartProps) => (
  <div className={cn("flex flex-wrap", isDesktop ? "gap-2 py-1" : "gap-1.5")}>
    {SEARCH_TAGS.map(tag => (
      <NVChip
        key={tag}
        label={tag}
        isActive={tags.includes(tag)}
        onClick={() => toggleTag(tag)}
        variant="filter"
        size="sm"
      />
    ))}
    <NVButton 
      variant="ghost" 
      size="sm"
      className="gap-1.5 px-3 rounded-lg border border-dashed border-white/10 text-[11px] font-bold text-slate-500 hover:text-slate-300 hover:border-white/20 transition-all"
    >
      <Tag size={12} /> 전체 보기
    </NVButton>
  </div>
);
