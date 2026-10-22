import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, CheckCircle2, Clock, Check, Sparkles } from 'lucide-react';
import { WorkItem } from '../types';

interface WorkTabProps {
  workItems: WorkItem[];
  onOpenAddModal: (categoryPreset?: string) => void;
  onDeleteWork: (item: WorkItem) => void;
  onToggleStatus: (item: WorkItem) => void;
  onQuickAdd: (work: Omit<WorkItem, 'date'>) => void;
}

export const WorkTab: React.FC<WorkTabProps> = ({
  workItems,
  onOpenAddModal,
  onDeleteWork,
  onToggleStatus,
  onQuickAdd
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['Work', 'Study', 'Personal Project', 'Errands', 'Reading'];

  const totalHours = workItems.reduce((sum, item) => sum + (item.hours || 0), 0);
  const doneCount = workItems.filter(item => item.status === 'Done').length;

  const quickTasks: Omit<WorkItem, 'date'>[] = [
    { task: 'Deep Work: Project development & coding', category: 'Work', hours: 2.5, status: 'Done' },
    { task: 'Study: Online Course / Technical tutorial', category: 'Study', hours: 1.5, status: 'Done' },
    { task: 'Book Reading & Notes', category: 'Reading', hours: 0.75, status: 'Done' },
    { task: 'Personal Side Project build', category: 'Personal Project', hours: 2.0, status: 'Done' },
    { task: 'Daily Planning & Task Reviews', category: 'Work', hours: 0.5, status: 'Done' },
  ];

  const filteredItems = activeCategory === 'All'
    ? workItems
    : workItems.filter(w => w.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-4 pb-24">
      
      {/* 1. Productivity Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Productivity Today</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {totalHours} <span className="text-sm font-normal text-slate-400">hours logged</span>
            </div>
          </div>
          <button
            onClick={() => onOpenAddModal(activeCategory !== 'All' ? activeCategory : 'Work')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center space-x-1 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Time Invested</span>
            </div>
            <div className="text-lg font-bold text-white">{totalHours} hrs</div>
            <div className="text-[10px] text-slate-400">Flows to Daily Log</div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center space-x-1 text-slate-400 text-xs mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tasks Done</span>
            </div>
            <div className="text-lg font-bold text-emerald-400">{doneCount} / {workItems.length}</div>
            <div className="text-[10px] text-slate-400">Completed tasks</div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all active:scale-95 ${
              activeCategory === cat
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Logged Work Tasks List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800/80 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-slate-400 mb-3">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">No tasks logged for today</div>
            <div className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              Track everything you work on, study, build, or accomplish today. Hours sync automatically to your Daily Log!
            </div>
            <button
              onClick={() => onOpenAddModal(activeCategory !== 'All' ? activeCategory : 'Work')}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log {activeCategory !== 'All' ? activeCategory : 'Task'}</span>
            </button>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isDone = item.status === 'Done';

            return (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-sm flex items-start justify-between gap-3 group hover:border-slate-700 transition-all"
              >
                <div className="flex items-start space-x-3 flex-1">
                  {/* Status Toggle Checkmark */}
                  <button
                    onClick={() => onToggleStatus(item)}
                    className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-sm'
                        : 'border-slate-600 hover:border-slate-400 bg-slate-800/50'
                    }`}
                    title="Toggle Status"
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wide">
                        {item.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {item.hours} {item.hours === 1 ? 'hour' : 'hours'}
                      </span>
                    </div>

                    <div className={`text-sm font-bold mt-1.5 ${isDone ? 'text-slate-200 line-through opacity-85' : 'text-white'}`}>
                      {item.task}
                    </div>

                    {item.notes && (
                      <div className="text-[11px] text-slate-500 italic mt-1">{item.notes}</div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteWork(item)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Quick Presets */}
      <div className="bg-slate-900/80 rounded-3xl p-4 border border-slate-800">
        <div className="flex items-center space-x-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <div className="text-xs font-bold text-white">Quick Tasks (1-Tap Add)</div>
        </div>

        <div className="space-y-2">
          {quickTasks.map((preset, i) => (
            <div
              key={i}
              onClick={() => onQuickAdd(preset)}
              className="flex items-center justify-between p-2.5 bg-slate-800/60 hover:bg-slate-800 rounded-xl cursor-pointer border border-slate-700/40 active:scale-[0.99] transition-all"
            >
              <div>
                <div className="text-xs font-semibold text-white">{preset.task}</div>
                <div className="text-[10px] text-slate-400">{preset.category} • {preset.hours} hrs</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-indigo-400">+{preset.hours}h</div>
                <div className="text-[10px] text-slate-400">Tap to log</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
