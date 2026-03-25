'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFolders } from '@nova/hooks/useFolders';
import { FolderTree } from '@nova/components/navigation/FolderTree';
import { Grid, Star, Clock, Menu, PanelLeft,  } from 'lucide-react';

import { NVIconButton } from '@nova/ui';
import { cn } from '@nova/lib/utils';

interface DesktopShellProps {
  children: React.ReactNode;
  onSearchToggle?: () => void;
}

export function DesktopShell({ children, onSearchToggle }: DesktopShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { folders, createFolder } = useFolders();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const lastWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Handle automatic collapse/expand on resize CROSSING 1024px
  useEffect(() => {
    const checkInitialState = () => {
       if (window.innerWidth < 1024) {
         setIsSidebarCollapsed(true);
       } else {
         setIsSidebarCollapsed(false);
       }
    };

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const wasAbove = lastWidthRef.current >= 1024;
      const nowBelow = currentWidth < 1024;
      
      const wasBelow = lastWidthRef.current < 1024;
      const nowAbove = currentWidth >= 1024;

      if (wasAbove && nowBelow) {
        setIsSidebarCollapsed(true);
      } else if (wasBelow && nowAbove) {
        setIsSidebarCollapsed(false);
      }
      
      lastWidthRef.current = currentWidth;
    };
    
    // Check state on mount
    checkInitialState();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeNav = pathname === '/library' ? 'all' : pathname.split('/')[1];

  const handleNavClick = (nav: string) => {
    if (nav === 'all') router.push('/library');
    else router.push(`/${nav}`);
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex h-screen bg-slate-950 overflow-hidden">
      {/* Column 1: Sidebar */}
      <nav 
        className={cn(
          "flex flex-col bg-white/[0.02] border-r border-white/[0.06] transition-all duration-300 ease-in-out app-drag-region",
          isSidebarCollapsed ? 'w-21' : 'w-[260px]'
        )}
      >
        {/* Window Controls Space (for Electron) + Visual Dots for Web */}
        <div className="h-12 shrink-0 flex items-center gap-2 pl-3.5">
          <div className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E] shadow-inner" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#28C840] shadow-inner" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57] shadow-inner" />
        </div>

        <div className="flex justify-between items-center">
          {!isSidebarCollapsed && (
            <h1 className="pl-5 text-2xl font-black bg-gradient-to-br from-indigo-500 to-cyan-500 bg-clip-text text-transparent tracking-tighter">
              Trove
            </h1>
          )}

          <NVIconButton
            icon={PanelLeft}
            variant="ghost"
            size="md"
            className={cn("app-no-drag", isSidebarCollapsed ? 'mx-auto' : 'mx-1')}
            onClick={handleToggleSidebar}
            title={isSidebarCollapsed ? "메뉴 확장" : "메뉴 축소"}
          /> 
        </div>
        
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto app-drag-region">
          {!isSidebarCollapsed && (
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mx-3 mt-6 mb-2 app-no-drag">
              라이브러리
            </div>
          )}
          
          {[
            { id: 'all', label: '모든 에셋', icon: Grid, path: '/library' },
            { id: 'favorites', label: '즐겨찾기', icon: Star, path: '/favorites' },
            { id: 'recent', label: '최근 항목', icon: Clock, path: '/recent' }
          ].map((item) => {
            const isActive = pathname === item.path;
            return (
              <div 
                key={item.id}
                className={cn(
                  "group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer app-no-drag",
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-500' 
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-50',
                  isSidebarCollapsed && 'justify-center px-0'
                )} 
                onClick={() => handleNavClick(item.id)} 
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <item.icon size={18} className={`flex-shrink-0 ${isActive ? 'text-indigo-500' : 'group-hover:text-slate-50'}`} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </div>
            );
          })}

          <div className={cn("app-no-drag", isSidebarCollapsed ? 'mt-4' : 'mt-2')}>
            <FolderTree 
              folders={folders} 
              activeFolderId={null}
              onFolderClick={(id) => id ? router.push(`/folder/${id}`) : router.push('/library')}
              onCreateFolder={(parent) => {
                const name = window.prompt('새 폴더 이름을 입력하세요:');
                if (name) createFolder(name, parent);
              }}
              isCollapsed={isSidebarCollapsed}
            />
          </div>
        </nav>

        <div className={cn("p-4 border-t border-white/[0.06] app-no-drag", isSidebarCollapsed ? 'flex justify-center' : '')}>
          <div 
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border border-transparent",
              pathname === '/profile' 
                ? 'bg-indigo-500/10 border-indigo-500/30' 
                : 'hover:bg-white/[0.05]',
              isSidebarCollapsed && 'w-10 h-10 p-0 justify-center'
            )}
            title={isSidebarCollapsed ? "설정" : undefined}
            onClick={() => router.push('/profile')}
          >
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center transition-all",
              pathname === '/profile' && 'border-indigo-500/50 bg-indigo-500/20',
              isSidebarCollapsed && 'w-full h-full'
            )}>
              <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className={cn(
                  "text-[13px] font-bold truncate",
                  pathname === '/profile' ? 'text-indigo-500' : 'text-slate-50'
                )}>
                  Trove Designer
                </span>
                <span className="text-[11px] text-slate-500 truncate">user@nova.design</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Column 2 & 3: Content Area (Main + Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>

  );
}
