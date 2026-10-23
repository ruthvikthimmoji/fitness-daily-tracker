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
    <div className="space-y-4 pb-24 animate-in fade-in duration-150">
      
      {/* 1. Macro Summary Hero Specimen Card */}
      <div className="specimen-card p-4 border border-[#D9D1CA]">
        <div className="flex items-center justify-between pb-3 border-b border-[#D9D1CA]/70">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#0B369A] font-bold">
              // ARCHIVE // NUTRITION & FUEL
            </div>
            <div className="text-xl font-display font-black text-[#141414] uppercase tracking-tight mt-0.5">
              {totalCalories} <span className="font-mono text-xs font-normal text-[#6E6A63]">/ {calTarget} KCAL</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onOpenPhotoUploader('food')}
              className="p-2 rounded-xl btn-stone text-[#0B369A] hover:text-[#141414] transition-colors"
              title="Snap Meal Photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Breakfast')}
              className="flex items-center gap-1 px-3 py-2 btn-gallery-blue text-white font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log</span>
            </button>
          </div>
        </div>

        {/* Macro Bars */}
        <div className="grid grid-cols-3 gap-2 pt-3">
          <div className="bg-[#F3EFEA] rounded-xl p-2.5 border border-[#D9D1CA]">
            <div className="flex items-center justify-between font-mono text-[10px] mb-1">
              <span className="text-[#2E7D32] font-bold uppercase">PROTEIN</span>
              <span className="text-[#141414] font-bold">{totalProtein}g</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#D9D1CA]">
              <div
                className="h-full bg-[#2E7D32] rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalProtein / proTarget) * 100)}%` }}
              ></div>
            </div>
            <div className="font-mono text-[9px] text-[#6E6A63] mt-1">Goal: {proTarget}g</div>
          </div>

          <div className="bg-[#F3EFEA] rounded-xl p-2.5 border border-[#D9D1CA]">
            <div className="flex items-center justify-between font-mono text-[10px] mb-1">
              <span className="text-[#C34811] font-bold uppercase">CARBS</span>
              <span className="text-[#141414] font-bold">{totalCarbs}g</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#D9D1CA]">
              <div
                className="h-full bg-[#C34811] rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalCarbs / 250) * 100)}%` }}
              ></div>
            </div>
            <div className="font-mono text-[9px] text-[#6E6A63] mt-1">Target: 250g</div>
          </div>

          <div className="bg-[#F3EFEA] rounded-xl p-2.5 border border-[#D9D1CA]">
            <div className="flex items-center justify-between font-mono text-[10px] mb-1">
              <span className="text-[#E5B338] font-bold uppercase">FATS</span>
              <span className="text-[#141414] font-bold">{totalFat}g</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#D9D1CA]">
              <div
                className="h-full bg-[#E5B338] rounded-full transition-all"
                style={{ width: `${Math.min(100, (totalFat / 70) * 100)}%` }}
              ></div>
            </div>
            <div className="font-mono text-[9px] text-[#6E6A63] mt-1">Target: 70g</div>
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
                ? 'bg-[#141414] text-white shadow-xs'
                : 'bg-white text-[#6E6A63] hover:text-[#141414] border border-[#D9D1CA]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 3. Logged Food Items (Specimen Cards) */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#D9D1CA] text-center shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-[#F3EFEA] mx-auto flex items-center justify-center text-[#0B369A] mb-2 border border-[#D9D1CA]">
              <UtensilsCrossed className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="text-sm font-display font-bold text-[#141414] uppercase">
              No food logged today
            </div>
            <div className="text-xs text-[#6E6A63] max-w-xs mx-auto mt-1 font-sans">
              Track calories & macros. Tap any logged meal to view full nutrient breakdown or attach plate photos.
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => onOpenAddModal(activeFilter !== 'All' ? activeFilter : 'Breakfast')}
                className="px-4 py-2.5 btn-gallery-blue text-xs font-display font-bold uppercase tracking-wider rounded-xl shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Log {activeFilter !== 'All' ? activeFilter : 'Meal'}</span>
              </button>
              <button
                onClick={() => onOpenPhotoUploader('food')}
                className="px-3.5 py-2.5 btn-stone text-xs font-mono font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5 text-[#0B369A]" />
                <span>Photo</span>
              </button>
            </div>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectDetail(item)}
              className="specimen-card p-3.5 border border-[#D9D1CA] cursor-pointer hover:border-[#0B369A] transition-all group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#EBE6E0]/70 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[9px] bg-[#141414] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    SPECIMEN #F-0{idx + 1}
                  </span>
                  <span className="font-mono text-[9px] text-[#0B369A] font-bold uppercase tracking-wide">
                    {item.meal}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-[#0B369A] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    <span>SPECS</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFood(item);
                    }}
                    className="text-[#D9D1CA] hover:text-[#C34811] p-1 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Quantity */}
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-display font-black text-[#141414] uppercase tracking-tight">
                  {item.foodItem}
                </h3>
                <span className="font-mono text-[10px] text-[#6E6A63]">{item.quantity}</span>
              </div>

              {/* Specimen Indicator Tracks */}
              <div className="mt-2 space-y-0.5">
                <SpecimenTrack
                  label="Energy"
                  value={item.calories}
                  unit="KCAL"
                  percent={Math.min(100, (item.calories / 800) * 100)}
                  dotColor="#0B369A"
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
                  dotColor="#C34811"
                />
              </div>

              {item.notes && (
                <div className="text-[10px] font-sans text-[#6E6A63] italic mt-2 pt-1 border-t border-[#EBE6E0]/50 truncate">
                  {item.notes}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 4. Quick 1-Tap Presets */}
      <div className="bg-white rounded-2xl p-4 border border-[#D9D1CA] shadow-xs">
        <div className="flex items-center space-x-1.5 mb-2.5">
          <Sparkles className="w-4 h-4 text-[#0B369A]" />
          <div className="text-xs font-display font-bold uppercase tracking-wider text-[#141414]">
            Quick Presets (1-Tap Log)
          </div>
        </div>

        <div className="space-y-1.5">
          {quickPresets.map((preset, i) => (
            <div
              key={i}
              onClick={() => onQuickAdd(preset)}
              className="flex items-center justify-between p-2.5 bg-[#F3EFEA] hover:bg-[#EAE5DE] rounded-xl cursor-pointer border border-[#D9D1CA] active:scale-[0.99] transition-all"
            >
              <div>
                <div className="text-xs font-display font-bold text-[#141414] uppercase">{preset.foodItem}</div>
                <div className="text-[10px] font-mono text-[#6E6A63]">{preset.meal} • {preset.quantity}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-display font-black text-[#0B369A]">+{preset.calories} kcal</div>
                <div className="text-[9px] font-mono font-bold text-[#2E7D32]">+{preset.protein}g protein</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
