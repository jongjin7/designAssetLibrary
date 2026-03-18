import type { Meta, StoryObj } from '@storybook/react';
import { NVBottomSheet } from './index';
import React, { useState } from 'react';

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
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-slate-950">
        <button 
          onClick={() => setIsOpen(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Open Bottom Sheet
        </button>
        <NVBottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-10 flex flex-col items-center gap-4">
            <h2 className="text-xl font-bold text-white">Bottom Sheet Title</h2>
            <p className="text-slate-400 text-center">
              This is a standard bottom sheet component for mobile devices.
              You can drag it down to close.
            </p>
            <div className="w-full h-32 bg-white/5 rounded-2xl flex items-center justify-center text-slate-600">
              Content Placeholder
            </div>
          </div>
        </NVBottomSheet>
      </div>
    );
  }
};
