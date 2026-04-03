'use client';

import { NVFilterGroup } from '@nova/ui';

interface FilterChipsProps {
  active: string;
  onChange: (filter: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

import { useAssetStore } from '@nova/store/useAssetStore';
import { useFolders } from '@nova/hooks';

export function FilterChips({ active, onChange, className = '', size = 'md' }: FilterChipsProps) {
  const assets = useAssetStore(state => state.assets);
  const getFolderCount = useAssetStore(state => state.getFolderCount);
  const folders = useAssetStore(state => state.folders);
  
  const rootFolders = folders.filter(f => !f.parentId).slice(0, 10);
  
  const filters = [
    { key: 'all', label: '모든 에셋', count: assets.length },
    ...rootFolders.map(f => ({
      key: `folder_${f.id}`,
      label: f.name,
      count: getFolderCount(f.id, folders)
    })),
    { key: 'inbox', label: '인박스', count: assets.filter(a => !a.folderId).length },
    { key: 'favorites', label: '즐겨찾기', count: assets.filter(a => a.isFavorite).length },
    { key: 'recent', label: '최근 항목' },
  ];

  const folderId = useAssetStore(state => state.folderId);
  
  // If we're in a folder, the key used for highlighting should be folder_[id]
  const effectiveActiveKey = active === 'folder' && folderId ? `folder_${folderId}` : active;

  return (
    <NVFilterGroup
        options={filters}
        activeKey={effectiveActiveKey}
        onChange={onChange}
        size={size}
        className={className}
      />
  );
}
