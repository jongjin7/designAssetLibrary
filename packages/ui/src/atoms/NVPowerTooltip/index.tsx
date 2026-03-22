"use client"

import React, { useState, useRef } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { cn } from '../../lib/utils';
import { NVGlassPanel } from '../NVGlassPanel';

interface NVPowerTooltipProps {
  /** 툴팁 트리거 요소 */
  children: React.ReactNode;
  /** 툴팁 내부에 표시될 리치 콘텐츠 */
  content: React.ReactNode;
  /** 표시 위치 */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** 정렬 방향 */
  align?: 'start' | 'center' | 'end';
  /** 호버 감지 딜레이 (ms) */
  openDelay?: number;
  /** 닫힘 딜레이 (ms) */
  closeDelay?: number;
  /** 트리거 컨테이너 클래스 */
  className?: string;
  /** 팝업 본체 클래스 */
  contentClassName?: string;
  /** 트리거 방식 (기본: hover) */
  trigger?: 'hover' | 'click';
  /** 툴팁 너비 (기본: auto) */
  width?: string | number;
}

export const NVPowerTooltip: React.FC<NVPowerTooltipProps> = ({
  children,
  content,
  side = 'top',
  align = 'center',
  openDelay = 150,
  closeDelay = 200,
  className = '',
  contentClassName = '',
  trigger = 'hover',
  width = 'auto'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const openTimerRef = useRef<any>(null);
  const closeTimerRef = useRef<any>(null);

  const isHover = trigger === 'hover';

  const handleOpen = () => {
    if (!isHover) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    
    if (!isOpen && !openTimerRef.current) {
      openTimerRef.current = setTimeout(() => {
        setIsOpen(true);
        openTimerRef.current = null;
      }, openDelay);
    }
  };

  const handleClose = () => {
    if (!isHover) return;
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }

    if (isOpen && !closeTimerRef.current) {
      closeTimerRef.current = setTimeout(() => {
        setIsOpen(false);
        closeTimerRef.current = null;
      }, closeDelay);
    }
  };

  const triggerHandlers = isHover ? {
    onMouseEnter: handleOpen,
    onMouseLeave: handleClose,
  } : {
    onClick: () => setIsOpen((prev) => !prev),
  };

  const contentHandlers = isHover ? {
    onMouseEnter: handleOpen,
    onMouseLeave: handleClose,
  } : {};

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger 
        asChild
        {...triggerHandlers}
      >
        <span className={cn("relative z-10 inline-block", className)}>
          {children}
        </span>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content
          side={side}
          align={align}
          sideOffset={5}
          className={cn(
            "z-[1000] outline-none group",
            // Premium Entrance Animation
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            contentClassName
          )}
          style={{ width }}
          {...contentHandlers}
        >
          <NVGlassPanel 
            variant="modal" 
            noPadding 
            blur="xl"
            className="overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/15 ring-1 ring-white/10"
          >
            {content}
          </NVGlassPanel>
          <Popover.Arrow className="fill-[#020617] stroke-white/15 stroke-[0.5px]" width={20} height={10} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
