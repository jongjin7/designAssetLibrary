import type { Meta, StoryObj } from '@storybook/react';
import { NVAssetCard } from './index';
import React from 'react';

const meta: Meta<typeof NVAssetCard> = {
  title: 'Molecules/NVAssetCard',
  component: NVAssetCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVAssetCard>;

const sampleAsset = {
  id: '1',
  fileName: 'abstract-gradient.png',
  thumbnailGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  palette: ['#667eea', '#764ba2', '#ffffff'],
};

export const Default: Story = {
  args: sampleAsset,
};

export const WithImage: Story = {
  args: {
    ...sampleAsset,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
  },
};

export const Selected: Story = {
  args: {
    ...sampleAsset,
    isSelected: true,
  },
};

export const Compact: Story = {
  args: {
    ...sampleAsset,
    isCompact: true,
  },
};

export const List: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[400px]">
      <NVAssetCard {...sampleAsset} />
      <NVAssetCard {...sampleAsset} fileName="second-asset.jpg" isFavorite />
      <NVAssetCard 
        {...sampleAsset} 
        fileName="image-asset.webp" 
        thumbnail="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400" 
      />
      <NVAssetCard {...sampleAsset} isSelected />
    </div>
  ),
};
