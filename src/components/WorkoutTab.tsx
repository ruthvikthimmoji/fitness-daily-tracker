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
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#595959]">Workout & Strength</div>
            <div className="text-xl font-black text-[#1F4E5F] mt-0.5">
              {workoutItems.length > 0 ? (
                <span>{totalVolume.toLocaleString()} <span className="text-xs font-semibold text-[#595959]">kg volume</span></span>
              ) : (
                'No Workout Yet'
              )}
            </div>
          </div>
          <button
            onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Push')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1F4E5F] hover:bg-[#163a47] active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Exercise</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center space-x-1 text-[#595959] text-[11px] font-bold mb-1">
              <Award className="w-3.5 h-3.5 text-[#2E75B6]" />
              <span>Exercises</span>
            </div>
            <div className="text-lg font-black text-[#1F4E5F]">{workoutItems.length}</div>
            <div className="text-[10px] text-[#595959]">Logged today</div>
          </div>

          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center space-x-1 text-[#595959] text-[11px] font-bold mb-1">
              <Flame className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>Burned</span>
            </div>
            <div className="text-lg font-black text-[#D32F2F]">{totalCaloriesBurned}</div>
            <div className="text-[10px] text-[#595959]">kcal burned</div>
          </div>

          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center space-x-1 text-[#595959] text-[11px] font-bold mb-1">
              <Clock className="w-3.5 h-3.5 text-[#455A64]" />
              <span>Duration</span>
            </div>
            <div className="text-lg font-black text-[#1F4E5F]">{totalDuration}m</div>
            <div className="text-[10px] text-[#595959]">Total time</div>
          </div>
        </div>
      </div>

      {/* 2. Workout Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...workoutTypes].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all active:scale-95 ${
              activeFilter === filter
                ? 'bg-[#1F4E5F] text-white'
                : 'bg-white text-[#595959] hover:text-[#1F4E5F] border border-[#BFBFBF]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Logged Exercises List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-[#BFBFBF] text-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2F5] mx-auto flex items-center justify-center text-[#D32F2F] mb-2 border border-[#BFBFBF]/60">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-sm font-bold text-[#1F4E5F]">No exercises logged today</div>
            <div className="text-xs text-[#595959] max-w-xs mx-auto mt-1 italic">
              Volume = Sets × Reps × Weight. Flow directly into your Daily Log sheet.
            </div>
            <button
              onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Push')}
              className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1F4E5F] hover:bg-[#163a47] text-white font-bold text-xs rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log {activeFilter !== 'All' ? activeFilter : 'Exercise'}</span>
            </button>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const vol = item.volumeKg || (item.sets || 0) * (item.reps || 0) * (item.weightKg || 0);

            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-3.5 border border-[#BFBFBF] shadow-xs flex items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF2F5] text-[#D32F2F] border border-[#BFBFBF]/60 uppercase tracking-wide">
                      {item.workoutType}
                    </span>
                    {item.durationMin ? (
                      <span className="text-xs text-[#595959]">{item.durationMin} mins</span>
                    ) : null}
                  </div>

                  <div className="text-sm font-bold text-[#1A1A1A] mt-1">{item.exercise}</div>

                  <div className="flex items-center space-x-2.5 text-xs text-[#595959] mt-1">
                    {item.sets > 0 && item.reps > 0 ? (
                      <span className="font-semibold text-[#1A1A1A]">
                        {item.sets} sets × {item.reps} reps {item.weightKg > 0 ? `@ ${item.weightKg} kg` : ''}
                      </span>
                    ) : null}

                    {vol > 0 ? (
                      <>
                        <span>•</span>
                        <strong className="text-[#1F4E5F] font-black">{vol.toLocaleString()} kg volume</strong>
                      </>
                    ) : null}

                    {item.caloriesBurned ? (
                      <>
                        <span>•</span>
                        <span className="text-[#D32F2F] font-bold">-{item.caloriesBurned} kcal</span>
                      </>
                    ) : null}
                  </div>

                  {item.notes && (
                    <div className="text-[11px] text-[#595959] italic mt-1">{item.notes}</div>
                  )}
                </div>

                <button
                  onClick={() => onDeleteWorkout(item)}
                  className="p-1.5 text-[#BFBFBF] hover:text-[#C00000] rounded-md transition-colors"
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
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center space-x-1.5 mb-2.5">
          <Sparkles className="w-4 h-4 text-[#D32F2F]" />
          <div className="text-xs font-bold text-[#1F4E5F]">Popular Exercises (1-Tap Add)</div>
        </div>

        <div className="space-y-1.5">
          {quickExercises.map((preset, i) => {
            const vol = (preset.sets || 0) * (preset.reps || 0) * (preset.weightKg || 0);

            return (
              <div
                key={i}
                onClick={() => onQuickAdd(preset)}
                className="flex items-center justify-between p-2.5 bg-[#EAF2F5] hover:bg-[#dbe7ec] rounded-lg cursor-pointer border border-[#BFBFBF]/70 active:scale-[0.99] transition-all"
              >
                <div>
                  <div className="text-xs font-bold text-[#1A1A1A]">{preset.exercise}</div>
                  <div className="text-[10px] text-[#595959]">
                    {preset.workoutType} • {preset.sets} × {preset.reps} {preset.weightKg > 0 ? `@ ${preset.weightKg}kg` : ''}
                  </div>
                </div>
                <div className="text-right">
                  {vol > 0 ? (
                    <div className="text-xs font-black text-[#1F4E5F]">+{vol} kg</div>
                  ) : (
                    <div className="text-xs font-bold text-[#D32F2F]">+{preset.caloriesBurned} kcal</div>
                  )}
                  <div className="text-[10px] text-[#595959]">Tap to log</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
