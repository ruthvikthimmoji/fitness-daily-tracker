import React, { useState } from 'react';
import { X, Award, Shield, Check, Lock, Flame } from 'lucide-react';
import { GamificationState } from '../types';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  gamification: GamificationState;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  gamification
}) => {
  const [filter, setFilter] = useState<string>('All');

  if (!isOpen) return null;

  const unlockedCount = gamification.badges.filter((b) => b.unlocked).length;
  const levelProgressPct = Math.min(
    100,
    Math.round((gamification.currentLevelXp / (gamification.nextLevelXp || 100)) * 100)
  );

  const categories = ['All', 'streak', 'workout', 'steps', 'nutrition', 'discipline'];

  const filteredBadges = filter === 'All'
    ? gamification.badges
    : gamification.badges.filter((b) => b.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#16232B]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-[#E8E3D5] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D5]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#FFF0E8] text-[#FF5B04] border border-[#FF5B04]/30">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-label text-[10px] text-[#FF5B04] font-bold">
                ACHIEVEMENTS · {unlockedCount}/{gamification.badges.length} UNLOCKED
              </div>
              <h2 className="font-h2 text-base text-[#16232B]">
                Streaks & Badges
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#526673] hover:text-[#16232B] rounded-xl hover:bg-[#FFFFF0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pt-3.5">
          
          {/* 1. Streak & Freeze Status Banner */}
          <div className="bg-[#FFFFF0]/50 p-4 rounded-2xl border border-[#E8E3D5] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E8E3D5] flex items-center justify-center shadow-2xs">
                <Flame className="w-6 h-6 text-[#FF5B04] fill-[#FF5B04]" />
              </div>
              <div>
                <div className="font-display-l text-xl text-[#16232B] leading-tight">
                  {gamification.streak} Day Streak
                </div>
                <div className="font-caption text-xs text-[#526673]">
                  Best: {gamification.bestStreak} days · Show up daily.
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#E8E3D5] shadow-2xs">
              <Shield className="w-4 h-4 text-[#075056]" />
              <div className="text-right">
                <div className="font-score-m text-sm text-[#16232B] leading-tight">
                  {gamification.streakFreezes} Freezes
                </div>
                <div className="font-caption text-[10px] text-[#526673] leading-tight">Equipped</div>
              </div>
            </div>
          </div>

          {/* 2. Level Progression Banner */}
          <div className="bg-white p-4 rounded-2xl border border-[#E8E3D5] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-title text-sm text-[#16232B]">
                  Level {gamification.level}: {gamification.levelTitle}
                </span>
                <span className="font-label text-[10px] px-2 py-0.5 rounded-full bg-[#FFFFF0] text-[#16232B] border border-[#E8E3D5]">
                  {gamification.totalXp} XP
                </span>
              </div>
              <span className="font-caption text-xs text-[#526673]">
                {gamification.currentLevelXp} / {gamification.nextLevelXp} XP
              </span>
            </div>

            {/* Level Bar */}
            <div className="w-full h-2 bg-[#FFFFF0] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FF5B04] to-[#FF7529] rounded-full transition-all duration-300"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
          </div>

          {/* 3. Category Filter Chips with Fade */}
          <div className="chips">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`chip px-3 py-1 rounded-xl font-button-s text-xs uppercase tracking-wider transition-all ${
                  filter === cat
                    ? 'bg-[#16232B] text-white border-[#16232B] shadow-xs font-bold'
                    : 'bg-white text-[#526673] border border-[#E8E3D5] hover:bg-[#FFFFF0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 4. Badges Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {filteredBadges.map((badge) => {
              const isUnlocked = badge.unlocked;
              const pct = Math.min(100, Math.round(((badge.progress || 0) / (badge.maxProgress || 1)) * 100));

              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    isUnlocked
                      ? 'bg-white border-[#E8E3D5] shadow-2xs'
                      : 'bg-[#FFFFF0]/40 border-[#E8E3D5]/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FFFFF0] border border-[#E8E3D5] flex items-center justify-center text-xl">
                      {isUnlocked ? badge.icon : '🔒'}
                    </div>

                    {isUnlocked ? (
                      <span className="p-1 rounded-md bg-[#075056] text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-md bg-[#FFFFF0] text-[#526673]">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="font-title text-xs text-[#16232B] leading-tight">
                      {badge.title}
                    </div>
                    <div className="font-caption text-[11px] text-[#526673] mt-0.5 line-clamp-2">
                      {badge.description}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between font-caption text-[10px] text-[#526673] mb-1">
                      <span>{isUnlocked ? 'Completed' : 'Progress'}</span>
                      <span>{badge.progress} / {badge.maxProgress}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#FFFFF0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF5B04] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
