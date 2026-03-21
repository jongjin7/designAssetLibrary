import type { Meta, StoryObj } from '@storybook/react';
import { NVAssetGrid } from './index';
import { NVAssetCard } from '../../molecules/NVAssetCard';
import React from 'react';

const meta: Meta<typeof NVAssetGrid> = {
  title: 'Composition/AssetGrid',
  component: NVAssetGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '에셋 카드들을 반응형 그리드 레이아웃으로 배치하는 컨테이너 컴포넌트입니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVAssetGrid>;

const sampleAssets = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i}`,
  fileName: `asset-${i + 1}.png`,
  thumbnailGradient: `linear-gradient(${45 * i}deg, #667eea 0%, #764ba2 100%)`,
  palette: ['#667eea', '#764ba2', '#ffffff'],
}));

export const Default: Story = {
  render: () => (
    <NVAssetGrid>
      {sampleAssets.map(asset => (
        <NVAssetCard key={asset.id} {...asset} />
      ))}
    </NVAssetGrid>
  ),
};
