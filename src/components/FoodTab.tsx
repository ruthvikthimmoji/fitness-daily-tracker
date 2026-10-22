import React, { useState } from 'react';
import { Plus, Trash2, UtensilsCrossed, Sparkles } from 'lucide-react';
import { FoodItem, UserSettings } from '../types';

interface FoodTabProps {
  foodItems: FoodItem[];
  settings: UserSettings;
  onOpenAddModal: (mealPreset?: string) => void;
  onDeleteFood: (item: FoodItem) => void;
  onQuickAdd: (food: Omit<FoodItem, 'date'>) => void;
}

export const FoodTab: React.FC<FoodTabProps> = ({
  foodItems,
  settings,
  onOpenAddModal,
  onDeleteFood,
  onQuickAdd
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const totalCalories = foodItems.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = foodItems.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = foodItems.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFat = foodItems.reduce((sum, item) => sum + (item.fat || 0), 0);

  const calTarget = settings.dailyCalorieTarget || 2200;
  const proTarget = settings.dailyProteinTarget || 130;

  // Quick preset foods
  const quickPresets: Omit<FoodItem, 'date'>[] = [
    { meal: 'Breakfast', foodItem: 'Oats with Milk & Banana', quantity: '1 bowl', calories: 380, protein: 14, carbs: 65, fat: 7 },
    { meal: 'Snacks', foodItem: 'Whey Protein Shake', quantity: '1 scoop (30g)', calories: 120, protein: 25, carbs: 2, fat: 1.5 },
    { meal: 'Lunch', foodItem: 'Grilled Chicken Breast & Rice', quantity: '200g chicken + 1 cup rice', calories: 520, protein: 48, carbs: 55, fat: 8 },
    { meal: 'Breakfast', foodItem: 'Boiled Eggs', quantity: '3 large eggs', calories: 210, protein: 18, carbs: 1.5, fat: 15 },
    { meal: 'Snacks', foodItem: 'Greek Yogurt & Almonds', quantity: '150g yogurt + 15g nuts', calories: 220, protein: 18, carbs: 10, fat: 12 },
  ];

  const filteredItems = activeFilter === 'All' 
    ? foodItems 
    : foodItems.filter(f => f.meal.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="space-y-4 pb-24">
      
      {/* 1. Macro Summary Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-5 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Nutrition Today</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {totalCalories} <span className="text-sm font-normal text-slate-400">/ {calTarget} kcal</span>
            </div>
          </div>
          <button
            onClick={() => onOpenAddModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Food</span>
          </button>
        </div>

        {/* Macro Bars */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-cyan-400 font-bold">Protein</span>
              <span className="text-white font-semibold">{totalProtein}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalProtein / proTarget) * 100)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Goal: {proTarget}g</div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-amber-400 font-bold">Carbs</span>
              <span className="text-white font-semibold">{totalCarbs}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalCarbs / 250) * 100)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Total carbs</div>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-rose-400 font-bold">Fat</span>
              <span className="text-white font-semibold">{totalFat}g</span>
            </div>
            <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-400 rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalFat / 70) * 100)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Total fats</div>
          </div>
        </div>
      </div>

      {/* 2. Meal Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...meals].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all active:scale-95 ${
              activeFilter === filter
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Logged Food Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-slate-900/60 rounded-3xl p-8 border border-slate-800/80 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-slate-400 mb-3">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">No food logged for today</div>
            <div className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              Tap the button below or choose a quick preset to log your meals. Everything updates in your Food Log sheet.
            </div>
            <button
              onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Breakfast')}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log {activeFilter !== 'All' ? activeFilter : 'Meal'}</span>
            </button>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-sm flex items-start justify-between gap-3 group hover:border-slate-700 transition-all"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                    {item.meal}
                  </span>
                  <span className="text-xs text-slate-400">{item.quantity}</span>
                </div>
                
                <div className="text-sm font-bold text-white mt-1.5">{item.foodItem}</div>

                <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1.5">
                  <span className="font-semibold text-white">{item.calories} kcal</span>
                  <span>•</span>
                  <span>P: <strong className="text-cyan-400">{item.protein}g</strong></span>
                  <span>•</span>
                  <span>C: <strong className="text-amber-400">{item.carbs}g</strong></span>
                  <span>•</span>
                  <span>F: <strong className="text-rose-400">{item.fat}g</strong></span>
                </div>

                {item.notes && (
                  <div className="text-[11px] text-slate-500 italic mt-1">{item.notes}</div>
                )}
              </div>

              <button
                onClick={() => onDeleteFood(item)}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 4. Quick 1-Tap Presets */}
      <div className="bg-slate-900/80 rounded-3xl p-4 border border-slate-800">
        <div className="flex items-center space-x-1.5 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <div className="text-xs font-bold text-white">Quick 1-Tap Presets</div>
        </div>

        <div className="space-y-2">
          {quickPresets.map((preset, i) => (
            <div
              key={i}
              onClick={() => onQuickAdd(preset)}
              className="flex items-center justify-between p-2.5 bg-slate-800/60 hover:bg-slate-800 rounded-xl cursor-pointer border border-slate-700/40 active:scale-[0.99] transition-all"
            >
              <div>
                <div className="text-xs font-semibold text-white">{preset.foodItem}</div>
                <div className="text-[10px] text-slate-400">{preset.meal} • {preset.quantity}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-emerald-400">+{preset.calories} kcal</div>
                <div className="text-[10px] text-cyan-400">{preset.protein}g protein</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
