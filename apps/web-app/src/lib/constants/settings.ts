import { User, Bell, Shield, Palette, HelpCircle, LayoutGrid, Database, LucideIcon, Chrome, Monitor, Zap } from 'lucide-react';

export interface SettingsItemType {
  icon: LucideIcon;
  label: string;
  sub?: string;
  sprint: number;
}

export interface SettingsGroup {
  title: string;
  items: SettingsItemType[];
}

export const SETTINGS_GROUPS: SettingsGroup[] = [
  {
    title: '워크스페이스',
    items: [
      { icon: LayoutGrid, label: '현재 워크스페이스', sub: 'Trove Core Design System', sprint: 1 },
      { icon: Database, label: '스토리지 및 캐시', sub: '1.2 GB 사용 중 · 오프라인 모드 활성', sprint: 1 },
      { icon: Zap, label: '라이브러리 자동화', sub: 'Smart Folder 및 자동 태그 규칙 관리', sprint: 2 },
    ],
  },
  {
    title: '통합 및 확장',
    items: [
      { icon: Chrome, label: '브라우저 확장 프로그램', sub: '6가지 캡처 모드 동기화 및 관리', sprint: 2 },
      { icon: Monitor, label: '데스크탑 앱 설정', sub: '글로벌 단축키 및 네이티브 기능 제어', sprint: 2 },
    ],
  },
  {
    title: '계정 및 보안',
    items: [
      { icon: User, label: '개인정보 설정', sub: 'nova_architect@nova.design', sprint: 1 },
      { icon: Bell, label: '알림 및 푸시', sub: '중요 업데이트 및 업로드 알림 활성', sprint: 1 },
      { icon: Shield, label: '보안 정책', sub: '2단계 인증 사용 중 · EXIF 자동 필터링 활성', sprint: 1 },
    ],
  },
  {
    title: '환경 설정',
    items: [
      { icon: Palette, label: '디자인 테마', sub: 'Dark (Deep Violet Mode)', sprint: 1 },
      { icon: HelpCircle, label: '고객 센터 및 피드백', sub: '도움말 확인 및 1:1 기술 지원', sprint: 1 },
    ],
  },
];
