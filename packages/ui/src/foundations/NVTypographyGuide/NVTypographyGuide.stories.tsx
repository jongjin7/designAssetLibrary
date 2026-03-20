import type { Meta, StoryObj } from '@storybook/react';
import { NVTypographyGuide } from './index';
import React from 'react';

const meta: Meta<typeof NVTypographyGuide> = {
  title: 'Foundations/TypographyGuide',
  component: NVTypographyGuide,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'NOVA 프로젝트에서 정의한 타이포그래피 계층 구조와 시각적 스타일 가이드입니다. Pretendard Variable 폰트를 기반으로 합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-slate-950 min-h-screen">
        <div className="max-w-[1000px] mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
