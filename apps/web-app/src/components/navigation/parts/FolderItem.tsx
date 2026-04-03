"use client"

import React from 'react';
import { 
  Folder as FolderIcon, 
  FolderPlus,
  FolderMinus,
  Sparkles 
} from 'lucide-react';
import { Folder } from '@nova/types/folder';
import { cn } from '@nova/lib/utils';
import { NVFolderPopover } from '@nova/ui';

interface FolderItemProps {
  folder: Folder;
  depth?: number;
  folders: Folder[];
  activeFolderId: string | null;
  expanded: Record<string, boolean>;
  isCollapsed: boolean;
  onToggleExpand: (id: string, e: React.MouseEvent) => void;
  onFolderClick: (id: string | null) => void;
  getFolderCount?: (id: string) => number;
  onCreateFolder: (parentId: string | null, name: string) => void;
  onMoveFolder?: (folder: Folder, targetFolderId: string | null) => void;
  onCopyFolder?: (folder: Folder) => void;
  onDeleteFolder?: (folder: Folder) => void;
  onRenameFolder?: (folder: Folder, newName: string) => void;
}

export function FolderItem({
  folder,
  depth = 0,
  folders,
  activeFolderId,
  expanded,
  isCollapsed,
  onToggleExpand,
  onFolderClick,
  getFolderCount,
  onCreateFolder,
  onMoveFolder,
  onCopyFolder,
  onDeleteFolder,
  onRenameFolder
}: FolderItemProps) {
  const isExpanded = expanded[folder.id];
  const hasChildren = folders.some(f => f.parentId === folder.id);
  const isActive = activeFolderId === folder.id;
  const isSmart = folder.isSmartFolder;
  const isEffectiveSmart = isSmart && depth === 0;
  
  // Normal/Smart folder specific styles
  const activeColors = isEffectiveSmart ? 'text-cyan-500 bg-cyan-500/10' : 'text-indigo-400 bg-indigo-500/10';
  const subActiveColors = isEffectiveSmart ? 'text-cyan-500 bg-cyan-500/5' : 'text-indigo-400 bg-indigo-500/5';
  const hoverColors = isEffectiveSmart 
    ? 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-50' 
    : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-50';
  const subHoverColors = 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-300';
  
  const iconColorClass = isActive 
    ? (isEffectiveSmart ? "text-cyan-500" : "text-indigo-400") 
    : (isEffectiveSmart ? "text-slate-500 group-hover:text-cyan-400" : "text-slate-500 group-hover:text-slate-300");

  const folderSubfolders = folders.filter(f => f.parentId === folder.id);
  const nonSmartFolders = folders.filter(f => !f.isSmartFolder);

  return (
    <div className="flex flex-col">
      <div 
        className={cn(
          "group flex items-center gap-3 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer relative w-full",
          depth === 0 ? "text-sm" : "text-xs",
          isActive 
            ? (depth === 0 ? activeColors : subActiveColors)
            : (depth === 0 ? hoverColors : subHoverColors),
          isCollapsed ? "justify-center px-0" : ""
        )}
        style={!isCollapsed ? { paddingLeft: '12px' } : undefined}
        onClick={() => onFolderClick(folder.id)}
        title={isCollapsed ? folder.name : undefined}
      >
        {/* Icon Area */}
        <div 
          className="relative flex items-center justify-center w-[18px] h-[18px] flex-shrink-0"
          onClick={(e) => hasChildren && onToggleExpand(folder.id, e)}
        >
          {isEffectiveSmart ? (
            <div className="relative flex items-center justify-center">
              <Sparkles 
                size={17} 
                className={cn(
                  "flex-shrink-0 transition-all",
                  iconColorClass,
                  isActive && "drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
                )} 
              />
              {hasChildren && (
                <div className={cn(
                  "absolute -right-1 -bottom-1 w-2.5 h-2.5 flex items-center justify-center rounded-[2px] text-[8px] font-bold border-[0.5px] transition-all",
                  isActive 
                    ? "bg-cyan-500 text-white border-cyan-400" 
                    : "bg-slate-900 text-slate-500 border-white/10 group-hover:border-cyan-500/50 group-hover:text-cyan-400"
                )}>
                  {isExpanded ? '−' : '+'}
                </div>
              )}
            </div>
          ) : depth === 0 ? (
            hasChildren ? (
              isExpanded ? (
                <FolderMinus size={17} className={iconColorClass} />
              ) : (
                <FolderPlus size={17} className={iconColorClass} />
              )
            ) : (
              <FolderIcon size={17} className={iconColorClass} />
            )
          ) : (
            <div className="w-[18px] h-[18px] flex-shrink-0" />
          )}
        </div>
        
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{folder.name}</span>
            <div className="flex items-center flex-shrink-0 h-full relative">
              {getFolderCount && getFolderCount(folder.id) > 0 && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center transition-all duration-300 opacity-100",
                  depth === 0 ? "group-hover:opacity-0" : "",
                  isActive 
                    ? (isEffectiveSmart ? "bg-cyan-500 text-white" : "bg-white/20 text-white")
                    : "bg-white/10 text-slate-400"
                )}>
                  {getFolderCount(folder.id)}
                </span>
              )}
              
              {!folder.parentId && (
                <NVFolderPopover
                  folder={folder}
                  subfolders={folderSubfolders}
                  allFolders={nonSmartFolders}
                  onCreateSubfolder={onCreateFolder}
                  onRename={(f, newName) => onRenameFolder?.(f as Folder, newName)}
                  onDelete={(f) => onDeleteFolder?.(f as Folder)}
                  onMove={(f, targetId) => onMoveFolder?.(f as Folder, targetId)}
                  onCopy={(f) => onCopyFolder?.(f as Folder)}
                  onAnalyze={(f) => console.log('Analyze folder:', f.id)}
                  onOrganize={(f) => console.log('Organize folder:', f.id)}
                  onOptimize={(f) => console.log('Optimize smart folder logic:', f.id)}
                />
              )}
            </div>
          </>
        )}
      </div>
      
      {!isCollapsed && isExpanded && hasChildren && depth < 2 && (
        <div className="relative">
          <div className="absolute left-[22px] top-0 bottom-2 w-[1.5px] bg-white/[0.08] shadow-[0_0_8px_rgba(255,255,255,0.02)]" />
          <div className="pl-0.5">
            <div className="flex flex-col gap-0.5 mt-0.5">
              {folders.filter(f => f.parentId === folder.id).map(child => (
                <FolderItem 
                  key={child.id} 
                  folder={child} 
                  depth={depth + 1}
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
        </div>
      )}
    </div>
  );
}
