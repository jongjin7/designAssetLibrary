import React from 'react';
import { Folder } from 'lucide-react';
import { cn } from '@ui/lib/utils';

export interface NVFolderCardProps {
  id: string;
  name: string;
  assetThumbnails: string[];
  assetCount: number;
  isMobile?: boolean;
  className?: string;
  onClick?: (id: string, e: React.MouseEvent) => void;
}

export const NVFolderCard: React.FC<NVFolderCardProps> = ({
  id,
  name,
  assetThumbnails,
  assetCount,
  isMobile = false,
  className = '',
  onClick
}) => {
  const displayThumbnails = assetThumbnails.slice(0, 3);
  const thumbCount = displayThumbnails.length;

  return (
    <div 
      className={cn(
        "group relative flex flex-col shrink-0 w-full overflow-hidden transition-all duration-500",
        "bg-transparent rounded-lg select-none",
        "active:scale-[0.98] cursor-pointer",
        className
      )}
      onClick={(e) => onClick?.(id, e)}
    >
      {/* 1. Thumbnail Area: Pinterest-inspired 3-split layout */}
      <div className={cn(
        "relative aspect-[3/2] w-full bg-slate-900 rounded-xl overflow-hidden transition-all duration-500",
        "border border-white/5 group-hover:border-white/10 shadow-lg group-hover:shadow-2xl group-hover:-translate-y-1"
      )}>
        {thumbCount > 0 ? (
          <div className="flex w-full h-full gap-[2px] bg-slate-800">
            {/* Primary Main Slice (Left or Full) */}
            <div className={cn(
              "relative h-full overflow-hidden bg-slate-800",
              thumbCount === 1 ? "w-full" : thumbCount === 2 ? "w-1/2" : "w-[60%]"
            )}>
              <img 
                src={displayThumbnails[0]} 
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                alt=""
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>

            {/* Secondary Slices (Right column) */}
            {thumbCount > 1 && (
              <div className={cn(
                "flex flex-col gap-[2px] h-full",
                thumbCount === 2 ? "w-1/2" : "w-[40%]"
              )}>
                {displayThumbnails.slice(1).map((thumb, idx) => (
                  <div key={idx} className="relative flex-1 overflow-hidden bg-slate-800">
                    <img 
                      src={thumb} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      alt=""
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                ))}
                {/* 만약 이미지가 2개뿐인데 3분할 레이아웃 자리가 남는 경우 빈 칸 처리 */}
                {thumbCount === 2 && thumbCount < 2 && <div className="flex-1 bg-slate-800/50" />}
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-full h-full items-center justify-center bg-slate-900/50 border-2 border-dashed border-white/5">
            <Folder className="w-10 h-10 text-slate-700" strokeWidth={1.5} />
          </div>
        )}

        {/* 2. Seamless Glass Overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-xl" />
      </div>

      {/* 3. Metadata Area */}
      <div className={cn(
        "flex flex-col gap-0.5 mt-3 px-1 transition-all duration-500",
        isMobile ? "translate-y-0" : "translate-y-1 group-hover:translate-y-0"
      )}>
        <h3 className={cn(
          "font-bold text-white/90 truncate drop-shadow-sm tracking-tight transition-colors group-hover:text-white",
          isMobile ? "text-sm" : "text-base"
        )}>
          {name}
        </h3>
        <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
          <span>{assetCount.toLocaleString()} items</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="text-slate-600">Collection</span>
        </p>
      </div>
    </div>
  );
};
