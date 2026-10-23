import React from 'react';
import { Droplets, Footprints, UtensilsCrossed, Gift, Check, Sparkles, ChevronRight } from 'lucide-react';
import { DailyQuest } from '../types';

interface QuestsWidgetProps {
  quests: DailyQuest[];
  onClaimQuest: (questId: string) => void;
  onClaimChest: () => void;
  chestClaimed: boolean;
  onOpenBadgesModal: () => void;
}

export const QuestsWidget: React.FC<QuestsWidgetProps> = ({
  quests,
  onClaimQuest,
  onClaimChest,
  chestClaimed,
  onOpenBadgesModal
}) => {
  const completedCount = quests.filter((q) => q.completed).length;
  const allCompleted = completedCount === quests.length && quests.length > 0;

  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'water':
        return <Droplets className="w-4 h-4 text-[#0B369A]" />;
      case 'steps':
        return <Footprints className="w-4 h-4 text-[#C34811]" />;
      case 'food':
        return <UtensilsCrossed className="w-4 h-4 text-[#2E7D32]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#0B369A]" />;
    }
  };

  const getProgressColor = (type: string) => {
    switch (type) {
      case 'water':
        return '#0B369A';
      case 'steps':
        return '#C34811';
      case 'food':
        return '#2E7D32';
      default:
        return '#141414';
    }
  };

  return (
    <div className="specimen-card p-4 border border-[#D9D1CA]">
      
      {/* Widget Header with Duo-style Quests pill */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D9D1CA]/60 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#F3EFEA] text-[#C34811] border border-[#D9D1CA] flex items-center justify-center font-black text-xs">
            ⚡
          </div>
          <div>
            <div className="text-xs font-display font-black text-[#141414] uppercase tracking-wider flex items-center gap-1.5">
              <span>Daily Missions</span>
              <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#F3EFEA] text-[#0B369A] border border-[#D9D1CA]">
                {completedCount}/{quests.length} Done
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#6E6A63]">Crush missions to earn XP and open the Mystery Chest</div>
          </div>
        </div>

        <button
          onClick={onOpenBadgesModal}
          className="text-xs font-mono font-bold text-[#0B369A] hover:text-[#C34811] flex items-center gap-0.5 uppercase"
        >
          <span>Badges</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 3 Quests List */}
      <div className="space-y-2.5">
        {quests.map((quest) => {
          const pct = Math.min(100, Math.round(((quest.current || 0) / (quest.target || 1)) * 100));

          return (
            <div
              key={quest.id}
              className={`p-2.5 rounded-xl border transition-all ${
                quest.completed
                  ? 'bg-green-50/40 border-green-200'
                  : 'bg-[#F3EFEA] border-[#D9D1CA]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-white border border-[#D9D1CA]">
                    {getQuestIcon(quest.icon)}
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold text-[#141414] uppercase leading-tight">{quest.title}</div>
                    <div className="text-[10px] font-mono text-[#6E6A63] mt-0.5">
                      {quest.current} / {quest.target} {quest.unit}
                    </div>
                  </div>
                </div>

                {/* Claim or XP Badge */}
                {quest.completed ? (
                  quest.claimed ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-100 text-green-800 font-mono font-bold text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" /> Claimed
                    </span>
                  ) : (
                    <button
                      onClick={() => onClaimQuest(quest.id)}
                      className="px-2.5 py-1 rounded-lg btn-3d-terracotta font-mono font-black text-[10px] uppercase tracking-wide flex items-center gap-1 shadow-sm"
                    >
                      <span>Claim +{quest.xp} XP</span>
                    </button>
                  )
                ) : (
                  <span className="font-mono text-[10px] font-bold text-[#6E6A63] bg-white px-2 py-0.5 rounded-md border border-[#D9D1CA]">
                    +{quest.xp} XP
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#D9D1CA]">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: getProgressColor(quest.icon)
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mystery Chest Box */}
      <div className="mt-3 pt-3 border-t border-[#D9D1CA]">
        <div className="bg-[#F3EFEA] p-3 rounded-xl border border-[#D9D1CA] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl ${
              allCompleted && !chestClaimed
                ? 'bg-amber-100 border border-amber-300 animate-chest-bounce'
                : 'bg-white border border-[#D9D1CA]'
            }`}>
              {chestClaimed ? '✨' : '🎁'}
            </div>
            <div>
              <div className="text-xs font-display font-black text-[#141414] uppercase">
                {chestClaimed ? 'Daily Chest Unlocked!' : 'Daily Mystery Chest'}
              </div>
              <div className="text-[10px] font-sans text-[#6E6A63]">
                {chestClaimed
                  ? 'All 3 missions crushed today! Good work.'
                  : allCompleted
                  ? 'All missions finished! Tap to claim your bonus.'
                  : `Finish ${3 - completedCount} more mission${3 - completedCount === 1 ? '' : 's'} to unlock (+50 XP)`}
              </div>
            </div>
          </div>

          <div>
            {chestClaimed ? (
              <span className="font-mono text-[10px] font-bold text-green-800 bg-green-100 px-2 py-1 rounded-md border border-green-200">
                ✓ Opened
              </span>
            ) : allCompleted ? (
              <button
                onClick={onClaimChest}
                className="px-3 py-1.5 btn-3d-terracotta font-display font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1 shadow-sm"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Open (+50 XP)</span>
              </button>
            ) : (
              <span className="font-mono text-[9px] font-bold text-[#6E6A63] bg-white px-2 py-1 rounded-md border border-[#D9D1CA]">
                LOCKED
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
