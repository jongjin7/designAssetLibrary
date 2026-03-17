'use client';

import { NVFilterGroup } from '@nova/ui';

interface FilterChipsProps {
  active: string;
  onChange: (filter: string) => void;
  className?: string;
}

const filters = [
  { key: 'all', label: '모두' },
  { key: 'recent', label: '최근' },
  { key: 'favorites', label: '즐겨찾기' },
];

export function FilterChips({ active, onChange, className = '' }: FilterChipsProps) {
  return (
    <div className={`px-5 py-1 desktop:px-0 ${className}`}>
      <NVFilterGroup
        options={filters}
        activeKey={active}
        onChange={onChange}
        size="sm"
      />
    </div>
  );
}
