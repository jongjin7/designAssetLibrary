'use client';

import { useIsDesktop } from '@nova/hooks/useIsDesktop';
import { DesktopPageHeader } from '@nova/components/layout/DesktopShell';
import AppErrorView from '@nova/components/shared/AppErrorView';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <DesktopPageHeader
          left={
            <div className="flex items-center gap-2 ml-4">
              <AlertCircle size={14} className="text-slate-500" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest opacity-80 select-none">
                Page Not Found
              </span>
            </div>
          }
        />
        <div className="flex-1 flex items-center justify-center">
          <AppErrorView statusCode={404} />
        </div>
      </div>
    );
  }

  return <AppErrorView statusCode={404} />;
}
