import React, { useState } from 'react';
import { Droplets, Footprints, Moon, Scale, Smile, Dumbbell, Briefcase, Plus, Minus, Check, ArrowRight, Camera, ChevronRight } from 'lucide-react';
import { DailyLog, UserSettings, TabType, GamificationState } from '../types';
import { QuestsWidget } from './QuestsWidget';
import { SpecimenTrack } from './SpecimenTrack';
import { LogDetailType } from './SpecimenDetailModal';

interface TodayTabProps {
  dailyLog: DailyLog;
  settings: UserSettings;
  gamification: GamificationState;
  onClaimQuest: (questId: string) => void;
  onClaimChest: () => void;
  onOpenBadgesModal: () => void;
  onUpdateDailyLog: (updates: Partial<DailyLog>) => void;
  onNavigateTab: (tab: TabType) => void;
  onShowToast: (msg: string) => void;
  onSelectDetail: (detail: LogDetailType) => void;
  onOpenPhotoUploader: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  dailyLog,
  settings,
  gamification,
  onClaimQuest,
  onClaimChest,
  onOpenBadgesModal,
  onUpdateDailyLog,
  onNavigateTab,
  onShowToast,
  onSelectDetail,
  onOpenPhotoUploader
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

  // Water handlers
  const handleAddWater = (litres: number) => {
    const nextVal = Math.max(0, Math.round(((dailyLog.water || 0) + litres) * 100) / 100);
    onUpdateDailyLog({ water: nextVal });
    onShowToast(`Water updated: ${nextVal} L`);
  };

  // Steps handlers
  const handleAddSteps = (amount: number) => {
    const nextVal = Math.max(0, (dailyLog.steps || 0) + amount);
    onUpdateDailyLog({ steps: nextVal });
    setStepsInput(String(nextVal));
    onShowToast(`Steps: ${nextVal.toLocaleString()}`);
  };

  const handleSaveStepsInput = () => {
    const num = parseInt(stepsInput, 10);
    if (!isNaN(num)) {
      onUpdateDailyLog({ steps: num });
      onShowToast(`Steps set to ${num.toLocaleString()}`);
    }
  };

  // Weight handler
  const handleSaveWeight = () => {
    const val = parseFloat(weightInput);
    if (!isNaN(val) && val > 30 && val < 300) {
      onUpdateDailyLog({ weight: val });
      onShowToast(`Weight saved: ${val} kg`);
    } else {
      onShowToast('Please enter a valid weight');
    }
  };

  // Sleep handlers
  const handleSetSleep = (hrs: number) => {
    onUpdateDailyLog({ sleep: hrs });
    onShowToast(`Sleep logged: ${hrs} hrs`);
  };

  // Mood handler
  const handleSetMood = (moodVal: number) => {
    onUpdateDailyLog({ mood: moodVal });
    onShowToast(`Mood check-in saved`);
  };

  // Notes save
  const handleSaveNotes = () => {
    onUpdateDailyLog({ notes: notesInput });
    setIsEditingNotes(false);
    onShowToast('Notes updated');
  };

  // Calorie calculations
  const calorieTarget = settings.dailyCalorieTarget || 2200;
  const caloriesIn = dailyLog.caloriesIn || 0;
  const caloriesBurned = dailyLog.caloriesBurned || 0;
  const remainingCalories = calorieTarget - caloriesIn + caloriesBurned;
  const isCaloriesOver = remainingCalories < 0;

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

  const moods = [
    { value: 1, emoji: '😫', label: 'Tough' },
    { value: 2, emoji: '😐', label: 'Okay' },
    { value: 3, emoji: '🙂', label: 'Good' },
    { value: 4, emoji: '😊', label: 'Great' },
    { value: 5, emoji: '🔥', label: 'On Fire' }
  ];

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-150">
      
      {/* 1. Daily Specimen Hero Card */}
      <div className="specimen-card p-4 border border-[#D9D1CA]">
        
