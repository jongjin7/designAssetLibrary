import React from 'react';
import { NVTypography } from '../../../atoms/NVTypography';

export const NVLoginCardFooter: React.FC = () => {
  return (
    <div className="pt-4 text-center border-t border-white/5">
      <NVTypography variant="caption" className="text-slate-600 opacity-60 text-xs uppercase tracking-widest leading-loose">
        Universal Auth • Secured by Supabase
      </NVTypography>
    </div>
  );
};
