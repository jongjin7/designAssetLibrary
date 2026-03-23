import type { Meta, StoryObj } from '@storybook/react';
import { NVAssetCard } from './index';
import React from 'react';

const meta: Meta<typeof NVAssetCard> = {
  title: 'Molecules/AssetCard',
  component: NVAssetCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '라이브러리의 핵심 요소인 에셋 카드입니다. 디자인 이미지, 메타데이터, 선택 및 즐겨찾기 상태를 글래스모피즘 스타일로 시각화합니다.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="p-20 bg-slate-950 min-h-[400px] flex items-center justify-center">
        <div className="w-[300px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NVAssetCard>;

const sampleAsset = {
  id: '1',
  fileName: 'abstract-gradient-mesh.png',
  thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
  thumbnailGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  palette: ['#6366f1', '#a855f7', '#ec4899'],
};

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '기본적인 에셋 카드의 모습입니다. 고해상도 이미지와 파일명, 컬러 팔레트가 조화롭게 표시됩니다.',
      },
    },
  },
  args: {
    ...sampleAsset,
    fileName: 'premium-watch-design.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
  },
};

export const Skeleton: Story = {
  parameters: {
    docs: {
      description: {
        story: '이미지가 로드되기 전의 스켈레톤 상태입니다. 회색 톤의 Shimmer 애니메이션이 적용되어 로딩 중임을 나타냅니다.',
      },
    },
  },
  args: {
    ...sampleAsset,
    thumbnail: '', // 데이터는 있으나 이미지가 아직 로드되지 않은 상황 시뮬레이션
    thumbnailGradient: '',
    isLoading: true,
  },
};

export const LoadFailed: Story = {
  parameters: {
    docs: {
      description: {
        story: '네트워크 에러나 잘못된 경로로 인해 이미지 로드에 실패했을 때 나타나는 NOVA 서비스 로고 이미지입니다.',
      },
    },
  },
  args: {
    ...sampleAsset,
    thumbnail: 'https://invalid-image-url.com/error.jpg',
    fileName: 'broken-image-link.png',
  },
};

export const Selected: Story = {
  parameters: {
    docs: {
      description: {
        story: '카드가 선택된 상태입니다. 인디고 컬러의 테두리와 체크 아이콘이 시각적 피드백을 제공합니다.',
      },
    },
  },
  args: {
    ...sampleAsset,
    isSelected: true,
  },
};

export const Favorite: Story = {
  parameters: {
    docs: {
      description: {
        story: '즐겨찾기(별표)가 활성화된 상태입니다. 프리미엄 인디고 컬러의 별 아이콘이 표시됩니다.',
      },
    },
  },
  args: {
    ...sampleAsset,
    isFavorite: true,
  },
};



