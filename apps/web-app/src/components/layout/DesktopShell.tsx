'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFolders } from '../../hooks/useFolders';
import { FolderTree } from '../navigation/FolderTree';
import { Grid, Star, Clock, Menu } from 'lucide-react';

interface DesktopShellProps {
  children: React.ReactNode;
}

export function DesktopShell({ children }: DesktopShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { folders, createFolder } = useFolders();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const activeNav = pathname === '/library' ? 'all' : pathname.split('/')[1];

  const handleNavClick = (nav: string) => {
    if (nav === 'all') router.push('/library');
    else router.push(`/${nav}`);
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Column 1: Sidebar */}
      <aside 
        className={`flex flex-col bg-white/[0.02] border-r border-white/[0.06] transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-[260px]'}`}
      >
        <div className="p-6 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <h1 className="text-2xl font-black bg-gradient-to-br from-indigo-500 to-cyan-500 bg-clip-text text-transparent tracking-tighter">
              NOVA
            </h1>
          )}
          <button 
            className={`p-2 rounded-lg text-slate-500 hover:bg-white/5 hover:text-indigo-500 transition-all ${isSidebarCollapsed ? 'mx-auto' : ''}`}
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? "확장" : "축소"}
          >
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto">
          {!isSidebarCollapsed && (
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mx-3 mt-6 mb-2">
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
                className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${isActive 
                    ? 'bg-indigo-500/10 text-indigo-500' 
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-50'}
                  ${isSidebarCollapsed ? 'justify-center px-0' : ''}`} 
                onClick={() => handleNavClick(item.id)} 
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <item.icon size={18} className={`flex-shrink-0 ${isActive ? 'text-indigo-500' : 'group-hover:text-slate-50'}`} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </div>
            );
          })}

          <div className={isSidebarCollapsed ? 'mt-4' : 'mt-2'}>
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

        <div className={`p-4 border-t border-white/[0.06] ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div 
            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all border border-transparent
              ${pathname === '/profile' 
                ? 'bg-indigo-500/10 border-indigo-500/30' 
                : 'hover:bg-white/[0.05]'}
              ${isSidebarCollapsed ? 'w-10 h-10 p-0 justify-center' : ''}`}
            title={isSidebarCollapsed ? "설정" : undefined}
            onClick={() => router.push('/profile')}
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center transition-all
              ${pathname === '/profile' ? 'border-indigo-500/50 bg-indigo-500/20' : ''}
              ${isSidebarCollapsed ? 'w-full h-full' : ''}`}>
              <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className={`text-[13px] font-bold truncate ${pathname === '/profile' ? 'text-indigo-500' : 'text-slate-50'}`}>
                  NOVA Designer
                </span>
                <span className="text-[11px] text-slate-500 truncate">user@nova.design</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Column 2 & 3: Content Area (Main + Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>

  );
}