        {/* Top Catalog & Category Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9D1CA]/70 mb-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[9px] bg-[#141414] text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              SPECIMEN // {dailyLog.date}
            </span>
            <span className="font-mono text-[10px] text-[#C34811] font-bold uppercase">
              {dailyLog.day}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenPhotoUploader('physique')}
              className="p-1.5 rounded-xl btn-stone text-[#0B369A] hover:text-[#141414] transition-colors"
              title="Attach Daily / Progress Photo"
            >
              <Camera className="w-4 h-4 text-[#C34811]" />
            </button>

            <button
              onClick={() => onSelectDetail({ type: 'daily', item: dailyLog })}
              className="font-mono text-[10px] text-[#0B369A] hover:underline font-bold flex items-center gap-0.5"
            >
              <span>INSPECT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Score & Subtitle */}
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-xl font-display font-black text-[#141414] uppercase tracking-tight">
              {dailyLog.dailyScore > 0 ? `${dailyLog.dailyScore}% Daily Score` : 'Log Daily Specimen'}
            </div>
            <div className="text-xs font-sans text-[#6E6A63] mt-0.5">
              {dailyLog.dailyScore >= 80 ? 'Consistency over intensity. On track.' : 'Show up daily. Progress, not perfection.'}
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[#F3EFEA] border border-[#D9D1CA] text-center">
            <span className="text-lg font-display font-black text-[#0B369A]">
              {dailyLog.dailyScore > 0 ? `${dailyLog.dailyScore}%` : '--'}
            </span>
          </div>
        </div>

        {/* Technical Specimen Tracks */}
        <div className="space-y-0.5 pt-1">
          <SpecimenTrack
            label="Calories In"
            value={caloriesIn.toLocaleString()}
            unit="KCAL"
            percent={Math.min(100, (caloriesIn / calorieTarget) * 100)}
            dotColor="#0B369A"
          />
          <SpecimenTrack
            label="Burned"
            value={`+${caloriesBurned}`}
            unit="KCAL"
            percent={Math.min(100, (caloriesBurned / 600) * 100)}
            dotColor="#C34811"
          />
          <SpecimenTrack
            label="Remaining"
            value={remainingCalories.toLocaleString()}
            unit={isCaloriesOver ? 'OVER' : 'KCAL'}
            percent={Math.max(4, Math.min(96, ((calorieTarget - caloriesIn) / calorieTarget) * 100))}
            dotColor={isCaloriesOver ? '#C34811' : '#2E7D32'}
          />
        </div>

        {/* Macros Breakdown pill bar */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#D9D1CA]/60 text-xs font-mono">
          <div className="bg-[#F3EFEA] p-2 rounded-xl border border-[#D9D1CA]">
            <span className="text-[10px] text-[#2E7D32] uppercase font-bold block">Protein</span>
            <strong className="text-[#141414] text-sm font-display">{dailyLog.protein}g</strong>
            <span className="text-[9px] text-[#6E6A63] block">/{settings.dailyProteinTarget}g</span>
          </div>
          <div className="bg-[#F3EFEA] p-2 rounded-xl border border-[#D9D1CA]">
            <span className="text-[10px] text-[#C34811] uppercase font-bold block">Carbs</span>
            <strong className="text-[#141414] text-sm font-display">{dailyLog.carbs}g</strong>
            <span className="text-[9px] text-[#6E6A63] block">fuel</span>
          </div>
          <div className="bg-[#F3EFEA] p-2 rounded-xl border border-[#D9D1CA]">
            <span className="text-[10px] text-[#E5B338] uppercase font-bold block">Fats</span>
            <strong className="text-[#141414] text-sm font-display">{dailyLog.fat}g</strong>
            <span className="text-[9px] text-[#6E6A63] block">lipids</span>
          </div>
        </div>
      </div>

      {/* 2. Duolingo Daily Quests Widget & Mystery Chest */}
      <QuestsWidget
        quests={gamification.quests}
        onClaimQuest={onClaimQuest}
        onClaimChest={onClaimChest}
        chestClaimed={gamification.chestClaimedDate === dailyLog.date}
        onOpenBadgesModal={onOpenBadgesModal}
      />

      {/* 3. Water Intake Card */}
      <div className="specimen-card p-4 border border-[#D9D1CA]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#F3EFEA] text-[#0B369A] border border-[#D9D1CA]">
              <Droplets className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-display font-bold text-[#141414] uppercase">Hydration</div>
              <div className="text-[11px] font-mono text-[#6E6A63]">
                {waterRemaining > 0 ? `${waterVal} L Drank • ${waterRemaining} L to go` : `Target reached (${waterVal} L)`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-display font-black text-[#0B369A]">{waterVal}</span>
            <span className="font-mono text-xs text-[#6E6A63]"> / {waterTarget} L</span>
          </div>
        </div>

        {/* Specimen progress track */}
        <div className="w-full h-2 bg-[#F3EFEA] rounded-full overflow-hidden border border-[#D9D1CA] mb-3">
          <div
            className="h-full bg-[#0B369A] rounded-full transition-all duration-300"
            style={{ width: `${waterPct}%` }}
          ></div>
        </div>

        {/* Tactile 3D Quick Tap Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddWater(-0.25)}
            className="p-2 btn-3d-stone rounded-xl font-bold transition-all"
            title="Subtract 250ml"
          >
            <Minus className="w-3.5 h-3.5 text-[#6E6A63]" />
          </button>
          <button
            onClick={() => handleAddWater(0.25)}
            className="flex-1 py-2 btn-3d-stone rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1 text-[#141414]"
          >
            <Plus className="w-3 h-3 text-[#0B369A]" /> 250ml
          </button>
          <button
            onClick={() => handleAddWater(0.5)}
            className="flex-1 py-2 btn-3d-stone rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1 text-[#141414]"
          >
            <Plus className="w-3 h-3 text-[#0B369A]" /> 500ml
          </button>
          <button
            onClick={() => handleAddWater(1.0)}
            className="flex-1 py-2 btn-3d-blue rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3 text-white" /> 1.0L
          </button>
        </div>
      </div>

      {/* 4. Steps Counter Card */}
      <div className="specimen-card p-4 border border-[#D9D1CA]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#F3EFEA] text-[#C34811] border border-[#D9D1CA]">
              <Footprints className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-display font-bold text-[#141414] uppercase">Daily Movement</div>
              <div className="text-[11px] font-mono text-[#6E6A63]">
                {stepsRemaining > 0 ? `${stepVal.toLocaleString()} hit • ${stepsRemaining.toLocaleString()} to goal` : `Goal Reached!`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-display font-black text-[#C34811]">{stepVal.toLocaleString()}</span>
            <span className="font-mono text-xs text-[#6E6A63]"> / {stepTarget.toLocaleString()}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[#F3EFEA] rounded-full overflow-hidden border border-[#D9D1CA] mb-3">
          <div
            className="h-full bg-[#C34811] rounded-full transition-all duration-300"
            style={{ width: `${stepsPct}%` }}
          ></div>
        </div>

        {/* Quick step additions */}
        <div className="flex items-center gap-2 mb-2.5">
          <button
            onClick={() => handleAddSteps(1000)}
            className="flex-1 py-2 btn-3d-stone rounded-xl font-mono font-bold text-xs text-[#141414]"
          >
            +1,000
          </button>
          <button
            onClick={() => handleAddSteps(2500)}
            className="flex-1 py-2 btn-3d-stone rounded-xl font-mono font-bold text-xs text-[#141414]"
          >
            +2,500
          </button>
          <button
            onClick={() => handleAddSteps(5000)}
            className="flex-1 py-2 btn-3d-terracotta rounded-xl font-mono font-bold text-xs"
          >
            +5,000
          </button>
        </div>

        {/* Direct Step Input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Type exact steps..."
            value={stepsInput}
            onChange={(e) => setStepsInput(e.target.value)}
            className="flex-1 bg-white border border-[#D9D1CA] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#141414] placeholder-[#A39E98] focus:border-[#0B369A]"
          />
          <button
            onClick={handleSaveStepsInput}
            className="px-4 py-2 btn-gallery-blue font-display font-bold text-xs uppercase tracking-wider rounded-xl"
          >
            Set
          </button>
        </div>
      </div>

      {/* 5. Weight & Sleep Two-Column Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Morning Weight */}
        <div className="specimen-card p-4 border border-[#D9D1CA]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <div className="p-1.5 rounded-lg bg-[#F3EFEA] text-[#0B369A] border border-[#D9D1CA]">
                <Scale className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div className="text-xs font-display font-bold text-[#141414] uppercase">Weight (kg)</div>
            </div>
            
            <button
              onClick={() => onOpenPhotoUploader('scale')}
              className="text-[#6E6A63] hover:text-[#C34811] p-1"
              title="Snap Scale Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="flex items-center gap-1.5 my-2">
            <input
              type="number"
              step="0.1"
              placeholder="78.0"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full bg-white border border-[#D9D1CA] rounded-xl px-2.5 py-1.5 text-base font-display font-black text-[#0B369A] placeholder-[#A39E98] focus:border-[#0B369A]"
            />
            <button
              onClick={handleSaveWeight}
              className="p-2.5 btn-gallery-blue rounded-xl text-white flex items-center justify-center shrink-0"
              title="Save weight"
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
          <div className="text-[10px] font-mono text-[#6E6A63]">
            Goal: {settings.goalWeightKg} kg
          </div>
        </div>

        {/* Sleep Hours */}
        <div className="specimen-card p-4 border border-[#D9D1CA]">
          <div className="flex items-center space-x-1.5 mb-2">
            <div className="p-1.5 rounded-lg bg-[#F3EFEA] text-[#8E78C9] border border-[#D9D1CA]">
              <Moon className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="text-xs font-display font-bold text-[#141414] uppercase">Sleep (hrs)</div>
          </div>

          <div className="flex items-center justify-between my-2">
            <span className="text-xl font-display font-black text-[#8E78C9]">{dailyLog.sleep || 0}</span>
            <span className="font-mono text-[10px] text-[#6E6A63]">/ {settings.dailySleepTarget}h target</span>
          </div>

          <div className="flex gap-1">
            {[6, 7, 7.5, 8].map((h) => (
              <button
                key={h}
                onClick={() => handleSetSleep(h)}
                className={`flex-1 py-1 text-[11px] font-mono font-bold rounded-lg border transition-all ${
                  dailyLog.sleep === h
                    ? 'bg-[#141414] text-white border-[#141414]'
                    : 'bg-[#F3EFEA] text-[#6E6A63] border-[#D9D1CA] hover:bg-[#EAE5DE]'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Daily Mood Selector */}
      <div className="specimen-card p-4 border border-[#D9D1CA]">
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-1.5 rounded-lg bg-[#F3EFEA] text-[#C34811] border border-[#D9D1CA]">
            <Smile className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs font-display font-bold uppercase tracking-wider text-[#141414]">Daily Mood & Energy</div>
            <div className="text-[10px] font-mono text-[#6E6A63]">Check in honestly with your specimen</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {moods.map((m) => {
            const isSelected = dailyLog.mood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => handleSetMood(m.value)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl border transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-2 border-[#0B369A] shadow-xs'
                    : 'bg-[#F3EFEA] border-[#D9D1CA] hover:bg-[#EAE5DE]'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className={`text-[10px] mt-1 font-mono font-bold ${isSelected ? 'text-[#0B369A]' : 'text-[#6E6A63]'}`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Quick Jump Activity Cards */}
      <div className="space-y-2">
        {/* Workout quick card */}
        <div
          onClick={() => onNavigateTab('workout')}
          className="specimen-card hover:bg-[#F3EFEA]/40 active:scale-[0.99] cursor-pointer p-3.5 border border-[#D9D1CA] flex items-center justify-between transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#F3EFEA] text-[#C34811] border border-[#D9D1CA]">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-display font-bold uppercase tracking-wider text-[#141414]">Workout Archive</div>
              <div className="text-[11px] font-mono text-[#6E6A63]">
                {dailyLog.workoutDone
                  ? `Completed • ${(dailyLog.workoutVolume || 0).toLocaleString()} kg volume`
                  : 'No workout logged yet'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6E6A63]" />
        </div>

        {/* Work tasks quick card */}
        <div
          onClick={() => onNavigateTab('work')}
          className="specimen-card hover:bg-[#F3EFEA]/40 active:scale-[0.99] cursor-pointer p-3.5 border border-[#D9D1CA] flex items-center justify-between transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-[#F3EFEA] text-[#0B369A] border border-[#D9D1CA]">
              <Briefcase className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-display font-bold uppercase tracking-wider text-[#141414]">Productivity & Tasks</div>
              <div className="text-[11px] font-mono text-[#6E6A63]">
                {dailyLog.workHours > 0
                  ? `${dailyLog.workHours} hours logged`
                  : 'Log work, study, and tasks'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6E6A63]" />
        </div>
      </div>

      {/* 8. Daily Notes Card */}
      <div className="specimen-card p-4 border border-[#D9D1CA]">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-display font-bold uppercase tracking-wider text-[#141414]">
            Notes & Reflections
          </div>
          {!isEditingNotes ? (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-[11px] font-mono font-bold text-[#0B369A] hover:underline"
            >
              EDIT
            </button>
          ) : (
            <button
              onClick={handleSaveNotes}
              className="text-[11px] font-mono font-bold text-white bg-[#0B369A] px-2.5 py-0.5 rounded-md"
            >
              SAVE
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <textarea
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            rows={3}
            placeholder="Type your reflections here (syncs to Column T in Google Sheets)..."
            className="w-full bg-white border border-[#D9D1CA] rounded-xl p-2.5 text-xs text-[#141414] font-sans focus:border-[#0B369A]"
          />
        ) : (
          <div
            onClick={() => setIsEditingNotes(true)}
            className="text-xs text-[#6E6A63] italic p-3 bg-[#F3EFEA] rounded-xl border border-[#D9D1CA] cursor-pointer min-h-[48px]"
          >
            {dailyLog.notes || 'Tap to add personal observations for today...'}
          </div>
        )}
      </div>

    </div>
  );
};
