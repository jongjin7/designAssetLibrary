import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVLogo } from './index';

const meta: Meta<typeof NVLogo> = {
  title: 'Atoms/Logo',
  component: NVLogo,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: 'NOVA 브랜드 아이덴티티를 나타내는 공식 로고 컴포넌트입니다. 4가지 표준 사이즈를 지원하며 글래스모피즘 테마에 최적화되어 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVLogo>;

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <div className="flex flex-col items-center gap-2">
        <span className="text-slate-500 text-[10px] uppercase tracking-widest">Extra Small (xs)</span>
        <NVLogo size="xs" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-slate-500 text-[10px] uppercase tracking-widest">Small (sm)</span>
        <NVLogo size="sm" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-slate-500 text-[10px] uppercase tracking-widest">Medium (md)</span>
        <NVLogo size="md" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-slate-500 text-[10px] uppercase tracking-widest">Large (lg)</span>
        <NVLogo size="lg" />
      </div>
    </div>
  ),
};

export const Variants: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => (
    <div className="space-y-12">
      <div className="p-8 bg-[#050505] rounded-xl border border-white/5 flex flex-col items-center gap-4">
        <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Default Brand Logo</span>
        <NVLogo {...args} />
      </div>
      
      <div className="p-8 bg-white rounded-xl border border-black/5 flex flex-col items-center gap-4">
         <span className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Light Background Preview</span>
         <NVLogo {...args} />
      </div>
    </div>
  ),
};
