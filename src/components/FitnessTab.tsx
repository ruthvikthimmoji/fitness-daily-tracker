import React, { useState } from 'react';
import { Dumbbell, UtensilsCrossed, BarChart3, Plus, Trash2, Award, Flame, ChevronRight, Target, TrendingUp } from 'lucide-react';
import { WorkoutItem, FoodItem, UserSettings, DailyHistoryItem } from '../types';
import { triggerHaptic } from '../utils/formatters';

interface FitnessTabProps {
  workoutItems: WorkoutItem[];
  foodItems: FoodItem[];
  settings: UserSettings;
  history?: DailyHistoryItem[];
  onOpenAddWorkoutModal: (preset?: string) => void;
  onOpenAddFoodModal: (preset?: string) => void;
  onDeleteWorkout: (item: WorkoutItem) => void;
  onDeleteFood: (item: FoodItem) => void;
  onQuickAddWorkout: (workout: Omit<WorkoutItem, 'date'>) => void;
  onQuickAddFood: (food: Omit<FoodItem, 'date'>) => void;
  onSelectWorkoutDetail: (item: WorkoutItem) => void;
  onSelectFoodDetail: (item: FoodItem) => void;
  onOpenPhotoUploader?: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
  onShowToast: (msg: string, actionLabel?: string, onAction?: () => void) => void;
}

