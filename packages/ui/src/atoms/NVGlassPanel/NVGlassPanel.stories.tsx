import type { Meta, StoryObj } from '@storybook/react';
import { NVGlassPanel } from './index';
import { NVButton } from '../NVButton';
import React from 'react';
import showcaseBg from '../../assets/images/glass_showcase_bg.png';

const meta: Meta<typeof NVGlassPanel> = {
  title: 'Atoms/NVGlassPanel',
  component: NVGlassPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '글래스모피즘(불투명 유리) 효과를 제공하는 범용 패널 컴포넌트입니다. 배경 블러 강도, 테마(Dark/Light), 용도별 변형(일반 패널/모달/Subtle)을 지원합니다.',
      },
    },
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['dark', 'light'],
      description: '배경 테마 — 어두운 배경 위: dark / 밝은 배경 위: light',
    },
    blur: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: '블러(frosted) 강도',
    },
    variant: {
      control: 'select',
      options: ['panel', 'modal', 'subtle'],
      description: '사용 목적 — panel: 일반 패널 / modal: 팝업 다이얼로그 / subtle: 미묘한 배경',
    },
    noPadding: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NVGlassPanel>;

// ─── Playground (Controls) ────────────────────────────────────────────────────
export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: '컴포넌트의 모든 설정을 자유롭게 조정하며 테스트할 수 있습니다.',
      },
    },
  },
  args: {
    theme: 'dark',
    blur: 'lg',
    variant: 'panel',
    children: (
      <div className="space-y-2">
        <h3 className="text-lg font-bold">NVGlassPanel</h3>
        <p className="text-sm opacity-70">
          Controls 패널에서 theme / blur / variant 를 바꿔보세요.
        </p>
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div 
        className="p-10 rounded-3xl min-h-[300px] flex items-center justify-center bg-slate-900 overflow-hidden relative"
      >
        <div 
          className="absolute inset-0 bg-center bg-cover opacity-60"
          style={{ backgroundImage: `url(${showcaseBg})` }}
        />
        <div className="w-80 relative z-10">
          <Story />
        </div>
      </div>
    ),
  ],
};

// ─── Dark Theme Variants ──────────────────────────────────────────────────────
export const DarkThemeVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: '어두운 배경 위에서 사용되는 다크 테마 변형들입니다. Subtle, Panel, Modal 세 가지 용도로 제공됩니다.',
      },
    },
  },
  render: () => (
    <div 
      className="flex flex-col gap-6 p-12 rounded-3xl relative overflow-hidden bg-slate-950"
    >
      <div 
        className="absolute inset-0 bg-center bg-cover opacity-40"
        style={{ backgroundImage: `url(${showcaseBg})` }}
      />
      <p className="relative z-10 text-slate-400 text-xs font-mono uppercase tracking-widest">theme="dark"</p>

      <NVGlassPanel theme="dark" variant="subtle" blur="md">
        <p className="text-xs font-mono text-white/50 mb-1">variant="subtle" / blur="md"</p>
        <h4 className="font-semibold">Subtle Panel</h4>
        <p className="text-sm opacity-60 mt-1">최소한의 존재감. 콘텐츠에 집중.</p>
      </NVGlassPanel>

      <NVGlassPanel theme="dark" variant="panel" blur="lg">
        <p className="text-xs font-mono text-white/50 mb-1">variant="panel" / blur="lg"</p>
        <h4 className="font-semibold">Standard Panel</h4>
        <p className="text-sm opacity-60 mt-1">카드, 사이드바, 툴바 등 일반 패널 배경.</p>
      </NVGlassPanel>

      <NVGlassPanel theme="dark" variant="modal" blur="xl">
        <p className="text-xs font-mono text-white/50 mb-1">variant="modal" / blur="xl"</p>
        <h4 className="font-semibold">Modal / Dialog</h4>
        <p className="text-sm opacity-60 mt-1">팝업, 다이얼로그, 드로어에 사용.</p>
      </NVGlassPanel>
    </div>
  ),
};

// ─── Light Theme Variants ─────────────────────────────────────────────────────
export const LightThemeVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: '밝은 배경 위에서 사용되는 라이트 테마 변형들입니다. 다크 테마보다 더 높은 불투명도와 부드러운 그림자를 제공합니다.',
      },
    },
  },
  render: () => (
    <div 
      className="flex flex-col gap-6 p-12 rounded-3xl relative overflow-hidden bg-slate-100"
    >
      <div 
        className="absolute inset-0 bg-center bg-cover opacity-20"
        style={{ backgroundImage: `url(${showcaseBg})` }}
      />
      <p className="relative z-10 text-slate-500 text-xs font-mono uppercase tracking-widest">theme="light"</p>

      <NVGlassPanel theme="light" variant="subtle" blur="md">
        <p className="text-xs font-mono text-slate-400 mb-1">variant="subtle" / blur="md"</p>
        <h4 className="font-semibold">Subtle Panel</h4>
        <p className="text-sm opacity-60 mt-1">최소한의 존재감. 콘텐츠에 집중.</p>
      </NVGlassPanel>

      <NVGlassPanel theme="light" variant="panel" blur="lg">
        <p className="text-xs font-mono text-slate-400 mb-1">variant="panel" / blur="lg"</p>
        <h4 className="font-semibold">Standard Panel</h4>
        <p className="text-sm opacity-60 mt-1">카드, 사이드바, 툴바 등 일반 패널 배경.</p>
      </NVGlassPanel>

      <NVGlassPanel theme="light" variant="modal" blur="xl">
        <p className="text-xs font-mono text-slate-400 mb-1">variant="modal" / blur="xl"</p>
        <h4 className="font-semibold">Modal / Dialog</h4>
        <p className="text-sm opacity-60 mt-1">팝업, 다이얼로그, 드로어에 사용.</p>
      </NVGlassPanel>
    </div>
  ),
};

