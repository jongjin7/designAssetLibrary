"use client"

import React, { useState, useMemo } from 'react';
import {
  Folder as FolderIcon,
  MoreVertical,
  Plus,
  Sparkles,
  Pencil,
  Trash2,
  Copy,
  BrainCircuit,
  LayoutGrid,
  ArrowLeft,
  ChevronRight,
  FolderInput
} from 'lucide-react';
import {
  NVPopover,
  NVPopoverTrigger,
  NVPopoverContent,
  NVPopoverHeader,
  NVPopoverBody,
  NVIconButton,
  NVMenuItem,
  NVInput,
  NVButton
} from '../../index';
import { cn } from '../../lib/utils';

interface SimpleFolder {
  id: string;
  name: string;
  parentId: string | null;
  isSmartFolder?: boolean;
}

interface NVFolderPopoverProps {
  folder?: SimpleFolder;
  subfolders?: SimpleFolder[];
  allFolders?: SimpleFolder[];
  onOpenChange?: (open: boolean) => void;
  onCreateSubfolder?: (parentId: string | null, name: string) => void;
  onRename?: (folder: SimpleFolder, newName: string) => void;
  onDelete?: (folder: SimpleFolder) => void;
  onMove?: (folder: SimpleFolder, targetFolderId: string | null) => void;
  onCopy?: (folder: SimpleFolder) => void;
  onAnalyze?: (folder: SimpleFolder) => void;
  onOrganize?: (folder: SimpleFolder) => void;
  onOptimize?: (folder: SimpleFolder) => void;
  triggerClassName?: string;
  isCreationMode?: boolean;
  trigger?: React.ReactNode;
  initialName?: string;
}

