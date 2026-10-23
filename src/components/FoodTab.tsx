import React, { useState } from 'react';
import { Plus, Trash2, UtensilsCrossed, ChevronRight } from 'lucide-react';
import { FoodItem, UserSettings } from '../types';
import { triggerHaptic } from '../utils/formatters';

interface FoodTabProps {
  foodItems: FoodItem[];
  settings: UserSettings;
  onOpenAddModal: (mealPreset?: string) => void;
  onDeleteFood: (item: FoodItem) => void;
  onQuickAdd: (food: Omit<FoodItem, 'date'>) => void;
  onSelectDetail: (item: FoodItem) => void;
  onOpenPhotoUploader?: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
}

export const FoodTab: React.FC<FoodTabProps> = ({
  foodItems,
  settings,
  onOpenAddModal,
  onDeleteFood,
  onQuickAdd,
  onSelectDetail
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [showAllPresets, setShowAllPresets] = useState<boolean>(false);

  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const totalCalories = foodItems.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = foodItems.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = foodItems.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFat = foodItems.reduce((sum, item) => sum + (item.fat || 0), 0);

  const calTarget = settings.dailyCalorieTarget || 2200;
  const proTarget = settings.dailyProteinTarget || 130;

  const quickPresets: Omit<FoodItem, 'date'>[] = [
    { meal: 'Breakfast', foodItem: 'Oats with milk & banana', quantity: '1 bowl', calories: 380, protein: 14, carbs: 65, fat: 7 },
    { meal: 'Snacks', foodItem: 'Whey protein shake', quantity: '1 scoop (30 g)', calories: 120, protein: 25, carbs: 2, fat: 1.5 },
    { meal: 'Lunch', foodItem: 'Grilled chicken & rice', quantity: '200 g chicken + 1 cup rice', calories: 520, protein: 40, carbs: 55, fat: 8 },
    { meal: 'Breakfast', foodItem: '3 large eggs', quantity: '3 eggs', calories: 210, protein: 18, carbs: 1.5, fat: 15 },
    { meal: 'Snacks', foodItem: 'Greek yogurt & almonds', quantity: '150 g yogurt + 15 g nuts', calories: 220, protein: 18, carbs: 10, fat: 12 },
  ];

  const visiblePresets = showAllPresets ? quickPresets : quickPresets.slice(0, 4);

  const filteredItems = activeFilter === 'All' 
    ? foodItems 
    : foodItems.filter(f => f.meal.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="space-y-3.5 pb-28 animate-in fade-in duration-150 relative">
      
      {/* 1. Summary Header Strip (Wireframe Food, Page 15) */}
      <div className="bg-white rounded-2xl p-3.5 border border-[#E2DACB] shadow-2xs flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#F5F2EA] text-[#2B2324]">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <div>
            <div className="font-score-m text-base text-[#2B2324]">
              {totalCalories.toLocaleString()} <span className="font-caption text-[#5E5444]">/ {calTarget.toLocaleString()} kcal</span>
            </div>
            <div className="font-caption text-[11px] text-[#5E5444] mt-0.5">
              Protein {totalProtein} g · Carbs {totalCarbs} g · Fat {totalFat} g
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="font-caption text-[11px] text-[#2F6B2A] font-semibold">
            {totalProtein} of {proTarget} g protein
          </span>
          <div className="w-20 h-1.5 bg-[#EEE9DD] rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-[#2F6B2A] rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalProtein / proTarget) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Filter Chips Row with Right-Edge Fade (B6) */}
      <div className="chips">
        {['All', ...meals].map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => {
              triggerHaptic(8);
              setActiveFilter(filter);
            }}
            className={`chip px-3 py-1.5 font-button-s text-xs rounded-xl border transition-all ${
              activeFilter === filter
                ? 'bg-[#2B2324] text-white border-[#2B2324] shadow-xs'
                : 'bg-white text-[#5E5444] border-[#E2DACB] hover:bg-[#EEE9DD]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Quick Add Presets First (L7 & Wireframe 7) */}
      <div className="bg-white rounded-2xl p-4 border border-[#E2DACB] shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E2DACB]/60">
          <span className="font-label text-[11px] text-[#5E5444]">
            QUICK ADD
          </span>
          <button
            type="button"
            onClick={() => setShowAllPresets(!showAllPresets)}
            className="font-button-s text-xs text-[#C4501F] hover:underline"
          >
            {showAllPresets ? 'Show less' : 'See all'}
          </button>
        </div>

        <div className="space-y-2">
          {visiblePresets.map((preset, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 bg-[#F5F2EA] hover:bg-[#EEE9DD] rounded-xl border border-[#E2DACB] transition-colors gap-2"
            >
              <div className="min-w-0 flex-1">
                <div className="font-title text-xs text-[#2B2324] truncate">{preset.foodItem}</div>
                <div className="font-caption text-[11px] text-[#5E5444] mt-0.5">
                  {preset.calories} kcal · {preset.protein} g protein · {preset.quantity}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic(15);
                  onQuickAdd(preset);
                }}
                className="w-8 h-8 rounded-full bg-[#C4501F] hover:bg-[#A83F17] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-90"
                title={`Log ${preset.foodItem}`}
                aria-label={`Log ${preset.foodItem}`}
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Logged Food Items List */}
      <div className="space-y-2">
        <div className="font-label text-[11px] text-[#5E5444] px-1">
          TODAY'S MEALS
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-[#E2DACB] text-center shadow-2xs">
            <p className="font-body-m text-xs text-[#5E5444]">
              Nothing logged yet. Add your first meal.
            </p>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectDetail(item)}
              className="bg-white rounded-2xl p-3.5 border border-[#E2DACB] cursor-pointer hover:border-[#C4501F] transition-all shadow-2xs group"
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E2DACB]/60 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-label text-[10px] bg-[#2B2324] text-white px-1.5 py-0.5 rounded">
                    #{idx + 1}
                  </span>
                  <span className="font-label text-[10px] text-[#C4501F]">
                    {item.meal}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-caption text-[#5E5444] flex items-center gap-0.5 group-hover:text-[#2B2324] transition-colors">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerHaptic(10);
                      onDeleteFood(item);
                    }}
                    className="text-[#E2DACB] hover:text-[#B3261E] p-1 transition-colors"
                    title="Delete"
                    aria-label="Delete food item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <h3 className="font-title text-sm text-[#2B2324] font-semibold">
                  {item.foodItem}
                </h3>
                <span className="font-stat text-xs text-[#2B2324] font-bold">
                  {item.calories} kcal
                </span>
              </div>

              <div className="font-caption text-[#5E5444] mt-1">
                {item.quantity} · Protein {item.protein} g · Carbs {item.carbs} g · Fat {item.fat} g
              </div>

              {item.notes && (
                <div className="text-[11px] font-body-s text-[#5E5444] italic mt-1.5 pt-1 border-t border-[#E2DACB]/40 truncate">
                  {item.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 5. Single Floating Action Button (L5 & Wireframe 9) */}
      <button
        type="button"
        onClick={() => {
          triggerHaptic(15);
          onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Breakfast');
        }}
        className="btn-fab"
        title="Log meal"
        aria-label="Log meal"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

    </div>
  );
};
