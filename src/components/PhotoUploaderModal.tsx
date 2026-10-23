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
      const saved = await savePhoto({
        date: selectedDate,
        category,
        dataUrl: previewUrl,
        caption: caption.trim() || undefined,
        logId: linkedLogId
      });

      onPhotoSaved(saved);
      // Reset
      setPreviewUrl(null);
      setCaption('');
      onClose();
    } catch (err) {
      console.error('Failed to save photo:', err);
      setErrorMessage('Failed to save photo to your secure vault.');
    } finally {
      setIsProcessing(false);
    }
  };

  const categories = [
    { id: 'workout', label: 'Workout', tag: 'WOD' },
    { id: 'physique', label: 'Physique', tag: 'PROG' },
    { id: 'food', label: 'Meal', tag: 'FUEL' },
    { id: 'scale', label: 'Scale', tag: 'MASS' },
    { id: 'other', label: 'Other', tag: 'MISC' }
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl border border-[#D9D1CA] p-5 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D9D1CA]/80">
          <div>
            <div className="font-mono text-[10px] text-[#C34811] uppercase tracking-wider font-bold">
              VAULT SPECIMEN CAPTURE // {selectedDate}
            </div>
            <h2 className="text-base font-bold text-[#141414] font-display uppercase tracking-tight mt-0.5">
              Archive Photo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6E6A63] hover:text-[#141414] rounded-lg hover:bg-[#F3EFEA] transition-colors"
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
          <div className="w-full aspect-4/3 rounded-xl border-2 border-dashed border-[#D9D1CA] overflow-hidden bg-[#F3EFEA] flex flex-col items-center justify-center relative">
            {previewUrl ? (
              <div className="relative w-full h-full group">
                <img
                  src={previewUrl}
                  alt="Specimen preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white text-[#141414] rounded-lg text-xs font-bold font-mono shadow-md"
                  >
                    Change Photo
                  </button>
                </div>
              </div>
            ) : isProcessing ? (
              <div className="flex flex-col items-center text-[#6E6A63]">
                <div className="w-8 h-8 border-2 border-[#D9D1CA] border-t-[#C34811] rounded-full animate-spin"></div>
                <span className="text-xs font-mono mt-2">Compressing specimen...</span>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-3.5 rounded-full bg-white text-[#0B369A] border border-[#D9D1CA] shadow-sm hover:scale-105 active:scale-95 transition-all"
                    title="Take photo with camera"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 rounded-full bg-white text-[#C34811] border border-[#D9D1CA] shadow-sm hover:scale-105 active:scale-95 transition-all"
                    title="Upload from gallery"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-xs font-bold text-[#141414]">Take Photo or Upload</div>
                <div className="text-[10px] text-[#6E6A63] mt-0.5 font-mono">
                  Compressed & saved to your private encrypted vault
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
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6A63] mb-1.5">
              Specimen Category
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {categories.map((c) => {
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`py-2 px-1 rounded-xl text-center border font-mono transition-all ${
                      isSelected
                        ? 'bg-[#141414] text-white border-[#141414] font-bold shadow-xs'
                        : 'bg-[#F3EFEA] text-[#6E6A63] border-[#D9D1CA] hover:bg-[#EAE5DE]'
                    }`}
                  >
                    <div className="text-[11px] leading-tight font-bold">{c.label}</div>
                    <div className="text-[9px] opacity-70 mt-0.5">{c.tag}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Caption / Notes Input */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6A63] mb-1.5">
              Specimen Notes / Caption (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Post-workout pump, bench PR 90kg, healthy lunch..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-sans text-[#141414] border border-[#D9D1CA] focus:border-[#0B369A] bg-[#FFFFFF]"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={!previewUrl || isProcessing}
              className={`w-full py-3 rounded-xl font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                previewUrl && !isProcessing
                  ? 'btn-3d-terracotta'
                  : 'bg-[#EAE5DE] text-[#A39E98] border border-[#D9D1CA] cursor-not-allowed'
              }`}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save to Vault & Link</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
