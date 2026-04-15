import React from 'react';
import { MoreVertical } from 'lucide-react';
import { 
  NVPopover, 
  NVPopoverTrigger, 
  NVPopoverContent 
} from '../../atoms/NVPopover';
import { cn } from '../../lib/utils';

interface NVMoreMenuProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string; // Content class
  triggerClassName?: string;
  isMobile?: boolean;
}

/**
 * 컴포넌트나 리스트 아이템 우측 상단 등에 배치되어 추가 액션을 제공하는 메뉴 컴포넌트입니다.
 */
export const NVMoreMenu: React.FC<NVMoreMenuProps> = ({
  children,
  align = 'end',
  side = 'bottom',
  className,
  triggerClassName,
  isMobile = false
}) => {
  return (
    <NVPopover>
      <NVPopoverTrigger asChild>
        <button 
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition-colors border border-white/10 shadow-lg",
            !isMobile && "opacity-0 group-hover:opacity-100",
            triggerClassName
          )}
        >
          <MoreVertical size={16} />
        </button>
      </NVPopoverTrigger>
      <NVPopoverContent 
        align={align} 
        side={side}
        className={cn(
          "w-44 p-1 bg-slate-900/90 border-white/10 backdrop-blur-2xl shadow-2xl z-[100]",
          className
        )}
      >
        <div className="flex flex-col gap-0.5">
          {children}
        </div>
      </NVPopoverContent>
    </NVPopover>
  );
};
