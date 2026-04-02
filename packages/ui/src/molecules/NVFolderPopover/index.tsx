"use client"

import React, { useState } from 'react';
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
  ChevronRight 
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

// We may need to define or import Folder type here if needed for deeper integration, 
// for now we use a generic enough interface or assume it's passed.
interface SimpleFolder {
  id: string;
  name: string;
  parentId: string | null;
  isSmartFolder?: boolean;
}

interface NVFolderPopoverProps {
  folder: SimpleFolder;
  subfolders?: SimpleFolder[];
  onOpenChange?: (open: boolean) => void;
  onCreateSubfolder?: (parentId: string, name: string) => void;
  onRename?: (folder: SimpleFolder) => void;
  onDelete?: (folder: SimpleFolder) => void;
  onDuplicate?: (folder: SimpleFolder) => void;
  onAnalyze?: (folder: SimpleFolder) => void;
  onOrganize?: (folder: SimpleFolder) => void;
  onOptimize?: (folder: SimpleFolder) => void;
  triggerClassName?: string;
}

export const NVFolderPopover: React.FC<NVFolderPopoverProps> = ({
  folder,
  subfolders = [],
  onOpenChange,
  onCreateSubfolder,
  onRename,
  onDelete,
  onDuplicate,
  onAnalyze,
  onOrganize,
  onOptimize,
  triggerClassName
}) => {
  const [view, setView] = useState<'menu' | 'list' | 'create'>('menu');
  const [newSubfolderName, setNewSubfolderName] = useState('');

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => setView('menu'), 200); // Reset view after animation
    }
    onOpenChange?.(open);
  };

  const handleCreateSubmit = () => {
    if (newSubfolderName.trim() && onCreateSubfolder) {
      onCreateSubfolder(folder.id, newSubfolderName);
      setNewSubfolderName('');
      setView('menu');
    }
  };

  return (
    <NVPopover onOpenChange={handleOpenChange}>
      <NVPopoverTrigger asChild>
        <NVIconButton 
          icon={MoreVertical}
          variant="ghost" 
          size="xs"
          className={cn("absolute -right-[3px] opacity-0 group-hover:opacity-100 transition-all duration-300", triggerClassName)}
          onClick={(e) => e.stopPropagation()}
        />
      </NVPopoverTrigger>
      
      <NVPopoverContent className="w-[280px] p-0" align="start" alignOffset={-4} side="right" sideOffset={12}>
        {view === 'menu' && (
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
                {/* AI / 추천 섹션 */}
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
                
                {/* 관리 섹션 */}
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
                  </>
                )}

                <NVMenuItem 
                  icon={Pencil}
                  label="이름 바꾸기"
                  onClick={() => onRename?.(folder)}
                />
                {!folder.isSmartFolder && (
                  <NVMenuItem 
                    icon={Copy}
                    label="복제하기"
                    onClick={() => onDuplicate?.(folder)}
                  />
                )}
                <NVMenuItem 
                  icon={Trash2}
                  label={folder.isSmartFolder ? "스마트 폴더 삭제" : "삭제하기"}
                  variant="danger"
                  onClick={() => onDelete?.(folder)}
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
                      <button className="p-1 text-slate-600 hover:text-slate-200 transition-colors" onClick={(e) => {
                        e.stopPropagation();
                        onRename?.(child);
                      }}>
                        <Pencil size={11} />
                      </button>
                      <button className="p-1 text-slate-600 hover:text-rose-400 transition-colors" onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(child);
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

        {view === 'create' && (
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
              <span className="text-xs font-bold text-white">하위 폴더 생성</span>
            </NVPopoverHeader>
            <NVPopoverBody className="px-4 py-4">
              <div className="flex flex-col gap-4">
                <NVInput 
                  size="sm"
                  placeholder="하위 폴더 이름 입력..." 
                  className="bg-white/5 border-white/10"
                  value={newSubfolderName}
                  onChange={(e) => setNewSubfolderName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateSubmit()}
                />
                <div className="flex justify-end gap-2">
                  <NVButton size="xs" variant="ghost" className="h-9 px-4 rounded-lg" onClick={(e) => {
                    e.stopPropagation();
                    setView('menu');
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
