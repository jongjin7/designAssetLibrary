'use client';

import { LogOut, Trash2 } from 'lucide-react';
import { NVButton, useToast } from '@nova/ui';
import { SETTINGS_GROUPS } from '@nova/lib/constants/settings';
import { SettingsSection, SettingsItem } from './SettingsComponents';
import { InstallBanner } from '@nova/components/shared/InstallBanner';
import { ProfileCard } from './ProfileCard';

import { useAuth } from '@nova/providers/AuthProvider';
import { useAssetStore } from '@nova/store/useAssetStore';

interface SettingsContentProps {
  isMobile?: boolean;
  onLogout?: () => void;
}

export function SettingsContent({ isMobile = false, onLogout }: SettingsContentProps) {
  const { profile, loading } = useAuth();
  const { resetLibrary } = useAssetStore();
  const { toast } = useToast();
  
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
                  href={item.href}
                />
              ))}
            </SettingsSection>
          </div>
        ))}
        
        {/* 위험 구역 섹션 추가 (로그아웃과 격리) */}
        <div className={`${!isMobile ? 'animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both' : ''}`}>
          <SettingsSection title="위험 구역" className="!bg-red-500/5 border-red-500/20">
            <div className="flex flex-col md:flex-row items-center justify-between h-full gap-2 md:gap-4 py-2">
              <p className="text-xs text-slate-500">
                라이브러리를 초기화하면 로컬에 저장된 모든 에셋과 설정이 영구적으로 삭제됩니다.
              </p>
              <NVButton
                variant="glass"
                size="sm"
                className="opacity-50 hover:opacity-100"
                onClick={async () => {
                  if (confirm('정말 라이브러리를 초기화하시겠습니까? 모든 로컬 데이터가 삭제됩니다.')) {
                    await resetLibrary();
                    toast('라이브러리가 초기화되었습니다.', { type: 'success' });
                  }
                }}
              >
                <Trash2 size={16} className="mr-2" />
                라이브러리 데이터 초기화
              </NVButton>
            </div>
          </SettingsSection>
        </div>
      </div>


      <div className="flex justify-center px-5 mt-10 mb-8 items-center">
        <NVButton
          variant="danger"
          size="md"
          className={(isMobile ? 'w-full' : 'w-full max-w-[200px]')}
          onClick={onLogout}
        >
          <LogOut size={isMobile ? 18 : 20} className="mr-2" />
          로그아웃
        </NVButton>
      </div>


      <p className={`text-center text-xs text-slate-500 p-4 mt-4 ${!isMobile ? 'opacity-50' : ''}`}>
        Trove v1.1.0
      </p>
    </section>
  );
}

