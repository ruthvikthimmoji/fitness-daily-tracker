import React, { useState } from 'react';
import { X, Dumbbell, Plus } from 'lucide-react';
import { WorkoutItem } from '../types';

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkout: (workout: WorkoutItem) => void;
  selectedDate: string;
  defaultType?: string;
}

export const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({
  isOpen,
  onClose,
  onAddWorkout,
  selectedDate,
  defaultType = 'Push'
}) => {
  const [workoutType, setWorkoutType] = useState<any>(defaultType);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weightKg, setWeightKg] = useState('');
  const [durationMin, setDurationMin] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (defaultType) setWorkoutType(defaultType);
  }, [defaultType]);

  if (!isOpen) return null;

  const workoutTypes = ['Push', 'Pull', 'Legs', 'Cardio', 'Upper', 'Lower', 'Full Body'];

  const numSets = parseFloat(sets) || 0;
  const numReps = parseFloat(reps) || 0;
  const numWeight = parseFloat(weightKg) || 0;
  const calculatedVolume = numSets * numReps * numWeight;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise.trim()) return;

    onAddWorkout({
      date: selectedDate,
      workoutType,
      exercise: exercise.trim(),
      sets: numSets,
      reps: numReps,
      weightKg: numWeight,
      volumeKg: calculatedVolume,
      durationMin: durationMin ? parseFloat(durationMin) : undefined,
      caloriesBurned: caloriesBurned ? parseFloat(caloriesBurned) : undefined,
      notes: notes.trim()
    });

    onClose();
    setExercise('');
    setWeightKg('');
    setDurationMin('');
    setCaloriesBurned('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-[#BFBFBF] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#BFBFBF]/60">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#EAF2F5] text-[#D32F2F] border border-[#BFBFBF]/60">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1F4E5F]">Log Workout Exercise</h2>
              <div className="text-[11px] text-[#595959] italic">Appends to your Workout Log sheet</div>
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
          
          {/* Workout Type */}
          <div>
            <label className="text-xs font-bold text-[#1F4E5F] block mb-1">Workout Split / Type</label>
            <div className="grid grid-cols-4 gap-1">
              {workoutTypes.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setWorkoutType(t)}
                  className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                    workoutType === t
                      ? 'bg-[#1F4E5F] text-white border-[#1F4E5F]'
                      : 'bg-[#EAF2F5] text-[#595959] border-[#BFBFBF] hover:bg-[#dfeaf0]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Name (Sunlight yellow fill) */}
          <div>
            <label className="text-xs font-bold text-[#1F4E5F] block mb-1">Exercise Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Bench Press or Squats"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-3 py-2 text-xs text-[#2E75B6] font-bold placeholder-[#7F7F7F] focus:outline-none focus:border-[#2E75B6]"
            />
          </div>

          {/* Sets, Reps, Weight */}
          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <label className="text-[11px] font-bold text-[#595959] block mb-0.5">Sets</label>
              <input
                type="number"
                placeholder="4"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1.5 text-xs text-[#2E75B6] font-black focus:outline-none focus:border-[#2E75B6]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#595959] block mb-0.5">Reps</label>
              <input
                type="number"
                placeholder="10"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1.5 text-xs text-[#2E75B6] font-black focus:outline-none focus:border-[#2E75B6]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#1F77B4] block mb-0.5">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                placeholder="kg"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1.5 text-xs text-[#2E75B6] font-black focus:outline-none focus:border-[#2E75B6]"
              />
            </div>
          </div>

          {/* Volume preview banner */}
          {calculatedVolume > 0 && (
            <div className="bg-[#EAF2F5] border border-[#BFBFBF] rounded-lg p-2.5 flex items-center justify-between text-xs">
              <span className="text-[#595959] font-medium">Volume (Sets × Reps × Weight):</span>
              <span className="text-[#1F4E5F] font-black text-sm">{calculatedVolume.toLocaleString()} kg</span>
            </div>
          )}

          {/* Cardio / Additional fields */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-[#595959] block mb-0.5">Duration (min)</label>
              <input
                type="number"
                placeholder="e.g. 45"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1.5 text-xs text-[#2E75B6] font-bold focus:outline-none focus:border-[#2E75B6]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#D32F2F] block mb-0.5">Calories Burned</label>
              <input
                type="number"
                placeholder="e.g. 300"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1.5 text-xs text-[#2E75B6] font-bold focus:outline-none focus:border-[#2E75B6]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-[#1F4E5F] block mb-1">Notes</label>
            <input
              type="text"
              placeholder="e.g. RPE 8, felt strong"
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
            <span>Add to Workout Log Sheet</span>
          </button>
        </form>

      </div>
    </div>
  );
};
