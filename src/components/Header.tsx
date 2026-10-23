import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Settings as SettingsIcon, RefreshCw, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';
import { GamificationState } from '../types';

interface HeaderProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
  onSync: () => void;
  onOpenSettings: () => void;
  onOpenInstall: () => void;
  isStandalone: boolean;
  lastSyncTime: string | null;
  gamification?: GamificationState;
  onOpenBadgesModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onSelectDate,
  syncStatus,
  onSync,
  onOpenSettings,
  onOpenInstall,
  isStandalone,
  lastSyncTime,
  gamification,
  onOpenBadgesModal
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
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#D9D1CA] px-4 pt-3 pb-3 safe-top shadow-xs">
      <div className="max-w-md mx-auto flex items-center justify-between">
        
        {/* Editorial Wordmark & Logo */}
        <div className="flex items-center space-x-2.5">
          {/* Logo badge */}
          <div className="w-8 h-8 rounded-xl bg-[#0B369A] text-white flex items-center justify-center font-display font-black text-xs shadow-xs tracking-tighter">
            DF
          </div>

          <div>
            <h1 className="text-sm font-display font-black tracking-tight flex items-baseline gap-1.5 leading-none">
              <span className="text-[#141414] uppercase">DAILY</span>
              <span className="text-[#0B369A] uppercase">/ FIT</span>
              <span className="font-mono text-[9px] text-[#C34811] font-bold uppercase tracking-widest hidden xs:inline">
                SPECIMEN
              </span>
            </h1>

            {/* Sync status pill */}
            <button
              onClick={onSync}
              className="mt-1 flex items-center space-x-1.5 text-[10px] font-mono transition-colors"
            >
              {syncStatus === 'syncing' ? (
                <span className="inline-flex items-center gap-1 text-[#C34811] font-bold">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  <span>SYNCING...</span>
                </span>
              ) : syncStatus === 'synced' ? (
                <span className="inline-flex items-center gap-1 text-[#2E7D32] font-bold">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>SYNCED {lastSyncTime ? `[${lastSyncTime}]` : ''}</span>
                </span>
              ) : syncStatus === 'offline' ? (
                <span className="inline-flex items-center gap-1 text-[#C34811] font-bold">
                  <AlertCircle className="w-2.5 h-2.5" />
                  <span>OFFLINE CACHED</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[#6E6A63] hover:text-[#0B369A]">
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>TAP TO SYNC</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Action Controls & Gamification Pill Bar */}
        <div className="flex items-center space-x-1.5">
          {gamification && onOpenBadgesModal && (
            <div className="flex items-center space-x-1">
              {/* Active Streak Flame */}
              <button
                onClick={onOpenBadgesModal}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#F3EFEA] hover:bg-[#EAE5DE] border border-[#D9D1CA] text-[#C34811] font-mono font-bold text-xs transition-all active:scale-95 shadow-2xs"
                title={`Active Streak: ${gamification.streak} days`}
              >
                <span className="text-xs leading-none">🔥</span>
                <span className="text-[#141414]">{gamification.streak}</span>
              </button>

              {/* XP Level Pill */}
              <button
                onClick={onOpenBadgesModal}
                className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-[#F3EFEA] hover:bg-[#EAE5DE] border border-[#D9D1CA] text-[#0B369A] font-mono font-bold text-xs transition-all active:scale-95 shadow-2xs"
                title={`Level ${gamification.level}: ${gamification.levelTitle} (${gamification.totalXp} XP)`}
              >
                <span className="text-xs leading-none text-[#C34811]">⚡</span>
                <span className="text-[10px] bg-[#0B369A] text-white px-1.5 py-0.5 rounded font-mono font-bold leading-none">
                  L{gamification.level}
                </span>
              </button>
            </div>
          )}

          {!isStandalone && (
            <button
              onClick={onOpenInstall}
              className="p-2 text-[#6E6A63] hover:text-[#141414] bg-[#F3EFEA] hover:bg-[#EAE5DE] rounded-xl transition-all active:scale-95 border border-[#D9D1CA]"
              title="Install app to phone"
            >
              <Smartphone className="w-4 h-4 text-[#0B369A]" />
            </button>
          )}

          <button
            onClick={onOpenSettings}
            className="p-2 text-[#6E6A63] hover:text-[#141414] bg-[#F3EFEA] hover:bg-[#EAE5DE] rounded-xl transition-colors active:scale-95 border border-[#D9D1CA]"
            title="Settings & Sheet Link"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Date Navigator Bar */}
      <div className="max-w-md mx-auto mt-2.5 pt-2 border-t border-[#D9D1CA]/70 flex items-center justify-between">
        <button
          onClick={handlePrevDay}
          className="p-1.5 text-[#6E6A63] hover:text-[#141414] hover:bg-[#F3EFEA] rounded-lg transition-colors active:scale-95"
          title="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2">
          <label className="relative cursor-pointer flex items-center space-x-1.5 bg-[#F3EFEA] hover:bg-[#EAE5DE] px-3 py-1.5 rounded-xl border border-[#D9D1CA] transition-colors">
            <Calendar className="w-3.5 h-3.5 text-[#0B369A]" />
            <span className="text-xs font-display font-bold text-[#141414]">
              {formatDisplayDate(selectedDate)}
            </span>
            <span className="font-mono text-[10px] text-[#6E6A63]">
              [{selectedDate}]
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
              className="text-[10px] font-mono font-bold text-[#0B369A] hover:text-[#C34811] bg-white border border-[#D9D1CA] px-2 py-1 rounded-lg transition-colors active:scale-95"
            >
              TODAY
            </button>
          )}
        </div>

        <button
          onClick={handleNextDay}
          className="p-1.5 text-[#6E6A63] hover:text-[#141414] hover:bg-[#F3EFEA] rounded-lg transition-colors active:scale-95"
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
