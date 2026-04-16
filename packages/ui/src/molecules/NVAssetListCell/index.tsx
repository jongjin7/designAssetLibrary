'use client';

import React, { useState } from 'react';
import { Star, Check, ZoomIn, Aperture } from 'lucide-react';
import { cn } from '@ui/lib/utils';
import { NVIconButton } from '@ui/atoms/NVIconButton';

export interface NVAssetListCellProps {
  id: string;
  fileName: string;
  extension?: string;
  fileSize?: string;
  thumbnail?: string;
  thumbnailGradient?: string;
  palette?: string[];
  isFavorite?: boolean;
  isSelected?: boolean;
  isDimmed?: boolean;
  isMobile?: boolean;
  isSelectMode?: boolean;
  thumbnailQuality?: 'speed' | 'quality';
  // ViewOptions display flags
  showName?: boolean;
  showAnnotation?: boolean;
  onTap?: (e: React.MouseEvent) => void;
  onSelect?: (e: React.MouseEvent) => void;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
  className?: string;
}

export const NVAssetListCell: React.FC<NVAssetListCellProps> = ({
  id,
  fileName,
  extension,
  fileSize,
  thumbnail,
  thumbnailGradient,
  palette = [],
  isFavorite,
  isSelected,
  isDimmed = false,
  isMobile = false,
  isSelectMode = false,
  thumbnailQuality = 'quality',
  showName = true,
  showAnnotation = true,
  onTap,
  onSelect,
  onFavoriteToggle,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const nameWithoutExt = fileName.split('.').slice(0, -1).join('.') || fileName;

  const handleClick = (e: React.MouseEvent) => {
    if (isSelected) { onSelect?.(e); return; }
    if ((hasError) && isMobile) { onSelect?.(e); return; }
    if (hasError) return;
    onTap?.(e);
  };

  return (
    <div
      id={`asset-card-${id}`}
      className={cn(
        "group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer select-none",
        "transition-all duration-200",
        "bg-white/0 hover:bg-white/5",
        isSelected && "bg-indigo-500/10 ring-1 ring-indigo-500/40",
        isDimmed && "opacity-30",
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      style={{ WebkitTouchCallout: 'none' }}
    >
      {/* Checkbox (select) */}
      <div
        className={cn(
          "flex-shrink-0 transition-all duration-200",
          (isSelected || isMobile || isSelectMode)
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        )}
        onClick={(e) => { e.stopPropagation(); onSelect?.(e); }}
      >
        <div className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center border transition-colors",
          isSelected
            ? "bg-indigo-500 border-indigo-500"
            : "border-white/20 bg-white/5"
        )}>
          {isSelected && <Check size={11} strokeWidth={3} className="text-white" />}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="flex-shrink-0 w-11 h-11 rounded-md overflow-hidden bg-slate-900 relative">
        {/* Shimmer */}
        {!isLoaded && !hasError && thumbnail && (
          <div
            className="absolute inset-0 z-10"
            style={{
              background: thumbnailGradient || 'rgba(30, 41, 59, 0.5)',
              backgroundImage: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)`,
              backgroundSize: '200% 100%',
              animation: 'nv-shimmer 2s infinite linear',
            }}
          />
        )}

        {thumbnail && !hasError ? (
          <img
            src={thumbnail}
            alt={fileName}
            loading={thumbnailQuality === 'speed' ? 'lazy' : 'eager'}
            onLoad={() => setIsLoaded(true)}
            onError={() => { setHasError(true); setIsLoaded(true); }}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        ) : hasError ? (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: thumbnailGradient || '#0B0E14' }}
          >
            <Aperture size={16} className="text-indigo-500/40" />
          </div>
        ) : (
          <div
            className="w-full h-full"
            style={{ background: thumbnailGradient || 'rgba(30,41,59,0.5)' }}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          {showName && (
            <span className="text-sm font-medium text-slate-200 truncate leading-tight">
              {nameWithoutExt}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          {fileSize && (
            <span className="text-[11px] text-slate-500 truncate">
              {fileSize}
            </span>
          )}
          {showAnnotation && palette.length > 0 && (
            <div className="flex h-1.5 w-6 rounded-full overflow-hidden opacity-50 group-hover:opacity-80 transition-opacity flex-shrink-0">
              {palette.slice(0, 3).map((color, i) => (
                <div key={i} className="h-full flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={cn(
        "flex items-center gap-1 flex-shrink-0 transition-opacity duration-200",
        (isFavorite || isMobile) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      )}>
        <NVIconButton
          icon={Star}
          variant="neutral"
          size="xs"
          iconSize={14}
          rounded={true}
          strokeWidth={isFavorite ? 2.5 : 2}
          iconProps={{ fill: isFavorite ? "currentColor" : "none" }}
          className={cn(
            "transition-all duration-200",
            isFavorite ? "!text-yellow-300" : "!text-white/30 hover:!text-white/60"
          )}
          onClick={(e) => { e.stopPropagation(); onFavoriteToggle?.(e); }}
          aria-label="즐겨찾기 토글"
        />
        {!isMobile && thumbnail && (
          <NVIconButton
            icon={ZoomIn}
            size="xs"
            variant="ghost"
            className="text-white/30 hover:text-white/60 transition-colors"
            onClick={(e) => { e.stopPropagation(); onTap?.(e); }}
            aria-label="상세 보기"
          />
        )}
      </div>

      <style>{`
        @keyframes nv-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};
