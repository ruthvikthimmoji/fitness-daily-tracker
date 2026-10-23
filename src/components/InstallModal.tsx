import React from 'react';
import { X, Smartphone, Share, PlusSquare, MoreVertical, Download } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-[#D8D3C8] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D3C8]/70">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#EFECE3] text-[#EB5E28] border border-[#D8D3C8]">
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-label text-[#EB5E28]">
                // SYSTEM // PWA CLIENT
              </div>
              <h2 className="font-h2 text-[#2C2324]">
                Install to Your Phone
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#766754] hover:text-[#2C2324] rounded-lg hover:bg-[#EFECE3] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 pt-3.5">
          
          {/* iOS Instructions */}
          <div className="bg-[#EFECE3] p-3.5 rounded-xl border border-[#D8D3C8]">
            <div className="flex items-center space-x-2 font-label text-[#2C2324] mb-2">
              <span className="text-sm">🍎</span>
              <span>iPhone & iPad (Safari)</span>
            </div>
            <ol className="space-y-1.5 font-body-m text-xs text-[#2C2324]">
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#2C2324] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-stat tabular-nums">1</span>
                <span>Open this link in <strong>Safari</strong> on your iPhone.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#2C2324] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-stat tabular-nums">2</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap the <Share className="w-3.5 h-3.5 text-[#EB5E28] inline" /> <strong>Share</strong> button at bottom center.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#2C2324] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-stat tabular-nums">3</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Scroll and tap <PlusSquare className="w-3.5 h-3.5 text-[#EB5E28] inline" /> <strong>Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#2C2324] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-stat tabular-nums">4</span>
                <span>Tap <strong>Add</strong>. The DAILY/FIT icon appears on your home screen!</span>
              </li>
            </ol>
          </div>

          {/* Android Instructions */}
          <div className="bg-[#EFECE3] p-3.5 rounded-xl border border-[#D8D3C8]">
            <div className="flex items-center space-x-2 font-label text-[#2C2324] mb-2">
              <span className="text-sm">🤖</span>
              <span>Android (Google Chrome)</span>
            </div>
            <ol className="space-y-1.5 font-body-m text-xs text-[#2C2324]">
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#2C2324] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-stat tabular-nums">1</span>
                <span>Open this link in <strong>Chrome</strong> on your phone.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#2C2324] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-stat tabular-nums">2</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap the <MoreVertical className="w-3.5 h-3.5 text-[#EB5E28] inline" /> <strong>three dots</strong> menu (top right).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#2C2324] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-stat tabular-nums">3</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap <Download className="w-3.5 h-3.5 text-[#EB5E28] inline" /> <strong>Install App</strong> or <strong>Add to Home screen</strong>.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#2C2324] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-stat tabular-nums">4</span>
                <span>Confirm and tap <strong>Install</strong>.</span>
              </li>
            </ol>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 btn-gold-black font-button-l rounded-xl transition-all shadow-xs"
          >
            Got it!
          </button>
        </div>

      </div>
    </div>
  );
};
