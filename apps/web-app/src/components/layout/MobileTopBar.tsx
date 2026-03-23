'use client';

import Link from 'next/link';

import { cn } from '../../lib/utils';

interface MobileTopBarProps {
  rightElement?: React.ReactNode;
  className?: string;
  sticky?: boolean;
  children?: React.ReactNode;
}

export function MobileTopBar({ rightElement, className, sticky = true, children }: MobileTopBarProps) {
  return (
    <header className={cn(
      "z-[60] flex flex-col w-full",
      sticky && "sticky top-0 bg-slate-950/80 backdrop-blur-3xl  shadow-xl shadow-black/30",
      !sticky && "bg-transparent",
      className
    )}>
      <div className="flex items-center justify-between px-5 pt-[calc(10px+env(safe-area-inset-top,0px))] pb-2 border-b border-white/[0.08]">
        <Link href="/library" className="group">
          <h1 className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
            NOVA
          </h1>
        </Link>
        {rightElement ? (
          <div className="flex items-center gap-3">
            {rightElement}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
             <div className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-500/40" />
          </div>
        )}
      </div>
      <div>
        {children}
      </div>
    </header>
  );
}

