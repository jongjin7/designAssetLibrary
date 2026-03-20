'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Grid2x2, Camera, User } from 'lucide-react';

const tabs = [
  { label: 'Library', icon: Grid2x2, href: '/library' },
  { label: 'Capture', icon: Camera, href: '/capture', isCenter: true },
  { label: 'Profile', icon: User, href: '/profile' },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname === '/capture') return null;

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[760px] flex items-center justify-around px-3 py-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))] bg-slate-950/90 backdrop-blur-xl border-t border-white/5 z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        if (tab.isCenter) {
          return (
            <Link 
              key={tab.href} 
              href={tab.href} 
              className="w-13 h-13 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-[0_4px_20px_rgba(99,102,241,0.35)] transition-transform active:scale-90 -mt-6" 
              aria-label={tab.label}
            >
              <Icon size={22} strokeWidth={2.5} />
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors px-3 py-1.5 ${isActive ? 'text-indigo-500' : 'text-slate-500 hover:text-slate-300'}`}
            aria-label={tab.label}
          >
            <Icon size={20} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>

  );
}
