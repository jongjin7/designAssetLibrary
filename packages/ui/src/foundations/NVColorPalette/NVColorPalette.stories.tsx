import type { Meta, StoryObj } from '@storybook/react';
import { NVColorPalette } from './index';
import React from 'react';

const meta: Meta<typeof NVColorPalette> = {
  title: 'Foundations/ColorPalette',
  component: NVColorPalette,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'NOVA 디자인 시스템에서 정의된 전체 컬러 셋을 보여주는 파운데이션 컴포넌트입니다. 본 색상은 Tailwind v4 변수를 통해 제어됩니다.',
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
