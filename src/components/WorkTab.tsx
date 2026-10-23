import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Briefcase, CheckCircle2, Clock, Check, ChevronRight, Play, Square } from 'lucide-react';
import { WorkItem } from '../types';
import { triggerHaptic } from '../utils/formatters';

interface WorkTabProps {
  workItems: WorkItem[];
  onOpenAddModal: (categoryPreset?: string) => void;
  onDeleteWork: (item: WorkItem) => void;
  onToggleStatus: (item: WorkItem) => void;
  onQuickAdd: (work: Omit<WorkItem, 'date'>) => void;
  onSelectDetail: (item: WorkItem) => void;
}

export const WorkTab: React.FC<WorkTabProps> = ({
  workItems,
  onOpenAddModal,
  onDeleteWork,
  onToggleStatus,
  onQuickAdd,
  onSelectDetail
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showAllPresets, setShowAllPresets] = useState<boolean>(false);

  // Focus Timer state (Page 16 Layout rule)
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleStopAndLogTimer = () => {
    setTimerRunning(false);
    triggerHaptic(20);
    const hrs = Math.max(0.25, Math.round((timerSeconds / 3600) * 100) / 100);
    onQuickAdd({
      task: 'Focus timer session',
      category: 'Work',
      hours: hrs,
      status: 'Done'
    });
    setTimerSeconds(0);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const categories = ['Work', 'Study', 'Personal Project', 'Errands', 'Reading'];

  const totalHours = workItems.reduce((sum, item) => sum + (item.hours || 0), 0);
  const doneCount = workItems.filter(item => item.status === 'Done').length;

  // Shortened preset names in sentence case (Section 5 Copy changes)
  const quickTasks: Omit<WorkItem, 'date'>[] = [
    { task: 'Deep work: coding', category: 'Work', hours: 2.5, status: 'Done' },
    { task: 'Study: architecture', category: 'Study', hours: 1.5, status: 'Done' },
    { task: 'Side project build', category: 'Personal Project', hours: 2.0, status: 'Done' },
    { task: 'Reading & synthesis', category: 'Reading', hours: 0.75, status: 'Done' },
    { task: 'Planning & review', category: 'Work', hours: 0.5, status: 'Done' },
  ];

  const visiblePresets = showAllPresets ? quickTasks : quickTasks.slice(0, 4);

  const filteredItems = activeCategory === 'All'
    ? workItems
    : workItems.filter(w => w.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-3.5 pb-28 animate-in fade-in duration-150 relative">
      
      {/* 1. Summary Strip in One Line (Page 16) */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#E2DACB] shadow-2xs flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#F5F2EA] text-[#2B2324]">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="font-title text-sm text-[#2B2324]">Productivity</div>
            <div className="font-caption text-[11px] text-[#5E5444]">
              {totalHours > 0 ? `${totalHours} hrs logged today` : 'Focus goal: 4 hrs'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div>
            <div className="flex items-center space-x-1 font-caption text-[#5E5444] justify-end">
              <CheckCircle2 className="w-3 h-3 text-[#2F6B2A]" />
              <span>{doneCount} of {workItems.length || 0} done</span>
            </div>
            <div className="font-stat text-xs text-[#2B2324] mt-0.5">
              Saved to your Sheet
            </div>
          </div>
        </div>
      </div>

      {/* Focus Timer Strip (Page 16 Layout rule) */}
      <div className="bg-white rounded-2xl p-3 border border-[#E2DACB] shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 rounded-lg ${timerRunning ? 'bg-[#FBE8DE] text-[#C4501F]' : 'bg-[#F5F2EA] text-[#5E5444]'}`}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="font-label text-[10px] text-[#5E5444] block">FOCUS TIMER</span>
            <span className="font-timer text-lg text-[#2B2324] font-bold leading-none">
              {formatTimer(timerSeconds)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!timerRunning ? (
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                setTimerRunning(true);
              }}
              className="px-3 py-1.5 btn-ember rounded-xl font-button-s text-xs flex items-center gap-1 shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopAndLogTimer}
              className="px-3 py-1.5 btn-gold-black rounded-xl font-button-s text-xs flex items-center gap-1 shadow-xs"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Stop & Log</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Category Filter Chips with Right-Edge Fade (B6) */}
      <div className="chips">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              triggerHaptic(8);
              setActiveCategory(cat);
            }}
            className={`chip px-3 py-1.5 font-button-s text-xs rounded-xl border transition-all ${
              activeCategory === cat
                ? 'bg-[#2B2324] text-white border-[#2B2324] shadow-xs'
                : 'bg-white text-[#5E5444] border-[#E2DACB] hover:bg-[#EEE9DD]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Quick Add Presets First (L7) */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2DACB]/60">
          <span className="font-label text-[11px] text-[#5E5444]">
            QUICK ADD
          </span>
          <button
            type="button"
            onClick={() => setShowAllPresets(!showAllPresets)}
            className="font-button-s text-xs text-[#C4501F] hover:underline"
          >
            {showAllPresets ? 'Show less' : 'See all'}
          </button>
        </div>

        <div className="space-y-2">
          {visiblePresets.map((preset, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 bg-[#F5F2EA] hover:bg-[#EEE9DD] rounded-xl border border-[#E2DACB] transition-colors gap-2"
            >
              <div className="min-w-0 flex-1">
                <div className="font-title text-xs text-[#2B2324] truncate">{preset.task}</div>
                <div className="font-caption text-[11px] text-[#5E5444] mt-0.5">
                  {preset.category} · {preset.hours} hrs
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  onQuickAdd(preset);
                }}
                className="w-8 h-8 rounded-full bg-[#C4501F] hover:bg-[#A83F17] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-90"
                title={`Log ${preset.task}`}
                aria-label={`Log ${preset.task}`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Logged Tasks List */}
      <div className="space-y-2">
        <div className="font-label text-[11px] text-[#5E5444] px-1">
          TODAY'S TASKS
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-[#E2DACB] text-center shadow-2xs">
            <p className="font-body-m text-xs text-[#5E5444]">
              Nothing logged yet. Tap + to add a task.
            </p>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isDone = item.status === 'Done';

            return (
              <div
                key={idx}
                onClick={() => onSelectDetail(item)}
                className="bg-white rounded-2xl p-3.5 border border-[#E2DACB] cursor-pointer hover:border-[#C4501F] transition-all shadow-2xs group"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E2DACB]/60 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-label text-[10px] bg-[#2B2324] text-white px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <span className="font-label text-[10px] text-[#C4501F]">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-caption text-[#5E5444] flex items-center gap-0.5 group-hover:text-[#2B2324] transition-colors">
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic(10);
                        onDeleteWork(item);
                      }}
                      className="text-[#E2DACB] hover:text-[#B3261E] p-1 transition-colors"
                      title="Delete"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic(15);
                      onToggleStatus(item);
                    }}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                      isDone
                        ? 'bg-[#2B2324] border-[#2B2324] text-white'
                        : 'border-[#E2DACB] hover:border-[#C4501F] bg-white'
                    }`}
                    title="Toggle Status"
                    aria-label="Toggle task completed"
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className={`font-title text-sm truncate ${
                        isDone ? 'text-[#5E5444] line-through' : 'text-[#2B2324]'
                      }`}>
                        {item.task}
                      </h3>
                      <span className="font-stat text-xs text-[#2B2324] font-bold shrink-0">
                        {item.hours} hrs
                      </span>
                    </div>

                    <div className="font-caption text-[#5E5444] mt-0.5">
                      Status: {item.status}
                    </div>

                    {item.notes && (
                      <div className="text-[11px] font-body-s text-[#5E5444] italic mt-1.5 pt-1 border-t border-[#E2DACB]/40 truncate">
                        {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Single Floating Action Button (L5) */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic(15);
          onOpenAddModal(activeCategory !== 'All' ? activeCategory : 'Work');
        }}
        className="btn-fab"
        title="Add task"
        aria-label="Add task"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

    </div>
  );
};
