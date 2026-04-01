import type { Meta, StoryObj } from '@storybook/react';
import { NVFolderCard } from './index';
import { NVSectionHeader } from '../../atoms/NVSectionHeader';
import { NVAssetCard } from '../NVAssetCard';
import { NVAssetGrid } from '@ui/composition/NVAssetGrid';

const meta: Meta<typeof NVFolderCard> = {
  title: 'Molecules/FolderCard',
  component: NVFolderCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: '라이브러리의 계층 구조를 시각화하는 폴더 카드입니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVFolderCard>;

// 1. 썸네일 3개 (Full/Default)
export const ThreeThumbnails: Story = {
  parameters: {
    docs: {
      description: {
        story: '가장 이상적인 3분할 세로 슬라이스 레이아웃입니다.',
      },
    },
  },
  args: {
    id: 'f1',
    name: '디자인 포스터',
    assetCount: 387,
    assetThumbnails: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
    ],
  },
  render: (args) => (
    <div className="w-[300px]">
      <NVFolderCard {...args} />
    </div>
  ),
};

// 2. 썸네일 2개
export const TwoThumbnails: Story = {
  parameters: {
    docs: {
      description: {
        story: '썸네일이 2개일 경우, 50:50 비율로 영역을 분할하여 보여줍니다.',
      },
    },
  },
  args: {
    id: 'f2',
    name: '그래픽 리서치',
    assetCount: 12,
    assetThumbnails: [
      'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800'
    ],
  },
  render: (args) => (
    <div className="w-[300px]">
      <NVFolderCard {...args} />
    </div>
  ),
};

// 3. 썸네일 1개
export const OneThumbnail: Story = {
  parameters: {
    docs: {
      description: {
        story: '썸네일이 1개일 경우, 단일 이미지가 전체 영역을 가득 채웁니다.',
      },
    },
  },
  args: {
    id: 'f3',
    name: '단일 에셋 폴더',
    assetCount: 1,
    assetThumbnails: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800'
    ],
  },
  render: (args) => (
    <div className="w-[300px]">
      <NVFolderCard {...args} />
    </div>
  ),
};

// 4. 비어있는 폴더
export const Empty: Story = {
  parameters: {
    docs: {
      description: {
        story: '내부에 에셋이 없는 초기 폴더 상태입니다.',
      },
    },
  },
  args: {
    id: 'f4',
    name: '새 컬렉션',
    assetCount: 0,
    assetThumbnails: [],
  },
  render: (args) => (
    <div className="w-[300px]">
      <NVFolderCard {...args} />
    </div>
  ),
};

// 5. 매우 긴 폴더명 (말줄임표 확인)
export const LongName: Story = {
  parameters: {
    docs: {
      description: {
        story: '폴더명이 길어질 경우, 하단 메타데이터 영역에서 부드럽게 말줄임표 처리가 됩니다.',
      },
    },
  },
  args: {
    id: 'f5',
    name: '디자인 시스템 라이브러리 및 프로젝트 자산 관리 폴더입니다 - 매우 긴 이름 테스트',
    assetCount: 1024,
    assetThumbnails: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=800'
    ],
  },
  render: (args) => (
    <div className="w-[300px]">
      <NVFolderCard {...args} />
    </div>
  ),
};

// 6. 모바일 뷰
export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story: '모바일 환경에서 사용되는 카드 형태입니다.',
      },
    },
  },
  args: {
    id: 'fm',
    name: '모바일 앨범',
    assetCount: 24,
    assetThumbnails: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800'
    ],
    isMobile: true,
  },
  render: (args) => (
    <div className="w-[180px]">
      <NVFolderCard {...args} />
    </div>
  ),
};

// 7. 복합 레이아웃 스토리 (레퍼런스 이미지 재현)
export const FullLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: '하위 폴더와 에셋 목록이 함께 배치된 실제 라이브러리 인터페이스 시뮬레이션입니다.',
      },
    },
  },
  render: () => (
    <div className="w-[1000px] h-[800px] overflow-auto bg-[#0A0C13] p-10 font-sans">
      <NVSectionHeader title="하위 폴더" count={1} hasDropdown={true} />
      <div className="grid grid-cols-4 gap-6 mt-6 mb-16">
        <NVFolderCard 
          id="f1" 
          name="첫번째" 
          assetCount={2} 
          assetThumbnails={[
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', 
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
          ]} 
        />
        {/* 그리드 정렬을 위한 빈 슬롯들 */}
        <div className="aspect-[3/2] rounded-xl bg-white/[0.02]" />
        <div className="aspect-[3/2] rounded-xl bg-white/[0.02]" />
        <div className="aspect-[3/2] rounded-xl bg-white/[0.02]" />
      </div>

      {/* 2.2 목차 섹션 */}
      <NVSectionHeader title="목차" count={2} />
      <NVAssetGrid className="mt-6">
        <NVAssetCard 
          id="a1" 
          fileName="롱 버전_네이비" 
          thumbnail="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800" 
          palette={["#1e293b", "#334155"]}
        />
        <NVAssetCard 
          id="a2" 
          fileName="매일 입고 싶은 모던 데일리룩" 
          thumbnail="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" 
          palette={["#f8fafc", "#cbd5e1"]}
        />
        {/* Placeholder assets */}
        <div className="aspect-square rounded-lg bg-white/[0.02]" />
        <div className="aspect-square rounded-lg bg-white/[0.02]" />
      </NVAssetGrid>
    </div>
  )
};
