import type { Meta, StoryObj } from '@storybook/react';
import { NVFolderPopover } from './index';

const meta: Meta<typeof NVFolderPopover> = {
  title: 'Molecules/FolderPopover',
  component: NVFolderPopover,
  tags: ['autodocs'],
  argTypes: {
    folder: { control: 'object' },
    subfolders: { control: 'object' },
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="group relative w-[400px] h-[400px] flex items-center justify-center border border-white/5 bg-white/[0.02] rounded-2xl p-20">
        <div className="relative">
          <span className="text-slate-500 text-xs mb-4 block text-center">폴더 행에 호버하면 메뉴가 나타납니다</span>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg w-[200px] relative group/row">
             <div className="w-4 h-4 bg-indigo-500 rounded flex-shrink-0" />
             <span className="text-sm text-slate-300 flex-1 truncate">메뉴 테스트 폴더</span>
             <Story />
          </div>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NVFolderPopover>;

// --- 01. Folder Types ---
export const GeneralFolder: Story = {
  name: 'Types / General Folder',
  args: {
    folder: {
      id: 'folder-1',
      name: '디자인 프로젝트 에셋',
      parentId: null,
    },
    subfolders: [
      { id: 'sub-1', name: '2024년 런칭 기획', parentId: 'folder-1' },
      { id: 'sub-2', name: '아이콘 시스템', parentId: 'folder-1' },
    ],
    onRename: (f) => console.log('Rename requested for:', f),
    onDelete: (f) => console.log('Delete requested for:', f),
    onCreateSubfolder: (id, name) => console.log('Subfolder created:', name, 'under', id),
  },
};

export const SmartFolder: Story = {
  name: 'Types / Smart Folder',
  args: {
    folder: {
      id: 'smart-1',
      name: '최근 수정한 AI 에셋',
      parentId: null,
      isSmartFolder: true,
    },
    onOptimize: (f) => console.log('Logic optimization requested for:', f),
    onDelete: (f) => console.log('Smart folder removal requested for:', f),
  },
};

// --- 02. Edge Cases ---
export const LongName: Story = {
  name: 'Cases / Extremely Long Name',
  args: {
    folder: {
      id: 'folder-long',
      name: '이것은 매우 긴 이름을 가진 폴더의 예시이며 팝업 헤더에서 말줄임표 처리가 완벽하게 수행되는지 확인하기 위한 테스트입니다',
      parentId: null,
    },
  },
};

export const EmptyFolder: Story = {
  name: 'Cases / Empty Subfolders',
  args: {
    folder: {
      id: 'folder-empty',
      name: '내용물이 없는 새로운 폴더',
      parentId: null,
    },
    subfolders: [],
  },
};
