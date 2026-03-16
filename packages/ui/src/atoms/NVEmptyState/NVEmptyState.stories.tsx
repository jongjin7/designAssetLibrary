import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { NVEmptyState } from './index';
import { Search } from 'lucide-react';

const meta: Meta<typeof NVEmptyState> = {
  title: 'Atoms/NVEmptyState',
  component: NVEmptyState,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVEmptyState>;

export const Default: Story = {
  args: {
    title: '검색 결과가 없습니다.',
  },
};

export const WithDescription: Story = {
  args: {
    title: '즐겨찾기한 에셋이 없습니다.',
    description: '중요한 에셋에 별표를 표시하여 나중에 빠르게 찾아보세요.',
  },
};

export const CustomIcon: Story = {
  render: () => (
    <NVEmptyState 
      icon={<Search size={48} className="text-slate-700" />}
      title="에셋을 찾을 수 없습니다" 
      description="다른 검색어나 필터를 사용해 보세요."
    />
  ),
};
