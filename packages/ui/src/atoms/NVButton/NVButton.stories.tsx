import type { Meta, StoryObj } from '@storybook/react';
import { NVButton } from './index';
import { LogOut, Download, Plus, Zap, Heart } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof NVButton> = {
  title: 'Atoms/NVButton',
  component: NVButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'vivid', 'danger', 'ghost', 'glass'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Vivid: Story = {
  args: {
    variant: 'vivid',
    children: 'Vivid Cyan',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: (
      <>
        <LogOut size={18} className="mr-2" />
        Logout
      </>
    ),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Glass: Story = {
  args: {
    variant: 'glass',
    children: 'Glass Glass',
  },
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <NVButton variant="primary">
        <Plus size={18} className="mr-2" />
        Add Item
      </NVButton>
      <NVButton variant="vivid">
        <Zap size={18} className="mr-2" />
        AI Feature
      </NVButton>
      <NVButton variant="glass">
        <Download size={18} className="mr-2" />
        Download
      </NVButton>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-end">
      <NVButton size="sm" variant="primary">Small</NVButton>
      <NVButton size="md" variant="primary">Medium</NVButton>
      <NVButton size="lg" variant="primary">Large</NVButton>
    </div>
  ),
};
