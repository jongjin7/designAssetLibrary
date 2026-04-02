"use client"

import { useState } from 'react';
import { 
  ChevronDown, 
  Folder as FolderIcon, 
  FolderOpen, 
  FolderPlus,
  FolderMinus,
  Plus, 
  Sparkles 
} from 'lucide-react';
import { Folder } from '@nova/types/folder';
import { cn } from '@nova/lib/utils';
import { 
  NVPopover, 
  NVPopoverTrigger, 
  NVPopoverContent, 
  NVPopoverHeader, 
  NVPopoverBody, 
  NVPopoverFooter,
  NVButton, 
  NVInput,
  NVFolderPopover
} from '@nova/ui';

interface FolderTreeProps {
  folders: Folder[];
  activeFolderId: string | null;
  onFolderClick: (id: string | null) => void;
  getFolderCount?: (id: string) => number;
  onCreateFolder?: (parentId: string | null, name: string) => void;
  isCollapsed?: boolean;
}

export function FolderTree({ folders, activeFolderId, onFolderClick, getFolderCount, onCreateFolder, isCollapsed = false }: FolderTreeProps) {
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

  const renderFolderItems = (parentId: string | null = null, depth = 0) => {
    if (depth > 1) return null;
    
    const items = folders.filter(f => f.parentId === parentId && !f.isSmartFolder);

    if (items.length === 0 && depth > 0) return null;

    return (
      <div className={`flex flex-col gap-0.5 ${depth > 0 ? 'mt-0.5' : ''}`}>
        {items.map(folder => {
          const isExpanded = expanded[folder.id];
          const hasChildren = folders.some(f => f.parentId === folder.id);
          const isActive = activeFolderId === folder.id;
          const folderSubfolders = folders.filter(f => f.parentId === folder.id);

          return (
            <div key={folder.id} className="flex flex-col">
              <div 
                className={`group flex items-center gap-3 px-3.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer relative w-full
                  ${depth === 0 ? 'text-[13px]' : 'text-[12px]'}
                  ${isActive 
                    ? (depth === 0 ? 'text-indigo-400 bg-indigo-500/10' : 'text-indigo-400 bg-indigo-500/5')
                    : (depth === 0 ? 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-50' : 'text-slate-500 hover:bg-white/[0.02] hover:text-slate-300')}
                  ${isCollapsed ? 'justify-center px-0' : ''}`}
                style={!isCollapsed ? { paddingLeft: '14px' } : undefined}
                onClick={() => onFolderClick(folder.id)}
                title={isCollapsed ? folder.name : undefined}
              >
                {depth === 0 ? (
                  <div 
                    className="relative flex items-center justify-center w-[18px] h-[18px] flex-shrink-0"
                    onClick={(e) => hasChildren && toggleExpand(folder.id, e)}
                  >
                    {hasChildren ? (
                      isExpanded ? (
                        <FolderMinus 
                          size={17} 
                          className={cn(
                            "flex-shrink-0 transition-all",
                            isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                          )} 
                        />
                      ) : (
                        <FolderPlus 
                          size={17} 
                          className={cn(
                            "flex-shrink-0 transition-all",
                            isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                          )} 
                        />
                      )
                    ) : (
                      <FolderIcon 
                        size={17} 
                        className={cn(
                          "flex-shrink-0 transition-all",
                          isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                        )} 
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-[18px] h-[18px] flex-shrink-0" />
                )}
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{folder.name}</span>
                    <div className="flex items-center flex-shrink-0 h-full relative">
                      {getFolderCount && getFolderCount(folder.id) > 0 && (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center transition-all duration-300 opacity-100",
                          depth === 0 ? "group-hover:opacity-0" : "",
                          isActive 
                            ? "bg-white/20 text-white" 
                            : "bg-white/10 text-slate-400"
                        )}>
                          {getFolderCount(folder.id)}
                        </span>
                      )}
                      
                      {depth === 0 && (
                        <NVFolderPopover 
                          folder={folder}
                          subfolders={folderSubfolders}
                          onCreateSubfolder={handleCreateFolder}
                          onRename={(f) => console.log('Rename folder:', f.id)}
                          onDelete={(f) => console.log('Delete folder:', f.id)}
                          onDuplicate={(f) => console.log('Duplicate folder:', f.id)}
                          onAnalyze={(f) => console.log('Analyze folder:', f.id)}
                          onOrganize={(f) => console.log('Organize folder:', f.id)}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {!isCollapsed && isExpanded && (
                <div className="relative">
                  <div className="absolute left-[22px] top-0 bottom-2 w-[1.5px] bg-white/[0.08] shadow-[0_0_8px_rgba(255,255,255,0.02)]" />
                  <div className="pl-0.5">
                    {renderFolderItems(folder.id, depth + 1)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-3 py-1 mb-1">
          {!isCollapsed && (
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              폴더
            </span>
          )}
          <NVFolderPopover 
            isCreationMode={true}
            onCreateSubfolder={(parentId, name) => handleCreateFolder(parentId, name)}
            trigger={
              <button 
                className={`p-1 rounded-md text-slate-500 hover:bg-white/5 hover:text-indigo-500 transition-all ${isCollapsed ? 'mx-auto' : ''}`}
                title="폴더 추가"
              >
                <Plus size={14} />
              </button>
            }
          />
        </div>
        {renderFolderItems(null)}
      </div>

      <div className="flex flex-col">
        {!isCollapsed && (
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 py-1 mb-1">
            스마트 폴더
          </span>
        )}
        <div className="flex flex-col gap-0.5">
          {folders.filter(f => f.isSmartFolder).map(folder => {
            const isActive = activeFolderId === folder.id;
            
            return (
              <div 
                key={folder.id} 
                className={`group flex items-center gap-3 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer relative
                  ${isActive 
                    ? 'text-cyan-500 bg-cyan-500/10' 
                    : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-50'}
                  ${isCollapsed ? 'justify-center px-0' : ''}`}
                style={!isCollapsed ? { paddingLeft: '14px' } : undefined}
                onClick={() => onFolderClick(folder.id)}
                title={isCollapsed ? folder.name : undefined}
              >
                {!isCollapsed && (
                  <div className="w-[18px] h-[18px] flex items-center justify-center flex-shrink-0">
                    <Sparkles 
                      size={17} 
                      className={`flex-shrink-0 transition-all
                        ${isActive 
                          ? 'text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                          : 'text-slate-500 group-hover:text-cyan-400'}`} 
                    />
                  </div>
                )}
                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{folder.name}</span>
                    <div className="flex items-center flex-shrink-0 relative h-full">
                      {getFolderCount && getFolderCount(folder.id) > 0 && (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center transition-all duration-300 opacity-100 group-hover:opacity-0",
                          isActive 
                            ? "bg-cyan-500 text-white" 
                            : "bg-white/10 text-slate-400"
                        )}>
                          {getFolderCount(folder.id)}
                        </span>
                      )}
                      
                      <NVFolderPopover 
                        folder={folder}
                        onRename={(f) => console.log('Rename smart folder:', f.id)}
                        onDelete={(f) => console.log('Delete smart folder:', f.id)}
                        onOptimize={(f) => console.log('Optimize smart folder logic:', f.id)}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
