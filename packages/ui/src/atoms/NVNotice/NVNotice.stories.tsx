import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVNotice } from './index';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info as InfoIcon, 
  AlertTriangle,
  Lightbulb,
  ShieldCheck
} from 'lucide-react';

const meta: Meta<typeof NVNotice> = {
  title: 'Atoms/Notice (Callout)',
  component: NVNotice,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '사용자에게 상태나 피드백을 전달하는 인라인 알림 컴포넌트입니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVNotice>;

export const DefaultInfo: Story = {
  args: {
    variant: 'info',
    children: '새로운 시스템 업데이트가 있습니다. 상세 내용을 확인해 보세요.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: '에셋 최적화가 성공적으로 완료되었습니다.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: '라이브러리 허용 용량의 80%를 사용하고 있습니다.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: '지원하지 않는 파일 형식입니다. (PNG, JPG, SVG만 지원)',
  },
};

export const WithTitle: Story = {
  args: {
    variant: 'error',
    title: '영향 범위 안내',
    children: '영구 삭제 시 팀원들과 공유 중인 모든 에셋 링크가 즉시 만료됩니다. 이 작업은 되돌릴 수 없습니다.',
  },
};

export const CustomIcon: Story = {
  args: {
    variant: 'info',
    icon: <Lightbulb size={16} className="text-indigo-400" />,
    children: '팁: 여러 개의 에셋을 한 번에 선택하려면 Shift 키를 누른 채 클릭하세요.',
  },
};

export const PremiumState: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <NVNotice variant="info" title="시스템 공지" icon={<ShieldCheck size={16} className="text-indigo-400" />}>
        데이터 보안 및 프라이버시 설정이 강화되었습니다. 팀 설정에서 변경된 규정을 확인하세요.
      </NVNotice>
      
      <NVNotice variant="error" title="영향: 링크 만료">
        영구 삭제 시 팀원들과 공유 중인 모든 에셋 링크가 만료됩니다.
      </NVNotice>
    </div>
  ),
};
