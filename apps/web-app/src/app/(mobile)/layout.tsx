import { MobileBottomNav } from '../../components/layout/MobileBottomNav';
import { NetworkStatus } from '../../components/shared/NetworkStatus';

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen max-w-[760px] mx-auto relative lg:hidden has-[.capture-screen]:pb-0">
      <NetworkStatus />
      <main className="pb-[calc(72px+env(safe-area-inset-bottom,0px))] has-[.capture-screen]:pb-0 has-[.network-status]:pt-[calc(var(--safe-area-top,0px)+28px)]">
        {children}
      </main>
      <div className="has-[.capture-screen]:hidden">
        <MobileBottomNav />
      </div>
    </div>
  );
}
