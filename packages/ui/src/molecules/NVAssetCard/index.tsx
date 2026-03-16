import React from 'react';
import { Star, Maximize2, Check } from 'lucide-react';

export interface NVAssetCardProps {
  id: string;
  fileName: string;
  thumbnail?: string;
  thumbnailGradient?: string;
  palette: string[];
  isFavorite?: boolean;
  isSelected?: boolean;
  isCompact?: boolean;
  onTap?: () => void;
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
  onTap,
  onSelect,
  onFavoriteToggle,
  onMaximize,
  className = ''
}) => {
  const nameWithoutExt = fileName.split('.').slice(0, -1).join('.') || fileName;

  return (
    <div 
      className={`
        group relative flex flex-col shrink-0 w-full overflow-hidden rounded-2xl bg-slate-900 border border-white/5
        transition-all duration-300 hover:shadow-[0_0_24px_rgba(99,102,241,0.15)] active:scale-[0.98]
        ${isSelected ? 'border-indigo-500 ring-1 ring-nv-primary/50' : ''}
        ${isCompact ? 'max-w-[160px]' : ''}
        ${className}
      `.replace(/\s+/g, ' ').trim()}
      onClick={onTap}
      role="button"
      tabIndex={0}
    >
      {/* Thumbnail Area */}
      <div className={`relative w-full overflow-hidden bg-white/5 ${isCompact ? 'aspect-[4/3]' : 'aspect-square'}`}>
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={fileName} 
            loading="lazy" 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        ) : (
          <div 
            className="h-full w-full" 
            style={{ background: thumbnailGradient }} 
          />
        )}

        {/* Hover/Selection Overlay */}
        {!isCompact && (
          <div className={`
            absolute inset-0 flex flex-col justify-between p-3
            bg-gradient-to-b from-black/40 via-transparent to-black/40
            transition-opacity duration-200
            ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          `}>
            {/* Checkbox */}
            <button 
              className={`
                flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all
                ${isSelected 
                  ? 'bg-indigo-500 border-indigo-500 scale-110' 
                  : 'border-white/50 hover:border-white hover:scale-110'
                }
              `}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(e);
              }}
            >
              {isSelected && <Check size={12} className="text-white" />}
            </button>

            {/* Quick Actions */}
            <div className="flex justify-end gap-2">
              <button 
                className={`
                  flex h-7 w-7 items-center justify-center rounded-full backdrop-blur-md transition-all
                  ${isFavorite 
                    ? 'bg-indigo-500/80 text-white' 
                    : 'bg-black/40 text-white/80 hover:bg-black/60 hover:text-white'
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle?.(e);
                }}
              >
                <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              <button 
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-md transition-all hover:bg-black/60 hover:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize?.(e);
                }}
              >
                <Maximize2 size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className={`bg-white/[0.03] backdrop-blur-md ${isCompact ? 'p-2' : 'p-3'}`}>
        <div className={`flex gap-1 ${isCompact ? 'mb-1' : 'mb-1.5'}`}>
          {palette.slice(0, isCompact ? 2 : 3).map((color, i) => (
            <div 
              key={i} 
              className={`${isCompact ? 'h-2 w-2' : 'h-2.5 w-2.5'} rounded-full border border-white/10`} 
              style={{ backgroundColor: color }} 
            />
          ))}
        </div>
        <p className={`truncate font-medium transition-colors ${isCompact ? 'text-[10px]' : 'text-[11px]'} text-slate-400 group-hover:text-slate-50`}>
          {nameWithoutExt}
        </p>
      </div>
    </div>
  );
};

