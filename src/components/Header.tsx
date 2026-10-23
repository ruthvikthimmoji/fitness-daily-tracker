import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Settings as SettingsIcon, RefreshCw, Flame } from 'lucide-react';
import { GamificationState, TabType } from '../types';
import { toLocalIso, triggerHaptic } from '../utils/formatters';

interface HeaderProps {
  currentTab: TabType;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error' | 'offline';
  onSync: () => void;
  onOpenSettings: () => void;
  lastSyncTime: string | null;
  gamification?: GamificationState;
  onOpenBadgesModal?: () => void;
  loggedDates?: Set<string>;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  selectedDate,
  onSelectDate,
  syncStatus,
  onSync,
  onOpenSettings,
  lastSyncTime,
  gamification,
  onOpenBadgesModal,
  loggedDates = new Set()
}) => {
  const todayStr = toLocalIso();
  const isToday = selectedDate === todayStr;

  // Format short sync label
  const renderSyncLabel = () => {
    switch (syncStatus) {
      case 'syncing':
        return (
          <span className="inline-flex items-center gap-1.5 text-[#C4501F]">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>Syncing</span>
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 text-[#8A5A00]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A5A00]" />
            <span>Offline</span>
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 text-[#B3261E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B3261E]" />
            <span>Retry</span>
          </span>
        );
      case 'synced':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[#2F6B2A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B2A]" />
            <span>{lastSyncTime ? `Synced ${lastSyncTime}` : 'Synced'}</span>
          </span>
        );
    }
  };

  // Generate current 7-day week strip for Today view
  const renderWeekStrip = () => {
    const sel = new Date(`${selectedDate}T12:00:00`);
    const dayOfWeek = sel.getDay(); // 0 is Sun, 1 is Mon...
    // Start week on Monday
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mon = new Date(sel);
    mon.setDate(sel.getDate() + diffToMon);

    const weekDays: { dateStr: string; dayLetter: string; dayNum: number; isSelected: boolean; isCurrentDay: boolean; hasLog: boolean }[] = [];
    const letters = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(mon);
      d.setDate(mon.getDate() + i);
      const dStr = toLocalIso(d);
      weekDays.push({
        dateStr: dStr,
        dayLetter: letters[i],
        dayNum: d.getDate(),
        isSelected: dStr === selectedDate,
        isCurrentDay: dStr === todayStr,
        hasLog: loggedDates.has(dStr)
      });
    }

    return (
      <div className="max-w-md mx-auto mt-2 px-1 flex items-center justify-between gap-1 select-none">
        {weekDays.map((w) => (
          <button
            key={w.dateStr}
            type="button"
            onClick={() => {
              triggerHaptic(10);
              onSelectDate(w.dateStr);
            }}
            className={`flex-1 py-1.5 rounded-xl flex flex-col items-center justify-center transition-all min-h-[44px] ${
              w.isSelected
                ? 'bg-[#2B2324] text-white shadow-xs'
                : w.isCurrentDay
                ? 'bg-[#E2DACB]/60 text-[#2B2324]'
                : 'hover:bg-[#EEE9DD] text-[#5E5444]'
            }`}
          >
            <span className={`text-[10px] font-label leading-none ${w.isSelected ? 'text-[#F5F2EA]/70' : 'text-[#5E5444]'}`}>
              {w.dayLetter}
            </span>
            <span className={`text-xs font-number font-bold mt-0.5 leading-none ${w.isSelected ? 'text-white' : 'text-[#2B2324]'}`}>
              {w.dayNum}
            </span>
            <span
              className={`w-1 h-1 rounded-full mt-1 ${
                w.hasLog
                  ? w.isSelected ? 'bg-[#E8743F]' : 'bg-[#C4501F]'
                  : 'bg-transparent'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const handlePrevDay = () => {
    triggerHaptic(10);
    const d = new Date(`${selectedDate}T12:00:00`);
    d.setDate(d.getDate() - 1);
    onSelectDate(toLocalIso(d));
  };

  const handleNextDay = () => {
    triggerHaptic(10);
    const d = new Date(`${selectedDate}T12:00:00`);
    d.setDate(d.getDate() + 1);
    onSelectDate(toLocalIso(d));
  };

  const friendlyDate = new Date(`${selectedDate}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <header className="sticky top-0 z-40 bg-[#F5F2EA]/95 backdrop-blur-md border-b border-[#E2DACB] px-4 pt-2.5 pb-2 safe-top shadow-xs">
      {/* 56px App Bar (L1) */}
      <div className="max-w-md mx-auto flex items-center justify-between h-[44px]">
        
        {/* Wordmark & Brand mark */}
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#2B2324] text-white flex items-center justify-center font-display font-bold text-xs tracking-tight shadow-xs">
            <span>D</span>
            <span className="text-[#C4501F]">F</span>
          </div>

          <div className="flex items-baseline space-x-1.5">
            <span className="font-h3 text-sm tracking-tight text-[#2B2324]">DAILY</span>
            <span className="font-h3 text-sm tracking-tight text-[#C4501F]">/ FIT</span>
          </div>
        </div>

        {/* Action Controls & Status */}
        <div className="flex items-center space-x-1.5">
          {/* Real Sync Status Chip (I2) */}
          <button
            type="button"
            onClick={onSync}
            className="px-2 py-1 rounded-lg bg-[#EEE9DD] hover:bg-[#E2DACB] text-[11px] font-caption font-semibold transition-colors flex items-center shadow-2xs"
            title="Tap to sync with Google Sheet"
          >
            {renderSyncLabel()}
          </button>

          {/* Streak Chip (V7 flame in ember, tap opens Badges modal) */}
          {gamification && onOpenBadgesModal && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                onOpenBadgesModal();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#EEE9DD] hover:bg-[#E2DACB] text-[#C4501F] text-xs font-number font-bold transition-all active:scale-95 shadow-2xs"
              title={`Streak: ${gamification.streak} days. Tap to view achievements.`}
            >
              <Flame className="w-3.5 h-3.5 text-[#C4501F] fill-[#C4501F]" />
              <span className="text-[#2B2324]">{gamification.streak}</span>
            </button>
          )}

          {/* Settings Button (V8) */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              onOpenSettings();
            }}
            className="p-1.5 text-[#5E5444] hover:text-[#2B2324] hover:bg-[#EEE9DD] rounded-lg transition-colors active:scale-95"
            title="Settings & Google Sheet"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Navigation Strip */}
      {currentTab === 'today' && renderWeekStrip()}

      {(currentTab === 'workout' || currentTab === 'food' || currentTab === 'work') && (
        <div className="max-w-md mx-auto mt-1.5 pt-1.5 border-t border-[#E2DACB]/60 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-1 text-[#5E5444] hover:text-[#2B2324] rounded-lg hover:bg-[#EEE9DD] transition-colors"
            title="Previous day"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <label className="relative cursor-pointer flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#EEE9DD] hover:bg-[#E2DACB] font-title text-xs text-[#2B2324] transition-colors">
            <Calendar className="w-3.5 h-3.5 text-[#C4501F]" />
            <span>{isToday ? 'Today · ' : ''}{friendlyDate}</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && onSelectDate(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
          </label>

          <div className="flex items-center space-x-1">
            {!isToday && (
              <button
                type="button"
                onClick={() => onSelectDate(todayStr)}
                className="font-button-s text-[10px] text-[#C4501F] hover:text-[#2B2324] px-1.5 py-0.5 rounded bg-white border border-[#E2DACB]"
              >
                TODAY
              </button>
            )}
            <button
              type="button"
              onClick={handleNextDay}
              className="p-1 text-[#5E5444] hover:text-[#2B2324] rounded-lg hover:bg-[#EEE9DD] transition-colors"
              title="Next day"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* On Progress / Stats: Date UI is hidden (L1) */}
    </header>
  );
};
