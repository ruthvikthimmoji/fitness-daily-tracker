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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border border-[#E2DACB] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2DACB]">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#F5F2EA] text-[#C4501F] border border-[#E2DACB]">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-label text-[10px] text-[#C4501F]">
                ACHIEVEMENTS · {unlockedCount}/{gamification.badges.length} UNLOCKED
              </div>
              <h2 className="font-h2 text-base text-[#2B2324]">
                Streaks & Badges
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#5E5444] hover:text-[#2B2324] rounded-lg hover:bg-[#F5F2EA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pt-3.5">
          
          {/* 1. Streak & Freeze Status Banner */}
          <div className="bg-[#F5F2EA] p-4 rounded-xl border border-[#E2DACB] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E2DACB] flex items-center justify-center shadow-2xs">
                <Flame className="w-6 h-6 text-[#C4501F] fill-[#C4501F]" />
              </div>
              <div>
                <div className="font-display-l text-xl text-[#2B2324] leading-tight">
                  {gamification.streak} Day Streak
                </div>
                <div className="font-caption text-xs text-[#5E5444]">
                  Best: {gamification.bestStreak} days · Show up daily.
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#E2DACB] shadow-2xs">
              <Shield className="w-4 h-4 text-[#C4501F]" />
              <div className="text-right">
                <div className="font-score-m text-sm text-[#2B2324] leading-tight">
                  {gamification.streakFreezes} Freezes
                </div>
                <div className="font-caption text-[10px] text-[#5E5444] leading-tight">Equipped</div>
              </div>
            </div>
          </div>

          {/* 2. Level Progression Banner */}
          <div className="bg-white p-4 rounded-xl border border-[#E2DACB] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-title text-sm text-[#2B2324]">
                  Level {gamification.level}: {gamification.levelTitle}
                </span>
                <span className="font-label text-[10px] px-2 py-0.5 rounded-full bg-[#EEE9DD] text-[#2B2324] border border-[#E2DACB]">
                  {gamification.totalXp} XP
                </span>
              </div>
              <span className="font-caption text-xs text-[#5E5444]">
                {gamification.currentLevelXp} / {gamification.nextLevelXp} XP
              </span>
            </div>

            {/* Level Bar */}
            <div className="w-full h-2 bg-[#EEE9DD] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C4501F] rounded-full transition-all duration-300"
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
                    ? 'bg-[#2B2324] text-white border-[#2B2324] shadow-xs'
                    : 'bg-[#F5F2EA] text-[#5E5444] border border-[#E2DACB] hover:bg-[#EEE9DD]'
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
                  className={`p-3 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-white border-[#E2DACB] shadow-2xs'
                      : 'bg-[#F5F2EA]/70 border-[#E2DACB]/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F2EA] border border-[#E2DACB] flex items-center justify-center text-xl">
                      {isUnlocked ? badge.icon : '🔒'}
                    </div>

                    {isUnlocked ? (
                      <span className="p-1 rounded-md bg-[#2B2324] text-white">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-md bg-[#EEE9DD] text-[#5E5444]">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="font-title text-xs text-[#2B2324] leading-tight">
                      {badge.title}
                    </div>
                    <div className="font-caption text-[11px] text-[#5E5444] mt-0.5 line-clamp-2">
                      {badge.description}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between font-caption text-[10px] text-[#5E5444] mb-1">
                      <span>{isUnlocked ? 'Completed' : 'Progress'}</span>
                      <span>{badge.progress} / {badge.maxProgress}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EEE9DD] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C4501F] rounded-full transition-all"
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
