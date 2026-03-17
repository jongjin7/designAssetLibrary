'use client';

import Link from 'next/link';

import { cn } from '../../lib/utils';

interface TopBarProps {
  rightElement?: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export function TopBar({ rightElement, className, sticky = true }: TopBarProps) {
  return (
    <header className={cn(
      "z-20 flex items-center justify-between px-6",
      sticky && "sticky top-0 bg-slate-950/80 backdrop-blur-xl border-b border-white/5",
      !sticky && "bg-transparent",
      "pt-[calc(14px+env(safe-area-inset-top,0px))] pb-3.5",
      className
    )}>
      <Link href="/library" className="group">
        <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-indigo-500 to-cyan-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
          NOVA
        </h1>
      </Link>
      {rightElement && <div>{rightElement}</div>}
    </header>
  );
}

