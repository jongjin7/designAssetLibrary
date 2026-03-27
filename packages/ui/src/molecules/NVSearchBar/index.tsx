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
    </div>
  );


  return (
    <div className="flex items-center gap-2">
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
        containerClassName={cn('flex-1', className)}
        disabled={isFilterActive}
      />
      
      <NVButton
        variant={isFilterActive ? "secondary" : "neutral"}
        size={size} 
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onFilterClick?.(e);
        }}
        className={cn(className)} 
        
      >
        상세 검색
      </NVButton> 
    </div>
  );
};
