'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  onClick?: () => void;
  onFilterClick?: (e: React.MouseEvent) => void;
  autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  showFilter?: boolean;
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = '검색어 입력...', 
  readOnly, 
  onClick, 
  onFilterClick,
  autoFocus, 
  inputRef,
  showFilter = true
}: SearchBarProps) {
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  return (
    <div className="search-bar" onClick={readOnly ? onClick : undefined}>
      <Search size={16} className="search-bar__icon" />
      <input
        ref={inputRef}
        className="search-bar__input"
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        autoFocus={autoFocus}
      />
      {value && !readOnly && (
        <button 
          className="search-bar__clear" 
          onClick={handleClear}
          aria-label="입력 초기화"
        >
          <X size={16} />
        </button>
      )}
      {showFilter && (
        <button 
          className="search-bar__filter" 
          onClick={(e) => {
            e.stopPropagation();
            onFilterClick?.(e);
          }}
          aria-label="필터 설정"
        >
          <SlidersHorizontal size={16} />
        </button>
      )}
    </div>
  );
}
