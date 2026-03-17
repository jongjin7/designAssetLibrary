'use client';

import Link from 'next/link';

import { cn } from '../../lib/utils';

interface TopBarProps {
  rightElement?: React.ReactNode;
  className?: string;
  sticky?: boolean;
  children?: React.ReactNode;
}

export function TopBar({ rightElement, className, sticky = true, children }: TopBarProps) {
  return (
    <header className={cn(
      "z-[60] flex flex-col w-full",
      sticky && "sticky top-0 bg-slate-950/80 backdrop-blur-3xl border-b border-white/[0.08] shadow-2xl",
      !sticky && "bg-transparent",
      className
    )}>
      <div className="flex items-center justify-between px-6 pt-[calc(14px+env(safe-area-inset-top,0px))] pb-3.5">
        <Link href="/library" className="group">
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-indigo-500 to-cyan-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            NOVA
          </h1>
        </Link>
        {rightElement && <div>{rightElement}</div>}
      </div>
      {children}
    </header>
  );
}

