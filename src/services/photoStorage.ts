/**
 * High-performance IndexedDB photo storage for DailyFit Private Vault.
 * Supports large photo storage, instant retrieval, compression, and direct phone downloads.
 */

export interface StoredPhoto {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  category: 'workout' | 'physique' | 'food' | 'scale' | 'other';
  dataUrl: string; // Compressed image data URL
  caption?: string;
  tags?: string[];
  logId?: string; // Optional link to specific workout or food item
  fileName?: string;
  width?: number;
  height?: number;
}

const DB_NAME = 'DailyFit_PhotoVault_v1';
const STORE_NAME = 'photos';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Compresses an image file before storing, maximizing speed and keeping storage lean
 */
export function compressImageFile(file: File, maxDimension = 1400, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Saves a photo into IndexedDB
 */
export async function savePhoto(
  photo: Omit<StoredPhoto, 'id' | 'timestamp'> & { id?: string; timestamp?: number }
): Promise<StoredPhoto> {
  const db = await openDB();
  const id = photo.id || `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const timestamp = photo.timestamp || Date.now();

  const record: StoredPhoto = {
    ...photo,
    id,
    timestamp
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(record);

    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Gets all photos sorted newest first
 */
export async function getAllPhotos(): Promise<StoredPhoto[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const list = (request.result || []) as StoredPhoto[];
        list.sort((a, b) => b.timestamp - a.timestamp);
        resolve(list);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error('Failed to get photos from IndexedDB:', err);
    return [];
  }
}

/**
 * Gets photos for a specific date
 */
export async function getPhotosForDate(dateStr: string): Promise<StoredPhoto[]> {
  const all = await getAllPhotos();
  return all.filter((p) => p.date === dateStr);
}

/**
 * Deletes a photo by ID
 */
export async function deletePhoto(id: string): Promise<boolean> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Triggers native phone file download of the photo
 */
export function downloadPhotoToPhone(photo: StoredPhoto): void {
  try {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    const cleanDate = photo.date || 'archive';
    const category = photo.category || 'photo';
    link.download = `DAILYFIT-${category.toUpperCase()}-${cleanDate}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Download failed:', err);
    // Fallback: open in new tab so user can long-press and save to camera roll
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${photo.dataUrl}" style="max-width:100%; height:auto;" />`);
    }
  }
}

// ==========================================
// VAULT PIN SECURITY MANAGEMENT
// ==========================================

const VAULT_PIN_KEY = 'daily_fit_vault_pin';
const VAULT_UNLOCKED_SESSION_KEY = 'daily_fit_vault_unlocked';

export function getVaultPin(): string | null {
  return localStorage.getItem(VAULT_PIN_KEY);
}

export function setVaultPin(pin: string): void {
  localStorage.setItem(VAULT_PIN_KEY, pin);
}

export function isVaultPinConfigured(): boolean {
  return !!getVaultPin();
}

export function verifyVaultPin(enteredPin: string): boolean {
  const current = getVaultPin();
  if (!current) return false;
  return current === enteredPin;
}

export function isVaultSessionUnlocked(): boolean {
  return sessionStorage.getItem(VAULT_UNLOCKED_SESSION_KEY) === 'true';
}

export function setVaultSessionUnlocked(unlocked: boolean): void {
  if (unlocked) {
    sessionStorage.setItem(VAULT_UNLOCKED_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(VAULT_UNLOCKED_SESSION_KEY);
  }
}
