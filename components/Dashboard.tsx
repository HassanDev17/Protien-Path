import React from 'react';
import { Meal, UserGoals } from '../types';
import ProgressRing from './ProgressRing';
import MealCard from './MealCard';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

interface DashboardProps {
  meals: Meal[];
  goals: UserGoals;
  onDeleteMeal: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ meals, goals, onDeleteMeal }) => {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    // Delay render significantly to allow framer-motion to finish
    const timer = setTimeout(() => setIsMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const today = new Date().setHours(0, 0, 0, 0);
  const todaysMeals = meals.filter(m => m.timestamp >= today).sort((a, b) => b.timestamp - a.timestamp);

  const totalCalories = todaysMeals.reduce((sum, m) => sum + m.nutrition.calories, 0);
  const totalProtein = todaysMeals.reduce((sum, m) => sum + m.nutrition.protein, 0);
  const totalCarbs = todaysMeals.reduce((sum, m) => sum + (m.nutrition.carbs || 0), 0);
  const totalFat = todaysMeals.reduce((sum, m) => sum + (m.nutrition.fat || 0), 0);

  const calorieProgress = Math.min((totalCalories / goals.dailyCalories) * 100, 100);
  const proteinProgress = Math.min((totalProtein / goals.dailyProtein) * 100, 100);
  const carbsProgress = Math.min((totalCarbs / goals.dailyCarbs) * 100, 100);
  const fatProgress = Math.min((totalFat / goals.dailyFat) * 100, 100);

  // Prepare chart data
  const chartData = todaysMeals
    .slice(0, 7) // Last 7 meals
    .reverse()
    .map(m => ({
      name: m.name.substring(0, 10) + (m.name.length > 10 ? '...' : ''),
      calories: m.nutrition.calories,
      protein: m.nutrition.protein
    }));

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
          <h1 className="text-3xl font-bold tracking-tight text-rose-500">Protein Path</h1>
          <p className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </header>

      {/* Progress Rings - Now in a responsive grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Calories", unit: "kcal", value: totalCalories, target: goals.dailyCalories, color: "text-orange-500", icon: "🔥", bg: "bg-orange-50" },
          { label: "Protein", unit: "g", value: totalProtein, target: goals.dailyProtein, color: "text-emerald-500", icon: "🥩", bg: "bg-emerald-50" },
          { label: "Carbs", unit: "g", value: totalCarbs, target: goals.dailyCarbs, color: "text-blue-500", icon: "🍞", bg: "bg-blue-50" },
          { label: "Fat", unit: "g", value: totalFat, target: goals.dailyFat, color: "text-pink-500", icon: "🥑", bg: "bg-pink-50" }
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="flex flex-col p-4 border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-[24px]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                <div className={`${stat.bg} w-8 h-8 rounded-full flex items-center justify-center text-sm`}>
                  {stat.icon}
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-2xl font-bold text-gray-900">{Math.round(stat.value)}
                  <span className="text-xs text-gray-400 font-normal ml-1">{stat.unit}</span>
                </h3>

                <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stat.color.replace('text', 'bg')}`}
                    style={{ width: `${Math.min((stat.value / stat.target) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Goal: {stat.target}{stat.unit}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      {todaysMeals.length > 0 && (
        <motion.div variants={item}>
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Meal Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 150 }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                        interval={0}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '0.5rem',
                          color: 'hsl(var(--popover-foreground))',
                          fontSize: '12px'
                        }}
                        cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                      />
                      <Bar dataKey="calories" fill="#fb923c" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fillOpacity={0.8} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Meal List */}
      <motion.div variants={item} className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Recent Meals</h2>
        {todaysMeals.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground text-center">
              <span className="text-4xl mb-2">🥗</span>
              <p>No meals tracked today yet.</p>
              <p className="text-sm">Tap + to add your first meal.</p>
            </CardContent>
          </Card>
        ) : (
          todaysMeals.map(meal => (
            <motion.div key={meal.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MealCard meal={meal} onDelete={onDeleteMeal} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
