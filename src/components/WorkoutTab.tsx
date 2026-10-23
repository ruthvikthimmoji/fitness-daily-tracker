import React, { useState } from 'react';
import { Plus, Trash2, Dumbbell, Award, Flame, Clock, ChevronRight } from 'lucide-react';
import { WorkoutItem } from '../types';
import { triggerHaptic } from '../utils/formatters';

interface WorkoutTabProps {
  workoutItems: WorkoutItem[];
  onOpenAddModal: (typePreset?: string) => void;
  onDeleteWorkout: (item: WorkoutItem) => void;
  onQuickAdd: (workout: Omit<WorkoutItem, 'date'>) => void;
  onSelectDetail: (item: WorkoutItem) => void;
  onOpenPhotoUploader?: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
}

export const WorkoutTab: React.FC<WorkoutTabProps> = ({
  workoutItems,
  onOpenAddModal,
  onDeleteWorkout,
  onQuickAdd,
  onSelectDetail
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [showAllPresets, setShowAllPresets] = useState<boolean>(false);

  const workoutTypes = ['Push', 'Pull', 'Legs', 'Cardio', 'Upper', 'Lower', 'Full Body'];

  const totalVolume = workoutItems.reduce((sum, item) => {
    const vol = item.volumeKg || (item.sets || 0) * (item.reps || 0) * (item.weightKg || 0);
    return sum + vol;
  }, 0);

  const totalCaloriesBurned = workoutItems.reduce((sum, item) => sum + (item.caloriesBurned || 0), 0);
  const totalDuration = workoutItems.reduce((sum, item) => sum + (item.durationMin || 0), 0);

  const quickExercises: Omit<WorkoutItem, 'date'>[] = [
    { workoutType: 'Push', exercise: 'Bench press', sets: 4, reps: 10, weightKg: 60, caloriesBurned: 150 },
    { workoutType: 'Push', exercise: 'Incline dumbbell press', sets: 3, reps: 12, weightKg: 22, caloriesBurned: 100 },
    { workoutType: 'Pull', exercise: 'Barbell deadlift', sets: 4, reps: 8, weightKg: 100, caloriesBurned: 220 },
    { workoutType: 'Pull', exercise: 'Lat pulldown', sets: 3, reps: 12, weightKg: 55, caloriesBurned: 80 },
    { workoutType: 'Legs', exercise: 'Barbell back squat', sets: 4, reps: 10, weightKg: 80, caloriesBurned: 200 },
    { workoutType: 'Cardio', exercise: 'Incline treadmill walk', sets: 1, reps: 1, weightKg: 0, durationMin: 30, caloriesBurned: 250 },
  ];

  const visiblePresets = showAllPresets ? quickExercises : quickExercises.slice(0, 4);

  const filteredItems = activeFilter === 'All'
    ? workoutItems
    : workoutItems.filter(w => w.workoutType.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="space-y-3.5 pb-28 animate-in fade-in duration-150 relative">
      
      {/* 1. Summary Strip in One Line (Page 16 Layout Rules) */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#E2DACB] shadow-2xs flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#F5F2EA] text-[#2F6B2A]">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div>
            <div className="font-title text-sm text-[#2B2324]">Training</div>
            <div className="font-caption text-[11px] text-[#5E5444]">
              {totalVolume > 0 ? `${totalVolume.toLocaleString()} kg total volume` : '0 kg volume today'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-right">
          <div>
            <div className="flex items-center space-x-1 font-caption text-[#5E5444] justify-end">
              <Award className="w-3 h-3 text-[#2B2324]" />
              <span>{workoutItems.length} exercises</span>
            </div>
            <div className="flex items-center space-x-2 font-stat text-xs text-[#2B2324] mt-0.5 justify-end">
              {totalCaloriesBurned > 0 && (
                <span className="flex items-center gap-0.5 text-[#C4501F]">
                  <Flame className="w-3 h-3" />
                  <span>+{totalCaloriesBurned} kcal</span>
                </span>
              )}
              {totalDuration > 0 && (
                <span className="flex items-center gap-0.5 text-[#5E5444]">
                  <Clock className="w-3 h-3" />
                  <span>{totalDuration}m</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter Chips Row with Right-Edge Fade (B6) */}
      <div className="chips">
        {['All', ...workoutTypes].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => {
              triggerHaptic(8);
              setActiveFilter(filter);
            }}
            className={`chip px-3 py-1.5 font-button-s text-xs rounded-xl border transition-all ${
              activeFilter === filter
                ? 'bg-[#2B2324] text-white border-[#2B2324] shadow-xs'
                : 'bg-white text-[#5E5444] border-[#E2DACB] hover:bg-[#EEE9DD]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Quick Add Presets First (L7 & Wireframe 7) */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2DACB]/60">
          <span className="font-label text-[11px] text-[#5E5444]">
            QUICK ADD
          </span>
          <button
            type="button"
            onClick={() => setShowAllPresets(!showAllPresets)}
            className="font-button-s text-xs text-[#C4501F] hover:underline"
          >
            {showAllPresets ? 'Show less' : 'See all'}
          </button>
        </div>

        <div className="space-y-2">
          {visiblePresets.map((preset, i) => {
            const vol = (preset.sets || 0) * (preset.reps || 0) * (preset.weightKg || 0);

            return (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-[#F5F2EA] hover:bg-[#EEE9DD] rounded-xl border border-[#E2DACB] transition-colors gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-title text-xs text-[#2B2324] truncate">{preset.exercise}</div>
                  <div className="font-caption text-[11px] text-[#5E5444] mt-0.5">
                    {preset.workoutType} · {preset.sets} × {preset.reps} {preset.weightKg > 0 ? `@ ${preset.weightKg} kg` : ''}
                    {vol > 0 ? ` · ${vol.toLocaleString()} kg` : ''}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic(15);
                    onQuickAdd(preset);
                  }}
                  className="w-8 h-8 rounded-full bg-[#C4501F] hover:bg-[#A83F17] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-90"
                  title={`Log ${preset.exercise}`}
                  aria-label={`Log ${preset.exercise}`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Logged Exercises List */}
      <div className="space-y-2">
        <div className="font-label text-[11px] text-[#5E5444] px-1">
          TODAY'S SESSIONS
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-[#E2DACB] text-center shadow-2xs">
            <p className="font-body-m text-xs text-[#5E5444]">
              Nothing logged yet. Tap + to add an exercise.
            </p>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const vol = item.volumeKg || (item.sets || 0) * (item.reps || 0) * (item.weightKg || 0);

            return (
              <div
                key={idx}
                onClick={() => onSelectDetail(item)}
                className="bg-white rounded-2xl p-3.5 border border-[#E2DACB] cursor-pointer hover:border-[#C4501F] transition-all shadow-2xs group"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E2DACB]/60 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-label text-[10px] bg-[#2B2324] text-white px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <span className="font-label text-[10px] text-[#C4501F]">
                      {item.workoutType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-caption text-[#5E5444] flex items-center gap-0.5 group-hover:text-[#2B2324] transition-colors">
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic(10);
                        onDeleteWorkout(item);
                      }}
                      className="text-[#E2DACB] hover:text-[#B3261E] p-1 transition-colors"
                      title="Delete"
                      aria-label="Delete exercise"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="font-title text-sm text-[#2B2324] font-semibold">
                    {item.exercise}
                  </h3>
                  <span className="font-stat text-xs text-[#2B2324] font-bold">
                    {vol > 0 ? `${vol.toLocaleString()} kg` : ''}
                  </span>
                </div>

                <div className="font-caption text-[#5E5444] mt-1">
                  {item.sets} sets × {item.reps} reps {item.weightKg > 0 ? `@ ${item.weightKg} kg` : ''}
                  {item.durationMin ? ` · ${item.durationMin} min` : ''}
                  {item.caloriesBurned ? ` · ${item.caloriesBurned} kcal` : ''}
                </div>

                {item.notes && (
                  <div className="text-[11px] font-body-s text-[#5E5444] italic mt-1.5 pt-1 border-t border-[#E2DACB]/40 truncate">
                    {item.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. Single Floating Action Button (L5 & Wireframe 9) */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic(15);
          onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Push');
        }}
        className="btn-fab"
        title="Log exercise"
        aria-label="Log exercise"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

    </div>
  );
};
