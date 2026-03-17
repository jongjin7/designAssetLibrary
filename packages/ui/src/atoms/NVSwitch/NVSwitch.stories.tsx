import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVSwitch } from './index';

const meta: Meta<typeof NVSwitch> = {
  title: 'Atoms/NVSwitch',
  component: NVSwitch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVSwitch>;

export const Default: Story = {
  args: {
    checked: false,
    size: 'md',
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    checked: true,
    size: 'sm',
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
    size: 'md',
  },
};
