'use client';

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFolders } from '@nova/hooks/useFolders';
import { FolderTree } from '@nova/components/navigation/FolderTree';
import { Grid, Star, Clock, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { NVIconButton } from '@nova/ui';
import { cn, checkIsDesktopApp } from '@nova/lib/utils';
import Link from 'next/link';

interface DesktopShellContextType {
  isSidebarCollapsed: boolean;
  handleToggleSidebar: () => void;
  isFloating: boolean;
  isDesktopApp: boolean;
}

const DesktopShellContext = createContext<DesktopShellContextType | undefined>(undefined);

export function useDesktopShell() {
  const context = useContext(DesktopShellContext);
  return context;
}

interface DesktopShellProps {
  children: React.ReactNode;
  onSearchToggle?: () => void;
}

const SidebarToggleButton = ({className}: {className?: string}) => {
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

export function DesktopShell({ children, onSearchToggle }: DesktopShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { folders, createFolder } = useFolders();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [isDesktopApp, setIsDesktopApp] = useState(false);
  const lastWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Handle automatic collapse/expand and floating mode on resize
  useEffect(() => {
    const isApp = checkIsDesktopApp();
    console.log('[DesktopShell] isDesktopApp check:', isApp, {
      electron: (window as any).electron !== undefined,
      userAgent: navigator.userAgent.indexOf('Electron') >= 0,
      search: typeof window !== 'undefined' ? window.location.search : ''
    });
    setIsDesktopApp(isApp);

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const floatingBreakpoint = 1100;
      
      // Update floating mode
      const shouldFloat = currentWidth < floatingBreakpoint;
      setIsFloating(shouldFloat);

      // Requirement: 1280px 이상 넓혀지면 접혔던 LNB가 넓혀진다 (Auto-expand on >= 1280)
      if (!shouldFloat) {
        setIsSidebarCollapsed(false);
      } else {
        // Optional: Auto-collapse when entering floating mode from desktop-wide
        if (lastWidthRef.current >= floatingBreakpoint) {
          setIsSidebarCollapsed(true);
        }
      }
      
      lastWidthRef.current = currentWidth;
    };
    
    // Initial check
    handleResize();

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
    <DesktopShellContext.Provider value={{ isSidebarCollapsed, handleToggleSidebar, isFloating, isDesktopApp }}>
      <div className="min-h-screen flex h-screen bg-[#020617] overflow-hidden relative">

        {/* Column 1: Sidebar (LNB) */}
        <div  
          className={cn(
            "flex flex-col transition-all duration-300 ease-in-out z-50 overflow-hidden shrink-0 app-drag-region w-[260px] bg-slate-950/60 backdrop-blur-2xl",
            // When collapsed, it should be transparent and not take up space in the layout
            isSidebarCollapsed 
              ? "bg-transparent border-transparent shadow-none translate-x-[-260px] -ml-[260px]" 
              : "border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)] translate-x-0 ml-0",
          )}
        >
          {/* Window Controls Space: Only visible when expanded in Desktop App */}
          {isDesktopApp && (
            <div className={cn(
              "h-10 pl-4 pr-2 flex items-center justify-between border-b border-white/[0.05] transition-all duration-300 ease-in-out",
              isSidebarCollapsed ? "opacity-0 invisible" : "opacity-100 visible delay-300"
            )}> 
              <div />
              { !isSidebarCollapsed && <SidebarToggleButton /> }
            </div> 
          )}
          
          <div className={cn(
            "flex justify-between items-center px-2 shrink-0 transition-all",
            isDesktopApp? "h-11" : "h-12"
          )}>
            <h1 className="pl-2 text-2xl font-black bg-gradient-to-br from-indigo-400 via-indigo-500 to-cyan-400 bg-clip-text text-transparent tracking-tighter app-no-drag select-none">
                <Link href="/">Trove</Link>
            </h1>
            
            {!isDesktopApp && !isSidebarCollapsed && <SidebarToggleButton />}
          </div>
          
          {/* Sidebar Content: Only visible when expanded */}
          <div className={cn(
            "flex-1 flex flex-col gap-1 overflow-hidden transition-all duration-300",
            isSidebarCollapsed ? "opacity-0 invisible h-0" : "opacity-100 visible"
          )}>
            <nav className="flex-1 px-2.5 py-4 flex flex-col gap-1 overflow-y-auto app-drag-region custom-scrollbar">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-4 mt-4 mb-2 app-no-drag select-none opacity-60">
                라이브러리
              </div>
              
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
                      "group flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer app-no-drag select-none",
                      isActive 
                        ? 'bg-indigo-500/15 text-indigo-400 shadow-[inset_0_0_12px_rgba(99,102,241,0.1)]' 
                        : 'text-slate-400 hover:bg-white/[0.06] hover:text-white',
                    )} 
                    onClick={() => {
                      handleNavClick(item.id);
                      if (isFloating) setIsSidebarCollapsed(true);
                    }} 
                  >
                    <item.icon size={18} className={cn("shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? 'text-indigo-400' : 'group-hover:text-white')} />
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}

              <div className="app-drag-region px-0.5 mt-4">
                <FolderTree 
                  folders={folders} 
                  activeFolderId={null}
                  onFolderClick={(id) => {
                    id ? router.push(`/folder/${id}`) : router.push('/library');
                    if (isFloating) setIsSidebarCollapsed(true);
                  }}
                  onCreateFolder={(parent) => {
                    const name = window.prompt('새 폴더 이름을 입력하세요:');
                    if (name) createFolder(name, parent);
                  }}
                  isCollapsed={false}
                />
              </div>
            </nav>

            <div className="p-4 border-t border-white/5 app-no-drag">
              <div 
                className={cn(
                  "flex items-center gap-3 p-1.5 rounded-xl cursor-pointer transition-all border border-transparent",
                  pathname === '/profile' 
                    ? 'bg-indigo-500/10 border-indigo-500/30' 
                    : 'hover:bg-white/[0.05]',
                )}
                onClick={() => router.push('/profile')}
              >
                <div className={cn(
                  "flex-shrink-0 w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center transition-all overflow-hidden",
                  pathname === '/profile' && 'border-indigo-500/50 bg-indigo-500/20',
                )}>
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                </div>
                <div className="flex flex-col min-w-0 text-left">
                  <span className={cn(
                    "text-[12px] font-bold truncate",
                    pathname === '/profile' ? 'text-indigo-400' : 'text-slate-200'
                  )}>
                    Trove Designer
                  </span>
                  <span className="text-[10px] text-slate-500 truncate">user@nova.design</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
          {children}
        </main>
      </div>
    </DesktopShellContext.Provider>
  );
}
