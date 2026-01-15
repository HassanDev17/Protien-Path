export interface NutritionData {
  calories: number;
  protein: number;
  fat?: number;
  carbs?: number;
  sugar?: number;
  estimatedWeight?: string;
}

export interface Meal {
  id: string;
  name: string;
  timestamp: number;
  nutrition: NutritionData;
  imageUrl?: string;
  description?: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  user_id?: string; // Optional for backward compatibility, but required in database
}

export interface UserGoals {
  dailyCalories: number;
  dailyProtein: number; // in grams
  dailyCarbs: number; // in grams
  dailyFat: number; // in grams
  dailySugar: number; // in grams
}

export interface DaySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  meals: Meal[];
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ADD_MEAL = 'ADD_MEAL',
  SETTINGS = 'SETTINGS'
}
