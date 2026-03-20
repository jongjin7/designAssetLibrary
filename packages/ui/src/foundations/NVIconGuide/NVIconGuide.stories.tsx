import type { Meta, StoryObj } from '@storybook/react';
import { NVIconGuide } from './index';
import React from 'react';

const meta: Meta<typeof NVIconGuide> = {
  title: 'Foundations/Iconography System',
  component: NVIconGuide,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'NOVA 디자인 시스템의 아이콘 가이드라인과 크기 규격입니다. Lucide React 아이콘 세트를 기준으로 합니다.',
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
