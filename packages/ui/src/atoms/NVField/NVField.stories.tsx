import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVField } from './index';
import { NVInput } from '../NVInput';
import { NVSelect } from '../NVSelect';
import { NVGlassPanel } from '../NVGlassPanel';

const meta: Meta<typeof NVField> = {
  title: 'Atoms/Field',
  component: NVField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '레이블(Label)과 폼 컨트롤(Input, Select 등)을 일정한 간격으로 묶어주는 필드 레이아웃 컴포넌트입니다.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVField>;

/**
 * 일반적인 텍스트 입력을 포함한 필드 예시입니다.
 */
export const Default: Story = {
  args: {
    label: 'Email Address',
    htmlFor: 'email-input',
    size: 'md',
    children: <NVInput id="email-input" placeholder="example@domain.com" />,
  },
  render: (args) => (
    <div className="max-w-md p-8 bg-slate-950 rounded-3xl">
      <NVField {...args} />
    </div>
  ),
};

/**
 * 다양한 크기(Size) 옵션을 보여주는 예제입니다. 레이블 폰트 크기와 간격이 동기화됩니다.
 */
export const SizeVariations: Story = {
  render: () => (
    <div className="max-w-md p-8 bg-slate-950 rounded-3xl space-y-8">
      <NVField label="Extra Small Size" size="xs">
        <NVInput size="xs" placeholder="xs size input" />
      </NVField>

      <NVField label="Small Size" size="sm">
        <NVInput size="sm" placeholder="sm size input" />
      </NVField>

      <NVField label="Medium Size" size="md">
        <NVInput size="md" placeholder="md size input (Default)" />
      </NVField>
      
      <NVField label="Large Size" size="lg">
        <NVInput size="lg" placeholder="lg size input" />
      </NVField>
    </div>
  ),
};

/**
 * 복합적인 폼 구성을 가진 예시입니다.
 */
export const CompositeForm: Story = {
  render: () => (
    <div className="max-w-md">
      <NVGlassPanel variant="modal" className="p-6 space-y-4">
        <div className="space-y-1 mb-6">
          <h3 className="text-lg font-bold text-white">Project Settings</h3>
          <p className="text-xs text-slate-500">Manage your project configuration and visibility.</p>
        </div>
        
        <NVField label="Display Name" size="md">
          <NVInput placeholder="Enter project name..." />
        </NVField>
        
        <NVField label="Visibility Level" size="md">
          <NVSelect 
            defaultValue="public" 
            options={[
              { value: 'public', label: 'Public - Anyone can see' },
              { value: 'private', label: 'Private - Invited only' },
              { value: 'internal', label: 'Internal - Organization only' }
            ]} 
          />
        </NVField>
        
        <div className="pt-2">
          <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-colors">
            Save Changes
          </button>
        </div>
      </NVGlassPanel>
    </div>
  ),
};

/**
 * 수평 형태(Row)의 레이아웃 예시입니다. 설정창이나 사이드바에서 유용합니다.
 */
export const RowLayout: Story = {
  render: () => (
    <div className="max-w-md p-8 bg-slate-950 rounded-3xl space-y-6">
      <NVField label="Name" row labelWidth="100px" size="sm">
        <NVInput placeholder="Desktop View" />
      </NVField>
      
      <NVField label="Category" row labelWidth="100px" size="sm">
        <NVSelect 
          defaultValue="ui"
          options={[
            { value: 'ui', label: 'UI Design' },
            { value: 'ux', label: 'UX Research' }
          ]} 
        />
      </NVField>
      
      <NVField label="Status" row labelWidth="100px" size="sm">
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-green-500/20 text-green-500 text-[10px] font-bold rounded uppercase">Active</span>
          <span className="px-2 py-1 bg-slate-800 text-slate-500 text-[10px] font-bold rounded uppercase">Pending</span>
        </div>
      </NVField>
    </div>
  ),
};
