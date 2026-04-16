import React from 'react';
import { Aperture } from 'lucide-react';
import { cn } from '@ui/lib/utils';

interface AssetCardImageProps {
  id: string;
  fileName: string;
  thumbnail?: string;
  thumbnailGradient?: string;
  isLoaded: boolean;
  setIsLoaded: (v: boolean) => void;
  hasError: boolean;
  setHasError: (v: boolean) => void;
  isLoading: boolean;
  isLongPressing: boolean;
  thumbnailQuality?: 'speed' | 'quality';
}

export const AssetCardImage: React.FC<AssetCardImageProps> = ({
  id,
  fileName,
  thumbnail,
  thumbnailGradient,
  isLoaded,
  setIsLoaded,
  hasError,
  setHasError,
  isLoading,
  isLongPressing,
  thumbnailQuality = 'quality',
}) => {
  return (
    <div className={cn(
      "w-full bg-slate-900 rounded-lg overflow-hidden transition-all duration-500 relative",
      isLongPressing ? "scale-[0.98]" : "",
      (!isLoaded || hasError || isLoading) ? "aspect-square" : ""
    )}>
      {/* Shimmer Skeleton */}
      {(isLoading || (!isLoaded && !hasError)) && (
        <div 
          className="absolute inset-0 z-10" 
          style={{ 
            background: thumbnailGradient || 'rgba(30, 41, 59, 0.5)',
            backgroundImage: `${thumbnailGradient ? thumbnailGradient + ',' : ''} linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)`,
            backgroundSize: '200% 100%',
            animation: 'nv-shimmer 2s infinite linear'
          }} 
        />
      )}

      {thumbnail && !hasError && !isLoading && (
        <img 
          src={thumbnail} 
          alt={fileName} 
          loading={thumbnailQuality === 'speed' ? 'lazy' : 'eager'}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            console.error(`Failed to load asset image: ${thumbnail}`);
            setHasError(true);
            setIsLoaded(true);
          }}
          className={cn(
            "w-full h-auto object-contain transition-all duration-700 ease-out group-hover:scale-105 rounded-lg",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-100"
          )} 
        />
      )}
      
      {/* Error Fallback */}
      {hasError && !isLoading && (
        <div 
          className="aspect-square w-full flex flex-col items-center justify-center z-10 relative overflow-hidden group/error select-none"
          style={{ background: thumbnailGradient || '#0B0E14' }}
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/30 via-transparent to-transparent scale-150" />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
          
          <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 delay-100">
            <div className="relative mb-4 transition-transform duration-500">
              <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-slate-800 to-slate-950 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden relative">
                 <Aperture className="absolute inset-0 w-full h-full text-indigo-500/10 -rotate-12 scale-150" />
                 <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-300 via-indigo-500 to-indigo-700 tracking-tighter relative z-10 drop-shadow-2xl">N</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-900 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 opacity-80">
                <div className="h-[1px] w-3 bg-slate-700" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">Trove</span>
                <div className="h-[1px] w-3 bg-slate-700" />
              </div>
              <span className="text-[9px] text-slate-600 font-medium tracking-tight">Capture Asset Library</span>
            </div>
          </div>

          <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-white/10" />
          <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-white/10" />
          <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-white/10" />
          <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-white/10" />
        </div>
      )}

      {((!thumbnail && !isLoading) || (!isLoaded && !hasError && !thumbnail && !isLoading)) && (
        <div className="aspect-square w-full bg-slate-800/40" />
      )}
    </div>
  );
};
