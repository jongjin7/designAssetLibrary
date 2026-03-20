import type { Meta, StoryObj } from '@storybook/react';
import { NVSpacingGuide } from './index';
import React from 'react';

const meta: Meta<typeof NVSpacingGuide> = {
  title: 'Foundations/Spacing & Radius',
  component: NVSpacingGuide,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'NOVA 디자인 시스템에서 정의된 간격(Spacing)과 외곽 곡률(Corner Radius) 가이드입니다.',
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
