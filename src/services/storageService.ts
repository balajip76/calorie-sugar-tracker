import type { Entry, StorageStatus } from '../types';

const STORAGE_KEY_ENTRIES = 'cst_entries';

function isValidEntry(entry: unknown): entry is Entry {
  if (typeof entry !== 'object' || entry === null) return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.calories === 'number' && Number.isFinite(e.calories) &&
    typeof e.sugar === 'number' && Number.isFinite(e.sugar) &&
    typeof e.timestamp === 'string'
  );
}

export function loadEntries(): { entries: Entry[]; status: StorageStatus } {
  let raw: string | null;
  try {
    raw = localStorage.getItem(STORAGE_KEY_ENTRIES);
  } catch {
    return { entries: [], status: 'unavailable' };
  }
  if (raw === null) return { entries: [], status: 'available' };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { entries: [], status: 'available' };
    return { entries: parsed.filter(isValidEntry), status: 'available' };
  } catch {
    return { entries: [], status: 'available' };
  }
}

export function saveEntries(entries: Entry[]): StorageStatus {
  try {
    localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
    return 'available';
  } catch (err) {
    if (err instanceof DOMException && err.name === 'QuotaExceededError') return 'quota-exceeded';
    return 'unavailable';
  }
}
