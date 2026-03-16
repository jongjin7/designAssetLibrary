'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Search, X, Bookmark } from 'lucide-react';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (val: string) => void;
}

export function SearchPalette({ isOpen, onClose, value, onChange }: SearchPaletteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('태그');
  
  const categories = ['폴더', '태그', '스마트 폴더', '문서'];
  const mockResults = [
    '3d', 'Study', '素材', '그래픽', '그림', '녹색', '사진', '일러스트'
  ];

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Palette Window */}
      <div className="relative w-full max-w-[560px] bg-[#1a1b1e] border border-white/[0.08] rounded-xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300 pointer-events-auto">
        
        {/* Header: Search Input */}
        <div className="flex items-center px-4 py-4 gap-3">
          <Search size={18} className="text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="검색"
            className="flex-1 bg-transparent border-none text-slate-100 placeholder:text-slate-600 focus:outline-none text-base"
          />
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Categories Tab */}
        <div className="flex items-center gap-1.5 px-4 mb-3">
          {categories.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                activeTab === tab 
                ? 'bg-white/10 text-slate-100' 
                : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="h-px bg-white/[0.05] w-full" />

        {/* Results List */}
        <div className="flex-1 overflow-y-auto py-2 px-2 max-h-[400px]">
          {mockResults.map((item) => (
            <div 
              key={item}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                item === '녹색' ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02]'
              }`}
            >
              <Bookmark size={18} className="text-slate-500" />
              <span className={`text-[14px] ${item === '녹색' ? 'text-slate-100' : 'text-slate-300'}`}>
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Footer: Shortcut Guide */}
        <div className="px-4 py-3 bg-black/10 border-t border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>전환</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-bold border border-white/[0.05] text-[10px]">Tab</kbd>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>이동</span>
              <div className="flex gap-0.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-bold border border-white/[0.05] text-[10px]">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-bold border border-white/[0.05] text-[10px]">↓</kbd>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span>선택</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-bold border border-white/[0.05] text-[10px]">↵</kbd>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span>닫기</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300 font-bold border border-white/[0.05] text-[10px]">ESC</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
