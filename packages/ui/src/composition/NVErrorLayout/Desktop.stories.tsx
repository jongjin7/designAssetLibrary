import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVErrorLayout } from './index';
import { NVErrorView } from '../../molecules/NVErrorView';
import { RotateCcw } from 'lucide-react';

/**
 * 일렉트론 앱 데스크탑 전용 에러 페이지 스토리입니다.
 */
const meta: Meta<typeof NVErrorLayout> = {
  title: 'Electron/ErrorLayout',
  component: NVErrorLayout,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVErrorLayout>;

/**
 * 일렉트론 오프라인 접속 에러
 */
export const ElectronOffline: Story = {
  render: () => {
    const [retryCount, setRetryCount] = useState(0);

    return (
      <NVErrorLayout 
        statusLabel="Connection Lost" 
        statusColorClass="text-rose-500"
      >
        <NVErrorView
          statusCode="OFFLINE"
          title="서버에 연결할 수 없습니다."
          description="네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요. 문제가 지속될 경우 관리자에게 문의하시기 바랍니다."
          fullScreen={false}
          showBackgroundCode={true}
          primaryAction={{
            label: `연결 다시 시도 ${retryCount > 0 ? `#${retryCount}` : ''}`,
            onClick: () => setRetryCount(prev => prev + 1),
            icon: RotateCcw
          }}
        />
      </NVErrorLayout>
    );
  }
};

/**
 * 일렉트론 404
 */
export const ElectronNotFound: Story = {
  render: () => (
    <NVErrorLayout>
      <NVErrorView
        statusCode="404"
        title="페이지를 찾을 수 없습니다."
        description="요청하신 경로가 데스크탑 애플리케이션 내에 존재하지 않거나 이동되었을 수 있습니다."
        fullScreen={false}
        primaryAction={{
          label: "대시보드로 돌아가기",
          onClick: () => alert('Navigate to dashboard')
        }}
      />
    </NVErrorLayout>
  )
};
