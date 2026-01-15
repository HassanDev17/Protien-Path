import React from 'react';
import { Meal, UserGoals } from '../types';
import ProgressRing from './ProgressRing';
import MealCard from './MealCard';
import MealDetailModal from './MealDetailModal';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, LogOut } from 'lucide-react';

interface DashboardProps {
  meals: Meal[];
  goals: UserGoals;
  onDeleteMeal: (id: string) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ meals, goals, onDeleteMeal, onLogout }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [selectedMeal, setSelectedMeal] = React.useState<Meal | null>(null);

  // Helper functions for date manipulation
  const getStartOfDay = (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const getEndOfDay = (date: Date): number => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getMinDate = (): Date => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getMaxDate = (): Date => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today;
  };

  const canGoPrevious = (): boolean => {
    const minDate = getMinDate();
    const selected = new Date(selectedDate);
    selected.setDate(selected.getDate() - 1);
    return selected.getTime() >= minDate.getTime();
  };

  const canGoNext = (): boolean => {
    const maxDate = getMaxDate();
    const selected = new Date(selectedDate);
    selected.setDate(selected.getDate() + 1);
    return selected.getTime() <= maxDate.getTime();
  };

  const goToPreviousDay = () => {
    if (canGoPrevious()) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    }
  };

  const goToNextDay = () => {
    if (canGoNext()) {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    }
  };

  const goToToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    newDate.setHours(0, 0, 0, 0);
    const minDate = getMinDate();
    const maxDate = getMaxDate();
    
    if (newDate.getTime() >= minDate.getTime() && newDate.getTime() <= maxDate.getTime()) {
      setSelectedDate(newDate);
    }
  };

  // Filter meals for selected date
  const selectedDateStart = getStartOfDay(selectedDate);
  const selectedDateEnd = getEndOfDay(selectedDate);
  const selectedDateMeals = meals.filter(m => 
    m.timestamp >= selectedDateStart && m.timestamp <= selectedDateEnd
  ).sort((a, b) => b.timestamp - a.timestamp);

  const totalCalories = selectedDateMeals.reduce((sum, m) => sum + m.nutrition.calories, 0);
  const totalProtein = selectedDateMeals.reduce((sum, m) => sum + m.nutrition.protein, 0);
  const totalCarbs = selectedDateMeals.reduce((sum, m) => sum + (m.nutrition.carbs || 0), 0);
  const totalFat = selectedDateMeals.reduce((sum, m) => sum + (m.nutrition.fat || 0), 0);
  const totalSugar = selectedDateMeals.reduce((sum, m) => sum + (m.nutrition.sugar || 0), 0);

  const calorieProgress = Math.min((totalCalories / goals.dailyCalories) * 100, 100);
  const proteinProgress = Math.min((totalProtein / goals.dailyProtein) * 100, 100);
  const carbsProgress = Math.min((totalCarbs / goals.dailyCarbs) * 100, 100);
  const fatProgress = Math.min((totalFat / goals.dailyFat) * 100, 100);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="space-y-6 pb-24"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <header className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-500">Protein Path</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="h-9 w-9 sm:h-10 sm:w-10 text-rose-500 hover:bg-rose-50 rounded-full"
          title="Log out"
          aria-label="Log out"
        >
          <LogOut size={20} className="sm:w-5 sm:h-5" />
        </Button>
      </header>

      {/* Date Navigation */}
      <motion.div variants={item} className="flex items-center justify-between gap-1 sm:gap-2 mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousDay}
          disabled={!canGoPrevious()}
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full disabled:opacity-30"
        >
          <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
        </Button>

        <div className="flex-1 flex items-center justify-center gap-1 sm:gap-2">
          <label className="relative flex items-center cursor-pointer group">
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={handleDateChange}
              min={getMinDate().toISOString().split('T')[0]}
              max={getMaxDate().toISOString().split('T')[0]}
              className="absolute opacity-0 w-0 h-0"
            />
            <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-border hover:border-rose-300 transition-colors shadow-sm">
              <Calendar size={14} className="sm:w-4 sm:h-4 text-rose-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: isToday(selectedDate) ? undefined : 'numeric' })}
              </span>
            </div>
          </label>
          
          {!isToday(selectedDate) && (
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs rounded-full border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              Today
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextDay}
          disabled={!canGoNext()}
          className="h-9 w-9 sm:h-10 sm:w-10 rounded-full disabled:opacity-30"
        >
          <ChevronRight size={18} className="sm:w-5 sm:h-5" />
        </Button>
      </motion.div>

      {/* Calories Gauge */}
      <motion.div variants={item}>
        <Card className="border-none shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 rounded-[24px] p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🔥</span>
              <h2 className="text-base sm:text-lg font-semibold text-gray-700">Calories</h2>
            </div>
            <div className="pb-6">
              <ProgressRing
                radius={70}
                stroke={10}
                progress={calorieProgress}
                color="#fb923c"
                label="Calories"
                subLabel={`${Math.round(totalCalories)} / ${goals.dailyCalories} kcal`}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Macros Grid */}
      <motion.div variants={item}>
        <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Macronutrients</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { label: "Protein", unit: "g", value: totalProtein, target: goals.dailyProtein, color: "text-emerald-500", icon: "🥩", bg: "bg-emerald-50", barColor: "bg-emerald-500" },
            { label: "Carbs", unit: "g", value: totalCarbs, target: goals.dailyCarbs, color: "text-blue-500", icon: "🍞", bg: "bg-blue-50", barColor: "bg-blue-500" },
            { label: "Fat", unit: "g", value: totalFat, target: goals.dailyFat, color: "text-pink-500", icon: "🥑", bg: "bg-pink-50", barColor: "bg-pink-500" },
            { label: "Sugar", unit: "g", value: totalSugar, target: goals.dailySugar, color: "text-purple-500", icon: "🍬", bg: "bg-purple-50", barColor: "bg-purple-500" }
          ].map((stat) => (
            <motion.div key={stat.label} variants={item}>
              <Card className="flex flex-col p-3 sm:p-4 border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-[20px] sm:rounded-[24px]">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs sm:text-sm font-semibold text-gray-700">{stat.label}</span>
                  <div className={`${stat.bg} w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm`}>
                    {stat.icon}
                  </div>
                </div>

                <div className="mt-auto">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{Math.round(stat.value)}
                    <span className="text-[10px] sm:text-xs text-gray-400 font-normal ml-1">{stat.unit}</span>
                  </h3>

                  <div className="w-full bg-gray-100 h-1.5 sm:h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stat.barColor}`}
                      style={{ width: `${Math.min((stat.value / stat.target) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 mt-1">Goal: {stat.target}{stat.unit}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Meal List */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Meals</h2>
          {selectedDateMeals.length > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              {selectedDateMeals.length} {selectedDateMeals.length === 1 ? 'meal' : 'meals'}
            </span>
          )}
        </div>
        {selectedDateMeals.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground text-center">
              <span className="text-4xl mb-2">🥗</span>
              <p>
                {isToday(selectedDate) 
                  ? "No meals tracked today yet." 
                  : `No meals tracked on ${selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}.`}
              </p>
              <p className="text-sm">
                {isToday(selectedDate) 
                  ? "Tap + to add your first meal." 
                  : "Navigate to another date or add a meal for today."}
              </p>
            </CardContent>
          </Card>
        ) : (
          selectedDateMeals.map(meal => (
            <motion.div key={meal.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MealCard 
                meal={meal} 
                onDelete={onDeleteMeal}
                onClick={() => setSelectedMeal(meal)}
              />
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Meal Detail Modal */}
      <MealDetailModal 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
      />
    </motion.div>
  );
};

export default Dashboard;
