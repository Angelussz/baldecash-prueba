'use client';

import { useEffect, useRef } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onClose?: () => void;
  duration?: number;
}

export function Toast({ message, type = 'success', visible, onClose, duration = 3500 }: ToastProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible && duration > 0) {
      timerRef.current = setTimeout(() => {
        onClose?.();
      }, duration);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible, duration, onClose]);

  const iconMap = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  const colorMap = {
    success: 'text-brand-green',
    error: 'text-error',
    info: 'text-brand-blue',
  };

  return (
    <div
      className={`flex items-center gap-2 p-3 bg-inverse-surface text-inverse-on-surface rounded-xl shadow-lg transition-all duration-300 transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'
      }`}
    >
      <span className={`material-symbols-outlined text-[20px] ${colorMap[type]}`}>
        {iconMap[type]}
      </span>
      <span className="text-sm">{message}</span>
    </div>
  );
}
