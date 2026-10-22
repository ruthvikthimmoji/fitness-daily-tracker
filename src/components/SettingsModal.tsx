import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Link2, CheckCircle2, AlertCircle, RefreshCw, QrCode, ExternalLink, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { UserSettings } from '../types';
import { pingGoogleSheet } from '../services/api';
import { setScriptUrl, getScriptUrl } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSaveSettings: (settings: UserSettings) => void;
  onShowToast: (msg: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onShowToast
}) => {
  const [scriptUrl, setLocalUrl] = useState(getScriptUrl());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string; sheetName?: string; error?: string } | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);

  // Targets state
  const [name, setName] = useState(settings.name || '');
  const [calories, setCalories] = useState(String(settings.dailyCalorieTarget || 2200));
  const [protein, setProtein] = useState(String(settings.dailyProteinTarget || 130));
  const [water, setWater] = useState(String(settings.dailyWaterTarget || 3.0));
  const [steps, setSteps] = useState(String(settings.dailyStepsTarget || 10000));
  const [sleep, setSleep] = useState(String(settings.dailySleepTarget || 7.5));
  const [startWeight, setStartWeight] = useState(String(settings.startWeightKg || 78));
  const [goalWeight, setGoalWeight] = useState(String(settings.goalWeightKg || 72));

  if (!isOpen) return null;

  const currentAppUrl = window.location.href;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const cleanedUrl = scriptUrl.trim();
    setScriptUrl(cleanedUrl);

    const res = await pingGoogleSheet(cleanedUrl);
    setIsTesting(false);
    setTestResult(res);

    if (res.success) {
      onShowToast(`Connected to ${res.sheetName || 'Google Sheet'}!`);
    } else {
      onShowToast(res.error || 'Connection failed');
    }
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setScriptUrl(scriptUrl.trim());

    onSaveSettings({
      ...settings,
      name: name.trim() || 'Fitness Hero',
      dailyCalorieTarget: parseInt(calories, 10) || 2200,
      dailyProteinTarget: parseInt(protein, 10) || 130,
      dailyWaterTarget: parseFloat(water) || 3.0,
      dailyStepsTarget: parseInt(steps, 10) || 10000,
      dailySleepTarget: parseFloat(sleep) || 7.5,
      startWeightKg: parseFloat(startWeight) || 78.0,
      goalWeightKg: parseFloat(goalWeight) || 72.0
    });

    onShowToast('Settings and goals saved!');
    onClose();
  };

  const copyAppUrl = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('App URL copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-800 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Settings & Google Sheets Sync</h2>
              <div className="text-[11px] text-slate-400">Manage backend connection & personal goals</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-5 pt-4">
          
          {/* 1. Google Apps Script Web App URL */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <label className="text-xs font-bold text-white flex items-center justify-between mb-1.5">
              <span className="flex items-center space-x-1.5">
                <Link2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Apps Script Web App URL</span>
              </span>
              <a
                href="https://docs.google.com/spreadsheets/d/1g-LrMb2Efx4OiISCcNV9r6qosiarYu3hQ_4H4RHRt28/edit"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Open Sheet</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </label>

            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={scriptUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !scriptUrl.trim()}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-50 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center space-x-1.5"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start space-x-2 border ${
                    testResult.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">
                      {testResult.success ? 'Connected Successfully!' : 'Connection Error'}
                    </div>
                    <div className="text-[11px] opacity-90 mt-0.5">
                      {testResult.success
                        ? `Spreadsheet: "${testResult.sheetName}"`
                        : testResult.error}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400">
              💡 <strong>Quick Setup:</strong> In your Google Sheet, click <em>Extensions &gt; Apps Script</em>, paste the provided <code className="text-emerald-400">Code.gs</code>, click <em>Deploy &gt; New deployment &gt; Web app</em> (Execute as: Me, Who has access: Anyone), and paste the URL here.
            </div>
          </div>

          {/* 2. Mobile Open / QR Code Section */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-white">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Open on Your Phone</span>
              </div>
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="text-[11px] text-cyan-400 font-semibold hover:underline"
              >
                {showQr ? 'Hide QR' : 'Show QR Code'}
              </button>
            </div>

            <div className="text-xs text-slate-400 mb-3">
              Scan this QR code with your iPhone Camera or Android scanner to open the app on your mobile device immediately.
            </div>

            {showQr && (
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl mb-3 shadow-lg">
                <QRCodeSVG value={currentAppUrl} size={180} level="M" />
                <span className="text-[11px] text-slate-800 font-semibold mt-2">Scan with Phone Camera</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentAppUrl}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-400 font-mono"
              />
              <button
                type="button"
                onClick={copyAppUrl}
                className="p-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl border border-slate-700"
                title="Copy URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. Daily Goals & Targets */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="text-xs font-bold text-white">Personal Targets (from Settings Sheet)</div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Calorie Target (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Protein Target (g)</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Water Target (L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Steps Target</label>
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Sleep Target (hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleep}
                  onChange={(e) => setSleep(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Starting Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={startWeight}
                  onChange={(e) => setStartWeight(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Goal Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-95 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition-all"
          >
            Save Settings & Targets
          </button>
        </form>

      </div>
    </div>
  );
};
