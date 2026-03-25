import React from 'react';
import { Star, Maximize2, Check, Aperture, ZoomIn } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@ui/lib/utils';
import { NVIconButton } from '@ui/atoms/NVIconButton';

export interface NVAssetCardProps {
  id: string;
  fileName: string;
  thumbnail?: string;
  thumbnailGradient?: string;
  palette: string[];
  isFavorite?: boolean;
  isSelected?: boolean;
  isCompact?: boolean;
  isMobile?: boolean;
  isLoading?: boolean;
  onTap?: (e: React.MouseEvent) => void;
  onSelect?: (e: React.MouseEvent) => void;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
  onMaximize?: (e: React.MouseEvent) => void;
  className?: string;
}

export const NVAssetCard: React.FC<NVAssetCardProps> = ({
  fileName,
  thumbnail,
  thumbnailGradient,
  palette,
  isFavorite,
  isSelected,
  isCompact = false,
  isMobile = false,
  isLoading = false,
  onTap,
  onSelect,
  onFavoriteToggle,
  onMaximize,
  className = ''
}) => {
  const nameWithoutExt = fileName.split('.').slice(0, -1).join('.') || fileName;
  const [isLongPressing, setIsLongPressing] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const [isZoomMounted, setIsZoomMounted] = React.useState(false);
  const [isZoomActive, setIsZoomActive] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomEnterTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomExitTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Safety timeout for image loading
  React.useEffect(() => {
    // Case 0: Explicitly loading (waiting for metadata or manual control)
    if (isLoading) return;

    // Case 1: Thumbnail URL is missing entirely -> Treat as Error/No-image immediately
    if (!thumbnail) {
      setHasError(true);
      setIsLoaded(true);
      return;
    }

    // Case 2: Thumbnail exists but takes too long -> Set timeout
    if (thumbnail && !isLoaded && !hasError) {
      loadingTimeoutRef.current = setTimeout(() => {
        if (!isLoaded) {
          console.warn(`Image loading timed out for: ${thumbnail}`);
          setHasError(true);
          setIsLoaded(true);
        }
      }, 10000); // 10s timeout
    }
    
    return () => {
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (zoomEnterTimerRef.current) clearTimeout(zoomEnterTimerRef.current);
      if (zoomExitTimerRef.current) clearTimeout(zoomExitTimerRef.current);
    };
  }, [thumbnail, isLoaded, hasError, isLoading]);

  const startPress = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMobile || hasError || isLoading) return;
    
    setIsLongPressing(true);
    timerRef.current = setTimeout(() => {
      if (timerRef.current) {
        onSelect?.(e as React.MouseEvent);
        setIsLongPressing(false);
        // Vibrate if supported
        if ('vibrate' in navigator) navigator.vibrate(50);
      }
    }, 600); // 600ms long press
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLongPressing(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasError || isLoading) return;
    onTap?.(e);
  };

  return (
    <div 
      className={cn(
        "group relative flex flex-col shrink-0 w-full overflow-hidden transition-all duration-500",
        "bg-transparent rounded-lg break-inside-avoid select-none",
        (!hasError && !isLoading) && "active:scale-[0.96] cursor-pointer",
        (hasError || isLoading) && "cursor-default",
        isLongPressing ? "scale-[0.98] brightness-75 transition-all duration-200" : "",
        isSelected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950" : "",
        isCompact ? "max-w-[140px]" : "",
        className
      )}
      onClick={handleCardClick}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onContextMenu={(e) => {
        if (isMobile || hasError || isLoading) e.preventDefault();
      }}
      role="button"
      tabIndex={(hasError || isLoading) ? -1 : 0}
      style={{ WebkitTouchCallout: 'none' }}
    >
      <style>{`
        @keyframes nv-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      
      {/* 1. Main Content: No borders, just the image */}
      <div className={cn(
        "w-full bg-slate-900 rounded-lg overflow-hidden transition-all duration-500 relative",
        isLongPressing ? "scale-[0.98]" : "",
        (!isLoaded || hasError || isLoading) ? "aspect-square" : ""
      )}>
        {/* Shimmer Skeleton (shown until loaded or error) */}
        {(isLoading || (!isLoaded && !hasError)) && (
          <div 
            className="absolute inset-0 bg-slate-800/60 z-10" 
            style={{ 
              backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'nv-shimmer 2s infinite linear'
            }} 
          />
        )}

        {thumbnail && !hasError && !isLoading && (
          <img 
            src={thumbnail} 
            alt={fileName} 
            loading="lazy" 
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              console.error(`Failed to load asset image: ${thumbnail}`);
              setHasError(true);
              setIsLoaded(true);
            }}
            className={cn(
              "w-full h-auto object-contain transition-all duration-700 ease-out group-hover:scale-105",
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-100"
            )} 
          />
        )}
        
        {/* Error Fallback with Service Logo (Enhanced) */}
        {hasError && !isLoading && (
          <div className="aspect-square w-full flex flex-col items-center justify-center bg-slate-900 z-20 relative overflow-hidden group/error select-none">
            {/* Background Decorative patterns */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent scale-150" />
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
            
            <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 delay-100">
              <div className="relative mb-4 transition-transform duration-500">
                {/* Logo Container */}
                <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden relative">
                   <Aperture className="absolute inset-0 w-full h-full text-indigo-500/10 -rotate-12 scale-150" />
                   <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 via-indigo-500 to-indigo-700 tracking-tighter relative z-10 drop-shadow-2xl">N</span>
                </div>
                {/* Status Dot */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-900 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 opacity-80">
                  <div className="h-[1px] w-3 bg-slate-700" />
                  <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">NOVA</span>
                  <div className="h-[1px] w-3 bg-slate-700" />
                </div>
                <span className="text-[9px] text-slate-600 font-medium tracking-tight">Capture Asset Library</span>
              </div>
            </div>

            {/* Corner Markers */}
            <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/10" />
            <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-white/10" />
            <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-white/10" />
            <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/10" />
          </div>
        )}

        {((!thumbnail && !isLoading) || (!isLoaded && !hasError && !thumbnail && !isLoading)) && (
          <div 
            className="aspect-square w-full bg-slate-800/40" 
          />
        )}
      </div>

      {/* 2. Seamless Overlay: No visible box boundaries */}
      <div className={cn(
        "absolute inset-0 flex flex-col justify-between p-2.5 transition-all duration-300",
        "bg-gradient-to-b from-black/20 via-transparent to-black/50",
        (!hasError && !isLoading) && "group-hover:from-black/40 group-hover:to-black/70",
        "opacity-100",
        (hasError || isLoading) && "from-transparent to-black/20 group-hover:from-transparent group-hover:to-black/20"
      )}>
        {/* Top: Minimal Floating Tags/Actions - Hidden on Error */}
        {!hasError && !isLoading && (
          <div className={cn(
            "flex items-start justify-between transition-opacity duration-300",
            isSelected || isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}>
            {/* Selection Indicator */}
            <div 
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full transition-all border",
                  isSelected 
                    ? "bg-indigo-500 border-indigo-500 scale-100 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]" 
                    : "border-white/30 bg-black/10 backdrop-blur-sm group-hover:opacity-100 text-white/50"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(e);
                }}
              >
                <Check size={12} strokeWidth={isSelected ? 4 : 2} />
            </div>

            {/* Quick Star */}
            <button 
                className={cn(
                  "p-1 transition-all drop-shadow-lg scale-100 active:scale-95",
                  isFavorite ? "text-indigo-400" : "text-white/60 hover:text-white"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle?.(e);
                }}
              >
                <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
        )}

        {/* Bottom: Frameless Metadata (Floating Text) & Actions */}
        <div className={cn(
          "flex items-end justify-between transition-all duration-500 mt-auto",
          isMobile ? "translate-y-0" : "translate-y-1" + (!hasError && !isLoading ? " group-hover:translate-y-0" : ""),
          (hasError || isLoading) && "opacity-40"
        )}>
          <div className="flex flex-col gap-1.5 min-w-0 pr-2">
            <p className={cn(
              "text-xs font-medium text-white/70 truncate drop-shadow-sm px-0.5 tracking-tight transition-colors",
              (!hasError && !isLoading) && "group-hover:text-white"
            )}>
              {nameWithoutExt}
            </p>
            
            {/* Subtle Color Line - Hidden on Error */}
            {!hasError && !isLoading && (
              <div className="flex h-0.5 w-8 rounded-full overflow-hidden opacity-40 group-hover:opacity-70 transition-opacity ml-0.5">
                {palette.slice(0, 3).map((color, i) => (
                  <div key={i} className="h-full flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
            )}
          </div>
          
          {/* Desktop Zoom Icon */}
          {!isMobile && !hasError && !isLoading && thumbnail && (
            <NVIconButton
              icon={ZoomIn}
              size="sm"
              variant="ghost"
              className="bg-black/40 rounded-md text-white/70 hover:bg-black/80 hover:text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 scale-95 hover:scale-105"
              onMouseEnter={() => {
                if (zoomExitTimerRef.current) clearTimeout(zoomExitTimerRef.current);
                zoomEnterTimerRef.current = setTimeout(() => {
                  setIsZoomMounted(true);
                  // 다음 프레임에서 active로 전환해야 transition이 시작됨
                  requestAnimationFrame(() => setIsZoomActive(true));
                }, 300);
              }}
              onMouseLeave={() => {
                if (zoomEnterTimerRef.current) clearTimeout(zoomEnterTimerRef.current);
                setIsZoomActive(false);
                zoomExitTimerRef.current = setTimeout(() => {
                  setIsZoomMounted(false);
                }, 200);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onTap?.(e);
                setIsZoomActive(false);
                setIsZoomMounted(false);
              }}
              title="이미지 크게 보기"
            />
          )}
        </div>
      </div>

      {/* Enlarged Image Portal */}
      {isZoomMounted && !isMobile && !hasError && !isLoading && thumbnail && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-12">
          <img
            src={thumbnail}
            alt={fileName}
            className="max-h-full max-w-full object-contain rounded-lg border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
            style={{
              transition: 'opacity 150ms ease, transform 150ms ease',
              opacity: isZoomActive ? 1 : 0,
              transform: isZoomActive ? 'scale(1)' : 'scale(0.98)',
            }}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

