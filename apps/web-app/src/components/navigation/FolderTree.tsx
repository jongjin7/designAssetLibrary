"use client"

import { useState } from 'react';
import { Folder } from '@nova/types/folder';
import { FolderSection } from './parts/FolderSection';

interface FolderTreeProps {
  folders: Folder[];
  activeFolderId: string | null;
  onFolderClick: (id: string | null) => void;
  getFolderCount?: (id: string) => number;
  onCreateFolder?: (parentId: string | null, name: string) => void;
  onMoveFolder?: (folder: Folder, targetFolderId: string | null) => void;
  onCopyFolder?: (folder: Folder) => void;
  onDeleteFolder?: (folder: Folder) => void;
  onRenameFolder?: (folder: Folder, newName: string) => void;
  isCollapsed?: boolean;
}

export function FolderTree({ folders, activeFolderId, onFolderClick, getFolderCount, onCreateFolder, onMoveFolder, onCopyFolder, onDeleteFolder, onRenameFolder, isCollapsed = false }: FolderTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  
  const handleCreateFolder = (parentId: string | null = null, name: string) => {
    if (name.trim()) {
      onCreateFolder?.(parentId, name);
    }
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-6">
      <FolderSection 
        title="폴더"
        items={folders.filter(f => !f.isSmartFolder && !f.parentId)}
        creationMode={true}
        folders={folders}
        activeFolderId={activeFolderId}
        expanded={expanded}
        isCollapsed={isCollapsed}
        onToggleExpand={toggleExpand}
        onFolderClick={onFolderClick}
        getFolderCount={getFolderCount}
        onCreateFolder={handleCreateFolder}
        onMoveFolder={onMoveFolder}
        onCopyFolder={onCopyFolder}
        onDeleteFolder={onDeleteFolder}
        onRenameFolder={onRenameFolder}
      />
      
      <FolderSection 
        title="스마트 폴더"
        items={folders.filter(f => f.isSmartFolder && !f.parentId)}
        folders={folders}
        activeFolderId={activeFolderId}
        expanded={expanded}
        isCollapsed={isCollapsed}
        onToggleExpand={toggleExpand}
        onFolderClick={onFolderClick}
        getFolderCount={getFolderCount}
        onCreateFolder={handleCreateFolder}
        onMoveFolder={onMoveFolder}
        onCopyFolder={onCopyFolder}
        onDeleteFolder={onDeleteFolder}
        onRenameFolder={onRenameFolder}
      />
    </div>
  );
}
