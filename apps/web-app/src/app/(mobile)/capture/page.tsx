'use client';

import { useState, useRef, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CaptureViewfinder, CaptureViewfinderRef } from '../../../components/capture/CaptureViewfinder';
import { CaptureControls } from '../../../components/capture/CaptureControls';
import { useAssets } from '../../../hooks/useAssets';
import { extractColors } from '../../../lib/colorExtractor';

export default function CapturePage() {
  const router = useRouter();
  const { addAsset } = useAssets();
  const viewfinderRef = useRef<CaptureViewfinderRef>(null);
  const [toast, setToast] = useState(false);
  const [progress, setProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isFileMode, setIsFileMode] = useState(false);
  const isCapturing = useRef(false);

  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
    };
  }, []);

  const handleShutter = async () => {
    if (!viewfinderRef.current || isCapturing.current) return;
    
    const result = viewfinderRef.current.takePhoto();
    if (!result) return;
    
    const { dataUrl, fileName, fileSize } = result;
    
    isCapturing.current = true;
    setCapturedImage(dataUrl);
    setProgress(0);

    // AI/Canvas Color Extraction
    let palette = ['#6366F1', '#06B6D4', '#F8FAFC']; // Default
    try {
      palette = await extractColors(dataUrl);
    } catch (err) {
      console.warn('Failed to extract colors during capture:', err);
    }

    // Create asset with REAL metadata and palette
    const newAsset = {
      id: Date.now().toString(),
      fileName: fileName || `capture-${Date.now()}.webp`,
      fileSize: fileSize || '0 KB',
      mimeType: 'image/webp',
      thumbnailGradient: 'linear-gradient(135deg, #6366F1 0%, #06B6D4 100%)',
      thumbnail: dataUrl,
      palette: palette,
      tags: ['captured', 'new'],
      createdAt: new Date().toISOString().split('T')[0],
      isFavorite: false,
    };
    
    let currentProgress = 0;
    captureIntervalRef.current = setInterval(() => {
      currentProgress += 10;
      
      if (currentProgress >= 100) {
        if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
        setProgress(100);
        
        // Wait for persistence to complete
        addAsset(newAsset).then(() => {
          setToast(true);
          
          setTimeout(() => {
            setToast(false);
            setCapturedImage(null);
            viewfinderRef.current?.clearPreview();
            setProgress(0);
            isCapturing.current = false;
            // router.push('/library'); // Removed: Stay on page for multiple shots
          }, 1500);
        });
      } else {
        setProgress(currentProgress);
      }
    }, 100);
  };

  const handleToggleCamera = () => {
    viewfinderRef.current?.toggleCamera();
  };

  const handleGallery = () => {
    viewfinderRef.current?.openGallery();
  };

  return (
    <div className="capture-screen">
      {progress > 0 && progress < 100 && (
        <div className="upload-progress">
          <div className="upload-progress__bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Viewfinder is the main content */}
      <CaptureViewfinder ref={viewfinderRef} onPreviewChange={setIsFileMode} />
      
      {/* Captured Image Preview overlay during processing */}
      {capturedImage && (
        <div className="capture-preview">
          <img src={capturedImage} alt="Captured" className="capture-preview__image" />
          <div className="capture-preview__overlay" />
        </div>
      )}

      {/* Controls below viewfinder */}
      <CaptureControls 
        onShutter={handleShutter} 
        onGallery={handleGallery}
        onToggleCamera={handleToggleCamera} 
        mode={isFileMode ? 'file' : 'camera'}
      />

      {/* Floating Close button - Moved to bottom for highest z-index priority */}
      <button 
        className="capture-screen__close" 
        onClick={() => router.push('/library')} 
        aria-label="닫기"
        title="라이브러리로 돌아가기"
      >
        <X size={24} />
      </button>

      {toast && (
        <div className="upload-toast">
          <CheckCircle size={16} />
          <span>에셋이 라이브러리에 추가되었습니다</span>
        </div>
      )}
    </div>
  );
}
