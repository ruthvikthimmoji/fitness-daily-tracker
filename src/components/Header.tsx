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
          <span className="inline-flex items-center gap-1.5 text-[#FF5B04]">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>Syncing</span>
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 text-[#B25E00]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B25E00]" />
            <span>Offline</span>
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 text-[#D32F2F]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D32F2F]" />
            <span>Retry</span>
          </span>
        );
      case 'synced':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-[#075056]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#075056]" />
            <span>{lastSyncTime ? `Synced ${lastSyncTime}` : 'Synced'}</span>
          </span>
        );
    }
  };

  // Generate current 7-day week strip for Dashboard / Today view
  const renderWeekStrip = () => {
    const sel = new Date(`${selectedDate}T12:00:00`);
    const dayOfWeek = sel.getDay(); // 0 is Sun, 1 is Mon...
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
      <div className="max-w-md mx-auto mt-2 pt-2 border-t border-[#E8E3D5]/60 flex items-center justify-between gap-1">
        {weekDays.map((w) => (
          <button
            key={w.dateStr}
            type="button"
            onClick={() => {
              triggerHaptic(8);
              onSelectDate(w.dateStr);
            }}
            aria-label={`${w.dayLetter} ${w.dayNum}`}
            className={`flex-1 py-1.5 px-0.5 rounded-xl flex flex-col items-center transition-all ${
              w.isSelected
                ? 'bg-[#16232B] text-white shadow-xs font-bold scale-105'
                : 'bg-white/60 hover:bg-white text-[#526673] border border-[#E8E3D5]/60'
            }`}
          >
            <span className={`text-[9px] font-caption uppercase leading-none ${
              w.isSelected ? 'text-[#FFFFF0]/80' : 'text-[#526673]'
            }`}>
              {w.dayLetter}
            </span>
            <span className={`text-xs font-semibold leading-tight mt-0.5 ${
              w.isSelected ? 'text-white' : w.isCurrentDay ? 'text-[#FF5B04] font-bold' : 'text-[#16232B]'
            }`}>
              {w.dayNum}
            </span>
            {/* Logged indicator dot */}
            <span
              className={`w-1 h-1 rounded-full mt-1 ${
                w.hasLog
                  ? w.isSelected ? 'bg-[#FF7529]' : 'bg-[#FF5B04]'
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
    <header className="sticky top-0 z-40 bg-[#FFFFF0]/95 backdrop-blur-md border-b border-[#E8E3D5] px-4 pt-2.5 pb-2 safe-top shadow-xs">
      {/* 56px App Bar */}
      <div className="max-w-md mx-auto flex items-center justify-between h-[44px]">
        
        {/* Wordmark & Brand mark */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#16232B] p-1.5 flex items-center justify-center shadow-2xs border border-white/10 shrink-0">
            <img src="/logo-white.png" alt="DAILY/FIT" className="w-full h-full object-contain filter drop-shadow-2xs" />
          </div>

          <div className="flex items-baseline space-x-1.5">
            <span className="font-h3 text-base tracking-widest text-[#16232B]">DAILY</span>
            <span className="font-h3 text-base tracking-widest text-[#FF5B04]">/ FIT</span>
          </div>
        </div>

        {/* Action Controls & Status */}
        <div className="flex items-center space-x-1.5">
          {/* Real Sync Status Chip */}
          <button
            type="button"
            onClick={onSync}
            className="px-2 py-1 rounded-lg bg-white border border-[#E8E3D5] hover:bg-[#FFFFF0] text-[11px] font-caption font-semibold transition-colors flex items-center shadow-2xs"
            title="Tap to sync with Google Sheet"
          >
            {renderSyncLabel()}
          </button>

          {/* Streak Chip */}
          {gamification && onOpenBadgesModal && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(10);
                onOpenBadgesModal();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-[#E8E3D5] hover:bg-[#FFF0E8] text-[#FF5B04] text-xs font-number font-bold transition-all active:scale-95 shadow-2xs"
              title={`Streak: ${gamification.streak} days. Tap to view achievements.`}
            >
              <Flame className="w-3.5 h-3.5 text-[#FF5B04] fill-[#FF5B04]" />
              <span className="text-[#16232B]">{gamification.streak}</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              onOpenSettings();
            }}
            className="p-1.5 text-[#526673] hover:text-[#16232B] hover:bg-white rounded-lg transition-colors active:scale-95"
            title="Settings & Google Sheet"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Date Navigation Strip */}
      {(currentTab === 'dashboard' || currentTab === 'today') && renderWeekStrip()}

      {(currentTab === 'fitness' || currentTab === 'workout' || currentTab === 'food' || currentTab === 'work') && (
        <div className="max-w-md mx-auto mt-2 pt-2 border-t border-[#E8E3D5]/60 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-1 text-[#526673] hover:text-[#16232B] rounded-lg hover:bg-white transition-colors"
            title="Previous day"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <label className="relative cursor-pointer flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white border border-[#E8E3D5] hover:border-[#16232B] font-title text-xs text-[#16232B] transition-colors shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-[#FF5B04]" />
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
                className="font-button-s text-[10px] text-[#FF5B04] hover:text-[#16232B] px-2 py-1 rounded-lg bg-white border border-[#E8E3D5]"
              >
                TODAY
              </button>
            )}
            <button
              type="button"
              onClick={handleNextDay}
              className="p-1 text-[#526673] hover:text-[#16232B] rounded-lg hover:bg-white transition-colors"
              title="Next day"
              aria-label="Next day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
