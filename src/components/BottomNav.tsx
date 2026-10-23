import React from 'react';
import { Flame, UtensilsCrossed, Dumbbell, Briefcase, Shield, TrendingUp } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'today' as TabType, label: 'Today', icon: Flame },
    { id: 'workout' as TabType, label: 'Workout', icon: Dumbbell },
    { id: 'food' as TabType, label: 'Food', icon: UtensilsCrossed },
    { id: 'work' as TabType, label: 'Work', icon: Briefcase },
    { id: 'vault' as TabType, label: 'Vault', icon: Shield },
    { id: 'dashboard' as TabType, label: 'Stats', icon: TrendingUp },
  ];

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto safe-bottom">
      {/* Modern Floating Frosted Glass Dock */}
      <div className="bg-[#2C2324]/92 backdrop-blur-xl border border-white/10 rounded-2xl px-1.5 py-1.5 shadow-[0_10px_35px_rgba(44,35,36,0.3)] flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-1.5 px-0.5 rounded-xl transition-all duration-200 active:scale-90 relative ${
                isActive
                  ? 'text-white'
                  : 'text-[#EFECE3]/60 hover:text-white'
              }`}
            >
              {/* Active Santiago Orange Glow Pill */}
              <div
                className={`relative px-2 py-1 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  isActive
                    ? 'bg-[#EB5E28] text-white shadow-[0_2px_12px_rgba(235,94,40,0.4)] scale-105'
                    : 'text-[#EFECE3]/70'
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
                className={`text-[10px] mt-0.5 font-display tracking-tight transition-colors duration-150 ${
                  isActive ? 'text-white font-bold' : 'text-[#EFECE3]/60 font-medium'
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
