'use client';

import React from 'react';

interface FoundationHeaderProps {
  title: string;
  description: string;
}

export function FoundationHeader({ title, description }: FoundationHeaderProps) {
  return (
    <div className="border-b border-white/[0.08] pb-12 mb-12">
       <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
             <h2 className="text-3xl font-black text-slate-50 tracking-tighter uppercase leading-none">
               {title}
             </h2>
          </div>
          <p className="text-sm md:text-base text-slate-500 max-w-3xl font-medium leading-relaxed">
             {description}
          </p>
       </div>
    </div>
  );
}
