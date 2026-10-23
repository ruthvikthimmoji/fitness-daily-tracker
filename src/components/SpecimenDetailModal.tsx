import React, { useState, useEffect } from 'react';
import { X, Download, Trash2, Camera, Calendar, Tag } from 'lucide-react';
import { SpecimenTrack } from './SpecimenTrack';
import { WorkoutItem, FoodItem, DailyLog, WorkItem, StoredPhoto } from '../types';
import { downloadPhotoToPhone, getPhotosForDate } from '../services/photoStorage';

export type LogDetailType =
  | { type: 'workout'; item: WorkoutItem }
  | { type: 'food'; item: FoodItem }
  | { type: 'daily'; item: DailyLog }
  | { type: 'work'; item: WorkItem }
  | { type: 'photo'; item: StoredPhoto };

interface SpecimenDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: LogDetailType | null;
  onDelete?: () => void;
  onOpenPhotoUploader?: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other', logId?: string) => void;
}

export const SpecimenDetailModal: React.FC<SpecimenDetailModalProps> = ({
  isOpen,
  onClose,
  detail,
  onDelete,
  onOpenPhotoUploader
}) => {
  const [associatedPhotos, setAssociatedPhotos] = useState<StoredPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<StoredPhoto | null>(null);

  useEffect(() => {
    if (!detail) {
      setAssociatedPhotos([]);
      setSelectedPhoto(null);
      return;
    }

    const dateStr =
      detail.type === 'workout'
        ? detail.item.date
        : detail.type === 'food'
        ? detail.item.date
        : detail.type === 'daily'
        ? detail.item.date
        : detail.type === 'work'
        ? detail.item.date
        : detail.item.date;

    getPhotosForDate(dateStr).then((photos) => {
      if (detail.type === 'photo') {
        setSelectedPhoto(detail.item);
      } else {
        setAssociatedPhotos(photos);
        if (photos.length > 0) {
          const cat =
            detail.type === 'workout'
              ? 'workout'
              : detail.type === 'food'
              ? 'food'
              : detail.type === 'daily'
              ? 'physique'
              : 'other';
          const match = photos.find((p) => p.category === cat) || photos[0];
          setSelectedPhoto(match);
        } else {
          setSelectedPhoto(null);
        }
      }
    });
  }, [detail]);

  if (!isOpen || !detail) return null;

  const handleDownload = () => {
    if (selectedPhoto) {
      downloadPhotoToPhone(selectedPhoto);
    }
  };

  const getCatalogCode = () => {
    switch (detail.type) {
      case 'workout':
        return `TRAINING · ${detail.item.date}`;
      case 'food':
        return `MEAL · ${detail.item.date}`;
      case 'daily':
        return `DAILY LOG · ${detail.item.date}`;
      case 'work':
        return `WORK · ${detail.item.date}`;
      case 'photo':
        return `PHOTO · ${detail.item.date}`;
    }
  };

  const getTitle = () => {
    switch (detail.type) {
      case 'workout':
        return detail.item.exercise;
      case 'food':
        return detail.item.foodItem;
      case 'daily':
        return `Daily log · ${detail.item.day}`;
      case 'work':
        return detail.item.task;
      case 'photo':
        return detail.item.caption || `${detail.item.category} capture`;
    }
  };

  const getSubtitle = () => {
    switch (detail.type) {
      case 'workout':
        return `${detail.item.workoutType} session`;
      case 'food':
        return `${detail.item.meal} entry`;
      case 'daily':
        return `Comprehensive log`;
      case 'work':
        return `${detail.item.category} · ${detail.item.status}`;
      case 'photo':
        return `Private photo`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-[#E2DACB] p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2DACB]">
          <div className="flex items-center space-x-2">
            <span className="font-label text-[10px] bg-[#2B2324] text-white px-2 py-0.5 rounded uppercase tracking-wider">
              {getCatalogCode()}
            </span>
            <span className="font-caption text-[#5E5444] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#C4501F]" />
              {detail.type === 'photo' ? detail.item.date : (detail.item as any).date}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {selectedPhoto && (
              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 text-[#C4501F] hover:bg-[#F5F2EA] rounded-lg transition-colors"
                title="Download photo"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="p-1.5 text-[#B3261E] hover:bg-red-50 rounded-lg transition-colors"
                title="Delete this record"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#5E5444] hover:text-[#2B2324] rounded-lg hover:bg-[#F5F2EA] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-3.5">
          {selectedPhoto ? (
            <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden border border-[#E2DACB] bg-[#2B2324] group">
              <img
                src={selectedPhoto.dataUrl}
                alt={getTitle()}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1 rounded-lg bg-[#2B2324]/85 backdrop-blur-md text-white font-button-s text-xs flex items-center gap-1 shadow-md hover:bg-[#2B2324]"
                >
                  <Download className="w-3 h-3 text-[#C4501F]" />
                  <span>Save to Phone</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-24 rounded-xl border border-[#E2DACB] bg-[#F5F2EA] flex items-center justify-between px-5">
              <div>
                <span className="font-label text-[9px] uppercase tracking-wider text-[#5E5444] block">
                  {getSubtitle()}
                </span>
                <span className="font-h2 text-base text-[#2B2324] tracking-tight block mt-0.5">
                  {getTitle()}
                </span>
              </div>

              {onOpenPhotoUploader && (
                <button
                  type="button"
                  onClick={() => {
                    const cat =
                      detail.type === 'workout'
                        ? 'workout'
                        : detail.type === 'food'
                        ? 'food'
                        : detail.type === 'daily'
                        ? 'physique'
                        : 'other';
                    onOpenPhotoUploader(cat);
                  }}
                  className="p-2.5 rounded-xl bg-white border border-[#E2DACB] text-[#2B2324] shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 font-button-s text-xs"
                  title="Attach Photo"
                >
                  <Camera className="w-4 h-4 text-[#C4501F]" />
                  <span>Attach Photo</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Title */}
        <div className="mt-3 pb-2 border-b border-[#E2DACB]/60 flex items-baseline justify-between">
          <div>
            <h1 className="font-h2 text-lg text-[#2B2324] tracking-tight">
              {getTitle()}
            </h1>
            <div className="font-caption text-[#5E5444] mt-0.5">
              {getSubtitle()}
            </div>
          </div>

          <div className="text-right">
            <span className="font-label text-[10px] text-[#2F6B2A] px-2 py-0.5 bg-[#E3EEDF] border border-[#E2DACB] rounded">
              VERIFIED
            </span>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="mt-3 space-y-0.5">
          <div className="font-label text-[#5E5444] pb-1">
            DETAILS & SPECIFICATIONS
          </div>

          {detail.type === 'workout' && (
            <>
              <SpecimenTrack label="Sets" value={detail.item.sets} unit="sets" percent={(detail.item.sets / 8) * 100} dotColor="#C4501F" />
              <SpecimenTrack label="Reps / Set" value={detail.item.reps} unit="reps" percent={(detail.item.reps / 25) * 100} dotColor="#C4501F" />
              <SpecimenTrack label="Load / Bar" value={detail.item.weightKg} unit="kg" percent={Math.min(100, (detail.item.weightKg / 140) * 100)} dotColor="#2B2324" />
              <SpecimenTrack
                label="Total Volume"
                value={(detail.item.volumeKg || detail.item.sets * detail.item.reps * detail.item.weightKg).toLocaleString()}
                unit="kg"
                percent={Math.min(100, ((detail.item.volumeKg || 1000) / 4000) * 100)}
                dotColor="#C4501F"
              />
              {detail.item.caloriesBurned ? (
                <SpecimenTrack label="Burned" value={detail.item.caloriesBurned} unit="kcal" percent={Math.min(100, (detail.item.caloriesBurned / 500) * 100)} dotColor="#C4501F" />
              ) : null}
              {detail.item.durationMin ? (
                <SpecimenTrack label="Duration" value={detail.item.durationMin} unit="min" percent={Math.min(100, (detail.item.durationMin / 90) * 100)} dotColor="#5E5444" />
              ) : null}
            </>
          )}

          {detail.type === 'food' && (
            <>
              <SpecimenTrack label="Serving / Qty" value={detail.item.quantity || '1 serving'} />
              <SpecimenTrack label="Calories" value={detail.item.calories} unit="kcal" percent={Math.min(100, (detail.item.calories / 1000) * 100)} dotColor="#C4501F" />
              <SpecimenTrack label="Protein" value={detail.item.protein} unit="g" percent={Math.min(100, (detail.item.protein / 60) * 100)} dotColor="#2F6B2A" />
              <SpecimenTrack label="Carbohydrates" value={detail.item.carbs} unit="g" percent={Math.min(100, (detail.item.carbs / 100) * 100)} dotColor="#C4501F" />
              <SpecimenTrack label="Fats" value={detail.item.fat} unit="g" percent={Math.min(100, (detail.item.fat / 40) * 100)} dotColor="#8A5A00" />
            </>
          )}

          {detail.type === 'daily' && (
            <>
              <SpecimenTrack label="Daily Score" value={detail.item.dailyScore} unit="%" percent={detail.item.dailyScore} dotColor="#C4501F" />
              <SpecimenTrack label="Body Mass" value={detail.item.weight !== null ? detail.item.weight : '--'} unit="kg" percent={detail.item.weight ? Math.min(100, (detail.item.weight / 100) * 100) : undefined} dotColor="#C4501F" />
              <SpecimenTrack label="Hydration" value={detail.item.water || 0} unit="L" percent={Math.min(100, ((detail.item.water || 0) / 3.5) * 100)} dotColor="#2F5D8A" />
              <SpecimenTrack label="Movement" value={(detail.item.steps || 0).toLocaleString()} unit="steps" percent={Math.min(100, ((detail.item.steps || 0) / 12000) * 100)} dotColor="#C4501F" />
              <SpecimenTrack label="Sleep" value={detail.item.sleep || 0} unit="hrs" percent={Math.min(100, ((detail.item.sleep || 0) / 9) * 100)} dotColor="#5E5444" />
              <SpecimenTrack label="Workout Done" value={detail.item.workoutDone ? 'YES' : 'NO'} />
              <SpecimenTrack label="Calories In" value={(detail.item.caloriesIn || 0).toLocaleString()} unit="kcal" percent={Math.min(100, ((detail.item.caloriesIn || 0) / 2500) * 100)} dotColor="#C4501F" />
            </>
          )}

          {detail.type === 'work' && (
            <>
              <SpecimenTrack label="Category" value={detail.item.category} />
              <SpecimenTrack label="Duration" value={detail.item.hours} unit="hrs" percent={Math.min(100, (detail.item.hours / 8) * 100)} dotColor="#C4501F" />
              <SpecimenTrack label="Status" value={detail.item.status} />
            </>
          )}

          {detail.type === 'photo' && (
            <>
              <SpecimenTrack label="Category" value={detail.item.category.toUpperCase()} />
              <SpecimenTrack label="Timestamp" value={new Date(detail.item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
              <SpecimenTrack label="Storage" value="Local IndexedDB" />
            </>
          )}
        </div>

        {/* Notes */}
        {(detail.type === 'workout' && detail.item.notes) ||
        (detail.type === 'food' && detail.item.notes) ||
        (detail.type === 'daily' && detail.item.notes) ||
        (detail.type === 'work' && detail.item.notes) ||
        (detail.type === 'photo' && detail.item.caption) ? (
          <div className="mt-3.5 p-3 rounded-xl bg-[#F5F2EA] border border-[#E2DACB]">
            <div className="font-label text-[10px] text-[#5E5444] mb-1">
              Notes & observations
            </div>
            <div className="font-body-m text-xs text-[#2B2324] whitespace-pre-wrap">
              {detail.type === 'photo'
                ? detail.item.caption
                : (detail.item as any).notes}
            </div>
          </div>
        ) : null}

        {/* Photos strip */}
        {associatedPhotos.length > 1 && (
          <div className="mt-3.5 pt-3 border-t border-[#E2DACB]">
            <div className="font-label text-[10px] text-[#5E5444] mb-2 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#C4501F]" />
              <span>Related Photos ({associatedPhotos.length})</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {associatedPhotos.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPhoto(p)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border shrink-0 transition-all ${
                    selectedPhoto?.id === p.id
                      ? 'border-[#C4501F] ring-2 ring-[#C4501F]/30 scale-105'
                      : 'border-[#E2DACB] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p.dataUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-[#E2DACB] flex items-center gap-2">
          {selectedPhoto && (
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 py-2.5 rounded-xl btn-ember font-button-l flex items-center justify-center gap-1.5 shadow-sm text-xs"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`py-2.5 px-5 rounded-xl btn-cold-foam font-button-l text-xs ${
              !selectedPhoto ? 'flex-1' : ''
            }`}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
