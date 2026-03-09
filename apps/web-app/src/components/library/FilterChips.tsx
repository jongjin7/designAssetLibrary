'use client';

interface FilterChipsProps {
  active: string;
  onChange: (filter: string) => void;
}

const filters = [
  { key: 'all', label: '모두' },
  { key: 'recent', label: '최근' },
  { key: 'favorites', label: '즐겨찾기' },
];

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <div className="filter-chips">
      {filters.map(f => (
        <button
          key={f.key}
          className={`filter-chip ${active === f.key ? 'filter-chip--active' : ''}`}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
