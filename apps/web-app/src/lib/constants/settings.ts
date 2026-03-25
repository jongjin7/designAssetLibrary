import { User, Bell, Shield, Palette, HelpCircle, LayoutGrid, Database, LucideIcon } from 'lucide-react';

export interface SettingsItemType {
  icon: LucideIcon;
  label: string;
  sub?: string;
}

export interface SettingsGroup {
  title: string;
  items: SettingsItemType[];
}

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    title: '워크스페이스',
    items: [
      { icon: LayoutGrid, label: '현재 워크스페이스', sub: 'Trove Core Design System' },
      { icon: Database, label: '스토리지 현황', sub: '1.2 GB / 10.0 GB 사용 중 (12%)' },
    ],
  },
  {
    title: '계정 및 보안',
    items: [
      { icon: User, label: '개인정보 설정', sub: 'nova_architect@nova.design' },
      { icon: Bell, label: '알림 및 푸시', sub: '중요 업데이트 및 업로드 알림 활성' },
      { icon: Shield, label: '보안 정책', sub: '2단계 인증 사용 중 · EXIF 자동 필터링 활성' },
    ],
  },
  {
    title: '환경 설정',
    items: [
      { icon: Palette, label: '디자인 테마', sub: 'Dark (Deep Violet Mode)' },
      { icon: HelpCircle, label: '고객 센터 및 피드백', sub: '도움말 확인 및 1:1 기술 지원' },
    ],
  },
];
