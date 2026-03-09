'use client';

import { BottomTabs } from '../../components/layout/BottomTabs';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-shell">
      <main className="mobile-shell__content">{children}</main>
      <BottomTabs />
    </div>
  );
}
