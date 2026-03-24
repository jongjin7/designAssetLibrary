import React from 'react';

const App: React.FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0a0c13] text-white overflow-hidden p-8">
      {/* Premium Header/Title Draggable Region */}
      <div className="absolute top-0 left-0 w-full h-[38px] flex items-center justify-center select-none app-drag-region">
        <span className="text-[11px] font-bold tracking-[0.3em] text-slate-500 uppercase pointer-events-none">NOVA CAPTURE</span>
      </div>

      <div className="relative flex flex-col items-center animate-in fade-in zoom-in-95 duration-1000">
        <div className="relative mb-8 group">
          <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] relative z-10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
            <span className="text-5xl font-black text-white tracking-tighter drop-shadow-2xl">N</span>
            {/* Subtle light sweep animation */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
          <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 -z-10 group-hover:scale-175 transition-transform duration-700" />
        </div>

        <div className="flex flex-col items-center gap-2 text-center max-w-md">
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight">Desktop Client Initialized</h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Welcome to the desktop environment of Nova Capture. This client provides system-level asset management with high performance.
          </p>
        </div>

        <div className="mt-12 flex gap-4">
           <div className="px-6 py-2.5 rounded-full bg-indigo-500 text-white font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer">
             Start Library
           </div>
           <div className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/10 active:scale-95 transition-all cursor-pointer">
             Configuration
           </div>
        </div>

        <div className="absolute bottom-[-100px] text-[150px] font-black text-white/[0.02] tracking-tighter select-none pointer-events-none whitespace-nowrap">
           NOVA SYSTEM / DESKTOP v1.0
        </div>
      </div>
    </div>
  );
};

export default App;
