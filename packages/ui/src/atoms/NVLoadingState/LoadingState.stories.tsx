import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ImageIcon, Wand2 } from 'lucide-react';
import { NVLoadingState } from './index';


const meta: Meta<typeof NVLoadingState> = {
  title: 'Atoms/LoadingState',
  component: NVLoadingState,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    fullHeight: { control: 'boolean' },
    mode: {
      control: 'select',
      options: ['loading', 'syncing', 'success', 'error', 'empty'],
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '로딩, 동기화, 성공, 오류, 빈 데이터 등 애플리케이션의 다양한 상태를 일관된 디자인으로 표시하는 컴포넌트입니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVLoadingState>;

export const Default: Story = {
  args: {
    mode: 'loading',
  },
};

export const Syncing: Story = {
  args: {
    mode: 'syncing',
  },
};

export const Success: Story = {
  args: {
    mode: 'success',
  },
};

export const Error: Story = {
  args: {
    mode: 'error',
  },
};

export const Empty: Story = {
  args: {
    mode: 'empty',
  },
};

export const CustomMessage: Story = {
  args: {
    mode: 'loading',
    message: '새로운 에셋을 가공하고 있습니다...',
  },
};

// iconAs: 컴포넌트 레퍼런스 전달 — 모드 색상·size=48 자동 적용
export const CustomIconComponent: Story = {
  render: () => (
    <NVLoadingState mode="syncing" message="에셋을 가져오는 중..." iconAs={ImageIcon} />
  ),
};

// icon: 렌더된 JSX 직접 전달
export const CustomIconNode: Story = {
  render: () => (
    <NVLoadingState mode="loading" message="마법을 부리는 중..." icon={<Wand2 size={48} color="#A78BFA" strokeWidth={1.5} />} />
  ),
};

export const FullHeight: Story = {
  args: {
    message: '페이지 로딩 중',
    fullHeight: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] border border-white/10 rounded-xl overflow-hidden bg-slate-950">
        <Story />
      </div>
    ),
  ],
};
