import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClear: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClear }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClear();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
      <div className="bg-[#2C2324] text-white font-button-s text-xs px-4 py-2 rounded-full shadow-xl border border-white/10 flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
        <CheckCircle2 className="w-4 h-4 text-[#EB5E28] shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
};
