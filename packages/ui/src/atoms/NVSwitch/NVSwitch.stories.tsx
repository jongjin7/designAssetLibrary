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
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
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

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story: 'xs부터 xl까지 5가지 표준 크기를 지원합니다.',
      },
    },
  },
  render: () => {
    const [checked, setChecked] = React.useState(true);
    return (
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">XS</span>
          <NVSwitch size="xs" checked={checked} onChange={setChecked} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">SM</span>
          <NVSwitch size="sm" checked={checked} onChange={setChecked} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">MD</span>
          <NVSwitch size="md" checked={checked} onChange={setChecked} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">LG</span>
          <NVSwitch size="lg" checked={checked} onChange={setChecked} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">XL</span>
          <NVSwitch size="xl" checked={checked} onChange={setChecked} />
        </div>
      </div>
    );
  },
};

export const States: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(true);
    return (
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">Checked</span>
          <NVSwitch size="md" checked={true} onChange={() => {}} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">Unchecked</span>
          <NVSwitch size="md" checked={false} onChange={() => {}} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-500 font-mono">Disabled</span>
          <NVSwitch size="md" checked={true} disabled onChange={() => {}} />
        </div>
      </div>
    );
  },
};
