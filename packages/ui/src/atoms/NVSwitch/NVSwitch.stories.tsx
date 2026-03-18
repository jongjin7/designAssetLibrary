import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVSwitch } from './index';

const meta: Meta<typeof NVSwitch> = {
  title: 'Atoms/Switch',
  component: NVSwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '두 가지 상호 배타적인 상태(On/Off)를 전환할 때 사용되는 스위치 컴포넌트입니다.',
      },
    },
  },
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
