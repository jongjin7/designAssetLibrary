'use client';

import { useState, useRef, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CaptureViewfinder, CaptureViewfinderRef } from '../../../components/capture/CaptureViewfinder';
import { CaptureControls } from '../../../components/capture/CaptureControls';
import { useAssets } from '../../../hooks/useAssets';
import { processFileToAsset } from '../../../lib/assetProcessor';

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

  const dataURLToBlob = (dataurl: string): Blob | null => {
    try {
      const arr = dataurl.split(',');
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch) return null;
      const mime = mimeMatch[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch (e) {
      return null;
    }
  };

  const handleShutter = async () => {
    if (!viewfinderRef.current || isCapturing.current) return;
    
    const result = viewfinderRef.current.takePhoto();
    if (!result) return;
    
    const { dataUrl, fileName } = result;
    
    isCapturing.current = true;
    setCapturedImage(dataUrl);
    setProgress(0);

    // Process using unified processor
    const blob = dataURLToBlob(dataUrl) || new Blob();
    const processedAsset = await processFileToAsset(blob, ['captured', 'new']);

    const rawFileName = fileName || processedAsset.fileName || '';
    const finalName = rawFileName.includes('.') 
      ? rawFileName.split('.').slice(0, -1).join('.') 
      : rawFileName;

    const newAsset = {
      ...processedAsset,
      fileName: finalName,
      id: Date.now().toString(),
    };
    
    let currentProgress = 0;
    captureIntervalRef.current = setInterval(() => {
      currentProgress += 10;
      
      if (currentProgress >= 100) {
        if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
        setProgress(100);
        
        // Wait for persistence to complete
        addAsset(newAsset, blob).then(() => {
          setToast(true);
          
          setTimeout(() => {
            setToast(false);
            setCapturedImage(null);
            viewfinderRef.current?.clearPreview();
            setProgress(0);
            isCapturing.current = false;
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
