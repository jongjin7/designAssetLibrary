import React from 'react';
import { Star, Maximize2, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

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
  onTap,
  onSelect,
  onFavoriteToggle,
  onMaximize,
  className = ''
}) => {
  const nameWithoutExt = fileName.split('.').slice(0, -1).join('.') || fileName;
  const [isLongPressing, setIsLongPressing] = React.useState(false);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const startPress = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMobile) return;
    
    setIsLongPressing(true);
    timerRef.current = setTimeout(() => {
      onSelect?.(e as any);
      setIsLongPressing(false);
      // Vibrate if supported
      if ('vibrate' in navigator) navigator.vibrate(50);
    }, 500);
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsLongPressing(false);
  };

  return (
    <div 
      className={cn(
        "group relative flex flex-col shrink-0 w-full overflow-hidden transition-all duration-500",
        "bg-transparent rounded-lg active:scale-[0.96] break-inside-avoid mb-4 select-none",
        isLongPressing ? "scale-[0.98] brightness-75 transition-all duration-200" : "",
        isSelected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950" : "",
        isCompact ? "max-w-[140px]" : "",
        className
      )}
      onClick={onTap}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onContextMenu={(e) => {
        if (isMobile) e.preventDefault();
      }}
      role="button"
      tabIndex={0}
      style={{ WebkitTouchCallout: 'none' }}
    >
      {/* 1. Main Content: No borders, just the image */}
      <div className={cn(
        "w-full bg-slate-900 rounded-lg overflow-hidden transition-transform duration-300",
        isLongPressing ? "scale-[0.98]" : ""
      )}>
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={fileName} 
            loading="lazy" 
            className="w-full h-auto object-contain transition-transform duration-1000 group-hover:scale-105" 
          />
        ) : (
          <div 
            className="aspect-square w-full opacity-40" 
            style={{ background: thumbnailGradient }} 
          />
        )}
      </div>

      {/* 2. Seamless Overlay: No visible box boundaries */}
      <div className={cn(
        "absolute inset-0 flex flex-col justify-between p-2.5 transition-all duration-300",
        "bg-gradient-to-b from-black/30 via-transparent to-black/60",
        isSelected || isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        {/* Top: Minimal Floating Tags/Actions */}
        <div className="flex items-start justify-between">
           {/* Selection Indicator (No background box) */}
           <div 
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full transition-all border",
                isSelected 
                  ? "bg-indigo-500 border-indigo-500 scale-100 text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]" 
                  : "border-white/30 bg-black/10 backdrop-blur-sm opacity-60 group-hover:opacity-100 text-white/50"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(e);
              }}
            >
              <Check size={12} strokeWidth={isSelected ? 4 : 2} />
           </div>

           {/* Quick Star (Simple Icon with shadow) */}
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

        {/* Bottom: Frameless Metadata (Floating Text) */}
        <div className="flex flex-col gap-1.5 translate-y-1 group-hover:translate-y-0 transition-all duration-500">
          <p className="text-xs font-medium text-white/60 group-hover:text-white/90 truncate drop-shadow-sm px-0.5 tracking-tight transition-colors">
            {nameWithoutExt}
          </p>
          
          {/* Subtle Color Line */}
          <div className="flex h-0.5 w-8 rounded-full overflow-hidden opacity-40 group-hover:opacity-70 transition-opacity ml-0.5">
            {palette.slice(0, 3).map((color, i) => (
              <div key={i} className="h-full flex-1" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

