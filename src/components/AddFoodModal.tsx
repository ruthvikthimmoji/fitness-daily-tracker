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

  // Update meal if defaultMeal changes
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
    // reset form
    setFoodItem('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-800 p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Log Food Item</h2>
              <div className="text-[11px] text-slate-400">Appends row to your Food Log sheet</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          
          {/* Meal selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Meal</label>
            <div className="grid grid-cols-4 gap-1.5">
              {meals.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setMeal(m)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    meal === m
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Food Item Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Food / Meal Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Scrambled Eggs with Avocado Toast"
              value={foodItem}
              onChange={(e) => setFoodItem(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Portion / Quantity</label>
            <input
              type="text"
              placeholder="e.g. 2 slices, 200g, 1 bowl"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Calories and Macros Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Calories</label>
              <input
                type="number"
                placeholder="kcal"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-cyan-400 block mb-1">Protein (g)</label>
              <input
                type="number"
                step="0.5"
                placeholder="g"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-amber-400 block mb-1">Carbs (g)</label>
              <input
                type="number"
                step="0.5"
                placeholder="g"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-rose-400 block mb-1">Fat (g)</label>
              <input
                type="number"
                step="0.5"
                placeholder="g"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Notes (optional)</label>
            <input
              type="text"
              placeholder="e.g. post-workout meal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-95 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add to Food Log</span>
          </button>
        </form>

      </div>
    </div>
  );
};
