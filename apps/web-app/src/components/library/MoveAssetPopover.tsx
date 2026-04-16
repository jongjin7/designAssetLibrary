'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Folder, Search, Hash, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@nova/lib/utils';
import { 
  NVPopover, 
  NVPopoverTrigger, 
  NVPopoverContent,
  NVPopoverHeader,
  NVPopoverBody,
  NVSearchBar
} from '@nova/ui';
import { useFolders } from '@nova/hooks';

interface MoveAssetPopoverProps {
  onMove: (folderId: string | null) => void;
  trigger?: React.ReactNode;
  variant?: 'default' | 'context';
}

export function MoveAssetPopover({ 
  onMove, 
  trigger, 
  variant = 'default' 
}: MoveAssetPopoverProps) {
  const { folders } = useFolders();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleMove = (id: string | null) => {
    onMove(id);
    setIsOpen(false);
  };

  const filteredFolders = useMemo(() => {
    const list = folders.filter(f => 
      f.name.toLowerCase().includes(searchText.toLowerCase())
    );
    return list;
  }, [folders, searchText]);

  const allOptions = useMemo(() => {
    return [
      { id: null, name: '인박스 (Inbox)', isInbox: true },
      ...filteredFolders.map(f => ({ ...f, isInbox: false }))
    ];
  }, [filteredFolders]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % allOptions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allOptions.length) % allOptions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = allOptions[selectedIndex];
      if (selected) handleMove(selected.id === undefined ? null : (selected.id as string | null)); // Corrected check
    }
  };

  const isContext = variant === 'context';

  return (
    <NVPopover open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open) {
        setSearchText(''); // Reset search on open
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    }}>
      <NVPopoverTrigger asChild>
        {trigger}
      </NVPopoverTrigger>
      <NVPopoverContent 
        align={isContext ? "end" : "start"} 
        sideOffset={isContext ? 12 : 8}
        className={cn(
          "p-0 bg-slate-950/80 backdrop-blur-2xl border-white/8 shadow-2xl overflow-hidden",
          isContext ? "w-[220px]" : "w-[240px]"
        )}
      >
        <NVPopoverHeader className="flex items-center gap-2 py-2.5">
          <Folder size={13} className="text-indigo-400 shrink-0" />
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">
            {isContext ? "폴더로 이동" : "폴더로 이동"}
          </span>
        </NVPopoverHeader>
        <NVPopoverBody className="p-2">
          {/* Input: NVInput 스타일 기준 */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg focus-within:border-indigo-500 focus-within:bg-white/10 transition-all px-2.5 gap-2 mb-2">
            <Search size={13} className="text-slate-500 shrink-0" />
            <input 
              ref={searchInputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="폴더 검색..."
              className="bg-transparent border-none outline-none w-full text-[12px] text-slate-50 placeholder:text-slate-500 py-1.5 font-medium"
            />
          </div>
        </NVPopoverBody>

        <div className="max-h-[280px] overflow-y-auto custom-scrollbar px-2 pb-2">
          {allOptions.map((option, idx) => {
            const isSelected = idx === selectedIndex;
            const isInbox = 'isInbox' in option && option.isInbox;
            
            return (
              <button
                key={option.id ?? 'inbox'}
                onClick={() => handleMove(option.id ?? null)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all text-left group outline-none",
                  isSelected
                    ? "bg-indigo-500/15 text-indigo-300"
                    : "text-slate-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                )}
              >
                {isInbox ? (
                  <Clock 
                    size={14} 
                    className={cn(
                      "flex-shrink-0 transition-colors",
                      isSelected ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"
                    )} 
                  />
                ) : (
                  <Folder 
                    size={14}
                    className={cn(
                      "flex-shrink-0 transition-colors",
                      isSelected ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-400"
                    )}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium leading-tight truncate">{option.name}</p>
                  {isInbox && (
                    <p className="text-[10px] text-slate-500 group-hover:text-slate-400/70 truncate mt-0.5">
                      미분류 보관함으로 이동
                    </p>
                  )}
                </div>
                {isSelected && (
                  <ChevronRight size={13} className="text-indigo-400 opacity-70 shrink-0" />
                )}
              </button>
            );
          })}

          {allOptions.length === 0 && (
            <div className="py-8 text-center opacity-40">
              <Hash size={20} className="mx-auto mb-1.5 text-slate-500 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">폴더 없음</p>
            </div>
          )}
        </div>
      </NVPopoverContent>
    </NVPopover>
  );
}
