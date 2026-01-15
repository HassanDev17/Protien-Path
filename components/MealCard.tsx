import React from 'react';
import { Meal } from '../types';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface MealCardProps {
  meal: Meal;
  onDelete: (id: string) => void;
}

const MealCard: React.FC<MealCardProps> = ({ meal, onDelete }) => {
  return (
    <Card className="mb-3 overflow-hidden border-none shadow-sm hover:shadow-md bg-white rounded-2xl">
      <CardContent className="p-3 flex items-center gap-3">
        {meal.imageUrl ? (
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-xl shrink-0">
            🥘
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-bold text-gray-900 truncate text-sm">{meal.name}</h3>
            <span className="text-[10px] text-gray-400 font-medium">
              {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span className="text-xs text-gray-600 font-medium">{meal.nutrition.calories} kcal</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <span>{meal.nutrition.protein}g P</span>
              <span>•</span>
              <span>{meal.nutrition.carbs || 0}g C</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(meal.id)}
          className="text-gray-300 hover:text-red-400 h-8 w-8 hover:bg-red-50 rounded-full"
        >
          <Trash2 size={16} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default MealCard;
