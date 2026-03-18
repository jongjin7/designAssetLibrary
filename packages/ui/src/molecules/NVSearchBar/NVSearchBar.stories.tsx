import type { Meta, StoryObj } from '@storybook/react';
import { NVSearchBar } from './index';

const meta: Meta<typeof NVSearchBar> = {
  title: 'Molecules/SearchBar',
  component: NVSearchBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '검색 기능과 필터 토글 버튼이 결합된 상단 검색 바입니다.',
      },
    },
  },
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
