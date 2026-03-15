import { LucideIcon, ChevronRight, User, LogOut } from 'lucide-react';
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
      className={`shared-profile-item ${className}`}
      onClick={onClick}
    >
      <Icon size={iconSize} className="shared-profile-item__icon" />
      <div className="shared-profile-item__text">
        <p className="shared-profile-item__label">{label}</p>
        {sub && <p className="shared-profile-item__sub">{sub}</p>}
      </div>
      <ChevronRight size={16} className="shared-profile-item__arrow" />
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
    <div className={`shared-profile-section ${className}`}>
      <h4 className="shared-profile-section__title">{title}</h4>
      <div className="shared-profile-section__content">
        {children}
      </div>
    </div>
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
  showLogout = false
}) => {
  return (
    <div className="shared-profile-header">
      <div className="shared-profile-header__avatar">
        <AvatarIcon size={32} />
      </div>
      <div className="shared-profile-header__info">
        <h3>{name}</h3>
        <p>{email}</p>
      </div>
      {showLogout && (
        <button className="shared-profile-header__logout" onClick={onLogout}>
          <LogOut size={16} />
          <span>로그아웃</span>
        </button>
      )}
    </div>
  );
};
