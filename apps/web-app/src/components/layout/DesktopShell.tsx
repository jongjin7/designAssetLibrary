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
    <div className={`desktop-dashboard ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Column 1: Sidebar */}
      <aside className="desktop-dashboard__sidebar">
        <div className="sidebar-header">
          {!isSidebarCollapsed && <h1 className="logo">NOVA</h1>}
          <button 
            className="sidebar-toggle" 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            title={isSidebarCollapsed ? "확장" : "축소"}
          >
            <Menu size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {!isSidebarCollapsed && <div className="nav-section-title">라이브러리</div>}
          <div 
            className={`nav-item ${pathname === '/library' ? 'active' : ''}`} 
            onClick={() => handleNavClick('all')} 
            title="모든 에셋"
          >
            <Grid size={16} /> {!isSidebarCollapsed && <span>모든 에셋</span>}
          </div>
          <div 
            className={`nav-item ${pathname === '/favorites' ? 'active' : ''}`} 
            onClick={() => handleNavClick('favorites')} 
            title="즐겨찾기"
          >
            <Star size={16} /> {!isSidebarCollapsed && <span>즐겨찾기</span>}
          </div>
          <div 
            className={`nav-item ${pathname === '/recent' ? 'active' : ''}`} 
            onClick={() => handleNavClick('recent')} 
            title="최근 항목"
          >
            <Clock size={16} /> {!isSidebarCollapsed && <span>최근 항목</span>}
          </div>

          <FolderTree 
            folders={folders} 
            activeFolderId={null} // Path-based folder active state can be added later
            onFolderClick={(id) => id ? router.push(`/folder/${id}`) : router.push('/library')}
            onCreateFolder={(parent) => {
              const name = window.prompt('새 폴더 이름을 입력하세요:');
              if (name) createFolder(name, parent);
            }}
            isCollapsed={isSidebarCollapsed}
          />
        </nav>

        <div className="sidebar-footer">
          <div 
            className={`profile-item ${pathname === '/profile' ? 'active' : ''}`} 
            title={isSidebarCollapsed ? "설정" : undefined}
            onClick={() => router.push('/profile')}
          >
            <div className="profile-placeholder">
              <div className="profile-dot" />
            </div>
            {!isSidebarCollapsed && (
              <div className="profile-info">
                <span className="profile-name">User Name</span>
                <span className="profile-email">user@example.com</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Column 2 & 3: Content Area (Main + Inspector) */}
      <div className="desktop-dashboard__main-wrapper" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}
