import React from 'react';
import { Flame, UtensilsCrossed, Dumbbell, Briefcase, TrendingUp } from 'lucide-react';
import { TabType } from '../types';
import { triggerHaptic } from '../utils/formatters';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  // 5 destinations (L2 & Wireframe 6): Today, Train, Food, Work, Progress
  const tabs = [
    { id: 'today' as TabType, label: 'Today', icon: Flame },
    { id: 'workout' as TabType, label: 'Train', icon: Dumbbell },
    { id: 'food' as TabType, label: 'Food', icon: UtensilsCrossed },
    { id: 'work' as TabType, label: 'Work', icon: Briefcase },
    { id: 'dashboard' as TabType, label: 'Progress', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto safe-bottom">
      {/* 5-item Frosted Dock (L2, V1, A2) */}
      <div className="bg-[#2B2324]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-1.5 py-1 shadow-[0_8px_30px_rgba(43,35,36,0.35)] flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                triggerHaptic(12);
                onSelectTab(tab.id);
              }}
              aria-current={isActive ? 'page' : undefined}
              className={`nav-item flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 relative select-none ${
                isActive ? 'text-white' : 'text-[#F5F2EA]/65 hover:text-white'
              }`}
            >
              {/* Active Ember Pill (V1) */}
              <div
                className={`px-3 py-1 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-[#C4501F] text-white shadow-[0_2px_10px_rgba(196,80,31,0.5)] scale-105'
                    : 'text-[#F5F2EA]/75'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5]' : 'stroke-[2]'
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] mt-0.5 font-button-s leading-tight transition-colors duration-150 ${
                  isActive ? 'text-white font-bold' : 'text-[#F5F2EA]/65 font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
