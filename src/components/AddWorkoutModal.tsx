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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-[#E8E3D5] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D5]/70">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#FFFFF0] text-[#FF5B04] border border-[#E8E3D5]">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-label text-[#FF5B04]">
                // ARCHIVE // EXERCISE SPECIMEN
              </div>
              <h2 className="font-h2 text-[#16232B]">
                Log Workout Exercise
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
          
          {/* Workout Type */}
          <div>
            <label className="font-label text-[#526673] block mb-1">Workout Split / Type</label>
            <div className="grid grid-cols-4 gap-1">
              {workoutTypes.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setWorkoutType(t)}
                  className={`py-1.5 font-button-s text-xs rounded-xl border transition-all ${
                    workoutType === t
                      ? 'bg-[#16232B] text-white border-[#16232B] shadow-xs'
                      : 'bg-[#FFFFF0] text-[#526673] border-[#E8E3D5] hover:bg-[#EFECE3]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Name */}
          <div>
            <label className="font-label text-[#526673] block mb-1">Exercise Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Bench Press or Squats"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="w-full bg-white border border-[#E8E3D5] rounded-xl px-3 py-2 font-body-m text-[#16232B] font-bold placeholder-[#526673]/50 focus:outline-none focus:border-[#FF5B04]"
            />
          </div>

          {/* Sets, Reps, Weight */}
          <div className="grid grid-cols-3 gap-1.5">
            <div>
              <label className="font-label text-[#526673] block mb-0.5">Sets</label>
              <input
                type="number"
                placeholder="4"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                className="w-full bg-white border border-[#E8E3D5] rounded-xl px-2.5 py-1.5 font-stat tabular-nums text-sm text-[#16232B] focus:outline-none focus:border-[#FF5B04]"
              />
            </div>
            <div>
              <label className="font-label text-[#526673] block mb-0.5">Reps</label>
              <input
                type="number"
                placeholder="10"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full bg-white border border-[#E8E3D5] rounded-xl px-2.5 py-1.5 font-stat tabular-nums text-sm text-[#16232B] focus:outline-none focus:border-[#FF5B04]"
              />
            </div>
            <div>
              <label className="font-label text-[#FF5B04] block mb-0.5">Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                placeholder="kg"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                className="w-full bg-white border border-[#E8E3D5] rounded-xl px-2.5 py-1.5 font-stat tabular-nums text-sm text-[#16232B] focus:outline-none focus:border-[#FF5B04]"
              />
            </div>
          </div>

          {/* Volume preview banner */}
          {calculatedVolume > 0 && (
            <div className="bg-[#FFFFF0] border border-[#E8E3D5] rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="text-[#526673] font-label">Volume (Sets × Reps × Weight):</span>
              <span className="text-[#16232B] font-score-m tabular-nums">{calculatedVolume.toLocaleString()} kg</span>
            </div>
          )}

          {/* Cardio / Additional fields */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-label text-[#526673] block mb-0.5">Duration (min)</label>
              <input
                type="number"
                placeholder="e.g. 45"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                className="w-full bg-white border border-[#E8E3D5] rounded-xl px-2.5 py-1.5 font-stat tabular-nums text-sm text-[#16232B] focus:outline-none focus:border-[#FF5B04]"
              />
            </div>
            <div>
              <label className="font-label text-[#FF5B04] block mb-0.5">Calories Burned</label>
              <input
                type="number"
                placeholder="e.g. 300"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(e.target.value)}
                className="w-full bg-white border border-[#E8E3D5] rounded-xl px-2.5 py-1.5 font-stat tabular-nums text-sm text-[#16232B] focus:outline-none focus:border-[#FF5B04]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-label text-[#526673] block mb-1">Notes</label>
            <input
              type="text"
              placeholder="e.g. RPE 8, felt strong"
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
            <span>Add to Workout Log Sheet</span>
          </button>
        </form>

      </div>
    </div>
  );
};
