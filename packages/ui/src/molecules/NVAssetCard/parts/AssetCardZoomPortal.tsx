import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@ui/lib/utils';

interface AssetCardZoomPortalProps {
  thumbnail?: string;
  fileName: string;
  isZoomActive: boolean;
}

export const AssetCardZoomPortal: React.FC<AssetCardZoomPortalProps> = ({
  thumbnail,
  fileName,
  isZoomActive
}) => {
  if (!thumbnail || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none p-12 transition-all duration-500 ease-in-out",
        isZoomActive ? "bg-slate-950/70 backdrop-blur-2xl" : "bg-transparent backdrop-blur-0"
      )}
    >
      <img
        src={thumbnail}
        alt={fileName}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.9)]"
        style={{
          transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: isZoomActive ? 1 : 0,
          transform: isZoomActive ? 'scale(1)' : 'scale(0.95)',
          perspective: '1000px'
        }}
      />
    </div>,
    document.body
  );
};
