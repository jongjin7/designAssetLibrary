import React from 'react';
import { Grid, Star, Clock, Monitor, Search } from 'lucide-react';

export interface NVErrorLayoutProps {
  /** 메인 컨텐츠 (NVErrorView 등) */
  children: React.ReactNode;
  /** 앱 타이틀 (기본: NOVA) */
  title?: string;
  /** 상단 바 상태 라벨 (기본: System Diagnostic) */
  statusLabel?: string;
  /** 상태 라벨 색상 클래스 (기본: text-slate-500) */
  statusColorClass?: string;
}

export const NVErrorLayout: React.FC<NVErrorLayoutProps> = ({ 
  children,
  title = "Trove",
  statusLabel = "System Diagnostic",
  statusColorClass = "text-slate-500"
}) => {
  return (
    <div className="min-h-screen flex h-screen bg-[#0B0E14] overflow-hidden text-slate-50 font-sans selection:bg-indigo-500/30">
      
      {/* Column 1: Structural Sidebar (Minimalist) */}
      <nav 
        className="flex flex-col bg-white/[0.01] border-r border-white/5 transition-all duration-300 ease-in-out app-drag-region w-[260px]"
      >
        <div className="h-10 shrink-0 flex items-center gap-2 pl-3.5" />

        <div className="flex items-center h-11 px-4 mb-6"> 
          <h1 className="pl-3 text-2xl font-black text-white/20 tracking-tighter uppercase leading-none">
            {title}
          </h1>
        </div>
        
        {/* Navigation - Locked/Disabled visual state */}
        <div className="flex-1 px-3 py-4 flex flex-col gap-1 opacity-10 pointer-events-none grayscale">
          {[
            { label: 'Library', icon: Grid },
            { label: 'Favorites', icon: Star },
            { label: 'Activity', icon: Clock }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400">
              <item.icon size={18} strokeWidth={1.5} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Column 2: Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0B0E14]">
        {/* Header Bar */}
        <div className="h-10 border-b border-white/5 flex items-center justify-between px-8 opacity-40">
           <div className={`flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase ${statusColorClass}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusColorClass.replace('text-', 'bg-')} animate-pulse`} />
              {statusLabel}
           </div>
           <div className="flex items-center gap-4 text-slate-500">
              <Monitor size={14} />
              <Search size={14} />
           </div>
        </div>

        <div className="flex-1 relative overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
