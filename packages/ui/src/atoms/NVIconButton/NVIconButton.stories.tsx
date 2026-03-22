import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { NVIconButton } from './index';
import { Menu, Star, Search, Settings, X, Plus } from 'lucide-react';

const meta: Meta<typeof NVIconButton> = {
  title: 'Atoms/IconButton',
  component: NVIconButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '원형 또는 정사각 형태의 버튼 내부에 아이콘만 표시하는 컴포넌트입니다. 툴바, 닫기 버튼, 부가 액션 등에 사용됩니다.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'vivid', 'danger', 'ghost', 'glass', 'glass-primary'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVIconButton>;

export const Default: Story = {
  args: {
    icon: Menu,
    variant: 'secondary',
    size: 'md',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <NVIconButton icon={Search} variant="primary" title="Primary" />
      <NVIconButton icon={Menu} variant="secondary" title="Secondary" />
      <NVIconButton icon={Plus} variant="vivid" title="Vivid" />
      <NVIconButton icon={Settings} variant="glass-primary" title="Glass Primary" />
      <NVIconButton icon={Settings} variant="glass" title="Glass" />
      <NVIconButton icon={X} variant="danger" title="Danger" />
      <NVIconButton icon={Star} variant="ghost" title="Ghost" />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'xs(24px)부터 xl(52px)까지의 5가지 표준 크기를 지원합니다.',
      },
    },
  },
  render: () => (
    <div className="flex items-end gap-4">
      <NVIconButton icon={Search} size="xs" variant="primary" title="X-Small (24px)" />
      <NVIconButton icon={Search} size="sm" variant="primary" title="Small (28px)" />
      <NVIconButton icon={Search} size="md" variant="primary" title="Medium (36px)" />
      <NVIconButton icon={Search} size="lg" variant="primary" title="Large (44px)" />
      <NVIconButton icon={Search} size="xl" variant="primary" title="X-Large (52px)" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <NVIconButton icon={Search} variant="primary" />
      <NVIconButton icon={Search} variant="primary" disabled />
      <NVIconButton icon={Search} variant="secondary" className="animate-pulse" />
    </div>
  ),
};
