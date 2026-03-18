import type { Meta, StoryObj } from '@storybook/react';
import { NVChip } from './index';
import React from 'react';

const meta: Meta<typeof NVChip> = {
  title: 'Atoms/Chip',
  component: NVChip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '필터, 태그, 상태 표시 등에 사용되는 소형 레이블 컴포넌트입니다. 클릭 가능한 인터랙션을 지원하며 다양한 크기와 변형을 제공합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVChip>;


export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm(작게)와 md(기본) 두 가지 크기를 지원합니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <NVChip label="Small Chip" size="sm" variant="filter" />
      <NVChip label="Medium Chip" size="md" variant="filter" />
      <NVChip label="Active Small" size="sm" variant="filter" isActive />
      <NVChip label="Active Medium" size="md" variant="filter" isActive />
    </div>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: 'filter(필터링 버튼), tag(에셋 설명), status(상태 표시) 변형을 제공합니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <NVChip label="Filter Variant" variant="filter" />
      <NVChip label="Tag Variant" variant="tag" />
      <NVChip label="Status Variant" variant="status" />
      <NVChip label="Active Filter" variant="filter" isActive />
    </div>
  ),
};

export const States: Story = {
  parameters: {
    docs: {
      description: {
        story: '활성, 비활성 등의 상태를 시각화합니다.',
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <NVChip label="Default State" variant="filter" />
      <NVChip label="Disabled State" variant="filter" disabled />
    </div>
  ),
};

