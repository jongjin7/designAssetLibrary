import type { Meta, StoryObj } from '@storybook/react';
import { NVTagList } from './index';
import React from 'react';

const meta: Meta<typeof NVTagList> = {
  title: 'Molecules/TagList',
  component: NVTagList,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '에셋에 연결된 태그들을 칩(Chip) 형태로 나열하여 표시합니다.',
      },
    },
  },
  args: {
    tags: ['design', 'asset', 'ui-ux', 'mockup', 'frontend'],
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
        story: '기본적인 태그 목록 표시 형태입니다.',
      },
    },
  },
};

export const LongList: Story = {
  parameters: {
    docs: {
      description: {
        story: '태그가 많을 경우 자동으로 다음 줄로 넘어가며 배치됩니다.',
      },
    },
  },
  args: {
    tags: ['react', 'nextjs', 'tailwind', 'storybook', 'lucide', 'framer-motion', 'typescript', 'vite', 'npm', 'pnpm'],
  },
};
