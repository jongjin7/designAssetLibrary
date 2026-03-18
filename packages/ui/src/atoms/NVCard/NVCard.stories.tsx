import type { Meta, StoryObj } from '@storybook/react';
import { NVCard } from './index';
import React from 'react';

const meta: Meta<typeof NVCard> = {
  title: 'Atoms/Card',
  component: NVCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '디자인 시스템의 기본 컨테이너로, 반투명한 글래스모피즘 효과와 테마별 최적화된 배경색을 제공합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVCard>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: '기본적인 글래스모피즘 카드 형태입니다. 마우스 호버 시 미세하게 확대되는 인터랙션이 포함되어 있습니다.',
      },
    },
  },
  args: {
    children: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Card Title</h3>
        <p className="text-slate-400">This is a premium glassmorphic card component used for assets and sections.</p>
      </div>
    ),
  },
};

export const WithoutHover: Story = {
  parameters: {
    docs: {
      description: {
        story: '호버 효과가 필요 없는 경우 hoverEffect={false} 속성을 사용합니다.',
      },
    },
  },
  args: {
    hoverEffect: false,
    children: 'No hover scaling effect.',
  },
};
