import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@ui/lib/utils';

export interface NVSectionHeaderProps {
  title: string;
  count?: number;
  hasDropdown?: boolean;
  isExpanded?: boolean;
  className?: string;
  onDropdownClick?: () => void;
}

export const NVSectionHeader: React.FC<NVSectionHeaderProps> = ({
  title,
  count,
  hasDropdown = false,
  isExpanded = true,
  className = '',
  onDropdownClick
}) => {
  return (
    <div className={cn(
      "flex items-center justify-between bg-transparent select-none",
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
            className={cn(
              "text-slate-400 group-hover:text-white transition-all duration-300",
              !isExpanded && "-rotate-90"
            )} 
            strokeWidth={2.5}
          />
        )}
      </div>
    </div>
  );
};
