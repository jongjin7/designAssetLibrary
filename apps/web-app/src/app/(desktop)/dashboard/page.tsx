'use client';

import { useAssets } from '../../../hooks/useAssets';
import { useFolders } from '../../../hooks/useFolders';
import { processFileToAsset } from '../../../lib/assetProcessor';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { AssetInspector } from '../../../components/detail/AssetInspector';
import { FolderTree } from '../../../components/navigation/FolderTree';
import { DropZone } from '../../../components/shared/DropZone';
import { Grid, Star, Clock } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function DashboardPage() {
  const { assets, loading, selectedAsset, closeDetail, deleteAsset, updateAsset, openDetail, addAsset } = useAssets();
  const { folders, loading: foldersLoading, createFolder } = useFolders();
  
  const [activeNav, setActiveNav] = useState('all');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredAssets = useMemo(() => {
    let result = assets;

    // Navigation Filter
    if (activeNav === 'favorites') {
      result = result.filter(a => a.isFavorite);
    }
    // Folder Filter (Placeholder - assuming Asset has folderId)
    // if (activeFolderId) result = result.filter(a => a.folderId === activeFolderId);

    // Search Filter
    if (searchText) {
      const term = searchText.toLowerCase();
      result = result.filter(a => 
        a.fileName.toLowerCase().includes(term) ||
        a.tags.some(t => t.toLowerCase().includes(term))
      );
    }
    
    return result;
  }, [assets, searchText, activeNav, activeFolderId]);

  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
    setActiveFolderId(null);
  };

  const handleFolderClick = (id: string | null) => {
    setActiveFolderId(id);
    setActiveNav('folder');
  };

  const handleSelect = (id: string, e: React.MouseEvent) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDrop = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      
      try {
        const assetData = await processFileToAsset(file);
        await addAsset(assetData);
      } catch (err) {
        console.error('Failed to process dropped file:', err);
      }
    }
  };

  return (
    <div className="desktop-dashboard">
      <DropZone onDrop={handleDrop} />
      
      {/* Column 1: Sidebar */}
      <aside className="desktop-dashboard__sidebar">
        <div className="sidebar-header">
          <h1 className="logo">NOVA</h1>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section-title">라이브러리</div>
          <div className={`nav-item ${activeNav === 'all' ? 'active' : ''}`} onClick={() => handleNavClick('all')}>
            <Grid size={16} /> <span>모든 에셋</span>
          </div>
          <div className={`nav-item ${activeNav === 'favorites' ? 'active' : ''}`} onClick={() => handleNavClick('favorites')}>
            <Star size={16} /> <span>즐겨찾기</span>
          </div>
          <div className={`nav-item ${activeNav === 'recent' ? 'active' : ''}`} onClick={() => handleNavClick('recent')}>
            <Clock size={16} /> <span>최근 항목</span>
          </div>

          <FolderTree 
            folders={folders} 
            activeFolderId={activeFolderId}
            onFolderClick={handleFolderClick}
            onCreateFolder={(parent) => {
              const name = window.prompt('새 폴더 이름을 입력하세요:');
              if (name) createFolder(name, parent);
            }}
          />
        </nav>
      </aside>

      {/* Column 2: Content/Explorer */}
      <main className="desktop-dashboard__content">
        <header className="content-header">
          <div className="search-box">
             <input 
              type="text" 
              placeholder="에셋 이름, 태그로 검색..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
             />
          </div>
          <div className="header-actions">
            <div className="profile-placeholder">
              <div className="profile-dot" />
            </div>
          </div>
        </header>

        <div className="scroll-area">
          {selectedIds.size > 0 && (
            <div className="multi-select-bar">
              <div className="selection-info">
                <span className="count">{selectedIds.size}</span>
                <span>개의 항목 선택됨</span>
              </div>
              <div className="selection-actions">
                <button className="selection-btn" onClick={() => setSelectedIds(new Set())}>취소</button>
                <button className="selection-btn selection-btn--primary">폴더 이동</button>
                <button className="selection-btn selection-btn--danger" onClick={() => {
                  if (window.confirm(`${selectedIds.size}개의 에셋을 삭제하시겠습니까?`)) {
                    // Bulk delete logic
                    setSelectedIds(new Set());
                  }
                }}>삭제</button>
              </div>
            </div>
          )}

          <div className="content-inner">
            <h2 className="page-title">
              {activeNav === 'all' ? '모든 에셋' : 
               activeNav === 'favorites' ? '즐겨찾기' : 
               activeNav === 'recent' ? '최근 항목' : 
               activeFolderId ? folders.find(f => f.id === activeFolderId)?.name : '목록'}
            </h2>
            {loading ? (
              <p>로딩 중...</p>
            ) : (
              <AssetGrid 
                assets={filteredAssets} 
                onAssetTap={openDetail} 
                selectedIds={selectedIds}
                onSelect={handleSelect}
              />
            )}
          </div>
        </div>
      </main>

      {/* Column 3: Inspector */}
      <AssetInspector 
        asset={selectedAsset} 
        onClose={closeDetail} 
        onDelete={deleteAsset} 
        onUpdate={updateAsset} 
      />
    </div>
  );
}
