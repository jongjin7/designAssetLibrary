import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder as FolderIcon, MoreVertical, Plus } from 'lucide-react';
import { Folder } from '../../types/folder';

interface FolderTreeProps {
  folders: Folder[];
  activeFolderId: string | null;
  onFolderClick: (id: string | null) => void;
  onCreateFolder?: (parentId: string | null) => void;
}

export function FolderTree({ folders, activeFolderId, onFolderClick, onCreateFolder }: FolderTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderFolderItems = (parentId: string | null = null, depth = 0) => {
    const items = folders.filter(f => f.parentId === parentId && !f.isSmartFolder);

    if (items.length === 0 && depth > 0) return null;

    return (
      <div className={`folder-tree__list folder-tree__list--depth-${depth}`}>
        {items.map(folder => {
          const isExpanded = expanded[folder.id];
          const hasChildren = folders.some(f => f.parentId === folder.id);
          const isActive = activeFolderId === folder.id;

          return (
            <div key={folder.id} className="folder-tree__node">
              <div 
                className={`folder-tree__item ${isActive ? 'is-active' : ''}`}
                style={{ paddingLeft: `${depth * 12 + 12}px` }}
                onClick={() => onFolderClick(folder.id)}
              >
                <span className="folder-tree__toggle" onClick={(e) => toggleExpand(folder.id, e)}>
                  {hasChildren ? (
                    isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                  ) : (
                    <span className="folder-tree__spacer" />
                  )}
                </span>
                <FolderIcon size={16} className="folder-tree__icon" />
                <span className="folder-tree__name">{folder.name}</span>
                <button className="folder-tree__more">
                  <MoreVertical size={14} />
                </button>
              </div>
              {isExpanded && renderFolderItems(folder.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="folder-tree">
      <div className="folder-tree__section">
        <div className="folder-tree__section-header">
          <span className="nav-section-title">폴더</span>
          <button className="add-btn" onClick={() => onCreateFolder?.(null)}>
            <Plus size={14} />
          </button>
        </div>
        {renderFolderItems(null)}
      </div>

      <div className="folder-tree__section">
        <span className="nav-section-title">스마트 폴더</span>
        <div className="folder-tree__list">
          {folders.filter(f => f.isSmartFolder).map(folder => (
            <div 
              key={folder.id} 
              className={`folder-tree__item ${activeFolderId === folder.id ? 'is-active' : ''}`}
              style={{ paddingLeft: '12px' }}
              onClick={() => onFolderClick(folder.id)}
            >
              <span className="folder-tree__spacer" />
              <div className="smart-folder-dot" />
              <span className="folder-tree__name">{folder.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
