import React from 'react';
import { NVTypography } from '../../../atoms/NVTypography';

export const NVLoginCardHeader: React.FC = () => {
  return (
    <div className="space-y-2 text-center">
      <NVTypography variant="header" className="text-white text-2xl font-bold tracking-tight">
        반갑습니다
      </NVTypography>
      <NVTypography variant="secondary" className="text-slate-500">
        당신의 창의적인 리서치를 시작하세요.
      </NVTypography>
    </div>
  );
};
