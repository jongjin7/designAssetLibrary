'use client';

import { useAssets } from '../../../hooks/useAssets';
import { useFolders } from '../../../hooks/useFolders';
import { processFileToAsset } from '../../../lib/assetProcessor';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { AssetInspector } from '../../../components/detail/AssetInspector';
import { DropZone } from '../../../components/shared/DropZone';
import { SearchBar } from '../../../components/shared/SearchBar';
import { DesktopShell } from '../../../components/layout/DesktopShell';
import { Palette, Calendar, Tag } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function DesktopLibraryView() {
  const { assets, loading, selectedAsset, closeDetail, deleteAsset, updateAsset, openDetail, addAsset } = useAssets();
  const { folders, createFolder } = useFolders();
  
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredAssets = useMemo(() => {
    let result = assets;
    if (searchText) {
      const term = searchText.toLowerCase();
      result = result.filter(a => 
        a.fileName.toLowerCase().includes(term) ||
        a.tags.some(t => t.toLowerCase().includes(term))
      );
    }
    return result;
  }, [assets, searchText]);

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
    <DesktopShell>
      <div className="desktop-dashboard__content">
        <DropZone onDrop={handleDrop} />
        
        <header className="content-header">
          <SearchBar 
            value={searchText}
            onChange={setSearchText}
            onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
            placeholder="에셋 이름, 태그로 검색..."
            showFilter={true}
          />
        </header>

        {isFilterOpen && (
          <div className="advanced-filter-bar">
            <div className="filter-group">
              <Palette size={14} className="filter-icon" />
              <select className="filter-select">
                <option value="">모든 색상</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
              </select>
            </div>
            <div className="filter-group">
              <Tag size={14} className="filter-icon" />
              <input type="text" className="filter-input input-tags" placeholder="태그 입력 (예: #ui, #web)" />
            </div>
            <div className="filter-group">
              <Calendar size={14} className="filter-icon" />
              <select className="filter-select">
                <option value="">모든 기간</option>
                <option value="today">오늘</option>
                <option value="week">최근 7일</option>
                <option value="month">최근 30일</option>
              </select>
            </div>
            <div className="filter-actions">
              <button className="filter-btn filter-btn--reset">초기화</button>
              <button className="filter-btn filter-btn--apply">적용</button>
            </div>
          </div>
        )}

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
            <h2 className="page-title">라이브러리</h2>
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
      </div>

      <AssetInspector 
        asset={selectedAsset} 
        onClose={closeDetail} 
        onDelete={deleteAsset} 
        onUpdate={updateAsset} 
      />
    </DesktopShell>
  );
}
