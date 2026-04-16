import { LucideIcon, ChevronRight } from 'lucide-react';
import { NVCard, NVSwitch } from '@nova/ui';
import React from 'react';
import Link from 'next/link';

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  sub?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  iconSize?: number;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon: Icon,
  label,
  sub,
  onClick,
  href,
  className = '',
  iconSize = 18
}) => {
  const innerContent = (
    <>
      <Icon size={iconSize} className="flex-shrink-0 text-slate-400 transition-colors group-hover:text-indigo-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-100">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5 truncate">{sub}</p>}
      </div>
      <ChevronRight
        size={14}
        className="flex-shrink-0 opacity-20 text-slate-500 transition-all duration-200 group-hover:opacity-80 group-hover:text-indigo-500 group-hover:translate-x-0.5"
      />
    </>
  );

  const sharedClass = `group w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] text-left hover:bg-white/[0.06] hover:border-white/[0.2] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 ${className}`;

  if (href) {
    return (
      <Link href={href} className={sharedClass}>
        {innerContent}
      </Link>
    );
  }

  return (
    <button className={sharedClass} onClick={onClick}>
      {innerContent}
    </button>
  );
};

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  className = ''
}) => {
  return (
    <NVCard className={`mb-6 !p-5 ${className}`} hoverEffect={false}>
      <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider px-1 mb-4 opacity-70">
        {title}
      </h4>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </NVCard>
  );
};

// ─── 서브페이지 공통 컴포넌트 ─────────────────────────────────────────────────

interface SettingsSwitchRowProps {
  icon: LucideIcon;
  label: string;
  sub?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  iconSize?: number;
}

/** 아이콘 + 라벨 + 토글 스위치 행 */
export const SettingsSwitchRow: React.FC<SettingsSwitchRowProps> = ({
  icon: Icon,
  label,
  sub,
  checked,
  onChange,
  disabled = false,
  iconSize = 17,
}) => (
  <div className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/[0.04]'}`}>
    <div className="flex items-center gap-3 min-w-0 pr-4">
      <Icon size={iconSize} className="text-slate-400 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-100">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
    <NVSwitch checked={checked} onChange={onChange} disabled={disabled} size="sm" />
  </div>
);

interface SettingsDangerItemProps {
  icon: LucideIcon;
  label: string;
  sub?: string;
  onClick?: () => void;
}

/** 위험 구역 버튼 행 */
export const SettingsDangerItem: React.FC<SettingsDangerItemProps> = ({
  icon: Icon,
  label,
  sub,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="group flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left hover:bg-red-500/[0.06] transition-all"
  >
    <Icon size={17} className="text-red-400/60 group-hover:text-red-400 flex-shrink-0 transition-colors" />
    <div>
      <p className="text-sm font-semibold text-red-400/80 group-hover:text-red-400 transition-colors">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
    </div>
  </button>
);

