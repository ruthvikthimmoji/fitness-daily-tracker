import React, { useState } from 'react';
import { Droplets, Footprints, Moon, Scale, Smile, Dumbbell, Briefcase, Plus, Minus, Check, ArrowRight } from 'lucide-react';
import { DailyLog, UserSettings, TabType } from '../types';

interface TodayTabProps {
  dailyLog: DailyLog;
  settings: UserSettings;
  onUpdateDailyLog: (updates: Partial<DailyLog>) => void;
  onNavigateTab: (tab: TabType) => void;
  onShowToast: (msg: string) => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  dailyLog,
  settings,
  onUpdateDailyLog,
  onNavigateTab,
  onShowToast
}) => {
  const [weightInput, setWeightInput] = useState(dailyLog.weight !== null ? String(dailyLog.weight) : '');
  const [stepsInput, setStepsInput] = useState(dailyLog.steps > 0 ? String(dailyLog.steps) : '');
  const [notesInput, setNotesInput] = useState(dailyLog.notes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  // Sync inputs if dailyLog changes (e.g. when changing date)
  React.useEffect(() => {
    setWeightInput(dailyLog.weight !== null ? String(dailyLog.weight) : '');
    setStepsInput(dailyLog.steps > 0 ? String(dailyLog.steps) : '');
    setNotesInput(dailyLog.notes || '');
  }, [dailyLog.date, dailyLog.weight, dailyLog.steps, dailyLog.notes]);

  // Water handlers
  const handleAddWater = (litres: number) => {
    const nextVal = Math.max(0, Math.round(((dailyLog.water || 0) + litres) * 100) / 100);
    onUpdateDailyLog({ water: nextVal });
    onShowToast(`Water updated: ${nextVal}L`);
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
  const calorieProgress = Math.min(100, Math.round((caloriesIn / calorieTarget) * 100));

  // Water calculations
  const waterTarget = settings.dailyWaterTarget || 3.0;
  const waterVal = dailyLog.water || 0;
  const waterPct = Math.min(100, Math.round((waterVal / waterTarget) * 100));

  // Steps calculations
  const stepTarget = settings.dailyStepsTarget || 10000;
  const stepVal = dailyLog.steps || 0;
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
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-800/80 rounded-3xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Today's Summary</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {dailyLog.dailyScore > 0 ? `${dailyLog.dailyScore}% Daily Score` : 'Log Your Day'}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex flex-col items-center justify-center p-1 text-center shadow-inner">
            <span className="text-[10px] text-slate-400 font-medium leading-none">Score</span>
            <span className="text-lg font-black text-emerald-400 leading-tight">
              {dailyLog.dailyScore > 0 ? `${dailyLog.dailyScore}%` : '--'}
            </span>
          </div>
        </div>

        {/* Calorie Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/40">
            <div className="text-[11px] text-slate-400 font-medium">Calories In</div>
            <div className="text-lg font-bold text-white mt-0.5">{caloriesIn.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Target: {calorieTarget.toLocaleString()}</div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/40">
            <div className="text-[11px] text-slate-400 font-medium">Burned</div>
            <div className="text-lg font-bold text-orange-400 mt-0.5">+{caloriesBurned}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{dailyLog.workoutVolume.toLocaleString()} kg vol</div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl p-3 border border-slate-700/40">
            <div className="text-[11px] text-slate-400 font-medium">Remaining</div>
            <div className={`text-lg font-bold mt-0.5 ${remainingCalories >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {remainingCalories.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">kcal left</div>
          </div>
        </div>

        {/* Calorie Progress Bar */}
        <div className="mt-3.5">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Calorie Budget</span>
            <span className="font-semibold text-white">{calorieProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                calorieProgress > 105 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 to-cyan-400'
              }`}
              style={{ width: `${Math.min(100, calorieProgress)}%` }}
            ></div>
          </div>
        </div>

        {/* Macros Breakdown pill bar */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            <div className="text-xs">
              <span className="text-slate-400">Protein: </span>
              <span className="font-semibold text-white">{dailyLog.protein}g</span>
              <span className="text-[10px] text-slate-400">/{settings.dailyProteinTarget}g</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <div className="text-xs">
              <span className="text-slate-400">Carbs: </span>
              <span className="font-semibold text-white">{dailyLog.carbs}g</span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400"></div>
            <div className="text-xs">
              <span className="text-slate-400">Fat: </span>
              <span className="font-semibold text-white">{dailyLog.fat}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Water Intake Card */}
      <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Water Intake</div>
              <div className="text-xs text-slate-400">Target: {waterTarget} Litres</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-cyan-400">{waterVal}</span>
            <span className="text-xs text-slate-400"> / {waterTarget} L</span>
          </div>
        </div>

        {/* Water visual progress */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-3.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${waterPct}%` }}
          ></div>
        </div>

        {/* Quick tap increment buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAddWater(-0.25)}
            className="p-2 bg-slate-800 hover:bg-slate-700/80 active:scale-95 text-slate-300 rounded-xl transition-all border border-slate-700/50"
            title="Subtract 250ml"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAddWater(0.25)}
            className="flex-1 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 text-cyan-300 font-semibold text-xs rounded-xl border border-cyan-500/30 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> 250 ml
          </button>
          <button
            onClick={() => handleAddWater(0.5)}
            className="flex-1 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 text-cyan-300 font-semibold text-xs rounded-xl border border-cyan-500/30 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> 500 ml
          </button>
          <button
            onClick={() => handleAddWater(1.0)}
            className="flex-1 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-95 text-cyan-300 font-semibold text-xs rounded-xl border border-cyan-500/30 transition-all flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> 1 Litre
          </button>
        </div>
      </div>

      {/* 3. Steps Counter Card */}
      <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Daily Steps</div>
              <div className="text-xs text-slate-400">Goal: {stepTarget.toLocaleString()} steps</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400">{stepVal.toLocaleString()}</span>
            <span className="text-xs text-slate-400"> steps</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-3.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
            style={{ width: `${stepsPct}%` }}
          ></div>
        </div>

        {/* Quick step additions */}
        <div className="flex items-center gap-2 mb-2.5">
          <button
            onClick={() => handleAddSteps(1000)}
            className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/30 transition-all"
          >
            +1,000
          </button>
          <button
            onClick={() => handleAddSteps(2500)}
            className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/30 transition-all"
          >
            +2,500
          </button>
          <button
            onClick={() => handleAddSteps(5000)}
            className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/30 transition-all"
          >
            +5,000
          </button>
        </div>

        {/* Direct step input */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Type exact steps..."
            value={stepsInput}
            onChange={(e) => setStepsInput(e.target.value)}
            className="flex-1 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleSaveStepsInput}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
          >
            Set
          </button>
        </div>
      </div>

      {/* 4. Weight & Sleep Two-Column Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Morning Weight */}
        <div className="bg-slate-900/90 rounded-3xl p-4 border border-slate-800 shadow-md">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Scale className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Weight (kg)</div>
          </div>
          
          <div className="flex items-center gap-1.5 my-2">
            <input
              type="number"
              step="0.1"
              placeholder="78.0"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-2.5 py-1.5 text-base font-bold text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSaveWeight}
              className="p-2 bg-purple-500/20 hover:bg-purple-500/30 active:scale-95 text-purple-300 rounded-xl border border-purple-500/30 transition-all"
              title="Save weight"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[10px] text-slate-400">
            Goal: {settings.goalWeightKg} kg
          </div>
        </div>

        {/* Sleep Hours */}
        <div className="bg-slate-900/90 rounded-3xl p-4 border border-slate-800 shadow-md">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Moon className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Sleep (hrs)</div>
          </div>

          <div className="flex items-center justify-between my-2">
            <span className="text-xl font-black text-indigo-400">{dailyLog.sleep || 0}</span>
            <span className="text-[10px] text-slate-400">/ {settings.dailySleepTarget}h</span>
          </div>

          <div className="flex gap-1">
            {[6, 7, 7.5, 8].map((h) => (
              <button
                key={h}
                onClick={() => handleSetSleep(h)}
                className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                  dailyLog.sleep === h
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 5. Daily Mood Selector */}
      <div className="bg-slate-900/90 rounded-3xl p-4 border border-slate-800 shadow-md">
        <div className="flex items-center space-x-2 mb-3">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Smile className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Daily Mood & Energy</div>
            <div className="text-[10px] text-slate-400">How do you feel today?</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {moods.map((m) => {
            const isSelected = dailyLog.mood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => handleSetMood(m.value)}
                className={`flex flex-col items-center py-2.5 px-1 rounded-2xl border transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500/50 shadow-md shadow-amber-500/10 scale-105'
                    : 'bg-slate-800/60 border-slate-700/40 hover:bg-slate-800'
                }`}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className={`text-[10px] mt-1 font-semibold ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Quick Jump Activity Cards */}
      <div className="space-y-2.5">
        
        {/* Workout quick card */}
        <div
          onClick={() => onNavigateTab('workout')}
          className="bg-slate-900/90 hover:bg-slate-800/80 active:scale-[0.99] cursor-pointer rounded-2xl p-4 border border-slate-800 flex items-center justify-between transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Workout Activity</div>
              <div className="text-xs text-slate-400">
                {dailyLog.workoutDone
                  ? `Completed • ${dailyLog.workoutVolume.toLocaleString()} kg volume`
                  : 'No workout logged yet'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Work tasks quick card */}
        <div
          onClick={() => onNavigateTab('work')}
          className="bg-slate-900/90 hover:bg-slate-800/80 active:scale-[0.99] cursor-pointer rounded-2xl p-4 border border-slate-800 flex items-center justify-between transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Daily Work & Productivity</div>
              <div className="text-xs text-slate-400">
                {dailyLog.workHours > 0
                  ? `${dailyLog.workHours} hours logged`
                  : 'Log tasks and work hours'}
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

      </div>

      {/* 7. Daily Notes Card */}
      <div className="bg-slate-900/90 rounded-3xl p-4 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-white">Daily Notes & Reflections</div>
          {!isEditingNotes ? (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleSaveNotes}
              className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30"
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
            placeholder="How did today go? Any fitness or work notes..."
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        ) : (
          <div
            onClick={() => setIsEditingNotes(true)}
            className="text-xs text-slate-300 italic p-3 bg-slate-800/40 rounded-xl border border-slate-800 cursor-pointer min-h-[50px]"
          >
            {dailyLog.notes || 'Tap to add personal notes for today...'}
          </div>
        )}
      </div>

    </div>
  );
};
