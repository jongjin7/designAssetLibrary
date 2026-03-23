import type { Meta, StoryObj } from '@storybook/react';
import { NVAssetGrid } from './index';
import { NVAssetCard } from '../../molecules/NVAssetCard';
import React from 'react';

const meta: Meta<typeof NVAssetGrid> = {
  title: 'Composition/AssetGrid',
  component: NVAssetGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '에셋 카드들을 반응형 그리드 레이아웃으로 배치하는 컨테이너 컴포넌트입니다. 상위에서 전달된 zoom 값에 따라 열 너비를 동적으로 조절합니다.',
      },
    },
  },
  argTypes: {
    zoom: { 
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '그리드 너비 조절 (0: 촘촘함, 100: 크게)',
    },
    isMobile: { 
      control: 'boolean',
      description: '모바일 환경 시뮬레이션 (너비 계산 공식 변경)',
    },
  },
  args: {
    zoom: 50,
    isMobile: false,
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-950 min-h-screen p-6 overflow-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NVAssetGrid>;

const mockAssets = [
  { id: '1', fileName: 'Abstract-Loading.png', thumbnail: '', palette: ['#1e293b'] },
  { id: '2', fileName: 'Selected-Asset.jpg', thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800', isSelected: true, palette: ['#6366f1', '#a855f7'] },
  { id: '3', fileName: 'Broken-Link.png', thumbnail: 'https://invalid-host/img.jpg', palette: ['#f43f5e'] },
  { id: '4', fileName: 'Favorite-Star.webp', thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800', isFavorite: true, palette: ['#10b981', '#3b82f6'] },
  { id: '5', fileName: 'Product-Design.jpg', thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', palette: ['#fbbf24'] },
  { id: '6', fileName: 'Modern-UI-Concept.png', thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800', palette: ['#38bdf8'] },
  { id: '7', fileName: 'Loading-2.png', thumbnail: '', palette: ['#0f172a'] },
  { id: '8', fileName: 'City-Scape.jpg', thumbnail: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800', isSelected: false, palette: ['#94a3b8'] },
];

export const Default: Story = {
  render: (args) => (
    <NVAssetGrid {...args}>
      {mockAssets.map(asset => (
        <NVAssetCard 
          key={asset.id} 
          {...asset} 
          isMobile={args.isMobile}
        />
      ))}
      {/* Fill more to test grid overflow */}
      {Array.from({ length: 12 }).map((_, i) => (
        <NVAssetCard 
          key={`fill-${i}`}
          id={`fill-${i}`}
          fileName={`Asset-Fill-${i+1}.png`}
          thumbnail={`https://picsum.photos/seed/${i+100}/400/400`}
          palette={['#334155', '#475569']}
          isMobile={args.isMobile}
        />
      ))}
    </NVAssetGrid>
  ),
};
