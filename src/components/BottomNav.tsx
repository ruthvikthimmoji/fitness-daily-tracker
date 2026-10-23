import React from 'react';
import { Flame, UtensilsCrossed, Dumbbell, Shield, TrendingUp } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'today' as TabType, label: 'Today', icon: Flame, tag: 'LOG' },
    { id: 'workout' as TabType, label: 'Workout', icon: Dumbbell, tag: 'WOD' },
    { id: 'food' as TabType, label: 'Food', icon: UtensilsCrossed, tag: 'FUEL' },
    { id: 'vault' as TabType, label: 'Vault', icon: Shield, tag: 'LOCK' },
    { id: 'dashboard' as TabType, label: 'Stats', icon: TrendingUp, tag: 'DATA' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#D9D1CA] px-2 pt-2 safe-bottom shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-1 px-1 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-[#0B369A] font-bold'
                  : 'text-[#6E6A63] hover:text-[#141414]'
              }`}
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#F3EFEA]' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'text-[#0B369A] scale-105 stroke-[2.5]' : 'text-[#6E6A63] stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#C34811]"></span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 font-mono uppercase tracking-tight ${isActive ? 'text-[#0B369A] font-bold' : 'text-[#6E6A63]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
