'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@nova/lib/utils';
import { PanelLeft } from 'lucide-react';
import { NVIconButton } from '@nova/ui';
import { useDesktopShell } from '../context';
import Link from 'next/link';

interface DesktopPageHeaderProps {
  children?: React.ReactNode;
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  className?: string;
  showSidebarToggle?: boolean;
}

/**
 * 데스크탑 최상단 공통 헤더 레이아웃
 * macOS 스타일의 블러 효과와 사이드바 토글 로직을 포함합니다.
 */
export function DesktopPageHeader({ 
  left, 
  center, 
  right, 
  bottom, 
  children,
  className,
  showSidebarToggle = true
}: DesktopPageHeaderProps) {
  const shell = useDesktopShell();
  const isSidebarCollapsed = shell?.isSidebarCollapsed ?? false;
  const isDesktopApp = shell?.isDesktopApp ?? false;
  const handleToggleSidebar = shell?.handleToggleSidebar ?? (() => {});

  // 사이드바가 닫혔을 때만 토글 버튼을 표시 (애니메이션 타이밍 동기화)
  const [showToggle, setShowToggle] = useState(isSidebarCollapsed);

  useEffect(() => {
    if (isSidebarCollapsed) {
      setShowToggle(true);
    } else {
      const timer = setTimeout(() => {
        setShowToggle(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isSidebarCollapsed]);

  return (
    <div className={cn("flex flex-col w-full select-none", className)}>
      <header 
        className={cn(
          "flex items-center justify-between px-4 bg-slate-950/40 backdrop-blur-2xl border-b border-white/[0.05] sticky top-0 z-30 no-select app-drag-region",
          isDesktopApp ? "h-10" : "h-12"
        )}
      >
        {/* Left Section: Sidebar Toggle & Custom Left Actions */}
        <div className="flex-1 flex items-center gap-1 min-w-0 app-no-drag">
          {showSidebarToggle && showToggle && (
            <div className={cn(
              "shrink-0 h-full flex items-center pr-2 mr-1 border-white/[0.05] border-r",
              isDesktopApp ? "pl-15" : ""
            )}>
              {!isDesktopApp && (
                <h1 className="pl-2 text-2xl font-black bg-gradient-to-br from-indigo-400 via-indigo-500 to-cyan-400 bg-clip-text text-transparent mr-4 shrink-0">
                  <Link href="/">T</Link>
                </h1>
              )}
              <NVIconButton
                icon={PanelLeft}
                variant="ghost"
                size="sm"
                onClick={handleToggleSidebar}
                title="메뉴 확장"
              /> 
            </div>
          )}
          <div className="flex items-center gap-1 min-w-0 flex-1">
            {left}
          </div>
        </div>

        {/* Center Section: Flexible Content (Search, Title, etc.) */}
        <div className="flex-none flex items-center justify-center px-4 z-10 app-no-drag">
          {center}
        </div>

        {/* Right Section: Actions & Utilities */}
        <div className="flex-1 flex items-center justify-end gap-1 min-w-0 app-no-drag">
          {right}
        </div>
        
        {children}
      </header>
      
      {/* Optional Bottom Bar (Filters, Tabs, etc.) */}
      {bottom && (
        <div className="px-8 py-2 border-b border-white/[0.05]">
          {bottom}
        </div>
      )}
    </div>
  );
}
