import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVPopover, NVPopoverTrigger, NVPopoverContent } from './index';
import { NVButton } from '../NVButton';

const meta: Meta<typeof NVPopover> = {
  title: 'Atoms/NVPopover',
  component: NVPopover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVPopover>;

export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-20 bg-slate-950">
      <NVPopover>
        <NVPopoverTrigger asChild>
          <NVButton variant="primary">기본 팝업</NVButton>
        </NVPopoverTrigger>
        <NVPopoverContent className="w-64">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white">알림</h3>
            <p className="text-xs text-slate-400">
              Nova 디자인 시스템의 프리미엄 팝업입니다.
            </p>
          </div>
        </NVPopoverContent>
      </NVPopover>
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-20 items-center bg-slate-950 min-h-[600px]">
      {/* Side (방향) 테스트 */}
      <div className="space-y-4 text-center">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Side (방향)</h3>
        <div className="flex gap-4">
          <NVPopover>
            <NVPopoverTrigger asChild><NVButton variant="secondary" size="sm">Top</NVButton></NVPopoverTrigger>
            <NVPopoverContent side="top" className="w-32 text-center text-xs">Side: Top</NVPopoverContent>
          </NVPopover>
          <NVPopover>
            <NVPopoverTrigger asChild><NVButton variant="secondary" size="sm">Bottom</NVButton></NVPopoverTrigger>
            <NVPopoverContent side="bottom" className="w-32 text-center text-xs">Side: Bottom</NVPopoverContent>
          </NVPopover>
          <NVPopover>
            <NVPopoverTrigger asChild><NVButton variant="secondary" size="sm">Left</NVButton></NVPopoverTrigger>
            <NVPopoverContent side="left" className="w-32 text-center text-xs">Side: Left</NVPopoverContent>
          </NVPopover>
          <NVPopover>
            <NVPopoverTrigger asChild><NVButton variant="secondary" size="sm">Right</NVButton></NVPopoverTrigger>
            <NVPopoverContent side="right" className="w-32 text-center text-xs">Side: Right</NVPopoverContent>
          </NVPopover>
        </div>
      </div>

      {/* Align (정렬) 테스트 - Bottom 방향 기준 */}
      <div className="space-y-4 text-center">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Align (정렬)</h3>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2 p-2 bg-white/5 rounded-xl border border-white/10">
            <NVPopover>
              <NVPopoverTrigger asChild>
                <button className="px-4 py-6 bg-slate-800 rounded-lg text-white text-xs hover:bg-slate-700 transition-colors">
                  Align Start
                </button>
              </NVPopoverTrigger>
              <NVPopoverContent align="start" className="w-48 bg-indigo-500/20 border-indigo-500/30">
                <div className="text-xs text-indigo-300 font-bold">Align: START (왼쪽 정렬)</div>
                <div className="mt-1 text-[10px] text-slate-400">Trigger의 왼쪽 끝에 맞춰집니다.</div>
              </NVPopoverContent>
            </NVPopover>

            <NVPopover>
              <NVPopoverTrigger asChild>
                <button className="px-4 py-6 bg-slate-800 rounded-lg text-white text-xs hover:bg-slate-700 transition-colors">
                  Align Center
                </button>
              </NVPopoverTrigger>
              <NVPopoverContent align="center" className="w-48 bg-slate-800/50 border-white/20">
                <div className="text-xs text-white font-bold text-center">Align: CENTER (가운데)</div>
                <div className="mt-1 text-[10px] text-slate-400 text-center">Trigger의 중앙에 맞춰집니다.</div>
              </NVPopoverContent>
            </NVPopover>

            <NVPopover>
              <NVPopoverTrigger asChild>
                <button className="px-4 py-6 bg-slate-800 rounded-lg text-white text-xs hover:bg-slate-700 transition-colors">
                  Align End
                </button>
              </NVPopoverTrigger>
              <NVPopoverContent align="end" className="w-48 bg-cyan-500/20 border-cyan-500/30">
                <div className="text-xs text-cyan-300 font-bold text-right">Align: END (오른쪽 정렬)</div>
                <div className="mt-1 text-[10px] text-slate-400 text-right">Trigger의 오른쪽 끝에 맞춰집니다.</div>
              </NVPopoverContent>
            </NVPopover>
          </div>
          <p className="text-[10px] text-slate-500">* 위 예제는 Side: Bottom 기준 정렬입니다.</p>
        </div>
      </div>
    </div>
  ),
};
