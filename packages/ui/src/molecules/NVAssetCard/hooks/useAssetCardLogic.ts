import React from 'react';

interface UseAssetCardLogicProps {
  thumbnail?: string;
  isLoading?: boolean;
  isMobile?: boolean;
  onSelect?: (e: React.MouseEvent) => void;
}

export function useAssetCardLogic({ 
  thumbnail, 
  isLoading, 
  isMobile, 
  onSelect 
}: UseAssetCardLogicProps) {
  const [isLongPressing, setIsLongPressing] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isZoomMounted, setIsZoomMounted] = React.useState(false);
  const [isZoomActive, setIsZoomActive] = React.useState(false);

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomEnterTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomExitTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (isLoading) return;

    if (!thumbnail) {
      setHasError(true);
      setIsLoaded(true);
      return;
    }

    if (thumbnail && !isLoaded && !hasError) {
      loadingTimeoutRef.current = setTimeout(() => {
        if (!isLoaded) {
          setHasError(true);
          setIsLoaded(true);
        }
      }, 10000);
    }
    
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (zoomEnterTimerRef.current) clearTimeout(zoomEnterTimerRef.current);
      if (zoomExitTimerRef.current) clearTimeout(zoomExitTimerRef.current);
    };
  }, [thumbnail, isLoaded, hasError, isLoading]);

  const startPress = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isMobile || hasError || isLoading) return;
    
    setIsLongPressing(true);
    timerRef.current = setTimeout(() => {
      if (timerRef.current) {
        onSelect?.(e as React.MouseEvent);
        setIsLongPressing(false);
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
    }, 600);
  }, [isMobile, hasError, isLoading, onSelect]);

  const endPress = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLongPressing(false);
  }, []);

  const handleZoomEnter = React.useCallback(() => {
    if (zoomExitTimerRef.current) clearTimeout(zoomExitTimerRef.current);
    zoomEnterTimerRef.current = setTimeout(() => {
      setIsZoomMounted(true);
      requestAnimationFrame(() => setIsZoomActive(true));
    }, 300);
  }, []);

  const handleZoomLeave = React.useCallback(() => {
    if (zoomEnterTimerRef.current) clearTimeout(zoomEnterTimerRef.current);
    setIsZoomActive(false);
    zoomExitTimerRef.current = setTimeout(() => {
      setIsZoomMounted(false);
    }, 200);
  }, []);

  return {
    isLongPressing,
    isLoaded,
    setIsLoaded,
    hasError,
    setHasError,
    isZoomMounted,
    setIsZoomMounted,
    isZoomActive,
    setIsZoomActive,
    startPress,
    endPress,
    handleZoomEnter,
    handleZoomLeave
  };
}
