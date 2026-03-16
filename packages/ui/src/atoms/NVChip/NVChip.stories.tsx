import type { Meta, StoryObj } from '@storybook/react';
import { NVChip } from './index';
import React from 'react';

const meta: Meta<typeof NVChip> = {
  title: 'Atoms/NVChip',
  component: NVChip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVChip>;


export const Sizes: Story = {
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
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <NVChip label="Default State" variant="filter" />
      <NVChip label="Disabled State" variant="filter" disabled />
    </div>
  ),
};

