import type { Meta, StoryObj } from '@storybook/react';
import { NVAssetSelectionBar } from './index';
import React from 'react';

import showcaseBg from '../../assets/images/glass_showcase_bg.png';

const meta: Meta<typeof NVAssetSelectionBar> = {
  title: 'Molecules/AssetSelectionBar',
  component: NVAssetSelectionBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '다수의 에셋을 선택했을 때 나타나는 일괄 관리 도구 바입니다. 선택 해제, 이동, 삭제 등의 액션을 제공하며 데스크탑과 모바일 환경을 모두 지원합니다.',
      },
    },
  },
  args: {
    selectedCount: 3,
    onCancel: () => console.log('Cancelled'),
    onMove: () => console.log('Move triggered'),
    onDelete: () => console.log('Delete triggered'),
    className: 'mx-auto w-fit min-w-[400px]',
  },
  decorators: [
    (Story) => (
      <div className="p-20 bg-slate-950 min-h-[400px] w-full relative overflow-hidden flex items-center justify-center rounded-3xl border border-white/5">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${showcaseBg})` }} 
        />
        <div className="relative z-10 w-full flex flex-col items-center">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LightTheme: Story = {
  parameters: {
    docs: {
      description: {
        story: '밝은 테마 환경에 최적화된 고대비 배지와 유리판 스타일입니다.',
      },
    },
  },
  args: {
    theme: 'light',
    selectedCount: 5,
    className: 'w-[420px]',
  },
};

export const DarkTheme: Story = {
  parameters: {
    docs: {
      description: {
        story: '어두운 테마 환경에서 발광하는 배지와 다크 글래스 스타일입니다.',
      },
    },
  },
  args: {
    theme: 'dark',
    selectedCount: 12,
    className: 'w-[420px]',
  },
};

export const Mobile: Story = {
  parameters: {
    docs: {
      description: {
        story: '모바일 환경에서 화면 하단에 플로팅되는 레이아웃입니다. 화면 너비에 맞춰 유연하게 조정됩니다.',
      },
    },
  },
  args: {
    isMobile: true,
    theme: 'dark',
    selectedCount: 8,
    className: 'fixed bottom-12 left-1/2 -translate-x-1/2',
  },
};

export const SingleSelected: Story = {
  parameters: {
    docs: {
      description: {
        story: '에셋이 하나만 선택되었을 때의 간결한 표시 형태입니다.',
      },
    },
  },
  args: {
    selectedCount: 1,
    theme: 'light',
    className: 'w-[360px]',
  },
};
