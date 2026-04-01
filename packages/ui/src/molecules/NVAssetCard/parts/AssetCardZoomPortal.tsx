import React from 'react';
import { createPortal } from 'react-dom';

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
  );
};
