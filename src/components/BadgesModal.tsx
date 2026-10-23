import React, { useState } from 'react';
import { X, Award, Shield, Check, Lock } from 'lucide-react';
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
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border border-[#D9D1CA] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9D1CA]">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#F3EFEA] text-[#0B369A] border border-[#D9D1CA]">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-[#C34811] font-bold">
                SHOWROOM ARCHIVE // {unlockedCount}/{gamification.badges.length} UNLOCKED
              </div>
              <h2 className="text-base font-display font-black text-[#141414] uppercase tracking-tight">
                Achievements & Streaks
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6E6A63] hover:text-[#141414] rounded-lg hover:bg-[#F3EFEA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pt-3.5">
          
          {/* 1. Streak & Freeze Status Banner */}
          <div className="bg-[#F3EFEA] p-4 rounded-xl border border-[#D9D1CA] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#D9D1CA] flex items-center justify-center text-2xl shadow-xs">
                🔥
              </div>
              <div>
                <div className="text-lg font-display font-black text-[#141414] flex items-center gap-1.5 uppercase">
                  <span>{gamification.streak} Day Streak</span>
                </div>
                <div className="text-xs font-mono text-[#6E6A63]">
                  Record: {gamification.bestStreak} days • Show up daily.
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 bg-white px-3 py-1.5 rounded-xl border border-[#D9D1CA] shadow-xs">
              <Shield className="w-4 h-4 text-[#0B369A]" />
              <div className="text-right">
                <div className="text-[11px] font-mono font-bold text-[#141414] leading-tight">
                  {gamification.streakFreezes} Freezes
                </div>
                <div className="text-[9px] font-mono text-[#6E6A63] leading-tight">Equipped</div>
              </div>
            </div>
          </div>

          {/* 2. Level Progression Banner */}
          <div className="bg-white p-4 rounded-xl border border-[#D9D1CA] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-display font-black text-[#141414] uppercase tracking-wider">
                  Level {gamification.level}: {gamification.levelTitle}
                </span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F3EFEA] text-[#C34811] border border-[#D9D1CA]">
                  ⚡ {gamification.totalXp} XP
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-[#6E6A63]">
                {gamification.currentLevelXp} / {gamification.nextLevelXp} XP
              </span>
            </div>

            {/* Level Bar */}
            <div className="w-full h-2.5 bg-[#F3EFEA] rounded-full overflow-hidden border border-[#D9D1CA]">
              <div
                className="h-full bg-[#0B369A] rounded-full transition-all duration-300"
                style={{ width: `${levelProgressPct}%` }}
              ></div>
            </div>
          </div>

          {/* 3. Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all ${
                  filter === cat
                    ? 'bg-[#141414] text-white'
                    : 'bg-[#F3EFEA] text-[#6E6A63] border border-[#D9D1CA] hover:bg-[#EAE5DE]'
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
                      ? 'bg-white border-[#D9D1CA] shadow-xs'
                      : 'bg-[#F3EFEA]/60 border-[#D9D1CA]/60 opacity-65'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F3EFEA] border border-[#D9D1CA] flex items-center justify-center text-xl">
                      {isUnlocked ? badge.icon : '🔒'}
                    </div>

                    {isUnlocked ? (
                      <span className="p-1 rounded-md bg-green-100 text-green-800">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-md bg-[#EAE5DE] text-[#6E6A63]">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <div className="text-xs font-display font-bold text-[#141414] uppercase leading-tight">
                      {badge.title}
                    </div>
                    <div className="text-[10px] text-[#6E6A63] font-sans mt-0.5 line-clamp-2">
                      {badge.description}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[9px] font-mono text-[#6E6A63] mb-1">
                      <span>{isUnlocked ? 'Completed' : 'Progress'}</span>
                      <span>{badge.progress} / {badge.maxProgress}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EAE5DE] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0B369A] rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      ></div>
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
