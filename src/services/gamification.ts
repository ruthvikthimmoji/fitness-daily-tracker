import { GamificationState, DailyQuest, Badge, DailyLog, FoodItem, WorkoutItem, WorkItem } from '../types';

const GAMIFICATION_KEY = 'daily_fit_gamification';

export const LEVEL_TIERS = [
  { level: 1, xp: 0, title: 'Novice' },
  { level: 2, xp: 100, title: 'Seedling' },
  { level: 3, xp: 250, title: 'Consistent' },
  { level: 4, xp: 450, title: 'Iron Will' },
  { level: 5, xp: 700, title: 'Pacer' },
  { level: 6, xp: 1000, title: 'Momentum' },
  { level: 7, xp: 1400, title: 'Disciplined' },
  { level: 8, xp: 1900, title: 'Warrior' },
  { level: 9, xp: 2500, title: 'Champion' },
  { level: 10, xp: 3200, title: 'Iron Titan' },
  { level: 11, xp: 4000, title: 'Apex' },
  { level: 12, xp: 5000, title: 'Relentless' },
  { level: 13, xp: 6200, title: 'Master' },
  { level: 14, xp: 7600, title: 'Grandmaster' },
  { level: 15, xp: 9200, title: 'Vanguard' },
  { level: 16, xp: 11000, title: 'Centurion' },
  { level: 17, xp: 13000, title: 'Immortal' },
  { level: 18, xp: 15500, title: 'Mythic' },
  { level: 19, xp: 18500, title: 'Overlord' },
  { level: 20, xp: 22000, title: 'Diamond Legend' },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_log',
    title: 'First Step',
    description: 'Log your first habit or metric',
    icon: '🌱',
    category: 'discipline',
    unlocked: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'streak_3',
    title: 'Flame Starter',
    description: 'Reach a 3-day active streak',
    icon: '🔥',
    category: 'streak',
    unlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'streak_7',
    title: 'Week of Steel',
    description: 'Maintain a 7-day active streak',
    icon: '⚡',
    category: 'streak',
    unlocked: false,
    progress: 1,
    maxProgress: 7
  },
  {
    id: 'streak_30',
    title: 'Unstoppable',
    description: 'Crush a 30-day streak',
    icon: '👑',
    category: 'streak',
    unlocked: false,
    progress: 1,
    maxProgress: 30
  },
  {
    id: 'water_master',
    title: 'Hydration Master',
    description: 'Drink 3.0+ Litres of water in one day',
    icon: '💧',
    category: 'nutrition',
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'steps_10k',
    title: 'Ten-Thousander',
    description: 'Hit 10,000 steps in a single day',
    icon: '👟',
    category: 'steps',
    unlocked: false,
    progress: 0,
    maxProgress: 10000
  },
  {
    id: 'workout_heavy',
    title: 'Iron Titan',
    description: 'Log 2,000+ kg workout volume',
    icon: '🏋️',
    category: 'workout',
    unlocked: false,
    progress: 0,
    maxProgress: 2000
  },
  {
    id: 'work_focus',
    title: 'Deep Flow',
    description: 'Log 3+ hours of focused work / study',
    icon: '💼',
    category: 'discipline',
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'macro_master',
    title: 'Clean Fuel',
    description: 'Log 3 separate meals in a day',
    icon: '🥗',
    category: 'nutrition',
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'perfect_100',
    title: 'Flawless 100',
    description: 'Reach a 90%+ daily score',
    icon: '🎯',
    category: 'discipline',
    unlocked: false,
    progress: 0,
    maxProgress: 90
  },
  {
    id: 'scale_loyal',
    title: 'Data Over Guesses',
    description: 'Log morning weight 5 times',
    icon: '⚖️',
    category: 'discipline',
    unlocked: false,
    progress: 1,
    maxProgress: 5
  },
  {
    id: 'freeze_saved',
    title: 'Shield Guardian',
    description: 'Keep a streak alive with a freeze',
    icon: '🛡️',
    category: 'streak',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  }
];

