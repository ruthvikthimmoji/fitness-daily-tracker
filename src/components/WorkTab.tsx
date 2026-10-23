import React, { useState } from 'react';
import { Plus, Trash2, Briefcase, CheckCircle2, Clock, Check, Sparkles, ChevronRight } from 'lucide-react';
import { WorkItem } from '../types';
import { SpecimenTrack } from './SpecimenTrack';

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

  const categories = ['Work', 'Study', 'Personal Project', 'Errands', 'Reading'];

  const totalHours = workItems.reduce((sum, item) => sum + (item.hours || 0), 0);
  const doneCount = workItems.filter(item => item.status === 'Done').length;

  const quickTasks: Omit<WorkItem, 'date'>[] = [
    { task: 'Deep Work: Core system development & coding', category: 'Work', hours: 2.5, status: 'Done' },
    { task: 'Technical Study: Architecture & research', category: 'Study', hours: 1.5, status: 'Done' },
    { task: 'Personal Side Project build', category: 'Personal Project', hours: 2.0, status: 'Done' },
    { task: 'Reading & Knowledge Synthesis', category: 'Reading', hours: 0.75, status: 'Done' },
    { task: 'Daily Strategy, Email & Planning Review', category: 'Work', hours: 0.5, status: 'Done' },
  ];

  const filteredItems = activeCategory === 'All'
    ? workItems
    : workItems.filter(w => w.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-150">
      
      {/* 1. Productivity Summary Specimen Card */}
      <div className="specimen-card p-4 border border-[#D8D3C8]">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D3C8]/70">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#EB5E28] font-bold">
              // ARCHIVE // FOCUS & DAILY OUTPUT
            </div>
            <div className="text-xl font-display font-black text-[#2C2324] uppercase tracking-tight mt-0.5">
              {totalHours} <span className="font-mono text-xs font-normal text-[#766754]">HOURS LOGGED</span>
            </div>
          </div>

          <button
            onClick={() => onOpenAddModal(activeCategory !== 'All' ? activeCategory : 'Work')}
            className="flex items-center gap-1.5 px-3.5 py-2 btn-santiago text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-3">
          <div className="bg-[#EFECE3] rounded-xl p-3 border border-[#D8D3C8]">
            <div className="flex items-center space-x-1.5 font-mono text-[9px] uppercase tracking-wider text-[#766754] mb-1">
              <Clock className="w-3.5 h-3.5 text-[#2C2324]" />
              <span>TIME INVESTED</span>
            </div>
            <div className="text-xl font-display font-black text-[#2C2324]">{totalHours} hrs</div>
            <div className="font-mono text-[9px] text-[#766754]">Syncs to Sheet Column T</div>
          </div>

          <div className="bg-[#EFECE3] rounded-xl p-3 border border-[#D8D3C8]">
            <div className="flex items-center space-x-1.5 font-mono text-[9px] uppercase tracking-wider text-[#766754] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#EB5E28]" />
              <span>TASKS FINISHED</span>
            </div>
            <div className="text-xl font-display font-black text-[#EB5E28]">{doneCount} / {workItems.length}</div>
            <div className="font-mono text-[9px] text-[#766754]">Completed focus items</div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold rounded-xl whitespace-nowrap transition-all active:scale-95 ${
              activeCategory === cat
                ? 'bg-[#2C2324] text-white shadow-xs'
                : 'bg-white text-[#766754] hover:text-[#2C2324] border border-[#D8D3C8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Logged Work Tasks List (Specimen Cards) */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#D8D3C8] text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#EFECE3] mx-auto flex items-center justify-center text-[#2C2324] mb-2 border border-[#D8D3C8]">
              <Briefcase className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="text-sm font-display font-bold text-[#2C2324] uppercase">
              No tasks logged today
            </div>
            <div className="text-xs text-[#766754] max-w-xs mx-auto mt-1 font-sans">
              Track your deep work, study, and daily focus. Hours flow straight to your Daily Log.
            </div>
            <button
              onClick={() => onOpenAddModal(activeCategory !== 'All' ? activeCategory : 'Work')}
              className="mt-4 px-4 py-2.5 btn-santiago text-xs font-display font-bold uppercase tracking-wider rounded-xl shadow-xs inline-flex items-center gap-1.5"
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
                onClick={() => onSelectDetail(item)}
                className="specimen-card p-3.5 border border-[#D8D3C8] cursor-pointer hover:border-[#EB5E28] transition-all group"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#D8D3C8]/60 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[9px] bg-[#2C2324] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      TASK #T-0{idx + 1}
                    </span>
                    <span className="font-mono text-[9px] text-[#EB5E28] font-bold uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-[#766754] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>DETAILS</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteWork(item);
                      }}
                      className="text-[#D8D3C8] hover:text-[#EB5E28] p-1 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Task Item with Interactive Status Toggle */}
                <div className="flex items-start space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(item);
                    }}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                      isDone
                        ? 'bg-[#2C2324] border-[#2C2324] text-[#EB5E28]'
                        : 'border-[#D8D3C8] hover:border-[#EB5E28] bg-white'
                    }`}
                    title="Toggle Status"
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div className="flex-1">
                    <h3 className={`text-sm font-display font-bold uppercase tracking-tight ${
                      isDone ? 'text-[#766754] line-through' : 'text-[#2C2324]'
                    }`}>
                      {item.task}
                    </h3>

                    {/* Specimen Indicator Tracks */}
                    <div className="mt-2 space-y-0.5">
                      <SpecimenTrack
                        label="Hours"
                        value={item.hours}
                        unit="HRS"
                        percent={Math.min(100, (item.hours / 6) * 100)}
                        dotColor="#EB5E28"
                      />
                      <SpecimenTrack
                        label="Status"
                        value={item.status}
                      />
                    </div>

                    {item.notes && (
                      <div className="text-[10px] font-sans text-[#766754] italic mt-2 pt-1 border-t border-[#D8D3C8]/40 truncate">
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

      {/* 4. Quick 1-Tap Task Presets */}
      <div className="bg-white rounded-2xl p-4 border border-[#D8D3C8] shadow-xs">
        <div className="flex items-center space-x-1.5 mb-2.5">
          <Sparkles className="w-4 h-4 text-[#EB5E28]" />
          <div className="text-xs font-display font-bold uppercase tracking-wider text-[#2C2324]">
            Quick Task Presets (1-Tap Log)
          </div>
        </div>

        <div className="space-y-1.5">
          {quickTasks.map((preset, i) => (
            <div
              key={i}
              onClick={() => onQuickAdd(preset)}
              className="flex items-center justify-between p-2.5 bg-[#EFECE3] hover:bg-[#EAE5DE] rounded-xl cursor-pointer border border-[#D8D3C8] active:scale-[0.99] transition-all"
            >
              <div>
                <div className="text-xs font-display font-bold text-[#2C2324] uppercase">{preset.task}</div>
                <div className="text-[10px] font-mono text-[#766754]">{preset.category}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-display font-black text-[#EB5E28]">+{preset.hours} hrs</div>
                <div className="text-[9px] font-mono text-[#766754] uppercase">Tap to log</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
