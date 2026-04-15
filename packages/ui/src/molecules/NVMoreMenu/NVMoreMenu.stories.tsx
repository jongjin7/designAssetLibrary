import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Edit2, Copy, Trash2, Share2, FolderInput } from 'lucide-react';
import { NVMoreMenu } from './index';
import { NVMenuItem } from '../NVMenuItem';
import { NVSeparator } from '../../atoms/NVSeparator';

const meta: Meta<typeof NVMoreMenu> = {
  title: 'Molecules/MoreMenu',
  component: NVMoreMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: '컴포넌트나 리스트 아이템 우측 상단 등에 배치되어 추가 액션을 제공하는 더보기 메뉴 컴포넌트입니다. NVMenuItem과 함께 사용하여 메뉴 리스트를 구성합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVMoreMenu>;

export const Default: Story = {
  args: {
    children: (
      <>
        <NVMenuItem icon={Edit2} label="이름 변경" />
        <NVMenuItem icon={FolderInput} label="위치 이동" />
        <NVMenuItem icon={Copy} label="복제하기" />
        <NVSeparator variant="subtle" className="my-1" />
        <NVMenuItem icon={Trash2} label="삭제하기" variant="danger" />
      </>
    ),
  },
  render: (args) => (
    <div className="p-20 flex items-center justify-center bg-slate-950 rounded-xl">
       <div className="relative group w-64 h-40 bg-slate-900 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
          <span className="text-slate-600 text-xs font-medium">Hover to show menu</span>
          <div className="absolute top-3 right-3">
             <NVMoreMenu {...args} />
          </div>
       </div>
    </div>
  )
};

export const Mobile: Story = {
  args: {
    isMobile: true,
    children: (
      <>
        <NVMenuItem icon={Share2} label="공유하기" />
        <NVMenuItem icon={Edit2} label="편집" />
        <NVSeparator variant="subtle" className="my-1" />
        <NVMenuItem icon={Trash2} label="삭제" variant="danger" />
      </>
    ),
  },
  render: (args) => (
    <div className="p-20 flex items-center justify-center bg-slate-950 rounded-xl">
       <div className="relative w-48 h-32 bg-slate-900 rounded-2xl border border-white/5 flex items-center justify-center overflow-hidden">
          <span className="text-slate-600 text-[10px] font-medium uppercase tracking-widest">Mobile Item</span>
          <div className="absolute top-3 right-3">
             <NVMoreMenu {...args} />
          </div>
       </div>
    </div>
  )
};
