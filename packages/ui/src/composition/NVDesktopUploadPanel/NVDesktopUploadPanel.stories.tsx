import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NVDesktopUploadPanel } from './index';
import { 
  NVDialog, 
  NVDialogContent,
  NVDialogTrigger
} from '../../atoms/NVDialog';
import { NVButton } from '../../atoms/NVButton';
import { NVGlassPanel } from '../../atoms/NVGlassPanel';
import showcaseBg from '../../assets/images/glass_showcase_bg.png';

const meta: Meta<typeof NVDesktopUploadPanel> = {
  title: 'Composition/DesktopUploadPanel',
  component: NVDesktopUploadPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof NVDesktopUploadPanel>;

export const Default: Story = {
  render: () => (
    <NVDialog open={true}>
      <NVGlassPanel 
        theme="dark" 
        variant="modal" 
        noPadding 
        className="w-full max-w-lg mx-auto overflow-hidden"
      >
        <NVDesktopUploadPanel 
          onAdd={async () => {}}
          onClose={() => {}}
        />
      </NVGlassPanel>
    </NVDialog>
  ),
};

export const WithTrigger: Story = {
  render: () => (
    <div className="w-[800px] h-[600px] flex items-center justify-center bg-slate-950 relative overflow-hidden rounded-[32px] border border-white/5">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      <div className="relative z-10">
        <NVDialog>
          <NVDialogTrigger asChild>
            <NVButton variant="primary">에셋 등록 개시</NVButton>
          </NVDialogTrigger>
          <NVDialogContent className="max-w-lg p-0">
            <NVDesktopUploadPanel 
              onAdd={async (data, file) => {
                console.log('Add Asset:', data, file);
                await new Promise(resolve => setTimeout(resolve, 1000));
              }}
              onClose={() => {}}
            />
          </NVDialogContent>
        </NVDialog>
      </div>
    </div>
  ),
};
