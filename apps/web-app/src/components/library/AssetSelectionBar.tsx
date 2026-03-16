import React from 'react';

interface AssetSelectionBarProps {
  selectedCount: number;
  onCancel: () => void;
  onMove?: () => void;
  onDelete: () => void;
  isMobile?: boolean;
}

/**
 * AssetSelectionBar provides actions for multiple selected assets.
 * It stays at the top of the grid when items are selected.
 */
export function AssetSelectionBar({
  selectedCount,
  onCancel,
  onMove,
  onDelete,
  isMobile = false
}: AssetSelectionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={`
      sticky z-30 flex items-center justify-between p-4 rounded-2xl 
      bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-xl 
      animate-in slide-in-from-top-4 duration-300
      ${isMobile ? 'top-[64px] mx-5 mt-2 mb-4 p-3 shadow-2xl shadow-black/50' : 'top-0 mb-6'}
    `}>

      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full bg-indigo-500 text-[11px] font-extrabold text-white">
          {selectedCount}
        </span>
        <span className={`font-semibold text-indigo-100 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          개의 항목 선택됨
        </span>
      </div>
      
      <div className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
        <button 
          className={`
            rounded-lg font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all
            ${isMobile ? 'px-2 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'}
          `}
          onClick={onCancel}
        >
          취소
        </button>
        
        {onMove && (
          <button className={`
            rounded-lg font-semibold bg-white/5 text-slate-200 hover:bg-white/10 transition-all border border-white/5
            ${isMobile ? 'px-2 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'}
          `}>
            폴더 이동
          </button>
        )}
        
        <button 
          className={`
            rounded-lg font-semibold bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30
            ${isMobile ? 'px-2 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'}
          `}
          onClick={onDelete}
        >
          삭제
        </button>
      </div>
    </div>
  );
}
