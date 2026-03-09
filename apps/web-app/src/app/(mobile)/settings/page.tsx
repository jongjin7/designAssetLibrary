'use client';

import { User, Bell, Shield, Palette, HelpCircle, LogOut, ChevronRight } from 'lucide-react';

const settingsGroups = [
  {
    title: '계정',
    items: [
      { icon: User, label: '프로필 설정', sub: 'user@nova.design' },
      { icon: Bell, label: '알림 설정', sub: '업로드 완료, AI 분류' },
    ],
  },
  {
    title: '앱 설정',
    items: [
      { icon: Shield, label: '개인정보 및 보안', sub: 'EXIF 자동 제거' },
      { icon: Palette, label: '디자인 테마', sub: 'Dark Mode' },
    ],
  },
  {
    title: '지원',
    items: [
      { icon: HelpCircle, label: '도움말 및 피드백' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <section className="settings-screen">
      <header className="settings-screen__header">
        <h1>설정</h1>
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

      {settingsGroups.map(group => (
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

      <p className="settings-version">NOVA v1.0.0 (Sprint 1)</p>
    </section>
  );
}
