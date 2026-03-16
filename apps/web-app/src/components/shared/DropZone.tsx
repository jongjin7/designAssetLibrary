import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onDrop: (files: FileList) => void;
}

export function DropZone({ onDrop }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      // Only hide if we actually left the window
      if (e.clientX === 0 && e.clientY === 0) {
        setIsDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files) {
        onDrop(e.dataTransfer.files);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, [onDrop]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-indigo-500/10 backdrop-blur-md flex items-center justify-center p-10 pointer-events-none">
      <div className="w-full max-w-[600px] h-[400px] border-4 border-dashed border-indigo-500 rounded-[32px] bg-slate-900/80 flex flex-col items-center justify-center gap-5 text-slate-50 shadow-[0_0_50px_rgba(99,102,241,0.3)] animate-in zoom-in-95 duration-300">
        <div className="w-24 h-24 rounded-full bg-indigo-500/15 flex items-center justify-center text-indigo-500 border border-indigo-500/30">
          <Upload size={48} />
        </div>
        <h3 className="text-2xl font-extrabold tracking-tight">여기에 파일을 드롭하여 업로드</h3>
        <p className="text-slate-400 font-medium">PNG, JPG, SVG, WebP 파일을 지원합니다.</p>
      </div>
    </div>
  );
}

