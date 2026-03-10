'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Asset } from '../types/asset';
import { assetStore } from '../store/assetStore';

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

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const results = useMemo<Asset[]>(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return assetStore.getAssets().filter(asset =>
      asset.tags.some(t => t.includes(q)) ||
      asset.fileName.toLowerCase().includes(q)
    );
  }, [debouncedQuery, refreshTrigger]);

  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches(prev => [term, ...prev.filter(s => s !== term)].slice(0, 8));
  };

  const deleteAsset = (id: string) => {
    assetStore.deleteAsset(id);
    setRefreshTrigger(prev => prev + 1);
  };

  return { query, setQuery, results, recentSearches, addRecentSearch, deleteAsset, inputRef, hasQuery: !!debouncedQuery.trim() };
}
