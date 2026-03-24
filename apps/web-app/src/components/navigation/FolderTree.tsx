import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder as FolderIcon, MoreVertical, Plus, Sparkles } from 'lucide-react';
import { Folder } from '@nova/types/folder';

interface FolderTreeProps {
  folders: Folder[];
  activeFolderId: string | null;
  onFolderClick: (id: string | null) => void;
  onCreateFolder?: (parentId: string | null) => void;
  isCollapsed?: boolean;
}

export function FolderTree({ folders, activeFolderId, onFolderClick, onCreateFolder, isCollapsed = false }: FolderTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderFolderItems = (parentId: string | null = null, depth = 0) => {
    const items = folders.filter(f => f.parentId === parentId && !f.isSmartFolder);

    if (items.length === 0 && depth > 0) return null;

    return (
      <div className={`flex flex-col gap-0.5 ${depth > 0 ? 'mt-0.5' : ''}`}>
        {items.map(folder => {
          const isExpanded = expanded[folder.id];
          const hasChildren = folders.some(f => f.parentId === folder.id);
          const isActive = activeFolderId === folder.id;

          return (
            <div key={folder.id} className="flex flex-col">
              <div 
                className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer relative
                  ${isActive 
                    ? 'text-indigo-500 bg-indigo-500/10' 
                    : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-50'}
                  ${isCollapsed ? 'justify-center px-0' : ''}`}
                style={!isCollapsed ? { paddingLeft: `${depth * 12 + 12}px` } : undefined}
                onClick={() => onFolderClick(folder.id)}
                title={isCollapsed ? folder.name : undefined}
              >
                {!isCollapsed && (
                  <span 
                    className="flex items-center justify-center w-4 h-4 text-slate-500 hover:text-slate-50 transition-colors"
                    onClick={(e) => toggleExpand(folder.id, e)}
                  >
                    {hasChildren ? (
                      isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                    ) : (
                      <span className="w-3.5" />
                    )}
                  </span>
                )}
                <FolderIcon 
                  size={16} 
                  className={`flex-shrink-0 ${isActive ? 'text-indigo-500' : 'text-slate-500 group-hover:text-slate-300'}`} 
                />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{folder.name}</span>
                    <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-slate-50 hover:bg-white/5 transition-all">
                      <MoreVertical size={14} />
                    </button>
                  </>
                )}
              </div>
              {!isCollapsed && isExpanded && renderFolderItems(folder.id, depth + 1)}
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
          <button 
            className={`p-1 rounded-md text-slate-500 hover:bg-white/5 hover:text-indigo-500 transition-all ${isCollapsed ? 'mx-auto' : ''}`}
            onClick={() => onCreateFolder?.(null)} 
            title="폴더 추가"
          >
            <Plus size={14} />
          </button>
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
                className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer
                  ${isActive 
                    ? 'text-cyan-500 bg-cyan-500/10' 
                    : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-50'}
                  ${isCollapsed ? 'justify-center px-0' : ''}`}
                style={!isCollapsed ? { paddingLeft: '12px' } : undefined}
                onClick={() => onFolderClick(folder.id)}
                title={isCollapsed ? folder.name : undefined}
              >
                {!isCollapsed && <span className="w-4" />}
                <Sparkles 
                  size={16} 
                  className={`flex-shrink-0 transition-all
                    ${isActive 
                      ? 'text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                      : 'text-slate-500 group-hover:text-cyan-400'}`} 
                />
                {!isCollapsed && <span className="flex-1 truncate">{folder.name}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

