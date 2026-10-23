import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Camera, Download, Trash2, AlertCircle, Shield, Image as ImageIcon } from 'lucide-react';
import {
  StoredPhoto,
  getAllPhotos,
  deletePhoto,
  downloadPhotoToPhone,
  isVaultPinConfigured,
  verifyVaultPin,
  setVaultPin,
  isVaultSessionUnlocked,
  setVaultSessionUnlocked
} from '../services/photoStorage';

interface VaultTabProps {
  onOpenPhotoUploader: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
  onShowToast: (msg: string) => void;
  onSelectPhotoDetail: (photo: StoredPhoto) => void;
  selectedDate: string;
}

export const VaultTab: React.FC<VaultTabProps> = ({
  onOpenPhotoUploader,
  onShowToast,
  onSelectPhotoDetail,
  selectedDate: _selectedDate
}) => {
  const [isUnlocked, setIsUnlocked] = useState(isVaultSessionUnlocked());
  const [hasPinConfigured, setHasPinConfigured] = useState(isVaultPinConfigured());
  const [enteredPin, setEnteredPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSettingUpPin, setIsSettingUpPin] = useState(!isVaultPinConfigured());
  const [pinError, setPinError] = useState<string | null>(null);

  // Gallery Data
  const [photos, setPhotos] = useState<StoredPhoto[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);

  // Load photos when unlocked
  const loadPhotos = async () => {
    setIsLoading(true);
    try {
      const list = await getAllPhotos();
      setPhotos(list);
    } catch (err) {
      console.error('Failed to load photos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      loadPhotos();
    }
  }, [isUnlocked]);

  // Keypad button click
  const handleKeyClick = (digit: string) => {
    if (enteredPin.length < 4) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      setPinError(null);

      if (next.length === 4) {
        if (hasPinConfigured) {
          // Verify
          if (verifyVaultPin(next)) {
            setIsUnlocked(true);
            setVaultSessionUnlocked(true);
            setEnteredPin('');
            onShowToast('Vault Unlocked');
          } else {
            setPinError('Incorrect Passcode');
            setTimeout(() => setEnteredPin(''), 400);
          }
        } else {
          // Setting up first-time PIN
          if (!confirmPin) {
            setConfirmPin(next);
            setEnteredPin('');
          } else if (confirmPin === next) {
            setVaultPin(next);
            setHasPinConfigured(true);
            setIsSettingUpPin(false);
            setIsUnlocked(true);
            setVaultSessionUnlocked(true);
            setEnteredPin('');
            setConfirmPin('');
            onShowToast('Vault Passcode Created & Unlocked');
          } else {
            setPinError('Passcodes did not match. Try again.');
            setEnteredPin('');
            setConfirmPin('');
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    setVaultSessionUnlocked(false);
    setEnteredPin('');
    onShowToast('Vault Locked');
  };

  const handleDelete = async (photo: StoredPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this photo from your private vault?')) {
      await deletePhoto(photo.id);
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      onShowToast('Photo removed from vault');
    }
  };

  const handleDownload = (photo: StoredPhoto, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadPhotoToPhone(photo);
    onShowToast('Downloading photo to phone...');
  };

  const filteredPhotos =
    activeCategory === 'All'
      ? photos
      : photos.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  // ==========================================
  // 1. PIN PASSCODE LOCK SCREEN
  // ==========================================
  if (!isUnlocked) {
    return (
      <div className="space-y-6 pb-28 max-w-sm mx-auto pt-6 animate-in fade-in duration-200">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#D8D3C8] mx-auto flex items-center justify-center text-[#2C2324] shadow-xs mb-3">
            <Shield className="w-8 h-8 stroke-[1.8] text-[#EB5E28]" />
          </div>
          <span className="font-mono text-[10px] text-[#EB5E28] uppercase tracking-wider font-bold block">
            PRIVATE VAULT ARCHIVE
          </span>
          <h2 className="text-xl font-display font-black text-[#2C2324] uppercase tracking-tight mt-1">
            {isSettingUpPin
              ? confirmPin
                ? 'Confirm Passcode'
                : 'Create 4-Digit Passcode'
              : 'Enter Vault Passcode'}
          </h2>
          <p className="text-xs text-[#766754] font-sans mt-1">
            {isSettingUpPin
              ? confirmPin
                ? 'Re-enter your 4 digits to confirm security'
                : 'Protect your physique & workout progress pictures'
              : 'Your encrypted personal photo gallery is locked'}
          </p>
        </div>

        {/* 4 Dot Indicators */}
        <div className="flex items-center justify-center space-x-4 my-4">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = enteredPin.length > idx;
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all duration-150 ${
                  isFilled
                    ? 'bg-[#EB5E28] border-[#EB5E28] scale-110 shadow-xs'
                    : 'bg-white border-[#D8D3C8]'
                }`}
              />
            );
          })}
        </div>

        {pinError && (
          <div className="text-center text-xs font-mono font-bold text-[#EB5E28] flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{pinError}</span>
          </div>
        )}

        {/* 0-9 Keypad */}
        <div className="grid grid-cols-3 gap-3 px-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyClick(digit)}
              className="h-14 rounded-2xl bg-white border border-[#D8D3C8] text-xl font-display font-bold text-[#2C2324] shadow-xs hover:bg-[#EFECE3] active:scale-95 transition-all flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={() => {
              setEnteredPin('');
              setConfirmPin('');
              setPinError(null);
            }}
            className="h-14 rounded-2xl bg-[#EFECE3] border border-[#D8D3C8] text-xs font-mono font-bold text-[#766754] hover:bg-[#e6e2d7] active:scale-95 transition-all flex items-center justify-center"
          >
            CLEAR
          </button>
          <button
            onClick={() => handleKeyClick('0')}
            className="h-14 rounded-2xl bg-white border border-[#D8D3C8] text-xl font-display font-bold text-[#2C2324] shadow-xs hover:bg-[#EFECE3] active:scale-95 transition-all flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-[#EFECE3] border border-[#D8D3C8] text-xs font-mono font-bold text-[#766754] hover:bg-[#e6e2d7] active:scale-95 transition-all flex items-center justify-center"
          >
            ⌫
          </button>
        </div>

        {/* Security Reset Link */}
        {hasPinConfigured && (
          <div className="text-center pt-2">
            <button
              onClick={() => {
                if (confirm('Reset your Vault Passcode? This will let you choose a new PIN.')) {
                  localStorage.removeItem('daily_fit_vault_pin');
                  setHasPinConfigured(false);
                  setIsSettingUpPin(true);
                  setEnteredPin('');
                  setConfirmPin('');
                }
              }}
              className="text-[11px] font-mono text-[#766754] hover:text-[#EB5E28] underline"
            >
              Reset Passcode
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. UNLOCKED GALLERY & SPECIMEN ARCHIVE
  // ==========================================
  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-150">
      
      {/* Top Vault Header */}
      <div className="bg-white rounded-2xl p-4 border border-[#D8D3C8] shadow-xs flex items-center justify-between">
        <div>
          <div className="font-mono text-[10px] text-[#EB5E28] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Unlock className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>ENCRYPTED VAULT // {photos.length} SPECIMENS</span>
          </div>
          <h2 className="text-lg font-display font-black text-[#2C2324] uppercase tracking-tight mt-0.5">
            Photo Archive
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenPhotoUploader('workout')}
            className="px-3.5 py-2 rounded-xl btn-santiago text-xs font-display font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>

          <button
            onClick={handleLockVault}
            className="p-2 rounded-xl btn-cold-foam text-[#766754] hover:text-[#2C2324] transition-colors"
            title="Lock Vault"
          >
            <Lock className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {['All', 'Workout', 'Physique', 'Food', 'Scale', 'Other'].map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#2C2324] text-white shadow-xs'
                  : 'bg-white text-[#766754] border border-[#D8D3C8] hover:bg-[#EFECE3]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Photos Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-[#766754] font-mono text-xs">
          Loading archive...
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-[#D8D3C8] text-center">
          <div className="w-12 h-12 rounded-xl bg-[#EFECE3] border border-[#D8D3C8] mx-auto flex items-center justify-center text-[#766754] mb-3">
            <ImageIcon className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="text-sm font-display font-bold text-[#2C2324] uppercase">
            No {activeCategory !== 'All' ? activeCategory : ''} Photos Yet
          </div>
          <p className="text-xs text-[#766754] font-sans mt-1 max-w-xs mx-auto">
            Take or upload your workout pump, physique progress, meals, or scale weigh-ins to keep a private visual log.
          </p>
          <button
            onClick={() => onOpenPhotoUploader('workout')}
            className="mt-4 px-4 py-2.5 rounded-xl btn-santiago text-xs font-display font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Upload First Photo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhotoDetail(photo)}
              className="bg-white rounded-2xl border border-[#D8D3C8] overflow-hidden shadow-xs cursor-pointer group hover:border-[#EB5E28] transition-all"
            >
              {/* Photo Thumbnail */}
              <div className="relative aspect-4/3 bg-[#2C2324] overflow-hidden">
                <img
                  src={photo.dataUrl}
                  alt={photo.caption || photo.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white uppercase tracking-wider">
                    {photo.category}
                  </span>
                </div>

                {/* Quick Phone Download Action */}
                <button
                  onClick={(e) => handleDownload(photo, e)}
                  className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white hover:bg-[#EB5E28] transition-colors"
                  title="Download to phone"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Card Footer / Spec Label */}
              <div className="p-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#766754]">
                  <span>{photo.date}</span>
                  <button
                    onClick={(e) => handleDelete(photo, e)}
                    className="text-[#EB5E28] hover:text-red-700 p-0.5"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                {photo.caption && (
                  <div className="text-xs font-sans font-bold text-[#2C2324] truncate mt-1">
                    {photo.caption}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
