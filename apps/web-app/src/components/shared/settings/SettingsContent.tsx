'use client';

import { LogOut } from 'lucide-react';
import { NVButton } from '@nova/ui';
import { SETTINGS_GROUPS } from '../../../lib/constants/settings';
import { SettingsSection, SettingsItem } from './SettingsComponents';
import { InstallBanner } from '../InstallBanner';
import { ProfileCard } from './ProfileCard';

interface SettingsContentProps {
  isMobile?: boolean;
  onLogout?: () => void;
}

// Tailwind Safelist Hint: text-rose-500 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500
export function SettingsContent({ isMobile = false, onLogout }: SettingsContentProps) {
  return (
    <section className={`py-3 ${!isMobile ? 'max-w-[1200px] mx-auto w-full' : ''}`}>
      <header className={`flex flex-col ${isMobile ? 'px-7 pt-2 pb-4' : 'text-center p-0 mb-10'}`}>
        <h1 className={`${isMobile ? 'text-[28px]' : 'text-[32px] tracking-tight'} font-extrabold text-white`}>
          설정
        </h1>
      </header>

      <div className={`px-5 ${!isMobile ? 'w-full mb-2' : ''}`}>
        < ProfileCard
          name="NOVA Designer"
          email="user@nova.design"
        />
      </div>

      <div className="px-5">
        <InstallBanner showClose={false} className="static mb-8 !animate-none" />
      </div>

      <div className={`px-5 ${!isMobile ? 'grid grid-cols-1 lg:grid-cols-2 gap-x-6' : 'flex flex-col gap-1'}`}>
        {SETTINGS_GROUPS.map((group, index) => (
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
        NOVA v1.1.0 {isMobile ? '(Mobile Optimized)' : '(Desktop View)'}
      </p>
    </section>
  );
}

