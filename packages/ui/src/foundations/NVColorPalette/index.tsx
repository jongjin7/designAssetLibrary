'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Copy, CheckCircle2 } from 'lucide-react';

interface ColorToken {
  token: string;
  name: string;
  variable: string;
  value: string;
  group: string;
}

import { FoundationHeader } from '../shared/FoundationHeader';
import { SectionTitle } from '../shared/SectionTitle';

const tokens: ColorToken[] = [
  // Brand
  { group: "Brand Identity", token: "indigo-500", name: "Primary Brand", variable: "--color-indigo-500", value: "#6366F1" },
  { group: "Brand Identity", token: "cyan-500", name: "AI Vivid Point", variable: "--color-cyan-500", value: "#06B6D4" },
  { group: "Brand Identity", token: "rose-500", name: "System Danger", variable: "--color-rose-500", value: "#F43F5E" },
  
  // Surface
  { group: "Surface & Depth", token: "slate-950", name: "Main Canvas", variable: "--color-slate-950", value: "#0B0E14" },
  { group: "Surface & Depth", token: "slate-900", name: "Surface Layer", variable: "--color-slate-900", value: "#111827" },
  { group: "Surface & Depth", token: "glass", name: "Glass Base", variable: "--color-glass", value: "rgba(255,255,255,0.05)" },
  
  // Typography
  { group: "Typography", token: "slate-50", name: "Text Primary", variable: "--color-slate-50", value: "#F8FAFC" },
  { group: "Typography", token: "slate-400", name: "Text Secondary", variable: "--color-slate-400", value: "#94A3B8" },
  { group: "Typography", token: "slate-500", name: "Text Tertiary", variable: "--color-slate-500", value: "#64748B" },
];

const TokenButton = ({ label, code }: { label: string, code: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center gap-2 px-2 py-1 rounded bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all group/btn min-w-[120px] justify-between"
    >
      <div className="flex flex-col items-start">
        <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter leading-none mb-0.5">{label}</span>
        <code className="text-[10px] font-mono text-indigo-300 leading-none group-hover/btn:text-white transition-colors">{code}</code>
      </div>
      {copied ? <CheckCircle2 size={10} className="text-emerald-400 shrink-0" /> : <Copy size={10} className="text-slate-600 opacity-0 group-hover/btn:opacity-100 shrink-0" />}
    </button>
  );
};

const ColorRow = ({ token, name, variable, value }: ColorToken) => {
  return (
    <tr className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-colors group">
      <td className="py-5 pr-6 align-top">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl border border-white/10 shadow-lg shrink-0" style={{ backgroundColor: `var(${variable})` }} />
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-slate-100 leading-tight truncate">{name}</span>
            <span className="text-[10px] font-mono text-slate-500 uppercase mt-0.5">{value}</span>
          </div>
        </div>
      </td>
      <td className="py-5 px-6 align-top">
        <div className="flex flex-wrap gap-2 max-w-[320px]">
          <TokenButton label="BG Class" code={`bg-${token}`} />
          <TokenButton label="Text Class" code={`text-${token}`} />
          <TokenButton label="Border Class" code={`border-${token}`} />
        </div>
      </td>
      <td className="py-5 pl-6 align-top">
         <TokenButton label="CSS Variable" code={variable} />
      </td>
    </tr>
  );
};

const SwatchGrid = ({ tokens }: { tokens: ColorToken[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
      {tokens.map((token, i) => (
        <div key={i} className="group relative flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
          <div 
            className="w-full aspect-square rounded-xl shadow-2xl border border-white/10 overflow-hidden relative"
            style={{ backgroundColor: `var(${token.variable})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-tight">{token.name}</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px] font-mono text-slate-500">{token.value}</span>
              <span className="text-[9px] font-bold text-indigo-400/80 bg-indigo-500/10 px-1.5 py-0.5 rounded leading-none">
                {token.token.split('-').pop()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export function NVColorPalette() {
  const groups = Array.from(new Set(tokens.map(t => t.group)));
  const brandTokens = tokens.filter(t => t.group === "Brand Identity");

  return (
    <div className="flex flex-col max-w-6xl mx-auto py-10">
      <FoundationHeader 
        title="Color Foundations" 
        description="NOVA의 컬러 시스템은 실용적인 개발 사양과 시각적 정체성을 동시에 제공합니다. 스와치를 통해 무드를 확인하고 유틸리티 클래스를 참조하여 일관된 색감을 유지하세요." 
      />

      <section className="mb-20">
        <SectionTitle className="mb-8">Visual Identity Swatches</SectionTitle>
        <SwatchGrid tokens={brandTokens} />
      </section>

      <div className="space-y-24">
        {groups.map((group, i) => (
          <div key={i} className="flex flex-col gap-8">
            <SectionTitle variant="secondary">{group}</SectionTitle>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-white/[0.04]">
                  <th className="py-3 pr-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Token & Visual</th>
                  <th className="py-3 px-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Tailwind Classes</th>
                  <th className="py-3 pl-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">CSS Variable</th>
                </tr>
              </thead>
              <tbody>
                {tokens.filter(t => t.group === group).map((token, j) => (
                  <ColorRow key={j} {...token} />
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
