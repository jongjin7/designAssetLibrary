'use client';

import { NVFilterGroup } from '@nova/ui';

interface FilterChipsProps {
  active: string;
  onChange: (filter: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

import { useAssetStore } from '@nova/store/useAssetStore';

export function FilterChips({ active, onChange, className = '', size = 'md' }: FilterChipsProps) {
  const assets = useAssetStore(state => state.assets);
  
  const filters = [
    { key: 'all', label: '모든 에셋', count: assets.length },
    { key: 'inbox', label: '인박스', count: assets.filter(a => !a.folderId).length },
    { key: 'favorites', label: '즐겨찾기', count: assets.filter(a => a.isFavorite).length },
    { key: 'recent', label: '최근 항목' },
  ];

  return (
    <NVFilterGroup
        options={filters}
        activeKey={active}
        onChange={onChange}
        size={size}
        className={className}
      />
  );
}
