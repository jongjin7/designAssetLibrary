'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface SpacingToken {
  name: string;
  value: string;
  pixels: string;
}

import { FoundationHeader } from '../shared/FoundationHeader';
import { SectionTitle } from '../shared/SectionTitle';

const spacingTokens: SpacingToken[] = [
  { name: "0.5", value: "sp-0.5", pixels: "2px" },
  { name: "1", value: "sp-1", pixels: "4px" },
  { name: "2", value: "sp-2", pixels: "8px" },
  { name: "3", value: "sp-3", pixels: "12px" },
  { name: "4", value: "sp-4", pixels: "16px" },
  { name: "6", value: "sp-6", pixels: "24px" },
  { name: "8", value: "sp-8", pixels: "32px" },
  { name: "12", value: "sp-12", pixels: "48px" },
];

const radiusTokens = [
  { name: "Small", class: "rounded-sm", value: "4px", usage: "Mini buttons, tags" },
  { name: "Medium", class: "rounded-md", value: "6px", usage: "Standard buttons, inputs" },
  { name: "Large", class: "rounded-lg", value: "8px", usage: "Main components, sub-cards" },
  { name: "Extra Large", class: "rounded-xl", value: "12px", usage: "Cards, Modals" },
  { name: "2XL", class: "rounded-2xl", value: "16px", usage: "Floating menus, large cards" },
];

export function NVSpacingGuide() {
  return (
    <div className="flex flex-col max-w-6xl mx-auto py-10">
      <FoundationHeader 
        title="Spacing & Radius" 
        description="NOVA의 간격과 곡률 시스템은 인터페이스의 리듬과 시각적 안정감을 결정합니다. 4px 배수 시스템을 준수하여 정교하게 설계된 레이아웃과 형태를 구성하세요." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Spacing Scale */}
        <section className="flex flex-col gap-10">
           <SectionTitle className="mb-2">Spacing Scale</SectionTitle>
           <div className="flex flex-col gap-4">
             {spacingTokens.map((token, i) => (
               <div key={i} className="flex items-center gap-6 group">
                 <div className="w-16 shrink-0 text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
                   {token.name} ({token.pixels})
                 </div>
                 <div className="flex-grow bg-white/[0.02] rounded-full h-8 flex items-center px-1 border border-white/[0.04]">
                   <div 
                     className="bg-indigo-500/40 h-4 rounded-full transition-all group-hover:bg-indigo-500" 
                     style={{ width: token.pixels }} 
                   />
                 </div>
                 <code className="text-[10px] font-mono text-indigo-300 opacity-50 group-hover:opacity-100 transition-opacity">
                   {token.value}
                 </code>
               </div>
             ))}
           </div>
        </section>

        {/* Corner Radius */}
        <section className="flex flex-col gap-10">
           <SectionTitle className="mb-2">Corner Radius</SectionTitle>
           <div className="grid grid-cols-2 gap-4">
             {radiusTokens.map((token, i) => (
               <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] group">
                 <div className={cn("w-full h-20 bg-slate-900 border border-white/10 relative overflow-hidden flex items-center justify-center transition-all group-hover:border-indigo-500/30", token.class)}>
                    <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-bold text-slate-600 group-hover:text-indigo-300 transition-colors uppercase tracking-widest">{token.name}</span>
                 </div>
                 <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-bold text-slate-300">{token.value}</span>
                       <code className="text-[9px] font-mono text-indigo-400/60 uppercase">{token.class}</code>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1 leading-tight">{token.usage}</p>
                 </div>
               </div>
             ))}
           </div>
        </section>
      </div>
    </div>
  );
}
