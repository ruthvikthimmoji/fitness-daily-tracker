import React from 'react';
import { LayoutDashboard, Dumbbell, Plus, Briefcase, User } from 'lucide-react';
import { TabType } from '../types';
import { triggerHaptic } from '../utils/formatters';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenEasyLog: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab, onOpenEasyLog }) => {
  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40 max-w-md mx-auto safe-bottom">
      {/* 5-item Frosted Dock in Dark Slate Blue */}
      <div className="bg-[#16232B]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-2 py-1 shadow-[0_8px_30px_rgba(22,35,43,0.35)] flex items-center justify-around relative">
        
        {/* 1. Dashboard */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(12);
            onSelectTab('dashboard');
          }}
          aria-current={currentTab === 'dashboard' || currentTab === 'today' ? 'page' : undefined}
          className={`nav-item flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all select-none ${
            currentTab === 'dashboard' || currentTab === 'today' ? 'text-white' : 'text-[#FFFFF0]/60 hover:text-white'
          }`}
        >
          <div
            className={`px-3 py-1 rounded-xl transition-all duration-200 flex items-center justify-center ${
              currentTab === 'dashboard' || currentTab === 'today'
                ? 'bg-[#FF5B04] text-white shadow-[0_2px_10px_rgba(255,91,4,0.4)] scale-105'
                : 'text-[#FFFFF0]/70'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] mt-0.5 font-button-s leading-tight ${
            currentTab === 'dashboard' || currentTab === 'today' ? 'text-white font-bold' : 'text-[#FFFFF0]/60 font-medium'
          }`}>
            Dashboard
          </span>
        </button>

        {/* 2. Fitness (Workout + Food) */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(12);
            onSelectTab('fitness');
          }}
          aria-current={currentTab === 'fitness' || currentTab === 'workout' || currentTab === 'food' ? 'page' : undefined}
          className={`nav-item flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all select-none ${
            currentTab === 'fitness' || currentTab === 'workout' || currentTab === 'food' ? 'text-white' : 'text-[#FFFFF0]/60 hover:text-white'
          }`}
        >
          <div
            className={`px-3 py-1 rounded-xl transition-all duration-200 flex items-center justify-center ${
              currentTab === 'fitness' || currentTab === 'workout' || currentTab === 'food'
                ? 'bg-[#FF5B04] text-white shadow-[0_2px_10px_rgba(255,91,4,0.4)] scale-105'
                : 'text-[#FFFFF0]/70'
            }`}
          >
            <Dumbbell className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] mt-0.5 font-button-s leading-tight ${
            currentTab === 'fitness' || currentTab === 'workout' || currentTab === 'food' ? 'text-white font-bold' : 'text-[#FFFFF0]/60 font-medium'
          }`}>
            Fitness
          </span>
        </button>

        {/* 3. Center Elevated + Easy Log Action Button */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(18);
              onOpenEasyLog();
            }}
            className="w-12 h-12 rounded-full bg-[#FF5B04] hover:bg-[#E04B00] text-white flex items-center justify-center shadow-[0_4px_18px_rgba(255,91,4,0.5)] border-2 border-white/20 active:scale-90 transition-all group"
            title="Easy Log"
            aria-label="Easy Log"
          >
            <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
          </button>
          <span className="text-[10px] mt-0.5 font-button-s leading-tight text-[#FF5B04] font-bold">
            Log
          </span>
        </div>

        {/* 4. Work (Tasks + Work Stats) */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(12);
            onSelectTab('work');
          }}
          aria-current={currentTab === 'work' ? 'page' : undefined}
          className={`nav-item flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all select-none ${
            currentTab === 'work' ? 'text-white' : 'text-[#FFFFF0]/60 hover:text-white'
          }`}
        >
          <div
            className={`px-3 py-1 rounded-xl transition-all duration-200 flex items-center justify-center ${
              currentTab === 'work'
                ? 'bg-[#FF5B04] text-white shadow-[0_2px_10px_rgba(255,91,4,0.4)] scale-105'
                : 'text-[#FFFFF0]/70'
            }`}
          >
            <Briefcase className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] mt-0.5 font-button-s leading-tight ${
            currentTab === 'work' ? 'text-white font-bold' : 'text-[#FFFFF0]/60 font-medium'
          }`}>
            Work
          </span>
        </button>

        {/* 5. Personal (Vault + Stats + Settings) */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(12);
            onSelectTab('personal');
          }}
          aria-current={currentTab === 'personal' || currentTab === 'vault' ? 'page' : undefined}
          className={`nav-item flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all select-none ${
            currentTab === 'personal' || currentTab === 'vault' ? 'text-white' : 'text-[#FFFFF0]/60 hover:text-white'
          }`}
        >
          <div
            className={`px-3 py-1 rounded-xl transition-all duration-200 flex items-center justify-center ${
              currentTab === 'personal' || currentTab === 'vault'
                ? 'bg-[#FF5B04] text-white shadow-[0_2px_10px_rgba(255,91,4,0.4)] scale-105'
                : 'text-[#FFFFF0]/70'
            }`}
          >
            <User className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] mt-0.5 font-button-s leading-tight ${
            currentTab === 'personal' || currentTab === 'vault' ? 'text-white font-bold' : 'text-[#FFFFF0]/60 font-medium'
          }`}>
            Personal
          </span>
        </button>

      </div>
    </nav>
  );
};
