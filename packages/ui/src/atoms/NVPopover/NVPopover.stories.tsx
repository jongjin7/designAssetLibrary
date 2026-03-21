import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  NVPopover, 
  NVPopoverTrigger, 
  NVPopoverContent,
  NVPopoverHeader,
  NVPopoverBody,
  NVPopoverFooter 
} from './index';
import { NVButton } from '../NVButton';
import { cn } from '../../lib/utils';

import { NVGlassPanel } from '../NVGlassPanel';
import showcaseBg from '../../assets/images/glass_showcase_bg.png';

const meta: Meta<typeof NVPopover> = {
  title: 'Atoms/Popover',
  component: NVPopover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '특정 요소 클릭 시 나타나는 플로팅 영역입니다. 헤더, 바디, 푸터 레이아웃을 지원합니다.',
      },
    },
  },
};

export default meta;

/**
 * 스토리북 프리뷰용 정적 팝업 컨테이너입니다.
 */
const StaticPopoverContainer = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <NVGlassPanel 
    theme="dark" 
    variant="modal" 
    noPadding 
    className={cn("w-72 mx-auto overflow-hidden", className)}
  >
    {children}
  </NVGlassPanel>
);
type Story = StoryObj<typeof NVPopover>;

/**
 * 표준적인 팝업 레이아웃(헤더, 바디, 푸터)을 사용하는 예시입니다.
 */
export const Standard: Story = {
  render: () => (
    <div className="flex justify-center p-20 bg-slate-950 min-h-[400px] w-full relative overflow-hidden rounded-3xl border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      <div className="relative z-10 w-full flex justify-center">
        <StaticPopoverContainer className="w-80">
          <NVPopoverHeader>
            <h3 className="text-sm font-bold text-white">팝업 타이틀</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Sub Information</p>
          </NVPopoverHeader>
          <NVPopoverBody className="space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              팝업의 메인 콘텐츠가 들어가는 영역입니다. 구분선이 있는 헤더와 푸터 사이에서 독립적인 패딩을 가집니다.
            </p>
            <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-[11px] text-slate-300">
              추가 정보나 폼 요소들이 위치하기 적합합니다.
            </div>
          </NVPopoverBody>
          <NVPopoverFooter>
            <NVButton variant="ghost" size="sm" className="text-slate-400">취소</NVButton>
            <NVButton variant="primary" size="sm">확인</NVButton>
          </NVPopoverFooter>
        </StaticPopoverContainer>
      </div>
    </div>
  ),
};

export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-20 bg-slate-950 min-h-[350px] relative overflow-hidden rounded-3xl border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-rose-500/10 opacity-40" />
      <div className="relative z-10 w-full flex justify-center">
        <StaticPopoverContainer className="w-64 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white">단순 구성</h3>
            <p className="text-xs text-slate-400">
              구조적 분할 없이 단순한 텍스트나 내용을 전달할 때 사용합니다. p-4 클래스를 직접 추가하세요.
            </p>
          </div>
        </StaticPopoverContainer>
      </div>
    </div>
  ),
};

export const Positioning: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-20 items-center bg-slate-950 min-h-[400px]">
      <div className="grid grid-cols-2 gap-4">
        {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
          <NVPopover key={side}>
            <NVPopoverTrigger asChild>
              <NVButton variant="secondary" size="sm" className="w-32 capitalize">{side}</NVButton>
            </NVPopoverTrigger>
            <NVPopoverContent side={side} className="w-32 p-3 text-center text-xs">
              Side: {side}
            </NVPopoverContent>
          </NVPopover>
        ))}
      </div>
    </div>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-20 items-center bg-slate-950 min-h-[400px]">
      <div className="flex gap-4">
        {(['start', 'center', 'end'] as const).map((align) => (
          <NVPopover key={align}>
            <NVPopoverTrigger asChild>
              <NVButton variant="secondary" size="sm" className="w-32 capitalize">Align {align}</NVButton>
            </NVPopoverTrigger>
            <NVPopoverContent side="bottom" align={align} className="w-48 p-4 text-xs">
              <div className="font-bold text-white mb-1">Align: {align.toUpperCase()}</div>
              <div className="text-slate-400">트리거를 기준으로 {align} 정렬됩니다.</div>
            </NVPopoverContent>
          </NVPopover>
        ))}
      </div>
    </div>
  ),
};
