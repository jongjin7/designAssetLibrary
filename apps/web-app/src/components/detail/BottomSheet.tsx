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
      setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 300);
      document.body.style.overflow = '';
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

    // 만약 시트의 최상단에 있고, 아래로 드래그하는 경우에만 시트를 이동시킴
    if (isAtTop && deltaY > 0 && initialScrollTop.current <= 0) {
      setDragY(deltaY);
      // 브라우저의 Pull-to-refresh 등을 방지하기 위해 필요한 경우 preventDefault()를 사용할 수 있으나
      // 여기서는 기본적인 터치 이벤트를 활용합니다.
    } else {
      // 그 외의 경우(위로 스크롤하거나 이미 내부 스크롤이 내려온 상태)에는 시트 이동을 0으로 고정
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
      className={`bottom-sheet-overlay ${isClosing ? 'is-closing' : ''} ${isOpen ? 'is-open' : ''}`} 
      onClick={onClose}
    >
      <div
        ref={sheetRef}
        className={`bottom-sheet ${isClosing ? 'is-closing' : ''}`}
        onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isClosing ? 'translateY(100%)' : `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          // 드래그 중이 아닐 때는 내부 스크롤이 원활하게 작동하도록 touch-action 설정
          touchAction: dragY > 0 ? 'none' : 'pan-y'
        }}
      >
        <div className="bottom-sheet__handle" />
        {children}
      </div>
    </div>
  );
}
