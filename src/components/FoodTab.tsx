import React, { useState } from 'react';
import { Plus, Trash2, UtensilsCrossed, Sparkles, Camera, ChevronRight } from 'lucide-react';
import { FoodItem, UserSettings } from '../types';
import { SpecimenTrack } from './SpecimenTrack';

interface FoodTabProps {
  foodItems: FoodItem[];
  settings: UserSettings;
  onOpenAddModal: (mealPreset?: string) => void;
  onDeleteFood: (item: FoodItem) => void;
  onQuickAdd: (food: Omit<FoodItem, 'date'>) => void;
  onSelectDetail: (item: FoodItem) => void;
  onOpenPhotoUploader: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
}

export const FoodTab: React.FC<FoodTabProps> = ({
  foodItems,
  settings,
  onOpenAddModal,
  onDeleteFood,
  onQuickAdd,
  onSelectDetail,
  onOpenPhotoUploader
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
    <div className="space-y-4 pb-28 animate-in fade-in duration-150">
      
      {/* 1. Macro Summary Hero Specimen Card */}
      <div className="specimen-card p-4 border border-[#D8D3C8]">
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D3C8]/70">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#EB5E28] font-bold">
              // ARCHIVE // NUTRITION & FUEL
            </div>
            <div className="text-xl font-display font-black text-[#2C2324] uppercase tracking-tight mt-0.5">
              {totalCalories} <span className="font-mono text-xs font-normal text-[#766754]">/ {calTarget} KCAL</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onOpenPhotoUploader('food')}
              className="p-2 rounded-xl btn-cold-foam text-[#EB5E28] hover:text-[#2C2324] transition-colors"
              title="Snap Meal Photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Breakfast')}
              className="flex items-center gap-1 px-3.5 py-2 btn-santiago text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log</span>
            </button>
          </div>
        </div>

        {/* Macro Bars */}
        <div className="grid grid-cols-3 gap-2 pt-3">
          <div className="bg-[#EFECE3] rounded-xl p-2.5 border border-[#D8D3C8]">
            <div className="flex items-center justify-between font-mono text-[10px] mb-1">
              <span className="text-[#2E7D32] font-bold uppercase">PROTEIN</span>
              <span className="text-[#2C2324] font-bold">{totalProtein}g</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#D8D3C8]">
              <div
                className="h-full bg-[#2E7D32] rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalProtein / proTarget) * 100)}%` }}
              ></div>
            </div>
            <div className="font-mono text-[9px] text-[#766754] mt-1">Goal: {proTarget}g</div>
          </div>

          <div className="bg-[#EFECE3] rounded-xl p-2.5 border border-[#D8D3C8]">
            <div className="flex items-center justify-between font-mono text-[10px] mb-1">
              <span className="text-[#EB5E28] font-bold uppercase">CARBS</span>
              <span className="text-[#2C2324] font-bold">{totalCarbs}g</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#D8D3C8]">
              <div
                className="h-full bg-[#EB5E28] rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalCarbs / 250) * 100)}%` }}
              ></div>
            </div>
            <div className="font-mono text-[9px] text-[#766754] mt-1">Target: 250g</div>
          </div>

          <div className="bg-[#EFECE3] rounded-xl p-2.5 border border-[#D8D3C8]">
            <div className="flex items-center justify-between font-mono text-[10px] mb-1">
              <span className="text-[#766754] font-bold uppercase">FATS</span>
              <span className="text-[#2C2324] font-bold">{totalFat}g</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#D8D3C8]">
              <div
                className="h-full bg-[#766754] rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalFat / 70) * 100)}%` }}
              ></div>
            </div>
            <div className="font-mono text-[9px] text-[#766754] mt-1">Target: 70g</div>
          </div>
        </div>
      </div>

      {/* 2. Meal Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...meals].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider font-bold rounded-xl whitespace-nowrap transition-all active:scale-95 ${
              activeFilter === filter
                ? 'bg-[#2C2324] text-white shadow-xs'
                : 'bg-white text-[#766754] hover:text-[#2C2324] border border-[#D8D3C8]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Logged Food Items (Specimen Cards) */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#D8D3C8] text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#EFECE3] mx-auto flex items-center justify-center text-[#2C2324] mb-2 border border-[#D8D3C8]">
              <UtensilsCrossed className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div className="text-sm font-display font-bold text-[#2C2324] uppercase">
              No food logged today
            </div>
            <div className="text-xs text-[#766754] max-w-xs mx-auto mt-1 font-sans">
              Track calories & macros. Tap any logged meal to view full nutrient breakdown or attach plate photos.
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Breakfast')}
                className="px-4 py-2.5 btn-santiago text-xs font-display font-bold uppercase tracking-wider rounded-xl shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Log {activeFilter !== 'All' ? activeFilter : 'Meal'}</span>
              </button>
              <button
                onClick={() => onOpenPhotoUploader('food')}
                className="px-3.5 py-2.5 btn-cold-foam text-xs font-mono font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#EB5E28]" />
                <span>Photo</span>
              </button>
            </div>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectDetail(item)}
              className="specimen-card p-3.5 border border-[#D8D3C8] cursor-pointer hover:border-[#EB5E28] transition-all group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#D8D3C8]/60 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[9px] bg-[#2C2324] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    SPECIMEN #F-0{idx + 1}
                  </span>
                  <span className="font-mono text-[9px] text-[#EB5E28] font-bold uppercase tracking-wide">
                    {item.meal}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-[#766754] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>SPECS</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFood(item);
                    }}
                    className="text-[#D8D3C8] hover:text-[#EB5E28] p-1 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Quantity */}
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-display font-black text-[#2C2324] uppercase tracking-tight">
                  {item.foodItem}
                </h3>
                <span className="font-mono text-[10px] text-[#766754]">{item.quantity}</span>
              </div>

              {/* Specimen Indicator Tracks */}
              <div className="mt-2 space-y-0.5">
                <SpecimenTrack
                  label="Energy"
                  value={item.calories}
                  unit="KCAL"
                  percent={Math.min(100, (item.calories / 800) * 100)}
                  dotColor="#2C2324"
                />
                <SpecimenTrack
                  label="Protein"
                  value={item.protein}
                  unit="G"
                  percent={Math.min(100, (item.protein / 50) * 100)}
                  dotColor="#2E7D32"
                />
                <SpecimenTrack
                  label="Carbs"
                  value={item.carbs}
                  unit="G"
                  percent={Math.min(100, (item.carbs / 80) * 100)}
                  dotColor="#EB5E28"
                />
              </div>

              {item.notes && (
                <div className="text-[10px] font-sans text-[#766754] italic mt-2 pt-1 border-t border-[#D8D3C8]/40 truncate">
                  {item.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 4. Quick 1-Tap Presets */}
      <div className="bg-white rounded-2xl p-4 border border-[#D8D3C8] shadow-xs">
        <div className="flex items-center space-x-1.5 mb-2.5">
          <Sparkles className="w-4 h-4 text-[#EB5E28]" />
          <div className="text-xs font-display font-bold uppercase tracking-wider text-[#2C2324]">
            Quick Presets (1-Tap Log)
          </div>
        </div>

        <div className="space-y-1.5">
          {quickPresets.map((preset, i) => (
            <div
              key={i}
              onClick={() => onQuickAdd(preset)}
              className="flex items-center justify-between p-2.5 bg-[#EFECE3] hover:bg-[#e6e2d7] rounded-xl cursor-pointer border border-[#D8D3C8] active:scale-[0.99] transition-all"
            >
              <div>
                <div className="text-xs font-display font-bold text-[#2C2324] uppercase">{preset.foodItem}</div>
                <div className="text-[10px] font-mono text-[#766754]">{preset.meal} • {preset.quantity}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-display font-black text-[#2C2324]">+{preset.calories} kcal</div>
                <div className="text-[9px] font-mono font-bold text-[#2E7D32]">+{preset.protein}g protein</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
