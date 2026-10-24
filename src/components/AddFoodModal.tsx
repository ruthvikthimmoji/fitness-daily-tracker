import React, { useState } from 'react';
import { X, UtensilsCrossed, Plus } from 'lucide-react';
import { FoodItem } from '../types';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: FoodItem) => void;
  selectedDate: string;
  defaultMeal?: string;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  onClose,
  onAddFood,
  selectedDate,
  defaultMeal = 'Breakfast'
}) => {
  const [meal, setMeal] = useState(defaultMeal);
  const [foodItem, setFoodItem] = useState('');
  const [quantity, setQuantity] = useState('1 serving');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (defaultMeal) setMeal(defaultMeal);
  }, [defaultMeal]);

  if (!isOpen) return null;

  const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItem.trim()) return;

    onAddFood({
      date: selectedDate,
      meal,
      foodItem: foodItem.trim(),
      quantity: quantity.trim() || '1 serving',
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      notes: notes.trim()
    });

    onClose();
    setFoodItem('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-[#E8E3D5] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D5]/70">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-[#FFFFF0] text-[#FF5B04] border border-[#E8E3D5]">
              <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-label text-[#FF5B04]">
                // ARCHIVE // NUTRITION SPECIMEN
              </div>
              <h2 className="font-h2 text-[#16232B]">
                Log Food Item
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#526673] hover:text-[#16232B] rounded-lg hover:bg-[#FFFFF0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-3.5">
          
          {/* Meal selector */}
          <div>
            <label className="font-label text-[#526673] block mb-1">Meal</label>
            <div className="grid grid-cols-4 gap-1">
              {meals.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMeal(m)}
                  className={`py-1.5 font-button-s text-xs rounded-xl border transition-all ${
                    meal === m
                      ? 'bg-[#16232B] text-white border-[#16232B] shadow-xs'
                      : 'bg-[#FFFFF0] text-[#526673] border-[#E8E3D5] hover:bg-[#EFECE3]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Food Item Name */}
          <div>
            <label className="font-label text-[#526673] block mb-1">Food / Meal Item *</label>
            <input
              type="text"
              required
              placeholder="e.g. Oats with banana"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              className="w-full bg-white border border-[#E8E3D5] rounded-xl px-3 py-2 font-body-m text-[#16232B] font-bold placeholder-[#526673]/50 focus:outline-none focus:border-[#FF5B04]"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="font-label text-[#526673] block mb-1">Portion / Quantity</label>
            <input
              type="text"
              placeholder="e.g. 1 bowl, 200g, 2 eggs"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-white border border-[#E8E3D5] rounded-xl px-3 py-1.5 font-body-m text-[#16232B] font-bold placeholder-[#526673]/50 focus:outline-none focus:border-[#FF5B04]"
            />
          </div>

          {/* Calories and Macros Grid */}
          <div className="grid grid-cols-4 gap-1.5">
            <div>
              <label className="font-label text-[#FF5B04] block mb-0.5">Calories</label>
              <input
                type="number"
                placeholder="kcal"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-white border border-[#E8E3D5] rounded-xl px-2 py-1.5 font-stat tabular-nums text-sm text-[#16232B] focus:outline-none focus:border-[#FF5B04]"
              />
            </div>
            <div>
              <label className="font-label text-[#16232B] block mb-0.5">Protein (g)</label>
              <input
                type="number"
                step="0.5"
                placeholder="g"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full bg-white border border-[#E8E3D5] rounded-xl px-2 py-1.5 font-stat tabular-nums text-sm text-[#16232B] focus:outline-none focus:border-[#FF5B04]"
              />
            </div>
            <div>
              <label className="font-label text-[#FF5B04] block mb-0.5">Carbs (g)</label>
              <input
                type="number"
                step="0.5"
                placeholder="g"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full bg-white border border-[#E8E3D5] rounded-xl px-2 py-1.5 font-stat tabular-nums text-sm text-[#16232B] focus:outline-none focus:border-[#FF5B04]"
              />
            </div>
            <div>
              <label className="font-label text-[#526673] block mb-0.5">Fat (g)</label>
              <input
                type="number"
                step="0.5"
                placeholder="g"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full bg-white border border-[#E8E3D5] rounded-xl px-2 py-1.5 font-stat tabular-nums text-sm text-[#16232B] focus:outline-none focus:border-[#FF5B04]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-label text-[#526673] block mb-1">Notes (optional)</label>
            <input
              type="text"
              placeholder="e.g. post-workout breakfast"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-[#E8E3D5] rounded-xl px-3 py-1.5 font-body-m text-[#16232B] placeholder-[#526673]/50 focus:outline-none focus:border-[#FF5B04]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3 btn-santiago active:scale-95 text-white font-button-l rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add to Food Log Sheet</span>
          </button>
        </form>

      </div>
    </div>
  );
};
