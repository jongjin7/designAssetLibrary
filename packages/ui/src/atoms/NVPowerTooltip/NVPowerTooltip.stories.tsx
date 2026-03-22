import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVPowerTooltip } from './index';
import { NVButton } from '../NVButton';
import { 
  Info, 
  Settings, 
  Maximize2, 
  Download,
  Share2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import showcaseBg from '../../assets/images/glass_showcase_bg.png';

const meta: Meta<typeof NVPowerTooltip> = {
  title: 'Atoms/PowerTooltip',
  component: NVPowerTooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '단순 텍스트를 넘어 리치한 콘텐츠와 상호작용이 가능한 프리미엄 툴팁입니다. Radix Popover 기반으로 마우스 호버 시 자연스럽게 나타나며 내부 요소 클릭이 가능합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVPowerTooltip>;

/**
 * 가장 기본적인 형태의 툴팁 예시입니다.
 */
export const Default: Story = {
  render: () => (
    <div className="flex justify-center items-center p-20 bg-slate-950 min-h-[200px] rounded-3xl border border-white/5">
      <NVPowerTooltip
        content={<div className="p-3 text-xs text-slate-300">기본적인 텍스트 정보를 제공합니다.</div>}
      >
        <div className="px-5 py-2.5 bg-white/5 rounded-xl border border-white/10 text-xs font-bold text-slate-400 cursor-help">
          Hover for info
        </div>
      </NVPowerTooltip>
    </div>
  ),
};

/**
 * 툴팁이 나타나는 방향(Side)과 정렬(Align) 예시입니다.
 */
export const SideAndAlign: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-20 items-center bg-slate-950 min-h-[400px] rounded-3xl border border-white/5">
      <div className="grid grid-cols-2 gap-8">
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <NVPowerTooltip
            key={side}
            side={side}
            align="center"
            content={<div className="p-3 text-xs font-bold text-white uppercase">Side: {side}</div>}
          >
            <NVButton variant="secondary" size="sm" className="w-32 capitalize">{side}</NVButton>
          </NVPowerTooltip>
        ))}
      </div>
      
      <div className="h-px w-full bg-white/5" />
      
      <div className="flex gap-4">
        {(['start', 'center', 'end'] as const).map((align) => (
          <NVPowerTooltip
            key={align}
            side="bottom"
            align={align}
            content={<div className="p-3 text-xs font-medium text-slate-300">Aligned to {align}</div>}
          >
            <NVButton variant="glass" size="sm" className="w-32 capitalize">Align {align}</NVButton>
          </NVPowerTooltip>
        ))}
      </div>
    </div>
  ),
};

/**
 * 딜레이 설정을 통해 사용자의 의도를 정밀하게 제어하는 예시입니다.
 */
export const DelaySettings: Story = {
  render: () => (
    <div className="flex gap-8 justify-center items-center p-20 bg-slate-950 min-h-[250px] rounded-3xl border border-white/5">
      <NVPowerTooltip
        openDelay={0}
        closeDelay={100}
        content={<div className="p-3 text-xs">즉시 나타나고 빠르게 닫힙니다. (0ms / 100ms)</div>}
      >
        <div className="px-5 py-2.5 bg-rose-500/10 rounded-xl border border-rose-500/10 text-xs font-bold text-rose-400 cursor-help">
          Quick Show
        </div>
      </NVPowerTooltip>

      <NVPowerTooltip
        openDelay={1000}
        closeDelay={500}
        content={<div className="p-3 text-xs font-bold text-indigo-400">오래 머물러야 나타납니다. (1000ms)</div>}
      >
        <div className="px-5 py-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/10 text-xs font-bold text-indigo-400 cursor-help">
          Slow Show
        </div>
      </NVPowerTooltip>

      <NVPowerTooltip
        openDelay={150}
        closeDelay={1500}
        content={
          <div className="p-4 space-y-2">
            <p className="text-xs text-white">마우스가 벗어나도 한참 유지됩니다. (1500ms)</p>
            <NVButton size="xs" variant="primary" className="w-full">안에서 작업하기</NVButton>
          </div>
        }
      >
        <div className="px-5 py-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/10 text-xs font-bold text-emerald-400 cursor-help">
          Sticky Close
        </div>
      </NVPowerTooltip>
    </div>
  ),
};

/**
 * 클릭 시에만 나타나는 툴팁 예시입니다. 더 명확한 의사결정이 필요할 때 사용합니다.
 */
