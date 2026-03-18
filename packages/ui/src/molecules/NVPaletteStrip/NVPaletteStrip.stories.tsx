import type { Meta, StoryObj } from '@storybook/react';
import { NVPaletteStrip } from './index';
import React from 'react';

const meta: Meta<typeof NVPaletteStrip> = {
  title: 'Molecules/PaletteStrip',
  component: NVPaletteStrip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '에셋에서 추출된 컬러 팔레트를 가로 스트립 형태로 표시합니다. 각 색상은 클릭 시 복사할 수 있으며, AI 정제 여부를 나타내는 배지를 포함할 수 있습니다.',
      },
    },
  },
  args: {
    colors: ['#6366F1', '#06B6D4', '#F8FAFC', '#10B981', '#F59E0B'],
    onColorCopy: (c) => console.log(`Copied ${c}`),
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] p-10 bg-slate-950 rounded-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '기본적인 컬러 팔레트 표시 형태입니다.',
      },
    },
  },
};

export const AIRefined: Story = {
  parameters: {
    docs: {
      description: {
        story: 'AI로 정제된 컬러임을 나타내는 배지가 활성화된 상태입니다.',
      },
    },
  },
  args: {
    isAiRefined: true,
  },
};
