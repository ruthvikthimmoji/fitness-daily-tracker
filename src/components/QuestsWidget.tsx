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
        return <Droplets className="w-4 h-4 text-[#EB5E28]" />;
      case 'steps':
        return <Footprints className="w-4 h-4 text-[#EB5E28]" />;
      case 'food':
        return <UtensilsCrossed className="w-4 h-4 text-[#2C2324]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#EB5E28]" />;
    }
  };

  const getProgressColor = (type: string) => {
    switch (type) {
      case 'water':
        return '#EB5E28';
      case 'steps':
        return '#EB5E28';
      case 'food':
        return '#2C2324';
      default:
        return '#766754';
    }
  };

  return (
    <div className="specimen-card p-4 border border-[#D8D3C8]">
      
      {/* Widget Header with Duo-style Quests pill */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D8D3C8]/60 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#EFECE3] text-[#EB5E28] border border-[#D8D3C8] flex items-center justify-center font-black text-xs">
            ⚡
          </div>
          <div>
            <div className="text-xs font-display font-black text-[#2C2324] uppercase tracking-wider flex items-center gap-1.5">
              <span>Daily Missions</span>
              <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#EFECE3] text-[#EB5E28] border border-[#D8D3C8]">
                {completedCount}/{quests.length} Done
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#766754]">Crush missions to earn XP and open the Mystery Chest</div>
          </div>
        </div>

        <button
          onClick={onOpenBadgesModal}
          className="text-xs font-mono font-bold text-[#EB5E28] hover:text-[#2C2324] flex items-center gap-0.5 uppercase"
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
                  ? 'bg-[#EFECE3] border-[#EB5E28]/40'
                  : 'bg-[#EFECE3] border-[#D8D3C8]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-white border border-[#D8D3C8]">
                    {getQuestIcon(quest.icon)}
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold text-[#2C2324] uppercase leading-tight">{quest.title}</div>
                    <div className="text-[10px] font-mono text-[#766754] mt-0.5">
                      {quest.current} / {quest.target} {quest.unit}
                    </div>
                  </div>
                </div>

                {/* Claim or XP Badge */}
                {quest.completed ? (
                  quest.claimed ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2C2324] text-white font-mono font-bold text-[10px]">
                      <Check className="w-3 h-3 stroke-[3]" /> Claimed
                    </span>
                  ) : (
                    <button
                      onClick={() => onClaimQuest(quest.id)}
                      className="px-2.5 py-1 rounded-lg btn-3d-santiago font-mono font-black text-[10px] uppercase tracking-wide flex items-center gap-1 shadow-sm"
                    >
                      <span>Claim +{quest.xp} XP</span>
                    </button>
                  )
                ) : (
                  <span className="font-mono text-[10px] font-bold text-[#766754] bg-white px-2 py-0.5 rounded-md border border-[#D8D3C8]">
                    +{quest.xp} XP
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#D8D3C8]">
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
      <div className="mt-3 pt-3 border-t border-[#D8D3C8]">
        <div className="bg-[#EFECE3] p-3 rounded-xl border border-[#D8D3C8] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl ${
              allCompleted && !chestClaimed
                ? 'bg-amber-100 border border-amber-300 animate-chest-bounce'
                : 'bg-white border border-[#D8D3C8]'
            }`}>
              {chestClaimed ? '✨' : '🎁'}
            </div>
            <div>
              <div className="text-xs font-display font-black text-[#2C2324] uppercase">
                {chestClaimed ? 'Daily Chest Unlocked!' : 'Daily Mystery Chest'}
              </div>
              <div className="text-[10px] font-sans text-[#766754]">
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
              <span className="font-mono text-[10px] font-bold text-[#2C2324] bg-white px-2 py-1 rounded-md border border-[#D8D3C8]">
                ✓ Opened
              </span>
            ) : allCompleted ? (
              <button
                onClick={onClaimChest}
                className="px-3 py-1.5 btn-3d-santiago font-display font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-1 shadow-sm"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Open (+50 XP)</span>
              </button>
            ) : (
              <span className="font-mono text-[9px] font-bold text-[#766754] bg-white px-2 py-1 rounded-md border border-[#D8D3C8]">
                LOCKED
              </span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
