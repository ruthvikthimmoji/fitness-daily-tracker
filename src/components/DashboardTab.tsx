import React, { useState } from 'react';
import { Scale, Target, Activity, Award, Plus } from 'lucide-react';
import { DashboardKpis, DailyHistoryItem, UserSettings, Measurement, StoredPhoto } from '../types';
import { VaultTab } from './VaultTab';
import { fmtRemainingWeight, toLocalIso, triggerHaptic } from '../utils/formatters';

interface DashboardTabProps {
  kpis: DashboardKpis;
  history: DailyHistoryItem[];
  settings: UserSettings;
  onAddMeasurement: (m: Measurement) => void;
  onSaveWeight?: (weight: number) => void;
  onShowToast: (msg: string) => void;
  onOpenPhotoUploader?: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
  onSelectPhotoDetail?: (photo: StoredPhoto) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  kpis,
  history,
  settings,
  onAddMeasurement,
  onSaveWeight,
  onShowToast,
  onOpenPhotoUploader = () => {},
  onSelectPhotoDetail = () => {}
}) => {
  // Segmented control (Page 16: Charts | Body | Photos)
  const [activeSegment, setActiveSegment] = useState<'charts' | 'body' | 'photos'>('charts');

  // Weight Trend range (S1: 7D / 30D / 90D)
  const [weightRange, setWeightRange] = useState<'7D' | '30D' | '90D'>('7D');
  const [quickWeightInput, setQuickWeightInput] = useState('');
  const [showQuickWeight, setShowQuickWeight] = useState(false);

  // Body Measurements form
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [bodyFat, setBodyFat] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [arms, setArms] = useState('');
  const [thighs, setThighs] = useState('');

  const currentWeight = kpis.currentWeight || settings.startWeightKg || 78;
  const startWeight = settings.startWeightKg || 78;
  const goalWeight = settings.goalWeightKg || 72;
  const totalToLose = Math.abs(startWeight - goalWeight) || 1;
  const lostSoFar = Math.max(0, startWeight - currentWeight);
  const weightProgressPct = Math.min(100, Math.round((lostSoFar / totalToLose) * 100));

  // BMI formatted context (S2)
  const bmiVal = kpis.bmi || (settings.heightCm ? Math.round((currentWeight / ((settings.heightCm / 100) ** 2)) * 10) / 10 : 24.5);
  const bmiCategory = bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Normal' : bmiVal < 30 ? 'Overweight' : 'Obese';

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const dStr = toLocalIso();

    onAddMeasurement({
      date: dStr,
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
      chest: chest ? parseFloat(chest) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
      hips: hips ? parseFloat(hips) : undefined,
      arms: arms ? parseFloat(arms) : undefined,
      thighs: thighs ? parseFloat(thighs) : undefined,
    });

    setShowMeasureForm(false);
    setBodyFat('');
    setChest('');
    setWaist('');
    setHips('');
    setArms('');
    setThighs('');
    onShowToast('Measurement recorded to sheet!');
  };

  // Trailing 7 days consistency data (B1: today-6 ... today, never future days!)
  const trailingDays = React.useMemo(() => {
    const today = new Date();
    const result: { dateStr: string; label: string; score: number | null; hasLog: boolean }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = toLocalIso(d);
      const histItem = history.find(h => h.date === dStr);
      const score = histItem && histItem.dailyScore > 0 ? histItem.dailyScore : null;

      result.push({
        dateStr: dStr,
        label: `${dayNames[d.getDay()]} ${d.getDate()}`,
        score,
        hasLog: Boolean(histItem && histItem.hasData)
      });
    }
    return result;
  }, [history]);

  // Weight Trend data filter (S1)
  const weightDataPoints = React.useMemo(() => {
    const daysCount = weightRange === '7D' ? 7 : weightRange === '30D' ? 30 : 90;
    const now = new Date();
    const points: { dateStr: string; weight: number }[] = [];

    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dStr = toLocalIso(d);
      const item = history.find(h => h.date === dStr);
      if (item && item.weight) {
        points.push({ dateStr: dStr, weight: item.weight });
      }
    }
    return points;
  }, [history, weightRange]);

  return (
    <div className="space-y-3.5 pb-28 animate-in fade-in duration-150">
      
      {/* Segmented Control: Charts | Body | Photos (L2 & Wireframe 6) */}
      <div className="bg-[#EEE9DD] p-1 rounded-xl flex items-center gap-1 border border-[#E2DACB] max-w-md mx-auto">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(8);
            setActiveSegment('charts');
          }}
          className={`flex-1 py-1.5 rounded-lg font-button-s text-xs transition-all ${
            activeSegment === 'charts'
              ? 'bg-white text-[#2B2324] font-bold shadow-xs'
              : 'text-[#5E5444] hover:text-[#2B2324]'
          }`}
        >
          Charts
        </button>
        <button
          type="button"
          onClick={() => {
            triggerHaptic(8);
            setActiveSegment('body');
          }}
          className={`flex-1 py-1.5 rounded-lg font-button-s text-xs transition-all ${
            activeSegment === 'body'
              ? 'bg-white text-[#2B2324] font-bold shadow-xs'
              : 'text-[#5E5444] hover:text-[#2B2324]'
          }`}
        >
          Body
        </button>
        <button
          type="button"
          onClick={() => {
            triggerHaptic(8);
            setActiveSegment('photos');
          }}
          className={`flex-1 py-1.5 rounded-lg font-button-s text-xs transition-all ${
            activeSegment === 'photos'
              ? 'bg-white text-[#2B2324] font-bold shadow-xs'
              : 'text-[#5E5444] hover:text-[#2B2324]'
          }`}
        >
          Photos
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. CHARTS VIEW (Weight Progress, Weight Trend, Consistency) */}
      {/* ======================================================== */}
      {activeSegment === 'charts' && (
        <>
          {/* Body Transformation Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#E2DACB]/60">
              <div>
                <span className="font-label text-[11px] text-[#5E5444] block">
                  BODY PROGRESS
                </span>
                <div className="font-score-xl text-2xl text-[#2B2324] mt-0.5">
                  {currentWeight} <span className="font-caption text-[#5E5444] text-xs">kg</span>
                </div>
                <div className="font-caption text-[11px] text-[#5E5444] mt-0.5">
                  Starting: {startWeight} kg · Goal: {goalWeight} kg
                </div>
              </div>

              <div className="text-right">
                <span className="font-caption text-[11px] text-[#5E5444] block">Goal progress</span>
                <span className="font-title text-sm text-[#2B2324]">
                  {weightProgressPct}% of goal
                </span>
              </div>
            </div>

            {/* Weight Progress Bar (B7: min fill only when > 0, no nub at 0) */}
            <div className="mb-3">
              <div className="flex justify-between font-caption text-[11px] text-[#5E5444] mb-1">
                <span>{startWeight} kg</span>
                <span className="text-[#C4501F] font-semibold">
                  {lostSoFar > 0 ? `${lostSoFar.toFixed(1)} kg lost` : '0 kg lost'}
                </span>
                <span>{goalWeight} kg</span>
              </div>
              <div className="w-full h-2 bg-[#EEE9DD] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C4501F] rounded-full transition-all duration-500"
                  style={{ width: weightProgressPct > 0 ? `${weightProgressPct}%` : '0%' }}
                />
              </div>
            </div>

            {/* 4 Metric Cards (B2 & S2) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#F5F2EA] rounded-xl p-2.5 border border-[#E2DACB]">
                <div className="flex items-center space-x-1.5 font-label text-[10px] text-[#5E5444] mb-0.5">
                  <Scale className="w-3.5 h-3.5 text-[#C4501F]" />
                  <span>CHANGE</span>
                </div>
                <div className="font-score-m text-lg text-[#2B2324]">
                  {lostSoFar > 0 ? `-${lostSoFar.toFixed(1)} kg` : '0 kg'}
                </div>
                <div className="font-caption text-[11px] text-[#5E5444]">Since tracking start</div>
              </div>

              <div className="bg-[#F5F2EA] rounded-xl p-2.5 border border-[#E2DACB]">
                <div className="flex items-center space-x-1.5 font-label text-[10px] text-[#5E5444] mb-0.5">
                  <Target className="w-3.5 h-3.5 text-[#C4501F]" />
                  <span>REMAINING</span>
                </div>
                <div className="font-score-m text-lg text-[#2B2324]">
                  {fmtRemainingWeight(currentWeight, goalWeight)}
                </div>
                <div className="font-caption text-[11px] text-[#5E5444]">To goal target</div>
              </div>

              <div className="bg-[#F5F2EA] rounded-xl p-2.5 border border-[#E2DACB]">
                <div className="flex items-center space-x-1.5 font-label text-[10px] text-[#5E5444] mb-0.5">
                  <Activity className="w-3.5 h-3.5 text-[#2B2324]" />
                  <span>BMI</span>
                </div>
                <div className="font-score-m text-lg text-[#2B2324]">
                  {bmiVal.toFixed(1)}
                </div>
                <div className="font-caption text-[11px] text-[#5E5444]">
                  {bmiCategory}
                </div>
              </div>

              <div className="bg-[#F5F2EA] rounded-xl p-2.5 border border-[#E2DACB]">
                <div className="flex items-center space-x-1.5 font-label text-[10px] text-[#5E5444] mb-0.5">
                  <Award className="w-3.5 h-3.5 text-[#C4501F]" />
                  <span>CALORIE GOAL</span>
                </div>
                <div className="font-score-m text-lg text-[#2B2324]">
                  {settings.dailyCalorieTarget || 2200}
                </div>
                <div className="font-caption text-[11px] text-[#5E5444]">kcal / day</div>
              </div>
            </div>
          </div>

          {/* S1: Weight Trend Chart (7D / 30D / 90D) */}
          <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2DACB]/60">
              <div>
                <div className="font-title text-sm text-[#2B2324]">Weight Trend</div>
                <div className="font-caption text-[11px] text-[#5E5444]">Progress toward {goalWeight} kg</div>
              </div>

              {/* Range Toggle */}
              <div className="flex items-center gap-1 bg-[#EEE9DD] p-0.5 rounded-lg border border-[#E2DACB]">
                {(['7D', '30D', '90D'] as const).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      triggerHaptic(8);
                      setWeightRange(r);
                    }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-button-s transition-all ${
                      weightRange === r
                        ? 'bg-white text-[#2B2324] font-bold shadow-2xs'
                        : 'text-[#5E5444]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Log Weight Action */}
            <div className="flex items-center justify-between pt-1 pb-2">
              <span className="font-caption text-xs text-[#5E5444]">
                Current: <strong className="text-[#2B2324]">{currentWeight} kg</strong>
              </span>

              {!showQuickWeight ? (
                <button
                  type="button"
                  onClick={() => setShowQuickWeight(true)}
                  className="font-button-s text-xs text-[#C4501F] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log weight</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="kg"
                    value={quickWeightInput}
                    onChange={(e) => setQuickWeightInput(e.target.value)}
                    className="w-16 px-2 py-1 text-xs border border-[#E2DACB] rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const val = parseFloat(quickWeightInput);
                      if (!isNaN(val) && val > 30 && val < 300) {
                        onSaveWeight?.(val);
                        setShowQuickWeight(false);
                        setQuickWeightInput('');
                        onShowToast(`Weight saved: ${val} kg`);
                      }
                    }}
                    className="px-2 py-1 bg-[#2B2324] text-white font-button-s text-xs rounded-lg"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Weight Visual Trend */}
            <div className="h-28 flex items-end justify-between pt-4 pb-2 border-b border-[#E2DACB] gap-1">
              {weightDataPoints.length > 0 ? (
                weightDataPoints.map((pt, idx) => {
                  const min = goalWeight - 2;
                  const max = startWeight + 2;
                  const pct = Math.max(10, Math.min(95, ((pt.weight - min) / (max - min)) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      <div
                        className="w-full max-w-[14px] bg-[#C4501F] rounded-t-sm transition-all"
                        style={{ height: `${pct}%` }}
                        title={`${pt.dateStr}: ${pt.weight} kg`}
                      />
                      <span className="text-[9px] font-caption text-[#5E5444] mt-1 truncate">
                        {pt.dateStr.slice(8)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#5E5444]">
                  <span className="font-caption text-xs">No weigh-ins in this period.</span>
                  <span className="font-caption text-[11px] text-[#5E5444]/70">Tap "Log weight" to record today's mass.</span>
                </div>
              )}
            </div>
          </div>

          {/* B1: Consistency Trend Chart (Trailing 7 Days Ending Today, No Future Days!) */}
          <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2DACB]/60">
              <div>
                <div className="font-title text-sm text-[#2B2324]">Consistency Trend</div>
                <div className="font-caption text-[11px] text-[#5E5444]">
                  Past 7 days · Orange = reached 80%
                </div>
              </div>
              <span className="font-label text-[10px] text-[#C4501F] bg-[#FBE8DE] px-2 py-0.5 rounded border border-[#E2DACB]">
                80% Target
              </span>
            </div>

            {/* Plot Container */}
            <div className="relative pt-6 pb-2">
              {/* 80% Dashed Target Line (B1: label placed outside plot) */}
              <div
                className="absolute left-0 right-0 border-b-2 border-dashed border-[#C4501F]/80 z-10 pointer-events-none"
                style={{ bottom: `${0.8 * 110 + 24}px` }}
              />

              {/* 7 Trailing Days Bars (B1) */}
              <div className="grid grid-cols-7 gap-2 h-[120px] items-end border-b border-[#E2DACB]">
                {trailingDays.map((d, idx) => {
                  const hasScore = d.score !== null;
                  const isMet = hasScore && (d.score || 0) >= 80;
                  const barH = hasScore ? Math.max(8, ((d.score || 0) / 100) * 110) : 4;

                  return (
                    <div key={idx} className="flex flex-col items-center justify-end h-full">
                      <div
                        className={`w-full max-w-[20px] rounded-t-md transition-all duration-300 ${
                          !hasScore
                            ? 'bg-[#EEE9DD] border border-[#E2DACB]'
                            : isMet
                            ? 'bg-[#C4501F]'
                            : 'bg-[#2B2324]'
                        }`}
                        style={{ height: `${barH}px` }}
                        title={`${d.label}: ${hasScore ? `${d.score}%` : 'No log'}`}
                      />
                      <div className="text-[10px] font-number font-bold text-[#2B2324] mt-1 leading-none">
                        {hasScore ? `${d.score}%` : '--'}
                      </div>
                      <div className="text-[9px] font-caption text-[#5E5444] mt-0.5 leading-none">
                        {d.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 2. BODY MEASUREMENTS VIEW */}
      {/* ======================================================== */}
      {activeSegment === 'body' && (
        <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2DACB]/60">
            <div>
              <div className="font-title text-sm text-[#2B2324]">Body Measurements</div>
              <div className="font-caption text-[11px] text-[#5E5444]">Weekly circumference log (cm)</div>
            </div>
            <button
              type="button"
              onClick={() => setShowMeasureForm(!showMeasureForm)}
              className="px-3 py-1.5 btn-ember rounded-xl font-button-s text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showMeasureForm ? 'Close' : 'Log Entry'}</span>
            </button>
          </div>

          {showMeasureForm && (
            <form onSubmit={handleSaveMeasurement} className="space-y-3 p-3 bg-[#F5F2EA] rounded-xl border border-[#E2DACB]">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-label text-[10px] text-[#5E5444] block mb-0.5">Body Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="20.0"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    className="w-full bg-white border border-[#E2DACB] rounded-xl px-2.5 py-1 text-xs text-[#2B2324]"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] text-[#5E5444] block mb-0.5">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="98.0"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    className="w-full bg-white border border-[#E2DACB] rounded-xl px-2.5 py-1 text-xs text-[#2B2324]"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] text-[#5E5444] block mb-0.5">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="84.0"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    className="w-full bg-white border border-[#E2DACB] rounded-xl px-2.5 py-1 text-xs text-[#2B2324]"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] text-[#5E5444] block mb-0.5">Hips (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="96.0"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    className="w-full bg-white border border-[#E2DACB] rounded-xl px-2.5 py-1 text-xs text-[#2B2324]"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] text-[#5E5444] block mb-0.5">Arms (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="36.0"
                    value={arms}
                    onChange={(e) => setArms(e.target.value)}
                    className="w-full bg-white border border-[#E2DACB] rounded-xl px-2.5 py-1 text-xs text-[#2B2324]"
                  />
                </div>
                <div>
                  <label className="font-label text-[10px] text-[#5E5444] block mb-0.5">Thighs (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="58.0"
                    value={thighs}
                    onChange={(e) => setThighs(e.target.value)}
                    className="w-full bg-white border border-[#E2DACB] rounded-xl px-2.5 py-1 text-xs text-[#2B2324]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 btn-santiago rounded-xl font-button-s text-xs uppercase"
              >
                Save Measurements to Sheet
              </button>
            </form>
          )}

          <div className="p-3 bg-[#F5F2EA] rounded-xl border border-[#E2DACB] text-xs text-[#5E5444]">
            Measurements sync directly to the Google Sheet tab "Measurements".
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PHOTOS VIEW (Embedded VaultTab, L2 & VA1) */}
      {/* ======================================================== */}
      {activeSegment === 'photos' && (
        <VaultTab
          onOpenPhotoUploader={onOpenPhotoUploader}
          onShowToast={onShowToast}
          onSelectPhotoDetail={onSelectPhotoDetail}
        />
      )}

    </div>
  );
};
