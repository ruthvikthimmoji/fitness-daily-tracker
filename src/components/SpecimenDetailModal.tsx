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

    // Load photos for this date or item
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
          // If any photo matches category
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
        return `SPECIMEN #W-${detail.item.date.replace(/-/g, '')}`;
      case 'food':
        return `SPECIMEN #F-${detail.item.date.replace(/-/g, '')}`;
      case 'daily':
        return `SPECIMEN #D-${detail.item.date.replace(/-/g, '')}`;
      case 'work':
        return `SPECIMEN #T-${detail.item.date.replace(/-/g, '')}`;
      case 'photo':
        return `VAULT #${detail.item.category.toUpperCase()}-${detail.item.date.replace(/-/g, '')}`;
    }
  };

  const getTitle = () => {
    switch (detail.type) {
      case 'workout':
        return detail.item.exercise;
      case 'food':
        return detail.item.foodItem;
      case 'daily':
        return `DAILY LOG // ${detail.item.day}`;
      case 'work':
        return detail.item.task;
      case 'photo':
        return detail.item.caption || `${detail.item.category.toUpperCase()} CAPTURE`;
    }
  };

  const getSubtitle = () => {
    switch (detail.type) {
      case 'workout':
        return `${detail.item.workoutType} SESSION`;
      case 'food':
        return `${detail.item.meal.toUpperCase()} ENTRY`;
      case 'daily':
        return `COMPREHENSIVE DAILY SPECIMEN`;
      case 'work':
        return `${detail.item.category.toUpperCase()} • ${detail.item.status.toUpperCase()}`;
      case 'photo':
        return `ENCRYPTED VAULT SPECIMEN`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl border border-[#D8D3C8] p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Specimen Header bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D8D3C8]">
          <div className="flex items-center space-x-2">
            <span className="font-label text-[10px] bg-[#2C2324] text-white px-2 py-0.5 rounded uppercase tracking-wider">
              {getCatalogCode()}
            </span>
            <span className="font-caption text-[#766754] flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#EB5E28]" />
              {detail.type === 'photo' ? detail.item.date : (detail.item as any).date}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {selectedPhoto && (
              <button
                onClick={handleDownload}
                className="p-1.5 text-[#EB5E28] hover:bg-[#EFECE3] rounded-lg transition-colors"
                title="Download photo to phone"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-[#EB5E28] hover:bg-red-50 rounded-lg transition-colors"
                title="Delete this record"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#766754] hover:text-[#2C2324] rounded-lg hover:bg-[#EFECE3] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Specimen Visual (Photo or Editorial Color Plate) */}
        <div className="mt-3.5">
          {selectedPhoto ? (
            <div className="relative w-full aspect-16/10 rounded-xl overflow-hidden border border-[#D8D3C8] bg-[#2C2324] group">
              <img
                src={selectedPhoto.dataUrl}
                alt={getTitle()}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 rounded-lg bg-[#2C2324]/85 backdrop-blur-md text-white font-button-s text-xs flex items-center gap-1 shadow-md hover:bg-[#2C2324]"
                >
                  <Download className="w-3 h-3 text-[#EB5E28]" />
                  <span>Save to Phone</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-24 rounded-xl border border-[#D8D3C8] bg-[#EFECE3] flex items-center justify-between px-5">
              <div>
                <span className="font-label text-[9px] uppercase tracking-wider text-[#766754] block">
                  {getSubtitle()}
                </span>
                <span className="font-h2 text-[#2C2324] tracking-tight block mt-0.5">
                  {getTitle()}
                </span>
              </div>

              {onOpenPhotoUploader && (
                <button
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
                  className="p-2.5 rounded-xl bg-white border border-[#D8D3C8] text-[#2C2324] shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 font-button-s text-xs"
                  title="Attach Photo to this specimen"
                >
                  <Camera className="w-4 h-4 text-[#EB5E28]" />
                  <span>Attach Photo</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Specimen Title & Classification */}
        <div className="mt-3 pb-2 border-b border-[#D8D3C8]/60 flex items-baseline justify-between">
          <div>
            <h1 className="font-h2 text-[#2C2324] tracking-tight">
              {getTitle()}
            </h1>
            <div className="font-caption text-[#766754] mt-0.5">
              {getSubtitle()}
            </div>
          </div>

          <div className="text-right">
            <span className="font-badge text-[#EB5E28] px-2 py-0.5 bg-[#EFECE3] border border-[#D8D3C8] rounded">
              VERIFIED LOG
            </span>
          </div>
        </div>

        {/* Technical Data Specification Sheet */}
        <div className="mt-3 space-y-0.5">
          <div className="font-label text-[#EB5E28] pb-1">
            // SPECIMEN TECHNICAL SPECS
          </div>

          {detail.type === 'workout' && (
            <>
              <SpecimenTrack label="Sets" value={detail.item.sets} unit="SETS" percent={(detail.item.sets / 8) * 100} dotColor="#EB5E28" />
              <SpecimenTrack label="Reps / Set" value={detail.item.reps} unit="REPS" percent={(detail.item.reps / 25) * 100} dotColor="#EB5E28" />
              <SpecimenTrack label="Load / Bar" value={detail.item.weightKg} unit="KG" percent={Math.min(100, (detail.item.weightKg / 140) * 100)} dotColor="#2C2324" />
              <SpecimenTrack
                label="Total Volume"
                value={(detail.item.volumeKg || detail.item.sets * detail.item.reps * detail.item.weightKg).toLocaleString()}
                unit="KG"
                percent={Math.min(100, ((detail.item.volumeKg || 1000) / 4000) * 100)}
                dotColor="#EB5E28"
              />
              {detail.item.caloriesBurned ? (
                <SpecimenTrack label="Energy Out" value={detail.item.caloriesBurned} unit="KCAL" percent={Math.min(100, (detail.item.caloriesBurned / 500) * 100)} dotColor="#EB5E28" />
              ) : null}
              {detail.item.durationMin ? (
                <SpecimenTrack label="Duration" value={detail.item.durationMin} unit="MIN" percent={Math.min(100, (detail.item.durationMin / 90) * 100)} dotColor="#766754" />
              ) : null}
            </>
          )}

          {detail.type === 'food' && (
            <>
              <SpecimenTrack label="Serving / Qty" value={detail.item.quantity || '1 serving'} />
              <SpecimenTrack label="Calories" value={detail.item.calories} unit="KCAL" percent={Math.min(100, (detail.item.calories / 1000) * 100)} dotColor="#EB5E28" />
              <SpecimenTrack label="Protein" value={detail.item.protein} unit="G" percent={Math.min(100, (detail.item.protein / 60) * 100)} dotColor="#2C2324" />
              <SpecimenTrack label="Carbohydrates" value={detail.item.carbs} unit="G" percent={Math.min(100, (detail.item.carbs / 100) * 100)} dotColor="#EB5E28" />
              <SpecimenTrack label="Fats" value={detail.item.fat} unit="G" percent={Math.min(100, (detail.item.fat / 40) * 100)} dotColor="#766754" />
            </>
          )}

          {detail.type === 'daily' && (
            <>
              <SpecimenTrack label="Daily Score" value={detail.item.dailyScore} unit="%" percent={detail.item.dailyScore} dotColor="#EB5E28" />
              <SpecimenTrack label="Body Mass" value={detail.item.weight !== null ? detail.item.weight : '--'} unit="KG" percent={detail.item.weight ? Math.min(100, (detail.item.weight / 100) * 100) : undefined} dotColor="#EB5E28" />
              <SpecimenTrack label="Hydration" value={detail.item.water || 0} unit="L" percent={Math.min(100, ((detail.item.water || 0) / 3.5) * 100)} dotColor="#2C2324" />
              <SpecimenTrack label="Movement" value={(detail.item.steps || 0).toLocaleString()} unit="STEPS" percent={Math.min(100, ((detail.item.steps || 0) / 12000) * 100)} dotColor="#EB5E28" />
              <SpecimenTrack label="Sleep" value={detail.item.sleep || 0} unit="HRS" percent={Math.min(100, ((detail.item.sleep || 0) / 9) * 100)} dotColor="#766754" />
              <SpecimenTrack label="Workout Done" value={detail.item.workoutDone ? 'YES' : 'NO'} />
              <SpecimenTrack label="Energy In" value={(detail.item.caloriesIn || 0).toLocaleString()} unit="KCAL" percent={Math.min(100, ((detail.item.caloriesIn || 0) / 2500) * 100)} dotColor="#EB5E28" />
            </>
          )}

          {detail.type === 'work' && (
            <>
              <SpecimenTrack label="Category" value={detail.item.category} />
              <SpecimenTrack label="Duration" value={detail.item.hours} unit="HRS" percent={Math.min(100, (detail.item.hours / 8) * 100)} dotColor="#EB5E28" />
              <SpecimenTrack label="Status" value={detail.item.status} />
            </>
          )}

          {detail.type === 'photo' && (
            <>
              <SpecimenTrack label="Classification" value={detail.item.category.toUpperCase()} />
              <SpecimenTrack label="Timestamp" value={new Date(detail.item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
              <SpecimenTrack label="Encryption" value="AES / INDEXEDDB" />
            </>
          )}
        </div>

        {/* Specimen Notes Box */}
        {(detail.type === 'workout' && detail.item.notes) ||
        (detail.type === 'food' && detail.item.notes) ||
        (detail.type === 'daily' && detail.item.notes) ||
        (detail.type === 'work' && detail.item.notes) ||
        (detail.type === 'photo' && detail.item.caption) ? (
          <div className="mt-3.5 p-3 rounded-xl bg-[#EFECE3] border border-[#D8D3C8]">
            <div className="font-label text-[#766754] mb-1">
              Specimen Notes & Observations
            </div>
            <div className="font-body-m text-[#2C2324] whitespace-pre-wrap">
              {detail.type === 'photo'
                ? detail.item.caption
                : (detail.item as any).notes}
            </div>
          </div>
        ) : null}

        {/* Gallery thumbnails strip if more photos exist for this specimen date */}
        {associatedPhotos.length > 1 && (
          <div className="mt-3.5 pt-3 border-t border-[#D8D3C8]">
            <div className="font-label text-[#766754] mb-2 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#EB5E28]" />
              <span>Related Specimen Photos ({associatedPhotos.length})</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {associatedPhotos.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPhoto(p)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border shrink-0 transition-all ${
                    selectedPhoto?.id === p.id
                      ? 'border-[#EB5E28] ring-2 ring-[#EB5E28]/30 scale-105'
                      : 'border-[#D8D3C8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={p.dataUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-[#D8D3C8] flex items-center gap-2">
          {selectedPhoto && (
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 rounded-xl btn-santiago font-button-l flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download to Phone</span>
            </button>
          )}

          <button
            onClick={onClose}
            className={`py-2.5 px-5 rounded-xl btn-cold-foam font-button-l ${
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
