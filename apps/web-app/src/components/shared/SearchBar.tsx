'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  onClick?: () => void;
  autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function SearchBar({ value, onChange, placeholder = '검색어 입력...', readOnly, onClick, autoFocus, inputRef }: SearchBarProps) {
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
    </div>
  );
}
