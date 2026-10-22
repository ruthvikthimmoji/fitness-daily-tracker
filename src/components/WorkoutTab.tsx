import React, { useState } from 'react';
import { Plus, Trash2, Dumbbell, Flame, Clock, Award, Sparkles } from 'lucide-react';
import { WorkoutItem } from '../types';

interface WorkoutTabProps {
  workoutItems: WorkoutItem[];
  onOpenAddModal: (typePreset?: string) => void;
  onDeleteWorkout: (item: WorkoutItem) => void;
  onQuickAdd: (workout: Omit<WorkoutItem, 'date'>) => void;
}

export const WorkoutTab: React.FC<WorkoutTabProps> = ({
  workoutItems,
  onOpenAddModal,
  onDeleteWorkout,
  onQuickAdd
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const workoutTypes = ['Push', 'Pull', 'Legs', 'Cardio', 'Upper', 'Lower', 'Full Body'];

  const totalVolume = workoutItems.reduce((sum, item) => {
    const vol = item.volumeKg || (item.sets || 0) * (item.reps || 0) * (item.weightKg || 0);
    return sum + vol;
  }, 0);

  const totalCaloriesBurned = workoutItems.reduce((sum, item) => sum + (item.caloriesBurned || 0), 0);
  const totalDuration = workoutItems.reduce((sum, item) => sum + (item.durationMin || 0), 0);

  const quickExercises: Omit<WorkoutItem, 'date'>[] = [
    { workoutType: 'Push', exercise: 'Flat Barbell Bench Press', sets: 4, reps: 10, weightKg: 60, caloriesBurned: 150 },
    { workoutType: 'Push', exercise: 'Incline Dumbbell Press', sets: 3, reps: 12, weightKg: 22, caloriesBurned: 100 },
    { workoutType: 'Pull', exercise: 'Barbell Deadlifts', sets: 4, reps: 8, weightKg: 100, caloriesBurned: 220 },
    { workoutType: 'Pull', exercise: 'Lat Pulldowns', sets: 3, reps: 12, weightKg: 55, caloriesBurned: 80 },
    { workoutType: 'Legs', exercise: 'Barbell Back Squats', sets: 4, reps: 10, weightKg: 80, caloriesBurned: 200 },
    { workoutType: 'Cardio', exercise: 'Treadmill Incline Walk', sets: 1, reps: 1, weightKg: 0, durationMin: 30, caloriesBurned: 250 },
  ];

  const filteredItems = activeFilter === 'All'
    ? workoutItems
    : workoutItems.filter(w => w.workoutType.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="space-y-4 pb-24">
      
      {/* 1. Workout Summary Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Today's Workout</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {workoutItems.length > 0 ? (
                <span>{totalVolume.toLocaleString()} <span className="text-sm font-normal text-slate-400">kg volume</span></span>
              ) : (
                'No Workout Yet'
              )}
            </div>
          </div>
          <button
            onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Push')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Exercise</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center space-x-1 text-slate-400 text-xs mb-1">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exercises</span>
            </div>
            <div className="text-lg font-bold text-white">{workoutItems.length}</div>
            <div className="text-[10px] text-slate-400">Logged today</div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center space-x-1 text-slate-400 text-xs mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>Burned</span>
            </div>
            <div className="text-lg font-bold text-orange-400">{totalCaloriesBurned}</div>
            <div className="text-[10px] text-slate-400">kcal burned</div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center space-x-1 text-slate-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Duration</span>
            </div>
            <div className="text-lg font-bold text-white">{totalDuration}m</div>
            <div className="text-[10px] text-slate-400">Total time</div>
          </div>
        </div>
      </div>

      {/* 2. Workout Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...workoutTypes].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all active:scale-95 ${
              activeFilter === filter
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Logged Exercises List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800/80 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-slate-400 mb-3">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">No exercises logged today</div>
            <div className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              Add your sets, reps, and weight. The app automatically calculates volume and syncs to your Workout Log sheet!
            </div>
            <button
              onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Push')}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log {activeFilter !== 'All' ? activeFilter : 'Exercise'}</span>
            </button>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const vol = item.volumeKg || (item.sets || 0) * (item.reps || 0) * (item.weightKg || 0);

            return (
              <div
                key={idx}
                className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-sm flex items-start justify-between gap-3 group hover:border-slate-700 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wide">
                      {item.workoutType}
                    </span>
                    {item.durationMin ? (
                      <span className="text-xs text-slate-400">{item.durationMin} mins</span>
                    ) : null}
                  </div>

                  <div className="text-sm font-bold text-white mt-1.5">{item.exercise}</div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1.5">
                    {item.sets > 0 && item.reps > 0 ? (
                      <span className="font-semibold text-white">
                        {item.sets} sets × {item.reps} reps {item.weightKg > 0 ? `@ ${item.weightKg} kg` : ''}
                      </span>
                    ) : null}

                    {vol > 0 ? (
                      <>
                        <span>•</span>
                        <span className="text-cyan-400 font-bold">{vol.toLocaleString()} kg vol</span>
                      </>
                    ) : null}

                    {item.caloriesBurned ? (
                      <>
                        <span>•</span>
                        <span className="text-orange-400 font-medium">-{item.caloriesBurned} kcal</span>
                      </>
                    ) : null}
                  </div>

                  {item.notes && (
                    <div className="text-[11px] text-slate-500 italic mt-1">{item.notes}</div>
                  )}
                </div>

                <button
                  onClick={() => onDeleteWorkout(item)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Delete exercise"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Popular Exercise Quick Presets */}
      <div className="bg-slate-900/80 rounded-3xl p-4 border border-slate-800">
        <div className="flex items-center space-x-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <div className="text-xs font-bold text-white">Popular Exercises (1-Tap Add)</div>
        </div>

        <div className="space-y-2">
          {quickExercises.map((preset, i) => {
            const vol = (preset.sets || 0) * (preset.reps || 0) * (preset.weightKg || 0);

            return (
              <div
                key={i}
                onClick={() => onQuickAdd(preset)}
                className="flex items-center justify-between p-2.5 bg-slate-800/60 hover:bg-slate-800 rounded-xl cursor-pointer border border-slate-700/40 active:scale-[0.99] transition-all"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{preset.exercise}</div>
                  <div className="text-[10px] text-slate-400">
                    {preset.workoutType} • {preset.sets} × {preset.reps} {preset.weightKg > 0 ? `@ ${preset.weightKg}kg` : ''}
                  </div>
                </div>
                <div className="text-right">
                  {vol > 0 ? (
                    <div className="text-xs font-bold text-cyan-400">+{vol} kg</div>
                  ) : (
                    <div className="text-xs font-bold text-orange-400">+{preset.caloriesBurned} kcal</div>
                  )}
                  <div className="text-[10px] text-slate-400">Tap to log</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
