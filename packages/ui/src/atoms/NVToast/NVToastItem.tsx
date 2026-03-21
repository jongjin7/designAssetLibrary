'use client';

import React, { useEffect } from 'react';
import { Check, Info, AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'info' | 'error';

export interface Toast {
  id: string;
  message: string;
  type?: ToastType;
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
}

interface NVToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export function NVToastItem({ toast, onClose }: NVToastItemProps) {
  const { id, message, type = 'info', size = 'md', duration = 3000 } = toast;

  useEffect(() => {
    if (duration === Infinity) return;
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const icons = {
    success: <Check size={18} className="text-emerald-400" />,
    info: <Info size={18} className="text-indigo-400" />,
    error: <AlertCircle size={18} className="text-rose-400" />,
  };

  const colors = {
    success: 'border-emerald-500/20 bg-emerald-500/5',
    info: 'border-indigo-500/20 bg-indigo-500/5',
    error: 'border-rose-500/20 bg-rose-500/5',
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-3 rounded-xl border backdrop-blur-2xl shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-300",
        size === 'sm' && "px-3 py-2.5 min-w-[200px] max-w-[280px]",
        size === 'md' && "px-4 py-3.5 min-w-[280px] max-w-[400px]",
        size === 'lg' && "px-5 py-4 w-full md:min-w-[400px] max-w-[600px]",
        colors[type]
      )}
      role="alert"
    >
      <div className="shrink-0">
        {icons[type]}
      </div>
      <p className="text-[13px] font-medium text-slate-200 flex-1 leading-tight">
        {message}
      </p>
      <button 
        onClick={() => onClose(id)}
        className="shrink-0 p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
