import React from 'react';
import { Search, X, SlidersHorizontal, ChevronUp } from 'lucide-react';
import { NVIconButton } from '../../atoms/NVIconButton';
import { NVInput } from '../../atoms/NVInput';
import { cn } from '../../lib/utils';
import { NVButton } from '../../atoms/NVButton';

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
  size?: 'sm' | 'md' | 'lg';
  isFilterActive?: boolean;
}

export const NVSearchBar: React.FC<NVSearchBarProps> = ({
  value,
  onChange,
  placeholder = '검색어 입력...',
  readOnly,
  onClick,
  onFilterClick,
  showFilter = true,
  isFilterActive = false,
  className = '',
  autoFocus,
  size = 'md'
}) => {
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  const rightElement = (
    <div className="flex items-center gap-1 -mr-1">
      {value && !readOnly && (
        <NVIconButton
          icon={X}
          variant="ghost"
          className="!h-5 !w-5"
          size={size}
          onClick={handleClear}
          title="검색어 지우기"
          aria-label="입력 초기화"
        />
      )}
      {showFilter && (
        <NVButton
          variant="glass"
          size={size==='sm' ? 'xs' : size==='md' ? 'sm' : 'lg'} 
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            onFilterClick?.(e);
          }}
          className={cn(
            isFilterActive ? "!text-indigo-400 !bg-indigo-500/10 !border-indigo-500/40 " : "!border-transparent !text-white/80"
          )}
        >
          상세 검색
        </NVButton>
      )}
    </div>
  );


  return (
    <NVInput
      icon={<Search size={size === 'sm' ? 14 : 18} />}
      size={size}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      autoFocus={autoFocus}
      onClick={readOnly ? onClick : undefined}
      rightElement={rightElement}
      containerClassName={cn(className, isFilterActive ? "!opacity-100 !pointer-events-auto" : "")}
      disabled={isFilterActive}
    />
  );
};