export function getDailyQuests(dateStr: string): DailyQuest[] {
  return [
    {
      id: `water_${dateStr}`,
      title: 'Hydration Hero: Drink 2.5L Water',
      target: 2.5,
      current: 0,
      unit: 'L',
      xp: 25,
      completed: false,
      claimed: false,
      icon: 'water'
    },
    {
      id: `steps_${dateStr}`,
      title: 'Daily Mover: Walk 8,000 Steps',
      target: 8000,
      current: 0,
      unit: 'steps',
      xp: 35,
      completed: false,
      claimed: false,
      icon: 'steps'
    },
    {
      id: `meals_${dateStr}`,
      title: 'Nutrition Tracker: Log 2 Meals',
      target: 2,
      current: 0,
      unit: 'meals',
      xp: 25,
      completed: false,
      claimed: false,
      icon: 'food'
    }
  ];
}

export function getStoredGamification(): GamificationState {
  const today = getTodayString();
  const fallback: GamificationState = {
    streak: 1,
    bestStreak: 1,
    streakLastDate: today,
    streakFreezes: 2,
    totalXp: 120,
    level: 2,
    levelTitle: 'Seedling',
    currentLevelXp: 20,
    nextLevelXp: 150,
    questsDate: today,
    quests: getDailyQuests(today),
    chestClaimedDate: '',
    badges: INITIAL_BADGES
  };

  try {
    const raw = localStorage.getItem(GAMIFICATION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // If quests are from a previous date, generate new quests for today
      if (parsed.questsDate !== today) {
        parsed.questsDate = today;
        parsed.quests = getDailyQuests(today);
      }
      return { ...fallback, ...parsed };
    }
  } catch {}

  return fallback;
}

export function saveStoredGamification(state: GamificationState): void {
  try {
    localStorage.setItem(GAMIFICATION_KEY, JSON.stringify(state));
  } catch {}
}

/**
 * Calculates level from total XP
 */
export function calculateLevel(totalXp: number): {
  level: number;
  levelTitle: string;
  currentLevelXp: number;
  nextLevelXp: number;
} {
  let currentTier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (totalXp >= LEVEL_TIERS[i].xp) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || { level: 21, xp: LEVEL_TIERS[i].xp + 5000, title: 'Legend' };
    } else {
      break;
    }
  }

  const range = nextTier.xp - currentTier.xp;
  const progressInLevel = Math.max(0, totalXp - currentTier.xp);

  return {
    level: currentTier.level,
    levelTitle: currentTier.title,
    currentLevelXp: progressInLevel,
    nextLevelXp: range
  };
}

/**
 * Awards XP, handles level-up calculations
 */
export function awardXp(
  amount: number,
  state: GamificationState
): { nextState: GamificationState; leveledUp: boolean; newLevel: number } {
  const newTotal = state.totalXp + amount;
  const levelInfo = calculateLevel(newTotal);
  const leveledUp = levelInfo.level > state.level;

  const nextState: GamificationState = {
    ...state,
    totalXp: newTotal,
    level: levelInfo.level,
    levelTitle: levelInfo.levelTitle,
    currentLevelXp: levelInfo.currentLevelXp,
    nextLevelXp: levelInfo.nextLevelXp
  };

  saveStoredGamification(nextState);
  return { nextState, leveledUp, newLevel: levelInfo.level };
}

/**
 * Evaluates Daily Quests and updates progress
 */
