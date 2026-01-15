import React from 'react';
import { Meal } from '../types';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface MealCardProps {
  meal: Meal;
  onDelete: (id: string) => void;
  onClick?: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onDelete, onClick }) => {
  return (
    <Card 
      className="mb-3 overflow-hidden border-none shadow-sm hover:shadow-md bg-white rounded-xl sm:rounded-2xl cursor-pointer transition-all active:scale-[0.98]"
      onClick={onClick}
    >
      <CardContent className="p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3">
        {meal.imageUrl ? (
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl object-cover bg-gray-100 shrink-0"
          />
        ) : (
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-orange-50 flex items-center justify-center text-lg sm:text-xl shrink-0">
            🥘
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-gray-900 truncate text-xs sm:text-sm">{meal.name}</h3>
            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
              {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-orange-400" />
              <span className="text-[10px] sm:text-xs text-gray-600 font-medium">{meal.nutrition.calories} kcal</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-gray-400">
              <span>{meal.nutrition.protein}g P</span>
              <span>•</span>
              <span>{meal.nutrition.carbs || 0}g C</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(meal.id);
          }}
          className="text-gray-300 hover:text-red-400 h-7 w-7 sm:h-8 sm:w-8 hover:bg-red-50 rounded-full"
        >
          <Trash2 size={14} className="sm:w-4 sm:h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default MealCard;
