import type { Meta, StoryObj } from '@storybook/react';
import { NVInput } from './index';
import { Search, Tag, Mail, X } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof NVInput> = {
  title: 'Atoms/NVInput',
  component: NVInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NVInput>;

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <div className="flex flex-col gap-2">
        <span className="text-xs text-nv-text-tertiary font-mono">Size: SM</span>
        <NVInput size="sm" placeholder="Small input..." icon={<Search size={14} />} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-nv-text-tertiary font-mono">Size: MD (Default)</span>
        <NVInput size="md" placeholder="Medium input..." icon={<Search size={16} />} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs text-nv-text-tertiary font-mono">Size: LG</span>
        <NVInput size="lg" placeholder="Large input..." icon={<Search size={18} />} />
      </div>
    </div>
  ),
};

export const Icons: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <NVInput placeholder="Search..." icon={<Search size={16} />} />
      <NVInput placeholder="Tags..." icon={<Tag size={16} />} />
      <NVInput placeholder="Email address" icon={<Mail size={16} />} />
      <NVInput 
        placeholder="With clear button" 
        icon={<Search size={16} />}
        defaultValue="Searching for something..."
        rightElement={
          <button className="p-1 text-nv-text-tertiary hover:text-nv-text-primary">
            <X size={14} />
          </button>
        }
      />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-full max-w-md">
      <NVInput placeholder="Active state" autoFocus />
      <NVInput placeholder="Disabled state" disabled value="Cannot edit this" />
      <NVInput placeholder="Read-only state" readOnly value="Read only content" />
    </div>
  ),
};


