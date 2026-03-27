'use client';

import { LogOut } from 'lucide-react';
import { NVButton } from '@nova/ui';
import { SETTINGS_GROUPS } from '@nova/lib/constants/settings';
import { SettingsSection, SettingsItem } from './SettingsComponents';
import { InstallBanner } from '@nova/components/shared/InstallBanner';
import { ProfileCard } from './ProfileCard';

import { useAuth } from '@nova/providers/AuthProvider';

interface SettingsContentProps {
  isMobile?: boolean;
  onLogout?: () => void;
}

export function SettingsContent({ isMobile = false, onLogout }: SettingsContentProps) {
  const { profile, loading } = useAuth();
  
  // 현재 개발 단계 (Sprint 1) 기준으로 필터링
  const CURRENT_SPRINT = 1;
  const filteredGroups = SETTINGS_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => item.sprint <= CURRENT_SPRINT)
  })).filter(group => group.items.length > 0);

  const userName = profile?.name || '사용자';
  const userEmail = profile?.email || (loading ? '불러오는 중...' : '로그인 정보 없음');
  const avatarUrl = profile?.avatarUrl;

  return (
    <section className={`py-3 ${!isMobile ? 'max-w-[1200px] mx-auto w-full' : ''}`}>
      <header className={`flex flex-col ${isMobile ? 'px-7 pt-2 pb-4' : 'text-center p-0 mb-10'}`}>
        <h1 className={`${isMobile ? 'text-[28px]' : 'text-[32px] tracking-tight'} font-extrabold text-white`}>
          설정
        </h1>
      </header>

      <div className={`px-5 ${!isMobile ? 'w-full mb-2' : ''}`}>
        <ProfileCard
          name={userName}
          email={userEmail}
          avatarUrl={avatarUrl}
        />
      </div>

      <div className="px-5">
        <InstallBanner showClose={false} className="static mb-8 !animate-none" />
      </div>

      <div className={`px-5 ${!isMobile ? 'grid grid-cols-1 lg:grid-cols-2 gap-x-6' : 'flex flex-col gap-1'}`}>
        {filteredGroups.map((group, index) => (
          <div 
            key={group.title} 
            className={`${!isMobile ? 'h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both' : ''}`}
            style={!isMobile ? { animationDelay: `${(index + 1) * 100}ms` } : undefined}
          >
            <SettingsSection title={group.title} className="h-full">

              {group.items.map(item => (
                <SettingsItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  sub={item.sub}
                />
              ))}
            </SettingsSection>
          </div>
        ))}
      </div>


      <div className="flex justify-center px-5">
        <NVButton
          variant="danger"
          size="md"
          className={(isMobile ? 'w-full mt-4 mb-2.5' : 'mt-12 mb-6 w-full max-w-[200px]')}
          onClick={onLogout}
        >
          <LogOut size={isMobile ? 18 : 20} />
          로그아웃
        </NVButton>
      </div>


      <p className={`text-center text-xs text-slate-500 p-4 mt-4 ${!isMobile ? 'opacity-50' : ''}`}>
        Trove v1.1.0
      </p>
    </section>
  );
}

