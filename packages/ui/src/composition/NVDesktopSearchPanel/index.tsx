import React, { useState } from 'react';
import { X, Search, RotateCcw, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';
import { NVField } from '../../atoms/NVField';
import { NVInput } from '../../atoms/NVInput';
import { NVButton } from '../../atoms/NVButton';
import { NVGlassPanel } from '../../atoms/NVGlassPanel';
import { NVChip } from '../../atoms/NVChip';

export interface NVDesktopSearchPanelProps {
  onSearch?: (filters: any) => void;
  onClose?: () => void;
  className?: string;
}

const COLORS = [
  { id: 'indigo', hex: '#6366f1', label: 'Deep Indigo' },
  { id: 'teal', hex: '#14b8a6', label: 'Teal' },
  { id: 'ruby', hex: '#e11d48', label: 'Ruby' },
  { id: 'emerald', hex: '#10b981', label: 'Emerald' },
  { id: 'gold', hex: '#f59e0b', label: 'Gold' },
  { id: 'cyan', hex: '#06b6d4', label: 'Cyan' },
  { id: 'white', hex: '#f8fafc', label: 'White/Grey' },
];

const PERIODS = ['전체', '오늘', '7일', '30일'];

export const NVDesktopSearchPanel: React.FC<NVDesktopSearchPanelProps> = ({
  onSearch,
  onClose,
  className = '',
}) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('전체');
  const [tags, setTags] = useState(['Branding', 'Vector', 'Abstract', 'Concept']);
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleReset = () => {
    setSelectedColor(null);
    setSelectedPeriod('전체');
    setTags([]);
    setInputValue('');
  };

  return (
    <NVGlassPanel 
      variant="modal" 
      className={cn("w-full max-w-3xl overflow-hidden shadow-2xl border-white/10", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          상세 검색 <span className="text-xs font-normal text-slate-500 uppercase tracking-widest pt-1">Advanced Search</span>
        </h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="p-8 space-y-10">
        {/* Top Section: Color & Date */}
        <div className="flex gap-16">
          {/* Color Selector */}
          <NVField label="색상 팔레트" size="sm" className="w-[300px]">
            <div className="flex flex-wrap gap-3 pt-1">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id === selectedColor ? null : color.id)}
                  className={cn(
                    "group relative w-8 h-8 rounded-full border-2 transition-all duration-300",
                    selectedColor === color.id 
                      ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                      : "border-transparent hover:scale-105"
                  )}
                  title={color.label}
                >
                  <div 
                    className="w-full h-full rounded-full" 
                    style={{ backgroundColor: color.hex }} 
                  />
                  {selectedColor === color.id && (
                    <div className="absolute -inset-1.5 rounded-full border border-white/20 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </NVField>

          {/* Date Selector */}
          <NVField label="기간 설정" size="sm" className="flex-1">
            <div className="flex bg-white/5 p-1 rounded-xl w-fit border border-white/10">
              {PERIODS.map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={cn(
                    "px-5 py-1.5 text-xs font-bold rounded-lg transition-all duration-200",
                    selectedPeriod === period
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  {period}
                </button>
              ))}
            </div>
          </NVField>
        </div>

        {/* Middle Section: Tags */}
        <NVField label="태그 및 검색어" size="sm">
          <div className="space-y-4">
            <NVInput 
              icon={<Search size={18} className="text-slate-500" />}
              placeholder="필터링할 태그를 입력 후 Enter (예: 로고, 이미지, 배경)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddTag}
              className="bg-white/5"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
                {tags.map(tag => (
                  <NVChip 
                    key={tag}
                    label={tag}
                    variant="filter"
                    size="sm"
                    className="group"
                    onClick={() => {}} // No-op for now but makes it interactive-looking
                  />
                ))}
              </div>
            )}
          </div>
        </NVField>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 px-8 py-6 bg-white/5 border-t border-white/5">
        <NVButton 
          variant="ghost" 
          size="md" 
          onClick={handleReset}
          className="text-slate-500 hover:text-slate-300"
        >
          <RotateCcw size={16} className="mr-2" /> 초기화
        </NVButton>
        <NVButton 
          variant="primary" 
          size="md"
          className="min-w-[160px] font-bold shadow-indigo-500/20 shadow-lg"
          onClick={() => onSearch?.({ selectedColor, selectedPeriod, tags })}
        >
          <Search size={18} className="mr-2" /> 상세 조건으로 검색
        </NVButton>
      </div>
    </NVGlassPanel>
  );
};
