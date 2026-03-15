'use client';

import { LogOut } from 'lucide-react';
import { PROFILE_GROUPS } from '../../../lib/constants/profile';
import { ProfileSection, ProfileItem, ProfileHeader } from './ProfileComponents';
import { InstallBanner } from '../InstallBanner';

interface SettingsContentProps {
  isMobile?: boolean;
  onLogout?: () => void;
}

export function SettingsContent({ isMobile = false, onLogout }: SettingsContentProps) {
  return (
    <section className={`settings-screen ${!isMobile ? 'settings-screen--desktop' : ''}`}>
      <header className="settings-screen__header">
        <h1>설정</h1>
      </header>

      <div className="settings-screen__content settings-screen__content-profile">
        <ProfileHeader 
          name="NOVA Designer"
          email="user@nova.design"
        />
      </div>

      {isMobile && (
        <div className="settings-screen__content">
          <InstallBanner showClose={false} />
        </div>
      )}

      <div className="settings-screen__content">
        {PROFILE_GROUPS.map(group => (
          <ProfileSection key={group.title} title={group.title}>
            {group.items.map(item => (
              <ProfileItem 
                key={item.label}
                icon={item.icon}
                label={item.label}
                sub={item.sub}
              />
            ))}
          </ProfileSection>
        ))}
      </div>

      <button className="settings-logout" onClick={onLogout}>
        <LogOut size={18} />
        <span>로그아웃</span>
      </button>

      <p className="settings-version">
        NOVA v1.1.0 {isMobile ? '(Mobile Optimized)' : '(Desktop View)'}
      </p>
    </section>
  );
}
