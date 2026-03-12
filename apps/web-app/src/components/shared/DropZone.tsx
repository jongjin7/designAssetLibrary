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
    <div className="global-dropzone">
      <div className="global-dropzone__content">
        <div className="global-dropzone__icon">
          <Upload size={48} />
        </div>
        <h3>여기에 평일을 드롭하여 업로드</h3>
        <p>PNG, JPG, SVG, WebP 파일을 지원합니다.</p>
      </div>
    </div>
  );
}
