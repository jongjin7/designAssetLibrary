import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { NVIconButton } from '../../atoms/NVIconButton';
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
    <div className="flex items-center gap-0.5 mr-0.5">
      {value && !readOnly && (
        <NVIconButton
          icon={X}
          variant="ghost"
          size="sm"
          onClick={handleClear}
          title="검색어 지우기"
          aria-label="입력 초기화"
        />
      )}
      {showFilter && (
        <NVIconButton
          icon={SlidersHorizontal}
          variant="ghost"
          size="sm"
          className="border-l border-white/10 rounded-none h-5 ml-1 pl-1"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onFilterClick?.(e);
          }}
          title="상세 필터"
          aria-label="필터 설정"
        />
      )}
    </div>
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
