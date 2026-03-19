'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { NVToastItem, Toast, ToastType } from './NVToastItem';

interface ToastOptions {
  type?: ToastType;
  size?: 'sm' | 'md' | 'lg';
  duration?: number;
}

interface ToastContextType {
  toast: (message: string, options?: ToastOptions) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function NVToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, options?: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      message,
      type: options?.type || 'info',
      size: options?.size || 'md',
      duration: options?.duration || 3000,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(() => ({ toast, removeToast }), [toast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none"
          role="region"
          aria-label="Notifications"
        >
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <NVToastItem toast={t} onClose={removeToast} />
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
