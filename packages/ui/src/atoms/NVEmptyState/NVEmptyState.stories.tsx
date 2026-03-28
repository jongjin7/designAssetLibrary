import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { NVEmptyState } from './index';

const meta: Meta<typeof NVEmptyState> = {
  title: 'Atoms/EmptyState',
  component: NVEmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component:
          '데이터가 비어있거나 특정 상황에서 사용자에게 안내를 제공하는 컴포넌트입니다. `variant` prop으로 케이스에 맞는 고해상도 벡터 일러스트를 제공합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVEmptyState>;

export const NoResults: Story = {
  name: '검색 결과 없음',
  args: {
    variant: 'no-results',
    title: '검색 결과 없음',
    description: '귀하가 찾고 있는 것이 아닙니다. 다른 검색어나 필터를 사용해 보세요.',
  },
};

export const EmptyLibrary: Story = {
  name: '라이브러리 비어있음',
  args: {
    variant: 'empty-library',
    title: '아직 등록된 에셋이 없습니다',
    description: 'PNG, SVG, Figma 등 디자인 에셋을 드래그하거나 버튼으로 업로드하세요.',
  },
};

export const NoFavorites: Story = {
  name: '즐겨찾기 없음',
  args: {
    variant: 'no-favorites',
    title: '즐겨찾기한 에셋이 없습니다',
    description: '에셋 카드의 별표(★)를 눌러 나중에 빠르게 찾을 수 있도록 저장하세요.',
  },
};

export const NoRecent: Story = {
  name: '최근 항목 없음',
  args: {
    variant: 'no-recent',
    title: '최근 사용한 에셋이 없습니다',
    description: '에셋을 열거나 편집하면 이 곳에 자동으로 기록됩니다.',
  },
};

export const Offline: Story = {
  name: '오프라인 상태',
  args: {
    variant: 'offline',
    title: '연결할 수 없습니다',
    description: '인터넷 연결을 확인해 주세요. 로컬에 저장된 에셋은 계속 확인할 수 있습니다.',
  },
};

export const WithAction: Story = {
  name: '액션 버튼 포함',
  render: () => (
    <NVEmptyState
      variant="empty-library"
      title="아직 등록된 에셋이 없습니다"
      description="첫 번째 에셋을 등록하고 라이브러리를 채워보세요."
      action={
        <button className="mt-2 px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 transition-colors">
          에셋 추가
        </button>
      }
    />
  ),
};
