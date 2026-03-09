'use client';

import { useState, useRef } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CaptureViewfinder, CaptureViewfinderRef } from '../../../components/capture/CaptureViewfinder';
import { CaptureControls } from '../../../components/capture/CaptureControls';

export default function CapturePage() {
  const router = useRouter();
  const viewfinderRef = useRef<CaptureViewfinderRef>(null);
  const [toast, setToast] = useState(false);
  const [progress, setProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const handleShutter = () => {
    if (!viewfinderRef.current) return;
    
    const photo = viewfinderRef.current.takePhoto();
    if (!photo) return;
    
    setCapturedImage(photo);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setToast(true);
          setTimeout(() => {
            setToast(false);
            setCapturedImage(null);
          }, 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleToggleCamera = () => {
    viewfinderRef.current?.toggleCamera();
  };

  return (
    <div className="capture-screen">
      {progress > 0 && progress < 100 && (
        <div className="upload-progress">
          <div className="upload-progress__bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      <button className="capture-screen__close" onClick={() => router.push('/library')} aria-label="닫기">
        <X size={24} />
      </button>

      <CaptureViewfinder ref={viewfinderRef} />
      
      {capturedImage && (
        <div className="capture-preview">
          <img src={capturedImage} alt="Captured" className="capture-preview__image" />
          <div className="capture-preview__overlay" />
        </div>
      )}

      <CaptureControls onShutter={handleShutter} onToggleCamera={handleToggleCamera} />

      {toast && (
        <div className="upload-toast">
          <CheckCircle size={16} />
          <span>에셋이 라이브러리에 추가되었습니다</span>
        </div>
      )}
    </div>
  );
}
