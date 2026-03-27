'use client';

import React from 'react';
import { PanelLeftClose } from 'lucide-react';
import { NVIconButton } from '@nova/ui';
import { cn } from '@nova/lib/utils';
import { useDesktopShell } from '../context';

export const SidebarToggleButton = ({ className }: { className?: string }) => {
  const context = useDesktopShell();
  if (!context) return null;
  const { isSidebarCollapsed, handleToggleSidebar } = context;

  return (
    <NVIconButton
      icon={PanelLeftClose}
      variant="ghost"
      size="sm"
      className={cn('app-no-drag', className)}
      onClick={handleToggleSidebar}
      title="메뉴 축소"
    />
  );
};
