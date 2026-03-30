'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Grid, Star, Clock, Inbox } from 'lucide-react';
import { NVLogo } from '@nova/ui';
import { cn } from '@nova/lib/utils';
import { useFolders } from '@nova/hooks/useFolders';
import { useAssetStore } from '@nova/store/useAssetStore';
import { FolderTree } from '@nova/components/navigation/FolderTree';
import { useDesktopShell } from '../context';
import { SidebarToggleButton } from './SidebarToggleButton';
import { SidebarProfile } from './SidebarProfile';

interface SidebarProps {
  onSearchToggle?: () => void;
}

export function Sidebar({ onSearchToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Use selectors to ensure re-render when assets change
  const refreshAssets = useAssetStore(state => state.refreshAssets);
  const inboxCount = useAssetStore(state => state.assets.filter(a => !a.folderId).length);
  const getFolderCount = useAssetStore(state => state.getFolderCount);
  const assets = useAssetStore(state => state.assets); // Subscribing to assets for general updates
  const folderId = useAssetStore(state => state.folderId);

  useEffect(() => { 
    setMounted(true); 
    refreshAssets();
  }, [refreshAssets]);

  const { folders, createFolder } = useFolders();
  const context = useDesktopShell();
  
  if (!context) return null;
  const { isSidebarCollapsed, isDesktopApp } = context as any;

  const handleNavClick = (nav: string) => {
    const target = nav === 'all' ? '/library' : `/${nav}`;
    if (pathname === target) return;
    router.push(target);
  };

  return (
    <div  
      className={cn(
        "flex flex-col z-50 overflow-hidden shrink-0 w-[260px] bg-slate-950/60 backdrop-blur-2xl",
        mounted && "transition-all duration-300 ease-in-out",
        isSidebarCollapsed 
          ? "bg-transparent border-transparent shadow-none translate-x-[-260px] -ml-[260px]" 
          : "border-r border-white/5 shadow-[4px_0_24px_rgba(0,0,0,0.5)] translate-x-0 ml-0",
      )}
    >
      {/* Window Controls Space */}
      {isDesktopApp && (
        <div className={cn(
          "h-10 pl-4 pr-2 flex items-center justify-between border-b border-white/[0.05] transition-all duration-300 ease-in-out app-drag-region",
          isSidebarCollapsed ? "opacity-0 invisible" : "opacity-100 visible delay-300"
        )}> 
          <div />
          { !isSidebarCollapsed && <SidebarToggleButton /> }
        </div> 
      )}
      
      <div className={cn(
        "flex items-center px-4 shrink-0 transition-all",
        isDesktopApp? "h-11" : "h-12"
      )}>
        <Link href="/library">
          <NVLogo size="lg" className="pl-0" />
        </Link>
        
        <div className="flex-1" />
        {!isDesktopApp && !isSidebarCollapsed && <SidebarToggleButton />}
      </div>
      
      <div className={cn(
        "flex-1 flex flex-col gap-1 overflow-hidden transition-all duration-300",
        isSidebarCollapsed ? "opacity-0 invisible h-0" : "opacity-100 visible"
      )}>
        <nav className="flex-1 px-2.5 py-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar select-none">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] px-4 mt-4 mb-2 opacity-60">
            라이브러리
          </div>
          
          {[
            { id: 'all', label: '모든 에셋', icon: Grid, path: '/library', count: assets.length },
            { id: 'inbox', label: '인박스', icon: Inbox, path: '/inbox', count: inboxCount },
            { id: 'favorites', label: '즐겨찾기', icon: Star, path: '/favorites', count: assets.filter(a => a.isFavorite).length },
            { id: 'recent', label: '최근 항목', icon: Clock, path: '/recent' }
          ].map((item: any) => {
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
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon size={18} className={cn("shrink-0 transition-transform duration-300 group-hover:scale-110", isActive ? 'text-indigo-400' : 'group-hover:text-white')} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.count > 0 && (
                   <span className={cn(
                     "px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[20px] text-center transition-all duration-300",
                     isActive 
                      ? "bg-indigo-500 text-white" 
                      : "bg-white/10 text-slate-400 group-hover:bg-white/20 group-hover:text-white"
                   )}>
                     {item.count}
                   </span>
                )}
              </div>
            );
          })}

          <div className="px-0.5 mt-4">
            <FolderTree 
              folders={folders} 
              activeFolderId={folderId}
              getFolderCount={(id) => getFolderCount(id, folders)}
              onFolderClick={(id) => {
                const target = id ? `/folder/${id}` : '/library';
                if (pathname === target) return;
                router.push(target);
              }}
              onCreateFolder={(parent) => {
                const name = window.prompt('새 폴더 이름을 입력하세요:');
                if (name) createFolder(name, parent);
              }}
              isCollapsed={false}
            />
          </div>
        </nav>

        <div className="p-4 border-t border-white/5">
          <SidebarProfile />
        </div>
      </div>
    </div>
  );
}
