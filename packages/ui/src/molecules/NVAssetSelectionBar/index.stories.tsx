import type { Meta, StoryObj } from '@storybook/react';
import { NVAssetSelectionBar } from './index';
import React from 'react';

const meta: Meta<typeof NVAssetSelectionBar> = {
  title: 'Molecules/NVAssetSelectionBar',
  component: NVAssetSelectionBar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    selectedCount: 3,
    onCancel: () => console.log('Cancelled'),
    onMove: () => console.log('Move triggered'),
    onDelete: () => console.log('Delete triggered'),
  },
  decorators: [
    (Story) => (
      <div className="p-10 bg-slate-950 min-h-[300px] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-rose-900/20 opacity-50" />
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LightTheme: Story = {
  args: {
    theme: 'light',
    selectedCount: 5,
  },
};

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
    selectedCount: 12,
  },
};

export const Mobile: Story = {
  args: {
    isMobile: true,
    theme: 'light',
  },
};

export const SingleSelected: Story = {
  args: {
    selectedCount: 1,
    theme: 'light',
  },
};
