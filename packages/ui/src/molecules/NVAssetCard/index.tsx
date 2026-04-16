import React from 'react';
import { cn } from '@ui/lib/utils';
import { useAssetCardLogic } from './hooks/useAssetCardLogic';
import { AssetCardImage } from './parts/AssetCardImage';
import { AssetCardOverlay } from './parts/AssetCardOverlay';
import { AssetCardZoomPortal } from './parts/AssetCardZoomPortal';

export interface AssetDisplayOptions {
  showName?: boolean;
  showInfo?: boolean;
  infoType?: 'size' | 'weight';
  showAnnotation?: boolean;
}

export interface NVAssetCardProps {
  id: string;
  fileName: string;
  extension?: string;
  fileSize?: string;
  thumbnail?: string;
  thumbnailGradient?: string;
  palette: string[];
  isFavorite?: boolean;
  isSelected?: boolean;
  isCompact?: boolean;
  isMobile?: boolean;
  isLoading?: boolean;
  thumbnailQuality?: 'speed' | 'quality';
  isGridLayout?: boolean;
  displayOptions?: AssetDisplayOptions;
  onTap?: (e: React.MouseEvent) => void;
  onSelect?: (e: React.MouseEvent) => void;
  onFavoriteToggle?: (e: React.MouseEvent) => void;
  onMaximize?: (e: React.MouseEvent) => void;
  className?: string;
  isDimmed?: boolean;
}

export const NVAssetCard: React.FC<NVAssetCardProps> = ({
  id,
  fileName,
  extension,
  fileSize,
  thumbnail,
  thumbnailGradient,
  palette,
  isFavorite,
  isSelected,
  isCompact = false,
  isMobile = false,
  isLoading = false,
  thumbnailQuality = 'quality',
  isGridLayout = false,
  displayOptions = {},
  onTap,
  onSelect,
  onFavoriteToggle,
  onMaximize,
  className = '',
  isDimmed = false
}) => {
  const {
    isLongPressing,
    isLoaded,
    setIsLoaded,
    hasError,
    setHasError,
    isZoomMounted,
    isZoomActive,
    startPress,
    endPress,
    handleZoomEnter,
    handleZoomLeave
  } = useAssetCardLogic({ thumbnail, isLoading, isMobile, onSelect });

  const handleCardClick = (e: React.MouseEvent) => {
    // If it's already selected, we should always allow toggling (deselecting)
    if (isSelected) {
       onSelect?.(e);
       return;
    }

    // If it's in a mode where tap-to-select is enabled (Mobile or SelectMode in Desktop)
    // we allow selection even for error assets
    if ((hasError || isLoading) && isMobile) {
       onSelect?.(e);
       return;
    }
    
    // For error/loading assets, we block normal interaction (opening details)
    if (hasError || isLoading) return;
    
    onTap?.(e);
  };

  return (
    <div 
      id={`asset-card-${id}`}
      className={cn(
        "group relative flex flex-col shrink-0 w-full overflow-hidden transition-all duration-500",
        "bg-transparent rounded-lg break-inside-avoid select-none",
        ((!hasError && !isLoading) || isMobile || isSelected) && "active:scale-[0.96] cursor-pointer",
        (hasError || isLoading) && (!isMobile && !isSelected) && "cursor-default",
        isLongPressing ? "scale-[0.98] brightness-75 transition-all duration-200" : "",
        isSelected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 shadow-[0_0_20px_rgba(99,102,241,0.3)]" : "",
        isCompact ? "max-w-[140px]" : "",
        isDimmed ? "opacity-30 scale-[0.98]" : "opacity-100 scale-100",
        className
      )}
      onClick={handleCardClick}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseUpCapture={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onContextMenu={(e) => {
        if (isMobile || hasError || isLoading) e.preventDefault();
      }}
      role={(hasError || isLoading) ? "presentation" : "button"}
      tabIndex={(hasError || isLoading) ? -1 : 0}
      style={{ WebkitTouchCallout: 'none' }}
    >
      <style>{`
        @keyframes nv-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
      
      <AssetCardImage 
        id={id}
        fileName={fileName}
        thumbnail={thumbnail}
        thumbnailGradient={thumbnailGradient}
        isLoaded={isLoaded}
        setIsLoaded={setIsLoaded}
        hasError={hasError}
        setHasError={setHasError}
        isLoading={isLoading}
        isLongPressing={isLongPressing}
        thumbnailQuality={thumbnailQuality}
        isGridLayout={isGridLayout}
      />

      <AssetCardOverlay 
        isSelected={isSelected}
        isFavorite={isFavorite}
        isMobile={isMobile}
        hasError={hasError}
        isLoading={isLoading}
        fileName={fileName}
        extension={extension}
        fileSize={fileSize}
        palette={palette}
        thumbnail={thumbnail}
        displayOptions={displayOptions}
        onSelect={onSelect}
        onFavoriteToggle={onFavoriteToggle}
        onTap={onTap}
        onZoomEnter={handleZoomEnter}
        onZoomLeave={handleZoomLeave}
      />

      {isZoomMounted && (
        <AssetCardZoomPortal 
          thumbnail={thumbnail}
          fileName={fileName}
          isZoomActive={isZoomActive}
        />
      )}
    </div>
  );
};
