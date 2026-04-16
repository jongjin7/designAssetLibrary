import React from 'react';
import { 
  LayoutGrid,
  ArrowUpAz, 
  ArrowDownAz, 
  RefreshCw
} from 'lucide-react';
import { 
  NVSwitch, 
  NVIconButton,
  NVButton,
  NVSelect
} from '@nova/ui';
import { cn } from '@nova/lib/utils';

import { useAssetStore, ViewOptions } from '@nova/store/useAssetStore';

interface ViewOptionsPopoverProps {
  className?: string;
  onClose?: () => void;
}

export function ViewOptionsPopover({ className, onClose }: ViewOptionsPopoverProps) {
  const viewOptions = useAssetStore(state => state.viewOptions);
  const updateViewOption = useAssetStore(state => state.updateViewOption);
  const refreshAssets = useAssetStore(state => state.refreshAssets);

  const updateOption = (key: keyof ViewOptions, value: any) => {
    updateViewOption(key, value);
  };

  return (
    <div className={cn("select-none", className)}>
      <div className="p-3.5 space-y-3">
        {/* Gallery View Mode */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">보기 모드</span>
          <NVSelect 
            size="sm"
            className="w-32"
            icon={<LayoutGrid size={13} />}
            value={viewOptions.layout}
            onChange={(e) => updateOption('layout', e.target.value)}
            options={[
              { value: 'grid', label: '격자형 (Grid)' },
              { value: 'masonry', label: '폭포형 (Masonry)' },
              { value: 'list', label: '리스트형 (List)' },
            ]}
          />
        </div>

        {/* Thumbnail Quality */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">썸네일</span>
          <div className="flex p-0.5 rounded-lg border border-white/10 bg-white/5">
            <NVButton 
              variant="ghost"
              size="sm"
              onClick={() => updateOption('thumbnail', 'speed')}
              className={cn(
                "!px-2 !py-1 !rounded-md",
                viewOptions.thumbnail === 'speed' ? "bg-white/15 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              )}
            >
              속도
            </NVButton>
            <NVButton 
              variant="ghost"
              size="sm"
              onClick={() => updateOption('thumbnail', 'quality')}
              className={cn(
                "!px-2 !py-1 !rounded-md",
                viewOptions.thumbnail === 'quality' ? "bg-white/15 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              )}
            >
              품질
            </NVButton>
          </div>
        </div>

        {/* Sort Method */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">정렬 방법</span>
          <div className="flex items-center gap-1.5">
            <NVSelect 
              size="sm"
              className="w-22"
              value={viewOptions.sortMethod}
              onChange={(e) => updateOption('sortMethod', e.target.value)}
              options={[
                { value: 'default', label: '기본' },
                { value: 'name', label: '이름' },
                { value: 'date', label: '날짜' },
              ]}
            />
            <div className="flex p-0.5 rounded-lg border border-white/10 bg-white/5">
              <NVIconButton 
                icon={ArrowUpAz} 
                size="sm" 
                variant="ghost" 
                className={cn("!w-7 !h-6 !rounded-md", viewOptions.sortOrder === 'asc' ? "bg-white/15 text-white" : "text-slate-500")}
                onClick={() => updateOption('sortOrder', 'asc')}
              />
              <NVIconButton 
                icon={ArrowDownAz} 
                size="sm" 
                variant="ghost" 
                className={cn("!w-7 !h-6 !rounded-md", viewOptions.sortOrder === 'desc' ? "bg-white/15 text-white" : "text-slate-500")}
                onClick={() => updateOption('sortOrder', 'desc')}
              />
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-white/5 -mx-4" />

        {/* Toggles */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-200">이름 표시</span>
            <NVSwitch checked={viewOptions.showName} onChange={(v) => updateOption('showName', v)} size="sm" />
          </div>

          {[
            { id: 'showAnnotation', label: '주석(컬러칩) 표시' },
            { id: 'showSubfolder', label: '하위 폴더 내용 표시' },
          ].map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <span className="text-xs text-slate-200">{item.label}</span>
              <NVSwitch 
                checked={viewOptions[item.id as keyof ViewOptions] as boolean} 
                onChange={(v) => updateOption(item.id as keyof ViewOptions, v)} 
                size="sm" 
              />
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-white/5 -mx-4" />

        <NVButton 
          variant="secondary"
          size="sm"
          className="w-full shadow-none"
          onClick={() => {
            refreshAssets();
            onClose?.();
          }}
        >
          <RefreshCw size={12} className="text-slate-500 mr-2" />
          새로 고침
        </NVButton>
      </div>
    </div>
  );
}
