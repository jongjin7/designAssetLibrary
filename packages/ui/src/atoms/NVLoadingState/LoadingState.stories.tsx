import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVLoadingState } from './index';

const meta: Meta<typeof NVLoadingState> = {
  title: 'Atoms/NVLoadingState',
  component: NVLoadingState,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    fullHeight: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof NVLoadingState>;

export const Default: Story = {
  args: {
    message: '자산을 불러오는 중...',
  },
};

export const CustomMessage: Story = {
  args: {
    message: '데이터를 동기화하고 있습니다...',
  },
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
