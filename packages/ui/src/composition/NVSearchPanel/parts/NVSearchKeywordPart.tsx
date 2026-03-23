import React from 'react';
import { Search, X } from 'lucide-react';
import { NVInput } from '../../../atoms/NVInput';
import { NVIconButton } from '../../../atoms/NVIconButton';
import { cn } from '../../../lib/utils';

interface NVSearchKeywordPartProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  isDesktop?: boolean;
}

export const NVSearchKeywordPart = ({ keyword, setKeyword, isDesktop = false }: NVSearchKeywordPartProps) => (
  <NVInput
    size={isDesktop ? "md" : "md"}
    icon={<Search size={16} className={isDesktop ? "opacity-50" : "text-slate-500"} />}
    placeholder={isDesktop ? "이름, 태그, 폴더 검색..." : "에셋 태그 및 키워드 입력..."}
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    className={cn( isDesktop ? "" : "text-base")} 
    containerClassName={isDesktop ? "bg-slate-950/40 border-white/5" : "bg-white/[0.02] border-white/[0.08]"}
    rightElement={
      keyword && (
        <NVIconButton
          icon={X}
          variant="ghost"
          size="sm"
          iconSize={16}
          onClick={() => setKeyword('')}
        />
      )
    }
  />
);
