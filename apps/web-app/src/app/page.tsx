'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@nova/providers/AuthProvider';
import { NVLoadingState, NVLogo, NVTypography } from '@nova/ui';
import { useRouter } from 'next/navigation';

export default function RootEntry() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace('/library');
    } else {
      router.replace('/login');
    }
  }, [user, loading, router]);

  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center p-10 z-[100] selection:bg-indigo-500/30 overflow-hidden">
      {/* 백그라운드 그래디언트 (표준 Glassmorphism) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full" />
      
      <div className="relative flex flex-col items-center opacity-0 animate-[fadeIn_300ms_ease-out_forwards]">
        {/* 통합 브랜드 로고 (표준 사이즈 lg) */}
        <div className="mb-8">
          <NVLogo size="lg" />
        </div>
        
        <div className="space-y-6 text-center max-w-[280px]">
            <div className="flex flex-col items-center space-y-4">
                <NVLoadingState mode="syncing" message="디자인 시스템 동기화 중..." />
                <NVTypography variant="secondary" className="text-slate-600 text-[10px] tracking-[0.2em] uppercase text-center opacity-70">
                  Premium Design Asset Library
                </NVTypography>
            </div>
        </div>
      </div>
      
      <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-20">
        <NVTypography variant="caption" className="tracking-[0.4em] italic font-bold text-slate-500">
          Sprint 1 Mobile Collector
        </NVTypography>
      </div>
    </div>
  );
}
