'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@nova/providers/AuthProvider';
import { NVSplashScreen } from '@nova/ui';
import { useRouter } from 'next/navigation';

export default function RootEntry() {
  const { user, loading } = useAuth();
  const [timeoutFinished, setTimeoutFinished] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setTimeoutFinished(true), 1500); // 1.5초는 브랜드 로고 노출을 위한 최소 시간
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 1. 최소 대기 시간 경과 AND 2. 계정 상태 로딩 완료
    if (timeoutFinished && !loading) {
      if (user) {
        router.replace('/library');
      } else {
        router.replace('/login');
      }
    }
  }, [timeoutFinished, loading, user, router]);

  return <NVSplashScreen message="디자인 시스템 동기화 중..." mode="syncing" />;
}
