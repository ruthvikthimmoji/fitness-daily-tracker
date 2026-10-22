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
    <div className="space-y-4 pb-24">
      
      {/* 1. Body Transformation KPI Hero Card */}
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#595959]">Body Progress</div>
            <div className="text-3xl font-black text-[#1F4E5F] mt-0.5">
              {currentWeight} <span className="text-sm font-semibold text-[#595959]">kg</span>
            </div>
            <div className="text-xs text-[#595959] italic mt-0.5">
              Starting: {startWeight} kg • Goal: {goalWeight} kg
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-[#595959] uppercase">Goal Progress</span>
            <div className="px-2.5 py-1 rounded-lg bg-[#C6EFCE] text-[#2E7D32] border border-[#C6EFCE] font-black text-sm">
              {weightProgressPct}%
            </div>
          </div>
        </div>

        {/* Weight Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-[#595959] mb-1 font-semibold">
            <span>{startWeight} kg</span>
            <span className="text-[#1F77B4]">{lostSoFar > 0 ? `${lostSoFar.toFixed(1)} kg lost` : '0 kg change'}</span>
            <span>{goalWeight} kg target</span>
          </div>
          <div className="w-full h-3 bg-[#EAF2F5] rounded-full overflow-hidden border border-[#BFBFBF]/70">
            <div
              className="h-full bg-[#1F77B4] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, weightProgressPct)}%` }}
            ></div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center space-x-1.5 text-[#595959] text-xs font-bold mb-1">
              <Scale className="w-3.5 h-3.5 text-[#1F77B4]" />
              <span>Change so far</span>
            </div>
            <div className="text-xl font-black text-[#1F4E5F]">
              {kpis.changeSoFar >= 0 ? `-${kpis.changeSoFar}` : `+${Math.abs(kpis.changeSoFar)}`} kg
            </div>
            <div className="text-[10px] text-[#595959]">Since tracking start</div>
          </div>

          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center space-x-1.5 text-[#595959] text-xs font-bold mb-1">
              <Target className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Remaining</span>
            </div>
            <div className="text-xl font-black text-[#1F4E5F]">
              {kpis.remainingToGoal > 0 ? `+${kpis.remainingToGoal}` : kpis.remainingToGoal} kg
            </div>
            <div className="text-[10px] text-[#595959]">To goal weight</div>
          </div>

          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center space-x-1.5 text-[#595959] text-xs font-bold mb-1">
              <Activity className="w-3.5 h-3.5 text-[#7E57C2]" />
              <span>BMI</span>
            </div>
            <div className="text-xl font-black text-[#1F4E5F]">{kpis.bmi || 27.0}</div>
            <div className="text-[10px] text-[#595959]">Height: {settings.heightCm} cm</div>
          </div>

          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center space-x-1.5 text-[#595959] text-xs font-bold mb-1">
              <Award className="w-3.5 h-3.5 text-[#8BC34A]" />
              <span>Daily Target</span>
            </div>
            <div className="text-xl font-black text-[#1F4E5F]">{settings.dailyCalorieTarget}</div>
            <div className="text-[10px] text-[#595959]">kcal target</div>
          </div>
        </div>
      </div>

      {/* 2. Brand Chart: 7-Day Consistency Trend */}
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-bold text-[#1F4E5F]">Consistency trend (%)</div>
            <div className="text-xs text-[#595959] italic">Bars for daily score. Dashed red line for 80% target.</div>
          </div>
          <TrendingUp className="w-4 h-4 text-[#1F4E5F]" />
        </div>

        {/* Clean Brand Chart with light gridlines and dashed target line */}
        <div className="relative pt-4 pb-1">
          {/* Dashed Target line: #C00000 */}
          <div
            className="absolute left-0 right-0 border-b-2 border-dashed border-[#C00000] z-10 pointer-events-none"
            style={{ top: '28%' }}
          >
            <span className="absolute -top-3.5 right-0 text-[9px] font-bold text-[#C00000] bg-white px-1">
              80% target
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 h-32 items-end pt-2 border-b border-[#BFBFBF]">
            {history.length > 0 ? (
              history.slice(-7).map((item, idx) => {
                const score = item.dailyScore || 0;
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end">
                    <div
                      className="w-full bg-[#1F4E5F] rounded-t-sm transition-all duration-300"
                      style={{ height: `${Math.max(6, score)}%` }}
                      title={`${item.date}: ${score}%`}
                    ></div>
                    <div className="text-[10px] font-bold text-[#1A1A1A] mt-1">{score > 0 ? `${score}%` : '-'}</div>
                    <div className="text-[9px] text-[#595959]">{item.date.slice(5).replace('-', '/')}</div>
                  </div>
                );
              })
            ) : (
              ['22-Oct', '23-Oct', '24-Oct', '25-Oct', '26-Oct', '27-Oct', '28-Oct'].map((dStr, idx) => {
                const sampleScores = [70, 85, 90, 75, 80, 95, 85];
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end">
                    <div
                      className="w-full bg-[#1F4E5F] rounded-t-sm"
                      style={{ height: `${sampleScores[idx]}%` }}
                    ></div>
                    <div className="text-[10px] font-bold text-[#1A1A1A] mt-1">{sampleScores[idx]}%</div>
                    <div className="text-[9px] text-[#595959]">{dStr}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 3. Weekly Body Measurements */}
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <div className="text-sm font-bold text-[#1F4E5F]">Body Measurements (cm)</div>
            <div className="text-xs text-[#595959]">Weekly circumference log</div>
          </div>
          <button
            onClick={() => setShowMeasureForm(!showMeasureForm)}
            className="flex items-center gap-1 text-xs font-bold text-[#1F4E5F] bg-[#EAF2F5] hover:bg-[#dfeaf0] px-2.5 py-1.5 rounded-lg border border-[#BFBFBF] transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#2E75B6]" />
            <span>{showMeasureForm ? 'Close' : 'Log Entry'}</span>
          </button>
        </div>

        {showMeasureForm && (
          <form onSubmit={handleSaveMeasurement} className="space-y-3 pt-2 mb-3 bg-[#EAF2F5] p-3 rounded-lg border border-[#BFBFBF]/60">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#595959] font-bold">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="20.0"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#595959] font-bold">Chest (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="98.0"
                  value={chest}
                  onChange={(e) => setChest(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#595959] font-bold">Waist (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="84.0"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#595959] font-bold">Hips (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="96.0"
                  value={hips}
                  onChange={(e) => setHips(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#595959] font-bold">Arms (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="33.0"
                  value={arms}
                  onChange={(e) => setArms(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#595959] font-bold">Thighs (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="56.0"
                  value={thighs}
                  onChange={(e) => setThighs(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#1F4E5F] hover:bg-[#163a47] active:scale-95 text-white font-bold text-xs rounded-lg transition-all"
            >
              Save to Measurements Sheet
            </button>
          </form>
        )}

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#EAF2F5] p-2 rounded-lg border border-[#BFBFBF]/60">
            <div className="text-[10px] text-[#595959]">Chest</div>
            <div className="text-sm font-black text-[#1F4E5F] mt-0.5">98.0 cm</div>
          </div>
          <div className="bg-[#EAF2F5] p-2 rounded-lg border border-[#BFBFBF]/60">
            <div className="text-[10px] text-[#595959]">Waist</div>
            <div className="text-sm font-black text-[#1F4E5F] mt-0.5">84.0 cm</div>
          </div>
          <div className="bg-[#EAF2F5] p-2 rounded-lg border border-[#BFBFBF]/60">
            <div className="text-[10px] text-[#595959]">Arms</div>
            <div className="text-sm font-black text-[#1F4E5F] mt-0.5">33.0 cm</div>
          </div>
        </div>
      </div>

      {/* 4. Google Sheets Quick Link Card */}
      <a
        href={sheetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white hover:bg-[#EAF2F5] p-3.5 rounded-xl border border-[#BFBFBF] active:scale-[0.99] transition-all shadow-xs"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF2F5] text-[#1F4E5F] border border-[#BFBFBF]/60 flex items-center justify-center font-bold text-xs">
              GS
            </div>
            <div>
              <div className="text-xs font-bold text-[#1F4E5F]">Open Connected Google Sheet</div>
              <div className="text-[10px] text-[#595959]">View workbook formulas, raw logs, and full 90-day charts</div>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-[#595959]" />
        </div>
      </a>

    </div>
  );
};
