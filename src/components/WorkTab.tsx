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
    { task: 'Study: Technical course / research', category: 'Study', hours: 1.5, status: 'Done' },
    { task: 'Book Reading & Knowledge Notes', category: 'Reading', hours: 0.75, status: 'Done' },
    { task: 'Personal Side Project build', category: 'Personal Project', hours: 2.0, status: 'Done' },
    { task: 'Daily Planning & Task Reviews', category: 'Work', hours: 0.5, status: 'Done' },
  ];

  const filteredItems = activeCategory === 'All'
    ? workItems
    : workItems.filter(w => w.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-4 pb-24">
      
      {/* 1. Productivity Summary Card */}
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#595959]">Daily Work & Tasks</div>
            <div className="text-xl font-black text-[#1F4E5F] mt-0.5">
              {totalHours} <span className="text-xs font-semibold text-[#595959]">hours logged</span>
            </div>
          </div>
          <button
            onClick={() => onOpenAddModal(activeCategory !== 'All' ? activeCategory : 'Work')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1F4E5F] hover:bg-[#163a47] active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center space-x-1 text-[#595959] text-[11px] font-bold mb-1">
              <Clock className="w-3.5 h-3.5 text-[#455A64]" />
              <span>Time Invested</span>
            </div>
            <div className="text-lg font-black text-[#1F4E5F]">{totalHours} hrs</div>
            <div className="text-[10px] text-[#595959]">Flows to Daily Log</div>
          </div>

          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center space-x-1 text-[#595959] text-[11px] font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Tasks Done</span>
            </div>
            <div className="text-lg font-black text-[#2E7D32]">{doneCount} / {workItems.length}</div>
            <div className="text-[10px] text-[#595959]">Completed tasks</div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all active:scale-95 ${
              activeCategory === cat
                ? 'bg-[#1F4E5F] text-white'
                : 'bg-white text-[#595959] hover:text-[#1F4E5F] border border-[#BFBFBF]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Logged Work Tasks List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-[#BFBFBF] text-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2F5] mx-auto flex items-center justify-center text-[#455A64] mb-2 border border-[#BFBFBF]/60">
              <Briefcase className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-sm font-bold text-[#1F4E5F]">No tasks logged today</div>
            <div className="text-xs text-[#595959] max-w-xs mx-auto mt-1 italic">
              Track work, study, and daily focus. Hours sync directly to your Daily Log sheet.
            </div>
            <button
              onClick={() => onOpenAddModal(activeCategory !== 'All' ? activeCategory : 'Work')}
              className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1F4E5F] hover:bg-[#163a47] text-white font-bold text-xs rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log {activeCategory !== 'All' ? activeCategory : 'Task'}</span>
            </button>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const isDone = item.status === 'Done';

            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-3.5 border border-[#BFBFBF] shadow-xs flex items-start justify-between gap-3"
              >
                <div className="flex items-start space-x-2.5 flex-1">
                  {/* Status Toggle Checkbox */}
                  <button
                    onClick={() => onToggleStatus(item)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-[#C6EFCE] border-[#2E7D32] text-[#2E7D32]'
                        : 'border-[#BFBFBF] hover:border-[#2E75B6] bg-white'
                    }`}
                    title="Toggle Status"
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF2F5] text-[#455A64] border border-[#BFBFBF]/60 uppercase tracking-wide">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-[#2E75B6]">
                        {item.hours} {item.hours === 1 ? 'hour' : 'hours'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          isDone
                            ? 'bg-[#C6EFCE] text-[#2E7D32]'
                            : 'bg-[#FFEB9C] text-[#7F6000]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className={`text-sm font-bold mt-1 ${isDone ? 'text-[#595959] line-through' : 'text-[#1A1A1A]'}`}>
                      {item.task}
                    </div>

                    {item.notes && (
                      <div className="text-[11px] text-[#595959] italic mt-1">{item.notes}</div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteWork(item)}
                  className="p-1.5 text-[#BFBFBF] hover:text-[#C00000] rounded-md transition-colors"
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
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center space-x-1.5 mb-2.5">
          <Sparkles className="w-4 h-4 text-[#455A64]" />
          <div className="text-xs font-bold text-[#1F4E5F]">Quick Tasks (1-Tap Add)</div>
        </div>

        <div className="space-y-1.5">
          {quickTasks.map((preset, i) => (
            <div
              key={i}
              onClick={() => onQuickAdd(preset)}
              className="flex items-center justify-between p-2.5 bg-[#EAF2F5] hover:bg-[#dbe7ec] rounded-lg cursor-pointer border border-[#BFBFBF]/70 active:scale-[0.99] transition-all"
            >
              <div>
                <div className="text-xs font-bold text-[#1A1A1A]">{preset.task}</div>
                <div className="text-[10px] text-[#595959]">{preset.category} • {preset.hours} hrs</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-[#455A64]">+{preset.hours}h</div>
                <div className="text-[10px] text-[#595959]">Tap to log</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
