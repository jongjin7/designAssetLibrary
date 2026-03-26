import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVSplashScreen } from './index';

const meta: Meta<typeof NVSplashScreen> = {
  title: 'Composition/SplashScreen',
  component: NVSplashScreen,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVSplashScreen>;

export const Default: Story = {
  args: {
    mode: 'syncing',
    message: '디자인 시스템 동기화 중...',
  },
};

export const LoadingAssets: Story = {
  args: {
    mode: 'loading',
    message: '라이브러리 에셋 불러오는 중...',
    brandDescription: 'Creative Asset Management System',
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8 h-screen overflow-y-auto bg-black p-10">
      <div className="relative h-64 border border-white/10 rounded-xl overflow-hidden shrink-0">
        <span className="absolute top-4 left-4 z-[110] text-[10px] text-slate-500 font-bold uppercase">Syncing State</span>
        <NVSplashScreen mode="syncing" message="데이터 동기화 중..." className="absolute inset-0 z-0" />
      </div>
      <div className="relative h-64 border border-white/10 rounded-xl overflow-hidden shrink-0">
        <span className="absolute top-4 left-4 z-[110] text-[10px] text-slate-500 font-bold uppercase">Loading State</span>
        <NVSplashScreen mode="loading" message="에셋 로드 중..." className="absolute inset-0 z-0" />
      </div>
      <div className="relative h-64 border border-emerald-500/20 rounded-xl overflow-hidden shrink-0">
        <span className="absolute top-4 left-4 z-[110] text-[10px] text-emerald-500 font-bold uppercase">Success State</span>
        <NVSplashScreen mode="success" message="준비 완료" className="absolute inset-0 z-0" />
      </div>
      <div className="relative h-64 border border-rose-500/20 rounded-xl overflow-hidden shrink-0">
        <span className="absolute top-4 left-4 z-[110] text-[10px] text-rose-500 font-bold uppercase">Error State</span>
        <NVSplashScreen mode="error" message="동기화 실패" className="absolute inset-0 z-0" />
      </div>
    </div>
  ),
};
