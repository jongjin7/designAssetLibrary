import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVLoginCard } from './index';

const meta: Meta<typeof NVLoginCard> = {
  title: 'Composition/LoginCard',
  component: NVLoginCard,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: '인증 플로우의 핵심인 로그인 카드 컴포넌트입니다. OAuth 2.0 기반의 진입점과 상태별(로딩, 에러) 피드백을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVLoginCard>;

export const Default: Story = {
  args: {
    isInitialized: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    isInitialized: true,
  },
};

export const WithError: Story = {
  args: {
    error: '유효하지 않은 계정 정보입니다.',
    isInitialized: true,
  },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-12 max-w-[400px]">
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold mb-4 block">Normal State</span>
        <NVLoginCard isInitialized={true} />
      </div>
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold mb-4 block">Loading State</span>
        <NVLoginCard loading={true} isInitialized={true} />
      </div>
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold mb-4 block">Error State</span>
        <NVLoginCard error="서버와의 연결이 원활하지 않습니다." isInitialized={true} />
      </div>
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold mb-4 block">Disabled (Supabase not available)</span>
        <NVLoginCard isInitialized={false} />
      </div>
    </div>
  ),
};
