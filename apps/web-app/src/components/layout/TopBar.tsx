'use client';

import Link from 'next/link';

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <Link href="/library" className="group">
        <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-indigo-500 to-cyan-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
          NOVA
        </h1>
      </Link>
    </header>

  );
}
