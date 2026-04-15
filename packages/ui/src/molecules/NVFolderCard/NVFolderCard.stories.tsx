import type { Meta, StoryObj } from '@storybook/react';
import { MoreVertical } from 'lucide-react';
import { NVFolderCard } from './index';
import { NVSectionHeader } from '../../atoms/NVSectionHeader';
import { NVAssetCard } from '../NVAssetCard';
import { NVAssetGrid } from '@ui/composition/NVAssetGrid';
import { NVIconButton } from '../../atoms/NVIconButton';

const meta: Meta<typeof NVFolderCard> = {
  title: 'Molecules/FolderCard',
  component: NVFolderCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: '라이브러리의 계층 구조를 시각화하는 폴더 카드입니다. 하위 폴더 여부(hasSubfolders)와 추가 메뉴(moreMenu) 기능을 지원합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVFolderCard>;

// 1. 기본 레이아웃 (3개 썸네일)
export const Default: Story = {
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

// 2. 계층 구조 폴더
export const Hierarchical: Story = {
  args: {
    id: 'f-h',
    name: '2024 프로젝트 아카이브',
    assetCount: 154,
    hasSubfolders: true,
    assetThumbnails: [
      'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800'
    ],
  },
  render: (args) => (
    <div className="w-[300px]">
      <NVFolderCard {...args} />
    </div>
  ),
};

// 3. 추가 메뉴 포함 (More Menu)
export const WithMoreMenu: Story = {
  args: {
    id: 'f-m',
    name: '워크스페이스 B',
    assetCount: 42,
    assetThumbnails: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800'
    ],
    moreMenu: (
      <NVIconButton icon={MoreVertical} variant="ghost" size="sm" className="text-white/70 hover:text-white" />
    ),
  },
  render: (args) => (
    <div className="w-[300px]">
      <NVFolderCard {...args} />
    </div>
  ),
};

// 4. 비어있는 계층 폴더
export const EmptyHierarchical: Story = {
  args: {
    id: 'f-eh',
    name: '빈 프로젝트 그룹',
    assetCount: 0,
    hasSubfolders: true,
    assetThumbnails: [],
  },
  render: (args) => (
    <div className="w-[300px]">
      <NVFolderCard {...args} />
    </div>
  ),
};

// 5. 모바일 뷰
export const Mobile: Story = {
  args: {
    id: 'fm',
    name: '최근 캡처',
    assetCount: 8,
    assetThumbnails: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800'
    ],
    isMobile: true,
    moreMenu: (
      <NVIconButton icon={MoreVertical} variant="ghost" size="sm" className="text-white/70" />
    ),
  },
  render: (args) => (
    <div className="w-[180px]">
      <NVFolderCard {...args} />
    </div>
  ),
};

// 6. 복합 레이아웃 (실제 사용 예시)
export const FullLayout: Story = {
  render: () => (
    <div className="w-[1000px] h-[800px] overflow-auto bg-[#0A0C13] p-10 font-sans text-white">
      <NVSectionHeader title="하위 폴더" count={2} hasDropdown={true} />
      <div className="grid grid-cols-4 gap-6 mt-6 mb-16">
        <NVFolderCard 
          id="f1" 
          name="디자인 에셋 (계층)" 
          assetCount={124} 
          hasSubfolders={true}
          assetThumbnails={[
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', 
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
          ]} 
        />
        <NVFolderCard 
          id="f2" 
          name="운영 데이터" 
          assetCount={56} 
          assetThumbnails={[
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
          ]} 
          moreMenu={
            <NVIconButton icon={MoreVertical} variant="ghost" size="sm" className="text-white/40 hover:text-white" />
          }
        />
        <div className="aspect-[3/2] rounded-xl bg-white/[0.02]" />
        <div className="aspect-[3/2] rounded-xl bg-white/[0.02]" />
      </div>

      <NVSectionHeader title="목차" count={2} />
      <NVAssetGrid className="mt-6">
        <NVAssetCard 
          id="a1" 
          fileName="Brand Guidelines" 
          thumbnail="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800" 
          palette={["#1e293b", "#334155"]}
        />
        <NVAssetCard 
          id="a2" 
          fileName="Winter Collection" 
          thumbnail="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800" 
          palette={["#f8fafc", "#cbd5e1"]}
        />
        <div className="aspect-square rounded-lg bg-white/[0.02]" />
        <div className="aspect-square rounded-lg bg-white/[0.02]" />
      </NVAssetGrid>
    </div>
  )
};
