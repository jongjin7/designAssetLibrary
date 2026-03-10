'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Grid2x2, Camera, User } from 'lucide-react';

const tabs = [
  { label: 'Library', icon: Grid2x2, href: '/library' },
  { label: 'Capture', icon: Camera, href: '/capture', isCenter: true },
  { label: 'Profile', icon: User, href: '/profile' },
];

export function BottomTabs() {
  const pathname = usePathname();

  if (pathname === '/capture') return null;

  return (
    <nav className="bottom-tabs">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        if (tab.isCenter) {
          return (
            <Link key={tab.href} href={tab.href} className="bottom-tabs__fab" aria-label={tab.label}>
              <Icon size={22} strokeWidth={2.5} />
            </Link>
          );
        }

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`bottom-tabs__item ${isActive ? 'bottom-tabs__item--active' : ''}`}
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
