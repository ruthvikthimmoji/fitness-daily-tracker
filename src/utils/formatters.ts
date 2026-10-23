/**
 * Formatting and date utility functions
 * Following UI / UX Redesign Guide Spec
 */

/**
 * Build local YYYY-MM-DD string without UTC timezone shift (IST safe)
 */
export function toLocalIso(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format delta numbers: zero is plain "0", positive has "+", negative has "-"
 */
export function fmtDelta(v: number, unit = ''): string {
  if (v === 0 || Object.is(v, -0)) return `0${unit ? ' ' + unit : ''}`;
  const sign = v > 0 ? '+' : '-';
  const val = Math.abs(v);
  const formatted = Number.isInteger(val) ? val.toString() : val.toFixed(1);
  return `${sign}${formatted}${unit ? ' ' + unit : ''}`;
}

/**
 * Weight remaining helper (no "+6 kg remaining" or "-0 kg")
 */
export function fmtRemainingWeight(current: number, goal: number): string {
  const diff = Math.abs(current - goal);
  if (diff < 0.05) return 'Goal reached!';
  return `${diff.toFixed(1)} kg to go`;
}

/**
 * Haptic feedback trigger (15ms default)
 */
export function triggerHaptic(ms = 15): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms);
    }
  } catch {
    // Ignore unsupported
  }
}

/**
 * Return trailing 7 days ending at endDateStr (today-6 ... today, never future dates)
 */
export function getTrailing7Days(endDateStr?: string): { date: string; dayLabel: string; isToday: boolean }[] {
  const end = endDateStr ? new Date(`${endDateStr}T12:00:00`) : new Date();
  const days: { date: string; dayLabel: string; isToday: boolean }[] = [];
  const todayStr = toLocalIso();

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const dateStr = toLocalIso(d);
    days.push({
      date: dateStr,
      dayLabel: dayNames[d.getDay()],
      isToday: dateStr === todayStr
    });
  }

  return days;
}

/**
 * Format human readable date: "Fri 23 Oct"
 */
export function formatFriendlyDate(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}