export const NVFolderPopover: React.FC<NVFolderPopoverProps> = ({
  folder,
  subfolders = [],
  allFolders = [],
  onOpenChange,
  onCreateSubfolder,
  onRename,
  onDelete,
  onMove,
  onCopy,
  onAnalyze,
  onOrganize,
  onOptimize,
  triggerClassName,
  isCreationMode = false,
  trigger,
  initialName = ''
}) => {
  const [view, setView] = useState<'menu' | 'list' | 'create' | 'move' | 'rename'>(isCreationMode ? 'create' : 'menu');
  const [newSubfolderName, setNewSubfolderName] = useState(initialName);
  const [isOpen, setIsOpen] = useState(false);
  const [movingFolder, setMovingFolder] = useState<SimpleFolder | null>(null);
  const [moveReturnView, setMoveReturnView] = useState<'menu' | 'list'>('menu');
  const [renamingFolder, setRenamingFolder] = useState<SimpleFolder | null>(null);
  const [renameReturnView, setRenameReturnView] = useState<'menu' | 'list'>('menu');
  const [renameValue, setRenameValue] = useState('');

  const resetState = () => {
    setView(isCreationMode ? 'create' : 'menu');
    setMovingFolder(null);
    setMoveReturnView('menu');
    setRenamingFolder(null);
    setRenameReturnView('menu');
    setRenameValue('');
    setNewSubfolderName(initialName);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) setTimeout(resetState, 200);
    onOpenChange?.(open);
  };

  const resetAndClose = () => handleOpenChange(false);

  const handleCreateSubmit = () => {
    if (newSubfolderName.trim() && onCreateSubfolder) {
      onCreateSubfolder(folder?.id || null, newSubfolderName);
      resetAndClose();
    }
  };

  const startMove = (target: SimpleFolder, returnView: 'menu' | 'list') => {
    setMovingFolder(target);
    setMoveReturnView(returnView);
    setView('move');
  };

  const startRename = (target: SimpleFolder, returnView: 'menu' | 'list') => {
    setRenamingFolder(target);
    setRenameReturnView(returnView);
    setRenameValue(target.name);
    setView('rename');
  };

  const handleRenameSubmit = () => {
    if (renamingFolder && renameValue.trim()) {
      onRename?.(renamingFolder, renameValue.trim());
      resetAndClose();
    }
  };

  const moveTargetFolders = useMemo(
    () => allFolders.filter(f => !f.isSmartFolder && f.id !== movingFolder?.id && f.id !== folder?.id),
    [allFolders, movingFolder?.id, folder?.id]
  );

  return (
    <NVPopover open={isOpen} onOpenChange={handleOpenChange}>
      <NVPopoverTrigger asChild>
        {trigger || (
          <NVIconButton
            icon={MoreVertical}
            variant="ghost"
            size="xs"
            className={cn("absolute -right-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300", triggerClassName)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </NVPopoverTrigger>

      <NVPopoverContent className="w-[280px] p-0" align="start" alignOffset={-4} side="right" sideOffset={12}>
        {view === 'menu' && folder && (
          <>
            <NVPopoverHeader className="flex items-center gap-2 py-2.5">
              {folder.isSmartFolder ? (
                <Sparkles size={14} className="text-cyan-500" />
              ) : (
                <FolderIcon size={14} className="text-indigo-500" />
              )}
              <span className="text-xs font-bold text-white truncate">
                {folder.name} {folder.isSmartFolder && '(스마트)'}
              </span>
            </NVPopoverHeader>
            <NVPopoverBody className="px-2 py-2 max-h-[480px] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1.5 mt-1">
                  {folder.isSmartFolder ? '스마트 기능 제어' : '추천 기능'}
                </span>

                {folder.isSmartFolder ? (
                  <NVMenuItem
                    icon={BrainCircuit}
                    label="로직 최적화"
                    description="AI 에디터로 필터 규칙 자동 개선"
                    variant="vivid"
                    className="hover:bg-cyan-500/10 hover:text-cyan-400"
                    onClick={() => onOptimize?.(folder)}
                  />
                ) : (
                  <>
                    <NVMenuItem
                      icon={BrainCircuit}
                      label="AI 에셋 분석"
                      description="내부 파일 특성 자동 분류"
                      variant="vivid"
                      onClick={() => onAnalyze?.(folder)}
                    />
                    <NVMenuItem
                      icon={LayoutGrid}
                      label="자동 레이아웃 정리"
                      description="디자인 요소 스타일 그룹화"
                      className="hover:bg-cyan-500/10 hover:text-cyan-400"
                      onClick={() => onOrganize?.(folder)}
                    />
                  </>
                )}

                <div className="h-px bg-white/5 my-1.5 mx-1" />

                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 py-1.5">
                  폴더 관리
                </span>

                {!folder.isSmartFolder && (
                  <>
                    {subfolders.length > 0 && (
                      <NVMenuItem
                        label="하위 폴더 목록 보기"
                        icon={FolderIcon}
                        rightElement={<ChevronRight size={12} className="text-slate-600 group-hover:text-indigo-500 transition-all" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setView('list');
                        }}
                      />
                    )}
                    <NVMenuItem
                      icon={Plus}
                      label="하위 폴더 추가"
                      onClick={(e) => {
                        e.stopPropagation();
                        setView('create');
                      }}
                    />
                    <NVMenuItem
                      icon={FolderInput}
                      label="이동"
                      onClick={(e) => {
                        e.stopPropagation();
                        startMove(folder, 'menu');
                      }}
                    />
                    <NVMenuItem
                      icon={Copy}
                      label="복사"
                      onClick={() => { onCopy?.(folder); resetAndClose(); }}
                    />
                  </>
                )}
                <NVMenuItem
                  icon={Pencil}
                  label="이름 바꾸기"
                  onClick={(e) => { e.stopPropagation(); startRename(folder, 'menu'); }}
                />
                <NVMenuItem
                  icon={Trash2}
                  label={folder.isSmartFolder ? "스마트 폴더 삭제" : "삭제하기"}
                  variant="danger"
                  onClick={() => { onDelete?.(folder); resetAndClose(); }}
                />
              </div>
            </NVPopoverBody>
          </>
        )}

        {view === 'list' && (
          <>
            <NVPopoverHeader className="flex items-center gap-3 py-2.5">
              <button
                className="p-1 -ml-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setView('menu');
                }}
              >
                <ArrowLeft size={14} />
              </button>
              <span className="text-xs font-bold text-white truncate">하위 폴더 목록</span>
            </NVPopoverHeader>
            <NVPopoverBody className="px-2 py-2 max-h-[360px] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col gap-0.5 px-0.5">
                {subfolders.map(child => (
                  <div key={child.id} className="flex items-center justify-between px-2 py-1 rounded-lg bg-white/[0.02] hover:bg-white/5 group/child transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-1 h-1 rounded-full bg-slate-700 group-hover/child:bg-indigo-500 transition-colors" />
                      <span className="text-[11.5px] text-slate-400 group-hover/child:text-slate-300 truncate font-medium">{child.name}</span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover/child:opacity-100 transition-opacity">
                      <button className="p-1 text-slate-600 hover:text-indigo-400 transition-colors" title="이동" onClick={(e) => {
                        e.stopPropagation();
                        startMove(child, 'list');
                      }}>
                        <FolderInput size={11} />
                      </button>
                      <button className="p-1 text-slate-600 hover:text-slate-200 transition-colors" title="이름 바꾸기" onClick={(e) => {
                        e.stopPropagation();
                        startRename(child, 'list');
                      }}>
                        <Pencil size={11} />
                      </button>
                      <button className="p-1 text-slate-600 hover:text-rose-400 transition-colors" title="삭제" onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(child);
                        resetAndClose();
                      }}>
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </NVPopoverBody>
          </>
        )}

        {view === 'move' && movingFolder && (
          <>
            <NVPopoverHeader className="flex items-center gap-3 py-2.5">
              <button
                className="p-1 -ml-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setView(moveReturnView);
                }}
              >
                <ArrowLeft size={14} />
              </button>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white">이동할 위치 선택</span>
                <span className="text-[10px] text-slate-500 truncate">
                  &ldquo;{movingFolder.name}&rdquo;
                </span>
              </div>
            </NVPopoverHeader>
            <NVPopoverBody className="px-2 py-2 max-h-[360px] overflow-y-auto custom-scrollbar">
              {moveTargetFolders.length === 0 ? (
                <p className="text-[11px] text-slate-500 text-center py-6 px-4">
                  이동 가능한 폴더가 없습니다.
                </p>
              ) : (
                <div className="flex flex-col gap-0.5 px-0.5">
                  {/* 최상위(루트) 이동 옵션 */}
                  <button
                    className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-left hover:bg-indigo-500/10 transition-all group/target"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMove?.(movingFolder, null);
                      resetAndClose();
                    }}
                  >
                    <FolderIcon size={13} className="text-slate-600 group-hover/target:text-indigo-400 flex-shrink-0 transition-colors" />
                    <span className="text-[11.5px] text-slate-400 group-hover/target:text-indigo-300 font-medium transition-colors">
                      최상위 (루트)
                    </span>
                  </button>

                  <div className="h-px bg-white/5 my-1 mx-1" />

                  {moveTargetFolders.map(target => (
                    <button
                      key={target.id}
                      className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-left hover:bg-indigo-500/10 transition-all group/target"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMove?.(movingFolder, target.id);
                        resetAndClose();
                      }}
                    >
                      <FolderIcon size={13} className="text-slate-600 group-hover/target:text-indigo-400 flex-shrink-0 transition-colors" />
                      <span className="text-[11.5px] text-slate-400 group-hover/target:text-indigo-300 font-medium truncate transition-colors">
                        {target.name}
                      </span>
                      {target.parentId && (
                        <span className="ml-auto text-[10px] text-slate-600 flex-shrink-0">
                          하위
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </NVPopoverBody>
          </>
        )}

        {view === 'rename' && renamingFolder && (
          <>
            <NVPopoverHeader className="flex items-center gap-3 py-2.5">
              <button
                className="p-1 -ml-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
                onClick={(e) => { e.stopPropagation(); setView(renameReturnView); }}
              >
                <ArrowLeft size={14} />
              </button>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white">이름 바꾸기</span>
                <span className="text-[10px] text-slate-500 truncate">&ldquo;{renamingFolder.name}&rdquo;</span>
              </div>
            </NVPopoverHeader>
            <NVPopoverBody className="px-4 py-4">
              <div className="flex flex-col gap-4">
                <NVInput
                  size="sm"
                  placeholder="새 폴더 이름..."
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                />
                <div className="flex justify-end gap-2">
                  <NVButton size="xs" variant="ghost" className="h-9 px-4 rounded-lg" onClick={(e) => {
                    e.stopPropagation();
                    setView(renameReturnView);
                  }}>취소</NVButton>
                  <NVButton size="xs" variant="primary" className="h-9 px-4 rounded-lg shadow-lg shadow-indigo-500/20" onClick={(e) => {
                    e.stopPropagation();
                    handleRenameSubmit();
                  }}>저장</NVButton>
                </div>
              </div>
            </NVPopoverBody>
          </>
        )}

        {view === 'create' && (
          <>
            <NVPopoverHeader className="flex items-center gap-3 py-2.5">
              {!isCreationMode && (
                <button
                  className="p-1 -ml-1 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setView('menu');
                  }}
                >
                  <ArrowLeft size={14} />
                </button>
              )}
              <span className="text-xs font-bold text-white">
                {folder ? '하위 폴더 생성' : '새 폴더 생성'}
              </span>
            </NVPopoverHeader>
            <NVPopoverBody className="px-4 py-4">
              <div className="flex flex-col gap-4">
                <NVInput
                  size="sm"
                  placeholder={folder ? "하위 폴더 이름 입력..." : "폴더 이름 입력..."}
                  value={newSubfolderName}
                  onChange={(e) => setNewSubfolderName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateSubmit()}
                />
                <div className="flex justify-end gap-2">
                  <NVButton size="xs" variant="ghost" className="h-9 px-4 rounded-lg" onClick={(e) => {
                    e.stopPropagation();
                    if (isCreationMode) {
                      resetAndClose();
                    } else {
                      setView('menu');
                    }
                  }}>취소</NVButton>
                  <NVButton size="xs" variant="primary" className="h-9 px-4 rounded-lg shadow-lg shadow-indigo-500/20" onClick={(e) => {
                    e.stopPropagation();
                    handleCreateSubmit();
                  }}>생성</NVButton>
                </div>
              </div>
            </NVPopoverBody>
          </>
        )}
      </NVPopoverContent>
    </NVPopover>
  );
};
