import React from 'react';
import { Flame, UtensilsCrossed, Dumbbell, Briefcase, TrendingUp } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'today' as TabType, label: 'Today', icon: Flame, color: 'text-amber-400' },
    { id: 'food' as TabType, label: 'Food', icon: UtensilsCrossed, color: 'text-emerald-400' },
    { id: 'workout' as TabType, label: 'Workout', icon: Dumbbell, color: 'text-cyan-400' },
    { id: 'work' as TabType, label: 'Work', icon: Briefcase, color: 'text-indigo-400' },
    { id: 'dashboard' as TabType, label: 'Progress', icon: TrendingUp, color: 'text-purple-400' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 pt-2 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'text-white font-semibold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-slate-800/90 shadow-sm' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? `${tab.color} scale-110` : 'text-slate-400'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
