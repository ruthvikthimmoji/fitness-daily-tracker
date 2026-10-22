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
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#595959]">Nutrition Today</div>
            <div className="text-xl font-black text-[#1F4E5F] mt-0.5">
              {totalCalories} <span className="text-xs font-semibold text-[#595959]">/ {calTarget} kcal</span>
            </div>
          </div>
          <button
            onClick={() => onOpenAddModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1F4E5F] hover:bg-[#163a47] active:scale-95 text-white font-bold text-xs rounded-lg shadow-xs transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Food</span>
          </button>
        </div>

        {/* Macro Bars */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#2E9E6B] font-bold">Protein</span>
              <span className="text-[#1A1A1A] font-bold">{totalProtein}g</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#BFBFBF]/60">
              <div
                className="h-full bg-[#2E9E6B] rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalProtein / proTarget) * 100)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#595959] mt-1">Goal: {proTarget}g</div>
          </div>

          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#F28E2B] font-bold">Carbs</span>
              <span className="text-[#1A1A1A] font-bold">{totalCarbs}g</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#BFBFBF]/60">
              <div
                className="h-full bg-[#F28E2B] rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalCarbs / 250) * 100)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#595959] mt-1">Total carbs</div>
          </div>

          <div className="bg-[#EAF2F5] rounded-lg p-2.5 border border-[#BFBFBF]/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#EC407A] font-bold">Fat</span>
              <span className="text-[#1A1A1A] font-bold">{totalFat}g</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#BFBFBF]/60">
              <div
                className="h-full bg-[#EC407A] rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalFat / 70) * 100)}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-[#595959] mt-1">Total fats</div>
          </div>
        </div>
      </div>

      {/* 2. Meal Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...meals].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all active:scale-95 ${
              activeFilter === filter
                ? 'bg-[#1F4E5F] text-white'
                : 'bg-white text-[#595959] hover:text-[#1F4E5F] border border-[#BFBFBF]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Logged Food Items List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-[#BFBFBF] text-center shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#EAF2F5] mx-auto flex items-center justify-center text-[#4472C4] mb-2 border border-[#BFBFBF]/60">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-sm font-bold text-[#1F4E5F]">No food logged today</div>
            <div className="text-xs text-[#595959] max-w-xs mx-auto mt-1 italic">
              Data over guesses. Tap below or pick a preset to log your meals.
            </div>
            <button
              onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Breakfast')}
              className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1F4E5F] hover:bg-[#163a47] text-white font-bold text-xs rounded-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Log {activeFilter !== 'All' ? activeFilter : 'Meal'}</span>
            </button>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-3.5 border border-[#BFBFBF] shadow-xs flex items-start justify-between gap-3"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EAF2F5] text-[#2E75B6] border border-[#BFBFBF]/60 uppercase tracking-wide">
                    {item.meal}
                  </span>
                  <span className="text-xs text-[#595959]">{item.quantity}</span>
                </div>
                
                <div className="text-sm font-bold text-[#1A1A1A] mt-1">{item.foodItem}</div>

                <div className="flex items-center space-x-2.5 text-xs text-[#595959] mt-1">
                  <strong className="text-[#4472C4] font-black">{item.calories} kcal</strong>
                  <span>•</span>
                  <span>P: <strong className="text-[#2E9E6B] font-bold">{item.protein}g</strong></span>
                  <span>•</span>
                  <span>C: <strong className="text-[#F28E2B] font-bold">{item.carbs}g</strong></span>
                  <span>•</span>
                  <span>F: <strong className="text-[#EC407A] font-bold">{item.fat}g</strong></span>
                </div>

                {item.notes && (
                  <div className="text-[11px] text-[#595959] italic mt-1">{item.notes}</div>
                )}
              </div>

              <button
                onClick={() => onDeleteFood(item)}
                className="p-1.5 text-[#BFBFBF] hover:text-[#C00000] rounded-md transition-colors"
                title="Delete item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 4. Quick 1-Tap Presets */}
      <div className="bg-white rounded-xl p-4 border border-[#BFBFBF] shadow-xs">
        <div className="flex items-center space-x-1.5 mb-2.5">
          <Sparkles className="w-4 h-4 text-[#2E75B6]" />
          <div className="text-xs font-bold text-[#1F4E5F]">Quick 1-Tap Presets</div>
        </div>

        <div className="space-y-1.5">
          {quickPresets.map((preset, i) => (
            <div
              key={i}
              onClick={() => onQuickAdd(preset)}
              className="flex items-center justify-between p-2.5 bg-[#EAF2F5] hover:bg-[#dbe7ec] rounded-lg cursor-pointer border border-[#BFBFBF]/70 active:scale-[0.99] transition-all"
            >
              <div>
                <div className="text-xs font-bold text-[#1A1A1A]">{preset.foodItem}</div>
                <div className="text-[10px] text-[#595959]">{preset.meal} • {preset.quantity}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black text-[#4472C4]">+{preset.calories} kcal</div>
                <div className="text-[10px] font-bold text-[#2E9E6B]">{preset.protein}g protein</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
