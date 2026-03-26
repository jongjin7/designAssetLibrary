import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVTypography } from './index';

const meta: Meta<typeof NVTypography> = {
  title: 'Atoms/Typography',
  component: NVTypography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '디자인 시스템의 타이포그래피 표준을 정의하는 컴포넌트입니다. 시맨틱 태그 지원과 6가지 표준 변형(variant)을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVTypography>;

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold mb-2 block">Hero (h1)</span>
        <NVTypography variant="hero">The Future of Design Assets</NVTypography>
      </div>
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold mb-2 block">Header (h2)</span>
        <NVTypography variant="header">Dashboard Overview</NVTypography>
      </div>
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold mb-2 block">Body (p)</span>
        <NVTypography variant="body">
          This is the standard body text used across the application. It is designed for readability and clarity.
        </NVTypography>
      </div>
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold mb-2 block">Secondary (p)</span>
        <NVTypography variant="secondary">
          Secondary text is used for less important information or descriptions.
        </NVTypography>
      </div>
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold mb-2 block">Label (label)</span>
        <NVTypography variant="label">Email Address</NVTypography>
      </div>
      <div>
        <span className="text-slate-500 text-[10px] uppercase font-bold mb-2 block">Caption (span)</span>
        <NVTypography variant="caption">Last synced 2 minutes ago</NVTypography>
      </div>
    </div>
  ),
};

export const SemanticTags: Story = {
  render: () => (
    <div className="space-y-4">
      <NVTypography as="h3" variant="header">Rendered as H3</NVTypography>
      <NVTypography as="span" variant="body">Rendered as Span</NVTypography>
      <NVTypography as="div" variant="secondary">Rendered as Div</NVTypography>
    </div>
  ),
};
