import React from 'react';
import { X, Smartphone, Share, PlusSquare, MoreVertical, Download } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-800 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Install to Your Phone</h2>
              <div className="text-[11px] text-slate-400">Get a full-screen native app on your home screen</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pt-4">
          
          {/* iOS Instructions */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center space-x-2 text-xs font-bold text-white mb-2">
              <span className="text-base">🍎</span>
              <span>iPhone & iPad (Safari)</span>
            </div>
            <ol className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">1</span>
                <span>Open this link in <strong>Safari</strong> on your iPhone.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">2</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap the <Share className="w-3.5 h-3.5 text-cyan-400 inline" /> <strong>Share</strong> button at the bottom of the screen.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">3</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Scroll down and tap <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> <strong>Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">4</span>
                <span>Tap <strong>Add</strong> in the top right. The app will appear on your home screen!</span>
              </li>
            </ol>
          </div>

          {/* Android Instructions */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center space-x-2 text-xs font-bold text-white mb-2">
              <span className="text-base">🤖</span>
              <span>Android (Chrome)</span>
            </div>
            <ol className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">1</span>
                <span>Open this link in <strong>Google Chrome</strong> on your phone.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">2</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap the <MoreVertical className="w-3.5 h-3.5 text-cyan-400 inline" /> <strong>three dots</strong> menu in the top right.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">3</span>
                <span className="flex items-center gap-1 flex-wrap">
                  Tap <Download className="w-3.5 h-3.5 text-emerald-400 inline" /> <strong>Install App</strong> or <strong>Add to Home screen</strong>.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-4 h-4 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">4</span>
                <span>Confirm and tap <strong>Install</strong>. It launches as a full app!</span>
              </li>
            </ol>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all"
          >
            Got it!
          </button>
        </div>

      </div>
    </div>
  );
};
