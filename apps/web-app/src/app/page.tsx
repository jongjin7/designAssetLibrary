'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@nova/providers/AuthProvider';
import { NVSplashScreen } from '@nova/ui';
import { useRouter } from 'next/navigation';

export default function RootEntry() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 세션 확인이 완료된 상태에서 상위 경로 분기
    if (!loading) {
      if (!user) {
        // 1. 로그인 안 된 유저: 지체 없이 로그인 화면으로 이동
        router.replace('/login');
      } else {
        // 2. 로그인 된 유저: 라이브러리 진입 (동기화 및 브랜딩은 라이브러리 페이지에서 수행)
        router.replace('/library');
      }
    }
  }, [loading, user, router]);

  // 상위 도메인 분기 전까지는 브랜드 셸 유지
  return <NVSplashScreen message="디자인 시스템 동기화 중..." mode="syncing" />;
}
