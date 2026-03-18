import type { Meta, StoryObj } from '@storybook/react';
import { NVAssetDetail } from './NVAssetDetail';
import { NVAssetDetailContent } from './NVAssetDetailContent';
import { NVAssetInspector } from './NVAssetInspector';
import { Asset } from '../../types/asset';
import React, { useState } from 'react';

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

const meta: Meta<typeof NVAssetDetail> = {
  title: 'Organisms/AssetDetail',
  component: NVAssetDetail,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '에셋의 상세 정보를 보여주는 통합 시스템입니다. 핵심 콘텐츠(Content), 모바일용 하단 시트(Detail), 데스크톱용 사이드바(Inspector)로 구성됩니다.',
      },
    },
  },
};

export default meta;

export const MobileSheet: StoryObj<typeof NVAssetDetail> = {
  name: 'Mobile Detail (Bottom Sheet)',
  parameters: {
    docs: {
      description: {
        story: 'NVAssetDetailContent를 NVBottomSheet에 담아 제공하는 모바일용 상세 뷰 컨테이너입니다.',
      },
    },
  },
  render: () => {
    const [asset, setAsset] = useState<Asset | null>(null);
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[400px] bg-slate-950">
        <button 
          onClick={() => setAsset(mockAsset)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Open Asset Detail
        </button>
        <NVAssetDetail 
          asset={asset} 
          onClose={() => setAsset(null)}
          onExtractAI={async () => ['#FF0000', '#00FF00', '#0000FF']}
          onExtractBasic={async () => ['#FFFFFF', '#000000']}
        />
      </div>
    );
  }
};

export const DesktopInspector: StoryObj<typeof NVAssetInspector> = {
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
      <div className="flex h-[600px] bg-slate-950 overflow-hidden border border-white/10 rounded-xl">
        <div className="flex-1 p-10 flex flex-col gap-4 items-center justify-center border-r border-white/5">
          <p className="text-slate-500 text-sm">메인 그리드 영역 시뮬레이션</p>
          <button 
            onClick={() => setAsset(mockAsset)}
            className="px-4 py-2 bg-white/5 text-white rounded-lg text-xs"
          >
            에셋 선택
          </button>
          <button 
            onClick={() => setAsset(null)}
            className="px-4 py-2 text-slate-500 text-xs"
          >
            선택 해제
          </button>
        </div>
        <NVAssetInspector 
          asset={asset} 
          onClose={() => setAsset(null)}
          onExtractAI={async () => ['#FF0000', '#00FF00', '#0000FF']}
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
    <div className="max-w-md mx-auto bg-slate-950 border border-white/10 rounded-2xl overflow-hidden my-10">
      <NVAssetDetailContent 
        asset={mockAsset}
        onExtractAI={async () => ['#FF0000', '#00FF00', '#0000FF']}
        onExtractBasic={async () => ['#FFFFFF', '#000000']}
      />
    </div>
  )
};
