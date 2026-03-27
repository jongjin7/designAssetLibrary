'use client';

import { useState, useEffect, useRef } from 'react';
import { checkIsDesktopApp } from '@nova/lib/utils';
import { DesktopShellContext } from './context';
import { Sidebar } from './parts/Sidebar';

interface DesktopShellProps {
  children: React.ReactNode;
  onSearchToggle?: () => void;
}

export function DesktopShell({ children }: DesktopShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isDesktopApp, setIsDesktopApp] = useState(false);
  const lastWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Handle automatic collapse/expand and floating mode on resize
  useEffect(() => {
    const isApp = checkIsDesktopApp();
    setIsDesktopApp(isApp);

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const floatingBreakpoint = 1100;
      
      const shouldFloat = currentWidth < floatingBreakpoint;
      setIsFloating(shouldFloat);

      if (!shouldFloat) {
        setIsSidebarCollapsed(false);
      } else {
        if (lastWidthRef.current >= floatingBreakpoint) {
          setIsSidebarCollapsed(true);
        }
      }
      
      lastWidthRef.current = currentWidth;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <DesktopShellContext.Provider value={{ 
      isSidebarCollapsed, 
      setIsSidebarCollapsed,
      handleToggleSidebar, 
      isFloating, 
      isDesktopApp 
    }}>
      <div className="min-h-screen flex h-screen bg-[#020617] overflow-hidden relative">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
          {children}
        </main>
      </div>
    </DesktopShellContext.Provider>
  );
}

export { useDesktopShell } from './context';
export { SidebarProfile } from './parts/SidebarProfile';
export { SidebarToggleButton } from './parts/SidebarToggleButton';
