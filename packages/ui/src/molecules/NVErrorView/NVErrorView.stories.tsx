import type { Meta, StoryObj } from '@storybook/react';
import { NVErrorView } from './NVErrorView';
import { RotateCcw, Home, Search, Layers } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof NVErrorView> = {
  title: 'Molecules/ErrorView',
  component: NVErrorView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVErrorView>;

export const NotFound: Story = {
  args: {
    statusCode: 404,
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 페이지가 존재하지 않거나 현재 접근 불가능한 상태입니다.',
    primaryAction: {
      label: '홈으로 이동',
      onClick: () => alert('Go Home'),
      icon: Home,
    },
    secondaryAction: {
      label: '이전 화면',
      onClick: () => window.history.back(),
      icon: Search,
    },
  },
};

export const SystemError: Story = {
  args: {
    statusCode: 500,
    title: '시스템 오류가 발생했습니다',
    description: '애플리케이션 구동 중 예기치 않은 데이터 충돌이 발생했습니다.',
    variant: "default",
    primaryAction: {
      label: '다시 시도',
      onClick: () => alert('Retry'),
      icon: RotateCcw,
    },
    secondaryAction: {
      label: '홈으로 이동',
      onClick: () => alert('Home'),
      icon: Home,
    },
  },
};

export const Offline: Story = {
  args: {
    statusCode: 'Offline',
    title: '서버에 연결할 수 없습니다',
    description: '네트워크 상태를 확인하거나 라이브러리 서버가 정상적으로 구동되고 있는지 확인해 주세요.',
    primaryAction: {
      label: '연결 확인',
      onClick: () => alert('Check'),
      icon: RotateCcw,
    },
    footer: (
      <div className="mt-16 flex items-center justify-center gap-8 opacity-20">
        <div className="flex items-center gap-2.5">
          <Layers className="w-4 h-4" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase">Nova System Diagnostics</span>
        </div>
      </div>
    ),
  },
};
