"use client";

import { useState } from 'react';

export interface SearchFilterState {
  keyword: string;
  colors: string[];
  tags: string[];
  period: string;
}

export function useSearchFilters(
  initial: Partial<SearchFilterState> = {}, 
  onApply?: (f: SearchFilterState) => void, 
  onReset?: () => void
) {
  const [filters, setFilters] = useState<SearchFilterState>({
    keyword: '',
    colors: [],
    tags: [],
    period: '',
    ...initial,
  });

  const toggleColor = (color: string) => {
    setFilters(p => ({
      ...p,
      colors: p.colors.includes(color) ? p.colors.filter(c => c !== color) : [...p.colors, color]
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters(p => ({
      ...p,
      tags: p.tags.includes(tag) ? p.tags.filter(t => t !== tag) : [...p.tags, tag]
    }));
  };

  const setKeyword = (keyword: string) => setFilters(p => ({ ...p, keyword }));
  const setPeriod = (period: string) => setFilters(p => ({ ...p, period }));

  const handleApply = () => onApply?.(filters);
  const handleReset = () => {
    const empty = { keyword: '', colors: [], tags: [], period: '' };
    setFilters(empty);
    onApply?.(empty);
    onReset?.();
  };

  return { filters, toggleColor, toggleTag, setKeyword, setPeriod, handleApply, handleReset };
}
