'use client';

import { LogOut } from 'lucide-react';
import { NVButton } from '@nova/ui';
import { PROFILE_GROUPS } from '../../../lib/constants/profile';
import { ProfileSection, ProfileItem, ProfileHeader } from './ProfileComponents';
import { InstallBanner } from '../InstallBanner';

interface SettingsContentProps {
  isMobile?: boolean;
  onLogout?: () => void;
}

// Tailwind Safelist Hint: text-rose-500 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500
export function SettingsContent({ isMobile = false, onLogout }: SettingsContentProps) {
  return (
    <section className={`py-3 ${!isMobile ? 'settings-screen--desktop' : ''}`}>
      <header className={`settings-screen__header ${isMobile ? 'px-7 pt-2 pb-4' : ''}`}>
        <h1 className="text-[28px] font-bold">설정</h1>
      </header>

      <div className="settings-screen__content settings-screen__content-profile">
        <ProfileHeader
          name="NOVA Designer"
          email="user@nova.design"
        />
      </div>

      {isMobile && (
        <div className="settings-screen__content">
          <InstallBanner showClose={false} className="static" />
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

      <div className="flex justify-center px-5">
        <NVButton
        variant="danger"
        size="md"
        className={(isMobile ? 'w-full mt-4 mb-2.5' : 'mt-12 mb-6')}
        onClick={onLogout}
      >
        <LogOut size={isMobile ? 18 : 20} />
        로그아웃
      </NVButton>
      </div>
      

      <p className="settings-version mt-4">
        NOVA v1.1.0 {isMobile ? '(Mobile Optimized)' : '(Desktop View)'}
      </p>
    </section>
  );
}
