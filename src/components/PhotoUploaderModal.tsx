import React, { useState, useRef } from 'react';
import { X, Camera, Upload, Check, AlertCircle } from 'lucide-react';
import { compressImageFile, savePhoto, StoredPhoto } from '../services/photoStorage';

interface PhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSaved: (photo: StoredPhoto) => void;
  defaultCategory?: 'workout' | 'physique' | 'food' | 'scale' | 'other';
  selectedDate: string;
  linkedLogId?: string;
}

export const PhotoUploaderModal: React.FC<PhotoUploaderModalProps> = ({
  isOpen,
  onClose,
  onPhotoSaved,
  defaultCategory = 'workout',
  selectedDate,
  linkedLogId
}) => {
  const [category, setCategory] = useState<'workout' | 'physique' | 'food' | 'scale' | 'other'>(defaultCategory);
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);
      const compressed = await compressImageFile(file, 1600, 0.85);
      setPreviewUrl(compressed);
    } catch (err) {
      console.error('Photo compression error:', err);
      setErrorMessage('Failed to process image. Please try another photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!previewUrl) {
      setErrorMessage('Please select or capture a photo first.');
      return;
    }

    try {
      setIsProcessing(true);
      const photo = await savePhoto({
        date: selectedDate,
        category,
        dataUrl: previewUrl,
        caption: caption.trim() || undefined,
        logId: linkedLogId
      });

      onPhotoSaved(photo);
      onClose();
    } catch (err) {
      console.error('Save photo error:', err);
      setErrorMessage('Failed to save photo to private local storage.');
    } finally {
      setIsProcessing(false);
    }
  };

  const categories: { id: 'workout' | 'physique' | 'food' | 'scale' | 'other'; label: string; tag: string }[] = [
    { id: 'workout', label: 'Workout', tag: 'GYM' },
    { id: 'physique', label: 'Physique', tag: 'BODY' },
    { id: 'food', label: 'Meal', tag: 'DIET' },
    { id: 'scale', label: 'Scale', tag: 'WEIGHT' },
    { id: 'other', label: 'Other', tag: 'LOG' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#16232B]/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl border border-[#E8E3D5] p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3D5]">
          <div>
            <div className="font-label text-[10px] text-[#FF5B04] font-bold">
              PHOTO LOG · {selectedDate}
            </div>
            <h2 className="font-h2 text-base text-[#16232B] mt-0.5">
              Attach Photo
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#526673] hover:text-[#16232B] rounded-xl hover:bg-[#FFFFF0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="mt-4 space-y-4">
          
          {/* Photo Preview / Picker Box */}
          <div className="w-full aspect-4/3 rounded-2xl border-2 border-dashed border-[#E8E3D5] overflow-hidden bg-[#FFFFF0]/40 flex flex-col items-center justify-center relative">
            {previewUrl ? (
              <div className="relative w-full h-full group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-[#16232B] rounded-xl font-button-s shadow-md text-xs"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center text-[#526673]">
                <div className="w-8 h-8 border-2 border-[#E8E3D5] border-t-[#FF5B04] rounded-full animate-spin" />
                <span className="font-caption text-xs mt-2">Compressing photo...</span>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-3.5 rounded-2xl bg-white text-[#FF5B04] border border-[#E8E3D5] shadow-2xs hover:scale-105 active:scale-95 transition-all"
                    title="Take photo with camera"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 rounded-2xl bg-white text-[#16232B] border border-[#E8E3D5] shadow-2xs hover:scale-105 active:scale-95 transition-all"
                    title="Upload from gallery"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
                <div className="font-title text-xs text-[#16232B]">Take Photo or Upload</div>
                <div className="font-caption text-[11px] text-[#526673] mt-0.5">
                  Saved privately to your device
                </div>
              </div>
            )}

            {/* Hidden native inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block font-label text-[10px] text-[#526673] mb-1.5 uppercase tracking-wider">
              Category
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {categories.map((c) => {
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`py-2 px-1 rounded-xl text-center border font-button-s transition-all ${
                      isSelected
                        ? 'bg-[#16232B] text-white border-[#16232B] shadow-xs font-bold'
                        : 'bg-white text-[#526673] border-[#E8E3D5] hover:bg-[#FFFFF0]'
                    }`}
                  >
                    <div className="text-[11px] leading-tight font-semibold">{c.label}</div>
                    <div className="text-[9px] opacity-70 mt-0.5 font-label">{c.tag}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caption / Notes Input */}
          <div>
            <label className="block font-label text-[10px] text-[#526673] mb-1.5 uppercase tracking-wider">
              Notes / Caption (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Post-workout pump, healthy lunch..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2 rounded-xl font-body-m text-xs text-[#16232B] border border-[#E8E3D5] focus:border-[#FF5B04] bg-white"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={!previewUrl || isProcessing}
              className={`w-full py-3 rounded-2xl font-button-l text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                previewUrl && !isProcessing
                  ? 'bg-[#FF5B04] text-white shadow-md hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-[#FFFFF0] text-[#526673]/50 border border-[#E8E3D5] cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Photo</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
