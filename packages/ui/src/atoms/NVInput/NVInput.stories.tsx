import type { Meta, StoryObj } from '@storybook/react';
import { NVInput } from './index';
import { Search, Tag, Mail, X } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof NVInput> = {
  title: 'Atoms/Input',
  component: NVInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '사용자 입력을 받기 위한 텍스트 필드 컴포넌트입니다. 좌측 아이콘과 우측 요소를 자유롭게 추가할 수 있는 유연한 구조를 가지고 있습니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVInput>;

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500 font-mono">Size: SM</span>
        <NVInput size="sm" placeholder="Small input..." icon={<Search size={14} />} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500 font-mono">Size: MD (Default)</span>
        <NVInput size="md" placeholder="Medium input..." icon={<Search size={16} />} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500 font-mono">Size: LG</span>
        <NVInput size="lg" placeholder="Large input..." icon={<Search size={18} />} />
      </div>
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <NVInput placeholder="Search..." icon={<Search size={16} />} />
      <NVInput placeholder="Tags..." icon={<Tag size={16} />} />
      <NVInput placeholder="Email address" icon={<Mail size={16} />} />
      <NVInput 
        placeholder="With clear button" 
        icon={<Search size={16} />}
        defaultValue="Searching for something..."
        rightElement={
          <button className="p-1 text-slate-500 hover:text-slate-50">
            <X size={14} />
          </button>
        }
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <NVInput placeholder="Active state" autoFocus />
      <NVInput placeholder="Disabled state" disabled value="Cannot edit this" />
      <NVInput placeholder="Read-only state" readOnly value="Read only content" />
    </div>
  ),
};


