import { UserSettings, DailyLog, FoodItem, WorkoutItem, WorkItem, DashboardKpis, DailyHistoryItem } from '../types';

const STORAGE_KEYS = {
  SCRIPT_URL: 'fitness_script_url',
  SETTINGS: 'fitness_settings',
  DAILY_LOGS: 'fitness_daily_logs',
  FOOD_ITEMS: 'fitness_food_items',
  WORKOUT_ITEMS: 'fitness_workout_items',
  WORK_ITEMS: 'fitness_work_items',
  DASHBOARD_KPIS: 'fitness_kpis',
  HISTORY: 'fitness_history',
  PENDING_QUEUE: 'fitness_pending_sync_queue',
  LAST_SYNC_TIME: 'fitness_last_sync_time'
};

export const DEFAULT_SETTINGS: UserSettings = {
  name: 'Fitness Hero',
  startDate: '2026-10-22',
  heightCm: 170,
  startWeightKg: 78.0,
  goalWeightKg: 72.0,
  dailyCalorieTarget: 2200,
  dailyProteinTarget: 130,
  dailyWaterTarget: 3.0,
  dailyStepsTarget: 10000,
  dailySleepTarget: 7.5
};

export function getScriptUrl(): string {
  return localStorage.getItem(STORAGE_KEYS.SCRIPT_URL) || '';
}

export function setScriptUrl(url: string): void {
  localStorage.setItem(STORAGE_KEYS.SCRIPT_URL, url.trim());
}

export function getStoredSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStoredDailyLog(date: string): DailyLog {
  try {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
    if (logs[date]) return logs[date];
  } catch {}

  const settings = getStoredSettings();
  const d = new Date(date);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return {
    date,
    day: isNaN(d.getDay()) ? 'Today' : days[d.getDay()],
    weight: null,
    caloriesIn: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    water: 0,
    steps: 0,
    sleep: 0,
    workoutDone: false,
    workoutVolume: 0,
    caloriesBurned: 0,
    netCalories: 0,
    calorieTarget: settings.dailyCalorieTarget,
    workHours: 0,
    mood: 3,
    photoTaken: false,
    dailyScore: 0,
    notes: ''
  };
}

export function saveStoredDailyLog(date: string, log: DailyLog): void {
  try {
    const logs = JSON.parse(localStorage.getItem(STORAGE_KEYS.DAILY_LOGS) || '{}');
    logs[date] = log;
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save daily log', err);
  }
}

export function getStoredFoodItems(date: string): FoodItem[] {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS) || '{}');
    return all[date] || [];
  } catch {
    return [];
  }
}

export function saveStoredFoodItems(date: string, items: FoodItem[]): void {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS) || '{}');
    all[date] = items;
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to save food items', err);
  }
}

export function getStoredWorkoutItems(date: string): WorkoutItem[] {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUT_ITEMS) || '{}');
    return all[date] || [];
  } catch {
    return [];
  }
}

export function saveStoredWorkoutItems(date: string, items: WorkoutItem[]): void {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUT_ITEMS) || '{}');
    all[date] = items;
    localStorage.setItem(STORAGE_KEYS.WORKOUT_ITEMS, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to save workout items', err);
  }
}

export function getStoredWorkItems(date: string): WorkItem[] {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORK_ITEMS) || '{}');
    return all[date] || [];
  } catch {
    return [];
  }
}

export function saveStoredWorkItems(date: string, items: WorkItem[]): void {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORK_ITEMS) || '{}');
    all[date] = items;
    localStorage.setItem(STORAGE_KEYS.WORK_ITEMS, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to save work items', err);
  }
}

export function getStoredDashboardKpis(): DashboardKpis {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DASHBOARD_KPIS);
    return raw ? JSON.parse(raw) : {
      currentWeight: 78.0,
      startingWeight: 78.0,
      goalWeight: 72.0,
      changeSoFar: 0,
      remainingToGoal: 6.0,
      bmi: 27.0,
      goalProgress: 0
    };
  } catch {
    return {
      currentWeight: 78.0,
      startingWeight: 78.0,
      goalWeight: 72.0,
      changeSoFar: 0,
      remainingToGoal: 6.0,
      bmi: 27.0,
      goalProgress: 0
    };
  }
}

export function saveStoredDashboardKpis(kpis: DashboardKpis): void {
  localStorage.setItem(STORAGE_KEYS.DASHBOARD_KPIS, JSON.stringify(kpis));
}

export function getStoredHistory(): DailyHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredHistory(history: DailyHistoryItem[]): void {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function getLastSyncTime(): string | null {
  return localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
}

export function setLastSyncTime(time: string): void {
  localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, time);
}

// Pending offline queue
export interface PendingAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

export function getPendingQueue(): PendingAction[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_QUEUE) || '[]');
  } catch {
    return [];
  }
}

export function addToPendingQueue(action: Omit<PendingAction, 'id' | 'timestamp'>): void {
  const queue = getPendingQueue();
  queue.push({
    ...action,
    id: Math.random().toString(36).substring(2, 9),
    timestamp: Date.now()
  });
  localStorage.setItem(STORAGE_KEYS.PENDING_QUEUE, JSON.stringify(queue));
}

export function clearPendingQueue(): void {
  localStorage.setItem(STORAGE_KEYS.PENDING_QUEUE, '[]');
}
