import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { 
  NVEmptyState, 
  NVEmptyLibraryState, 
  NVNoResultsState, 
  NVNoFavoritesState, 
  NVNoRecentState, 
  NVOfflineState 
} from './index';

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
          '데이터가 비어있거나 특정 상황에서 사용자에게 안내를 제공하는 컴포넌트입니다. `variant` prop으로 케이스에 맞는 일러스트를 제공하며, 빈번하게 사용되는 상황(라이브러리 비음, 결과 없음 등)은 전용 프리셋 컴포넌트로도 제공됩니다.',
      },
    },
  },
};

export default meta;

export const Base: StoryObj<typeof NVEmptyState> = {
  name: '기본 (커스텀)',
  args: {
    variant: 'custom',
    title: '데이터가 없습니다',
    description: '이 섹션에 표시할 데이터가 아직 등록되지 않았습니다.',
  },
};

// ─── Registered Presets ───────────────────────────────────────────────────────

export const PresetEmptyLibrary: StoryObj = {
  name: '프리셋: 라이브러리 비어있음',
  render: () => <NVEmptyLibraryState />,
};

export const PresetNoResults: StoryObj = {
  name: '프리셋: 검색 결과 없음',
  render: () => <NVNoResultsState query="검색어" />,
};

export const PresetNoFavorites: StoryObj = {
  name: '프리셋: 즐겨찾기 없음',
  render: () => <NVNoFavoritesState />,
};

export const PresetNoRecent: StoryObj = {
  name: '프리셋: 최근 항목 없음',
  render: () => <NVNoRecentState />,
};

export const PresetOffline: StoryObj = {
  name: '프리셋: 오프라인',
  render: () => <NVOfflineState />,
};

export const WithAction: StoryObj = {
  name: '액션 버튼 포함 (커스텀)',
  render: () => (
    <NVEmptyLibraryState
      action={
        <button className="mt-2 px-5 py-2 text-sm font-semibold rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 transition-colors">
          에셋 추가
        </button>
      }
    />
  ),
};
