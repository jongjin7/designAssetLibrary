'use client';

interface RecentSearchChipsProps {
  searches: string[];
  onTap: (term: string) => void;
}

export function RecentSearchChips({ searches, onTap }: RecentSearchChipsProps) {
  return (
    <div className="recent-searches">
      <p className="recent-searches__label">최근 검색</p>
      <div className="recent-searches__chips">
        {searches.map(term => (
          <button key={term} className="tag-chip" onClick={() => onTap(term)}>
            #{term}
          </button>
        ))}
      </div>
    </div>
  );
}
