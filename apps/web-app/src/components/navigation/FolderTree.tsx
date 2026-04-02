import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder as FolderIcon, FolderOpen, MoreVertical, Plus, Sparkles, Pencil, Trash2, Copy, BrainCircuit, LayoutGrid, ArrowLeft } from 'lucide-react';
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
  NVIconButton 
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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [popoverViews, setPopoverViews] = useState<Record<string, 'menu' | 'create' | 'list'>>({});
  const [subfolderName, setSubfolderName] = useState('');

  const handleCreateFolder = (parentId: string | null = null, name: string) => {
    if (name.trim()) {
      onCreateFolder?.(parentId, name);
      if (parentId) {
        setSubfolderName('');
        setPopoverViews(prev => ({ ...prev, [parentId]: 'menu' }));
      } else {
        setNewFolderName('');
        setIsCreateOpen(false);
      }
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
          const currentView = popoverViews[folder.id] || 'menu';
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
                    {isExpanded ? (
                      <FolderOpen 
                        size={17} 
                        className={`flex-shrink-0 transition-all ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} 
                      />
                    ) : (
                      <FolderIcon 
                        size={17} 
                        className={`flex-shrink-0 transition-all ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} 
                      />
                    )}
                  </div>
                ) : (
                  <div className="w-[18px] h-[18px] flex-shrink-0" />
                )}
                
                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{folder.name}</span>
                    <div className="flex items-center flex-shrink-0">
                      {getFolderCount && getFolderCount(folder.id) > 0 && (
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center transition-all duration-300 opacity-100 ",
                          depth === 0 ? "group-hover:opacity-0" : "",
                          isActive 
                            ? "bg-white/20 text-white" 
                            : "bg-white/10 text-slate-400"
                        )}>
                          {getFolderCount(folder.id)}
                        </span>
                      )}
                      
                      {depth === 0 && (
                        <NVPopover onOpenChange={(open) => !open && setPopoverViews(prev => ({ ...prev, [folder.id]: 'menu' }))}>
                          <NVPopoverTrigger asChild>
                            <NVIconButton 
                              icon={MoreVertical}
                              variant="ghost" 
                              size="xs"
                              className="absolute right-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </NVPopoverTrigger>
                          <NVPopoverContent className="w-[280px] p-0" align="start" alignOffset={-4} side="right" sideOffset={12}>
                            {currentView === 'menu' ? (
                              <>
                                <NVPopoverHeader className="flex items-center gap-2 py-2.5">
                                  <FolderIcon size={14} className="text-indigo-500" />
                                  <span className="text-xs font-bold text-white truncate">{folder.name}</span>
                                </NVPopoverHeader>
                                <NVPopoverBody className="px-2 py-2 max-h-[480px] overflow-y-auto custom-scrollbar">
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
                                      구조 및 관리
                                    </span>

                                    {folderSubfolders.length > 0 && (
                                      <button 
                                        className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-400 transition-all text-[12px] w-full text-left font-medium group"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPopoverViews(prev => ({ ...prev, [folder.id]: 'list' }));
                                        }}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 group-hover:bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.3)] transition-all" />
                                          하위 폴더 목록 보기
                                        </div>
                                        <ChevronRight size={12} className="text-slate-600 group-hover:text-indigo-500 transition-all" />
                                      </button>
                                    )}

                                    <button 
                                      className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-300 hover:text-indigo-400 transition-all text-[12px] w-full text-left font-medium"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPopoverViews(prev => ({ ...prev, [folder.id]: 'create' }));
                                      }}
                                    >
                                      <Plus size={13} /> 하위 폴더 추가
                                    </button>

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
                              </>
                            ) : currentView === 'list' ? (
                              <>
                                <NVPopoverHeader className="flex items-center gap-3 py-2.5">
                                  <button
                                    className="p-1 -ml-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPopoverViews(prev => ({ ...prev, [folder.id]: 'menu' }));
                                    }}
                                  >
                                    <ArrowLeft size={14} />
                                  </button>
                                  <span className="text-xs font-bold text-white truncate">하위 폴더 목록</span>
                                </NVPopoverHeader>
                                <NVPopoverBody className="px-2 py-2 max-h-[360px] overflow-y-auto custom-scrollbar">
                                  <div className="flex flex-col gap-0.5 px-0.5">
                                    {folderSubfolders.map(child => (
                                      <div key={child.id} className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/[0.02] hover:bg-white/5 group/child transition-all border border-transparent hover:border-white/5">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                          <div className="w-1 h-1 rounded-full bg-slate-700 group-hover/child:bg-indigo-500 transition-colors" />
                                          <span className="text-[11.5px] text-slate-400 group-hover/child:text-slate-300 truncate font-medium">{child.name}</span>
                                        </div>
                                        <div className="flex items-center gap-0.5 opacity-0 group-hover/child:opacity-100 transition-opacity">
                                          <button className="p-1 text-slate-600 hover:text-slate-200 transition-colors" onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Rename requested for:', child.id);
                                          }}>
                                            <Pencil size={11} />
                                          </button>
                                          <button className="p-1 text-slate-600 hover:text-rose-400 transition-colors" onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Delete requested for:', child.id);
                                          }}>
                                            <Trash2 size={11} />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </NVPopoverBody>
                              </>
                            ) : (
                              <>
                                <NVPopoverHeader className="flex items-center gap-3 py-2.5">
                                  <button
                                    className="p-1 -ml-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPopoverViews(prev => ({ ...prev, [folder.id]: 'menu' }));
                                    }}
                                  >
                                    <ArrowLeft size={14} />
                                  </button>
                                  <span className="text-xs font-bold text-white">하위 폴더 생성</span>
                                </NVPopoverHeader>
                                <NVPopoverBody className="px-4 py-4">
                                  <div className="flex flex-col gap-4">
                                    <NVInput 
                                      size="sm"
                                      placeholder="하위 폴더 이름 입력..." 
                                      className="bg-white/5 border-white/10"
                                      value={subfolderName}
                                      onChange={(e) => setSubfolderName(e.target.value)}
                                      autoFocus
                                      onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder(folder.id, subfolderName)}
                                    />
                                    <div className="flex justify-end gap-2">
                                      <NVButton size="xs" variant="ghost" className="h-9 px-4 rounded-lg" onClick={(e) => {
                                        e.stopPropagation();
                                        setPopoverViews(prev => ({ ...prev, [folder.id]: 'menu' }));
                                      }}>취소</NVButton>
                                      <NVButton size="xs" variant="primary" className="h-9 px-4 rounded-lg shadow-lg shadow-indigo-500/20" onClick={(e) => {
                                        e.stopPropagation();
                                        handleCreateFolder(folder.id, subfolderName);
                                      }}>생성</NVButton>
                                    </div>
                                  </div>
                                </NVPopoverBody>
                              </>
                            )}
                          </NVPopoverContent>
                        </NVPopover>
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
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder(null, newFolderName)}
                />
              </NVPopoverBody>
              <NVPopoverFooter className="py-2">
                <NVButton size="xs" variant="ghost" onClick={() => setIsCreateOpen(false)}>취소</NVButton>
                <NVButton size="xs" variant="primary" onClick={() => handleCreateFolder(null, newFolderName)}>생성</NVButton>
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
                            : "bg-white/10 text-slate-400 group-hover:bg-white/20 group-hover:text-white"
                        )}>
                          {getFolderCount(folder.id)}
                        </span>
                      )}
                      
                      <NVPopover onOpenChange={(open) => !open && setPopoverViews(prev => ({ ...prev, [folder.id]: 'menu' }))}>
                        <NVPopoverTrigger asChild>
                          <NVIconButton 
                            icon={MoreVertical}
                            variant="ghost" 
                            size="xs"
                            className="absolute right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 text-slate-500 hover:text-cyan-400"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </NVPopoverTrigger>
                        <NVPopoverContent className="w-[280px] p-0" align="start" alignOffset={-4} side="right" sideOffset={12}>
                          <NVPopoverHeader className="flex items-center gap-2 py-2.5">
                            <Sparkles size={14} className="text-cyan-500" />
                            <span className="text-xs font-bold text-white truncate">{folder.name} (스마트)</span>
                          </NVPopoverHeader>
                          <NVPopoverBody className="px-2 py-2">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1.5 mt-1 border-b border-white/5 mb-1">
                                스마트 기능 제어
                              </span>
                              <button className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-400 transition-all group text-left">
                                <BrainCircuit size={14} className="text-cyan-500/70 group-hover:text-cyan-500" />
                                <div className="flex flex-col">
                                  <span className="text-[12px] font-medium leading-tight">로직 최적화</span>
                                  <span className="text-[10px] text-slate-500 group-hover:text-cyan-400/70">AI 에디터로 필터 규칙 자동 개선</span>
                                </div>
                              </button>
                              
                              <div className="h-px bg-white/5 my-1.5 mx-1" />
                              
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1.5">
                                폴더 관리
                              </span>
                              <button className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all text-[12px]">
                                <Pencil size={13} /> 필터 규칙 수정
                              </button>
                              <button className="flex items-center gap-3 px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-slate-200 transition-all text-[12px]">
                                <Trash2 size={13} className="text-rose-500/70" /> 스마트 폴더 삭제
                              </button>
                            </div>
                          </NVPopoverBody>
                        </NVPopoverContent>
                      </NVPopover>
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
