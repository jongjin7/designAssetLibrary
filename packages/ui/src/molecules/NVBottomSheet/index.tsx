'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

interface NVBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function NVBottomSheet({ isOpen, onClose, children, className = '' }: NVBottomSheetProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const initialScrollTop = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setDragY(0);
      document.body.style.overflow = 'hidden';
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    initialScrollTop.current = sheetRef.current?.scrollTop || 0;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    const isAtTop = (sheetRef.current?.scrollTop || 0) <= 0;

    if (isAtTop && deltaY > 0 && initialScrollTop.current <= 0) {
      setDragY(deltaY);
    } else {
      setDragY(0);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 120) {
      onClose();
    } else {
      setDragY(0);
    }
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] bg-black/60 flex items-end justify-center transition-opacity duration-300",
        isOpen && !isClosing ? "opacity-100" : "opacity-0"
      )}
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className={cn(
          "w-full max-w-[430px] max-h-[85dvh] bg-slate-900 rounded-t-[20px] overflow-y-auto overscroll-behavior-y-contain",
          "transition-transform duration-300 cubic-bezier(0.23, 1, 0.32, 1)",
          isClosing ? "translate-y-full" : "translate-y-0",
          className
        )}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isClosing ? 'translateY(100%)' : `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          touchAction: dragY > 0 ? 'none' : 'pan-y'
        }}
      >
        <div className="w-9 h-1 rounded-full bg-white/20 mx-auto my-3 touch-none" />
        {children}
      </div>
    </div>
  );
}
