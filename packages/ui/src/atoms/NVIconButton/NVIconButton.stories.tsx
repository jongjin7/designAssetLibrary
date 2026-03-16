import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { NVIconButton } from './index';
import { Menu, Star, Search, Settings, X, Plus } from 'lucide-react';

const meta: Meta<typeof NVIconButton> = {
  title: 'Atoms/NVIconButton',
  component: NVIconButton,
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
type Story = StoryObj<typeof NVIconButton>;

export const Default: Story = {
  args: {
    icon: Menu,
    variant: 'secondary',
    size: 'md',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4 flex-wrap">
      <NVIconButton icon={Search} variant="primary" title="Primary" />
      <NVIconButton icon={Menu} variant="secondary" title="Secondary" />
      <NVIconButton icon={Plus} variant="vivid" title="Vivid" />
      <NVIconButton icon={Settings} variant="glass" title="Glass" />
      <NVIconButton icon={X} variant="danger" title="Danger" />
      <NVIconButton icon={Star} variant="ghost" title="Ghost" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <NVIconButton icon={Search} size="sm" variant="primary" title="Small (36px)" />
      <NVIconButton icon={Search} size="md" variant="primary" title="Medium (44px)" />
      <NVIconButton icon={Search} size="lg" variant="primary" title="Large (52px)" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <NVIconButton icon={Search} variant="primary" />
      <NVIconButton icon={Search} variant="primary" disabled />
      <NVIconButton icon={Search} variant="secondary" className="animate-pulse" />
    </div>
  ),
};
