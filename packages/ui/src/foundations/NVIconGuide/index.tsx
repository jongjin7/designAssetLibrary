'use client';

import React from 'react';
import { 
  Plus, Search, Filter, Settings, Trash2, Heart, Share2, 
  Download, Eye, Edit3, Image as ImageIcon, FileText, 
  ChevronRight, ArrowLeft, X, Check, Copy, MoreHorizontal
} from 'lucide-react';

import { FoundationHeader } from '../shared/FoundationHeader';
import { SectionTitle } from '../shared/SectionTitle';

const sizeTokens = [
  { name: "Small (xs)", class: "w-3 h-3", value: "12px", usage: "Inline labels, small buttons" },
  { name: "Medium (sm)", class: "w-4 h-4", value: "16px", usage: "Standard buttons, menu items" },
  { name: "Large (md)", class: "w-5 h-5", value: "20px", usage: "Card actions, page headers" },
  { name: "Giant (lg)", class: "w-8 h-8", value: "32px", usage: "Empty states, giant avatars" },
];

const coreIcons = [
  { icon: Search, name: "Search" },
  { icon: Filter, name: "Filter" },
  { icon: Settings, name: "Settings" },
  { icon: Plus, name: "Plus" },
  { icon: Trash2, name: "Delete" },
  { icon: Heart, name: "Favorite" },
  { icon: Share2, name: "Share" },
  { icon: Download, name: "Download" },
  { icon: Eye, name: "View" },
  { icon: Edit3, name: "Edit" },
  { icon: ImageIcon, name: "Asset" },
  { icon: FileText, name: "Document" },
];

export function NVIconGuide() {
  return (
    <div className="flex flex-col max-w-6xl mx-auto py-10">
      <FoundationHeader
        title="Iconography System"
        description="NOVA의 아이콘 시스템은 명확한 기능적 은유와 시각적 균형을 지향합니다. 2px의 일정한 선 두께를 유지하여 정밀한 전문가 도구의 감각을 전달하세요."
      />

      <div className="space-y-24">
        {/* Core Icons Grid */}
        <section className="flex flex-col gap-10">
           <SectionTitle className="mb-4">Standard Core Icons</SectionTitle>
           <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
             {coreIcons.map((item, i) => (
               <div key={i} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-indigo-500/30 transition-all pointer-events-none group">
                  <item.icon size={20} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-none">{item.name}</span>
               </div>
             ))}
           </div>
        </section>

        {/* Sizing Scale */}
        <section className="flex flex-col gap-8">
           <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
            Icon Sizing Tokens <div className="h-px bg-white/5 flex-grow" />
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {sizeTokens.map((token, i) => (
               <div key={i} className="flex items-center gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="w-12 h-12 flex items-center justify-center bg-slate-900 rounded-xl border border-white/5">
                    <ImageIcon className={token.class} />
                  </div>
                  <div className="flex flex-col flex-grow">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-100">{token.name}</span>
                        <code className="text-[10px] font-mono text-indigo-400/80">{token.value}</code>
                     </div>
                     <p className="text-[10px] text-slate-500 mt-1">{token.usage}</p>
                  </div>
               </div>
             ))}
           </div>
        </section>
      </div>
    </div>
  );
}
