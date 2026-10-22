import React, { useState } from 'react';
import { X, Award, Shield, Check, Lock, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border border-[#BFBFBF] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#BFBFBF]/60">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#EAF2F5] text-[#1F4E5F] border border-[#BFBFBF]/60">
              <Award className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1F4E5F]">Achievements & Streaks</h2>
              <div className="text-[11px] text-[#595959] italic">Your daily discipline showroom</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#595959] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EAF2F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 pt-3.5">
          
          {/* 1. Streak & Freeze Status Banner */}
          <div className="bg-[#EAF2F5] p-4 rounded-xl border border-[#BFBFBF] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#BFBFBF] flex items-center justify-center text-2xl shadow-xs">
                🔥
              </div>
              <div>
                <div className="text-lg font-black text-[#1F4E5F] flex items-center gap-1.5">
                  <span>{gamification.streak} Day Streak!</span>
                </div>
                <div className="text-xs text-[#595959] italic">
                  Best streak: {gamification.bestStreak} days • Show up daily.
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-[#BFBFBF] shadow-xs">
              <Shield className="w-4 h-4 text-[#2E75B6]" />
              <div className="text-right">
                <div className="text-[11px] font-black text-[#1F4E5F] leading-tight">
                  {gamification.streakFreezes} Freezes
                </div>
                <div className="text-[9px] text-[#595959] font-medium leading-tight">Equipped</div>
              </div>
            </div>
          </div>

          {/* 2. Level Progression Banner */}
          <div className="bg-white p-4 rounded-xl border border-[#BFBFBF] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-[#1F4E5F] uppercase tracking-wider">
                  Level {gamification.level}: {gamification.levelTitle}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFEB9C] text-[#7F6000]">
                  ⚡ {gamification.totalXp} Total XP
                </span>
              </div>
              <span className="text-xs font-bold text-[#595959]">
                {gamification.currentLevelXp} / {gamification.nextLevelXp} XP
              </span>
            </div>

            {/* Level Bar */}
            <div className="w-full h-3 bg-[#EAF2F5] rounded-full overflow-hidden border border-[#BFBFBF]/70">
              <div
                className="h-full bg-gradient-to-r from-[#2E75B6] to-[#1F4E5F] rounded-full transition-all duration-500"
                style={{ width: `${levelProgressPct}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#595959] mt-1.5 italic">
              Earn XP by tracking water, steps, meals, workouts, and completing daily quests.
            </div>
          </div>

          {/* 3. Badges Filter Pills */}
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-[#1F4E5F] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2E75B6]" />
              <span>Milestone Badges ({unlockedCount}/{gamification.badges.length} Unlocked)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg capitalize whitespace-nowrap transition-all ${
                  filter === cat
                    ? 'bg-[#1F4E5F] text-white'
                    : 'bg-[#EAF2F5] text-[#595959] hover:text-[#1F4E5F] border border-[#BFBFBF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 4. Badges Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {filteredBadges.map((badge) => {
              const pct = Math.min(100, Math.round(((badge.progress || 0) / (badge.maxProgress || 1)) * 100));

              return (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    badge.unlocked
                      ? 'bg-white border-[#BFBFBF] shadow-xs'
                      : 'bg-[#EAF2F5]/60 border-[#BFBFBF]/60 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${
                        badge.unlocked
                          ? 'bg-[#EAF2F5] border-[#BFBFBF]'
                          : 'bg-white/80 border-[#BFBFBF]/50 grayscale'
                      }`}>
                        {badge.icon}
                      </div>

                      {badge.unlocked ? (
                        <span className="w-5 h-5 rounded-full bg-[#C6EFCE] text-[#2E7D32] border border-[#2E7D32]/30 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-white text-[#BFBFBF] border border-[#BFBFBF] flex items-center justify-center">
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-bold text-[#1A1A1A] leading-tight">{badge.title}</div>
                    <div className="text-[10px] text-[#595959] mt-0.5 leading-snug">{badge.description}</div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5 pt-2 border-t border-[#BFBFBF]/50">
                    <div className="flex justify-between text-[9px] text-[#595959] font-bold mb-1">
                      <span>{badge.unlocked ? 'Unlocked!' : `${badge.progress} / ${badge.maxProgress}`}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EAF2F5] rounded-full overflow-hidden border border-[#BFBFBF]/60">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: badge.unlocked ? '#2E7D32' : '#2E75B6'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#1F4E5F] hover:bg-[#163a47] text-white font-bold text-xs rounded-lg transition-all"
          >
            Close Showroom
          </button>
        </div>

      </div>
    </div>
  );
};
