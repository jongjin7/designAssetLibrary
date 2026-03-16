import type { Meta, StoryObj } from '@storybook/react';
import { NVSearchBar } from './index';

const meta: Meta<typeof NVSearchBar> = {
  title: 'Molecules/NVSearchBar',
  component: NVSearchBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVSearchBar>;

export const Default: Story = {
  args: {
    placeholder: '에셋 이름, 태그로 검색...',
    showFilter: true,
  },
};

export const WithValue: Story = {
  args: {
    value: 'Design System',
    showFilter: true,
  },
};

export const NoFilter: Story = {
  args: {
    showFilter: false,
  },
};

export const ReadOnly: Story = {
  args: {
    value: 'Click to search...',
    readOnly: true,
  },
};
