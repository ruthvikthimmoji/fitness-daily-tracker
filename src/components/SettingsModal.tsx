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
    onShowToast('App link copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border border-[#BFBFBF] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#BFBFBF]/60">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-[#EAF2F5] text-[#1F4E5F] border border-[#BFBFBF]/60">
              <SettingsIcon className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1F4E5F]">Settings & Sheet Connection</h2>
              <div className="text-[11px] text-[#595959] italic">Manage Google Sheet sync and targets</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#595959] hover:text-[#1A1A1A] rounded-lg hover:bg-[#EAF2F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-4 pt-3.5">
          
          {/* 1. Google Apps Script Web App URL */}
          <div className="bg-[#EAF2F5] p-3.5 rounded-xl border border-[#BFBFBF]/80">
            <label className="text-xs font-bold text-[#1F4E5F] flex items-center justify-between mb-1.5">
              <span className="flex items-center space-x-1.5">
                <Link2 className="w-3.5 h-3.5 text-[#2E75B6]" />
                <span>Google Apps Script Web App URL</span>
              </span>
              <a
                href="https://docs.google.com/spreadsheets/d/1g-LrMb2Efx4OiISCcNV9r6qosiarYu3hQ_4H4RHRt28/edit"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#2E75B6] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Open Sheet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>

            <div className="space-y-2">
              <input
                type="url"
                placeholder="https://script.google.com/macros/s/.../exec"
                value={scriptUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-3 py-2 text-xs text-[#2E75B6] font-mono font-bold placeholder-[#7F7F7F] focus:outline-none focus:border-[#2E75B6]"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || !scriptUrl.trim()}
                  className="flex-1 py-2 bg-[#1F4E5F] hover:bg-[#163a47] active:scale-95 disabled:opacity-50 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center space-x-1.5"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
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
                  className={`p-2.5 rounded-lg text-xs flex items-start space-x-2 border ${
                    testResult.success
                      ? 'bg-[#C6EFCE] border-[#2E7D32] text-[#2E7D32]'
                      : 'bg-[#F8CBAD] border-[#C00000] text-[#C00000]'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">
                      {testResult.success ? 'Connected Successfully!' : 'Connection Error'}
                    </div>
                    <div className="text-[11px] mt-0.5">
                      {testResult.success
                        ? `Connected to: "${testResult.sheetName}"`
                        : testResult.error}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Open on Phone / QR Code Section */}
          <div className="bg-[#EAF2F5] p-3.5 rounded-xl border border-[#BFBFBF]/80">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1F4E5F]">
                <QrCode className="w-4 h-4 text-[#2E75B6]" />
                <span>Open on Your Mobile Phone</span>
              </div>
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="text-[11px] text-[#2E75B6] font-bold hover:underline"
              >
                {showQr ? 'Hide QR' : 'Show QR'}
              </button>
            </div>

            <div className="text-[11px] text-[#595959] mb-2.5">
              Scan with your iPhone Camera or Android scanner to open this mobile tracker immediately.
            </div>

            {showQr && (
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl mb-2.5 border border-[#BFBFBF] shadow-xs">
                <QRCodeSVG value={currentAppUrl} size={160} level="M" />
                <span className="text-[11px] text-[#595959] font-bold mt-2">Scan with Phone Camera</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={currentAppUrl}
                className="flex-1 bg-white border border-[#BFBFBF] rounded-lg px-2.5 py-1.5 text-xs text-[#595959] font-mono"
              />
              <button
                type="button"
                onClick={copyAppUrl}
                className="p-2 bg-[#1F4E5F] text-white hover:bg-[#163a47] rounded-lg transition-all"
                title="Copy URL"
              >
                {copied ? <Check className="w-4 h-4 text-[#C6EFCE]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. Personal Goals (from Settings Sheet) */}
          <div className="bg-[#EAF2F5] p-3.5 rounded-xl border border-[#BFBFBF]/80 space-y-2.5">
            <div className="text-xs font-bold text-[#1F4E5F]">Personal Targets (from Settings Sheet)</div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#595959] font-bold block mb-0.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#595959] font-bold block mb-0.5">Daily Calorie Target (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#595959] font-bold block mb-0.5">Protein Target (g)</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#595959] font-bold block mb-0.5">Water Target (L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#595959] font-bold block mb-0.5">Daily Steps Target</label>
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#595959] font-bold block mb-0.5">Sleep Target (hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleep}
                  onChange={(e) => setSleep(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#595959] font-bold block mb-0.5">Starting Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={startWeight}
                  onChange={(e) => setStartWeight(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#595959] font-bold block mb-0.5">Goal Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  className="w-full bg-[#FFF9DB] border border-[#BFBFBF] rounded-lg px-2.5 py-1 text-xs text-[#2E75B6] font-bold"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#1F4E5F] hover:bg-[#163a47] active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs transition-all"
          >
            Save Settings & Targets
          </button>
        </form>

      </div>
    </div>
  );
};
