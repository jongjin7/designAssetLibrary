import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { 
  NVErrorLayout,
  NVErrorView
} from '@nova/ui';

const ErrorPage: React.FC = () => {
  const [retryCount, setRetryCount] = useState(0);

  const handleReload = () => {
    setRetryCount(prev => prev + 1);
    window.location.href = 'https://localhost:3000?platform=desktop';
  };

  return (
    <NVErrorLayout 
      title="Trove" 
      statusLabel="Connection Lost" 
      statusColorClass="text-rose-500"
    >
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
    </NVErrorLayout>
  );
};

export default ErrorPage;
