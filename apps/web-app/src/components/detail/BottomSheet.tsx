'use client';

import { useEffect, useRef, useState } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
      setDragY(0);
      document.body.style.overflow = 'hidden';
    } else {
      setIsClosing(true);
      setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300); // Match CSS transition time
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    if (deltaY > 0) setDragY(deltaY);
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
      className={`bottom-sheet-overlay ${isClosing ? 'is-closing' : ''} ${isOpen ? 'is-open' : ''}`} 
      onClick={onClose}
    >
      <div
        className={`bottom-sheet ${isClosing ? 'is-closing' : ''}`}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isClosing ? 'translateY(100%)' : `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <div className="bottom-sheet__handle" />
        {children}
      </div>
    </div>
  );
}
