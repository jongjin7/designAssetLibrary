import type { Meta, StoryObj } from '@storybook/react';
import { NVSelect } from './index';
import { Palette, Calendar, Filter } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof NVSelect> = {
  title: 'Atoms/Select',
  component: NVSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '단일 값을 선택할 때 사용되는 드롭다운 컴포넌트입니다. 커스텀 아이콘과 다양한 크기를 지원합니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVSelect>;

const options = [
  { value: '', label: '선택 안함' },
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
];

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500 font-mono">Size: SM</span>
        <NVSelect size="sm" options={options} icon={<Filter size={14} />} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500 font-mono">Size: MD (Default)</span>
        <NVSelect size="md" options={options} icon={<Filter size={16} />} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500 font-mono">Size: LG</span>
        <NVSelect size="lg" options={options} icon={<Filter size={18} />} />
      </div>
    </div>
  ),
};

export const Variations: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <NVSelect options={options} icon={<Palette size={16} />} defaultValue="option1" />
      <NVSelect options={options} icon={<Calendar size={16} />} />
      <NVSelect options={options} disabled defaultValue="option2" />
    </div>
  ),
};


