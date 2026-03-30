'use client';

import React, { useEffect, useRef, useMemo } from 'react';
import { Folder, Search, Hash, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@nova/lib/utils';
import { 
  NVPopover, 
  NVPopoverTrigger, 
  NVPopoverContent,
  NVSearchBar
} from '@nova/ui';
import { useFolders } from '@nova/hooks/useFolders';

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
          "p-0 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200",
          isContext ? "w-[240px]" : "w-[280px]"
        )}
      >
        <div className={cn(
          "border-b border-white/5 bg-white/[0.02]",
          isContext ? "p-2" : "p-3"
        )}>
          {!isContext && (
            <div className="flex items-center gap-2 mb-3 px-1">
              <Folder size={14} className="text-indigo-400" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Move to Folder</span>
            </div>
          )}
          <div className="relative group">
            <Search 
              size={isContext ? 14 : 16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" 
            />
            <input 
              ref={searchInputRef}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isContext ? "폴더 검색..." : "Search folders..."}
              className={cn(
                "w-full bg-black/40 border border-white/5 rounded-xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium",
                isContext ? "pl-9 py-2 text-xs" : "pl-10 py-2.5 text-[13px]"
              )}
            />
          </div>
        </div>

        <div className={cn(
          "max-h-[320px] overflow-y-auto custom-scrollbar",
          isContext ? "p-1" : "p-1.5"
        )}>
          {allOptions.map((option, idx) => {
            const isSelected = idx === selectedIndex;
            const isInbox = 'isInbox' in option && option.isInbox;
            
            return (
              <button
                key={option.id ?? 'inbox'}
                onClick={() => handleMove(option.id ?? null)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl transition-all text-left group relative outline-none",
                  isContext ? "px-2.5 py-2" : "px-3 py-2.5",
                  isSelected ? "bg-indigo-500 text-white" : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <div 
                  className={cn(
                    "rounded-lg flex items-center justify-center transition-colors shrink-0",
                    isContext ? "w-6 h-6" : "w-8 h-8",
                    isSelected ? "bg-white/20" : isInbox ? "bg-indigo-500/10" : "bg-white/[0.05]"
                  )}
                >
                  {isInbox ? (
                    <Clock size={isContext ? 12 : 16} className={isSelected ? "text-white" : "text-indigo-400"} />
                  ) : (
                    <Folder 
                      size={isContext ? 12 : 16} 
                      className={isSelected ? "text-white" : "text-slate-400"}
                      fill="currentColor"
                      fillOpacity={isSelected ? 0.3 : 0.1}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-semibold truncate",
                    isContext ? "text-xs" : "text-[13px]"
                  )}>{option.name}</p>
                  {!isContext && (
                    <p className={cn(
                      "text-[10px] font-medium opacity-60",
                      isSelected ? "text-white" : "text-slate-500"
                    )}>
                      {isInbox ? '미분류 보관함으로 이동' : (option as any).parentId ? 'Subfolder' : 'Root Folder'}
                    </p>
                  )}
                </div>
                {isSelected && (
                   <ChevronRight size={14} className="opacity-60" />
                )}
              </button>
            );
          })}

          {allOptions.length === 0 && (
            <div className="py-10 text-center opacity-40">
              <Hash size={24} className="mx-auto mb-2 text-slate-500 opacity-20" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">No Folders Found</p>
            </div>
          )}
        </div>

        {!isContext && (
          <div className="p-2 border-t border-white/5 bg-black/20">
            <button className="w-full py-2 rounded-lg text-[11px] font-bold text-indigo-400 hover:bg-indigo-500/10 transition-all uppercase tracking-wider">
              + Create New Folder
            </button>
          </div>
        )}
      </NVPopoverContent>
    </NVPopover>
  );
}
