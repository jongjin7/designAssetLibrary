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
      className={`shared-profile-item w-full flex items-center gap-3.5 px-4 py-3 hover:bg-white/[0.05] rounded-xl transition-all text-left ${className}`}
      onClick={onClick}
    >
      <Icon size={iconSize} className="flex-shrink-0 text-slate-500" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-50">{label}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5 truncate">{sub}</p>}
      </div>
      <ChevronRight size={14} className="shared-profile-item__arrow flex-shrink-0 opacity-20 text-slate-500" />
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
    <NVCard className={`shared-profile-section mb-6 !p-5 ${className}`} hoverEffect={false}>
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
    <NVCard className="shared-profile-header flex items-center gap-8 p-4 mb-8" hoverEffect={false}>
      <div className="shared-profile-header__avatar">
        <AvatarIcon size={32} />
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
        >
          <LogOut size={16} />
          로그아웃
        </NVButton>
      )}
    </NVCard>
  );
};