export const ClickTrigger: Story = {
  render: () => (
    <div className="flex justify-center items-center p-20 bg-slate-950 min-h-[250px] rounded-3xl border border-white/5">
      <NVPowerTooltip
        trigger="click"
        side="bottom"
        content={
          <div className="p-4 space-y-3">
            <h4 className="text-sm font-bold text-white">클릭하여 열림</h4>
            <p className="text-xs text-slate-400">호버로는 반응하지 않으며, 클릭해야만 상세 정보를 볼 수 있습니다.</p>
            <NVButton size="xs" variant="primary" className="w-full">알겠습니다</NVButton>
          </div>
        }
      >
        <NVButton variant="secondary" className="font-bold">
          Click to see info
        </NVButton>
      </NVPowerTooltip>
    </div>
  ),
};

/**
 * 에셋 상세 정보를 보여주는 리치 툴팁 예시입니다.
 */
export const RichInfo: Story = {
  render: () => (
    <div className="flex justify-center items-center p-20 bg-slate-950 min-h-[350px] relative overflow-hidden rounded-3xl border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      
      <NVPowerTooltip
        side="top"
        align="start"
        width={320}
        content={
          <div className="p-4 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Info size={18} />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-bold text-white leading-none">에셋 스펙 가이드</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  이 에셋은 72dpi, Web RGB 프로파일로 최적화되어 웹 환경에서 가장 정확한 색상을 표현합니다.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Dimension</span>
                <p className="text-xs text-white font-medium">1920 × 1080</p>
              </div>
              <div className="p-2.5 bg-white/5 rounded-lg border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Format</span>
                <p className="text-xs text-white font-medium">JPEG 2000</p>
              </div>
            </div>
          </div>
        }
      >
        <div className="relative z-10 flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-300 transition-all cursor-help group">
          <Info size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold">Specs Guide</span>
        </div>
      </NVPowerTooltip>
    </div>
  ),
};

/**
 * 에셋 미리보기 및 주요 액션을 포함한 모바일 스타일 툴팁입니다.
 */
export const AssetPreview: Story = {
  render: () => (
    <div className="flex justify-center items-center p-20 bg-slate-950 min-h-[400px] relative overflow-hidden rounded-3xl border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      
      <NVPowerTooltip
        side="right"
        align="center"
        width={240}
        content={
          <div className="flex flex-col">
            <div className="w-full aspect-video relative">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400" 
                className="w-full h-full object-cover" 
                alt="preview"
              />
              <div className="absolute top-2 right-2 flex gap-1.5">
                <div className="p-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white/80 hover:text-white cursor-pointer transition-colors">
                  <Maximize2 size={12} />
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-slate-950/80 space-y-3">
              <div className="space-y-0.5 px-0.5">
                <h4 className="text-[13px] font-bold text-white truncate">Branding_Visual_01.jpg</h4>
                <p className="text-[10px] text-slate-500">Last edited 2h ago</p>
              </div>
              
              <div className="flex gap-2">
                <NVButton size="xs" variant="primary" className="flex-1 h-8 rounded-lg">
                  <Download size={12} className="mr-1" /> Download
                </NVButton>
                <NVButton size="xs" variant="secondary" className="w-8 h-8 rounded-lg p-0">
                  <Share2 size={12} />
                </NVButton>
              </div>
            </div>
          </div>
        }
      >
        <div className="w-24 h-24 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 relative group overflow-hidden cursor-help">
          <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
          <Settings size={32} className="group-hover:rotate-90 transition-transform duration-700" />
        </div>
      </NVPowerTooltip>
    </div>
  ),
};

/**
 * 액션이 필요한 리치 툴팁 예시입니다 (Destructive Action).
 */
export const Destructive: Story = {
  render: () => (
    <div className="flex justify-center items-center p-20 bg-slate-950 min-h-[250px] relative overflow-hidden rounded-3xl border border-white/5">
      <NVPowerTooltip
        side="bottom"
        align="center"
        width={280}
        content={
          <div className="p-4 space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">정말 삭제하시겠습니까?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                   이 작업은 되돌릴 수 없으며, 모든 연결된 리소스가 끊깁니다.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
               <NVButton variant="secondary" size="sm" className="flex-1 font-bold">취소</NVButton>
               <NVButton variant="danger" size="sm" className="flex-2 font-bold bg-rose-600 border-none hover:bg-rose-500 text-white">삭제 확정</NVButton>
            </div>
          </div>
        }
      >
        <button className="px-6 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl font-bold hover:bg-rose-500 hover:text-white transition-all">
          <Trash2 size={16} className="inline mr-2 -mt-0.5" /> 
          Delete Resource
        </button>
      </NVPowerTooltip>
    </div>
  ),
};
