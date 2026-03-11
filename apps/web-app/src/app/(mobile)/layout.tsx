import { BottomTabs } from '../../components/layout/BottomTabs';
import { NetworkStatus } from '../../components/shared/NetworkStatus';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-shell">
      <NetworkStatus />
      <main className="mobile-shell__content">{children}</main>
      <BottomTabs />
    </div>
  );
}
