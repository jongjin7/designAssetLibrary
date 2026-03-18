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
  thumbnailGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  palette: ['#6366f1', '#a855f7', '#ec4899'],
};

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '이미지가 없을 경우 파일 이름과 메타데이터에서 추출한 컬러 팔레트를 기반으로 생성된 그래디언트 썸네일을 보여줍니다.',
      },
    },
  },
  args: sampleAsset,
};

export const WithImage: Story = {
  parameters: {
    docs: {
      description: {
        story: '실제 이미지가 존재하는 경우의 모습입니다. 이미지 위에서 파일 이름과 정보가 오버레이됩니다.',
      },
    },
  },
  args: {
    ...sampleAsset,
    fileName: 'premium-watch-design.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
  },
};

export const Selected: Story = {
  parameters: {
    docs: {
      description: {
        story: '카드가 선택된 상태입니다. 사이언 컬러의 테두리와 체크 아이콘이 표시됩니다.',
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
        story: '즐겨찾기(좋아요)가 활성화된 상태입니다. 핑크색 하트 아이콘이 표시됩니다.',
      },
    },
  },
  args: {
    ...sampleAsset,
    isFavorite: true,
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story: '모바일 환경에 최적화된 컴포넌트 형태를 보여줍니다. 스페이스가 좁은 환경에서의 레이아웃을 확인합니다.',
      },
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    ...sampleAsset,
    isMobile: true,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
  },
};

export const GridView: Story = {
  parameters: {
    docs: {
      description: {
        story: '에셋 그리드 내에서의 카드 배치 및 정렬 예시입니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-10 bg-slate-950 w-full min-h-screen">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
           {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
             <NVAssetCard 
               key={i}
               {...sampleAsset} 
               id={`${i}`}
               fileName={`Design-Asset-0${i}.png`}
               isSelected={i === 2}
               isFavorite={i === 4}
             />
           ))}
        </div>
      </div>
    )
  ]
};
