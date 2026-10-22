import {
  getScriptUrl,
  getStoredSettings,
  saveStoredSettings,
  getStoredDailyLog,
  saveStoredDailyLog,
  getStoredFoodItems,
  saveStoredFoodItems,
  getStoredWorkoutItems,
  saveStoredWorkoutItems,
  getStoredWorkItems,
  saveStoredWorkItems,
  getStoredDashboardKpis,
  saveStoredDashboardKpis,
  saveStoredHistory,
  setLastSyncTime,
  addToPendingQueue,
  getPendingQueue,
  clearPendingQueue
} from './storage';
import { UserSettings, DailyLog, FoodItem, WorkoutItem, WorkItem, DashboardKpis, DailyHistoryItem } from '../types';

export interface PingResponse {
  success: boolean;
  message?: string;
  sheetName?: string;
  sheetsFound?: string[];
  error?: string;
}

export interface SummaryResponse {
  success: boolean;
  date: string;
  settings: UserSettings;
  dailyLog: DailyLog;
  foodItems: FoodItem[];
  workoutItems: WorkoutItem[];
  workItems: WorkItem[];
  dashboardKpis: DashboardKpis;
  error?: string;
}

/**
 * Ping the Google Apps Script Web App to verify connectivity
 */
export async function pingGoogleSheet(customUrl?: string): Promise<PingResponse> {
  const url = customUrl || getScriptUrl();
  if (!url) {
    return { success: false, error: 'No Google Apps Script URL configured.' };
  }

  try {
    const separator = url.includes('?') ? '&' : '?';
    const resp = await fetch(`${url}${separator}action=ping&t=${Date.now()}`);
    if (!resp.ok) {
      throw new Error(`HTTP error ${resp.status}`);
    }
    const data = await resp.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to connect to Google Sheet. Check URL and deployment permissions.'
    };
  }
}

/**
 * Fetches all data for a specific date (Settings, Daily Log, Food, Workout, Work, KPIs)
 */
