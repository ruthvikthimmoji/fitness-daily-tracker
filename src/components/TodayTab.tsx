import React, { useState } from 'react';
import { Droplets, Footprints, Moon, Scale, Smile, Dumbbell, UtensilsCrossed, Plus, Minus, Check, Camera, ChevronRight } from 'lucide-react';
import { DailyLog, UserSettings, TabType, GamificationState } from '../types';
import { QuestsWidget } from './QuestsWidget';
import { LogDetailType } from './SpecimenDetailModal';
import { triggerHaptic } from '../utils/formatters';

interface TodayTabProps {
  dailyLog: DailyLog;
  settings: UserSettings;
  gamification: GamificationState;
  onClaimQuest: (questId: string) => void;
  onClaimChest: () => void;
  onOpenBadgesModal: () => void;
  onUpdateDailyLog: (updates: Partial<DailyLog>) => void;
  onNavigateTab: (tab: TabType) => void;
  onShowToast: (msg: string, actionLabel?: string, onAction?: () => void) => void;
  onSelectDetail: (detail: LogDetailType) => void;
  onOpenPhotoUploader: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
  onOpenAddModal?: (type: 'food' | 'workout' | 'work') => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  dailyLog,
  settings,
  gamification,
  onClaimQuest,
  onClaimChest,
  onOpenBadgesModal,
  onUpdateDailyLog,
  onNavigateTab: _onNavigateTab,
  onShowToast,
  onSelectDetail,
  onOpenPhotoUploader,
  onOpenAddModal
}) => {
  const [weightInput, setWeightInput] = useState(dailyLog.weight !== null ? String(dailyLog.weight) : '');
  const [stepsInput, setStepsInput] = useState(dailyLog.steps > 0 ? String(dailyLog.steps) : '');
  const [notesInput, setNotesInput] = useState(dailyLog.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  React.useEffect(() => {
    setWeightInput(dailyLog.weight !== null ? String(dailyLog.weight) : '');
    setStepsInput(dailyLog.steps > 0 ? String(dailyLog.steps) : '');
    setNotesInput(dailyLog.notes || '');
  }, [dailyLog.date, dailyLog.weight, dailyLog.steps, dailyLog.notes]);

  // Calorie calculations
  const calorieTarget = settings.dailyCalorieTarget || 2200;
  const caloriesIn = dailyLog.caloriesIn || 0;
  const caloriesBurned = dailyLog.caloriesBurned || 0;
  const remainingCalories = calorieTarget - caloriesIn + caloriesBurned;
  const isCaloriesOver = remainingCalories < 0;

  // Calorie SVG Ring math
  const ringRadius = 42;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const calorieRatio = Math.min(1, Math.max(0, caloriesIn / calorieTarget));
  const strokeDashoffset = ringCircumference * (1 - calorieRatio);

  // Water calculations
  const waterTarget = settings.dailyWaterTarget || 3.0;
  const waterVal = dailyLog.water || 0;
  const waterRemaining = Math.max(0, Math.round((waterTarget - waterVal) * 10) / 10);
  const waterPct = Math.min(100, Math.round((waterVal / waterTarget) * 100));

  // Steps calculations
  const stepTarget = settings.dailyStepsTarget || 10000;
  const stepVal = dailyLog.steps || 0;
  const stepsRemaining = Math.max(0, stepTarget - stepVal);
  const stepsPct = Math.min(100, Math.round((stepVal / stepTarget) * 100));

  // Water handlers with Undo
  const handleAddWater = (litres: number) => {
    triggerHaptic(15);
    const prevVal = dailyLog.water || 0;
    const nextVal = Math.max(0, Math.round((prevVal + litres) * 100) / 100);
    onUpdateDailyLog({ water: nextVal });

    onShowToast(`Water: ${nextVal} L`, 'Undo', () => {
      onUpdateDailyLog({ water: prevVal });
    });
  };

  // Steps handlers with Undo
  const handleAddSteps = (amount: number) => {
    triggerHaptic(15);
    const prevVal = dailyLog.steps || 0;
    const nextVal = Math.max(0, prevVal + amount);
    onUpdateDailyLog({ steps: nextVal });
    setStepsInput(String(nextVal));

    onShowToast(`+${amount.toLocaleString()} steps`, 'Undo', () => {
      onUpdateDailyLog({ steps: prevVal });
      setStepsInput(String(prevVal));
    });
  };

  const handleSaveStepsInput = () => {
    const num = parseInt(stepsInput, 10);
    if (!isNaN(num) && num >= 0) {
      onUpdateDailyLog({ steps: num });
      onShowToast(`Steps set to ${num.toLocaleString()}`);
    }
  };

  // Weight save
  const handleSaveWeight = () => {
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 30 && val < 300) {
      onUpdateDailyLog({ weight: val });
      onShowToast(`Weight saved: ${val} kg`);
    } else {
      onShowToast('Please enter a valid weight');
    }
  };

  // Sleep handler
  const handleSetSleep = (hrs: number) => {
    triggerHaptic(15);
    onUpdateDailyLog({ sleep: hrs });
    onShowToast(`Sleep logged: ${hrs} hrs`);
  };

  // Mood handler
  const handleSetMood = (moodVal: number) => {
    triggerHaptic(15);
    onUpdateDailyLog({ mood: moodVal });
    onShowToast(`Daily mood updated`);
  };

  // Notes save
  const handleSaveNotes = () => {
    onUpdateDailyLog({ notes: notesInput });
    setIsEditingNotes(false);
    onShowToast('Saved to your Sheet');
  };

  const moods = [
    { value: 1, emoji: '😫', label: 'Tough' },
    { value: 2, emoji: '😐', label: 'Okay' },
    { value: 3, emoji: '🙂', label: 'Good' },
    { value: 4, emoji: '😊', label: 'Great' },
    { value: 5, emoji: '🔥', label: 'On Fire' }
  ];

  const friendlyDate = new Date(`${dailyLog.date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });

  return (
    <div className="space-y-3.5 pb-24 animate-in fade-in duration-150">
      
      {/* 1. Hero Calorie Ring Card (L4, V5, L6 & Wireframe 3) */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs">
        
        {/* Card Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#E2DACB]/60 mb-3.5">
          <div className="flex items-center space-x-2">
            <span className="font-label text-[11px] text-[#5E5444]">
              ENTRY · {friendlyDate.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              type="button"
              onClick={() => onOpenPhotoUploader('physique')}
              className="p-1.5 rounded-lg bg-[#EEE9DD] text-[#2B2324] hover:text-[#C4501F] transition-colors"
              title="Attach photo for today"
              aria-label="Attach photo"
            >
              <Camera className="w-3.5 h-3.5 text-[#C4501F]" />
            </button>

            <button
              type="button"
              onClick={() => onSelectDetail({ type: 'daily', item: dailyLog })}
              className="font-button-s text-xs text-[#C4501F] hover:underline flex items-center gap-0.5 ml-1"
            >
              <span>Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Ring & Stats Layout (Wireframe 3) */}
        <div className="flex items-center justify-between gap-4 py-1">
          {/* Calorie Ring SVG */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={ringRadius}
                fill="transparent"
                stroke="#EEE9DD"
                strokeWidth="8"
              />
              {/* Progress Fill */}
              <circle
                cx="50"
                cy="50"
                r={ringRadius}
                fill="transparent"
                stroke={isCaloriesOver ? '#B3261E' : '#C4501F'}
                strokeWidth="8"
                strokeDasharray={ringCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>

            {/* Inner Center Big Hero Number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-score-xl text-2xl leading-none text-[#2B2324]">
                {Math.abs(remainingCalories).toLocaleString()}
              </span>
              <span className="font-caption text-[11px] text-[#5E5444] mt-0.5 leading-none">
                {isCaloriesOver ? 'kcal over' : 'kcal left'}
              </span>
            </div>
          </div>

          {/* Plain Numbers Beside Ring (L6) */}
          <div className="flex-1 space-y-1.5 pl-2 border-l border-[#E2DACB]/60">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-caption text-[#5E5444]">Eaten</span>
              <span className="font-score-m text-sm text-[#2B2324]">{caloriesIn.toLocaleString()}</span>
            </div>
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-caption text-[#5E5444]">Burned</span>
              <span className="font-score-m text-sm text-[#C4501F]">
                {caloriesBurned > 0 ? `+${caloriesBurned.toLocaleString()}` : '0'}
              </span>
            </div>
            <div className="flex items-baseline justify-between text-xs pt-1 border-t border-[#E2DACB]/40">
              <span className="font-caption text-[#5E5444]">Goal</span>
              <span className="font-score-m text-sm text-[#2B2324]">{calorieTarget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Macro Bars Underneath Ring (V5, L6) */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#E2DACB]/60">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-caption text-[#2F6B2A] font-bold">Protein</span>
              <span className="font-stat text-xs text-[#2B2324]">{dailyLog.protein} / {settings.dailyProteinTarget} g</span>
            </div>
            <div className="w-full h-1.5 bg-[#EEE9DD] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2F6B2A] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (dailyLog.protein / (settings.dailyProteinTarget || 130)) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-caption text-[#C4501F] font-bold">Carbs</span>
              <span className="font-stat text-xs text-[#2B2324]">{dailyLog.carbs} / 250 g</span>
            </div>
            <div className="w-full h-1.5 bg-[#EEE9DD] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C4501F] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (dailyLog.carbs / 250) * 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-caption text-[#8A5A00] font-bold">Fat</span>
              <span className="font-stat text-xs text-[#2B2324]">{dailyLog.fat} / 70 g</span>
            </div>
            <div className="w-full h-1.5 bg-[#EEE9DD] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#8A5A00] rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (dailyLog.fat / 70) * 100)}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* 2. Quick-Log Action Row (L4 & Wireframe 4) */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            onOpenAddModal?.('food');
          }}
          className="py-2.5 px-1 rounded-xl bg-white border border-[#E2DACB] hover:bg-[#EEE9DD] shadow-2xs flex flex-col items-center justify-center transition-all active:scale-95 text-[#2B2324]"
        >
          <div className="p-1 rounded-lg bg-[#F5F2EA] text-[#C4501F] mb-1">
            <UtensilsCrossed className="w-3.5 h-3.5" />
          </div>
          <span className="font-button-s text-xs">+ Meal</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            onOpenAddModal?.('workout');
          }}
          className="py-2.5 px-1 rounded-xl bg-white border border-[#E2DACB] hover:bg-[#EEE9DD] shadow-2xs flex flex-col items-center justify-center transition-all active:scale-95 text-[#2B2324]"
        >
          <div className="p-1 rounded-lg bg-[#F5F2EA] text-[#2F6B2A] mb-1">
            <Dumbbell className="w-3.5 h-3.5" />
          </div>
          <span className="font-button-s text-xs">+ Train</span>
        </button>

        <button
          type="button"
          onClick={() => handleAddWater(0.25)}
          className="py-2.5 px-1 rounded-xl bg-white border border-[#E2DACB] hover:bg-[#EEE9DD] shadow-2xs flex flex-col items-center justify-center transition-all active:scale-95 text-[#2B2324]"
        >
          <div className="p-1 rounded-lg bg-[#F5F2EA] text-[#2F5D8A] mb-1">
            <Droplets className="w-3.5 h-3.5" />
          </div>
          <span className="font-button-s text-xs">+ Water</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            const el = document.getElementById('weight-input-field');
            el?.focus();
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          className="py-2.5 px-1 rounded-xl bg-white border border-[#E2DACB] hover:bg-[#EEE9DD] shadow-2xs flex flex-col items-center justify-center transition-all active:scale-95 text-[#2B2324]"
        >
          <div className="p-1 rounded-lg bg-[#F5F2EA] text-[#8A5A00] mb-1">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <span className="font-button-s text-xs">+ Weight</span>
        </button>
      </div>

      {/* 3. Today's Goals (Wireframe 5, I3, V2) */}
      <QuestsWidget
        quests={gamification.quests}
        onClaimQuest={onClaimQuest}
        onClaimChest={onClaimChest}
        chestClaimed={gamification.chestClaimedDate === dailyLog.date}
        onOpenBadgesModal={onOpenBadgesModal}
        onQuickAddWater={handleAddWater}
        onQuickAddSteps={handleAddSteps}
        onQuickLogMeal={() => onOpenAddModal?.('food')}
      />

      {/* 4. Hydration Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#F5F2EA] text-[#2F5D8A]">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="font-title text-sm text-[#2B2324]">Hydration</div>
              <div className="font-caption text-[11px] text-[#5E5444]">
                {waterRemaining > 0 ? `${waterVal} L drank · ${waterRemaining} L to go` : `Target reached (${waterVal} L)`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="font-score-m text-lg text-[#2B2324]">{waterVal}</span>
            <span className="font-caption text-[#5E5444]"> / {waterTarget} L</span>
          </div>
        </div>

        {/* Track bar */}
        <div className="w-full h-2 bg-[#EEE9DD] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-[#2F5D8A] rounded-full transition-all duration-300"
            style={{ width: `${waterPct}%` }}
          />
        </div>

        {/* Quick tap buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAddWater(-0.25)}
            className="p-2 btn-cold-foam rounded-xl font-button-s"
            title="Subtract 250ml"
            aria-label="Subtract 250ml"
          >
            <Minus className="w-3.5 h-3.5 text-[#5E5444]" />
          </button>
          <button
            type="button"
            onClick={() => handleAddWater(0.25)}
            className="flex-1 py-2 btn-cold-foam rounded-xl font-button-s text-xs flex items-center justify-center gap-1 text-[#2B2324]"
          >
            <Plus className="w-3 h-3 text-[#2F5D8A]" /> 250 ml
          </button>
          <button
            type="button"
            onClick={() => handleAddWater(0.5)}
            className="flex-1 py-2 btn-cold-foam rounded-xl font-button-s text-xs flex items-center justify-center gap-1 text-[#2B2324]"
          >
            <Plus className="w-3 h-3 text-[#2F5D8A]" /> 500 ml
          </button>
          <button
            type="button"
            onClick={() => handleAddWater(1.0)}
            className="flex-1 py-2 btn-ember rounded-xl font-button-s text-xs flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3 text-white" /> 1.0 L
          </button>
        </div>
      </div>

      {/* 5. Movement & Steps Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#F5F2EA] text-[#C4501F]">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <div className="font-title text-sm text-[#2B2324]">Movement</div>
              <div className="font-caption text-[11px] text-[#5E5444]">
                {stepsRemaining > 0 ? `${stepVal.toLocaleString()} steps · ${stepsRemaining.toLocaleString()} to goal` : `Goal Reached!`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="font-score-m text-lg text-[#2B2324]">{stepVal.toLocaleString()}</span>
            <span className="font-caption text-[#5E5444]"> / {stepTarget.toLocaleString()}</span>
          </div>
        </div>

        {/* Track bar */}
        <div className="w-full h-2 bg-[#EEE9DD] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-[#C4501F] rounded-full transition-all duration-300"
            style={{ width: `${stepsPct}%` }}
          />
        </div>

        {/* Quick add row */}
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => handleAddSteps(1000)}
            className="flex-1 py-2 btn-cold-foam rounded-xl font-button-s text-xs text-[#2B2324]"
          >
            +1,000
          </button>
          <button
            type="button"
            onClick={() => handleAddSteps(2500)}
            className="flex-1 py-2 btn-cold-foam rounded-xl font-button-s text-xs text-[#2B2324]"
          >
            +2,500
          </button>
          <button
            type="button"
            onClick={() => handleAddSteps(5000)}
            className="flex-1 py-2 btn-ember rounded-xl font-button-s text-xs"
          >
            +5,000
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Type exact steps..."
            value={stepsInput}
            onChange={(e) => setStepsInput(e.target.value)}
            className="flex-1 bg-white border border-[#E2DACB] rounded-xl px-3 py-1.5 font-stat text-xs text-[#2B2324] placeholder-[#5E5444]/60"
          />
          <button
            type="button"
            onClick={handleSaveStepsInput}
            className="px-4 py-1.5 btn-gold-black font-button-s text-xs rounded-xl"
          >
            Set
          </button>
        </div>
      </div>

      {/* 6. Weight & Sleep Two-Column Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Morning Weight */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#E2DACB] shadow-2xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5">
              <div className="p-1 rounded-md bg-[#F5F2EA] text-[#2B2324]">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="font-title text-xs text-[#2B2324]">Weight (kg)</span>
            </div>
            
            <button
              type="button"
              onClick={() => onOpenPhotoUploader('scale')}
              className="text-[#5E5444] hover:text-[#C4501F] p-1"
              title="Snap scale photo"
              aria-label="Snap scale photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="flex items-center gap-1.5 my-1.5">
            <input
              id="weight-input-field"
              type="number"
              step="0.1"
              placeholder="78.0"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full bg-white border border-[#E2DACB] rounded-xl px-2.5 py-1 font-stat text-sm text-[#2B2324]"
            />
            <button
              type="button"
              onClick={handleSaveWeight}
              className="p-2 btn-gold-black rounded-xl text-white flex items-center justify-center shrink-0"
              title="Save weight"
              aria-label="Save weight"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
          <div className="font-caption text-[11px] text-[#5E5444]">
            Goal: {settings.goalWeightKg} kg
          </div>
        </div>

        {/* Sleep Hours */}
        <div className="bg-white rounded-2xl p-3.5 border border-[#E2DACB] shadow-2xs">
          <div className="flex items-center space-x-1.5 mb-1.5">
            <div className="p-1 rounded-md bg-[#F5F2EA] text-[#5E5444]">
              <Moon className="w-3.5 h-3.5" />
            </div>
            <span className="font-title text-xs text-[#2B2324]">Sleep</span>
          </div>

          <div className="flex items-center justify-between my-1">
            <span className="font-score-m text-lg text-[#2B2324]">{dailyLog.sleep || 0} h</span>
            <span className="font-caption text-[11px] text-[#5E5444]">of {settings.dailySleepTarget} h</span>
          </div>

          <div className="flex gap-1 mt-1">
            {[6, 7, 7.5, 8].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleSetSleep(h)}
                className={`flex-1 py-1 font-stat text-[11px] rounded-lg border transition-all ${
                  dailyLog.sleep === h
                    ? 'bg-[#2B2324] text-white border-[#2B2324]'
                    : 'bg-[#F5F2EA] text-[#5E5444] border-[#E2DACB] hover:bg-[#EEE9DD]'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Daily Mood */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#E2DACB] shadow-2xs">
        <div className="flex items-center space-x-2 mb-2.5">
          <div className="p-1 rounded-md bg-[#F5F2EA] text-[#C4501F]">
            <Smile className="w-3.5 h-3.5" />
          </div>
          <span className="font-title text-xs text-[#2B2324]">Daily energy & mood</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {moods.map((m) => {
            const isSelected = dailyLog.mood === m.value;
            return (
              <button
                key={m.value}
                type="button"
                onClick={() => handleSetMood(m.value)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl border transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#FBE8DE] border-2 border-[#C4501F] shadow-xs'
                    : 'bg-[#F5F2EA] border-[#E2DACB] hover:bg-[#EEE9DD]'
                }`}
              >
                <span className="text-xl">{m.emoji}</span>
                <span className={`text-[10px] mt-1 font-caption ${isSelected ? 'text-[#C4501F] font-bold' : 'text-[#5E5444]'}`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 8. Daily Notes & Observations (V3: Plain copy) */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#E2DACB] shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-title text-xs text-[#2B2324]">Notes & observations</span>
          {!isEditingNotes ? (
            <button
              type="button"
              onClick={() => setIsEditingNotes(true)}
              className="text-xs font-button-s text-[#C4501F] hover:underline"
            >
              Edit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveNotes}
              className="text-xs font-button-s text-white bg-[#2B2324] px-2.5 py-0.5 rounded-lg"
            >
              Save
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <textarea
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            rows={3}
            placeholder="Type your notes here (saved to your Sheet)..."
            className="w-full bg-white border border-[#E2DACB] rounded-xl p-2.5 text-xs text-[#2B2324] font-body-m focus:border-[#C4501F]"
          />
        ) : (
          <div
            onClick={() => setIsEditingNotes(true)}
            className="text-xs text-[#5E5444] p-3 bg-[#F5F2EA] rounded-xl border border-[#E2DACB] cursor-pointer min-h-[44px]"
          >
            {dailyLog.notes || 'Tap to add personal observations for today...'}
          </div>
        )}
      </div>

    </div>
  );
};
