import React, { useState, useEffect } from 'react';
import { Plus, Target, Home, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import AddMeal from './components/AddMeal';
import { Meal, UserGoals, AppView } from './types';
import { getMeals, addMealToSupabase, removeMealFromSupabase } from './services/mealService';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './services/supabaseClient';
import { Login } from './components/Login';
import { ToastContainer, Toast } from './components/Toast';

const DEFAULT_GOALS: UserGoals = {
  dailyCalories: 2500,
  dailyProtein: 150,
  dailyCarbs: 300,
  dailyFat: 70,
  dailySugar: 50
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null); // Use correct type or 'any' for now since Session isn't imported
  const [view, setView] = useState<AppView>(AppView.DASHBOARD);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS);
  const [showSettings, setShowSettings] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 15);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Auth Effect - Check for persisted session and listen for auth changes
  useEffect(() => {
    // Check for existing session in localStorage
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
      }
    });

    // Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load meals from Supabase when user is authenticated
  useEffect(() => {
    if (session?.user?.id) {
      // Clear previous user's meals
      setMeals([]);
      // Load current user's meals
      getMeals().then(setMeals).catch(console.error);
    } else {
      // Clear meals when user logs out
      setMeals([]);
    }
  }, [session?.user?.id]);

  // Load goals from local storage (user-specific)
  useEffect(() => {
    if (session?.user?.id) {
      const goalsKey = `protein_path_goals_${session.user.id}`;
      const savedGoals = localStorage.getItem(goalsKey);
      if (savedGoals) {
        try {
          setGoals(JSON.parse(savedGoals));
        } catch (e) {
          console.error("Failed to parse goals", e);
        }
      } else {
        // Reset to default goals for new user
        setGoals(DEFAULT_GOALS);
      }
    }
  }, [session?.user?.id]);

  // Save goals to local storage (user-specific)
  useEffect(() => {
    if (session?.user?.id) {
      const goalsKey = `protein_path_goals_${session.user.id}`;
      localStorage.setItem(goalsKey, JSON.stringify(goals));
    }
  }, [goals, session?.user?.id]);

  // Render Login if no session
  if (!session) {
    return <Login />;
  }

  const addMeal = async (meal: Meal) => {
    try {
      const newMeal = await addMealToSupabase(meal);
      setMeals(prev => [newMeal, ...prev]);
      setView(AppView.DASHBOARD);
      showToast('Meal added successfully!', 'success');
    } catch (error) {
      showToast('Failed to save meal. Please try again.', 'error');
    }
  };

  const deleteMeal = async (id: string) => {
    try {
      await removeMealFromSupabase(id);
      setMeals(prev => prev.filter(m => m.id !== id));
      showToast('Meal deleted successfully', 'success');
    } catch (error) {
      showToast('Failed to delete meal. Please try again.', 'error');
    }
  };

  const handleUpdateGoals = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCalories = Number(formData.get('calories'));
    const newProtein = Number(formData.get('protein'));
    const newCarbs = Number(formData.get('carbs'));
    const newFat = Number(formData.get('fat'));
    const newSugar = Number(formData.get('sugar'));

    if (newCalories && newProtein) {
      setGoals({
        dailyCalories: newCalories,
        dailyProtein: newProtein,
        dailyCarbs: newCarbs || 300,
        dailyFat: newFat || 70,
        dailySugar: newSugar || 50
      });
      setShowSettings(false);
      showToast('Goals updated successfully!', 'success');
    } else {
      showToast('Please enter valid calories and protein values', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Session will be cleared automatically by the auth state change listener
      setMeals([]);
      setShowSettings(false);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative w-full max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border">

      {/* Settings Modal Overlay */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm"
            >
              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Target className="text-primary" /> Daily Goals
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateGoals} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Calories Target (kcal)</label>
                      <Input
                        name="calories"
                        type="number"
                        defaultValue={goals.dailyCalories}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Protein Target (g)</label>
                      <Input
                        name="protein"
                        type="number"
                        defaultValue={goals.dailyProtein}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Carbs (g)</label>
                        <Input
                          name="carbs"
                          type="number"
                          defaultValue={goals.dailyCarbs}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Fat (g)</label>
                        <Input
                          name="fat"
                          type="number"
                          defaultValue={goals.dailyFat}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Sugar Target (g)</label>
                      <Input
                        name="sugar"
                        type="number"
                        defaultValue={goals.dailySugar}
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowSettings(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                      >
                        Save Goals
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="h-screen overflow-y-auto no-scrollbar p-4 scroll-smooth">
        <AnimatePresence mode="wait">
          {view === AppView.DASHBOARD && (
            <motion.div key="dashboard" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Dashboard
                meals={meals}
                goals={goals}
                onDeleteMeal={deleteMeal}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Add and Nav */}
      <AnimatePresence>
        {view === AppView.ADD_MEAL && (
          <motion.div key="add-meal" className="fixed inset-0 z-40 bg-background" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}>
            <AddMeal
              onAddMeal={addMeal}
              onClose={() => setView(AppView.DASHBOARD)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {view === AppView.DASHBOARD && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4 pointer-events-none">
          <div className="flex items-center justify-between gap-8 bg-white rounded-full px-6 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] pointer-events-auto border border-white/50">
            <Button
              variant="ghost"
              className="p-2 h-12 w-12 text-rose-500 hover:bg-rose-50 rounded-full"
              onClick={() => setView(AppView.DASHBOARD)}
              aria-label="Home"
              title="Home"
            >
              <Home size={24} strokeWidth={2.5} />
            </Button>

            <Button
              className="h-12 w-12 rounded-full bg-rose-500 hover:bg-rose-600 shadow-md text-white border-none"
              onClick={() => setView(AppView.ADD_MEAL)}
              aria-label="Add meal"
              title="Add meal"
            >
              <Plus size={24} strokeWidth={3} />
            </Button>

            <Button
              variant="ghost"
              className="p-2 h-12 w-12 text-rose-500 hover:bg-rose-50 rounded-full"
              onClick={() => setShowSettings(true)}
              aria-label="Goals settings"
              title="Goals settings"
            >
              <Target size={24} strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default App;
