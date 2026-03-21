import React from 'react';
import { cn } from '../../lib/utils';

export type NVGlassPanelTheme = 'dark' | 'light';
export type NVGlassPanelBlur = 'sm' | 'md' | 'lg' | 'xl';
export type NVGlassPanelVariant = 'panel' | 'modal' | 'subtle';

interface NVGlassPanelProps {
  children: React.ReactNode;
  className?: string;
  /** 테마: 어두운 배경 위 → 'dark', 밝은 배경 위 → 'light' */
  theme?: NVGlassPanelTheme;
  /** 블러 강도 */
  blur?: NVGlassPanelBlur;
  /** 사용 목적: 'panel' (일반 패널), 'modal' (팝업/다이얼로그), 'subtle' (미묘한 배경) */
  variant?: NVGlassPanelVariant;
  /** 패딩 제거 여부 (모달 내부 레이아웃 직접 제어 시) */
  noPadding?: boolean;
}

const blurMap: Record<NVGlassPanelBlur, string> = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-2xl',
};

// theme × variant 조합별 배경/보더 스타일
const styleMap: Record<NVGlassPanelTheme, Record<NVGlassPanelVariant, string>> = {
  dark: {
    panel:  'bg-slate-950/50 border border-white/10 shadow-xl shadow-black/20 backdrop-saturate-150',
    modal:  'bg-slate-950/70 border border-white/10 shadow-2xl shadow-black/40 backdrop-saturate-150',
    subtle: 'bg-white/[0.03] border border-white/[0.08] backdrop-saturate-100',
  },
  light: {
    panel:  'bg-white/60 border border-black/[0.05] shadow-lg shadow-black/10 backdrop-saturate-150',
    modal:  'bg-white/80 border border-black/[0.1] shadow-xl shadow-black/20 backdrop-saturate-150',
    subtle: 'bg-white/40 border border-black/[0.04]',
  },
};

const textMap: Record<NVGlassPanelTheme, string> = {
  dark:  'text-slate-200',
  light: 'text-slate-800',
};

export const NVGlassPanel: React.FC<NVGlassPanelProps> = ({
  children,
  className = '',
  theme = 'dark',
  blur = 'xl',
  variant = 'panel',
  noPadding = false,
}) => {
  const base = styleMap[theme][variant];
  const blurClass = blurMap[blur];
  const textClass = textMap[theme];
  const paddingClass = noPadding ? '' : 'p-6';

  // Transition
  const transitionClass = "transition-all duration-300";

  return (
    <div
      className={cn(
        base,
        blurClass,
        textClass,
        paddingClass,
        transitionClass,
        "rounded-xl",
        className
      )}
    >
      {children}
    </div>
  );
};
