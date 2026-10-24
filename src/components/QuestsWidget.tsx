import React, { useState } from 'react';
import { Droplets, Footprints, UtensilsCrossed, Gift, Check, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { DailyQuest } from '../types';
import { triggerHaptic } from '../utils/formatters';

interface QuestsWidgetProps {
  quests: DailyQuest[];
  onClaimQuest: (questId: string) => void;
  onClaimChest: () => void;
  chestClaimed: boolean;
  onOpenBadgesModal: () => void;
  onQuickAddWater?: (litres: number) => void;
  onQuickAddSteps?: (steps: number) => void;
  onQuickLogMeal?: () => void;
}

export const QuestsWidget: React.FC<QuestsWidgetProps> = ({
  quests,
  onClaimQuest,
  onClaimChest,
  chestClaimed,
  onOpenBadgesModal: _onOpenBadgesModal,
  onQuickAddWater,
  onQuickAddSteps,
  onQuickLogMeal
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const completedCount = quests.filter((q) => q.completed).length;
  const allCompleted = completedCount === quests.length && quests.length > 0;

  const getCleanTitle = (quest: DailyQuest) => {
    switch (quest.icon) {
      case 'water':
        return `Water ${quest.current} / ${quest.target} L`;
      case 'steps':
        return `Steps ${quest.current.toLocaleString()} / ${quest.target.toLocaleString()}`;
      case 'food':
        return `Meals ${quest.current} / ${quest.target}`;
      default:
        return quest.title.replace(/^[^:]+:\s*/, '');
    }
  };

  const getActionControl = (quest: DailyQuest) => {
    if (quest.completed && !quest.claimed) {
      return (
        <button
          type="button"
          onClick={() => {
            triggerHaptic(15);
            onClaimQuest(quest.id);
          }}
          className="px-2.5 py-1 rounded-xl bg-[#FF5B04] text-white font-button-s text-xs font-bold shrink-0 shadow-xs active:scale-95 transition-all"
        >
          Claim +{quest.xp} XP
        </button>
      );
    }

    if (quest.completed && quest.claimed) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#075056] text-white font-label text-[10px] shrink-0 font-bold">
          <Check className="w-3 h-3 stroke-[3]" /> Done
        </span>
      );
    }

    if (quest.icon === 'water' && onQuickAddWater) {
      return (
        <button
          type="button"
          onClick={() => {
            triggerHaptic(15);
            onQuickAddWater(0.25);
          }}
          className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFFFF0] text-[#16232B] font-button-s text-xs shrink-0 border border-[#E8E3D5] shadow-2xs transition-colors"
        >
          +250 ml
        </button>
      );
    }

    if (quest.icon === 'steps' && onQuickAddSteps) {
      return (
        <button
          type="button"
          onClick={() => {
            triggerHaptic(15);
            onQuickAddSteps(1000);
          }}
          className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFFFF0] text-[#16232B] font-button-s text-xs shrink-0 border border-[#E8E3D5] shadow-2xs transition-colors"
        >
          +1k
        </button>
      );
    }

    if (quest.icon === 'food' && onQuickLogMeal) {
      return (
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            onQuickLogMeal();
          }}
          className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#FFFFF0] text-[#16232B] font-button-s text-xs shrink-0 border border-[#E8E3D5] shadow-2xs transition-colors"
        >
          Log
        </button>
      );
    }

    return (
      <span className="font-caption text-[11px] text-[#526673] bg-white px-2 py-0.5 rounded-md border border-[#E8E3D5] tabular-nums shrink-0">
        +{quest.xp} XP
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-[#E8E3D5] shadow-2xs">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <div className="font-h3 text-sm text-[#16232B] flex items-center gap-2">
            <span>Today's Goals</span>
            <span className="font-label text-[10px] px-2 py-0.5 rounded-full bg-[#FFFFF0] text-[#16232B] border border-[#E8E3D5] font-bold">
              {completedCount}/{quests.length}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 text-[#526673] hover:text-[#16232B] rounded-lg"
          title={isCollapsed ? 'Expand goals' : 'Collapse goals'}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Actionable Goals List */}
      {!isCollapsed && (
        <div className="space-y-2 pt-1">
          {quests.map((quest) => {
            const pct = Math.min(100, Math.round(((quest.current || 0) / (quest.target || 1)) * 100));

            return (
              <div
                key={quest.id}
                className="p-2.5 rounded-2xl bg-[#FFFFF0]/40 border border-[#E8E3D5] transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <div className="p-1.5 rounded-xl bg-white border border-[#E8E3D5] shrink-0 text-[#16232B]">
                      {quest.icon === 'water' && <Droplets className="w-3.5 h-3.5 text-[#075056]" />}
                      {quest.icon === 'steps' && <Footprints className="w-3.5 h-3.5 text-[#FF5B04]" />}
                      {quest.icon === 'food' && <UtensilsCrossed className="w-3.5 h-3.5 text-[#075056]" />}
                      {quest.icon !== 'water' && quest.icon !== 'steps' && quest.icon !== 'food' && <Sparkles className="w-3.5 h-3.5 text-[#FF5B04]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-title text-xs text-[#16232B] truncate">
                        {getCleanTitle(quest)}
                      </div>
                    </div>
                  </div>

                  {getActionControl(quest)}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#E8E3D5]/60">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor:
                        quest.icon === 'water'
                          ? '#075056'
                          : quest.icon === 'steps'
                          ? '#FF5B04'
                          : '#075056'
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Mystery Chest Box */}
          {(allCompleted || chestClaimed) && (
            <div className="mt-2 pt-2 border-t border-[#E8E3D5]">
              <div className="bg-[#FFF0E8] p-3 rounded-2xl border border-[#FF5B04]/30 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-[#FF5B04]/30 flex items-center justify-center text-base shadow-2xs">
                    {chestClaimed ? '✨' : '🎁'}
                  </div>
                  <div>
                    <div className="font-title text-xs text-[#16232B]">
                      {chestClaimed ? 'Daily Chest Unlocked' : 'Daily Bonus Unlocked!'}
                    </div>
                    <div className="font-caption text-[11px] text-[#526673]">
                      {chestClaimed ? 'All goals crushed today.' : 'Tap to claim your bonus.'}
                    </div>
                  </div>
                </div>

                {!chestClaimed ? (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(20);
                      onClaimChest();
                    }}
                    className="px-3 py-1.5 bg-[#FF5B04] text-white font-button-s text-xs font-bold rounded-xl flex items-center gap-1 shadow-xs hover:scale-105 active:scale-95 transition-all"
                  >
                    <Gift className="w-3 h-3" />
                    <span>Open (+50 XP)</span>
                  </button>
                ) : (
                  <span className="font-label text-[10px] text-[#075056] bg-white px-2.5 py-1 rounded-xl border border-[#E8E3D5] font-bold">
                    Opened
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
