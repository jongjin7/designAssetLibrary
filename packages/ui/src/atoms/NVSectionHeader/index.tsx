import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@ui/lib/utils';

export interface NVSectionHeaderProps {
  title: string;
  count?: number;
  hasDropdown?: boolean;
  className?: string;
  onDropdownClick?: () => void;
}

export const NVSectionHeader: React.FC<NVSectionHeaderProps> = ({
  title,
  count,
  hasDropdown = false,
  className = '',
  onDropdownClick
}) => {
  return (
    <div className={cn(
      "flex items-center justify-between py-4 border-b border-white/5 bg-transparent select-none",
      className
    )}>
      <div 
        className={cn(
          "flex items-center gap-2 group transition-all",
          hasDropdown && "cursor-pointer active:opacity-70"
        )}
        onClick={() => hasDropdown && onDropdownClick?.()}
      >
        <span className="text-xl font-bold text-slate-100 tracking-tight">
          {title}
        </span>
        
        {count !== undefined && (
          <span className="text-lg font-medium text-slate-500">
            ({count})
          </span>
        )}
        
        {hasDropdown && (
          <ChevronDown 
            size={18} 
            className="text-slate-400 group-hover:text-white transition-colors" 
            strokeWidth={2.5}
          />
        )}
      </div>
    </div>
  );
};
