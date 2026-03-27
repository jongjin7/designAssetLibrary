'use client';

import { createContext, useContext } from 'react';

interface DesktopShellContextType {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean) => void;
  handleToggleSidebar: () => void;
  isFloating: boolean;
  isDesktopApp: boolean;
}

export const DesktopShellContext = createContext<DesktopShellContextType | undefined>(undefined);

export function useDesktopShell() {
  const context = useContext(DesktopShellContext);
  return context;
}
