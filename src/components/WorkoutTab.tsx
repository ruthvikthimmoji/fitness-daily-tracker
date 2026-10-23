import React, { useState } from 'react';
import { Plus, Trash2, Dumbbell, Flame, Clock, Award, Sparkles, Camera, ChevronRight } from 'lucide-react';
import { WorkoutItem } from '../types';
import { SpecimenTrack } from './SpecimenTrack';

interface WorkoutTabProps {
  workoutItems: WorkoutItem[];
  onOpenAddModal: (typePreset?: string) => void;
  onDeleteWorkout: (item: WorkoutItem) => void;
  onQuickAdd: (workout: Omit<WorkoutItem, 'date'>) => void;
  onSelectDetail: (item: WorkoutItem) => void;
  onOpenPhotoUploader: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
}

export const WorkoutTab: React.FC<WorkoutTabProps> = ({
  workoutItems,
  onOpenAddModal,
  onDeleteWorkout,
  onQuickAdd,
  onSelectDetail,
  onOpenPhotoUploader
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
    <div className="space-y-4 pb-28 animate-in fade-in duration-150">
      
      {/* 1. Workout Summary Hero Specimen Card */}
      <div className="specimen-card p-4 border border-[#D8D3C8]">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D3C8]/70">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#EB5E28] font-bold">
              // ARCHIVE // STRENGTH & LOAD
            </div>
            <div className="text-xl font-display font-black text-[#2C2324] uppercase tracking-tight mt-0.5">
              {workoutItems.length > 0 ? (
                <span>{totalVolume.toLocaleString()} <span className="font-mono text-xs font-normal text-[#766754]">KG VOL</span></span>
              ) : (
                'WORKOUT SPECIMEN'
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onOpenPhotoUploader('workout')}
              className="p-2 rounded-xl btn-cold-foam text-[#EB5E28] hover:text-[#2C2324] transition-colors"
              title="Snap Workout Photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Push')}
              className="flex items-center gap-1 px-3.5 py-2 btn-santiago text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log</span>
            </button>
          </div>
        </div>

        {/* 3 Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3">
          <div className="bg-[#EFECE3] rounded-xl p-2.5 border border-[#D8D3C8]">
            <div className="flex items-center space-x-1 font-mono text-[9px] uppercase tracking-wider text-[#766754] mb-0.5">
              <Award className="w-3 h-3 text-[#2C2324]" />
              <span>EXERCISES</span>
            </div>
            <div className="text-lg font-display font-black text-[#2C2324]">{workoutItems.length}</div>
            <div className="font-mono text-[9px] text-[#766754]">Logged today</div>
          </div>

          <div className="bg-[#EFECE3] rounded-xl p-2.5 border border-[#D8D3C8]">
            <div className="flex items-center space-x-1 font-mono text-[9px] uppercase tracking-wider text-[#766754] mb-0.5">
              <Flame className="w-3 h-3 text-[#EB5E28]" />
              <span>BURNED</span>
            </div>
            <div className="text-lg font-display font-black text-[#EB5E28]">+{totalCaloriesBurned}</div>
            <div className="font-mono text-[9px] text-[#766754]">kcal burned</div>
          </div>

          <div className="bg-[#EFECE3] rounded-xl p-2.5 border border-[#D8D3C8]">
            <div className="flex items-center space-x-1 font-mono text-[9px] uppercase tracking-wider text-[#766754] mb-0.5">
              <Clock className="w-3 h-3 text-[#2C2324]" />
              <span>DURATION</span>
            </div>
            <div className="text-lg font-display font-black text-[#2C2324]">{totalDuration}m</div>
            <div className="font-mono text-[9px] text-[#766754]">Total time</div>
          </div>
        </div>
      </div>

      {/* 2. Workout Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...workoutTypes].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold rounded-xl whitespace-nowrap transition-all active:scale-95 ${
              activeFilter === filter
                ? 'bg-[#2C2324] text-white shadow-xs'
                : 'bg-white text-[#766754] hover:text-[#2C2324] border border-[#D8D3C8]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Logged Exercises List (Specimen Cards) */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#D8D3C8] text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#EFECE3] mx-auto flex items-center justify-center text-[#EB5E28] mb-2 border border-[#D8D3C8]">
              <Dumbbell className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="text-sm font-display font-bold text-[#2C2324] uppercase">
              No exercises logged today
            </div>
            <div className="text-xs text-[#766754] max-w-xs mx-auto mt-1 font-sans">
              Log your sets, reps, and load. Tap any entry to view full technical specs or add workout photos.
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Push')}
                className="px-4 py-2.5 btn-santiago text-xs font-display font-bold uppercase tracking-wider rounded-xl shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Log {activeFilter !== 'All' ? activeFilter : 'Exercise'}</span>
              </button>
              <button
                onClick={() => onOpenPhotoUploader('workout')}
                className="px-3.5 py-2.5 btn-cold-foam text-xs font-mono font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#EB5E28]" />
                <span>Photo</span>
              </button>
            </div>
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const vol = item.volumeKg || (item.sets || 0) * (item.reps || 0) * (item.weightKg || 0);

            return (
              <div
                key={idx}
                onClick={() => onSelectDetail(item)}
                className="specimen-card p-3.5 border border-[#D8D3C8] cursor-pointer hover:border-[#EB5E28] transition-all group"
              >
                {/* Top Catalog & Category Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#D8D3C8]/60 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[9px] bg-[#2C2324] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      SPECIMEN #W-0{idx + 1}
                    </span>
                    <span className="font-mono text-[9px] text-[#EB5E28] font-bold uppercase tracking-wide">
                      {item.workoutType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-[#766754] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>SPECS</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteWorkout(item);
                      }}
                      className="text-[#D8D3C8] hover:text-[#EB5E28] p-1 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bold Exercise Title */}
                <h3 className="text-sm font-display font-black text-[#2C2324] uppercase tracking-tight">
                  {item.exercise}
                </h3>

                {/* Specimen Indicator Tracks */}
                <div className="mt-2 space-y-0.5">
                  <SpecimenTrack
                    label="Volume"
                    value={vol.toLocaleString()}
                    unit="KG"
                    percent={Math.min(100, (vol / 3000) * 100)}
                    dotColor="#2C2324"
                  />
                  <SpecimenTrack
                    label="Load"
                    value={item.weightKg}
                    unit="KG"
                    percent={Math.min(100, (item.weightKg / 140) * 100)}
                    dotColor="#EB5E28"
                  />
                  <SpecimenTrack
                    label="Sets × Reps"
                    value={`${item.sets} × ${item.reps}`}
                  />
                </div>

                {item.notes && (
                  <div className="text-[10px] font-sans text-[#766754] italic mt-2 pt-1 border-t border-[#D8D3C8]/40 truncate">
                    {item.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 4. Quick Exercise Presets */}
      <div className="bg-white rounded-2xl p-4 border border-[#D8D3C8] shadow-xs">
        <div className="flex items-center space-x-1.5 mb-2.5">
          <Sparkles className="w-4 h-4 text-[#EB5E28]" />
          <div className="text-xs font-display font-bold uppercase tracking-wider text-[#2C2324]">
            Quick Presets (1-Tap Log)
          </div>
        </div>

        <div className="space-y-1.5">
          {quickExercises.map((preset, i) => {
            const vol = (preset.sets || 0) * (preset.reps || 0) * (preset.weightKg || 0);

            return (
              <div
                key={i}
                onClick={() => onQuickAdd(preset)}
                className="flex items-center justify-between p-2.5 bg-[#EFECE3] hover:bg-[#e6e2d7] rounded-xl cursor-pointer border border-[#D8D3C8] active:scale-[0.99] transition-all"
              >
                <div>
                  <div className="text-xs font-display font-bold text-[#2C2324] uppercase">{preset.exercise}</div>
                  <div className="text-[10px] font-mono text-[#766754]">
                    {preset.workoutType} • {preset.sets} × {preset.reps} {preset.weightKg > 0 ? `@ ${preset.weightKg}kg` : ''}
                  </div>
                </div>
                <div className="text-right">
                  {vol > 0 ? (
                    <div className="text-xs font-display font-black text-[#2C2324]">+{vol} kg</div>
                  ) : (
                    <div className="text-xs font-mono font-bold text-[#EB5E28]">+{preset.caloriesBurned} kcal</div>
                  )}
                  <div className="text-[9px] font-mono text-[#766754] uppercase">Tap to log</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