export async function fetchDailySummary(dateStr: string): Promise<SummaryResponse> {
  const url = getScriptUrl();

  // If no URL configured, return local cached/demo data
  if (!url) {
    return {
      success: true,
      date: dateStr,
      settings: getStoredSettings(),
      dailyLog: getStoredDailyLog(dateStr),
      foodItems: getStoredFoodItems(dateStr),
      workoutItems: getStoredWorkoutItems(dateStr),
      workItems: getStoredWorkItems(dateStr),
      dashboardKpis: getStoredDashboardKpis()
    };
  }

  try {
    const separator = url.includes('?') ? '&' : '?';
    const resp = await fetch(`${url}${separator}action=getSummary&date=${dateStr}&t=${Date.now()}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const resData: SummaryResponse = await resp.json();

    if (resData.success) {
      if (resData.settings) saveStoredSettings(resData.settings);
      if (resData.dailyLog) saveStoredDailyLog(dateStr, resData.dailyLog);
      if (resData.foodItems) saveStoredFoodItems(dateStr, resData.foodItems);
      if (resData.workoutItems) saveStoredWorkoutItems(dateStr, resData.workoutItems);
      if (resData.workItems) saveStoredWorkItems(dateStr, resData.workItems);
      if (resData.dashboardKpis) saveStoredDashboardKpis(resData.dashboardKpis);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }

    return resData;
  } catch (err: any) {
    console.warn('Network fetch failed, returning cached data:', err);
    return {
      success: false,
      date: dateStr,
      settings: getStoredSettings(),
      dailyLog: getStoredDailyLog(dateStr),
      foodItems: getStoredFoodItems(dateStr),
      workoutItems: getStoredWorkoutItems(dateStr),
      workItems: getStoredWorkItems(dateStr),
      dashboardKpis: getStoredDashboardKpis(),
      error: err.message || 'Offline - using cached data'
    };
  }
}

/**
 * Fetches recent history for trend graphs
 */
export async function fetchHistory(days = 14): Promise<DailyHistoryItem[]> {
  const url = getScriptUrl();
  if (!url) return [];

  try {
    const separator = url.includes('?') ? '&' : '?';
    const resp = await fetch(`${url}${separator}action=getHistory&days=${days}&t=${Date.now()}`);
    if (!resp.ok) return [];
    const data = await resp.json();
    if (data.success && Array.isArray(data.history)) {
      saveStoredHistory(data.history);
      return data.history;
    }
    return [];
  } catch (err) {
    console.warn('Failed to fetch history', err);
    return [];
  }
}

/**
 * Universal POST sender to Google Apps Script
 */
async function postToAppsScript(payload: any): Promise<any> {
  const url = getScriptUrl();
  if (!url) {
    addToPendingQueue({ type: payload.action, payload });
    return { success: true, localOnly: true };
  }

  try {
    // We send payload as text/plain to avoid browser CORS preflight check
    const resp = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      redirect: 'follow'
    });

    if (!resp.ok) {
      throw new Error(`HTTP error ${resp.status}`);
    }

    const json = await resp.json();
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    return json;
  } catch (err) {
    console.warn('Sync failed, queued for later:', err);
    addToPendingQueue({ type: payload.action, payload });
    return { success: false, queued: true };
  }
}

/**
 * Updates daily metrics (Weight, Water, Steps, Sleep, Mood, Notes)
 */
export async function syncDailyLogUpdate(
  dateStr: string,
  updates: Partial<DailyLog>
): Promise<{ success: boolean }> {
  // Update local cache immediately for optimistic UI
  const current = getStoredDailyLog(dateStr);
  const updated: DailyLog = { ...current, ...updates };
  saveStoredDailyLog(dateStr, updated);

  const payload = {
    action: 'updateDailyLog',
    date: dateStr,
    ...updates
  };

  return await postToAppsScript(payload);
}

/**
 * Adds a food item to Food Log
 */
export async function syncAddFood(food: FoodItem): Promise<{ success: boolean }> {
  // Optimistic update
  const current = getStoredFoodItems(food.date);
  saveStoredFoodItems(food.date, [...current, food]);

  // Recalculate daily calories & macros in local cache
  const daily = getStoredDailyLog(food.date);
  const updatedDaily: DailyLog = {
    ...daily,
    caloriesIn: daily.caloriesIn + (food.calories || 0),
    protein: daily.protein + (food.protein || 0),
    carbs: daily.carbs + (food.carbs || 0),
    fat: daily.fat + (food.fat || 0)
  };
  saveStoredDailyLog(food.date, updatedDaily);

  const payload = {
    action: 'addFoodItem',
    ...food
  };

  return await postToAppsScript(payload);
}

/**
 * Deletes a food item
 */
export async function syncDeleteFood(food: FoodItem): Promise<{ success: boolean }> {
  const current = getStoredFoodItems(food.date);
  saveStoredFoodItems(food.date, current.filter(f => f.foodItem !== food.foodItem || f.rowIndex !== food.rowIndex));

  const payload = {
    action: 'deleteFoodItem',
    rowIndex: food.rowIndex,
    date: food.date,
    foodItem: food.foodItem
  };

  return await postToAppsScript(payload);
}

/**
 * Adds a workout entry to Workout Log
 */
export async function syncAddWorkout(workout: WorkoutItem): Promise<{ success: boolean }> {
  // Optimistic update
  const current = getStoredWorkoutItems(workout.date);
  const vol = (workout.sets || 0) * (workout.reps || 0) * (workout.weightKg || 0);
  const entry = { ...workout, volumeKg: vol };
  saveStoredWorkoutItems(workout.date, [...current, entry]);

  // Update daily workout done & volume
  const daily = getStoredDailyLog(workout.date);
  saveStoredDailyLog(workout.date, {
    ...daily,
    workoutDone: true,
    workoutVolume: daily.workoutVolume + vol,
    caloriesBurned: daily.caloriesBurned + (workout.caloriesBurned || 0)
  });

  const payload = {
    action: 'addWorkoutItem',
    ...workout
  };

  return await postToAppsScript(payload);
}

/**
 * Deletes a workout entry
 */
export async function syncDeleteWorkout(workout: WorkoutItem): Promise<{ success: boolean }> {
  const current = getStoredWorkoutItems(workout.date);
  saveStoredWorkoutItems(workout.date, current.filter(w => w.exercise !== workout.exercise || w.rowIndex !== workout.rowIndex));

  const payload = {
    action: 'deleteWorkoutItem',
    rowIndex: workout.rowIndex,
    date: workout.date,
    exercise: workout.exercise
  };

  return await postToAppsScript(payload);
}

/**
 * Adds a task to Work Log
 */
export async function syncAddWork(workItem: WorkItem): Promise<{ success: boolean }> {
  // Optimistic update
  const current = getStoredWorkItems(workItem.date);
  saveStoredWorkItems(workItem.date, [...current, workItem]);

  const daily = getStoredDailyLog(workItem.date);
  saveStoredDailyLog(workItem.date, {
    ...daily,
    workHours: daily.workHours + (workItem.hours || 0)
  });

  const payload = {
    action: 'addWorkItem',
    ...workItem
  };

  return await postToAppsScript(payload);
}

/**
 * Deletes a task from Work Log
 */
export async function syncDeleteWork(workItem: WorkItem): Promise<{ success: boolean }> {
  const current = getStoredWorkItems(workItem.date);
  saveStoredWorkItems(workItem.date, current.filter(w => w.task !== workItem.task || w.rowIndex !== workItem.rowIndex));

  const payload = {
    action: 'deleteWorkItem',
    rowIndex: workItem.rowIndex,
    date: workItem.date,
    task: workItem.task
  };

  return await postToAppsScript(payload);
}

/**
 * Flushes all pending actions queued when offline
 */
export async function flushPendingQueue(): Promise<number> {
  const queue = getPendingQueue();
  if (queue.length === 0 || !getScriptUrl()) return 0;

  let synced = 0;
  for (const item of queue) {
    try {
      await postToAppsScript(item.payload);
      synced++;
    } catch {
      break;
    }
  }

  if (synced === queue.length) {
    clearPendingQueue();
  }

  return synced;
}
