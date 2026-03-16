import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { NVInput } from '../../atoms/NVInput';

export interface NVSearchBarProps {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  onClick?: () => void;
  onFilterClick?: (e: React.MouseEvent) => void;
  showFilter?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export const NVSearchBar: React.FC<NVSearchBarProps> = ({
  value,
  onChange,
  placeholder = '검색어 입력...',
  readOnly,
  onClick,
  onFilterClick,
  showFilter = true,
  className = '',
  autoFocus
}) => {
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  const rightElement = (
    <>
      {value && !readOnly && (
        <button
          className="p-1.5 text-slate-500 hover:text-slate-50 transition-colors"
          onClick={handleClear}
          aria-label="입력 초기화"
        >
          <X size={16} />
        </button>
      )}
      {showFilter && (
        <button
          className="p-1.5 text-slate-500 hover:text-indigo-500 transition-colors border-l border-white/10 ml-1 pl-2"
          onClick={(e) => {
            e.stopPropagation();
            onFilterClick?.(e);
          }}
          aria-label="필터 설정"
        >
          <SlidersHorizontal size={16} />
        </button>
      )}
    </>
  );

  return (
    <NVInput
      icon={<Search size={18} />}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      autoFocus={autoFocus}
      onClick={readOnly ? onClick : undefined}
      rightElement={rightElement}
      containerClassName={className}
    />
  );
};
