'use client';

import { useState } from 'react';
import { ImageIcon, RefreshCw, Zap, Timer } from 'lucide-react';

interface CaptureControlsProps {
  onShutter: () => void;
  onToggleCamera: () => void;
}

export function CaptureControls({ onShutter, onToggleCamera }: CaptureControlsProps) {
  const [flash, setFlash] = useState(false);

  return (
    <div className="capture-controls">
      <div className="capture-controls__main">
        <button className="capture-controls__side-btn" aria-label="갤러리 선택">
          <ImageIcon size={22} />
        </button>

        <button className="capture-controls__shutter" onClick={onShutter} aria-label="촬영">
          <span className="capture-controls__shutter-ring" />
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
