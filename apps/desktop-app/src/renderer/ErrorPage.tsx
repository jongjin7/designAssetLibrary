import React, { useState } from 'react';
import { 
  RotateCcw, 
  Home,
  Monitor,
  Search,
  Grid,
  Star,
  Clock,
  PanelLeft
} from 'lucide-react';
import { 
  NVIconButton,
  NVErrorView
} from '@nova/ui';

const ErrorPage: React.FC = () => {
  const [retryCount, setRetryCount] = useState(0);

  const handleReload = () => {
    setRetryCount(prev => prev + 1);
    window.location.href = 'https://localhost:3000?platform=desktop';
  };


  return (
    <div className="min-h-screen flex h-screen bg-[#0B0E14] overflow-hidden text-slate-50 font-sans selection:bg-indigo-500/30">
      
      {/* Column 1: Structural Sidebar (Minimalist) */}
      <nav 
        className={`flex flex-col bg-white/[0.01] border-r border-white/5 transition-all duration-300 ease-in-out app-drag-region w-[260px]`}
      >
        <div className="h-12 shrink-0 flex items-center gap-2 pl-3.5">
          <div className="w-3 h-3 rounded-full bg-white/5" />
          <div className="w-3 h-3 rounded-full bg-white/5" />
          <div className="w-3 h-3 rounded-full bg-white/5" />
        </div>

        <div className="flex justify-between items-center px-2 mb-6">
          <h1 className="pl-3 text-2xl font-black text-white/20 tracking-tighter uppercase leading-none">
            Trove
          </h1>
        </div>
        
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

      {/* Column 2: Main Area using NVErrorView */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0B0E14]">
        {/* Simple Top Bar */}
        <div className="h-12 border-b border-white/5 flex items-center justify-between px-8 app-drag-region opacity-40">
           <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-rose-500 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Connection Lost
           </div>
           <div className="flex items-center gap-4 text-slate-500">
              <Monitor size={14} />
              <Search size={14} />
           </div>
        </div>

        {/* Use the shared high-fidelity error view */}
        <NVErrorView
          statusCode="OFFLINE"
          title="서버에 연결할 수 없습니다."
          description="네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요. 문제가 지속될 경우 관리자에게 문의하시기 바랍니다."
          fullScreen={false}
          showBackgroundCode={true}
          primaryAction={{
            label: `연결 다시 시도 ${retryCount > 0 ? `#${retryCount}` : ''}`,
            onClick: handleReload,
            icon: RotateCcw
          }}
        />
      </main>
    </div>
  );
};

export default ErrorPage;
