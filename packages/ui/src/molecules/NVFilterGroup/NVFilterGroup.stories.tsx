import type { Meta, StoryObj } from '@storybook/react';
import { NVFilterGroup } from './index';

const meta: Meta<typeof NVFilterGroup> = {
  title: 'Molecules/FilterGroup',
  component: NVFilterGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '연관된 필터 옵션들을 가로로 나열하여 선택할 수 있게 하는 컴포넌트입니다. 상단 내비게이션이나 필터 바에서 탭 컨트롤 역할을 합니다.',
      },
    },
  },
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
