import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TodayTab } from './components/TodayTab';
import { FitnessTab } from './components/FitnessTab';
import { WorkTab } from './components/WorkTab';
import { PersonalTab } from './components/PersonalTab';
import { EasyLogModal } from './components/EasyLogModal';
import { SettingsModal } from './components/SettingsModal';
import { InstallModal } from './components/InstallModal';
import { AddFoodModal } from './components/AddFoodModal';
import { AddWorkoutModal } from './components/AddWorkoutModal';
import { AddWorkModal } from './components/AddWorkModal';
import { BadgesModal } from './components/BadgesModal';
import { SpecimenDetailModal, LogDetailType } from './components/SpecimenDetailModal';
import { PhotoUploaderModal } from './components/PhotoUploaderModal';
import { Toast, ToastState } from './components/Toast';

import {
  TabType,
  DailyLog,
  FoodItem,
  WorkoutItem,
  WorkItem,
  UserSettings,
  DashboardKpis,
  DailyHistoryItem,
  Measurement,
  GamificationState,
  StoredPhoto
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

import {
  getStoredGamification,
  saveStoredGamification,
  awardXp,
  syncQuestsWithDailyData,
  evaluateStreak
} from './services/gamification';

import { toLocalIso, triggerHaptic } from './utils/formatters';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isEasyLogOpen, setIsEasyLogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(toLocalIso());
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error' | 'offline'>('idle');
  const [lastSyncTime, setLastSyncTimeState] = useState<string | null>(getLastSyncTime());
  const [toastState, setToastState] = useState<ToastState | null>(null);

  // Core Data State
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings());
  const [dailyLog, setDailyLog] = useState<DailyLog>(getStoredDailyLog(selectedDate));
  const [foodItems, setFoodItems] = useState<FoodItem[]>(getStoredFoodItems(selectedDate));
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>(getStoredWorkoutItems(selectedDate));
  const [workItems, setWorkItems] = useState<WorkItem[]>(getStoredWorkItems(selectedDate));
  const [kpis, setKpis] = useState<DashboardKpis>(getStoredDashboardKpis());
  const [history, setHistory] = useState<DailyHistoryItem[]>(getStoredHistory());

  // Duolingo Gamification State
  const [gamification, setGamification] = useState<GamificationState>(getStoredGamification());
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);

  // Specimen Detail Inspection Modal State
  const [selectedLogDetail, setSelectedLogDetail] = useState<LogDetailType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Photo Uploader Modal State
  const [isPhotoUploaderOpen, setIsPhotoUploaderOpen] = useState(false);
  const [photoUploaderCategory, setPhotoUploaderCategory] = useState<'workout' | 'physique' | 'food' | 'scale' | 'other'>('workout');
  const [photoLinkedLogId, setPhotoLinkedLogId] = useState<string | undefined>(undefined);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodMealPreset, setFoodMealPreset] = useState<string>('Breakfast');
  const [isAddWorkoutOpen, setIsAddWorkoutOpen] = useState(false);
  const [workoutTypePreset, setWorkoutTypePreset] = useState<string>('Push');
  const [isAddWorkOpen, setIsAddWorkOpen] = useState(false);
  const [workCategoryPreset, setWorkCategoryPreset] = useState<string>('Work');

  // Standalone mode check
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);
  }, []);

  const showToast = useCallback((msg: string, actionLabel?: string, onAction?: () => void) => {
    setToastState({ message: msg, actionLabel, onAction });
  }, []);

  // Award XP with celebration
  const awardActionXp = useCallback((amount: number, reason: string) => {
    setGamification((prev) => {
      const res = awardXp(amount, prev);
      const withStreak = evaluateStreak(res.nextState, selectedDate);
      saveStoredGamification(withStreak);

      if (res.leveledUp) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.5 },
            colors: ['#C4501F', '#2B2324', '#5E5444', '#F5F2EA', '#FFD700']
          });
        } catch {}
        showToast(`🎉 Level ${res.newLevel}: ${res.nextState.levelTitle}!`);
      } else {
        showToast(`+${amount} XP · ${reason}`);
      }
      return withStreak;
    });
  }, [selectedDate, showToast]);

  // Sync daily quests whenever logs or items change
  useEffect(() => {
    setGamification((prev) => {
      return syncQuestsWithDailyData(prev, dailyLog, foodItems, workoutItems, workItems);
    });
  }, [dailyLog, foodItems, workoutItems, workItems]);

  // Quest Claim Handler
  const handleClaimQuest = useCallback((questId: string) => {
    setGamification((prev) => {
      const quest = prev.quests.find((q) => q.id === questId);
      if (!quest || quest.claimed) return prev;

      const xpEarned = quest.xp || 25;
      triggerHaptic(20);
      awardActionXp(xpEarned, `Completed ${quest.title}`);

      const updatedQuests = prev.quests.map((q) =>
        q.id === questId ? { ...q, claimed: true } : q
      );

      const next = { ...prev, quests: updatedQuests };
      saveStoredGamification(next);
      return next;
    });
  }, [awardActionXp]);

  // Mystery Chest Claim
  const handleClaimChest = useCallback(() => {
    setGamification((prev) => {
      if (prev.chestClaimedDate === selectedDate) return prev;

      triggerHaptic(30);
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#C4501F', '#2B2324', '#FFD700', '#F5F2EA']
        });
      } catch {}

      awardActionXp(50, 'Daily bonus claimed');

      const next = {
        ...prev,
        chestClaimedDate: selectedDate
      };
      saveStoredGamification(next);
      return next;
    });
  }, [selectedDate, awardActionXp]);

  // Reload data on date change
  useEffect(() => {
    setDailyLog(getStoredDailyLog(selectedDate));
    setFoodItems(getStoredFoodItems(selectedDate));
    setWorkoutItems(getStoredWorkoutItems(selectedDate));
    setWorkItems(getStoredWorkItems(selectedDate));
  }, [selectedDate]);

  // Periodic offline queue flusher
  useEffect(() => {
    const scriptUrl = getScriptUrl();
    if (scriptUrl) {
      flushPendingQueue().catch(() => {});
    }
  }, [selectedDate]);

  // Fetch summary and history from Google Sheets
  const refreshSheetData = useCallback(async (isManual = false) => {
    const scriptUrl = getScriptUrl();
    if (!scriptUrl) return;

    if (isManual) {
      triggerHaptic(10);
      setSyncStatus('syncing');
    }

    try {
      const summaryRes = await fetchDailySummary(selectedDate);
      if (summaryRes.success) {
        if (summaryRes.dailyLog) setDailyLog(summaryRes.dailyLog);
        if (summaryRes.foodItems) setFoodItems(summaryRes.foodItems);
        if (summaryRes.workoutItems) setWorkoutItems(summaryRes.workoutItems);
        if (summaryRes.workItems) setWorkItems(summaryRes.workItems);
        if (summaryRes.dashboardKpis) setKpis(summaryRes.dashboardKpis);
      }

      const histRes = await fetchHistory();
      if (Array.isArray(histRes) && histRes.length > 0) {
        setHistory(histRes);
      }

      setSyncStatus('synced');
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncTimeState(timeStr);
      if (isManual) {
        showToast('Synced with Google Sheet');
      }
    } catch {
      setSyncStatus('offline');
      if (isManual) {
        showToast('Offline cache saved · Will retry');
      }
    }
  }, [selectedDate, showToast]);

  // Initial load sync
  useEffect(() => {
    refreshSheetData(false);
  }, [refreshSheetData]);

  // Set of logged dates for week strip dots (L1, I5)
  const loggedDates = useMemo(() => {
    const s = new Set<string>();
    history.forEach(h => {
      if (h.hasData || (h.dailyScore && h.dailyScore > 0)) {
        s.add(h.date);
      }
    });
    // Add today if has entries
    if (foodItems.length > 0 || workoutItems.length > 0 || workItems.length > 0 || (dailyLog.water || 0) > 0 || (dailyLog.steps || 0) > 0) {
      s.add(selectedDate);
    }
    return s;
  }, [history, foodItems, workoutItems, workItems, dailyLog, selectedDate]);

  // Update Daily Log
  const handleUpdateDailyLog = async (updates: Partial<DailyLog>) => {
    const nextLog = { ...dailyLog, ...updates };
    setDailyLog(nextLog);

    if (updates.water !== undefined && (updates.water > (dailyLog.water || 0))) {
      awardActionXp(5, 'Hydration logged');
    } else if (updates.steps !== undefined && (updates.steps > (dailyLog.steps || 0))) {
      awardActionXp(10, 'Steps logged');
    } else if (updates.weight !== undefined) {
      awardActionXp(15, 'Morning weight recorded');
    } else if (updates.sleep !== undefined) {
      awardActionXp(10, 'Sleep logged');
    } else if (updates.mood !== undefined) {
      awardActionXp(5, 'Daily check-in');
    }

    setSyncStatus('syncing');
    const res = await syncDailyLogUpdate(selectedDate, updates);
    if (res.success) {
      setSyncStatus('synced');
      setLastSyncTimeState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setSyncStatus('offline');
    }
  };

  // Food handlers with Undo (I1)
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
    awardActionXp(20, 'Meal tracked');

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
    showToast(`Removed ${food.foodItem}`);

    setSyncStatus('syncing');
    await syncDeleteFood(food);
    setSyncStatus('synced');
  };

  const handleQuickAddFood = (preset: Omit<FoodItem, 'date'>) => {
    triggerHaptic(15);
    const item: FoodItem = { ...preset, date: selectedDate };
    handleAddFood(item);
    showToast(`${preset.foodItem} logged`, 'Undo', () => {
      handleDeleteFood(item);
    });
  };

  // Workout handlers with Undo (I1)
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
    awardActionXp(30, 'Workout logged');

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
    showToast(`Removed ${workout.exercise}`);

    setSyncStatus('syncing');
    await syncDeleteWorkout(workout);
    setSyncStatus('synced');
  };

  const handleQuickAddWorkout = (preset: Omit<WorkoutItem, 'date'>) => {
    triggerHaptic(15);
    const item: WorkoutItem = { ...preset, date: selectedDate };
    handleAddWorkout(item);
    showToast(`${preset.exercise} logged`, 'Undo', () => {
      handleDeleteWorkout(item);
    });
  };

  // Work handlers with Undo (I1)
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
    awardActionXp(20, 'Task tracked');

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
    showToast(`Removed ${work.task}`);

    setSyncStatus('syncing');
    await syncDeleteWork(work);
    setSyncStatus('synced');
  };

  const handleQuickAddWork = (preset: Omit<WorkItem, 'date'>) => {
    triggerHaptic(15);
    const item: WorkItem = { ...preset, date: selectedDate };
    handleAddWork(item);
    showToast(`${preset.task} logged`, 'Undo', () => {
      handleDeleteWork(item);
    });
  };

  const handleToggleWorkStatus = async (item: WorkItem) => {
    const nextStatus = item.status === 'Done' ? 'In Progress' : 'Done';
    const updated = { ...item, status: nextStatus as any };
    setWorkItems((prev) => prev.map((w) => (w === item ? updated : w)));

    if (nextStatus === 'Done') {
      awardActionXp(15, 'Task finished');
    }

    setSyncStatus('syncing');
    await syncAddWork(updated);
    setSyncStatus('synced');
  };

  // Detail Modal inspection
  const handleSelectLogDetail = (detail: LogDetailType) => {
    setSelectedLogDetail(detail);
    setIsDetailModalOpen(true);
  };

  const handleDeleteCurrentDetail = () => {
    if (!selectedLogDetail) return;
    if (selectedLogDetail.type === 'workout') {
      handleDeleteWorkout(selectedLogDetail.item);
    } else if (selectedLogDetail.type === 'food') {
      handleDeleteFood(selectedLogDetail.item);
    } else if (selectedLogDetail.type === 'work') {
      handleDeleteWork(selectedLogDetail.item);
    }
    setIsDetailModalOpen(false);
  };

  const handleOpenPhotoUploader = (category: 'workout' | 'physique' | 'food' | 'scale' | 'other', logId?: string) => {
    setPhotoUploaderCategory(category);
    setPhotoLinkedLogId(logId);
    setIsPhotoUploaderOpen(true);
  };

  const handlePhotoSaved = (_photo: StoredPhoto) => {
    showToast('Photo saved to private vault');
    awardActionXp(25, 'Photo captured');
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
    refreshSheetData(true);
  };

  const handleAddMeasurement = (_m: Measurement) => {
    showToast('Measurement saved');
  };

  return (
    <div className="min-h-screen bg-[#FFFFF0] text-[#16232B] flex flex-col font-body selection:bg-[#FF5B04] selection:text-white">
      
      {/* Toast Notification with Undo */}
      <Toast toast={toastState} onClear={() => setToastState(null)} />

      {/* Slim 56px App Bar */}
      <Header
        currentTab={currentTab}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        syncStatus={syncStatus}
        onSync={() => refreshSheetData(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        lastSyncTime={lastSyncTime}
        gamification={gamification}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
        loggedDates={loggedDates}
      />

      {/* Main Screen Content with Padding */}
      <main className="flex-1 max-w-md mx-auto w-full px-3.5 pt-3 app-content">
        {(currentTab === 'dashboard' || currentTab === 'today') && (
          <TodayTab
            dailyLog={dailyLog}
            settings={settings}
            gamification={gamification}
            onClaimQuest={handleClaimQuest}
            onClaimChest={handleClaimChest}
            onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
            onUpdateDailyLog={handleUpdateDailyLog}
            onNavigateTab={setCurrentTab}
            onShowToast={showToast}
            onSelectDetail={handleSelectLogDetail}
            onOpenPhotoUploader={handleOpenPhotoUploader}
            onOpenAddModal={(type) => {
              if (type === 'food') handleOpenAddFood();
              if (type === 'workout') handleOpenAddWorkout();
              if (type === 'work') handleOpenAddWork();
            }}
          />
        )}

        {(currentTab === 'fitness' || currentTab === 'workout' || currentTab === 'food') && (
          <FitnessTab
            workoutItems={workoutItems}
            foodItems={foodItems}
            settings={settings}
            history={history}
            onOpenAddWorkoutModal={handleOpenAddWorkout}
            onOpenAddFoodModal={handleOpenAddFood}
            onDeleteWorkout={handleDeleteWorkout}
            onDeleteFood={handleDeleteFood}
            onQuickAddWorkout={handleQuickAddWorkout}
            onQuickAddFood={handleQuickAddFood}
            onSelectWorkoutDetail={(item) => handleSelectLogDetail({ type: 'workout', item })}
            onSelectFoodDetail={(item) => handleSelectLogDetail({ type: 'food', item })}
            onOpenPhotoUploader={handleOpenPhotoUploader}
            onShowToast={showToast}
          />
        )}

        {currentTab === 'work' && (
          <WorkTab
            workItems={workItems}
            history={history}
            onOpenAddModal={handleOpenAddWork}
            onDeleteWork={handleDeleteWork}
            onToggleStatus={handleToggleWorkStatus}
            onQuickAdd={handleQuickAddWork}
            onSelectDetail={(item) => handleSelectLogDetail({ type: 'work', item })}
            onShowToast={showToast}
          />
        )}

        {(currentTab === 'personal' || currentTab === 'vault') && (
          <PersonalTab
            settings={settings}
            kpis={kpis}
            history={history}
            gamification={gamification}
            onUpdateSettings={handleSaveSettings}
            onAddMeasurement={handleAddMeasurement}
            onSaveWeight={(w) => handleUpdateDailyLog({ weight: w })}
            onShowToast={showToast}
            onOpenPhotoUploader={handleOpenPhotoUploader}
            onSelectPhotoDetail={(photo) => handleSelectLogDetail({ type: 'photo', item: photo })}
            onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
          />
        )}
      </main>

      {/* Subtle bottom gradient fade overlay */}
      <div className="app-fade-bottom" />

      {/* 5-Item Thumb-friendly Bottom Navigation with Easy Log Center + button */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenEasyLog={() => setIsEasyLogOpen(true)}
      />

      {/* Easy Log Action Modal */}
      <EasyLogModal
        isOpen={isEasyLogOpen}
        onClose={() => setIsEasyLogOpen(false)}
        onOpenWorkout={() => handleOpenAddWorkout()}
        onOpenFood={() => handleOpenAddFood()}
        onAddWater={(litres) => {
          const prev = dailyLog.water || 0;
          const next = Math.max(0, Math.round((prev + litres) * 100) / 100);
          handleUpdateDailyLog({ water: next });
          showToast(`Water: ${next} L`, 'Undo', () => {
            handleUpdateDailyLog({ water: prev });
          });
        }}
        onSaveWeight={(w) => handleUpdateDailyLog({ weight: w })}
        onOpenWork={() => handleOpenAddWork()}
        onOpenPhoto={(cat) => handleOpenPhotoUploader(cat)}
        currentWeight={dailyLog.weight}
      />

      {/* Modals */}
      <SpecimenDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        detail={selectedLogDetail}
        onDelete={handleDeleteCurrentDetail}
        onOpenPhotoUploader={handleOpenPhotoUploader}
      />

      <PhotoUploaderModal
        isOpen={isPhotoUploaderOpen}
        onClose={() => setIsPhotoUploaderOpen(false)}
        onPhotoSaved={handlePhotoSaved}
        defaultCategory={photoUploaderCategory}
        selectedDate={selectedDate}
        linkedLogId={photoLinkedLogId}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onShowToast={showToast}
        onOpenInstall={() => setIsInstallOpen(true)}
        isStandalone={isStandalone}
      />

      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />

      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        gamification={gamification}
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
