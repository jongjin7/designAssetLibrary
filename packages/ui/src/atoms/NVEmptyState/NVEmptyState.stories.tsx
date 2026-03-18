import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { NVEmptyState } from './index';
import { Search } from 'lucide-react';

const meta: Meta<typeof NVEmptyState> = {
  title: 'Atoms/EmptyState',
  component: NVEmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '검색 결과가 없거나 데이터가 비어있는 상태를 사용자에게 안내하는 컴포넌트입니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVEmptyState>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '제목만 있는 기본 상태입니다.',
      },
    },
  },
  args: {
    title: '검색 결과가 없습니다.',
  },
};

export const WithDescription: Story = {
  parameters: {
    docs: {
      description: {
        story: '제목과 보조 설명을 함께 표시합니다.',
      },
    },
  },
  args: {
    title: '즐겨찾기한 에셋이 없습니다.',
    description: '중요한 에셋에 별표를 표시하여 나중에 빠르게 찾아보세요.',
  },
};

export const CustomIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: '기본 아이콘 대신 특정 액션에 맞는 아이콘을 직접 전달할 수 있습니다.',
      },
    },
  },
  render: () => (
    <NVEmptyState 
      icon={<Search size={48} className="text-slate-700" />}
      title="에셋을 찾을 수 없습니다" 
      description="다른 검색어나 필터를 사용해 보세요."
    />
  ),
};
