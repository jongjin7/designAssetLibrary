"use client";

import { NVButton, NVCard } from "@nova/ui";

export default function Home() {
  const handleStart = () => {
    alert("NOVA Experience Starting...");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-nv-bg text-nv-text-primary">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nv-primary to-nv-vivid">
          NOVA
        </h1>
        <p className="mt-4 text-xl text-nv-text-secondary">
          Integrated Design Asset Library
        </p>
        
        <NVCard className="mt-12 p-8 w-full max-w-md">
          <p className="text-center mb-6 text-nv-text-secondary">Capture anything, organize everything.</p>
          <NVButton 
            onClick={handleStart}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Get Started
          </NVButton>
        </NVCard>
      </div>
      
      {/* Background Decorative Blur */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nv-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nv-vivid/20 rounded-full blur-[120px]"></div>
      </div>
    </main>
  );
}
