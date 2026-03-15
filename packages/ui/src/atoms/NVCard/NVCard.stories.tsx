import type { Meta, StoryObj } from '@storybook/react';
import { NVCard } from './index';
import React from 'react';

const meta: Meta<typeof NVCard> = {
  title: 'Atoms/NVCard',
  component: NVCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVCard>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Card Title</h3>
        <p className="text-nv-text-secondary">This is a premium glassmorphic card component used for assets and sections.</p>
      </div>
    ),
  },
};

export const WithoutHover: Story = {
  args: {
    hoverEffect: false,
    children: 'No hover scaling effect.',
  },
};
