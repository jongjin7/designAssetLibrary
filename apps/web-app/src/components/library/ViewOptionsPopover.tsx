import React from 'react';
import { 
  Columns2, 
  ArrowUpAz, 
  ArrowDownAz, 
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { 
  NVSwitch, 
  NVIconButton,
  NVButton,
  NVSelect
} from '@nova/ui';
import { cn } from '../../lib/utils';

interface ViewOptionsPopoverProps {
  className?: string;
  onClose?: () => void;
}

export function ViewOptionsPopover({ className, onClose }: ViewOptionsPopoverProps) {
  const [options, setOptions] = React.useState({
    layout: 'both',
    thumbnail: 'quality', 
    sortMethod: 'default',
    sortOrder: 'asc', 
    showName: true,
    showInfo: true,
    infoType: 'size',
    showExtension: true,
    showExtensionLabel: true,
    showAnnotation: true,
    showSubfolder: false,
    showSidebar: true,
    showInspector: true,
  });

  const updateOption = (key: keyof typeof options, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={cn("select-none", className)}>
      <div className="p-3.5 space-y-3">
        {/* Layout Select */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">레이아웃</span>
          <NVSelect 
            size="sm"
            className="w-32"
            icon={<Columns2 size={13} />}
            value={options.layout}
            onChange={(e) => updateOption('layout', e.target.value)}
            options={[
              { value: 'both', label: '양쪽' },
              { value: 'left', label: '왼쪽' },
              { value: 'right', label: '오른쪽' },
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
                options.thumbnail === 'speed' ? "bg-white/15 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
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
                options.thumbnail === 'quality' ? "bg-white/15 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
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
              value={options.sortMethod}
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
                className={cn("!w-7 !h-6 !rounded-md", options.sortOrder === 'asc' ? "bg-white/15 text-white" : "text-slate-500")}
                onClick={() => updateOption('sortOrder', 'asc')}
              />
              <NVIconButton 
                icon={ArrowDownAz} 
                size="sm" 
                variant="ghost" 
                className={cn("!w-7 !h-6 !rounded-md", options.sortOrder === 'desc' ? "bg-white/15 text-white" : "text-slate-500")}
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
            <NVSwitch checked={options.showName} onChange={(v) => updateOption('showName', v)} size="sm" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-200">정보 표시</span>
            <div className="flex items-center gap-2">
              <NVSelect 
                size="sm"
                className="w-22"
                icon={<Maximize2 size={11} />}
                value={options.infoType}
                onChange={(e) => updateOption('infoType', e.target.value)}
                options={[
                  { value: 'size', label: '규격' },
                  { value: 'weight', label: '용량' },
                ]}
              />
              <NVSwitch checked={options.showInfo} onChange={(v) => updateOption('showInfo', v)} size="sm" />
            </div>
          </div>

          {[
            { id: 'showExtension', label: '확장명 표시' },
            { id: 'showExtensionLabel', label: '확장명 레이블 표시' },
            { id: 'showAnnotation', label: '주석 표시' },
            { id: 'showSubfolder', label: '하위 폴더 내용 표시' },
          ].map(item => (
            <div key={item.id} className="flex items-center justify-between">
              <span className="text-xs text-slate-200">{item.label}</span>
              <NVSwitch 
                checked={options[item.id as keyof typeof options] as boolean} 
                onChange={(v) => updateOption(item.id as keyof typeof options, v)} 
                size="sm" 
              />
            </div>
          ))}
        </div>

        <div className="h-[1px] bg-white/5 -mx-4" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-200">사이드바 표시</span>
            <NVSwitch checked={options.showSidebar} onChange={(v) => updateOption('showSidebar', v)} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-200">인스펙터 표시</span>
            <NVSwitch checked={options.showInspector} onChange={(v) => updateOption('showInspector', v)} size="sm" />
          </div>
        </div>

        <div className="h-[1px] bg-white/5 -mx-4" />

        <NVButton 
          variant="secondary"
          size="sm"
          className="w-full shadow-none"
        >
          <RefreshCw size={12} className="text-slate-500 mr-2" />
          새로 고침
        </NVButton>
      </div>
    </div>
  );
}
