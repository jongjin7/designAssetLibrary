import type { Meta, StoryObj } from '@storybook/react';
import { NVToastProvider, useToast, NVToastItem } from './index';
import React from 'react';
import { NVButton } from '../NVButton';

const ToastDemo = () => {
  const { toast } = useToast();
  return (
    <div className="p-10 flex flex-wrap gap-4 items-center justify-center">
      <NVButton 
        variant="secondary"
        onClick={() => toast('정보 메시지입니다. 시스템 상태를 확인하세요.', { type: 'info' })}
      >
        Show Info Toast
      </NVButton>
      
      <NVButton 
        variant="primary"
        className="bg-emerald-600 hover:bg-emerald-500 text-white border-none"
        onClick={() => toast('에셋이 성공적으로 저장되었습니다.', { type: 'success' })}
      >
        Show Success Toast
      </NVButton>
      
      <NVButton 
        variant="primary"
        className="bg-rose-600 hover:bg-rose-500 text-white border-none"
        onClick={() => toast('서버 연결에 실패했습니다. 다시 시도해주세요.', { type: 'error' })}
      >
        Show Error Toast
      </NVButton>
    </div>
  );
};

import showcaseBg from '../../assets/images/glass_showcase_bg.png';

const meta: Meta = {
  title: 'Atoms/Toast',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '사용자에게 즉각적인 피드백을 제공하는 프리미엄 토스트 시스템입니다. NVToastProvider로 앱을 감싸고 useToast 훅을 사용하여 호출합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="bg-slate-950 min-h-[400px] w-[800px] relative overflow-hidden flex items-center justify-center p-20 rounded-[40px] border border-white/5">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: `url(${showcaseBg})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-30" />
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          <NVToastProvider>
            <Story />
          </NVToastProvider>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 사용법 데모입니다. 하단 버튼을 클릭하여 실제 토스트가 나타나는 애니메이션을 확인할 수 있습니다.
 */
export const Default: Story = {
  render: () => <ToastDemo />,
};

/**
 * 1. Variants: 다양한 테마별 시각적 변형을 확인합니다.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-[400px]">
      <NVToastItem toast={{ id: 'v1', message: '데이터를 성공적으로 불러왔습니다.', type: 'success' }} onClose={() => {}} />
      <NVToastItem toast={{ id: 'v2', message: '새로운 버전의 앱을 사용할 수 있습니다.', type: 'info' }} onClose={() => {}} />
      <NVToastItem toast={{ id: 'v3', message: '네트워크 연결이 불안정합니다.', type: 'error' }} onClose={() => {}} />
    </div>
  )
};

/**
 * 2. Sizes: 컨텐츠 양과 중요도에 따라 3가지 사이즈를 제공합니다.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-center w-full max-w-[600px]">
      <div className="w-full flex flex-col items-center gap-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Small (sm)</span>
        <NVToastItem toast={{ id: 's1', message: '짧은 알림 메시지', size: 'sm' }} onClose={() => {}} />
      </div>
      <div className="w-full flex flex-col items-center gap-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Medium (md - Default)</span>
        <NVToastItem toast={{ id: 's2', message: '표준적인 길이의 알림 메시지입니다.', size: 'md' }} onClose={() => {}} />
      </div>
      <div className="w-full flex flex-col items-center gap-2">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Large (lg)</span>
        <NVToastItem toast={{ id: 's3', message: '중요도가 높거나 내용이 긴 경우에 사용하는 넓은 폭의 토스트입니다.', size: 'lg' }} onClose={() => {}} />
      </div>
    </div>
  )
};

/**
 * 3. States: 지속 시간(Duration) 및 상호작용 관련 상태입니다.
 */
export const States: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <div className="flex flex-row gap-4">
        <NVButton variant="secondary" onClick={() => toast('수동으로 닫기 전까지 유지됩니다.', { duration: Infinity })}>
          Persistent Toast
        </NVButton>
        <NVButton variant="secondary" onClick={() => toast('1초 만에 사라집니다.', { duration: 1000 })}>
          Short Duration
        </NVButton>
      </div>
    );
  }
};

