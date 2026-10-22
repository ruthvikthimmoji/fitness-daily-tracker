import React from 'react';
import { X, Smartphone, Share, PlusSquare, MoreVertical, Download } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-[#BFBFBF] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#BFBFBF]/60">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#EAF2F5] text-[#1F4E5F] border border-[#BFBFBF]/60">
              <Smartphone className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1F4E5F]">Install to Your Phone</h2>
              <div className="text-[11px] text-[#595959] italic">Opens fullscreen like a native app</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#595959] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EAF2F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 pt-3.5">
          
          {/* iOS Instructions */}
          <div className="bg-[#EAF2F5] p-3.5 rounded-xl border border-[#BFBFBF]/80">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#1F4E5F] mb-2">
              <span className="text-sm">🍎</span>
              <span>iPhone & iPad (Safari)</span>
            </div>
            <ol className="space-y-1.5 text-xs text-[#1A1A1A]">
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#1F4E5F] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">1</span>
                <span>Open this link in <strong>Safari</strong> on your iPhone.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#1F4E5F] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">2</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap the <Share className="w-3.5 h-3.5 text-[#2E75B6] inline" /> <strong>Share</strong> button at bottom center.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#1F4E5F] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">3</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Scroll and tap <PlusSquare className="w-3.5 h-3.5 text-[#2E7D32] inline" /> <strong>Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#1F4E5F] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">4</span>
                <span>Tap <strong>Add</strong>. The DAILY/FIT icon appears on your home screen!</span>
              </li>
            </ol>
          </div>

          {/* Android Instructions */}
          <div className="bg-[#EAF2F5] p-3.5 rounded-xl border border-[#BFBFBF]/80">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#1F4E5F] mb-2">
              <span className="text-sm">🤖</span>
              <span>Android (Google Chrome)</span>
            </div>
            <ol className="space-y-1.5 text-xs text-[#1A1A1A]">
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#1F4E5F] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">1</span>
                <span>Open this link in <strong>Chrome</strong> on your phone.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#1F4E5F] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">2</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap the <MoreVertical className="w-3.5 h-3.5 text-[#2E75B6] inline" /> <strong>three dots</strong> menu (top right).
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#1F4E5F] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">3</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap <Download className="w-3.5 h-3.5 text-[#2E7D32] inline" /> <strong>Install App</strong> or <strong>Add to Home screen</strong>.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-[#1F4E5F] text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">4</span>
                <span>Confirm and tap <strong>Install</strong>.</span>
              </li>
            </ol>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1F4E5F] hover:bg-[#163a47] text-white font-bold text-xs rounded-lg transition-all"
          >
            Got it!
          </button>
        </div>

      </div>
    </div>
  );
};
