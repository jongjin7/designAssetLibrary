import { LucideIcon, ChevronRight, User } from 'lucide-react';
import { NVCard } from '@nova/ui';
import React from 'react';

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  sub?: string;
  onClick?: () => void;
  className?: string;
  iconSize?: number;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon: Icon,
  label,
  sub,
  onClick,
  className = '',
  iconSize = 18
}) => {
  return (
    <button
      className={`group w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] text-left hover:bg-white/[0.06] hover:border-white/[0.2] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 ${className}`}
      onClick={onClick}
    >
      <Icon size={iconSize} className="flex-shrink-0 text-slate-400 transition-colors group-hover:text-indigo-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-100">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5 truncate">{sub}</p>}
      </div>
      <ChevronRight 
        size={14} 
        className="flex-shrink-0 opacity-20 text-slate-500 transition-all duration-200 group-hover:opacity-80 group-hover:text-indigo-500 group-hover:translate-x-0.5" 
      />
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
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 mb-4 opacity-70">
        {title}
      </h4>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </NVCard>
  );
};

