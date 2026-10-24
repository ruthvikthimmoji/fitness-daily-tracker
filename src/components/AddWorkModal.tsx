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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-[#E8E3D5] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D5]/70">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#FFFFF0] text-[#FF5B04] border border-[#E8E3D5]">
              <Briefcase className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-label text-[#FF5B04]">
                // ARCHIVE // FOCUS & WORK SPECIMEN
              </div>
              <h2 className="font-h2 text-[#16232B]">
                Log Work / Activity
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#526673] hover:text-[#16232B] rounded-lg hover:bg-[#FFFFF0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-3.5">
          
          {/* Category */}
          <div>
            <label className="font-label text-[#526673] block mb-1">Category</label>
            <div className="grid grid-cols-3 gap-1">
              {categories.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`py-1.5 font-button-s text-xs rounded-xl border transition-all ${
                    category === c
                      ? 'bg-[#16232B] text-white border-[#16232B] shadow-xs'
                      : 'bg-[#FFFFF0] text-[#526673] border-[#E8E3D5] hover:bg-[#EFECE3]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Task / Description */}
          <div>
            <label className="font-label text-[#526673] block mb-1">Task / What I Did *</label>
            <input
              type="text"
              required
              placeholder="e.g. Finish project report"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full bg-white border border-[#E8E3D5] rounded-xl px-3 py-2 font-body-m text-[#16232B] font-bold placeholder-[#526673]/50 focus:outline-none focus:border-[#FF5B04]"
            />
          </div>

          {/* Hours and Status */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-label text-[#526673] block mb-1">Hours Spent</label>
              <input
                type="number"
                step="0.25"
                min="0"
                placeholder="1.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-white border border-[#E8E3D5] rounded-xl px-3 py-1.5 font-stat tabular-nums text-sm text-[#16232B] focus:outline-none focus:border-[#FF5B04]"
              />
            </div>

            <div>
              <label className="font-label text-[#526673] block mb-1">Status</label>
              <div className="flex gap-1">
                {statuses.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-1.5 font-button-s text-xs rounded-xl border transition-all ${
                      status === s
                        ? s === 'Done' ? 'bg-[#16232B] text-white border-[#16232B]' : 'bg-[#FF5B04] text-white border-[#FF5B04]'
                        : 'bg-[#FFFFF0] text-[#526673] border-[#E8E3D5]'
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
            <label className="font-label text-[#526673] block mb-1">Notes (optional)</label>
            <input
              type="text"
              placeholder="e.g. Deep focus session, completed all milestones"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-[#E8E3D5] rounded-xl px-3 py-1.5 font-body-m text-[#16232B] placeholder-[#526673]/50 focus:outline-none focus:border-[#FF5B04]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3 btn-santiago active:scale-95 text-white font-button-l rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add to Work Log Sheet</span>
          </button>
        </form>

      </div>
    </div>
  );
};
