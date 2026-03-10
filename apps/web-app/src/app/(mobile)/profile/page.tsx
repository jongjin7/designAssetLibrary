'use client';

import { User, Bell, Shield, Palette, HelpCircle, LogOut, ChevronRight, Database, LayoutGrid } from 'lucide-react';
import { InstallBanner } from '../../../components/shared/InstallBanner';

const profileGroups = [
  {
    title: '워크스페이스',
    items: [
      { icon: LayoutGrid, label: '현재 워크스페이스', sub: 'Design Asset Library' },
      { icon: Database, label: '스토리지 현황', sub: '1.2GB / 5.0GB 사용 중' },
    ],
  },
  {
    title: '계정 및 보안',
    items: [
      { icon: User, label: '개인정보 설정', sub: 'user@nova.design' },
      { icon: Bell, label: '알림 및 푸시', sub: '업로드 완료 알림 활성' },
      { icon: Shield, label: '보안 정책', sub: 'EXIF 자동 제거 활성' },
    ],
  },
  {
    title: '환경 설정',
    items: [
      { icon: Palette, label: '디자인 테마', sub: 'Dark (System Default)' },
      { icon: HelpCircle, label: '고객 센터 및 피드백' },
    ],
  },
];

export default function ProfilePage() {
  return (
    <section className="settings-screen">
      <header className="settings-screen__header">
        <h1>프로필</h1>
      </header>

      <div className="settings-screen__profile">
        <div className="settings-screen__avatar">
          <User size={28} />
        </div>
        <div>
          <p className="settings-screen__name">NOVA Designer</p>
          <p className="settings-screen__email">user@nova.design</p>
        </div>
      </div>

      {/* 앱 설치 배너 - 설치 가능한 경우에만 노출 */}
      <div className="profile-install-banner">
        <InstallBanner showClose={false} />
      </div>

      {profileGroups.map(group => (
        <div key={group.title} className="settings-group">
          <p className="settings-group__title">{group.title}</p>
          {group.items.map(item => (
            <button key={item.label} className="settings-item">
              <item.icon size={18} className="settings-item__icon" />
              <div className="settings-item__text">
                <p className="settings-item__label">{item.label}</p>
                {item.sub && <p className="settings-item__sub">{item.sub}</p>}
              </div>
              <ChevronRight size={16} className="settings-item__arrow" />
            </button>
          ))}
        </div>
      ))}

      <button className="settings-logout">
        <LogOut size={18} />
        <span>로그아웃</span>
      </button>

      <p className="settings-version">NOVA v1.1.0 (Mobile Optimized)</p>
    </section>
  );
}
