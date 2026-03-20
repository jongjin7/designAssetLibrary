'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Copy, CheckCircle2, Type } from 'lucide-react';

interface TypoSpec {
  name: string;
  classes: string;
  category: string;
  sampleEn: string;
  sampleKo: string;
  usage: string;
}

import { FoundationHeader } from '../shared/FoundationHeader';
import { SectionTitle } from '../shared/SectionTitle';

const styles: TypoSpec[] = [
  { 
    category: "Display & Headlines", 
    name: "Hero Display", 
    classes: "text-4xl font-extrabold tracking-tighter",
    usage: "Logo, Hero landing headers, Major state callouts.",
    sampleEn: "Fluid Premium",
    sampleKo: "유동적인 프리미엄"
  },
  { 
    category: "Display & Headlines", 
    name: "Page Header", 
    classes: "text-2xl font-extrabold tracking-tight",
    usage: "Sidebar headers, Gallery section titles, Asset names.",
    sampleEn: "Asset Architecture",
    sampleKo: "에셋 아키텍처"
  },
  { 
    category: "Body & Content", 
    name: "Primary Body", 
    classes: "text-base font-normal leading-relaxed text-slate-100",
    usage: "Descriptions, long-form messages, active reading items.",
    sampleEn: "Nova provides a seamless interface for professional designers.",
    sampleKo: "노바는 전문 디자이너를 위해 매끄러운 인터페이스를 제공합니다."
  },
  { 
    category: "Body & Content", 
    name: "Secondary Info", 
    classes: "text-xs font-semibold text-slate-400",
    usage: "File sizes, dates, small labels, input placeholders.",
    sampleEn: "Last updated on March 20, 2024",
    sampleKo: "최근 업데이트: 2024년 3월 20일"
  },
  { 
    category: "System Utility", 
    name: "Atomic Label", 
    classes: "text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-none",
    usage: "Chips, tabs, small section delimiters. Must be uppercase.",
    sampleEn: "TAGS / CATEGORY",
    sampleKo: "태그 / 카테고리"
  },
];

const CopyToken = ({ code, label }: { code: string, label?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      onClick={handleCopy}
      className="group/token flex items-center justify-between gap-3 px-3 py-2 rounded bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-indigo-500/30 transition-all cursor-pointer"
    >
      <div className="flex flex-col">
        {label && <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter mb-0.5">{label}</span>}
        <code className="text-xs font-mono text-indigo-300 group-hover/token:text-white transition-colors">{code}</code>
      </div>
      {copied ? <CheckCircle2 size={12} className="text-emerald-400 shrink-0" /> : <Copy size={12} className="text-slate-600 opacity-0 group-hover/token:opacity-100 shrink-0" />}
    </div>
  );
};

const TypoRow = ({ name, classes, sampleEn, sampleKo, usage }: TypoSpec) => (
  <tr className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors group">
    <td className="py-10 pr-10 align-top min-w-[220px]">
      <div className="flex items-center gap-3 mb-3">
        <label className="text-[12px] font-extrabold text-slate-100 uppercase tracking-tight">{name}</label>
      </div>
      <CopyToken code={classes} label="Apply Tailwind Set" />
    </td>
    <td className="py-10 px-10 align-top">
      <div className="flex flex-col gap-8">
         <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest pl-0.5">English</span>
            <p className={cn("text-slate-50", classes)}>{sampleEn}</p>
         </div>
         <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest pl-0.5">Korean</span>
            <p className={cn("text-slate-50", classes)}>{sampleKo}</p>
         </div>
      </div>
    </td>
    <td className="py-10 pl-10 align-top max-w-[220px]">
       <p className="text-xs text-slate-500 leading-relaxed font-medium mt-6">
        <span className="text-slate-300 font-bold uppercase text-[10px] block mb-1">Usage Case</span>
        {usage}
      </p>
    </td>
  </tr>
);

const TypeScalePoster = ({ styles }: { styles: TypoSpec[] }) => {
  return (
    <div className="flex flex-col gap-16 mb-24 py-12 px-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
        <Type size={400} strokeWidth={1} />
      </div>
      {styles.map((style, i) => (
        <div key={i} className="group flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 relative">
          <div className="w-32 shrink-0">
             <span className="text-[10px] font-bold text-indigo-500/50 uppercase tracking-widest block mb-1">
               {style.name}
             </span>
             <span className="text-[9px] font-mono text-slate-600 block">
               {style.classes.split(' ').find(c => c.startsWith('text-'))}
             </span>
          </div>
          <div className="flex-grow">
            <p className={cn("text-slate-50 transition-all group-hover:text-indigo-400", style.classes)}>
              {style.sampleEn}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export function NVTypographyGuide() {
  const categories = Array.from(new Set(styles.map(s => s.category)));

  return (
    <div className="flex flex-col max-w-6xl mx-auto py-10">
      <FoundationHeader 
        title="Typography Foundations" 
        description="NOVA의 타이포그래피는 Pretendard Variable을 기반으로 정보 계층을 명확히 전달합니다. 한글과 영문의 가독성을 확인하고 정의된 클래스 조합을 사용하여 최적의 텍스트 리듬을 구현하세요." 
      />

      <section className="mb-20">
        <SectionTitle className="mb-10">Visual Type Scale Hierarchy</SectionTitle>
        <TypeScalePoster styles={styles} />
      </section>

      <div className="space-y-32">
        {categories.map((cat, i) => (
          <div key={i} className="flex flex-col gap-10">
             <SectionTitle variant="secondary" className="pl-1 leading-none">{cat}</SectionTitle>
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="border-b-2 border-white/[0.04]">
                   <th className="py-4 pr-10 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Style Definition</th>
                   <th className="py-4 px-10 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Multi-language Preview</th>
                   <th className="py-4 pl-10 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Context</th>
                 </tr>
               </thead>
               <tbody>
                  {styles.filter(s => s.category === cat).map((style, j) => (
                    <TypoRow key={j} {...style} />
                  ))}
               </tbody>
             </table>
          </div>
        ))}
      </div>
    </div>
  );
}