export function syncQuestsWithDailyData(
  state: GamificationState,
  dailyLog: DailyLog,
  foodItems: FoodItem[],
  _workoutItems: WorkoutItem[],
  _workItems: WorkItem[]
): GamificationState {
  const today = getTodayString();
  let quests = state.questsDate === today ? [...state.quests] : getDailyQuests(today);

  // Update Quest 1: Water
  const waterQuest = quests.find((q) => q.icon === 'water');
  if (waterQuest) {
    waterQuest.current = dailyLog.water || 0;
    waterQuest.completed = waterQuest.current >= waterQuest.target;
  }

  // Update Quest 2: Steps
  const stepsQuest = quests.find((q) => q.icon === 'steps');
  if (stepsQuest) {
    stepsQuest.current = dailyLog.steps || 0;
    stepsQuest.completed = stepsQuest.current >= stepsQuest.target;
  }

  // Update Quest 3: Meals
  const mealsQuest = quests.find((q) => q.icon === 'food');
  if (mealsQuest) {
    const loggedMeals = new Set(foodItems.map((f) => f.meal)).size;
    mealsQuest.current = Math.max(foodItems.length > 0 ? 1 : 0, loggedMeals);
    mealsQuest.completed = mealsQuest.current >= mealsQuest.target;
  }

  // Check Badges progress
  const updatedBadges = state.badges.map((b) => {
    const badge = { ...b };
    if (badge.id === 'water_master') {
      badge.progress = Math.max(badge.progress, dailyLog.water || 0);
      if (badge.progress >= badge.maxProgress) badge.unlocked = true;
    }
    if (badge.id === 'steps_10k') {
      badge.progress = Math.max(badge.progress, dailyLog.steps || 0);
      if (badge.progress >= badge.maxProgress) badge.unlocked = true;
    }
    if (badge.id === 'workout_heavy') {
      badge.progress = Math.max(badge.progress, dailyLog.workoutVolume || 0);
      if (badge.progress >= badge.maxProgress) badge.unlocked = true;
    }
    if (badge.id === 'work_focus') {
      badge.progress = Math.max(badge.progress, dailyLog.workHours || 0);
      if (badge.progress >= badge.maxProgress) badge.unlocked = true;
    }
    if (badge.id === 'macro_master') {
      badge.progress = Math.max(badge.progress, foodItems.length);
      if (badge.progress >= badge.maxProgress) badge.unlocked = true;
    }
    if (badge.id === 'perfect_100') {
      badge.progress = Math.max(badge.progress, dailyLog.dailyScore || 0);
      if (badge.progress >= badge.maxProgress) badge.unlocked = true;
    }
    return badge;
  });

  const nextState: GamificationState = {
    ...state,
    questsDate: today,
    quests,
    badges: updatedBadges
  };

  saveStoredGamification(nextState);
  return nextState;
}

/**
 * Checks and advances streak
 */
export function evaluateStreak(
  state: GamificationState,
  actionDate: string
): GamificationState {
  const lastDate = state.streakLastDate;
  if (lastDate === actionDate) return state; // Already recorded for this date

  const d1 = new Date(lastDate);
  const d2 = new Date(actionDate);
  const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));

  let newStreak = state.streak;
  let freezes = state.streakFreezes;

  if (diffDays === 1) {
    // Consecutive day!
    newStreak += 1;
  } else if (diffDays === 2 && freezes > 0) {
    // Missed 1 day, saved by streak freeze!
    freezes -= 1;
    newStreak += 1;
  } else if (diffDays > 1) {
    // Streak reset to 1
    newStreak = 1;
  }

  const best = Math.max(newStreak, state.bestStreak);

  // Check streak badges
  const updatedBadges = state.badges.map((b) => {
    const badge = { ...b };
    if (badge.id === 'streak_3') {
      badge.progress = newStreak;
      if (newStreak >= 3) badge.unlocked = true;
    }
    if (badge.id === 'streak_7') {
      badge.progress = newStreak;
      if (newStreak >= 7) badge.unlocked = true;
    }
    if (badge.id === 'streak_30') {
      badge.progress = newStreak;
      if (newStreak >= 30) badge.unlocked = true;
    }
    return badge;
  });

  const nextState: GamificationState = {
    ...state,
    streak: newStreak,
    bestStreak: best,
    streakLastDate: actionDate,
    streakFreezes: freezes,
    badges: updatedBadges
  };

  saveStoredGamification(nextState);
  return nextState;
}

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
