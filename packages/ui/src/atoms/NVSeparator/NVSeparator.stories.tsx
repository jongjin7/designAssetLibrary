import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { NVSeparator } from './index';

const meta: Meta<typeof NVSeparator> = {
  title: 'Atoms/Separator',
  component: NVSeparator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
};

export default meta;
type Story = StoryObj<typeof NVSeparator>;
export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[400px] flex flex-col gap-6 p-8 bg-slate-900 rounded-2xl border border-white/5 shadow-2xl">
      <div className="flex flex-col gap-1">
        <div className="h-4 w-24 bg-white/10 rounded-md" />
        <div className="h-3 w-48 bg-white/5 rounded-md" />
      </div>
      <NVSeparator {...args} />
      <div className="flex flex-col gap-1">
        <div className="h-4 w-32 bg-white/10 rounded-md" />
        <div className="h-3 w-56 bg-white/5 rounded-md" />
      </div>
    </div>
  )
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    variant: 'default',
  },
  render: (args) => (
    <div className="w-[600px] h-[300px] flex bg-slate-900 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
      <div className="w-48 p-4 flex flex-col gap-3">
        <div className="h-8 w-8 bg-indigo-500 rounded-lg mb-2" />
        <div className="h-3 w-32 bg-white/10 rounded-full" />
        <div className="h-3 w-28 bg-white/5 rounded-full" />
        <div className="h-3 w-36 bg-white/5 rounded-full" />
        <div className="mt-auto h-3 w-20 bg-white/5 rounded-full" />
      </div>
      <NVSeparator {...args} className="my-8" />
      <div className="flex-1 p-8 flex flex-col gap-6">
        <div className="h-8 w-48 bg-white/10 rounded-lg" />
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square bg-white/5 rounded-2xl border border-white/[0.03] flex items-center justify-center">
             <span className="text-[10px] text-white/20 font-medium uppercase tracking-widest">Preview A</span>
          </div>
          <div className="aspect-square bg-white/5 rounded-2xl border border-white/[0.03] flex items-center justify-center">
             <span className="text-[10px] text-white/20 font-medium uppercase tracking-widest">Preview B</span>
          </div>
        </div>
      </div>
    </div>
  )
};
