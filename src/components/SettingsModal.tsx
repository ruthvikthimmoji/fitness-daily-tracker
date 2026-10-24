import React, { useState } from 'react';
import { X, Settings as SettingsIcon, Link2, CheckCircle2, AlertCircle, RefreshCw, QrCode, ExternalLink, Copy, Check, Smartphone } from 'lucide-react';
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
  onOpenInstall?: () => void;
  isStandalone?: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onShowToast,
  onOpenInstall,
  isStandalone = false
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
      name: name.trim() || 'Hero',
      dailyCalorieTarget: parseInt(calories, 10) || 2200,
      dailyProteinTarget: parseInt(protein, 10) || 130,
      dailyWaterTarget: parseFloat(water) || 3.0,
      dailyStepsTarget: parseInt(steps, 10) || 10000,
      dailySleepTarget: parseFloat(sleep) || 7.5,
      startWeightKg: parseFloat(startWeight) || 78.0,
      goalWeightKg: parseFloat(goalWeight) || 72.0
    });

    onShowToast('Settings saved!');
    onClose();
  };

  const copyAppUrl = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onShowToast('App link copied to clipboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border border-[#CADCE0] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#CADCE0]/70">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#E4EEF0] text-[#FF5B04] border border-[#CADCE0]">
              <SettingsIcon className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-label text-[10px] text-[#FF5B04]">
                SETTINGS
              </div>
              <h2 className="font-h2 text-base text-[#16232B]">
                Settings & Sheet Link
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#526673] hover:text-[#16232B] rounded-lg hover:bg-[#E4EEF0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveAll} className="space-y-4 pt-3.5">
          
          {/* 1. Google Apps Script Web App URL */}
          <div className="bg-[#E4EEF0] p-3.5 rounded-xl border border-[#CADCE0]">
            <label className="font-label text-xs text-[#16232B] flex items-center justify-between mb-1.5">
              <span className="flex items-center space-x-1.5">
                <Link2 className="w-3.5 h-3.5 text-[#FF5B04]" />
                <span>Google Apps Script URL</span>
              </span>
              <a
                href="https://docs.google.com/spreadsheets/d/1g-LrMb2Efx4OiISCcNV9r6qosiarYu3hQ_4H4RHRt28/edit"
                target="_blank"
                rel="noreferrer"
                className="font-button-s text-xs text-[#FF5B04] hover:underline flex items-center gap-1"
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
                className="w-full bg-white border border-[#CADCE0] rounded-xl px-3 py-2 font-mono text-xs text-[#16232B] focus:border-[#FF5B04]"
              />

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !scriptUrl.trim()}
                className="w-full py-2 btn-gold-black font-button-s text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FF5B04]" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 text-[#FF5B04]" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>

              {testResult && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-start space-x-2 border font-mono ${
                    testResult.success
                      ? 'bg-green-50 border-green-300 text-green-900'
                      : 'bg-red-50 border-red-300 text-red-900'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  )}
                  <div>
                    <div className="font-bold">
                      {testResult.success ? 'Connected Successfully!' : 'Connection Error'}
                    </div>
                    <div className="text-[11px] mt-0.5">
                      {testResult.success ? `Connected to: "${testResult.sheetName}"` : testResult.error}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Install App & Mobile Phone Section (V8) */}
          {!isStandalone && onOpenInstall && (
            <div className="bg-[#E4EEF0] p-3 rounded-xl border border-[#CADCE0] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-[#FF5B04]" />
                <div>
                  <div className="font-title text-xs text-[#16232B]">Install to Home Screen</div>
                  <div className="font-caption text-[11px] text-[#526673]">Add PWA to iPhone or Android</div>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenInstall}
                className="px-3 py-1 btn-ember font-button-s text-xs rounded-lg"
              >
                Install
              </button>
            </div>
          )}

          {/* 3. Open on Phone / QR Code Section */}
          <div className="bg-[#E4EEF0] p-3.5 rounded-xl border border-[#CADCE0]">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1.5 font-title text-xs text-[#16232B]">
                <QrCode className="w-4 h-4 text-[#FF5B04]" />
                <span>Open on Mobile Phone</span>
              </div>
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="font-button-s text-xs text-[#FF5B04] hover:underline"
              >
                {showQr ? 'Hide QR' : 'Show QR'}
              </button>
            </div>

            <div className="font-caption text-[11px] text-[#526673] mb-2.5">
              Scan with your iPhone Camera or Android scanner to open this mobile tracker immediately.
            </div>

            {showQr && (
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl mb-2.5 border border-[#CADCE0] shadow-2xs">
                <QRCodeSVG value={currentAppUrl} size={150} level="M" />
                <span className="font-caption text-[11px] text-[#526673] mt-2">Scan with Phone Camera</span>
              </div>
            )}

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={currentAppUrl}
                className="flex-1 bg-white border border-[#CADCE0] rounded-xl px-2.5 py-1.5 font-mono text-xs text-[#526673]"
              />
              <button
                type="button"
                onClick={copyAppUrl}
                className="p-2 btn-gold-black rounded-xl transition-all"
                title="Copy URL"
              >
                {copied ? <Check className="w-4 h-4 text-[#FF5B04]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 4. Personal Goals (from Settings Sheet) */}
          <div className="bg-[#E4EEF0] p-3.5 rounded-xl border border-[#CADCE0] space-y-2.5">
            <div className="font-title text-xs text-[#16232B]">Personal Targets</div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-label text-[10px] text-[#526673] block mb-0.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-[#CADCE0] rounded-xl px-2.5 py-1 text-xs text-[#16232B] font-bold"
                />
              </div>

              <div>
                <label className="font-label text-[10px] text-[#526673] block mb-0.5">Calorie Target (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full bg-white border border-[#CADCE0] rounded-xl px-2.5 py-1 text-xs text-[#16232B]"
                />
              </div>

              <div>
                <label className="font-label text-[10px] text-[#526673] block mb-0.5">Protein Target (g)</label>
                <input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full bg-white border border-[#CADCE0] rounded-xl px-2.5 py-1 text-xs text-[#16232B]"
                />
              </div>

              <div>
                <label className="font-label text-[10px] text-[#526673] block mb-0.5">Water Target (L)</label>
                <input
                  type="number"
                  step="0.1"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  className="w-full bg-white border border-[#CADCE0] rounded-xl px-2.5 py-1 text-xs text-[#16232B]"
                />
              </div>

              <div>
                <label className="font-label text-[10px] text-[#526673] block mb-0.5">Daily Steps</label>
                <input
                  type="number"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  className="w-full bg-white border border-[#CADCE0] rounded-xl px-2.5 py-1 text-xs text-[#16232B]"
                />
              </div>

              <div>
                <label className="font-label text-[10px] text-[#526673] block mb-0.5">Sleep (hrs)</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleep}
                  onChange={(e) => setSleep(e.target.value)}
                  className="w-full bg-white border border-[#CADCE0] rounded-xl px-2.5 py-1 text-xs text-[#16232B]"
                />
              </div>

              <div>
                <label className="font-label text-[10px] text-[#526673] block mb-0.5">Starting Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={startWeight}
                  onChange={(e) => setStartWeight(e.target.value)}
                  className="w-full bg-white border border-[#CADCE0] rounded-xl px-2.5 py-1 text-xs text-[#16232B]"
                />
              </div>

              <div>
                <label className="font-label text-[10px] text-[#526673] block mb-0.5">Goal Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={goalWeight}
                  onChange={(e) => setGoalWeight(e.target.value)}
                  className="w-full bg-white border border-[#CADCE0] rounded-xl px-2.5 py-1 text-xs text-[#16232B]"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 btn-ember font-button-l rounded-xl shadow-xs transition-all"
          >
            Save Settings & Targets
          </button>
        </form>

      </div>
    </div>
  );
};
