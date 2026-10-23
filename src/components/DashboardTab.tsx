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
    onShowToast('Measurement recorded to sheet!');
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-150">
      
      {/* 1. Body Transformation KPI Hero Card */}
      <div className="specimen-card p-4 border border-[#D8D3C8]">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#D8D3C8]/70">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#EB5E28]">
              // ARCHIVE // BODY TRANSFORMATION
            </div>
            <div className="text-3xl font-display font-black text-[#2C2324] mt-0.5">
              {currentWeight} <span className="text-sm font-mono font-normal text-[#766754]">KG</span>
            </div>
            <div className="text-xs font-mono text-[#766754] mt-0.5">
              Starting: {startWeight} kg • Goal: {goalWeight} kg
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#766754] block">Goal Progress</span>
            <div className="px-2.5 py-1 rounded-xl bg-[#2C2324] text-white font-mono font-black text-sm shadow-xs">
              {weightProgressPct}%
            </div>
          </div>
        </div>

        {/* Weight Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-[#766754] mb-1 font-mono">
            <span>{startWeight} kg</span>
            <span className="text-[#EB5E28] font-bold">{lostSoFar > 0 ? `${lostSoFar.toFixed(1)} kg progress` : '0 kg change'}</span>
            <span>{goalWeight} kg target</span>
          </div>
          <div className="w-full h-2.5 bg-[#EFECE3] rounded-full overflow-hidden border border-[#D8D3C8]">
            <div
              className="h-full bg-[#EB5E28] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, weightProgressPct)}%` }}
            ></div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#EFECE3] rounded-xl p-2.5 border border-[#D8D3C8]">
            <div className="flex items-center space-x-1.5 text-[#766754] text-xs font-mono font-bold mb-1 uppercase">
              <Scale className="w-3.5 h-3.5 text-[#EB5E28]" />
              <span>Change so far</span>
            </div>
            <div className="text-xl font-display font-black text-[#2C2324]">
              {kpis.changeSoFar >= 0 ? `-${kpis.changeSoFar}` : `+${Math.abs(kpis.changeSoFar)}`} kg
            </div>
            <div className="text-[10px] font-mono text-[#766754]">Since tracking start</div>
          </div>

          <div className="bg-[#EFECE3] rounded-xl p-2.5 border border-[#D8D3C8]">
            <div className="flex items-center space-x-1.5 text-[#766754] text-xs font-mono font-bold mb-1 uppercase">
              <Target className="w-3.5 h-3.5 text-[#EB5E28]" />
              <span>Remaining</span>
            </div>
            <div className="text-xl font-display font-black text-[#2C2324]">
              {kpis.remainingToGoal > 0 ? `+${kpis.remainingToGoal}` : kpis.remainingToGoal} kg
            </div>
            <div className="text-[10px] font-mono text-[#766754]">To goal target</div>
          </div>

          <div className="bg-[#EFECE3] rounded-xl p-2.5 border border-[#D8D3C8]">
            <div className="flex items-center space-x-1.5 text-[#766754] text-xs font-mono font-bold mb-1 uppercase">
              <Activity className="w-3.5 h-3.5 text-[#2C2324]" />
              <span>BMI</span>
            </div>
            <div className="text-xl font-display font-black text-[#2C2324]">{kpis.bmi || 27.0}</div>
            <div className="text-[10px] font-mono text-[#766754]">Height: {settings.heightCm} cm</div>
          </div>

          <div className="bg-[#EFECE3] rounded-xl p-2.5 border border-[#D8D3C8]">
            <div className="flex items-center space-x-1.5 text-[#766754] text-xs font-mono font-bold mb-1 uppercase">
              <Award className="w-3.5 h-3.5 text-[#EB5E28]" />
              <span>Daily Target</span>
            </div>
            <div className="text-xl font-display font-black text-[#2C2324]">{settings.dailyCalorieTarget}</div>
            <div className="text-[10px] font-mono text-[#766754]">kcal target</div>
          </div>
        </div>
      </div>

      {/* 2. Consistency Trend Chart */}
      <div className="specimen-card p-4 border border-[#D8D3C8]">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#D8D3C8]/70">
          <div>
            <div className="text-sm font-display font-black text-[#2C2324] uppercase">Consistency Trend (%)</div>
            <div className="text-xs font-mono text-[#766754]">Daily score bars vs. 80% baseline target</div>
          </div>
          <TrendingUp className="w-4 h-4 text-[#EB5E28]" />
        </div>

        {/* Clean Specimen Chart with light gridlines and dashed target line */}
        <div className="relative pt-4 pb-1">
          {/* Dashed Target line: Santiago Orange */}
          <div
            className="absolute left-0 right-0 border-b-2 border-dashed border-[#EB5E28] z-10 pointer-events-none"
            style={{ top: '28%' }}
          >
            <span className="absolute -top-3.5 right-0 text-[9px] font-mono font-bold text-[#EB5E28] bg-white px-1">
              80% target
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 h-32 items-end pt-2 border-b border-[#D8D3C8]">
            {history.length > 0 ? (
              history.slice(-7).map((item, idx) => {
                const score = item.dailyScore || 0;
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        score >= 80 ? 'bg-[#EB5E28]' : 'bg-[#2C2324]'
                      }`}
                      style={{ height: `${Math.max(6, score)}%` }}
                      title={`${item.date}: ${score}%`}
                    ></div>
                    <div className="text-[10px] font-mono font-bold text-[#2C2324] mt-1">{score > 0 ? `${score}%` : '-'}</div>
                    <div className="text-[9px] font-mono text-[#766754]">{item.date.slice(5).replace('-', '/')}</div>
                  </div>
                );
              })
            ) : (
              ['22-Oct', '23-Oct', '24-Oct', '25-Oct', '26-Oct', '27-Oct', '28-Oct'].map((dStr, idx) => {
                const sampleScores = [70, 85, 90, 75, 80, 95, 85];
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end">
                    <div
                      className={`w-full rounded-t-md ${
                        sampleScores[idx] >= 80 ? 'bg-[#EB5E28]' : 'bg-[#2C2324]'
                      }`}
                      style={{ height: `${sampleScores[idx]}%` }}
                    ></div>
                    <div className="text-[10px] font-mono font-bold text-[#2C2324] mt-1">{sampleScores[idx]}%</div>
                    <div className="text-[9px] font-mono text-[#766754]">{dStr}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3. Weekly Body Measurements */}
      <div className="specimen-card p-4 border border-[#D8D3C8]">
        <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#D8D3C8]/70">
          <div>
            <div className="text-sm font-display font-black text-[#2C2324] uppercase">Body Measurements (cm)</div>
            <div className="text-xs font-mono text-[#766754]">Weekly circumference log</div>
          </div>
          <button
            onClick={() => setShowMeasureForm(!showMeasureForm)}
            className="flex items-center gap-1 text-xs font-mono font-bold text-[#2C2324] bg-[#EFECE3] hover:bg-[#E5E0D5] px-2.5 py-1.5 rounded-xl border border-[#D8D3C8] transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#EB5E28]" />
            <span>{showMeasureForm ? 'Close' : 'Log Entry'}</span>
          </button>
        </div>

        {showMeasureForm && (
          <form onSubmit={handleSaveMeasurement} className="space-y-3 pt-2 mb-3 bg-[#EFECE3] p-3 rounded-xl border border-[#D8D3C8]">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#766754] font-mono font-bold uppercase">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="20.0"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="w-full bg-white border border-[#D8D3C8] rounded-xl px-2.5 py-1 text-xs text-[#2C2324] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#766754] font-mono font-bold uppercase">Chest (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="98.0"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="w-full bg-white border border-[#D8D3C8] rounded-xl px-2.5 py-1 text-xs text-[#2C2324] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#766754] font-mono font-bold uppercase">Waist (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="84.0"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full bg-white border border-[#D8D3C8] rounded-xl px-2.5 py-1 text-xs text-[#2C2324] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#766754] font-mono font-bold uppercase">Hips (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="96.0"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  className="w-full bg-white border border-[#D8D3C8] rounded-xl px-2.5 py-1 text-xs text-[#2C2324] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#766754] font-mono font-bold uppercase">Arms (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="33.0"
                  value={arms}
                  onChange={(e) => setArms(e.target.value)}
                  className="w-full bg-white border border-[#D8D3C8] rounded-xl px-2.5 py-1 text-xs text-[#2C2324] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#766754] font-mono font-bold uppercase">Thighs (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="56.0"
                  value={thighs}
                  onChange={(e) => setThighs(e.target.value)}
                  className="w-full bg-white border border-[#D8D3C8] rounded-xl px-2.5 py-1 text-xs text-[#2C2324] font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 btn-santiago active:scale-95 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
            >
              Save to Measurements Sheet
            </button>
          </form>
        )}

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#EFECE3] p-2 rounded-xl border border-[#D8D3C8]">
            <div className="text-[10px] font-mono text-[#766754]">Chest</div>
            <div className="text-sm font-display font-black text-[#2C2324] mt-0.5">98.0 cm</div>
          </div>
          <div className="bg-[#EFECE3] p-2 rounded-xl border border-[#D8D3C8]">
            <div className="text-[10px] font-mono text-[#766754]">Waist</div>
            <div className="text-sm font-display font-black text-[#2C2324] mt-0.5">84.0 cm</div>
          </div>
          <div className="bg-[#EFECE3] p-2 rounded-xl border border-[#D8D3C8]">
            <div className="text-[10px] font-mono text-[#766754]">Arms</div>
            <div className="text-sm font-display font-black text-[#2C2324] mt-0.5">33.0 cm</div>
          </div>
        </div>
      </div>

      {/* 4. Google Sheets Quick Link Card */}
      <a
        href={sheetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white hover:bg-[#EFECE3] p-3.5 rounded-2xl border border-[#D8D3C8] active:scale-[0.99] transition-all shadow-xs"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2C2324] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              GS
            </div>
            <div>
              <div className="text-xs font-display font-black text-[#2C2324] uppercase">Open Connected Google Sheet</div>
              <div className="text-[10px] font-mono text-[#766754]">View workbook formulas, raw logs, and full 90-day charts</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-[#766754]" />
        </div>
      </a>

    </div>
  );
};
