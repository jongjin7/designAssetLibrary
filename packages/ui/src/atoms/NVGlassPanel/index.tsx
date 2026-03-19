import React from 'react';

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
    panel:  'bg-white/[0.07] border border-white/[0.12] shadow-xl shadow-black/30',
    modal:  'bg-slate-900/80 border border-white/[0.10] shadow-2xl shadow-black/50',
    subtle: 'bg-white/[0.03] border border-white/[0.07]',
  },
  light: {
    panel:  'bg-white/70 border border-black/[0.08] shadow-xl shadow-black/10',
    modal:  'bg-white/85 border border-black/[0.06] shadow-2xl shadow-black/20',
    subtle: 'bg-white/40 border border-black/[0.05]',
  },
};

const textMap: Record<NVGlassPanelTheme, string> = {
  dark:  'text-white',
  light: 'text-slate-800',
};

export const NVGlassPanel: React.FC<NVGlassPanelProps> = ({
  children,
  className = '',
  theme = 'dark',
  blur = 'lg',
  variant = 'panel',
  noPadding = false,
}) => {
  const base = styleMap[theme][variant];
  const blurClass = blurMap[blur];
  const textClass = textMap[theme];
  const paddingClass = noPadding ? '' : 'p-6';

  return (
    <div
      className={`
        ${base}
        ${blurClass}
        ${textClass}
        ${paddingClass}
        rounded-2xl
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
};
