'use client';

import { useState } from 'react';
import { ImageIcon, RefreshCw, Zap, Timer, Upload } from 'lucide-react';

interface CaptureControlsProps {
  onShutter: () => void;
  onGallery: () => void;
  onToggleCamera: () => void;
  mode?: 'camera' | 'file';
}

export function CaptureControls({ onShutter, onGallery, onToggleCamera, mode = 'camera' }: CaptureControlsProps) {
  const [flash, setFlash] = useState(false);

  return (
    <div className="capture-controls">
      <div className="capture-controls__main">
        <button 
          className="capture-controls__side-btn" 
          onClick={onGallery}
          aria-label="갤러리 선택"
        >
          <ImageIcon size={22} />
        </button>

        <button className="capture-controls__shutter" onClick={onShutter} aria-label={mode === 'file' ? '업로드' : '촬영'}>
          {mode === 'file' ? (
            <Upload size={32} color="white" />
          ) : (
            <span className="capture-controls__shutter-ring" />
          )}
        </button>

        <button className="capture-controls__side-btn" onClick={onToggleCamera} aria-label="카메라 전환">
          <RefreshCw size={22} />
        </button>
      </div>

      <div className="capture-controls__options">
        <button
          className={`capture-controls__option ${flash ? 'capture-controls__option--on' : ''}`}
          onClick={() => setFlash(!flash)}
        >
          <Zap size={14} />
          <span>플래시 {flash ? 'ON' : 'OFF'}</span>
        </button>
        <button className="capture-controls__option">
          <Timer size={14} />
          <span>타이머 OFF</span>
        </button>
      </div>
    </div>
  );
}
