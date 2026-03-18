'use client';

import { NVFilterGroup } from '@nova/ui';

interface FilterChipsProps {
  active: string;
  onChange: (filter: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const filters = [
  { key: 'all', label: '모두' },
  { key: 'recent', label: '최근' },
  { key: 'favorites', label: '즐겨찾기' },
];

export function FilterChips({ active, onChange, className = '', size = 'md' }: FilterChipsProps) {
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
