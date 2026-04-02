import type { Meta, StoryObj } from '@storybook/react';
import { NVMenuItem } from './index';
import { 
  Folder as FolderIcon, 
  Trash2, 
  BrainCircuit, 
  LayoutGrid,
  ChevronRight
} from 'lucide-react';

const meta: Meta<typeof NVMenuItem> = {
  title: 'Molecules/MenuItem',
  component: NVMenuItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NVMenuItem>;

// --- 01. Basics ---
export const Default: Story = {
  name: 'Basics / Default',
  args: {
    label: '기본 메뉴 아이템',
    icon: FolderIcon,
  },
};

export const Active: Story = {
  name: 'Basics / Active State',
  args: {
    isActive: true,
    label: '활성화 상태',
    icon: FolderIcon,
  },
};

// --- 02. Variants ---
export const Vivid: Story = {
  name: 'Variants / Vivid (AI)',
  args: {
    variant: 'vivid',
    label: 'AI 에셋 분석',
    description: '내부 파일 특성 자동 분류',
    icon: BrainCircuit,
  },
};

export const Danger: Story = {
  name: 'Variants / Danger',
  args: {
    variant: 'danger',
    label: '폴더 삭제하기',
    description: '이 작업은 되돌릴 수 없습니다.',
    icon: Trash2,
  },
};

// --- 03. Content Layouts ---
export const WithDescription: Story = {
  name: 'Content / With Description',
  args: {
    label: '상세 설명 포함',
    description: '이 아이템은 부가적인 설명이 아래에 표시됩니다.',
    icon: FolderIcon,
  },
};

export const WithRightElement: Story = {
  name: 'Content / Navigation Style',
  args: {
    label: '우측 요소 포함',
    icon: FolderIcon,
    rightElement: <ChevronRight size={12} className="text-slate-600" />,
  },
};
