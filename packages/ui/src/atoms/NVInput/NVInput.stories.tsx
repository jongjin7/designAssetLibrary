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
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVInput>;

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'xs(24px)부터 xl(52px)까지의 5가지 표준 크기를 지원합니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-6 w-[400px]">
      <NVInput size="xs" placeholder="X-Small (24px)" />
      <NVInput size="sm" placeholder="Small (28px)" />
      <NVInput size="md" placeholder="Medium (36px)" />
      <NVInput size="lg" placeholder="Large (44px)" />
      <NVInput size="xl" placeholder="X-Large (52px)" />
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
