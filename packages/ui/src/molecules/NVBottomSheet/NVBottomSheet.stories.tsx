import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVBottomSheet } from './index';
import { cn } from '../../lib/utils';
import showcaseBg from '../../assets/images/glass_showcase_bg.png';

const meta: Meta<typeof NVBottomSheet> = {
  title: 'Molecules/BottomSheet',
  component: NVBottomSheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '모바일 환경에서 주로 사용되는 하단 슬라이드 업 시트 컴포넌트입니다. 드래그하여 닫거나 배경 클릭으로 닫을 수 있습니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-950 relative overflow-hidden p-10">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: `url(${showcaseBg})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        
        <div className="relative z-10 w-full max-w-md bg-slate-950/80 backdrop-blur-2xl border-t border-white/10 border-x border-white/5 rounded-t-[32px] overflow-hidden shadow-3xl">
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto my-4 shadow-sm" />
          <div className="p-10 pt-4 flex flex-col items-center gap-4 text-slate-200">
            <h2 className="text-xl font-bold text-white tracking-tight">Bottom Sheet Title</h2>
            <p className="text-slate-400 text-center text-sm leading-relaxed">
              This is a standard bottom sheet component for mobile devices.
              In Storybook preview, it is rendered statically for easier inspection.
            </p>
            <div className="w-full h-32 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-slate-600 font-medium">
              Content Area
            </div>
            <div className="w-full h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 mt-2">
              Action Button
            </div>
          </div>
        </div>
      </div>
    );
  }
};
