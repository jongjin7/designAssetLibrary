'use client';

import { createContext, useContext } from 'react';

interface DesktopShellContextType {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (v: boolean) => void;
  handleToggleSidebar: () => void;
  isFloating: boolean;
  isDesktopApp: boolean;
  // Search state for context
  isSearchVisible: boolean;
  setIsSearchVisible: (v: boolean) => void;
  onSearchToggle: () => void;
}

export const DesktopShellContext = createContext<DesktopShellContextType | undefined>(undefined);

export function useDesktopShell() {
  const context = useContext(DesktopShellContext);
  return context;
}