// ─── Blur Scale ───────────────────────────────────────────────────────────────
export const BlurScale: Story = {
  parameters: {
    docs: {
      description: {
        story: 'sm(4px)부터 xl(24px)까지 4단계의 블러 강도를 비교해볼 수 있습니다.',
      },
    },
  },
  render: () => (
    <div 
      className="grid grid-cols-2 gap-6 p-12 rounded-3xl relative overflow-hidden bg-slate-900"
    >
      <div 
        className="absolute inset-0 bg-center bg-cover opacity-50"
        style={{ backgroundImage: `url(${showcaseBg})` }}
      />
      {(['sm', 'md', 'lg', 'xl'] as const).map((b) => (
        <NVGlassPanel key={b} theme="dark" variant="panel" blur={b}>
          <p className="text-xs font-mono text-white/40 mb-1">blur="{b}"</p>
          <h4 className="font-semibold capitalize">{b} Blur</h4>
          <p className="text-sm opacity-50 mt-1">블러 강도 비교</p>
        </NVGlassPanel>
      ))}
    </div>
  ),
};

// ─── Modal Simulation (Dark) ──────────────────────────────────────────────────
export const ModalSimulationDark: Story = {
  parameters: {
    docs: {
      description: {
        story: '어두운 테마 환경에서 모달(다이얼로그)로 사용될 때의 예시입니다. 더 강한 블러와 그림자가 레이어 인지도를 높여줍니다.',
      },
    },
  },
  render: () => (
    <div className="relative flex items-center justify-center p-6 bg-slate-950 rounded-3xl min-h-[420px] overflow-hidden">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-center bg-cover opacity-80"
        style={{ backgroundImage: `url(${showcaseBg})` }}
      />
      {/* 배경 레이어 (딤드 효과) */}
      <div className="absolute inset-0 bg-black/40" />

      {/* 모달 패널 */}
      <NVGlassPanel
        theme="dark"
        variant="modal"
        blur="xl"
        className="relative z-10 w-full max-w-sm"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold">확인이 필요합니다</h3>
            <p className="text-sm text-white/60 mt-1">
              이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?
            </p>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex gap-3 justify-end">
            <NVButton variant="ghost" size="sm">취소</NVButton>
            <NVButton variant="danger" size="sm">삭제</NVButton>
          </div>
        </div>
      </NVGlassPanel>
    </div>
  ),
};

// ─── Modal Simulation (Light) ─────────────────────────────────────────────────
export const ModalSimulationLight: Story = {
  parameters: {
    docs: {
      description: {
        story: '밝은 테마 환경에서 모달로 사용될 때의 예시입니다. 콘텐츠 가독성을 위해 불투명도가 다크 모달보다 높게 설정됩니다.',
      },
    },
  },
  render: () => (
    <div className="relative flex items-center justify-center p-6 bg-slate-100 rounded-3xl min-h-[420px] overflow-hidden">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-center bg-cover opacity-60"
        style={{ backgroundImage: `url(${showcaseBg})` }}
      />
      {/* 딤드 오버레이 */}
      <div className="absolute inset-0 bg-white/30" />

      {/* 모달 패널 */}
      <NVGlassPanel
        theme="light"
        variant="modal"
        blur="xl"
        className="relative z-10 w-full max-w-sm"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold">파일 업로드</h3>
            <p className="text-sm text-slate-500 mt-1">
              지원 형식: PNG, JPG, SVG, PDF (최대 50MB)
            </p>
          </div>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
            <p className="text-slate-400 text-sm">여기에 파일을 드래그하거나 클릭하세요</p>
          </div>
          <div className="h-px bg-black/8" />
          <div className="flex gap-3 justify-end">
            <NVButton variant="ghost" size="sm">취소</NVButton>
            <NVButton variant="primary" size="sm">업로드</NVButton>
          </div>
        </div>
      </NVGlassPanel>
    </div>
  ),
};

// ─── Side-by-Side Comparison ──────────────────────────────────────────────────
export const ThemeComparison: Story = {
  parameters: {
    docs: {
      description: {
        story: '다크와 라이트 테마를 나란히 배치하여 시각적 차이를 직접 비교합니다.',
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-2 gap-0 rounded-3xl overflow-hidden min-h-[320px] relative">
      <div 
        className="absolute inset-0 bg-center bg-cover opacity-50"
        style={{ backgroundImage: `url(${showcaseBg})` }}
      />
      {/* Dark side */}
      <div className="relative z-10 flex items-center justify-center p-10 bg-slate-950/40 backdrop-brightness-50">
        <NVGlassPanel theme="dark" variant="panel" blur="lg" className="w-full">
          <p className="text-xs font-mono text-white/40 mb-2">theme="dark"</p>
          <h4 className="font-bold">Dark Panel</h4>
          <p className="text-sm text-white/50 mt-1">어두운 배경 위의 유리판</p>
        </NVGlassPanel>
      </div>

      {/* Light side */}
      <div className="relative z-10 flex items-center justify-center p-10 bg-white/20 backdrop-brightness-125">
        <NVGlassPanel theme="light" variant="panel" blur="lg" className="w-full">
          <p className="text-xs font-mono text-slate-400 mb-2">theme="light"</p>
          <h4 className="font-bold">Light Panel</h4>
          <p className="text-sm text-slate-500 mt-1">밝은 배경 위의 유리판</p>
        </NVGlassPanel>
      </div>
    </div>
  ),
};
