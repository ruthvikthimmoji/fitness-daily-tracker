import React from 'react';
import { X, Share, PlusSquare, MoreVertical, Download } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-[#E8E3D5] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#16232B] p-2 flex items-center justify-center shadow-xs border border-white/10 shrink-0">
              <img src="/logo-white.png" alt="DAILY/FIT" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-caption text-[11px] font-bold text-[#FF5B04] uppercase tracking-wider">
                DAILY/FIT PWA Client
              </div>
              <h2 className="font-h2 text-base text-[#16232B] leading-tight">
                Install to Home Screen
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#526673] hover:text-[#16232B] rounded-xl hover:bg-[#FFFFF0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 pt-3.5">

          {/* App Preview Card with Splash Screen Emblem */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FFFFF0] border border-[#E8E3D5]">
            <div className="w-13 h-13 rounded-2xl bg-[#16232B] p-2.5 flex items-center justify-center shadow-sm border border-white/10 shrink-0">
              <img src="/logo-white.png" alt="DAILY/FIT" className="w-full h-full object-contain filter drop-shadow-xs" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline space-x-1.5">
                <span className="font-display text-lg tracking-widest text-[#16232B]">DAILY</span>
                <span className="font-display text-lg tracking-widest text-[#FF5B04]">/ FIT</span>
              </div>
              <p className="font-caption text-xs text-[#526673] mt-0.5">Show up daily. Progress, not perfection.</p>
            </div>
          </div>
          
          {/* iOS Instructions */}
          <div className="bg-[#FFFFF0] p-3.5 rounded-2xl border border-[#E8E3D5]">
            <div className="flex items-center space-x-2 font-caption font-bold text-xs text-[#16232B] mb-2">
              <span className="text-sm">🍎</span>
              <span>iPhone & iPad (Safari)</span>
            </div>
            <ol className="space-y-2 font-caption text-xs text-[#526673]">
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#16232B] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">1</span>
                <span>Open this link in <strong className="text-[#16232B]">Safari</strong> on your iPhone.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#16232B] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">2</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap the <Share className="w-3.5 h-3.5 text-[#FF5B04] inline" /> <strong className="text-[#16232B]">Share</strong> icon at the bottom.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#16232B] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">3</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Scroll and tap <PlusSquare className="w-3.5 h-3.5 text-[#FF5B04] inline" /> <strong className="text-[#16232B]">Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#16232B] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">4</span>
                <span>Tap <strong className="text-[#16232B]">Add</strong>. The DAILY/FIT emblem will be pinned to your home screen!</span>
              </li>
            </ol>
          </div>

          {/* Android Instructions */}
          <div className="bg-[#FFFFF0] p-3.5 rounded-2xl border border-[#E8E3D5]">
            <div className="flex items-center space-x-2 font-caption font-bold text-xs text-[#16232B] mb-2">
              <span className="text-sm">🤖</span>
              <span>Android (Google Chrome)</span>
            </div>
            <ol className="space-y-2 font-caption text-xs text-[#526673]">
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#16232B] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">1</span>
                <span>Open this link in <strong className="text-[#16232B]">Chrome</strong> on your phone.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#16232B] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">2</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap the <MoreVertical className="w-3.5 h-3.5 text-[#FF5B04] inline" /> <strong className="text-[#16232B]">three dots</strong> menu (top right).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#16232B] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">3</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap <Download className="w-3.5 h-3.5 text-[#FF5B04] inline" /> <strong className="text-[#16232B]">Install App</strong> or <strong>Add to Home screen</strong>.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#16232B] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">4</span>
                <span>Confirm and tap <strong className="text-[#16232B]">Install</strong>.</span>
              </li>
            </ol>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#16232B] text-white font-button-l text-sm hover:bg-[#16232B]/90 transition-all shadow-sm"
          >
            Got it!
          </button>
        </div>

      </div>
    </div>
  );
};