export const FitnessTab: React.FC<FitnessTabProps> = ({
  workoutItems,
  foodItems,
  settings,
  history = [],
  onOpenAddWorkoutModal,
  onOpenAddFoodModal,
  onDeleteWorkout,
  onDeleteFood,
  onQuickAddWorkout,
  onQuickAddFood,
  onSelectWorkoutDetail,
  onSelectFoodDetail,
  onOpenPhotoUploader: _onOpenPhotoUploader,
  onShowToast
}) => {
  // Top Segmented control: Training vs Nutrition vs Stats
  const [activeSegment, setActiveSegment] = useState<'training' | 'nutrition' | 'stats'>('training');

  // Training state
  const [workoutFilter, setWorkoutFilter] = useState<string>('All');
  const [showAllWorkoutPresets, setShowAllWorkoutPresets] = useState<boolean>(false);

  // Nutrition state
  const [foodFilter, setFoodFilter] = useState<string>('All');
  const [showAllFoodPresets, setShowAllFoodPresets] = useState<boolean>(false);

  // Stats range
  const [statsTimeframe, setStatsTimeframe] = useState<'7D' | '14D' | '30D'>('7D');

  // --------------------------------------------------------------------------
  // WORKOUT CALCULATIONS
  // --------------------------------------------------------------------------
  const totalVolume = workoutItems.reduce((sum, item) => {
    const vol = item.volumeKg || (item.sets || 0) * (item.reps || 0) * (item.weightKg || 0);
    return sum + vol;
  }, 0);
  const totalWorkoutCalories = workoutItems.reduce((sum, item) => sum + (item.caloriesBurned || 0), 0);
  const totalWorkoutDuration = workoutItems.reduce((sum, item) => sum + (item.durationMin || 0), 0);

  const quickExercises: Omit<WorkoutItem, 'date'>[] = [
    { workoutType: 'Push', exercise: 'Bench press', sets: 4, reps: 10, weightKg: 60, caloriesBurned: 150 },
    { workoutType: 'Push', exercise: 'Incline dumbbell press', sets: 3, reps: 12, weightKg: 22, caloriesBurned: 100 },
    { workoutType: 'Pull', exercise: 'Barbell deadlift', sets: 4, reps: 8, weightKg: 100, caloriesBurned: 220 },
    { workoutType: 'Pull', exercise: 'Lat pulldown', sets: 3, reps: 12, weightKg: 55, caloriesBurned: 80 },
    { workoutType: 'Legs', exercise: 'Barbell back squat', sets: 4, reps: 10, weightKg: 80, caloriesBurned: 200 },
    { workoutType: 'Cardio', exercise: 'Incline treadmill walk', sets: 1, reps: 1, weightKg: 0, durationMin: 30, caloriesBurned: 250 },
  ];
  const visibleWorkoutPresets = showAllWorkoutPresets ? quickExercises : quickExercises.slice(0, 4);

  const filteredWorkouts = workoutFilter === 'All'
    ? workoutItems
    : workoutItems.filter(w => w.workoutType.toLowerCase() === workoutFilter.toLowerCase());

  // --------------------------------------------------------------------------
  // FOOD CALCULATIONS
  // --------------------------------------------------------------------------
  const totalCalories = foodItems.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = foodItems.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = foodItems.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFat = foodItems.reduce((sum, item) => sum + (item.fat || 0), 0);

  const calTarget = settings.dailyCalorieTarget || 2200;
  const proTarget = settings.dailyProteinTarget || 130;

  const quickMeals: Omit<FoodItem, 'date'>[] = [
    { meal: 'Breakfast', foodItem: 'Oats with milk & banana', quantity: '1 bowl', calories: 380, protein: 14, carbs: 65, fat: 7 },
    { meal: 'Snacks', foodItem: 'Whey protein shake', quantity: '1 scoop (30 g)', calories: 120, protein: 25, carbs: 2, fat: 1.5 },
    { meal: 'Lunch', foodItem: 'Grilled chicken & rice', quantity: '200 g chicken + 1 cup rice', calories: 520, protein: 40, carbs: 55, fat: 8 },
    { meal: 'Breakfast', foodItem: '3 large eggs', quantity: '3 eggs', calories: 210, protein: 18, carbs: 1.5, fat: 15 },
    { meal: 'Snacks', foodItem: 'Greek yogurt & almonds', quantity: '150 g yogurt + 15 g nuts', calories: 220, protein: 18, carbs: 10, fat: 12 },
  ];
  const visibleFoodPresets = showAllFoodPresets ? quickMeals : quickMeals.slice(0, 4);

  const filteredFood = foodFilter === 'All'
    ? foodItems
    : foodItems.filter(f => f.meal.toLowerCase() === foodFilter.toLowerCase());

  // --------------------------------------------------------------------------
  // STATS CALCULATIONS
  // --------------------------------------------------------------------------
  const daysLimit = statsTimeframe === '7D' ? 7 : statsTimeframe === '14D' ? 14 : 30;
  const recentHistory = history.slice(-daysLimit);

  // Group workout volume over history
  const maxVolume = Math.max(1, ...recentHistory.map(h => h.workoutVolume || 0), totalVolume);
  const totalHistoryVolume = recentHistory.reduce((sum, h) => sum + (h.workoutVolume || 0), 0) + (totalVolume > 0 ? totalVolume : 0);
  const activeWorkoutDays = recentHistory.filter(h => (h.workoutVolume || 0) > 0).length + (workoutItems.length > 0 ? 1 : 0);

  // Exercise category counts
  const categoryCounts: Record<string, number> = {};
  workoutItems.forEach(w => {
    const t = w.workoutType || 'Other';
    categoryCounts[t] = (categoryCounts[t] || 0) + 1;
  });

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-150 relative">
      
      {/* 1. TOP SEGMENTED CONTROL: Training | Nutrition | Stats */}
      <div className="bg-white rounded-2xl p-1.5 border border-[#CADCE0] shadow-xs flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveSegment('training');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-button-s text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'training'
              ? 'bg-[#FF5B04] text-white shadow-sm font-bold'
              : 'text-[#526673] hover:text-[#16232B] hover:bg-[#E4EEF0]'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Training</span>
          {workoutItems.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeSegment === 'training' ? 'bg-white/25 text-white' : 'bg-[#E4EEF0] text-[#16232B]'
            }`}>
              {workoutItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveSegment('nutrition');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-button-s text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'nutrition'
              ? 'bg-[#075056] text-white shadow-sm font-bold'
              : 'text-[#526673] hover:text-[#16232B] hover:bg-[#E4EEF0]'
          }`}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Nutrition</span>
          {foodItems.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              activeSegment === 'nutrition' ? 'bg-white/25 text-white' : 'bg-[#E4EEF0] text-[#16232B]'
            }`}>
              {foodItems.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveSegment('stats');
          }}
          className={`flex-1 py-2 px-3 rounded-xl font-button-s text-xs transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'stats'
              ? 'bg-[#16232B] text-white shadow-sm font-bold'
              : 'text-[#526673] hover:text-[#16232B] hover:bg-[#E4EEF0]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Stats</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* SECTION A: TRAINING LOGGING VIEW                                     */}
      {/* ==================================================================== */}
      {activeSegment === 'training' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          
          {/* Summary Strip */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#CADCE0] shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#FFF0E8] text-[#FF5B04]">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <div className="font-title text-sm text-[#16232B]">Training</div>
                <div className="font-caption text-[11px] text-[#526673]">
                  {totalVolume > 0 ? `${totalVolume.toLocaleString()} kg total volume` : '0 kg volume today'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-right">
              <div>
                <div className="flex items-center space-x-1 font-caption text-[#526673] justify-end">
                  <Award className="w-3 h-3 text-[#16232B]" />
                  <span className="font-button-s text-xs text-[#16232B]">
                    {workoutItems.length} {workoutItems.length === 1 ? 'exercise' : 'exercises'}
                  </span>
                </div>
                {totalWorkoutCalories > 0 && (
                  <div className="flex items-center space-x-1 font-caption text-[11px] text-[#FF5B04] justify-end mt-0.5">
                    <Flame className="w-3 h-3" />
                    <span>~{totalWorkoutCalories} kcal burned</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Add Presets First */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#CADCE0] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label text-[10px] text-[#526673] tracking-wider uppercase">
                Quick Add Presets
              </span>
              <button
                type="button"
                onClick={() => setShowAllWorkoutPresets(!showAllWorkoutPresets)}
                className="font-button-s text-xs text-[#FF5B04] hover:underline"
              >
                {showAllWorkoutPresets ? 'Show less' : 'View all'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {visibleWorkoutPresets.map((preset, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-[#CADCE0] bg-[#E4EEF0]/40 hover:bg-[#E4EEF0] transition-colors flex items-center justify-between gap-1.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-caption text-[11px] text-[#FF5B04] font-bold">
                      {preset.workoutType}
                    </div>
                    <div className="font-title text-xs text-[#16232B] truncate" title={preset.exercise}>
                      {preset.exercise}
                    </div>
                    <div className="font-caption text-[10px] text-[#526673] truncate">
                      {preset.sets} × {preset.reps} · {preset.weightKg} kg
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(15);
                      onQuickAddWorkout(preset);
                      onShowToast(`Logged ${preset.exercise}`, 'UNDO', () => {});
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-[#CADCE0] hover:border-[#FF5B04] hover:bg-[#FFF0E8] text-[#16232B] hover:text-[#FF5B04] flex items-center justify-center shrink-0 transition-transform active:scale-90"
                    title={`Quick add ${preset.exercise}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="chips flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Push', 'Pull', 'Legs', 'Cardio', 'Upper', 'Lower'].map((cat) => {
              const isSel = workoutFilter.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setWorkoutFilter(cat);
                  }}
                  className={`chip px-3 py-1.5 rounded-xl font-button-s text-xs transition-all whitespace-nowrap ${
                    isSel
                      ? 'bg-[#16232B] text-white shadow-xs font-bold'
                      : 'bg-white text-[#526673] border border-[#CADCE0] hover:border-[#16232B]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Workout Items List */}
          {filteredWorkouts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#CADCE0] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0E8] text-[#FF5B04] flex items-center justify-center mx-auto">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div className="font-title text-sm text-[#16232B]">No workouts logged yet</div>
              <p className="font-caption text-xs text-[#526673] max-w-xs mx-auto">
                Tap presets above or use the floating Log button below to record your training session.
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(12);
                  onOpenAddWorkoutModal();
                }}
                className="px-4 py-2 rounded-xl bg-[#FF5B04] text-white font-button-s text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Exercise</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredWorkouts.map((item, idx) => {
                const vol = item.volumeKg || (item.sets || 0) * (item.reps || 0) * (item.weightKg || 0);
                return (
                  <div
                    key={item.rowIndex || idx}
                    onClick={() => {
                      triggerHaptic(10);
                      onSelectWorkoutDetail(item);
                    }}
                    className="bg-white rounded-2xl p-3.5 border border-[#CADCE0] hover:border-[#16232B] transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 rounded-xl bg-[#E4EEF0] text-[#16232B] group-hover:bg-[#FF5B04] group-hover:text-white transition-colors">
                        <Dumbbell className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-title text-sm text-[#16232B] truncate">{item.exercise}</span>
                          <span className="font-label text-[9px] px-1.5 py-0.5 rounded-md bg-[#FFF0E8] text-[#FF5B04]">
                            {item.workoutType}
                          </span>
                        </div>
                        <div className="font-caption text-[11px] text-[#526673] mt-0.5">
                          {item.sets} sets × {item.reps} reps · {item.weightKg} kg
                          {vol > 0 && ` (${vol.toLocaleString()} kg)`}
                          {item.durationMin ? ` · ${item.durationMin} min` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          triggerHaptic(10);
                          onDeleteWorkout(item);
                        }}
                        className="p-1.5 text-[#526673] hover:text-[#D32F2F] rounded-lg hover:bg-[#E4EEF0] transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-[#CADCE0] group-hover:text-[#16232B] transition-colors" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating Log Workout Button */}
          <div className="fixed bottom-20 right-4 z-30">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                onOpenAddWorkoutModal();
              }}
              className="px-4 py-3 rounded-full bg-[#FF5B04] text-white font-button-s text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Exercise</span>
            </button>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION B: NUTRITION LOGGING VIEW                                    */}
      {/* ==================================================================== */}
      {activeSegment === 'nutrition' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          
          {/* Summary Strip */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#CADCE0] shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#E6F2F3] text-[#075056]">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <div className="font-score-m text-base text-[#16232B]">
                  {totalCalories.toLocaleString()} <span className="font-caption text-[#526673]">/ {calTarget.toLocaleString()} kcal</span>
                </div>
                <div className="font-caption text-[11px] text-[#526673] mt-0.5">
                  Protein {totalProtein}g · Carbs {totalCarbs}g · Fat {totalFat}g
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-caption text-[11px] text-[#075056] font-bold">
                {proTarget > 0 ? `${Math.round((totalProtein / proTarget) * 100)}% Protein` : ''}
              </div>
              <div className="font-caption text-[10px] text-[#526673] mt-0.5">
                {foodItems.length} {foodItems.length === 1 ? 'item' : 'items'} logged
              </div>
            </div>
          </div>

          {/* Quick Add Presets First */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#CADCE0] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label text-[10px] text-[#526673] tracking-wider uppercase">
                Quick Add Presets
              </span>
              <button
                type="button"
                onClick={() => setShowAllFoodPresets(!showAllFoodPresets)}
                className="font-button-s text-xs text-[#075056] hover:underline"
              >
                {showAllFoodPresets ? 'Show less' : 'View all'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {visibleFoodPresets.map((preset, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-[#CADCE0] bg-[#E4EEF0]/40 hover:bg-[#E4EEF0] transition-colors flex items-center justify-between gap-1.5"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-caption text-[11px] text-[#075056] font-bold">
                      {preset.meal}
                    </div>
                    <div className="font-title text-xs text-[#16232B] truncate" title={preset.foodItem}>
                      {preset.foodItem}
                    </div>
                    <div className="font-caption text-[10px] text-[#526673] truncate">
                      {preset.calories} kcal · {preset.protein}g P
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(15);
                      onQuickAddFood(preset);
                      onShowToast(`Logged ${preset.foodItem}`, 'UNDO', () => {});
                    }}
                    className="w-7 h-7 rounded-lg bg-white border border-[#CADCE0] hover:border-[#075056] hover:bg-[#E6F2F3] text-[#16232B] hover:text-[#075056] flex items-center justify-center shrink-0 transition-transform active:scale-90"
                    title={`Quick add ${preset.foodItem}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Meal Filter Chips */}
          <div className="chips flex space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => {
              const isSel = foodFilter.toLowerCase() === meal.toLowerCase();
              return (
                <button
                  key={meal}
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setFoodFilter(meal);
                  }}
                  className={`chip px-3 py-1.5 rounded-xl font-button-s text-xs transition-all whitespace-nowrap ${
                    isSel
                      ? 'bg-[#075056] text-white shadow-xs font-bold'
                      : 'bg-white text-[#526673] border border-[#CADCE0] hover:border-[#075056]'
                  }`}
                >
                  {meal}
                </button>
              );
            })}
          </div>

          {/* Food Items List */}
          {filteredFood.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 border border-[#CADCE0] text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E6F2F3] text-[#075056] flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div className="font-title text-sm text-[#16232B]">No meals logged yet</div>
              <p className="font-caption text-xs text-[#526673] max-w-xs mx-auto">
                Tap presets above or use the floating Log button below to record your food and calories.
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic(12);
                  onOpenAddFoodModal();
                }}
                className="px-4 py-2 rounded-xl bg-[#075056] text-white font-button-s text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Meal</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFood.map((item, idx) => (
                <div
                  key={item.rowIndex || idx}
                  onClick={() => {
                    triggerHaptic(10);
                    onSelectFoodDetail(item);
                  }}
                  className="bg-white rounded-2xl p-3.5 border border-[#CADCE0] hover:border-[#16232B] transition-all flex items-center justify-between cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-[#E4EEF0] text-[#16232B] group-hover:bg-[#075056] group-hover:text-white transition-colors">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-title text-sm text-[#16232B] truncate">{item.foodItem}</span>
                        <span className="font-label text-[9px] px-1.5 py-0.5 rounded-md bg-[#E6F2F3] text-[#075056]">
                          {item.meal}
                        </span>
                      </div>
                      <div className="font-caption text-[11px] text-[#526673] mt-0.5">
                        {item.calories} kcal · {item.protein}g P · {item.carbs}g C · {item.fat}g F
                        {item.quantity ? ` · ${item.quantity}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerHaptic(10);
                        onDeleteFood(item);
                      }}
                      className="p-1.5 text-[#526673] hover:text-[#D32F2F] rounded-lg hover:bg-[#E4EEF0] transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-[#CADCE0] group-hover:text-[#16232B] transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Floating Log Food Button */}
          <div className="fixed bottom-20 right-4 z-30">
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                onOpenAddFoodModal();
              }}
              className="px-4 py-3 rounded-full bg-[#075056] text-white font-button-s text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Meal</span>
            </button>
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* SECTION C: DEDICATED WORKOUT & FITNESS STATS                          */}
      {/* ==================================================================== */}
      {activeSegment === 'stats' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Timeframe Selector */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-h2 text-base text-[#16232B]">Workout Analytics</h2>
              <p className="font-caption text-xs text-[#526673]">Volume, consistency & performance</p>
            </div>
            <div className="flex rounded-xl bg-white border border-[#CADCE0] p-0.5 text-xs">
              {(['7D', '14D', '30D'] as const).map(tf => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => {
                    triggerHaptic(8);
                    setStatsTimeframe(tf);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-button-s transition-all ${
                    statsTimeframe === tf
                      ? 'bg-[#FF5B04] text-white font-bold'
                      : 'text-[#526673] hover:text-[#16232B]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white rounded-2xl p-3 border border-[#CADCE0] shadow-2xs">
              <div className="font-caption text-[11px] text-[#526673]">Total Volume</div>
              <div className="font-score-m text-base text-[#FF5B04] mt-1">
                {totalHistoryVolume > 0 ? `${(totalHistoryVolume / 1000).toFixed(1)}k` : '0'} <span className="text-[10px] text-[#526673]">kg</span>
              </div>
              <div className="font-caption text-[10px] text-[#526673] mt-0.5">In {daysLimit} days</div>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#CADCE0] shadow-2xs">
              <div className="font-caption text-[11px] text-[#526673]">Active Days</div>
              <div className="font-score-m text-base text-[#075056] mt-1">
                {activeWorkoutDays} <span className="text-[10px] text-[#526673]">/ {daysLimit}</span>
              </div>
              <div className="font-caption text-[10px] text-[#526673] mt-0.5">
                {Math.round((activeWorkoutDays / daysLimit) * 100)}% frequency
              </div>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-[#CADCE0] shadow-2xs">
              <div className="font-caption text-[11px] text-[#526673]">Today Burned</div>
              <div className="font-score-m text-base text-[#16232B] mt-1">
                {totalWorkoutCalories} <span className="text-[10px] text-[#526673]">kcal</span>
              </div>
              <div className="font-caption text-[10px] text-[#526673] mt-0.5">
                {totalWorkoutDuration > 0 ? `${totalWorkoutDuration} mins` : 'Estimated'}
              </div>
            </div>
          </div>

          {/* Volume Progression Chart */}
          <div className="bg-white rounded-2xl p-4 border border-[#CADCE0] shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FF5B04]" />
                <span className="font-title text-sm text-[#16232B]">Daily Volume Progression</span>
              </div>
              <span className="font-caption text-[11px] text-[#526673]">kg lifted</span>
            </div>

            {/* Bars */}
            <div className="h-36 flex items-end justify-between gap-1.5 pt-4 pb-1 border-b border-[#CADCE0]">
              {recentHistory.map((day, idx) => {
                const vol = day.workoutVolume || 0;
                const heightPct = Math.max(8, Math.round((vol / maxVolume) * 100));
                const dayLabel = day.day ? day.day.slice(0, 3) : `D${idx + 1}`;
                const hasLifted = vol > 0;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                    <span className="opacity-0 group-hover:opacity-100 font-caption text-[9px] text-[#16232B] transition-opacity mb-1">
                      {vol > 0 ? `${Math.round(vol / 100) / 10}k` : '0'}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-lg transition-all ${
                        hasLifted
                          ? 'bg-gradient-to-t from-[#FF5B04] to-[#FF7529] shadow-2xs'
                          : 'bg-[#CADCE0]/40'
                      }`}
                    />
                    <span className="font-caption text-[9px] text-[#526673] mt-1.5 block">
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Training Split Breakdown */}
          <div className="bg-white rounded-2xl p-4 border border-[#CADCE0] shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-[#075056]" />
              <span className="font-title text-sm text-[#16232B]">Workout Category Distribution</span>
            </div>

            {Object.keys(categoryCounts).length === 0 ? (
              <p className="font-caption text-xs text-[#526673]">
                Log exercises with categories (Push, Pull, Legs, Cardio) to see your training balance.
              </p>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const pct = Math.round((count / workoutItems.length) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between font-caption text-xs mb-1">
                        <span className="text-[#16232B] font-bold">{cat}</span>
                        <span className="text-[#526673]">{count} exercises ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#E4EEF0] overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full rounded-full bg-[#075056]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
