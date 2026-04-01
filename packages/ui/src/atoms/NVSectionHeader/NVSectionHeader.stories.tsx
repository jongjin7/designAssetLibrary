import type { Meta, StoryObj } from '@storybook/react';
import { NVSectionHeader } from './index';

const meta: Meta<typeof NVSectionHeader> = {
  title: 'Atoms/SectionHeader',
  component: NVSectionHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  argTypes: {
    onDropdownClick: { action: 'dropdown clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof NVSectionHeader>;

// 1. 기본형 (목차용)
export const Default: Story = {
  args: {
    title: '목차',
    count: 2,
    hasDropdown: false,
  },
  render: (args) => (
    <div className="w-[800px]">
      <NVSectionHeader {...args} />
    </div>
  ),
};

// 2. 드롭다운 포함 (하위 폴더용)
export const WithDropdown: Story = {
  args: {
    title: '하위 폴더',
    count: 1,
    hasDropdown: true,
  },
  render: (args) => (
    <div className="w-[800px]">
      <NVSectionHeader {...args} />
    </div>
  ),
};

// 3. 카운트 없는 상태
export const NoCount: Story = {
  args: {
    title: '추천 에셋',
    hasDropdown: false,
  },
  render: (args) => (
    <div className="w-[800px]">
      <NVSectionHeader {...args} />
    </div>
  ),
};
