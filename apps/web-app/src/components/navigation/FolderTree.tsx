import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder as FolderIcon, MoreVertical, Plus, Sparkles, Pencil, Trash2, Copy, BrainCircuit, LayoutGrid } from 'lucide-react';
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
  NVInput 
} from '@nova/ui';

interface FolderTreeProps {
  folders: Folder[];
  activeFolderId: string | null;
  onFolderClick: (id: string | null) => void;
  getFolderCount?: (id: string) => number;
  onCreateFolder?: (parentId: string | null) => void;
  isCollapsed?: boolean;
}

export function FolderTree({ folders, activeFolderId, onFolderClick, getFolderCount, onCreateFolder, isCollapsed = false }: FolderTreeProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder?.(null);
      setNewFolderName('');
      setIsCreateOpen(false);
    }
  };

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
                    {getFolderCount && getFolderCount(folder.id) > 0 && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center transition-all duration-300",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-white/10 text-slate-400 group-hover:bg-white/20 group-hover:text-white"
                      )}>
                        {getFolderCount(folder.id)}
                      </span>
                    )}
                    <NVPopover>
                      <NVPopoverTrigger asChild>
                        <button 
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-slate-50 hover:bg-white/5 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={14} />
                        </button>
                      </NVPopoverTrigger>
                      <NVPopoverContent className="w-[280px] p-0" align="end" side="right" sideOffset={10}>
                        <NVPopoverHeader className="flex items-center gap-2 py-2.5">
                          <FolderIcon size={14} className="text-indigo-500" />
                          <span className="text-xs font-bold text-white truncate">{folder.name}</span>
                        </NVPopoverHeader>
                        <NVPopoverBody className="px-2 py-2">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1.5 mt-1">
                              추천 기능
                            </span>
                            <button className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-400 transition-all group text-left">
                              <BrainCircuit size={14} className="text-indigo-500/70 group-hover:text-indigo-500" />
                              <div className="flex flex-col">
                                <span className="text-[12px] font-medium leading-tight">AI 에셋 분석</span>
                                <span className="text-[10px] text-slate-500 group-hover:text-amber-500/70">내부 파일 특성 자동 분류</span>
                              </div>
                            </button>
                            <button className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 transition-all group text-left">
                              <LayoutGrid size={14} className="text-cyan-500/70 group-hover:text-cyan-500" />
                              <div className="flex flex-col">
                                <span className="text-[12px] font-medium leading-tight">자동 레이아웃 정리</span>
                                <span className="text-[10px] text-slate-500 group-hover:text-cyan-500/70">디자인 요소 스타일 그룹화</span>
                              </div>
                            </button>
                            
                            <div className="h-px bg-white/5 my-1.5 mx-1" />
                            
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1.5">
                              기본 관리
                            </span>
                            <button className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all text-[12px]">
                              <Pencil size={13} /> 이름 바꾸기
                            </button>
                            <button className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all text-[12px]">
                              <Copy size={13} /> 복제하기
                            </button>
                            <button className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all text-[12px]">
                              <Trash2 size={13} className="text-rose-500/70" /> 삭제하기
                            </button>
                          </div>
                        </NVPopoverBody>
                      </NVPopoverContent>
                    </NVPopover>
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
          <NVPopover open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <NVPopoverTrigger asChild>
              <button 
                className={`p-1 rounded-md text-slate-500 hover:bg-white/5 hover:text-indigo-500 transition-all ${isCollapsed ? 'mx-auto' : ''}`}
                title="폴더 추가"
              >
                <Plus size={14} />
              </button>
            </NVPopoverTrigger>
            <NVPopoverContent className="w-[240px] p-0" align="start" side="bottom" sideOffset={8}>
              <NVPopoverHeader className="py-2.5">
                <span className="text-xs font-bold text-white">새 폴더 생성</span>
              </NVPopoverHeader>
              <NVPopoverBody className="px-3 py-3">
                <NVInput 
                  size="sm"
                  placeholder="폴더 이름 입력..." 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
              </NVPopoverBody>
              <NVPopoverFooter className="py-2">
                <NVButton size="xs" variant="ghost" onClick={() => setIsCreateOpen(false)}>취소</NVButton>
                <NVButton size="xs" variant="primary" onClick={handleCreateFolder}>생성</NVButton>
              </NVPopoverFooter>
            </NVPopoverContent>
          </NVPopover>
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
                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{folder.name}</span>
                    {getFolderCount && getFolderCount(folder.id) > 0 && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center transition-all duration-300",
                        isActive 
                          ? "bg-cyan-500 text-white" 
                          : "bg-white/10 text-slate-400 group-hover:bg-white/20 group-hover:text-white"
                      )}>
                        {getFolderCount(folder.id)}
                      </span>
                    )}
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

