'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Asset } from '../types/asset';
import { mockAssets } from '../data/mockAssets';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'brand', 'ui', 'icon', 'pattern', 'purple',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo<Asset[]>(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return mockAssets.filter(asset =>
      asset.tags.some(t => t.includes(q)) ||
      asset.fileName.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches(prev => [term, ...prev.filter(s => s !== term)].slice(0, 8));
  };

  return { query, setQuery, results, recentSearches, addRecentSearch, inputRef, hasQuery: !!debouncedQuery.trim() };
}
