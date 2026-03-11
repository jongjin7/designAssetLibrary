'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { CameraOff, Image as ImageIcon } from 'lucide-react';

export interface CaptureViewfinderRef {
  takePhoto: () => { dataUrl: string; fileName?: string; fileSize?: string } | null;
  toggleCamera: () => void;
  openGallery: () => void;
  clearPreview: () => void;
}

interface CaptureViewfinderProps {
  onPreviewChange?: (hasPreview: boolean) => void;
}

export const CaptureViewfinder = forwardRef<CaptureViewfinderRef, CaptureViewfinderProps>(
  ({ onPreviewChange }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const activeStreamRef = useRef<MediaStream | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [error, setError] = useState<'PERMISSION' | 'INSECURE' | 'NOT_FOUND' | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [selectedFileInfo, setSelectedFileInfo] = useState<{ name: string; size: string } | null>(null);

    const isRequestingRef = useRef(false);

    const startCamera = async (mode: 'user' | 'environment') => {
      if (isRequestingRef.current) {
        console.log('[Camera] Request already in progress, skipping...');
        return;
      }

      // 1. 보안 컨텍스트 체크
      if (!window.isSecureContext && window.location.hostname !== 'localhost') {
        setError('INSECURE');
        return;
      }

      // 기존 스트림이 있다면 중지
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(track => track.stop());
        activeStreamRef.current = null;
      }

      isRequestingRef.current = true;
      try {
        const constraints = {
          video: { 
            facingMode: { ideal: mode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        };
        
        console.log('[Camera] Requesting access with mode:', mode);
        const newStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStreamRef.current = newStream;
        setStream(newStream || null);
        
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setError(null);
      } catch (err: any) {
        console.error('카메라 시작 오류:', err);
        setError(err.name === 'NotAllowedError' ? 'PERMISSION' : 'NOT_FOUND');
      } finally {
        isRequestingRef.current = false;
      }
    };

    useEffect(() => {
      onPreviewChange?.(!!previewImage);
    }, [previewImage, onPreviewChange]);

    useEffect(() => {
      startCamera(facingMode);
      return () => {
        if (activeStreamRef.current) {
          activeStreamRef.current.getTracks().forEach(track => track.stop());
          activeStreamRef.current = null;
        }
      };
    }, [facingMode]);

    useImperativeHandle(ref, () => ({
      takePhoto: () => {
        // 갤러리 선택 모드인 경우 현재 미리보기 이미지와 원본 정보 반환
        if (previewImage) {
          return { 
            dataUrl: previewImage, 
            fileName: selectedFileInfo?.name, 
            fileSize: selectedFileInfo?.size 
          };
        }

        if (!videoRef.current || !canvasRef.current) return null;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        
        // 데이터 URL 기반 용량 계산 (근사치)
        const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
        const fileSize = formatBytes(sizeInBytes);

        return { dataUrl, fileSize };
      },
      toggleCamera: () => {
        if (error && error !== 'NOT_FOUND') return;
        setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
      },
      openGallery: () => {
        fileInputRef.current?.click();
      },
      clearPreview: () => {
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (!activeStreamRef.current) startCamera(facingMode);
      }
    }));

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFileInfo({
          name: file.name,
          size: formatBytes(file.size)
        });
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const formatBytes = (bytes: number, decimals = 1) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
      <div className="capture-viewfinder">
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          hidden 
          onChange={handleFileSelect} 
        />

        {error && !previewImage ? (
          <div className="capture-viewfinder__fallback">
            <div className="fallback-content">
              <div className="fallback-icon">
                {error === 'INSECURE' ? <CameraOff size={48} /> : <ImageIcon size={48} />}
              </div>
              <h3>{error === 'INSECURE' ? '보안 연결 필요' : '카메라를 사용할 수 없음'}</h3>
              <p>
                {error === 'INSECURE' 
                  ? '실제 기기에서 카메라를 사용하려면 HTTPS 연결이 필요합니다. 로컬 서버 대신 터널링 도구(ngrok 등)를 사용하거나 아래 버튼으로 파일을 선택하세요.'
                  : '카메라 권한이 거부되었거나 지원되지 않는 기기입니다. 갤러리에서 사진을 선택하여 테스트를 계속할 수 있습니다.'}
              </p>
              
              <button 
                className="fallback-action-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={18} />
                <span>갤러리에서 사진 선택</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="capture-viewfinder__video"
            />
            {previewImage && (
              <div className="capture-viewfinder__file-preview">
                <img src={previewImage} alt="Selected file" />
                <button className="clear-selection" onClick={() => setPreviewImage(null)}>다시 선택</button>
              </div>
            )}
          </>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <div className="capture-viewfinder__frame">
          <div className="capture-viewfinder__crosshair" />
          <div className="capture-viewfinder__corner capture-viewfinder__corner--tl" />
          <div className="capture-viewfinder__corner capture-viewfinder__corner--tr" />
          <div className="capture-viewfinder__corner capture-viewfinder__corner--bl" />
          <div className="capture-viewfinder__corner capture-viewfinder__corner--br" />
        </div>
        <div className="capture-viewfinder__shimmer" />
      </div>
    );
  }
);

CaptureViewfinder.displayName = 'CaptureViewfinder';
