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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-[#BFBFBF] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#BFBFBF]/60">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#EAF2F5] text-[#455A64] border border-[#BFBFBF]/60">
              <Briefcase className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1F4E5F]">Log Work / Activity</h2>
              <div className="text-[11px] text-[#595959] italic">Appends row to your Work Log sheet</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#595959] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EAF2F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-3.5">
          
          {/* Category */}
          <div>
            <label className="text-xs font-bold text-[#1F4E5F] block mb-1">Category</label>
            <div className="grid grid-cols-3 gap-1">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                    category === c
                      ? 'bg-[#1F4E5F] text-white border-[#1F4E5F]'
                      : 'bg-[#EAF2F5] text-[#595959] border-[#BFBFBF] hover:bg-[#dfeaf0]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Task / Description (Sunlight yellow fill) */}
          <div>
            <label className="text-xs font-bold text-[#1F4E5F] block mb-1">Task / What I Did *</label>
            <input
              type="text"
              required
              placeholder="e.g. Finish project report"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-3 py-2 text-xs text-[#2E75B6] font-bold placeholder-[#7F7F7F] focus:outline-none focus:border-[#2E75B6]"
            />
          </div>

          {/* Hours and Status */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-[#1F4E5F] block mb-1">Hours Spent</label>
              <input
                type="number"
                step="0.25"
                min="0"
                placeholder="1.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-3 py-1.5 text-xs text-[#2E75B6] font-black focus:outline-none focus:border-[#2E75B6]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#1F4E5F] block mb-1">Status</label>
              <div className="flex gap-1">
                {statuses.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      status === s
                        ? s === 'Done' ? 'bg-[#C6EFCE] text-[#2E7D32] border-[#2E7D32]' : 'bg-[#FFEB9C] text-[#7F6000] border-[#7F6000]'
                        : 'bg-[#EAF2F5] text-[#595959] border-[#BFBFBF]'
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
            <label className="text-xs font-bold text-[#1F4E5F] block mb-1">Notes (optional)</label>
            <input
              type="text"
              placeholder="e.g. Sent via email"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-3 py-1.5 text-xs text-[#2E75B6] font-bold placeholder-[#7F7F7F] focus:outline-none focus:border-[#2E75B6]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-2.5 bg-[#1F4E5F] hover:bg-[#163a47] active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add to Work Log Sheet</span>
          </button>
        </form>

      </div>
    </div>
  );
};
