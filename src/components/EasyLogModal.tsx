import React, { useState } from 'react';
import { X, Dumbbell, UtensilsCrossed, Droplets, Scale, Briefcase, Camera, Check } from 'lucide-react';
import { triggerHaptic } from '../utils/formatters';

interface EasyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWorkout: () => void;
  onOpenFood: () => void;
  onAddWater: (litres: number) => void;
  onSaveWeight: (weight: number) => void;
  onOpenWork: () => void;
  onOpenPhoto: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
  currentWeight?: number | null;
}

export const EasyLogModal: React.FC<EasyLogModalProps> = ({
  isOpen,
  onClose,
  onOpenWorkout,
  onOpenFood,
  onAddWater,
  onSaveWeight,
  onOpenWork,
  onOpenPhoto,
  currentWeight
}) => {
  const [showWaterInput, setShowWaterInput] = useState(false);
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [customWater, setCustomWater] = useState('');
  const [weightValue, setWeightValue] = useState(currentWeight ? String(currentWeight) : '');
  const [savedWeightSuccess, setSavedWeightSuccess] = useState(false);

  if (!isOpen) return null;

  const handleWaterQuick = (amount: number) => {
    triggerHaptic(15);
    onAddWater(amount);
    onClose();
  };

  const handleCustomWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customWater);
    if (!isNaN(val) && val > 0) {
      triggerHaptic(15);
      onAddWater(val);
      onClose();
    }
  };

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(weightValue);
    if (!isNaN(val) && val > 0) {
      triggerHaptic(15);
      onSaveWeight(val);
      setSavedWeightSuccess(true);
      setTimeout(() => {
        setSavedWeightSuccess(false);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#16232B]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border-t sm:border border-[#CADCE0] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Easy Log"
      >
        {/* Top Drag Handle for Mobile */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#CADCE0]" />
        </div>

        {/* Modal Header */}
        <div className="px-5 pt-3 pb-3 flex items-center justify-between border-b border-[#CADCE0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5B04] animate-pulse" />
              <h2 className="font-h2 text-xl text-[#16232B] tracking-tight">Easy Log</h2>
            </div>
            <p className="font-caption text-xs text-[#526673] mt-0.5">Quick entry for workouts, meals, water & habits</p>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              onClose();
            }}
            className="p-2 rounded-xl text-[#526673] hover:text-[#16232B] hover:bg-[#E4EEF0] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="p-4 overflow-y-auto space-y-3">
          
          {/* Quick Grid - 2 Main Primary CTAs */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Workout */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                onClose();
                onOpenWorkout();
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFF0E8] to-white border border-[#FF5B04]/30 hover:border-[#FF5B04] text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FF5B04] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div className="font-title text-sm text-[#16232B] mt-2.5">Log Workout</div>
              <div className="font-caption text-[11px] text-[#526673] mt-0.5">Exercises, sets & weight</div>
            </button>

            {/* Food / Meal */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                onClose();
                onOpenFood();
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-[#E6F2F3] to-white border border-[#075056]/30 hover:border-[#075056] text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#075056] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div className="font-title text-sm text-[#16232B] mt-2.5">Log Meal</div>
              <div className="font-caption text-[11px] text-[#526673] mt-0.5">Calories & macros</div>
            </button>
          </div>

          {/* Quick Water Logger Section */}
          <div className="p-3.5 rounded-2xl bg-[#E4EEF0]/60 border border-[#CADCE0]">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#075056] text-white">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-title text-xs text-[#16232B]">Hydration</span>
                  <span className="font-caption text-[11px] text-[#526673] ml-1.5">Quick add</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWaterInput(!showWaterInput)}
                className="text-[11px] font-button-s text-[#075056] hover:underline"
              >
                {showWaterInput ? 'Presets' : 'Custom'}
              </button>
            </div>

            {!showWaterInput ? (
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleWaterQuick(0.25)}
                  className="py-2 px-1 rounded-xl bg-white border border-[#CADCE0] hover:border-[#075056] text-center font-button-s text-xs text-[#16232B] hover:text-[#075056] transition-all active:scale-95 shadow-2xs"
                >
                  +250 ml
                </button>
                <button
                  type="button"
                  onClick={() => handleWaterQuick(0.5)}
                  className="py-2 px-1 rounded-xl bg-white border border-[#CADCE0] hover:border-[#075056] text-center font-button-s text-xs text-[#16232B] hover:text-[#075056] transition-all active:scale-95 shadow-2xs"
                >
                  +500 ml
                </button>
                <button
                  type="button"
                  onClick={() => handleWaterQuick(0.75)}
                  className="py-2 px-1 rounded-xl bg-white border border-[#CADCE0] hover:border-[#075056] text-center font-button-s text-xs text-[#16232B] hover:text-[#075056] transition-all active:scale-95 shadow-2xs"
                >
                  +750 ml
                </button>
                <button
                  type="button"
                  onClick={() => handleWaterQuick(1.0)}
                  className="py-2 px-1 rounded-xl bg-white border border-[#CADCE0] hover:border-[#075056] text-center font-button-s text-xs text-[#16232B] hover:text-[#075056] transition-all active:scale-95 shadow-2xs"
                >
                  +1.0 L
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomWaterSubmit} className="flex gap-2">
                <input
                  type="number"
                  step="0.05"
                  placeholder="Litres (e.g. 0.35)"
                  value={customWater}
                  onChange={(e) => setCustomWater(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#CADCE0] text-xs font-semibold text-[#16232B]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#075056] text-white font-button-s text-xs"
                >
                  Add
                </button>
              </form>
            )}
          </div>

          {/* Quick Weight Logger Section */}
          <div className="p-3.5 rounded-2xl bg-[#E4EEF0]/60 border border-[#CADCE0]">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#FF5B04] text-white">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-title text-xs text-[#16232B]">Body Weight</span>
                  <span className="font-caption text-[11px] text-[#526673] ml-1.5">
                    {currentWeight ? `Current: ${currentWeight} kg` : 'Log today'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWeightInput(!showWeightInput)}
                className="text-[11px] font-button-s text-[#FF5B04] hover:underline"
              >
                {showWeightInput ? 'Hide' : 'Log'}
              </button>
            </div>

            {showWeightInput && (
              <form onSubmit={handleWeightSubmit} className="flex gap-2 animate-in fade-in duration-150">
                <input
                  type="number"
                  step="0.1"
                  placeholder="kg (e.g. 74.5)"
                  value={weightValue}
                  onChange={(e) => setWeightValue(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#CADCE0] text-xs font-semibold text-[#16232B]"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={savedWeightSuccess}
                  className="px-4 py-2 rounded-xl bg-[#FF5B04] text-white font-button-s text-xs flex items-center gap-1.5"
                >
                  {savedWeightSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Work & Photo Row */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* Work Task */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                onClose();
                onOpenWork();
              }}
              className="p-3 rounded-2xl bg-white border border-[#CADCE0] hover:border-[#16232B] text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex items-center gap-2.5"
            >
              <div className="p-2 rounded-xl bg-[#16232B] text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="font-title text-xs text-[#16232B]">Log Work</div>
                <div className="font-caption text-[10px] text-[#526673]">Focus & tasks</div>
              </div>
            </button>

            {/* Photo Upload */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic(15);
                onClose();
                onOpenPhoto('workout');
              }}
              className="p-3 rounded-2xl bg-white border border-[#CADCE0] hover:border-[#16232B] text-left transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xs flex items-center gap-2.5"
            >
              <div className="p-2 rounded-xl bg-[#16232B] text-white">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <div className="font-title text-xs text-[#16232B]">Add Photo</div>
                <div className="font-caption text-[10px] text-[#526673]">Physique & meals</div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
