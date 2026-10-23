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
    // If completed and unclaimed, show Claim button
    if (quest.completed && !quest.claimed) {
      return (
        <button
          type="button"
          onClick={() => {
            triggerHaptic(15);
            onClaimQuest(quest.id);
          }}
          className="px-2.5 py-1 rounded-lg bg-[#C4501F] text-white font-button-s text-xs font-bold shrink-0 shadow-xs"
        >
          Claim +{quest.xp} XP
        </button>
      );
    }

    if (quest.completed && quest.claimed) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#2B2324] text-white font-label text-[10px] shrink-0">
          <Check className="w-3 h-3 stroke-[3]" /> Done
        </span>
      );
    }

    // In-place quick action buttons (I3)
    if (quest.icon === 'water' && onQuickAddWater) {
      return (
        <button
          type="button"
          onClick={() => {
            triggerHaptic(15);
            onQuickAddWater(0.25);
          }}
          className="px-2.5 py-1 rounded-lg bg-[#EEE9DD] hover:bg-[#E2DACB] text-[#2B2324] font-button-s text-xs shrink-0 border border-[#E2DACB]"
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
          className="px-2.5 py-1 rounded-lg bg-[#EEE9DD] hover:bg-[#E2DACB] text-[#2B2324] font-button-s text-xs shrink-0 border border-[#E2DACB]"
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
          className="px-2.5 py-1 rounded-lg bg-[#EEE9DD] hover:bg-[#E2DACB] text-[#2B2324] font-button-s text-xs shrink-0 border border-[#E2DACB]"
        >
          Log
        </button>
      );
    }

    return (
      <span className="font-caption text-[11px] text-[#5E5444] bg-[#EEE9DD] px-2 py-0.5 rounded-md tabular-nums shrink-0">
        +{quest.xp} XP
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs">
      {/* Widget Header (I3 & V2: Today's goals) */}
      <div className="flex items-center justify-between pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <div className="font-h3 text-sm text-[#2B2324] flex items-center gap-2">
            <span>Today's goals</span>
            <span className="font-label text-[10px] px-2 py-0.5 rounded-full bg-[#EEE9DD] text-[#2B2324] border border-[#E2DACB]">
              {completedCount}/{quests.length}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 text-[#5E5444] hover:text-[#2B2324] rounded-lg"
          title={isCollapsed ? 'Expand goals' : 'Collapse goals'}
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Actionable Goals List (I3, B5: nowrap XP, min-w-0 titles) */}
      {!isCollapsed && (
        <div className="space-y-2 pt-1">
          {quests.map((quest) => {
            const pct = Math.min(100, Math.round(((quest.current || 0) / (quest.target || 1)) * 100));

            return (
              <div
                key={quest.id}
                className="p-2.5 rounded-xl bg-[#F5F2EA] border border-[#E2DACB] transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="p-1.5 rounded-lg bg-white border border-[#E2DACB] shrink-0 text-[#2B2324]">
                      {quest.icon === 'water' && <Droplets className="w-3.5 h-3.5 text-[#2F5D8A]" />}
                      {quest.icon === 'steps' && <Footprints className="w-3.5 h-3.5 text-[#C4501F]" />}
                      {quest.icon === 'food' && <UtensilsCrossed className="w-3.5 h-3.5 text-[#2B2324]" />}
                      {quest.icon !== 'water' && quest.icon !== 'steps' && quest.icon !== 'food' && <Sparkles className="w-3.5 h-3.5 text-[#C4501F]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-title text-xs text-[#2B2324] truncate">
                        {getCleanTitle(quest)}
                      </div>
                    </div>
                  </div>

                  {getActionControl(quest)}
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#E2DACB]">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor:
                        quest.icon === 'water'
                          ? '#2F5D8A'
                          : quest.icon === 'steps'
                          ? '#C4501F'
                          : '#2F6B2A'
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Mystery Chest Box - Appears when all goals completed or unlocked (V2) */}
          {(allCompleted || chestClaimed) && (
            <div className="mt-2 pt-2 border-t border-[#E2DACB]">
              <div className="bg-[#EEE9DD] p-2.5 rounded-xl border border-[#E2DACB] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E2DACB] flex items-center justify-center text-base">
                    {chestClaimed ? '✨' : '🎁'}
                  </div>
                  <div>
                    <div className="font-title text-xs text-[#2B2324]">
                      {chestClaimed ? 'Daily Chest Unlocked' : 'Daily Bonus Unlocked!'}
                    </div>
                    <div className="font-caption text-[11px] text-[#5E5444]">
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
                    className="px-2.5 py-1 bg-[#C4501F] text-white font-button-s text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <Gift className="w-3 h-3" />
                    <span>Open (+50 XP)</span>
                  </button>
                ) : (
                  <span className="font-label text-[10px] text-[#5E5444] bg-white px-2 py-0.5 rounded border border-[#E2DACB]">
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
