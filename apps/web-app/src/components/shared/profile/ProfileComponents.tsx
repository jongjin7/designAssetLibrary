import { LucideIcon, ChevronRight, User, LogOut } from 'lucide-react';
import { NVButton, NVCard } from '@nova/ui';
import React from 'react';

interface ProfileItemProps {
  icon: LucideIcon;
  label: string;
  sub?: string;
  onClick?: () => void;
  className?: string;
  iconSize?: number;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({
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
      <Icon size={iconSize} className="flex-shrink-0 text-slate-500 transition-colors group-hover:text-indigo-500" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-50">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5 truncate">{sub}</p>}
      </div>
      <ChevronRight 
        size={14} 
        className="flex-shrink-0 opacity-20 text-slate-500 transition-all duration-200 group-hover:opacity-80 group-hover:text-indigo-500 group-hover:translate-x-0.5" 
      />
    </button>
  );
};

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
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

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarIcon?: LucideIcon;
  onLogout?: () => void;
  showLogout?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  avatarIcon: AvatarIcon = User,
  onLogout,
  showLogout
}) => {
  return (
    <NVCard 
      className="relative flex items-center gap-8 p-4 mb-8 overflow-hidden !bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)] backdrop-blur-[40px] border border-white/[0.08] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]" 
      hoverEffect={false}
    >
      <div className="relative z-[2] flex-shrink-0 w-20 h-20 rounded-[20px] bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center color-white shadow-[0_12px_24px_rgba(99,102,241,0.3)]">
        <AvatarIcon size={32} className="text-white" />
      </div>
      <div className="flex-1 z-[2]">
        <h3 className="text-xl font-extrabold text-white mb-0.5 tracking-tight">{name}</h3>
        <p className="text-sm text-white/50 font-medium">{email}</p>
      </div>
      {showLogout && (
        <NVButton
          variant="danger"
          size="sm"
          onClick={onLogout}
          className="z-[2]"
        >
          <LogOut size={16} />
          로그아웃
        </NVButton>
      )}
    </NVCard>
  );
};

