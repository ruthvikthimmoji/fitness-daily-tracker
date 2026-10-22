import React, { useState } from 'react';
import { X, Briefcase, Plus } from 'lucide-react';
import { WorkItem } from '../types';

interface AddWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWork: (work: WorkItem) => void;
  selectedDate: string;
  defaultCategory?: string;
}

export const AddWorkModal: React.FC<AddWorkModalProps> = ({
  isOpen,
  onClose,
  onAddWork,
  selectedDate,
  defaultCategory = 'Work'
}) => {
  const [task, setTask] = useState('');
  const [category, setCategory] = useState<any>(defaultCategory);
  const [hours, setHours] = useState('1.5');
  const [status, setStatus] = useState<any>('Done');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (defaultCategory) setCategory(defaultCategory);
  }, [defaultCategory]);

  if (!isOpen) return null;

  const categories = ['Work', 'Study', 'Personal Project', 'Errands', 'Reading', 'Other'];
  const statuses = ['Done', 'In Progress', 'Planned'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;

    onAddWork({
      date: selectedDate,
      task: task.trim(),
      category,
      hours: parseFloat(hours) || 0,
      status,
      notes: notes.trim()
    });

    onClose();
    setTask('');
    setHours('1.0');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-800 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Log Work / Activity</h2>
              <div className="text-[11px] text-slate-400">Syncs to your Work Log sheet</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Category</label>
            <div className="grid grid-cols-3 gap-1.5">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`py-2 text-[11px] font-semibold rounded-xl border transition-all ${
                    category === c
                      ? 'bg-indigo-500 text-white border-indigo-400 font-bold shadow-md shadow-indigo-500/20'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Task / What I Did */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Task Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. Completed quarterly report presentation"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Hours and Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Hours Spent</label>
              <input
                type="number"
                step="0.25"
                min="0"
                placeholder="1.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Status</label>
              <div className="flex gap-1">
                {statuses.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2 text-[11px] font-bold rounded-xl border transition-all ${
                      status === s
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Notes (optional)</label>
            <input
              type="text"
              placeholder="e.g. Sent via email to team"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add to Work Log</span>
          </button>
        </form>

      </div>
    </div>
  );
};
