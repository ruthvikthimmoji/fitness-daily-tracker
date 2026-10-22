import React, { useState } from 'react';
import { Droplets, Footprints, Moon, Scale, Smile, Dumbbell, Briefcase, Plus, Minus, Check, ArrowRight } from 'lucide-react';
import { DailyLog, UserSettings, TabType, GamificationState } from '../types';
import { QuestsWidget } from './QuestsWidget';

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
  onShowToast
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
    onShowToast(`Mood saved!`);
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
    <div className="space-y-4 pb-24">
      
      {/* 1. Daily Hero Card: Score & Calorie Summary */}
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        
        {/* Card Header: Score & Direct Coaching Voice */}
        <div className="flex items-center justify-between pb-3 border-b border-[#BFBFBF]/60">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#595959]">
              Daily Summary
            </div>
            <div className="text-xl font-bold text-[#1F4E5F] mt-0.5">
              {dailyLog.dailyScore > 0 ? `${dailyLog.dailyScore}% Daily Score` : 'Log your day'}
            </div>
            <div className="text-xs text-[#595959] italic mt-0.5">
              {dailyLog.dailyScore >= 80 ? 'On track. Consistency over intensity.' : 'Show up daily. Progress, not perfection.'}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-[#595959] uppercase">Score</span>
            <div className="px-3 py-1 rounded-lg bg-[#EAF2F5] border border-[#BFBFBF] text-center">
              <span className="text-xl font-black text-[#1F4E5F]">
                {dailyLog.dailyScore > 0 ? `${dailyLog.dailyScore}%` : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Calorie Stats Boxes */}
        <div className="grid grid-cols-3 gap-2 pt-3">
          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="text-[11px] font-bold text-[#4472C4]">Calories In</div>
            <div className="text-lg font-black text-[#1F4E5F] mt-0.5">{caloriesIn.toLocaleString()}</div>
            <div className="text-[10px] text-[#595959]">Target: {calorieTarget}</div>
          </div>

          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="text-[11px] font-bold text-[#D32F2F]">Burned</div>
            <div className="text-lg font-black text-[#D32F2F] mt-0.5">+{caloriesBurned}</div>
            <div className="text-[10px] text-[#595959]">{(dailyLog.workoutVolume || 0).toLocaleString()} kg vol</div>
          </div>

          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="text-[11px] font-bold text-[#2E75B6]">Remaining</div>
            <div className={`text-lg font-black mt-0.5 ${isCaloriesOver ? 'text-[#C00000]' : 'text-[#2E7D32]'}`}>
              {remainingCalories.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#595959]">
              {isCaloriesOver ? 'Over target' : 'kcal to go'}
            </div>
          </div>
        </div>

        {/* Calorie Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[11px] text-[#595959] mb-1">
            <span>Calorie budget ({calorieTarget} kcal)</span>
            <span className="font-bold text-[#1A1A1A]">{Math.round((caloriesIn / calorieTarget) * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#EAF2F5] rounded-full overflow-hidden border border-[#BFBFBF]/70">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((caloriesIn / calorieTarget) * 100))}%`,
                backgroundColor: isCaloriesOver ? '#C00000' : '#4472C4'
              }}
            ></div>
          </div>
        </div>

        {/* Macros Breakdown pill bar */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#BFBFBF]/60 text-xs">
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#2E9E6B]"></div>
            <div>
              <span className="text-[#595959]">Protein: </span>
              <strong className="text-[#1A1A1A]">{dailyLog.protein}g</strong>
              <span className="text-[10px] text-[#595959]">/{settings.dailyProteinTarget}g</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F28E2B]"></div>
            <div>
              <span className="text-[#595959]">Carbs: </span>
              <strong className="text-[#1A1A1A]">{dailyLog.carbs}g</strong>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EC407A]"></div>
            <div>
              <span className="text-[#595959]">Fat: </span>
              <strong className="text-[#1A1A1A]">{dailyLog.fat}g</strong>
            </div>
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
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#EAF2F5] text-[#29B6F6] border border-[#BFBFBF]/60">
              <Droplets className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1F4E5F]">Water Intake</div>
              <div className="text-[11px] text-[#595959]">
                {waterRemaining > 0 ? `Drank ${waterVal} L. ${waterRemaining} L to go.` : `Target reached (${waterVal} L)!`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#29B6F6]">{waterVal}</span>
            <span className="text-xs text-[#595959] font-semibold"> / {waterTarget} L</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-[#EAF2F5] rounded-full overflow-hidden border border-[#BFBFBF]/70 mb-3">
          <div
            className="h-full bg-[#29B6F6] rounded-full transition-all duration-300"
            style={{ width: `${waterPct}%` }}
          ></div>
        </div>

        {/* Tactile 3D Quick Tap Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleAddWater(-0.25)}
            className="p-2 btn-3d-mist rounded-xl font-bold transition-all"
            title="Subtract 250ml"
          >
            <Minus className="w-3.5 h-3.5 text-[#595959]" />
          </button>
          <button
            onClick={() => handleAddWater(0.25)}
            className="flex-1 py-2 btn-3d-mist rounded-xl font-black text-xs flex items-center justify-center gap-1 text-[#1F4E5F]"
          >
            <Plus className="w-3 h-3 text-[#29B6F6]" /> 250 ml
          </button>
          <button
            onClick={() => handleAddWater(0.5)}
            className="flex-1 py-2 btn-3d-mist rounded-xl font-black text-xs flex items-center justify-center gap-1 text-[#1F4E5F]"
          >
            <Plus className="w-3 h-3 text-[#29B6F6]" /> 500 ml
          </button>
          <button
            onClick={() => handleAddWater(1.0)}
            className="flex-1 py-2 btn-3d-teal rounded-xl font-black text-xs flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3 text-white" /> 1.0 L
          </button>
        </div>
      </div>

      {/* 4. Steps Counter Card */}
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#EAF2F5] text-[#F28E2B] border border-[#BFBFBF]/60">
              <Footprints className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1F4E5F]">Daily Steps</div>
              <div className="text-[11px] text-[#595959]">
                {stepsRemaining > 0 ? `You hit ${stepVal.toLocaleString()} steps. ${stepsRemaining.toLocaleString()} to go.` : `Goal reached (${stepVal.toLocaleString()} steps)!`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#F28E2B]">{stepVal.toLocaleString()}</span>
            <span className="text-xs text-[#595959] font-semibold"> / {stepTarget.toLocaleString()}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 bg-[#EAF2F5] rounded-full overflow-hidden border border-[#BFBFBF]/70 mb-3">
          <div
            className="h-full bg-[#F28E2B] rounded-full transition-all duration-300"
            style={{ width: `${stepsPct}%` }}
          ></div>
        </div>

        {/* Tactile 3D Quick Step Additions */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <button
            onClick={() => handleAddSteps(1000)}
            className="flex-1 py-2 btn-3d-mist rounded-xl font-black text-xs text-[#1F4E5F]"
          >
            +1,000
          </button>
          <button
            onClick={() => handleAddSteps(2500)}
            className="flex-1 py-2 btn-3d-mist rounded-xl font-black text-xs text-[#1F4E5F]"
          >
            +2,500
          </button>
          <button
            onClick={() => handleAddSteps(5000)}
            className="flex-1 py-2 btn-3d-orange rounded-xl font-black text-xs"
          >
            +5,000
          </button>
        </div>

        {/* Sunlight Yellow Direct Step Input */}
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            placeholder="Type exact steps (yellow cell)..."
            value={stepsInput}
            onChange={(e) => setStepsInput(e.target.value)}
            className="flex-1 bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-3 py-2 text-xs text-[#2E75B6] font-bold placeholder-[#7F7F7F] focus:outline-none focus:border-[#2E75B6]"
          />
          <button
            onClick={handleSaveStepsInput}
            className="px-4 py-2 btn-3d-teal font-black text-xs rounded-lg"
          >
            Set
          </button>
        </div>
      </div>

      {/* 5. Weight & Sleep Two-Column Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Morning Weight */}
        <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
          <div className="flex items-center space-x-1.5 mb-2">
            <div className="p-1.5 rounded-lg bg-[#EAF2F5] text-[#1F77B4] border border-[#BFBFBF]/60">
              <Scale className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="text-xs font-bold text-[#1F4E5F]">Weight (kg)</div>
          </div>
          
          <div className="flex items-center gap-1.5 my-2">
            {/* Sunlight Yellow Input */}
            <input
              type="number"
              step="0.1"
              placeholder="78.0"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1.5 text-base font-black text-[#2E75B6] placeholder-[#7F7F7F] focus:outline-none focus:border-[#2E75B6]"
            />
            <button
              onClick={handleSaveWeight}
              className="p-2 btn-3d-teal rounded-lg text-white flex items-center justify-center"
              title="Save weight"
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
          <div className="text-[10px] text-[#595959]">
            Goal: {settings.goalWeightKg} kg
          </div>
        </div>

        {/* Sleep Hours */}
        <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
          <div className="flex items-center space-x-1.5 mb-2">
            <div className="p-1.5 rounded-lg bg-[#EAF2F5] text-[#7E57C2] border border-[#BFBFBF]/60">
              <Moon className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <div className="text-xs font-bold text-[#1F4E5F]">Sleep (hrs)</div>
          </div>

          <div className="flex items-center justify-between my-2">
            <span className="text-xl font-black text-[#7E57C2]">{dailyLog.sleep || 0}</span>
            <span className="text-[10px] text-[#595959] font-medium">/ {settings.dailySleepTarget}h target</span>
          </div>

          <div className="flex gap-1">
            {[6, 7, 7.5, 8].map((h) => (
              <button
                key={h}
                onClick={() => handleSetSleep(h)}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  dailyLog.sleep === h
                    ? 'btn-3d-teal'
                    : 'btn-3d-mist text-[#595959]'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Daily Mood Selector */}
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-1.5 rounded-lg bg-[#EAF2F5] text-[#EC407A] border border-[#BFBFBF]/60">
            <Smile className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#1F4E5F]">Daily Mood & Energy</div>
            <div className="text-[10px] text-[#595959]">Quietly motivating: check in honestly</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {moods.map((m) => {
            const isSelected = dailyLog.mood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => handleSetMood(m.value)}
                className={`flex flex-col items-center py-2 px-1 rounded-lg border transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[#FFF9DB] border-[#2E75B6] ring-2 ring-[#2E75B6]/30 shadow-xs'
                    : 'bg-[#EAF2F5] border-[#BFBFBF] hover:bg-[#dfeaf0]'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className={`text-[10px] mt-1 font-bold ${isSelected ? 'text-[#1F4E5F]' : 'text-[#595959]'}`}>
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
          className="bg-white hover:bg-[#EAF2F5]/50 active:scale-[0.99] cursor-pointer rounded-xl p-3.5 border border-[#BFBFBF] flex items-center justify-between transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#EAF2F5] text-[#D32F2F] border border-[#BFBFBF]/60">
              <Dumbbell className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F4E5F]">Workout Activity</div>
              <div className="text-[11px] text-[#595959]">
                {dailyLog.workoutDone
                  ? `Completed • ${(dailyLog.workoutVolume || 0).toLocaleString()} kg volume`
                  : 'No workout logged yet'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#595959]" />
        </div>

        {/* Work tasks quick card */}
        <div
          onClick={() => onNavigateTab('work')}
          className="bg-white hover:bg-[#EAF2F5]/50 active:scale-[0.99] cursor-pointer rounded-xl p-3.5 border border-[#BFBFBF] flex items-center justify-between transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-[#EAF2F5] text-[#455A64] border border-[#BFBFBF]/60">
              <Briefcase className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F4E5F]">Work & Daily Productivity</div>
              <div className="text-[11px] text-[#595959]">
                {dailyLog.workHours > 0
                  ? `${dailyLog.workHours} hours logged`
                  : 'Log work, study, and tasks'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#595959]" />
        </div>

      </div>

      {/* 8. Daily Notes Card (Column T in Sheet) */}
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-[#1F4E5F]">Daily Notes & Reflections</div>
          {!isEditingNotes ? (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-[11px] font-bold text-[#2E75B6] hover:underline"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSaveNotes}
              className="text-[11px] font-bold text-white bg-[#1F4E5F] px-2.5 py-0.5 rounded-md"
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
            placeholder="Type your notes here (yellow cell in Excel)..."
            className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg p-2.5 text-xs text-[#2E75B6] font-semibold placeholder-[#7F7F7F] focus:outline-none focus:border-[#2E75B6]"
          />
        ) : (
          <div
            onClick={() => setIsEditingNotes(true)}
            className="text-xs text-[#595959] italic p-3 bg-[#EAF2F5] rounded-lg border border-[#BFBFBF]/60 cursor-pointer min-h-[48px]"
          >
            {dailyLog.notes || 'Tap to add personal notes for today (syncs to Column T in Daily Log)...'}
          </div>
        )}
      </div>

    </div>
  );
};
