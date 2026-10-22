import React from 'react';
import { Flame, UtensilsCrossed, Dumbbell, Briefcase, TrendingUp } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'today' as TabType, label: 'Today', icon: Flame, color: '#1F4E5F', activeIconColor: 'text-[#1F4E5F]' },
    { id: 'food' as TabType, label: 'Food', icon: UtensilsCrossed, color: '#4472C4', activeIconColor: 'text-[#4472C4]' },
    { id: 'workout' as TabType, label: 'Workout', icon: Dumbbell, color: '#D32F2F', activeIconColor: 'text-[#D32F2F]' },
    { id: 'work' as TabType, label: 'Work', icon: Briefcase, color: '#455A64', activeIconColor: 'text-[#455A64]' },
    { id: 'dashboard' as TabType, label: 'Progress', icon: TrendingUp, color: '#1F77B4', activeIconColor: 'text-[#1F77B4]' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#BFBFBF] px-2 pt-2 safe-bottom shadow-lg">
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
                  ? 'text-[#1F4E5F] font-bold'
                  : 'text-[#595959] hover:text-[#1F4E5F]'
              }`}
            >
              <div
                className={`relative p-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-[#EAF2F5]' : ''
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? `${tab.activeIconColor} scale-105 stroke-[2.5]` : 'text-[#595959] stroke-[2]'
                  }`}
                />
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#1F4E5F]"></span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-[#1F4E5F] font-bold' : 'text-[#595959]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
