import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface ToastState {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  durationMs?: number;
}

interface ToastProps {
  toast: ToastState | string | null;
  onClear: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClear }) => {
  const message = typeof toast === 'string' ? toast : toast?.message;
  const actionLabel = typeof toast === 'object' ? toast?.actionLabel : undefined;
  const onAction = typeof toast === 'object' ? toast?.onAction : undefined;
  const duration = typeof toast === 'object' && toast?.durationMs ? toast.durationMs : actionLabel ? 5000 : 2800;

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClear();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClear]);

  if (!message) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-sm pointer-events-auto transition-all duration-300">
      <div className="bg-[#16232B] text-[#FFFFF0] font-body-m text-xs px-4 py-3 rounded-2xl shadow-2xl border border-[#E8E3D5]/20 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3">
        <div className="flex items-center space-x-2.5 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-[#FF5B04] shrink-0" />
          <span className="truncate font-semibold">{message}</span>
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={() => {
              onAction();
              onClear();
            }}
            className="px-2.5 py-1 rounded-lg bg-[#FF5B04] hover:bg-[#E04B00] text-white font-button-s text-xs font-bold uppercase tracking-wider shrink-0 transition-colors shadow-xs"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
