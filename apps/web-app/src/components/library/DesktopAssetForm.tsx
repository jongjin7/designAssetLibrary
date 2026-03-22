'use client';

import React, { useState, useRef } from 'react';
import { Plus, X, Upload, Image as ImageIcon, Tag, Check } from 'lucide-react';
import { 
  NVIconButton, 
  NVButton, 
  NVInput, 
  NVChip,
  NVField 
} from '@nova/ui';
import { cn } from '../../lib/utils';

interface DesktopAssetFormProps {
  onAdd: (data: any, file?: File) => Promise<void>;
  onClose: () => void;
}

export function DesktopAssetForm({ onAdd, onClose }: DesktopAssetFormProps) {
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

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!file && !title) return;
    setIsSubmitting(true);
    try {
      await onAdd({
        fileName: title || (file ? file.name : '무제 에셋'),
        tags: tags,
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
    <div className="p-5 overflow-hidden outline-none">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Plus size={16} className="text-indigo-400" />
          새 에셋 등록
        </h3>
        <NVIconButton 
          icon={X} 
          variant="ghost" 
          size="sm" 
          className="text-slate-500 hover:text-white" 
          onClick={onClose} 
        />
      </div>

      <div className="space-y-6">
        {/* File Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative group overflow-hidden bg-white/[0.02] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.04]",
            preview ? "aspect-video" : "h-32"
          )}
        >
          {preview ? (
            <>
              <img src={preview} alt="미리보기" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                <p className="text-xs font-medium text-white shadow-sm flex items-center gap-1.5">
                  <Upload size={14} /> 이미지 변경
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 mb-2 group-hover:scale-110 transition-transform">
                <Upload size={20} strokeWidth={1.5} />
              </div>
              <p className="text-xs font-medium text-slate-400">이미지 선택 또는 드래그</p>
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

        <NVField label="에셋 이름">
          <NVInput 
            icon={<ImageIcon size={14} />}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="캡처한 이미지 이름 입력..."
          />
        </NVField>

        <NVField label="태그 추가" size="md">
          <NVInput 
            icon={<Tag size={14} />}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="태그 입력 후 Enter..."
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map(tag => (
                <div key={tag} className="flex items-center gap-1 px-2.5 py-1 bg-white/[0.03] border border-white/5 rounded-lg group hover:border-white/10 transition-all">
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-300">#{tag}</span>
                  <button onClick={() => removeTag(tag)} className="text-slate-600 hover:text-rose-400 transition-colors">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </NVField>
      </div>

      <div className="mt-8 flex gap-2">
        <NVButton 
          variant="secondary" 
          onClick={onClose}
        >
          취소
        </NVButton>
        <NVButton 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!file || isSubmitting}
        >
          {isSubmitting ? (
             <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check size={16} /> 등록 완료
            </>
          )}
        </NVButton>
      </div>
    </div>
  );
}
