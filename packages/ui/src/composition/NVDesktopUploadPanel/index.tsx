'use client';

import React, { useState, useRef } from 'react';
import { Plus, X, Upload, Image as ImageIcon, Tag, Check } from 'lucide-react';
import { NVIconButton } from '../../atoms/NVIconButton';
import { NVButton } from '../../atoms/NVButton';
import { NVInput } from '../../atoms/NVInput';
import { NVChip } from '../../atoms/NVChip';
import { NVField } from '../../atoms/NVField';
import { 
  NVDialogHeader,
  NVDialogBody,
  NVDialogFooter,
  NVDialogTitle,
  NVDialogDescription 
} from '../../atoms/NVDialog';
import { cn } from '../../lib/utils';

interface NVDesktopUploadPanelProps {
  onAdd: (data: any, file?: File) => Promise<void>;
  onClose: () => void;
}

export function NVDesktopUploadPanel({ onAdd, onClose }: NVDesktopUploadPanelProps) {
  const [title, setTitle] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreview(url);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing) return;
      if (tagInput.trim()) {
        if (!tags.includes(tagInput.trim())) {
          setTags([...tags, tagInput.trim()]);
        }
        setTagInput('');
      }
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!file && !title) return;
    let currentTags = [...tags];
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      currentTags.push(tagInput.trim());
    }

    // Strip extension from both user title or default file name
    const rawName = title || (file ? file.name : '무제 에셋');
    const fileName = rawName.includes('.') ? rawName.split('.').slice(0, -1).join('.') : rawName;

    try {
      await onAdd({
        fileName: fileName,
        tags: currentTags,
        createdAt: new Date().toISOString(),
      }, file || undefined);
      onClose();
    } catch (err) {
      console.error('Failed to add asset:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NVDialogHeader>
        <NVDialogTitle className="flex items-center gap-2">
          <Plus size={20} className="text-indigo-400" />
          새 에셋 등록
        </NVDialogTitle>
        <NVDialogDescription>
          라이브러리에 로드할 에셋의 정보를 입력해 주세요.
        </NVDialogDescription>
      </NVDialogHeader>

      <NVDialogBody className="space-y-6">
        {/* File Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative group overflow-hidden bg-white/[0.03] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all cursor-pointer hover:border-indigo-500/50 hover:bg-indigo-500/5",
            preview ? "aspect-video" : "h-40"
          )}
        >
          {preview ? (
            <>
              <img src={preview} alt="미리보기" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                <p className="text-sm font-bold text-white shadow-sm flex items-center gap-2">
                  <Upload size={18} /> 이미지 변경
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all duration-300">
                <Upload size={28} strokeWidth={1.5} />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-slate-300 group-hover:text-indigo-300 transition-colors">에셋 업로드</p>
                <p className="text-xs text-slate-500 font-medium tracking-tight">이미지를 선택하거나 이곳으로 드래그 하세요.</p>
              </div>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        <div className="grid grid-cols-1 gap-5 pt-2">
          <NVField label="에셋 이름" size="sm">
            <NVInput 
              icon={<ImageIcon size={14} />}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="캡처한 이미지 이름 입력..."
              size="md"
            />
          </NVField>

          <NVField label="태그 추가" size="sm">
            <NVInput 
              icon={<Tag size={14} />}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="태그 입력 후 Enter..."
              size="md"
            />
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {tags.map(tag => (
                  <div key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] border border-white/5 rounded-full group hover:border-indigo-500/30 transition-all">
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-400 tracking-tight">#{tag}</span>
                    <button onClick={(e: React.MouseEvent) => { e.stopPropagation(); removeTag(tag); }} className="text-slate-600 hover:text-rose-400 transition-colors bg-white/5 rounded-full p-0.5">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </NVField>
        </div>
      </NVDialogBody>

      <NVDialogFooter>
        <NVButton 
          variant="ghost" 
          onClick={onClose}
          className="mr-auto text-slate-500 hover:text-slate-300"
        >
          취소
        </NVButton>
        <NVButton 
          variant="secondary" 
          onClick={onClose}
          className="min-w-[80px]"
        >
          나중에 하기
        </NVButton>
        <NVButton 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!file || isSubmitting}
          className="min-w-[100px]"
        >
          {isSubmitting ? (
             <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check size={16} /> 등록 완료
            </>
          )}
        </NVButton>
      </NVDialogFooter>
    </>
  );
}
