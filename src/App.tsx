import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayTab } from './components/TodayTab';
import { FoodTab } from './components/FoodTab';
import { WorkoutTab } from './components/WorkoutTab';
import { WorkTab } from './components/WorkTab';
import { DashboardTab } from './components/DashboardTab';
import { SettingsModal } from './components/SettingsModal';
import { InstallModal } from './components/InstallModal';
import { AddFoodModal } from './components/AddFoodModal';
import { AddWorkoutModal } from './components/AddWorkoutModal';
import { AddWorkModal } from './components/AddWorkModal';
import { Toast } from './components/Toast';

import {
  TabType,
  DailyLog,
  FoodItem,
  WorkoutItem,
  WorkItem,
  UserSettings,
  DashboardKpis,
  DailyHistoryItem,
  Measurement
} from './types';

import {
  fetchDailySummary,
  fetchHistory,
  syncDailyLogUpdate,
  syncAddFood,
  syncDeleteFood,
  syncAddWorkout,
  syncDeleteWorkout,
  syncAddWork,
  syncDeleteWork,
  flushPendingQueue
} from './services/api';

import {
  getStoredSettings,
  saveStoredSettings,
  getStoredDailyLog,
  getStoredFoodItems,
  getStoredWorkoutItems,
  getStoredWorkItems,
  getStoredDashboardKpis,
  getStoredHistory,
  getLastSyncTime,
  getScriptUrl
} from './services/storage';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('today');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error' | 'offline'>('idle');
  const [lastSyncTime, setLastSyncTimeState] = useState<string | null>(getLastSyncTime());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Core Data State
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings());
  const [dailyLog, setDailyLog] = useState<DailyLog>(getStoredDailyLog(selectedDate));
  const [foodItems, setFoodItems] = useState<FoodItem[]>(getStoredFoodItems(selectedDate));
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>(getStoredWorkoutItems(selectedDate));
  const [workItems, setWorkItems] = useState<WorkItem[]>(getStoredWorkItems(selectedDate));
  const [kpis, setKpis] = useState<DashboardKpis>(getStoredDashboardKpis());
  const [history, setHistory] = useState<DailyHistoryItem[]>(getStoredHistory());

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodMealPreset, setFoodMealPreset] = useState<string>('Breakfast');
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [workoutTypePreset, setWorkoutTypePreset] = useState<string>('Push');
  const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);
  const [workCategoryPreset, setWorkCategoryPreset] = useState<string>('Work');

  // Check standalone mode
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // Load and refresh summary for date
  const loadDataForDate = useCallback(async (date: string, _forceSync = false) => {
    // 1. Load locally immediately
    setDailyLog(getStoredDailyLog(date));
    setFoodItems(getStoredFoodItems(date));
    setWorkoutItems(getStoredWorkoutItems(date));
    setWorkItems(getStoredWorkItems(date));
    setSettings(getStoredSettings());
    setKpis(getStoredDashboardKpis());

    const hasUrl = !!getScriptUrl();
    if (!hasUrl) {
      setSyncStatus('idle');
      return;
    }

    // 2. Fetch from Google Apps Script
    setSyncStatus('syncing');
    try {
      // Also flush any pending actions
      await flushPendingQueue();

      const res = await fetchDailySummary(date);
      if (res.success) {
        if (res.dailyLog) setDailyLog(res.dailyLog);
        if (res.foodItems) setFoodItems(res.foodItems);
        if (res.workoutItems) setWorkoutItems(res.workoutItems);
        if (res.workItems) setWorkItems(res.workItems);
        if (res.settings) setSettings(res.settings);
        if (res.dashboardKpis) setKpis(res.dashboardKpis);
        setSyncStatus('synced');
        setLastSyncTimeState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        setSyncStatus('offline');
      }

      // Fetch history trends
      const hist = await fetchHistory(14);
      if (hist.length > 0) setHistory(hist);
    } catch {
      setSyncStatus('offline');
    }
  }, []);

  // When date changes
  useEffect(() => {
    loadDataForDate(selectedDate);
  }, [selectedDate, loadDataForDate]);

  // Initial prompt to configure URL if not set
  useEffect(() => {
    const url = getScriptUrl();
    if (!url) {
      // Wait a moment then show helpful tip
      const t = setTimeout(() => {
        showToast('Tip: Link your Google Sheet in Settings to enable sync!');
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  // Daily Score Confetti trigger
  useEffect(() => {
    if (dailyLog.dailyScore >= 100) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [dailyLog.dailyScore]);

  // Update Daily Log
  const handleUpdateDailyLog = async (updates: Partial<DailyLog>) => {
    const nextLog = { ...dailyLog, ...updates };
    setDailyLog(nextLog);

    setSyncStatus('syncing');
    const res = await syncDailyLogUpdate(selectedDate, updates);
    if (res.success) {
      setSyncStatus('synced');
      setLastSyncTimeState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setSyncStatus('offline');
    }
  };

  // Food handlers
  const handleOpenAddFood = (mealPreset = 'Breakfast') => {
    setFoodMealPreset(mealPreset);
    setIsAddFoodOpen(true);
  };

  const handleAddFood = async (food: FoodItem) => {
    setFoodItems((prev) => [...prev, food]);
    setDailyLog((prev) => ({
      ...prev,
      caloriesIn: prev.caloriesIn + (food.calories || 0),
      protein: prev.protein + (food.protein || 0),
      carbs: prev.carbs + (food.carbs || 0),
      fat: prev.fat + (food.fat || 0)
    }));
    showToast(`Added ${food.foodItem}!`);

    setSyncStatus('syncing');
    const res = await syncAddFood(food);
    if (res.success) {
      setSyncStatus('synced');
      setLastSyncTimeState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setSyncStatus('offline');
    }
  };

  const handleDeleteFood = async (food: FoodItem) => {
    setFoodItems((prev) => prev.filter((f) => f !== food));
    setDailyLog((prev) => ({
      ...prev,
      caloriesIn: Math.max(0, prev.caloriesIn - (food.calories || 0)),
      protein: Math.max(0, prev.protein - (food.protein || 0)),
      carbs: Math.max(0, prev.carbs - (food.carbs || 0)),
      fat: Math.max(0, prev.fat - (food.fat || 0))
    }));
    showToast(`Deleted ${food.foodItem}`);

    setSyncStatus('syncing');
    await syncDeleteFood(food);
    setSyncStatus('synced');
  };

  const handleQuickAddFood = (preset: Omit<FoodItem, 'date'>) => {
    handleAddFood({
      ...preset,
      date: selectedDate
    });
  };

  // Workout handlers
  const handleOpenAddWorkout = (typePreset = 'Push') => {
    setWorkoutTypePreset(typePreset);
    setIsAddWorkoutOpen(true);
  };

  const handleAddWorkout = async (workout: WorkoutItem) => {
    const vol = (workout.sets || 0) * (workout.reps || 0) * (workout.weightKg || 0);
    const item = { ...workout, volumeKg: vol };
    setWorkoutItems((prev) => [...prev, item]);
    setDailyLog((prev) => ({
      ...prev,
      workoutDone: true,
      workoutVolume: prev.workoutVolume + vol,
      caloriesBurned: prev.caloriesBurned + (workout.caloriesBurned || 0)
    }));
    showToast(`Logged ${workout.exercise}!`);

    setSyncStatus('syncing');
    const res = await syncAddWorkout(workout);
    if (res.success) {
      setSyncStatus('synced');
      setLastSyncTimeState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setSyncStatus('offline');
    }
  };

  const handleDeleteWorkout = async (workout: WorkoutItem) => {
    const vol = workout.volumeKg || (workout.sets || 0) * (workout.reps || 0) * (workout.weightKg || 0);
    setWorkoutItems((prev) => prev.filter((w) => w !== workout));
    setDailyLog((prev) => ({
      ...prev,
      workoutVolume: Math.max(0, prev.workoutVolume - vol),
      caloriesBurned: Math.max(0, prev.caloriesBurned - (workout.caloriesBurned || 0))
    }));
    showToast(`Deleted ${workout.exercise}`);

    setSyncStatus('syncing');
    await syncDeleteWorkout(workout);
    setSyncStatus('synced');
  };

  const handleQuickAddWorkout = (preset: Omit<WorkoutItem, 'date'>) => {
    handleAddWorkout({
      ...preset,
      date: selectedDate
    });
  };

  // Work handlers
  const handleOpenAddWork = (catPreset = 'Work') => {
    setWorkCategoryPreset(catPreset);
    setIsAddWorkOpen(true);
  };

  const handleAddWork = async (work: WorkItem) => {
    setWorkItems((prev) => [...prev, work]);
    setDailyLog((prev) => ({
      ...prev,
      workHours: prev.workHours + (work.hours || 0)
    }));
    showToast(`Logged task!`);

    setSyncStatus('syncing');
    const res = await syncAddWork(work);
    if (res.success) {
      setSyncStatus('synced');
      setLastSyncTimeState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setSyncStatus('offline');
    }
  };

  const handleDeleteWork = async (work: WorkItem) => {
    setWorkItems((prev) => prev.filter((w) => w !== work));
    setDailyLog((prev) => ({
      ...prev,
      workHours: Math.max(0, prev.workHours - (work.hours || 0))
    }));
    showToast(`Deleted task`);

    setSyncStatus('syncing');
    await syncDeleteWork(work);
    setSyncStatus('synced');
  };

  const handleToggleWorkStatus = (item: WorkItem) => {
    const nextStatus = item.status === 'Done' ? 'In Progress' : 'Done';
    const updated = { ...item, status: nextStatus as any };
    setWorkItems((prev) => prev.map((w) => (w === item ? updated : w)));
    showToast(`Task set to ${nextStatus}`);
  };

  const handleQuickAddWork = (preset: Omit<WorkItem, 'date'>) => {
    handleAddWork({
      ...preset,
      date: selectedDate
    });
  };

  // Settings Save
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    loadDataForDate(selectedDate, true);
  };

  // Add Measurement
  const handleAddMeasurement = async (_m: Measurement) => {
    showToast('Measurement logged to sheet!');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Toast message={toastMessage} onClear={() => setToastMessage(null)} />

      {/* Top Header */}
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        syncStatus={syncStatus}
        onSync={() => loadDataForDate(selectedDate, true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenInstall={() => setIsInstallOpen(true)}
        isStandalone={isStandalone}
        lastSyncTime={lastSyncTime}
      />

      {/* Main Tab Screen Content */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 pb-6">
        {currentTab === 'today' && (
          <TodayTab
            dailyLog={dailyLog}
            settings={settings}
            onUpdateDailyLog={handleUpdateDailyLog}
            onNavigateTab={setCurrentTab}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'food' && (
          <FoodTab
            foodItems={foodItems}
            settings={settings}
            onOpenAddModal={handleOpenAddFood}
            onDeleteFood={handleDeleteFood}
            onQuickAdd={handleQuickAddFood}
          />
        )}

        {currentTab === 'workout' && (
          <WorkoutTab
            workoutItems={workoutItems}
            onOpenAddModal={handleOpenAddWorkout}
            onDeleteWorkout={handleDeleteWorkout}
            onQuickAdd={handleQuickAddWorkout}
          />
        )}

        {currentTab === 'work' && (
          <WorkTab
            workItems={workItems}
            onOpenAddModal={handleOpenAddWork}
            onDeleteWork={handleDeleteWork}
            onToggleStatus={handleToggleWorkStatus}
            onQuickAdd={handleQuickAddWork}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardTab
            kpis={kpis}
            history={history}
            settings={settings}
            onAddMeasurement={handleAddMeasurement}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onShowToast={showToast}
      />

      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />

      <AddFoodModal
        isOpen={isAddFoodOpen}
        onClose={() => setIsAddFoodOpen(false)}
        onAddFood={handleAddFood}
        selectedDate={selectedDate}
        defaultMeal={foodMealPreset}
      />

      <AddWorkoutModal
        isOpen={isAddWorkoutOpen}
        onClose={() => setIsAddWorkoutOpen(false)}
        onAddWorkout={handleAddWorkout}
        selectedDate={selectedDate}
        defaultType={workoutTypePreset}
      />

      <AddWorkModal
        isOpen={isAddWorkOpen}
        onClose={() => setIsAddWorkOpen(false)}
        onAddWork={handleAddWork}
        selectedDate={selectedDate}
        defaultCategory={workCategoryPreset}
      />
    </div>
  );
}

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
