import type { Meta, StoryObj } from '@storybook/react';
import { NVFilterGroup } from './index';

const meta: Meta<typeof NVFilterGroup> = {
  title: 'Molecules/NVFilterGroup',
  component: NVFilterGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVFilterGroup>;

const options = [
  { key: 'all', label: '모두' },
  { key: 'recent', label: '최근' },
  { key: 'favorites', label: '즐겨찾기' },
];

export const Default: Story = {
  args: {
    options,
    activeKey: 'all',
  },
};

export const RecentSelected: Story = {
  args: {
    options,
    activeKey: 'recent',
  },
};
