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
    
    // Check yesterday
    const y = new Date();
    y.setDate(y.getDate() - 1);
    if (dStr === formatDate(y)) return 'Yesterday';

    // Check tomorrow
    const t = new Date();
    t.setDate(t.getDate() + 1);
    if (dStr === formatDate(t)) return 'Tomorrow';

    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 pt-3 pb-3 safe-top">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* App Branding & Sync Status */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
              <span className="text-base font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">F</span>
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              FitDaily
              <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                Sheets Sync
              </span>
            </h1>
            <button
              onClick={onSync}
              className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              {syncStatus === 'syncing' ? (
                <>
                  <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span className="text-cyan-400 font-medium">Syncing...</span>
                </>
              ) : syncStatus === 'synced' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Synced {lastSyncTime ? `• ${lastSyncTime}` : ''}</span>
                </>
              ) : syncStatus === 'offline' ? (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 font-medium">Offline (Cached)</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                  <span>Tap to sync</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Controls: Install button + Settings */}
        <div className="flex items-center space-x-1.5">
          {!isStandalone && (
            <button
              onClick={onOpenInstall}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-all active:scale-95"
              title="Install app to phone"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition-colors active:scale-95 border border-slate-700/50"
            title="Sheet Settings & URL"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Date Navigator Bar */}
      <div className="max-w-md mx-auto mt-2.5 pt-2 border-t border-slate-800/50 flex items-center justify-between">
        <button
          onClick={handlePrevDay}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors active:scale-95"
          title="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <label className="relative cursor-pointer flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700/60 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-white">
              {formatDisplayDate(selectedDate)}
            </span>
            <span className="text-[11px] text-slate-400">
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
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-2 py-1 rounded-full transition-colors active:scale-95"
            >
              Go to Today
            </button>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors active:scale-95"
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
