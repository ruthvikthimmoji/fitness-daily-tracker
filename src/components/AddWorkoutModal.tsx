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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-800 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Log Workout Exercise</h2>
              <div className="text-[11px] text-slate-400">Syncs to your Workout Log sheet</div>
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
          
          {/* Workout Type */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Workout Split / Type</label>
            <div className="grid grid-cols-4 gap-1.5">
              {workoutTypes.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setWorkoutType(t)}
                  className={`py-2 text-[11px] font-semibold rounded-xl border transition-all ${
                    workoutType === t
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Exercise Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Barbell Bench Press or 5km Run"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Sets, Reps, Weight */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Sets</label>
              <input
                type="number"
                placeholder="4"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Reps</label>
              <input
                type="number"
                placeholder="10"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-cyan-400 block mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                placeholder="kg"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-bold"
              />
            </div>
          </div>

          {/* Volume preview */}
          {calculatedVolume > 0 && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Calculated Volume:</span>
              <span className="text-cyan-400 font-bold text-sm">{calculatedVolume.toLocaleString()} kg</span>
            </div>
          )}

          {/* Cardio / Additional fields */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Duration (min)</label>
              <input
                type="number"
                placeholder="e.g. 45"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-orange-400 block mb-1">Calories Burned</label>
              <input
                type="number"
                placeholder="e.g. 300"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Notes</label>
            <input
              type="text"
              placeholder="e.g. RPE 8, good tempo"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 active:scale-95 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add to Workout Log</span>
          </button>
        </form>

      </div>
    </div>
  );
};
