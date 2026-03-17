import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type LoadingMode = 'loading' | 'syncing' | 'success' | 'error' | 'empty';

interface NVLoadingStateProps {
  message?: string;
  className?: string;
  fullHeight?: boolean;
  mode?: LoadingMode;
  /** 렌더된 JSX를 그대로 표시합니다. */
  icon?: React.ReactNode;
  /** Lucide 등 아이콘 컴포넌트를 전달하면 모드 색상·size=48이 자동 적용됩니다. */
  iconAs?: React.FC<{ size?: number; color?: string; strokeWidth?: number; className?: string }>;
}

const KEYFRAMES = `
  @keyframes nv-orbit {
    to { transform: rotate(360deg); }
  }
  @keyframes nv-core-pulse {
    0%, 100% { transform: scale(1);   box-shadow: 0 0 16px rgba(99,102,241,0.9); }
    50%       { transform: scale(1.5); box-shadow: 0 0 28px rgba(99,102,241,0.4); }
  }
  @keyframes nv-arc-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes nv-icon-pop {
    0%   { transform: scale(0);    opacity: 0; }
    65%  { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1);    opacity: 1; }
  }
  @keyframes nv-shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-5px); }
    40%       { transform: translateX(5px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(3px); }
  }
  @keyframes nv-skeleton {
    0%, 100% { opacity: 0.12; }
    50%       { opacity: 0.4; }
  }
`;

// ── shared template for success / error — lucide icon ───────────────────────
const StatusIcon = ({ isSuccess }: { isSuccess: boolean }) => {
  const color = isSuccess ? '#10B981' : '#F43F5E';
  const glow  = isSuccess ? 'rgba(16,185,129,0.35)' : 'rgba(244,63,94,0.35)';
  const Icon  = isSuccess ? CheckCircle2 : XCircle;

  return (
    <div style={{
      filter: `drop-shadow(0 0 10px ${glow})`,
      animation: [
        'nv-icon-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
        !isSuccess ? 'nv-shake 0.45s ease 0.55s' : '',
      ].filter(Boolean).join(', '),
    }}>
      <Icon size={56} color={color} strokeWidth={1.5} />
    </div>
  );
};

// ── mode-specific text style ─────────────────────────────────────────────────
const MODE_TEXT: Record<LoadingMode, { dot: string; gradient: string }> = {
  loading: { dot: '#6366F1', gradient: 'linear-gradient(90deg,#A5B4FC,#F1F5F9)' },
  syncing: { dot: '#06B6D4', gradient: 'linear-gradient(90deg,#67E8F9,#F1F5F9)' },
  success: { dot: '#10B981', gradient: 'linear-gradient(90deg,#6EE7B7,#F1F5F9)' },
  error:   { dot: '#F43F5E', gradient: 'linear-gradient(90deg,#FDA4AF,#F1F5F9)' },
  empty:   { dot: '#64748B', gradient: 'linear-gradient(90deg,#94A3B8,#CBD5E1)' },
};

export const NVLoadingState = ({
  message,
  className,
  fullHeight = false,
  mode = 'loading',
  icon,
  iconAs: IconAs,
}: NVLoadingStateProps) => {

  const renderIcon = () => {
    switch (mode) {

      // ── LOADING: core + two satellites at different orbits ───────────────
      case 'loading':
        return (
          <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366F1', animation: 'nv-core-pulse 1.6s ease-in-out infinite' }} />
            {/* Inner orbit — cyan, 1.0s */}
            <div style={{ position: 'absolute', width: 0, height: 0, animation: 'nv-orbit 1.0s linear infinite' }}>
              <div style={{ position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: '#06B6D4', boxShadow: '0 0 12px rgba(6,182,212,0.9)', top: -26, left: -4 }} />
            </div>
            {/* Outer orbit — violet, 2.2s reversed */}
            <div style={{ position: 'absolute', width: 0, height: 0, animation: 'nv-orbit 2.2s -0.7s linear infinite reverse' }}>
              <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#A78BFA', boxShadow: '0 0 10px rgba(167,139,250,0.8)', top: -37, left: -3 }} />
            </div>
          </div>
        );

      // ── SYNCING: two arcs chasing each other on a track ─────────────────
      case 'syncing':
        return (
          <svg viewBox="0 0 64 64" style={{ width: 64, height: 64 }} fill="none">
            <circle cx="32" cy="32" r="24" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle cx="32" cy="32" r="24" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round"
              style={{ strokeDasharray: '42 109', transformOrigin: '32px 32px', animation: 'nv-arc-spin 1.6s linear infinite' }} />
            <circle cx="32" cy="32" r="24" stroke="#6366F1" strokeWidth="3" strokeLinecap="round"
              style={{ strokeDasharray: '42 109', strokeDashoffset: -76, transformOrigin: '32px 32px', animation: 'nv-arc-spin 1.6s linear infinite' }} />
          </svg>
        );

      // ── SUCCESS / ERROR: same template, different color + icon ───────────
      case 'success':
        return <StatusIcon isSuccess={true} />;

      case 'error':
        return <StatusIcon isSuccess={false} />;

      // ── EMPTY: 2×2 asset card skeleton ──────────────────────────────────
      case 'empty':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {[0, 0.3, 0.6, 0.9].map((delay, i) => (
              <div key={i} style={{
                width: 30, height: 34, borderRadius: 8,
                background: 'rgba(99,102,241,0.25)',
                animation: `nv-skeleton 2s ease-in-out ${delay}s infinite`,
              }} />
            ))}
          </div>
        );
    }
  };

  const defaultMessages: Record<LoadingMode, string> = {
    loading: "영감을 불러오는 중...",
    syncing: "데이터를 동기화하고 있습니다...",
    success: "완료되었습니다!",
    error:   "문제가 발생했습니다",
    empty:   "표시할 항목이 없습니다",
  };

  const { dot, gradient } = MODE_TEXT[mode];

  const resolveIcon = () => {
    if (IconAs) return <IconAs size={48} color={dot} strokeWidth={1.5} />;
    if (icon != null) return icon;
    return renderIcon();
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center overflow-hidden",
      fullHeight && "min-h-[60dvh]",
      className
    )}>
      <style>{KEYFRAMES}</style>

      <div className="relative mb-8 flex items-center justify-center">
        {resolveIcon()}
      </div>

      <p className="text-sm font-medium" style={{
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {message || defaultMessages[mode]}
      </p>
    </div>
  );
};
