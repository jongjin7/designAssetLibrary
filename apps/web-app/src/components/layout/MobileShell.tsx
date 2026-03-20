'use client';

import React from 'react';
import { NetworkStatus } from '../shared/NetworkStatus';
import { MobileBottomNav as BottomTabs } from './MobileBottomNav';

interface MobileShellProps {
  children: React.ReactNode;
  showTabs?: boolean;
  showNetwork?: boolean;
  className?: string;
}

/**
 * MobileShell provides a consistent layout structure for mobile views.
 * It includes NetworkStatus, BottomTabs, and handles safe area insets.
 */
export function MobileShell({ 
  children, 
  showTabs = true, 
  showNetwork = true,
  className = ''
}: MobileShellProps) {
  return (
    <div className={`flex flex-col h-[100dvh] max-w-[760px] mx-auto relative bg-slate-950 overflow-hidden ${className}`}>
      {showNetwork && <NetworkStatus />}
      
      <div className="flex-1 overflow-y-auto pb-[calc(72px+env(safe-area-inset-bottom,0px))] scroll-smooth overscroll-none">
        {children}
      </div>

      {showTabs && (
        <div className="flex-shrink-0">
          <BottomTabs />
        </div>
      )}
    </div>
  );
}
