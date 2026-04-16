import { Star, Check, ZoomIn } from 'lucide-react';
import { cn } from '@ui/lib/utils';
import { NVIconButton } from '@ui/atoms/NVIconButton';
import { AssetDisplayOptions } from '../index';

interface AssetCardOverlayProps {
  isSelected?: boolean;
  isFavorite?: boolean;
  isMobile: boolean;
  hasError: boolean;
  isLoading: boolean;
  fileName: string;
  extension?: string;
  fileSize?: string;
  palette: string[];
  thumbnail?: string;
  displayOptions?: AssetDisplayOptions;
  onSelect?: (e: React.MouseEvent) => void;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
  onTap?: (e: React.MouseEvent) => void;
  onZoomEnter: () => void;
  onZoomLeave: () => void;
}

export const AssetCardOverlay: React.FC<AssetCardOverlayProps> = ({
  isSelected,
  isFavorite,
  isMobile,
  hasError,
  isLoading,
  fileName,
  extension,
  fileSize,
  palette,
  thumbnail,
  displayOptions = {},
  onSelect,
  onFavoriteToggle,
  onTap,
  onZoomEnter,
  onZoomLeave
}) => {
  const {
    showName = true,
    showAnnotation = true,
  } = displayOptions;

  // 파일명 처리: 항상 확장자 제외
  const displayName = fileName.split('.').slice(0, -1).join('.') || fileName;

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-2.5 z-10">
      <div className={cn(
        "absolute inset-0 pointer-events-none transition-opacity duration-500 ease-in-out",
        (hasError || isLoading)
          ? "bg-gradient-to-b from-transparent to-black/20 opacity-100"
          : "bg-gradient-to-b from-black/20 via-transparent to-black/50 opacity-100 group-hover:opacity-0"
      )} />
      
      {!hasError && !isLoading && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
      )}

      {/* Top: Minimal Floating Tags/Actions */}
      <div className={cn(
        "flex items-start justify-between transition-opacity duration-300 relative z-10",
        ((isSelected || isMobile) && !hasError && !isLoading) 
          ? "opacity-100" 
          : "opacity-0 group-hover:opacity-100"
      )}>
        {!hasError && !isLoading && (
          <NVIconButton 
              icon={Check}
              variant={isSelected ? 'primary' : 'glass'}
              size="xs"
              rounded={true}
              strokeWidth={isSelected ? 3 : 2}
              className={cn(
                "transition-all duration-300",
                isSelected ? "" : "text-white/50 border-white/30 group-hover:opacity-100"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onSelect?.(e);
              }}
              aria-label="에셋 선택"
          />
        )}

        <div className="flex items-start gap-1 ml-auto">
          {!hasError && !isLoading && (
            <NVIconButton 
                icon={Star}
                variant='neutral'
                size="xs"
                iconSize={16}
                rounded={true}
                strokeWidth={isFavorite ? 2.5 : 2}
                iconProps={{ fill: isFavorite ? "currentColor" : "none" }}
                className={cn(
                  "transition-all duration-300",
                  isFavorite ? "!text-yellow-300" : "!text-white/50"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle?.(e);
                }}
                aria-label="즐겨찾기 토글"
            />
          )}
        </div>
      </div>

      {/* Bottom: Frameless Metadata (Floating Text) & Actions */}
      <div className={cn(
        "flex items-end justify-between transition-all duration-500 mt-auto relative z-10",
        isMobile ? "translate-y-0" : "translate-y-1" + (!hasError && !isLoading ? " group-hover:translate-y-0" : ""),
        (hasError || isLoading) && "opacity-40"
      )}>
        <div className="flex flex-col gap-1.5 min-w-0 pr-2">
          {/* 파일명 */}
          {showName && (
            <p className={cn(
              "text-xs font-medium text-white/70 truncate drop-shadow-sm px-0.5 tracking-tight transition-colors",
              (!hasError && !isLoading) && "group-hover:text-white"
            )}>
              {displayName}
            </p>
          )}
          
          {/* 팔레트 컬러바 (showAnnotation) */}
          {showAnnotation && !hasError && !isLoading && (
            <div className="flex h-0.5 w-8 rounded-full overflow-hidden opacity-40 group-hover:opacity-70 transition-opacity ml-0.5">
              {palette.slice(0, 3).map((color, i) => (
                <div key={i} className="h-full flex-1" style={{ backgroundColor: color }} />
              ))}
            </div>
          )}
        </div>
        
        {/* 미리보기 버튼 */}
        {!isMobile && !hasError && !isLoading && thumbnail && (
          <NVIconButton
            icon={ZoomIn}
            size="sm"
            variant="ghost"
            className="bg-black/40 rounded-md text-white/70 hover:bg-black/80 hover:text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 scale-95 hover:scale-105"
            onMouseEnter={onZoomEnter}
            onMouseLeave={onZoomLeave}
            onClick={(e) => {
              e.stopPropagation();
              onTap?.(e);
            }}
            title="이미지 크게 보기"
          />
        )}
      </div>
    </div>
  );
};
