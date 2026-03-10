'use client';

import Link from 'next/link';

export function TopBar() {
  return (
    <header className="top-bar">
      <Link href="/library" className="top-bar__logo">
        <h1>NOVA</h1>
      </Link>
    </header>
  );
}
