"use client"

import React from 'react';
import { Plus } from 'lucide-react';
import { NVFolderPopover } from '@nova/ui';
import { Folder } from '@nova/types/folder';
import { FolderItem } from './FolderItem';

interface FolderSectionProps {
  title: string;
  items: Folder[];
  isCollapsed: boolean;
  creationMode?: boolean;
  folders: Folder[];
  activeFolderId: string | null;
  expanded: Record<string, boolean>;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onFolderClick: (id: string | null) => void;
  getFolderCount?: (id: string) => number;
  onCreateFolder: (parentId: string | null, name: string) => void;
  onMoveFolder?: (folder: Folder, targetFolderId: string | null) => void;
  onCopyFolder?: (folder: Folder) => void;
  onDeleteFolder?: (folder: Folder) => void;
  onRenameFolder?: (folder: Folder, newName: string) => void;
}

export function FolderSection({
  title,
  items,
  isCollapsed,
  creationMode = false,
  folders,
  activeFolderId,
  expanded,
  onToggleExpand,
  onFolderClick,
  getFolderCount,
  onCreateFolder,
  onMoveFolder,
  onCopyFolder,
  onDeleteFolder,
  onRenameFolder
}: FolderSectionProps) {
  if (items.length === 0 && !creationMode) return null;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-3 py-1 mb-1">
        {!isCollapsed && (
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            {title}
          </span>
        )}
        {creationMode && (
          <NVFolderPopover 
            isCreationMode={true}
            onCreateSubfolder={(parentId, name) => onCreateFolder(parentId, name)}
            trigger={
              <button 
                className={`p-1 rounded-md text-slate-500 hover:bg-white/5 hover:text-indigo-500 transition-all ${isCollapsed ? 'mx-auto' : ''}`}
                title="폴더 추가"
              >
                <Plus size={14} />
              </button>
            }
          />
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        {items.map(folder => (
          <FolderItem 
            key={folder.id} 
            folder={folder} 
            folders={folders}
            activeFolderId={activeFolderId}
            expanded={expanded}
            isCollapsed={isCollapsed}
            onToggleExpand={onToggleExpand}
            onFolderClick={onFolderClick}
            getFolderCount={getFolderCount}
            onCreateFolder={onCreateFolder}
            onMoveFolder={onMoveFolder}
            onCopyFolder={onCopyFolder}
            onDeleteFolder={onDeleteFolder}
            onRenameFolder={onRenameFolder}
          />
        ))}
      </div>
    </div>
  );
}
