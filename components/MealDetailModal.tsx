import React from 'react';
import { Meal } from '../types';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface MealDetailModalProps {
  meal: Meal | null;
  onClose: () => void;
}

const MealDetailModal: React.FC<MealDetailModalProps> = ({ meal, onClose }) => {
  if (!meal) return null;

  const nutrition = meal.nutrition;
  const totalMacros = (nutrition.carbs || 0) + (nutrition.fat || 0) + nutrition.protein + (nutrition.sugar || 0);
  const carbsPercentage = totalMacros > 0 ? ((nutrition.carbs || 0) / totalMacros) * 100 : 0;
  const fatPercentage = totalMacros > 0 ? ((nutrition.fat || 0) / totalMacros) * 100 : 0;
  const proteinPercentage = totalMacros > 0 ? (nutrition.protein / totalMacros) * 100 : 0;
  const sugarPercentage = totalMacros > 0 ? ((nutrition.sugar || 0) / totalMacros) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="w-full border-none shadow-2xl bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
              <CardTitle className="text-xl font-bold text-gray-900">Meal Details</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Meal Image and Name */}
              <div className="flex items-start gap-4">
                {meal.imageUrl ? (
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-orange-50 flex items-center justify-center text-3xl shrink-0">
                    🥘
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{meal.name}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(meal.timestamp).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(meal.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {meal.description && (
                    <p className="text-sm text-gray-600 mt-2">{meal.description}</p>
                  )}
                </div>
              </div>

              {/* Total Calories */}
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Calories</p>
                    <p className="text-3xl font-bold text-orange-600">{nutrition.calories}</p>
                    <p className="text-xs text-gray-500 mt-1">kcal</p>
                  </div>
                  <div className="text-4xl">🔥</div>
                </div>
              </div>

              {/* Macro Breakdown */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Macronutrients
                </h3>

                {/* Protein */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-sm font-semibold text-gray-700">Protein</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{nutrition.protein}g</span>
                      {totalMacros > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          {proteinPercentage.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${totalMacros > 0 ? proteinPercentage : 0}%` }}
                    />
                  </div>
                </div>

                {/* Carbs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-semibold text-gray-700">Carbohydrates</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {nutrition.carbs || 0}g
                      </span>
                      {totalMacros > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          {carbsPercentage.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${carbsPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Fat */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                      <span className="text-sm font-semibold text-gray-700">Fat</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {nutrition.fat || 0}g
                      </span>
                      {totalMacros > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          {fatPercentage.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 rounded-full transition-all"
                      style={{ width: `${fatPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Sugar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm font-semibold text-gray-700">Sugar</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">
                        {nutrition.sugar || 0}g
                      </span>
                      {totalMacros > 0 && (
                        <span className="text-xs text-gray-500 ml-2">
                          {sugarPercentage.toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${sugarPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {nutrition.estimatedWeight && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Estimated serving:</span> {nutrition.estimatedWeight}
                  </p>
                </div>
              )}

              {/* Close Button */}
              <Button
                onClick={onClose}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white mt-4 shadow-md"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MealDetailModal;

