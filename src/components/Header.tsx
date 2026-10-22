import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Settings as SettingsIcon, RefreshCw, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';

interface HeaderProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
  onSync: () => void;
  onOpenSettings: () => void;
  onOpenInstall: () => void;
  isStandalone: boolean;
  lastSyncTime: string | null;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onSelectDate,
  syncStatus,
  onSync,
  onOpenSettings,
  onOpenInstall,
  isStandalone,
  lastSyncTime
}) => {
  const todayStr = getTodayString();
  const isToday = selectedDate === todayStr;

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onSelectDate(formatDate(d));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onSelectDate(formatDate(d));
  };

  const formatDisplayDate = (dStr: string) => {
    const d = new Date(dStr);
    if (dStr === todayStr) return 'Today';
    
    const y = new Date();
    y.setDate(y.getDate() - 1);
    if (dStr === formatDate(y)) return 'Yesterday';

    const t = new Date();
    t.setDate(t.getDate() + 1);
    if (dStr === formatDate(t)) return 'Tomorrow';

    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#BFBFBF] px-4 pt-3 pb-3 safe-top shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Brand Wordmark & Logo */}
        <div className="flex items-center space-x-2.5">
          {/* Brand Icon: Progress ring in Deep Teal with tick in Ocean Blue */}
          <div className="w-9 h-9 rounded-xl bg-[#EAF2F5] border border-[#BFBFBF] flex items-center justify-center p-1.5 shrink-0">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <circle cx="20" cy="20" r="14" fill="none" stroke="#BFBFBF" strokeWidth="2.5" />
              <circle cx="20" cy="20" r="14" fill="none" stroke="#1F4E5F" strokeWidth="3" strokeDasharray="65 88" strokeLinecap="round" transform="rotate(-90 20 20)" />
              <path d="M 14 20 L 18 24 L 26 15" fill="none" stroke="#2E75B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div>
            {/* Wordmark: DAILY in Deep Teal bold + FIT in Ocean Blue bold */}
            <h1 className="text-base font-bold tracking-tight flex items-baseline gap-1 leading-none">
              <span className="text-[#1F4E5F] font-black">DAILY</span>
              <span className="text-[#2E75B6] font-black">/FIT</span>
              <span className="text-[10px] font-normal italic text-[#595959] ml-1 hidden xs:inline">
                Show up daily.
              </span>
            </h1>

            {/* Sync status pill using exact Brand Status colours */}
            <button
              onClick={onSync}
              className="mt-1 flex items-center space-x-1.5 text-[11px] transition-colors"
            >
              {syncStatus === 'syncing' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFEB9C] text-[#7F6000] font-semibold border border-[#FFEB9C]">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  <span>Syncing...</span>
                </span>
              ) : syncStatus === 'synced' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C6EFCE] text-[#2E7D32] font-semibold border border-[#C6EFCE]">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Synced {lastSyncTime ? `• ${lastSyncTime}` : ''}</span>
                </span>
              ) : syncStatus === 'offline' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F8CBAD] text-[#C00000] font-semibold border border-[#F8CBAD]">
                  <AlertCircle className="w-2.5 h-2.5" />
                  <span>Offline (Cached)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[#595959] hover:text-[#1F4E5F]">
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Tap to sync</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Action Controls: Install + Settings */}
        <div className="flex items-center space-x-1.5">
          {!isStandalone && (
            <button
              onClick={onOpenInstall}
              className="flex items-center gap-1 text-[11px] font-bold text-[#1F4E5F] bg-[#EAF2F5] hover:bg-[#dbe7ec] border border-[#BFBFBF] px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
              title="Install app to phone"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#2E75B6]" />
              <span>Install</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 text-[#595959] hover:text-[#1F4E5F] bg-[#EAF2F5] hover:bg-[#dbe7ec] rounded-xl transition-colors active:scale-95 border border-[#BFBFBF]"
            title="Settings & Sheet URL"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Date Navigator Bar */}
      <div className="max-w-md mx-auto mt-2.5 pt-2 border-t border-[#BFBFBF]/60 flex items-center justify-between">
        <button
          onClick={handlePrevDay}
          className="p-1.5 text-[#595959] hover:text-[#1F4E5F] hover:bg-[#EAF2F5] rounded-lg transition-colors active:scale-95"
          title="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <label className="relative cursor-pointer flex items-center space-x-1.5 bg-[#EAF2F5] hover:bg-[#dfeaf0] px-3 py-1.5 rounded-lg border border-[#BFBFBF] transition-colors">
            <Calendar className="w-3.5 h-3.5 text-[#2E75B6]" />
            <span className="text-xs font-bold text-[#1F4E5F]">
              {formatDisplayDate(selectedDate)}
            </span>
            <span className="text-[11px] text-[#595959]">
              ({selectedDate})
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onSelectDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
          </label>

          {!isToday && (
            <button
              onClick={() => onSelectDate(todayStr)}
              className="text-[11px] font-bold text-[#2E75B6] hover:text-[#1F4E5F] bg-white border border-[#2E75B6]/30 px-2 py-1 rounded-lg transition-colors active:scale-95"
            >
              Today
            </button>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="p-1.5 text-[#595959] hover:text-[#1F4E5F] hover:bg-[#EAF2F5] rounded-lg transition-colors active:scale-95"
          title="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
