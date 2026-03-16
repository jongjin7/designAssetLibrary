'use client';

import { useAssets } from '../../../hooks/useAssets';
import { processFileToAsset } from '../../../lib/assetProcessor';
import { AssetGrid } from '../../../components/library/AssetGrid';
import { AssetInspector } from '../../../components/detail/AssetInspector';
import { DropZone } from '../../../components/shared/DropZone';
import { SearchBar } from '../../../components/shared/SearchBar';
import { FilterChips } from '../../../components/library/FilterChips';
import { AdvancedFilter } from '../../../components/library/AdvancedFilter';
import { DesktopShell } from '../../../components/layout/DesktopShell';
import { useState, useMemo } from 'react';

export default function DesktopLibraryView() {
  const { assets, loading, filter, setFilter, selectedAsset, closeDetail, deleteAsset, updateAsset, openDetail, addAsset } = useAssets();
  
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>(null);

  const filteredAssets = useMemo(() => {
    let result = assets;
    if (searchText) {
      const term = searchText.toLowerCase();
      result = result.filter(a => 
        a.fileName.toLowerCase().includes(term) ||
        a.tags.some(t => t.toLowerCase().includes(term))
      );
    }
    if (activeFilters) {
      if (activeFilters.color) {
        result = result.filter(a => 
          a.tags.some(t => t.toLowerCase().includes(activeFilters.color.toLowerCase())) ||
          a.palette?.some(p => p.toLowerCase().includes(activeFilters.color.toLowerCase()))
        );
      }
      if (activeFilters.tags) {
        const tagTerm = activeFilters.tags.toLowerCase().replace('#', '');
        result = result.filter(a => a.tags.some(t => t.toLowerCase().includes(tagTerm)));
      }
    }
    return result;
  }, [assets, searchText, activeFilters]);

  const handleFilterApply = (filters: any) => {
    setActiveFilters(filters);
  };

  const handleFilterReset = () => {
    setActiveFilters(null);
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
    <DesktopShell>
      <div className="flex-1 flex flex-col overflow-hidden">
        <DropZone onDrop={handleDrop} />
        
        <header className="h-16 px-8 flex items-center border-bottom border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0 z-20">
          <SearchBar 
            value={searchText}
            onChange={setSearchText}
            onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
            placeholder="에셋 이름, 태그로 검색..."
            showFilter={true}
          />
        </header>

        {isFilterOpen && (
          <div className="bg-slate-900 border-b border-white/5">
            <AdvancedFilter 
              onApply={handleFilterApply}
              onReset={handleFilterReset}
            />
          </div>
        )}

        <div className="px-8 mt-4">
          <FilterChips active={filter} onChange={(f) => setFilter(f as any)} />
        </div>

        <div className="flex-1 overflow-y-auto p-8 relative">
          {selectedIds.size > 0 && (
            <div className="sticky top-0 z-30 mb-6 flex items-center justify-between p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-[11px] font-bold text-white">
                  {selectedIds.size}
                </span>
                <span className="text-sm font-semibold text-indigo-100">개의 항목 선택됨</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                  onClick={() => setSelectedIds(new Set())}
                >
                  취소
                </button>
                <button className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-200 hover:bg-white/10 transition-all border border-white/5">
                  폴더 이동
                </button>
                <button 
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/30"
                  onClick={() => {
                    if (window.confirm(`${selectedIds.size}개의 에셋을 삭제하시겠습니까?`)) {
                      setSelectedIds(new Set());
                    }
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          )}

          <div className="max-w-[1400px] mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">라이브러리</h2>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-slate-500 animate-pulse">에셋 로딩 중...</p>
              </div>
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
