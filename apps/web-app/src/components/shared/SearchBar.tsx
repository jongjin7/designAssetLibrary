'use client';

import { NVSearchBar } from '@nova/ui';

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
  isFilterActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchBar(props: SearchBarProps) {
  return <NVSearchBar {...props} />;
}

