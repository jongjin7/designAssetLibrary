import type { Meta, StoryObj } from '@storybook/react';
import { NVAssetDetailSheet } from './NVAssetDetailSheet';
import { NVAssetDetailContent } from './NVAssetDetailContent';
import { NVAssetDetailSidebar } from './NVAssetDetailSidebar';
import { Asset } from '../../types/asset';
import { NVToastProvider } from '../../atoms/NVToast';
import { NVGlassPanel } from '../../atoms/NVGlassPanel';
import { NVButton } from '../../atoms/NVButton';
import React, { useState } from 'react';

import showcaseBg from '../../assets/images/glass_showcase_bg.png';

const mockAsset: Asset = {
  id: 'asset-123',
  fileName: 'design-preview-v2.jpg',
  fileSize: '4.2 MB',
  mimeType: 'image/jpeg',
  thumbnailGradient: 'linear-gradient(135deg, #6366F1 0%, #a855f7 100%)',
  thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
  palette: ['#6366F1', '#A855F7', '#F43F5E', '#10B981', '#06B6D4'],
  tags: ['design', 'preview', '2024', 'branding'],
  createdAt: '2024-03-10T12:00:00Z',
  isFavorite: true,
};

const meta: Meta<typeof NVAssetDetailSheet> = {
  title: 'Composition/AssetDetail',
  component: NVAssetDetailSheet,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '에셋의 상세 정보를 보여주는 통합 시스템입니다. 핵심 콘텐츠(Content), 모바일용 하단 시트(Detail), 데스크톱용 사이드바(Inspector)로 구성됩니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <NVToastProvider>
        <Story />
      </NVToastProvider>
    ),
  ],
};

export default meta;

export const MobileSheet: StoryObj<typeof NVAssetDetailSheet> = {
  name: 'Mobile Detail (Bottom Sheet)',
  parameters: {
    docs: {
      description: {
        story: 'NVAssetDetailContent를 NVBottomSheet에 담아 제공하는 모바일용 상세 뷰 컨테이너입니다.',
      },
    },
  },
  render: () => {
    const [asset, setAsset] = useState<Asset | null>(mockAsset);
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-slate-950 relative overflow-hidden p-10">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60" 
          style={{ backgroundImage: `url(${showcaseBg})` }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <NVButton 
            variant="primary"
            size="md"
            onClick={() => setAsset(mockAsset)}
            className="px-8 h-12 rounded-2xl font-bold shadow-2xl shadow-indigo-500/20 active:scale-95 transition-all"
          >
            Show Asset Detail
          </NVButton>
          <p className="text-slate-400 text-sm font-medium">하단 시트의 글래스 투과 효과를 확인해 보세요.</p>
        </div>
        
        <NVAssetDetailSheet 
          asset={asset} 
          onClose={() => setAsset(null)}
          onExtractAI={async () => ['#FF3D00', '#FFD600', '#00E676']}
          onExtractBasic={async () => ['#FFFFFF', '#000000']}
        />
      </div>
    );
  }
};

export const DesktopInspector: StoryObj<typeof NVAssetDetailSidebar> = {
  name: 'Desktop Detail (Inspector Sidebar)',
  parameters: {
    docs: {
      description: {
        story: '데스크톱 환경에서 우측에 고정되는 인스펙터 형태의 상세 뷰입니다.',
      },
    },
  },
  render: () => {
    const [asset, setAsset] = useState<Asset | null>(mockAsset);
    return (
      <div className="flex h-[600px] bg-slate-950 overflow-hidden border border-white/10 rounded-2xl relative">
        <div className="flex-1 p-10 flex flex-col gap-6 items-center justify-center border-r border-white/10 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 grayscale-[0.5]" 
            style={{ backgroundImage: `url(${showcaseBg})` }} 
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff25_1.5px,transparent_1.5px),linear-gradient(to_bottom,#ffffff25_1.5px,transparent_1.5px)] bg-[size:50px_50px] opacity-30" />
          
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <p className="text-white/60 text-sm font-bold tracking-widest uppercase">Canvas Simulation</p>
            <div className="flex gap-3">
              <NVButton 
                variant="primary"
                size="sm"
                onClick={() => setAsset(mockAsset)}
                className="px-5 font-bold shadow-lg"
              >
                에셋 선택
              </NVButton>
              <NVButton 
                variant="secondary"
                size="sm"
                onClick={() => setAsset(null)}
                className="px-5 font-bold"
              >
                선택 해제
              </NVButton>
            </div>
            <p className="text-slate-500 text-xs mt-2">사이드바의 리얼타임 글래스 효과를 인스펙터에서 확인하세요.</p>
          </div>
        </div>
        <NVAssetDetailSidebar 
          asset={asset} 
          onClose={() => setAsset(null)}
          onExtractAI={async () => ['#FF3D00', '#FFD600', '#00E676']}
          onExtractBasic={async () => ['#FFFFFF', '#000000']}
        />
      </div>
    );
  }
};

export const CoreContent: StoryObj<typeof NVAssetDetailContent> = {
  name: 'Core Content (Base Component)',
  parameters: {
    docs: {
      description: {
        story: '플랫폼 구분 없이 공통적으로 사용되는 상세 정보 콘텐츠 컴포넌트입니다.',
      },
    },
  },
  render: () => (
    <div className="flex items-center justify-center p-20 bg-slate-950 relative overflow-hidden rounded-[40px]">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70" 
        style={{ backgroundImage: `url(${showcaseBg})` }} 
      />
      <NVGlassPanel variant="modal" noPadding className="relative z-10 max-w-md w-full shadow-3xl">
        <NVAssetDetailContent 
          asset={mockAsset}
          onExtractAI={async () => ['#FF3D00', '#FFD600', '#00E676']}
          onExtractBasic={async () => ['#FFFFFF', '#000000']}
        />
      </NVGlassPanel>
    </div>
  )
};
