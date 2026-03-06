import type { Entry } from '../types';

export function getTodayEntries(entries: Entry[]): Entry[] {
  const today = new Date().toDateString();
  return entries.filter(entry => new Date(entry.timestamp).toDateString() === today);
}

export function getDailyTotal(entries: Entry[]): { calories: number; sugar: number } {
  return getTodayEntries(entries).reduce(
    (acc, entry) => ({ calories: acc.calories + entry.calories, sugar: acc.sugar + entry.sugar }),
    { calories: 0, sugar: 0 }
  );
}
