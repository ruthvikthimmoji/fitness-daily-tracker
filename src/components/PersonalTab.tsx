import React, { useState } from 'react';
import { Award, Scale, Lock, Settings as SettingsIcon, Flame, RefreshCw } from 'lucide-react';
import { UserSettings, DashboardKpis, DailyHistoryItem, GamificationState, Measurement, StoredPhoto } from '../types';
import { VaultTab } from './VaultTab';
import { fmtRemainingWeight, toLocalIso, triggerHaptic } from '../utils/formatters';
import { getScriptUrl, setScriptUrl } from '../services/storage';
import { pingGoogleSheet } from '../services/api';

interface PersonalTabProps {
  settings: UserSettings;
  kpis: DashboardKpis;
  history: DailyHistoryItem[];
  gamification?: GamificationState;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onAddMeasurement: (m: Measurement) => void;
  onSaveWeight: (weight: number) => void;
  onShowToast: (msg: string, actionLabel?: string, onAction?: () => void) => void;
  onOpenPhotoUploader?: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
  onSelectPhotoDetail?: (photo: StoredPhoto) => void;
  onOpenBadgesModal?: () => void;
}

export const PersonalTab: React.FC<PersonalTabProps> = ({
  settings,
  kpis,
  history,
  gamification,
  onUpdateSettings,
  onAddMeasurement,
  onSaveWeight,
  onShowToast,
  onOpenPhotoUploader = () => {},
  onSelectPhotoDetail = () => {},
  onOpenBadgesModal
}) => {
  // Top Segmented control: Overview | Body | Vault | Settings
  const [activeSegment, setActiveSegment] = useState<'overview' | 'body' | 'vault' | 'settings'>('overview');

  const [quickWeightInput, setQuickWeightInput] = useState('');
  const [showQuickWeight, setShowQuickWeight] = useState(false);

  // Body Measurements form state
  const [showMeasureForm, setShowMeasureForm] = useState(false);
  const [bodyFat, setBodyFat] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [arms, setArms] = useState('');
  const [hips, setHips] = useState('');
  const [thighs, setThighs] = useState('');

  // Settings form state
  const [urlInput, setUrlInput] = useState(getScriptUrl());
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [urlTestStatus, setUrlTestStatus] = useState<'none' | 'success' | 'error'>('none');
  const [urlTestMessage, setUrlTestMessage] = useState('');

  const [calTargetInput, setCalTargetInput] = useState(String(settings.dailyCalorieTarget || 2200));
  const [proTargetInput, setProTargetInput] = useState(String(settings.dailyProteinTarget || 130));
  const [waterTargetInput, setWaterTargetInput] = useState(String(settings.dailyWaterTarget || 3.0));
  const [stepsTargetInput, setStepsTargetInput] = useState(String(settings.dailyStepsTarget || 10000));
  const [userNameInput, setUserNameInput] = useState(settings.name || 'Athlete');

  // Weight metrics
  const currentWeight = kpis.currentWeight || settings.startWeightKg || 78;
  const startWeight = settings.startWeightKg || 78;
  const goalWeight = settings.goalWeightKg || 72;
  const totalToLose = Math.abs(startWeight - goalWeight) || 1;
  const lostSoFar = Math.max(0, startWeight - currentWeight);
  const weightProgressPct = Math.min(100, Math.round((lostSoFar / totalToLose) * 100));

  // BMI calculation
  const bmiVal = kpis.bmi || (settings.heightCm ? Math.round((currentWeight / ((settings.heightCm / 100) ** 2)) * 10) / 10 : 24.5);
  const bmiCategory = bmiVal < 18.5 ? 'Underweight' : bmiVal < 25 ? 'Normal weight' : bmiVal < 30 ? 'Overweight' : 'Obese';

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
    onShowToast('Measurements saved');
  };

  const handleQuickWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(quickWeightInput);
    if (!isNaN(val) && val > 0) {
      onSaveWeight(val);
      setShowQuickWeight(false);
      setQuickWeightInput('');
      onShowToast(`Weight saved: ${val} kg`);
    }
  };

  const handleTestUrl = async () => {
    if (!urlInput) {
      setUrlTestStatus('error');
      setUrlTestMessage('Please enter a Google Apps Script Web App URL');
      return;
    }
    setIsTestingUrl(true);
    setUrlTestStatus('none');
    try {
      const res = await pingGoogleSheet(urlInput);
      if (res.success) {
        setScriptUrl(urlInput);
        setUrlTestStatus('success');
        setUrlTestMessage('Connected to Google Sheet!');
        onShowToast('Google Sheet connection verified');
      } else {
        setUrlTestStatus('error');
        setUrlTestMessage(res.error || 'Connection failed. Verify Web App deployment.');
      }
    } catch (err: any) {
      setUrlTestStatus('error');
      setUrlTestMessage(err.message || 'Network error');
    } finally {
      setIsTestingUrl(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic(15);
    onUpdateSettings({
      ...settings,
      name: userNameInput,
      dailyCalorieTarget: parseInt(calTargetInput, 10) || 2200,
      dailyProteinTarget: parseInt(proTargetInput, 10) || 130,
      dailyWaterTarget: parseFloat(waterTargetInput) || 3.0,
      dailyStepsTarget: parseInt(stepsTargetInput, 10) || 10000,
    });
    if (urlInput !== getScriptUrl()) {
      setScriptUrl(urlInput);
    }
    onShowToast('Personal settings saved');
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-150 relative">
      
      {/* 1. TOP SEGMENTED CONTROL: Overview | Body | Vault | Settings */}
      <div className="bg-white rounded-2xl p-1.5 border border-[#E8E3D5] shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveSegment('overview');
          }}
          className={`flex-1 py-2 px-2.5 rounded-xl font-button-s text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeSegment === 'overview'
              ? 'bg-[#FF5B04] text-white shadow-sm font-bold'
              : 'text-[#526673] hover:text-[#16232B] hover:bg-[#FFFFF0]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveSegment('body');
          }}
          className={`flex-1 py-2 px-2.5 rounded-xl font-button-s text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeSegment === 'body'
              ? 'bg-[#075056] text-white shadow-sm font-bold'
              : 'text-[#526673] hover:text-[#16232B] hover:bg-[#FFFFF0]'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Body</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveSegment('vault');
          }}
          className={`flex-1 py-2 px-2.5 rounded-xl font-button-s text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeSegment === 'vault'
              ? 'bg-[#16232B] text-white shadow-sm font-bold'
              : 'text-[#526673] hover:text-[#16232B] hover:bg-[#FFFFF0]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Vault</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic(10);
            setActiveSegment('settings');
          }}
          className={`flex-1 py-2 px-2.5 rounded-xl font-button-s text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeSegment === 'settings'
              ? 'bg-[#16232B] text-white shadow-sm font-bold'
              : 'text-[#526673] hover:text-[#16232B] hover:bg-[#FFFFF0]'
          }`}
        >
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* SEGMENT 1: OVERVIEW & BADGES                                         */}
      {/* ==================================================================== */}
      {activeSegment === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* User Profile Card */}
          <div className="bg-white rounded-3xl p-4 border border-[#E8E3D5] shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF5B04] to-[#FF7529] text-white font-bold text-lg flex items-center justify-center shadow-sm">
                {(settings.name || 'A').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="font-h2 text-lg text-[#16232B] leading-tight">
                  {settings.name || 'Athlete'}
                </h2>
                <div className="font-caption text-xs text-[#526673] flex items-center gap-2 mt-0.5">
                  <span className="font-bold text-[#FF5B04]">Level {gamification?.level || 1}</span>
                  <span>·</span>
                  <span>{gamification?.levelTitle || 'Beginner'}</span>
                </div>
              </div>
            </div>

            {/* Streak Chip */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF0E8] border border-[#FF5B04]/30 text-[#FF5B04]">
              <Flame className="w-4 h-4 fill-[#FF5B04]" />
              <span className="font-score-m text-sm">{gamification?.streak || 0}</span>
              <span className="font-caption text-[10px] font-bold">DAYS</span>
            </div>
          </div>

          {/* XP Progress Bar */}
          {gamification && (
            <div className="bg-white rounded-2xl p-4 border border-[#E8E3D5] shadow-2xs">
              <div className="flex justify-between font-caption text-xs mb-1.5">
                <span className="text-[#16232B] font-bold">XP Progress</span>
                <span className="text-[#526673]">{gamification.currentLevelXp} / {gamification.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#FFFFF0] overflow-hidden p-0.5">
                <div
                  style={{ width: `${Math.min(100, Math.round((gamification.currentLevelXp / gamification.nextLevelXp) * 100))}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#FF5B04] to-[#FF7529] transition-all duration-300"
                />
              </div>
            </div>
          )}

          {/* All-Time Stats Highlights */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-white rounded-2xl p-3.5 border border-[#E8E3D5] shadow-2xs">
              <div className="font-caption text-[11px] text-[#526673]">Total Days Tracked</div>
              <div className="font-score-m text-xl text-[#16232B] mt-1">
                {history.length || 1} <span className="text-xs text-[#526673]">days</span>
              </div>
              <div className="font-caption text-[10px] text-[#075056] font-bold mt-0.5">Consistent discipline</div>
            </div>

            <div className="bg-white rounded-2xl p-3.5 border border-[#E8E3D5] shadow-2xs">
              <div className="font-caption text-[11px] text-[#526673]">Best Streak</div>
              <div className="font-score-m text-xl text-[#FF5B04] mt-1">
                {gamification?.bestStreak || gamification?.streak || 0} <span className="text-xs text-[#526673]">days</span>
              </div>
              <div className="font-caption text-[10px] text-[#526673] mt-0.5">Personal record</div>
            </div>
          </div>

          {/* Badges Collection Showcase */}
          {gamification?.badges && gamification.badges.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-[#E8E3D5] shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#FF5B04]" />
                  <span className="font-title text-sm text-[#16232B]">Badges & Achievements</span>
                </div>
                {onOpenBadgesModal && (
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic(10);
                      onOpenBadgesModal();
                    }}
                    className="font-button-s text-xs text-[#FF5B04] hover:underline"
                  >
                    View all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {gamification.badges.slice(0, 6).map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      badge.unlocked
                        ? 'bg-gradient-to-b from-[#FFF0E8] to-white border-[#FF5B04]/40 shadow-2xs'
                        : 'bg-[#FFFFF0]/40 border-[#E8E3D5] opacity-50'
                    }`}
                  >
                    <div className="text-xl mb-1">{badge.icon}</div>
                    <div className="font-title text-[11px] text-[#16232B] truncate">{badge.title}</div>
                    <div className="font-caption text-[9px] text-[#526673] truncate mt-0.5">
                      {badge.unlocked ? 'Unlocked' : `${badge.progress}/${badge.maxProgress}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================================== */}
      {/* SEGMENT 2: BODY & METRICS                                            */}
      {/* ==================================================================== */}
      {activeSegment === 'body' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Weight Goal Progress Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E3D5] shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-label text-[10px] text-[#526673] tracking-wider uppercase">
                Goal Progress
              </span>
              <span className="font-caption text-xs text-[#075056] font-bold">
                {fmtRemainingWeight(currentWeight, goalWeight)}
              </span>
            </div>

            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="font-score-xl text-3xl text-[#16232B]">{currentWeight}</span>
                <span className="font-title text-sm text-[#526673] ml-1">kg current</span>
              </div>
              <div className="text-right">
                <span className="font-caption text-xs text-[#526673] block">Goal: {goalWeight} kg</span>
                <span className="font-caption text-[11px] text-[#FF5B04]">Start: {startWeight} kg</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-[#FFFFF0] overflow-hidden p-0.5">
              <div
                style={{ width: `${weightProgressPct}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#075056] to-[#FF5B04] transition-all"
              />
            </div>
          </div>

          {/* Quick Weight Logger Bar */}
          <div className="bg-white rounded-2xl p-3.5 border border-[#E8E3D5] shadow-2xs flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-[#FFF0E8] text-[#FF5B04]">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <span className="font-title text-xs text-[#16232B]">Log Today's Weight</span>
                <span className="font-caption text-[11px] text-[#526673] block">Keep track of morning weigh-ins</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowQuickWeight(!showQuickWeight)}
              className="px-3 py-1.5 rounded-xl bg-[#FF5B04] text-white font-button-s text-xs shadow-xs hover:scale-105 active:scale-95 transition-all"
            >
              {showQuickWeight ? 'Cancel' : 'Log'}
            </button>
          </div>

          {showQuickWeight && (
            <form onSubmit={handleQuickWeightSubmit} className="bg-white rounded-2xl p-3 border border-[#E8E3D5] flex gap-2 animate-in fade-in">
              <input
                type="number"
                step="0.1"
                placeholder="Weight in kg (e.g. 74.5)"
                value={quickWeightInput}
                onChange={(e) => setQuickWeightInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#FFFFF0]/40 border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#FF5B04] text-white font-button-s text-xs"
              >
                Save
              </button>
            </form>
          )}

          {/* BMI Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E3D5] shadow-2xs flex items-center justify-between">
            <div>
              <div className="font-caption text-[11px] text-[#526673]">Body Mass Index</div>
              <div className="font-score-m text-xl text-[#16232B] mt-1">
                {bmiVal} <span className="text-xs text-[#075056] font-bold">({bmiCategory})</span>
              </div>
              <div className="font-caption text-[10px] text-[#526673] mt-0.5">
                Height: {settings.heightCm || 175} cm
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#E6F2F3] text-[#075056] flex items-center justify-center font-bold text-sm">
              BMI
            </div>
          </div>

          {/* Body Measurements Section */}
          <div className="bg-white rounded-2xl p-4 border border-[#E8E3D5] shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="font-title text-sm text-[#16232B]">Circumference & Body Fat</span>
              <button
                type="button"
                onClick={() => setShowMeasureForm(!showMeasureForm)}
                className="font-button-s text-xs text-[#075056] hover:underline"
              >
                {showMeasureForm ? 'Cancel' : '+ Update'}
              </button>
            </div>

            {showMeasureForm ? (
              <form onSubmit={handleSaveMeasurement} className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-caption text-[10px] text-[#526673] block mb-1">Body Fat %</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 15.5"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                    />
                  </div>
                  <div>
                    <label className="font-caption text-[10px] text-[#526673] block mb-1">Chest (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 98"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                    />
                  </div>
                  <div>
                    <label className="font-caption text-[10px] text-[#526673] block mb-1">Waist (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 82"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                    />
                  </div>
                  <div>
                    <label className="font-caption text-[10px] text-[#526673] block mb-1">Arms (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 36"
                      value={arms}
                      onChange={(e) => setArms(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                    />
                  </div>
                  <div>
                    <label className="font-caption text-[10px] text-[#526673] block mb-1">Hips (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 95"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                    />
                  </div>
                  <div>
                    <label className="font-caption text-[10px] text-[#526673] block mb-1">Thighs (cm)</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 56"
                      value={thighs}
                      onChange={(e) => setThighs(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#075056] text-white font-button-s text-xs mt-2"
                >
                  Save Measurements
                </button>
              </form>
            ) : (
              <p className="font-caption text-xs text-[#526673]">
                Track waist, chest, arms and body fat percentage to verify body recomposition beyond scale weight.
              </p>
            )}
          </div>

        </div>
      )}

      {/* ==================================================================== */}
      {/* SEGMENT 3: PHOTO VAULT                                               */}
      {/* ==================================================================== */}
      {activeSegment === 'vault' && (
        <div className="animate-in fade-in duration-150">
          <VaultTab
            onOpenPhotoUploader={onOpenPhotoUploader}
            onSelectPhotoDetail={onSelectPhotoDetail}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* ==================================================================== */}
      {/* SEGMENT 4: SETTINGS                                                  */}
      {/* ==================================================================== */}
      {activeSegment === 'settings' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          <form onSubmit={handleSaveSettings} className="space-y-4">
            
            {/* Google Sheets Connection */}
            <div className="bg-white rounded-2xl p-4 border border-[#E8E3D5] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-title text-sm text-[#16232B]">Google Sheet Sync</span>
                <span className="font-label text-[10px] text-[#075056] font-bold">2-Way Live Sync</span>
              </div>

              <div>
                <label className="font-caption text-[11px] text-[#526673] block mb-1">
                  Google Apps Script Web App URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E3D5] text-xs font-mono text-[#16232B]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestUrl}
                  disabled={isTestingUrl}
                  className="px-3.5 py-1.5 rounded-xl bg-[#16232B] text-white font-button-s text-xs flex items-center gap-1.5"
                >
                  {isTestingUrl ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <span>Test Connection</span>
                  )}
                </button>
              </div>

              {urlTestMessage && (
                <div className={`p-2.5 rounded-xl text-xs font-caption ${
                  urlTestStatus === 'success' ? 'bg-[#E6F2F3] text-[#075056]' : 'bg-[#FFF0E8] text-[#D32F2F]'
                }`}>
                  {urlTestMessage}
                </div>
              )}
            </div>

            {/* Daily Targets Configuration */}
            <div className="bg-white rounded-2xl p-4 border border-[#E8E3D5] shadow-2xs space-y-3">
              <span className="font-title text-sm text-[#16232B] block">Daily Targets</span>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-caption text-[11px] text-[#526673] block mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={calTargetInput}
                    onChange={(e) => setCalTargetInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                  />
                </div>
                <div>
                  <label className="font-caption text-[11px] text-[#526673] block mb-1">Protein (g)</label>
                  <input
                    type="number"
                    value={proTargetInput}
                    onChange={(e) => setProTargetInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                  />
                </div>
                <div>
                  <label className="font-caption text-[11px] text-[#526673] block mb-1">Water (Litres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={waterTargetInput}
                    onChange={(e) => setWaterTargetInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                  />
                </div>
                <div>
                  <label className="font-caption text-[11px] text-[#526673] block mb-1">Steps Target</label>
                  <input
                    type="number"
                    value={stepsTargetInput}
                    onChange={(e) => setStepsTargetInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                  />
                </div>
              </div>
            </div>

            {/* Profile Config */}
            <div className="bg-white rounded-2xl p-4 border border-[#E8E3D5] shadow-2xs space-y-3">
              <span className="font-title text-sm text-[#16232B] block">Personal Profile</span>
              <div>
                <label className="font-caption text-[11px] text-[#526673] block mb-1">Your Name</label>
                <input
                  type="text"
                  value={userNameInput}
                  onChange={(e) => setUserNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E3D5] text-xs font-semibold text-[#16232B]"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#FF5B04] text-white font-button-l text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              Save Personal Settings
            </button>

          </form>

          {/* App Info & Splash Screen Emblem Footer */}
          <div className="pt-6 pb-4 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-[#16232B] p-2.5 flex items-center justify-center shadow-xs border border-white/10 mb-2">
              <img src="/logo-white.png" alt="DAILY/FIT" className="w-full h-full object-contain filter drop-shadow-2xs" />
            </div>
            <div className="flex items-baseline space-x-1.5 justify-center">
              <span className="font-display text-lg tracking-widest text-[#16232B]">DAILY</span>
              <span className="font-display text-lg tracking-widest text-[#FF5B04]">/ FIT</span>
            </div>
            <p className="font-caption text-xs text-[#526673] mt-0.5">Version 2.4 · Progress, not perfection.</p>
          </div>

        </div>
      )}

    </div>
  );
};
