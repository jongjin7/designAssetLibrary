'use client';

import { useEffect } from 'react';
import AppErrorView from '../components/shared/AppErrorView';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('System Error:', error);
  }, [error]);

  return (
    <AppErrorView 
      statusCode={500} 
      title="시스템 오류가 발생했습니다"
      description="애플리케이션 구동 중 예기치 않은 데이터 충돌이 발생했습니다. 일시적인 현상일 수 있으니 아래 버튼을 눌러 다시 시도해 주세요."
      reset={reset}
    />
  );
}
