import type { Meta, StoryObj } from '@storybook/react';
import { NVSlider } from './index';
import React, { useState } from 'react';

const meta: Meta<typeof NVSlider> = {
  title: 'Atoms/Slider',
  component: NVSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVSlider>;

const InteractiveSlider = (args: any) => {
  const [value, setValue] = useState(args.value || 50);
  return (
    <div className="w-[300px] p-8 bg-[#0F111A] rounded-2xl border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Zoom</span>
        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{value}%</span>
      </div>
      <NVSlider {...args} value={value} onChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveSlider {...args} />,
  args: {
    value: 50,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[350px] p-8 bg-[#0F111A] rounded-2xl border border-white/5">
      <div className="space-y-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Small (sm) / 24px Track</span>
        <InteractiveSlider size="sm" value={30} />
      </div>
      <div className="space-y-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Medium (md) / Default</span>
        <InteractiveSlider size="md" value={50} />
      </div>
      <div className="space-y-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Large (lg) / 52px (Interaction)</span>
        <InteractiveSlider size="lg" value={80} />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[350px] p-8 bg-[#0F111A] rounded-2xl border border-white/5 line-through decoration-white/10">
      <InteractiveSlider disabled={true} value={40} />
    </div>
  ),
};

export const LibraryZoomCase: Story = {
  render: () => {
    const [zoom, setZoom] = useState(50);
    // Map 0-100 to grid-cols-2 to grid-cols-10 or similar
    // For simpler visual, transform scale
    const columns = Math.max(2, Math.floor(10 - (zoom / 15)));
    
    return (
      <div className="flex flex-col gap-6 w-[600px] p-8 bg-[#0A0C13] rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white tracking-tight">Library Zoom Interaction</h3>
          <p className="text-xs text-slate-500 font-medium">슬라이더를 조작하여 에셋 리스트의 뷰 크기를 조절해 보세요.</p>
        </div>

        {/* Mock Grid Area */}
        <div 
          className="grid gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl h-48 overflow-hidden transition-all duration-300 ease-out"
          style={{ 
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` 
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="aspect-square rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/10 border border-indigo-500/20 animate-pulse" 
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center gap-4 px-5 py-3 bg-white/[0.03] border border-white/10 rounded-2xl">
           <div className="w-4 h-4 rounded border-2 border-slate-600 flex-shrink-0" />
           <div className="flex-1">
             <NVSlider size="sm" value={zoom} onChange={setZoom} />
           </div>
           <div className="w-5 h-5 rounded border-2 border-slate-600 flex-shrink-0" />
           <span className="text-[10px] font-mono text-indigo-400 w-8 text-right font-bold">{zoom}%</span>
        </div>
      </div>
    );
  }
};
