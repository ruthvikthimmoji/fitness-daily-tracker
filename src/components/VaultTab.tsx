import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Camera, Download, Trash2, AlertCircle, Image as ImageIcon } from 'lucide-react';
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
import { triggerHaptic } from '../utils/formatters';

interface VaultTabProps {
  onOpenPhotoUploader: (category: 'workout' | 'physique' | 'food' | 'scale' | 'other') => void;
  onShowToast: (msg: string) => void;
  onSelectPhotoDetail: (photo: StoredPhoto) => void;
  selectedDate?: string;
}

export const VaultTab: React.FC<VaultTabProps> = ({
  onOpenPhotoUploader,
  onShowToast,
  onSelectPhotoDetail
}) => {
  const [isUnlocked, setIsUnlocked] = useState(isVaultSessionUnlocked());
  const [hasPinConfigured, setHasPinConfigured] = useState(isVaultPinConfigured());
  const [enteredPin, setEnteredPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSettingUpPin, setIsSettingUpPin] = useState(!isVaultPinConfigured());
  const [pinError, setPinError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  // Gallery Data
  const [photos, setPhotos] = useState<StoredPhoto[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);

  const backspaceTimerRef = useRef<any>(null);

  // Auto-lock when tab is backgrounded for over a minute (VA2)
  useEffect(() => {
    let hideTime = 0;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hideTime = Date.now();
      } else {
        if (hideTime && Date.now() - hideTime > 60000) {
          setIsUnlocked(false);
          setVaultSessionUnlocked(false);
          setEnteredPin('');
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Lockout countdown
  useEffect(() => {
    let t: any = null;
    if (lockoutTimer > 0) {
      t = setInterval(() => {
        setLockoutTimer(v => Math.max(0, v - 1));
      }, 1000);
    }
    return () => clearInterval(t);
  }, [lockoutTimer]);

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

  const handleKeyClick = (digit: string) => {
    if (lockoutTimer > 0) return;
    if (enteredPin.length < 4) {
      triggerHaptic(10);
      const next = enteredPin + digit;
      setEnteredPin(next);
      setPinError(null);

      if (next.length === 4) {
        if (hasPinConfigured) {
          // Verify
          if (verifyVaultPin(next)) {
            triggerHaptic(30);
            setIsUnlocked(true);
            setVaultSessionUnlocked(true);
            setEnteredPin('');
            setFailedAttempts(0);
            onShowToast('Vault unlocked');
          } else {
            triggerHaptic(50);
            setIsShaking(true);
            setPinError('Incorrect passcode');
            const attempts = failedAttempts + 1;
            setFailedAttempts(attempts);
            if (attempts >= 5) {
              setLockoutTimer(30);
              setPinError('Too many attempts. Locked for 30s.');
            }
            setTimeout(() => {
              setIsShaking(false);
              setEnteredPin('');
            }, 500);
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
            onShowToast('Passcode created');
          } else {
            triggerHaptic(40);
            setIsShaking(true);
            setPinError('Passcodes did not match. Try again.');
            setEnteredPin('');
            setConfirmPin('');
            setTimeout(() => setIsShaking(false), 500);
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    triggerHaptic(10);
    setEnteredPin((prev) => prev.slice(0, -1));
    setPinError(null);
  };

  const handleBackspaceMouseDown = () => {
    backspaceTimerRef.current = setTimeout(() => {
      triggerHaptic(25);
      setEnteredPin('');
      setPinError(null);
    }, 600);
  };

  const handleBackspaceMouseUp = () => {
    if (backspaceTimerRef.current) {
      clearTimeout(backspaceTimerRef.current);
    }
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    setVaultSessionUnlocked(false);
    setEnteredPin('');
    onShowToast('Vault locked');
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
  // 1. PIN PASSCODE LOCK SCREEN (VA1, VA2, VA3)
  // ==========================================
  if (!isUnlocked) {
    return (
      <div className="space-y-6 pb-28 max-w-sm mx-auto pt-6 animate-in fade-in duration-200">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E4EEF0] border border-[#CADCE0] mx-auto flex items-center justify-center text-[#16232B] shadow-2xs mb-3">
            <Lock className="w-6 h-6 text-[#FF5B04]" />
          </div>
          <span className="font-label text-[11px] text-[#526673] block">
            PRIVATE PHOTOS
          </span>
          <h2 className="font-h2 text-xl text-[#16232B] mt-1">
            {isSettingUpPin
              ? confirmPin
                ? 'Confirm Passcode'
                : 'Create 4-Digit Passcode'
              : 'Enter Passcode'}
          </h2>
          <p className="font-caption text-xs text-[#526673] mt-1">
            {isSettingUpPin
              ? confirmPin
                ? 'Re-enter your 4 digits to confirm'
                : 'Photos stay on this device.'
              : 'Photos stay on this device.'}
          </p>
        </div>

        {/* 16px Dot Indicators (VA2) */}
        <div className={`flex items-center justify-center space-x-4 my-4 ${isShaking ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = enteredPin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border transition-all duration-150 ${
                  isFilled
                    ? 'bg-[#FF5B04] border-[#FF5B04] scale-110 shadow-xs'
                    : 'bg-white border-[#CADCE0]'
                }`}
              />
            );
          })}
        </div>

        {pinError && (
          <div className="text-center font-caption text-xs font-bold text-[#B3261E] flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{pinError}</span>
          </div>
        )}

        {lockoutTimer > 0 && (
          <div className="text-center font-caption text-xs font-bold text-[#B3261E]">
            Please wait {lockoutTimer}s
          </div>
        )}

        {/* 0-9 Keypad without CLEAR button (VA2) */}
        <div className="grid grid-cols-3 gap-3 px-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={lockoutTimer > 0}
              onClick={() => handleKeyClick(digit)}
              className="h-14 rounded-2xl bg-white border border-[#CADCE0] font-timer text-2xl text-[#16232B] tabular-nums shadow-2xs hover:bg-[#E4EEF0] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
            >
              {digit}
            </button>
          ))}
          <div className="h-14" /> {/* Blank spacer replacing redundant CLEAR */}
          <button
            type="button"
            disabled={lockoutTimer > 0}
            onClick={() => handleKeyClick('0')}
            className="h-14 rounded-2xl bg-white border border-[#CADCE0] font-timer text-2xl text-[#16232B] tabular-nums shadow-2xs hover:bg-[#E4EEF0] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
          >
            0
          </button>
          <button
            type="button"
            disabled={lockoutTimer > 0}
            onClick={handleBackspace}
            onMouseDown={handleBackspaceMouseDown}
            onMouseUp={handleBackspaceMouseUp}
            onTouchStart={handleBackspaceMouseDown}
            onTouchEnd={handleBackspaceMouseUp}
            className="h-14 rounded-2xl bg-[#DCE8EB] border border-[#CADCE0] font-button-s text-base text-[#526673] hover:bg-[#CADCE0] active:scale-95 transition-all flex items-center justify-center disabled:opacity-50"
            title="Backspace (Hold to clear)"
            aria-label="Backspace"
          >
            ⌫
          </button>
        </div>

        {/* Security Reset Link */}
        {hasPinConfigured && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset passcode? Resetting removes photos from this device.')) {
                  localStorage.removeItem('daily_fit_vault_pin');
                  setHasPinConfigured(false);
                  setIsSettingUpPin(true);
                  setEnteredPin('');
                  setConfirmPin('');
                }
              }}
              className="text-xs font-caption text-[#526673] hover:text-[#FF5B04] underline"
            >
              Reset Passcode
            </button>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // 2. UNLOCKED PRIVATE PHOTO GALLERY
  // ==========================================
  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-200">
      
      {/* Unlocked Header */}
      <div className="bg-white rounded-2xl p-4 border border-[#CADCE0] shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-[#E6F2F3] text-[#075056]">
            <Unlock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-title text-sm text-[#16232B]">Private Photos</div>
            <div className="font-caption text-[11px] text-[#526673]">
              {photos.length} photo{photos.length === 1 ? '' : 's'} on this device
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onOpenPhotoUploader('workout')}
            className="flex items-center gap-1 px-3 py-1.5 btn-ember rounded-xl font-button-s text-xs shadow-xs"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          <button
            type="button"
            onClick={handleLockVault}
            className="p-2 btn-cold-foam rounded-xl text-[#526673] hover:text-[#16232B]"
            title="Lock Vault"
            aria-label="Lock Vault"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="chips">
        {['All', 'Workout', 'Physique', 'Food', 'Scale', 'Other'].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              triggerHaptic(8);
              setActiveCategory(cat);
            }}
            className={`chip px-3 py-1.5 font-button-s text-xs rounded-xl border transition-all ${
              activeCategory === cat
                ? 'bg-[#16232B] text-white border-[#16232B] shadow-xs'
                : 'bg-white text-[#526673] border-[#CADCE0] hover:bg-[#DCE8EB]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photos Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-[#526673]">
          <div className="w-6 h-6 border-2 border-[#CADCE0] border-t-[#FF5B04] rounded-full animate-spin mx-auto mb-2" />
          <span className="font-caption text-xs">Loading photos...</span>
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-[#CADCE0] text-center shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-[#E4EEF0] mx-auto flex items-center justify-center text-[#526673] mb-2 border border-[#CADCE0]">
            <ImageIcon className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div className="font-title text-sm text-[#16232B]">
            No photos yet
          </div>
          <p className="font-caption text-xs text-[#526673] max-w-xs mx-auto mt-1">
            Tap Add to attach workout or physique photos. Photos stay private on this device.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhotoDetail(photo)}
              className="bg-white rounded-xl overflow-hidden border border-[#CADCE0] group relative aspect-4/5 shadow-2xs cursor-pointer"
            >
              <img
                src={photo.dataUrl}
                alt={photo.caption || photo.category}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-85 group-hover:opacity-95 transition-opacity flex flex-col justify-between p-2 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-label text-[9px] bg-black/50 backdrop-blur-xs px-1.5 py-0.5 rounded text-white uppercase">
                    {photo.category}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => handleDownload(photo, e)}
                      className="p-1 rounded bg-black/60 hover:bg-[#FF5B04] text-white transition-colors"
                      title="Download photo"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(photo, e)}
                      className="p-1 rounded bg-black/60 hover:bg-[#B3261E] text-white transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="font-caption text-xs text-white/90 truncate font-semibold">
                    {photo.caption || photo.date}
                  </div>
                  <div className="font-label text-[9px] text-white/60">
                    {photo.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
