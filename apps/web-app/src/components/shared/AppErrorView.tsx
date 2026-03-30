'use client';

import { Home, RotateCcw, ArrowLeft } from 'lucide-react';
import { NVErrorView } from '@nova/ui';
import { useIsDesktop } from '@nova/hooks/useIsDesktop';
import { useRouter } from 'next/navigation';

interface AppErrorViewProps {
  statusCode?: number | string;
  title?: string;
  description?: string;
  reset?: () => void;
}

export default function AppErrorView({ 
  statusCode = 404, 
  title, 
  description,
  reset 
}: AppErrorViewProps) {
  const isDesktop = useIsDesktop();
  const router = useRouter();

  // Default messages based on status code
  const is404 = statusCode === 404;
  const defaultTitle = is404 ? "페이지를 찾을 수 없습니다" : "서버에 오류가 발생했습니다";
  const defaultDescription = is404
    ? "요청하신 페이지가 존재하지 않거나 이동된 것 같습니다. URL을 다시 확인해 주세요."
    : "시스템에 예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

  const displayTitle = title || defaultTitle;
  const displayDescription = description || defaultDescription;

  const content = (
    <NVErrorView
      statusCode={statusCode}
      title={displayTitle}
      description={displayDescription}
      variant={is404 ? 'default' : 'danger'}
      fullScreen={!isDesktop}
      primaryAction={reset ? {
        label: '다시 시도',
        onClick: reset,
        icon: RotateCcw
      } : {
        label: '홈으로 이동',
        onClick: () => router.push('/library'),
        icon: Home
      }}
      secondaryAction={{
        label: '이전 화면',
        onClick: () => router.back(),
        icon: ArrowLeft
      }}
    />
  );

  return content;
}
