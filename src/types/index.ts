export interface UserSettings {
  name: string;
  startDate: string;
  heightCm: number;
  startWeightKg: number;
  goalWeightKg: number;
  dailyCalorieTarget: number;
  dailyProteinTarget: number;
  dailyWaterTarget: number;
  dailyStepsTarget: number;
  dailySleepTarget: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  day: string;  // e.g. "Thu"
  weight: number | null;
  caloriesIn: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
  steps: number;
  sleep: number;
  workoutDone: boolean;
  workoutVolume: number;
  caloriesBurned: number;
  netCalories: number;
  calorieTarget: number;
  workHours: number;
  mood: number; // 1-5
  photoTaken: boolean;
  dailyScore: number; // 0-100%
  notes: string;
  rowIndex?: number;
}

export interface FoodItem {
  rowIndex?: number;
  date: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | string;
  foodItem: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
}

export interface WorkoutItem {
  rowIndex?: number;
  date: string;
  workoutType: 'Push' | 'Pull' | 'Legs' | 'Cardio' | 'Upper' | 'Lower' | 'Full Body' | 'Other';
  exercise: string;
  sets: number;
  reps: number;
  weightKg: number;
  volumeKg?: number;
  durationMin?: number;
  caloriesBurned?: number;
  notes?: string;
}

export interface WorkItem {
  rowIndex?: number;
  date: string;
  task: string;
  category: 'Work' | 'Study' | 'Personal Project' | 'Errands' | 'Reading' | 'Other';
  hours: number;
  status: 'Done' | 'In Progress' | 'Planned';
  notes?: string;
}

export interface Measurement {
  rowIndex?: number;
  date: string;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
}

export interface DashboardKpis {
  currentWeight: number;
  startingWeight: number;
  goalWeight: number;
  changeSoFar: number;
  remainingToGoal: number;
  bmi: number;
  goalProgress: number;
}

export interface DailyHistoryItem {
  date: string;
  day: string;
  weight: number | null;
  caloriesIn: number;
  water: number;
  steps: number;
  sleep: number;
  workoutVolume: number;
  workHours: number;
  mood: number | null;
  dailyScore: number;
  hasData: boolean;
}

export type TabType = 'today' | 'food' | 'workout' | 'work' | 'dashboard';
