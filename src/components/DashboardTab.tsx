import React, { useState } from 'react';
import { TrendingUp, Scale, Target, Activity, Award, Plus, ExternalLink } from 'lucide-react';
import { DashboardKpis, DailyHistoryItem, UserSettings, Measurement } from '../types';

interface DashboardTabProps {
  kpis: DashboardKpis;
  history: DailyHistoryItem[];
  settings: UserSettings;
  onAddMeasurement: (m: Measurement) => void;
  sheetUrl?: string;
  onShowToast: (msg: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  kpis,
  history,
  settings,
  onAddMeasurement,
  sheetUrl = 'https://docs.google.com/spreadsheets/d/1g-LrMb2Efx4OiISCcNV9r6qosiarYu3hQ_4H4RHRt28/edit',
  onShowToast
}) => {
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [bodyFat, setBodyFat] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [arms, setArms] = useState('');
  const [thighs, setThighs] = useState('');

  const currentWeight = kpis.currentWeight || settings.startWeightKg;
  const startWeight = settings.startWeightKg || 78;
  const goalWeight = settings.goalWeightKg || 72;
  const totalToLose = Math.abs(startWeight - goalWeight) || 1;
  const lostSoFar = Math.max(0, startWeight - currentWeight);
  const weightProgressPct = Math.min(100, Math.round((lostSoFar / totalToLose) * 100));

  const handleSaveMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

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
    onShowToast('Measurement recorded!');
  };

  return (
    <div className="space-y-4 pb-24">
      
      {/* 1. Body Transformation KPI Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Body Journey</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {currentWeight} <span className="text-sm font-normal text-slate-400">kg Current</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-medium">Goal Weight</div>
            <div className="text-lg font-bold text-emerald-400">{goalWeight} kg</div>
          </div>
        </div>

        {/* Weight Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>Start: {startWeight} kg</span>
            <span className="text-emerald-400 font-bold">{weightProgressPct}% of Goal</span>
            <span>Target: {goalWeight} kg</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, weightProgressPct)}%` }}
            ></div>
          </div>
        </div>

        {/* 4 Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <span>Change So Far</span>
            </div>
            <div className="text-lg font-bold text-white">
              {kpis.changeSoFar >= 0 ? `-${kpis.changeSoFar}` : `+${Math.abs(kpis.changeSoFar)}`} kg
            </div>
            <div className="text-[10px] text-slate-400">Since start date</div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Remaining</span>
            </div>
            <div className="text-lg font-bold text-emerald-400">
              {kpis.remainingToGoal > 0 ? `+${kpis.remainingToGoal}` : kpis.remainingToGoal} kg
            </div>
            <div className="text-[10px] text-slate-400">To target weight</div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>BMI</span>
            </div>
            <div className="text-lg font-bold text-white">{kpis.bmi || 27.0}</div>
            <div className="text-[10px] text-slate-400">Height: {settings.heightCm} cm</div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs mb-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Daily Target</span>
            </div>
            <div className="text-lg font-bold text-amber-400">{settings.dailyCalorieTarget}</div>
            <div className="text-[10px] text-slate-400">kcal daily budget</div>
          </div>
        </div>
      </div>

      {/* 2. Recent 7-Day Consistency Bars */}
      <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-bold text-white">7-Day Consistency</div>
            <div className="text-xs text-slate-400">Daily Scores & Habit Completion</div>
          </div>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>

        {/* Mini 7-day spark bars */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {history.length > 0 ? (
            history.slice(-7).map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-full h-24 bg-slate-800 rounded-xl flex items-end p-1 overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-lg transition-all duration-300"
                    style={{ height: `${Math.max(12, item.dailyScore || 20)}%` }}
                  ></div>
                </div>
                <div className="text-[11px] font-bold text-white mt-1.5">
                  {item.dailyScore > 0 ? `${item.dailyScore}%` : '-'}
                </div>
                <div className="text-[10px] text-slate-400">{item.day || item.date.slice(-2)}</div>
              </div>
            ))
          ) : (
            // Default demo bars
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const scores = [65, 80, 90, 75, 85, 95, 70];
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-full h-24 bg-slate-800/80 rounded-xl flex items-end p-1 overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-lg"
                      style={{ height: `${scores[idx]}%` }}
                    ></div>
                  </div>
                  <div className="text-[11px] font-bold text-white mt-1.5">{scores[idx]}%</div>
                  <div className="text-[10px] text-slate-400">{day}</div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Weekly Body Measurements */}
      <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-bold text-white">Body Measurements (cm)</div>
            <div className="text-xs text-slate-400">Weekly circumference checks</div>
          </div>
          <button
            onClick={() => setShowMeasureForm(!showMeasureForm)}
            className="flex items-center gap-1 text-xs font-bold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1.5 rounded-xl border border-purple-500/30 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showMeasureForm ? 'Close' : 'Log Entry'}</span>
          </button>
        </div>

        {showMeasureForm && (
          <form onSubmit={handleSaveMeasurement} className="space-y-3 pt-2 mb-4 bg-slate-800/50 p-3.5 rounded-2xl border border-slate-700/50">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="20.0"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Chest (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="98.0"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Waist (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="84.0"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Hips (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="96.0"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Arms (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="33.0"
                  value={arms}
                  onChange={(e) => setArms(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Thighs (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="56.0"
                  value={thighs}
                  onChange={(e) => setThighs(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-purple-500 hover:bg-purple-400 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Save to Measurements Sheet
            </button>
          </form>
        )}

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
            <div className="text-[10px] text-slate-400">Chest</div>
            <div className="text-sm font-bold text-white mt-0.5">98.0 cm</div>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
            <div className="text-[10px] text-slate-400">Waist</div>
            <div className="text-sm font-bold text-white mt-0.5">84.0 cm</div>
          </div>
          <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
            <div className="text-[10px] text-slate-400">Arms</div>
            <div className="text-sm font-bold text-white mt-0.5">33.0 cm</div>
          </div>
        </div>
      </div>

      {/* 4. Google Sheets Quick Link Card */}
      <a
        href={sheetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-slate-900/90 hover:bg-slate-800/90 p-4 rounded-2xl border border-slate-800 active:scale-[0.99] transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              GS
            </div>
            <div>
              <div className="text-xs font-bold text-white">Open Connected Google Sheet</div>
              <div className="text-[10px] text-slate-400">View raw formulas, 90-day charts, and full rows</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </div>
      </a>

    </div>
  );
};
