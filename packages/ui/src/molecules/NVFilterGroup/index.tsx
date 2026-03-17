import React from 'react';
import { NVChip } from '../../atoms/NVChip';

export interface NVFilterOption {
  key: string;
  label: string;
}

export interface NVFilterGroupProps {
  options: NVFilterOption[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const NVFilterGroup: React.FC<NVFilterGroupProps> = ({
  options,
  activeKey,
  onChange,
  className = '',
  size = 'md'
}) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 ${className}`}>
      {options.map((option) => (
        <NVChip
          key={option.key}
          label={option.label}
          isActive={activeKey === option.key}
          onClick={() => onChange(option.key)}
          variant="filter"
          size={size}
        />
      ))}
    </div>
  );
};
