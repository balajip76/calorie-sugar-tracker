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

export function getStreak(entries: Entry[]): number {
  if (entries.length === 0) return 0;

  // Build a Set of date strings that have at least one entry
  const daysWithEntries = new Set<string>();
  for (const entry of entries) {
    const d = new Date(entry.timestamp);
    if (!isNaN(d.getTime())) {
      daysWithEntries.add(d.toDateString());
    }
  }

  if (daysWithEntries.size === 0) return 0;

  const today = new Date();
  const todayStr = today.toDateString();

  // Determine starting point: today if it has entries, else yesterday
  const current = new Date(today);
  if (!daysWithEntries.has(todayStr)) {
    current.setDate(current.getDate() - 1);
    if (!daysWithEntries.has(current.toDateString())) {
      return 0; // Neither today nor yesterday has entries
    }
  }

  // Count consecutive days walking backwards
  let streak = 0;
  while (daysWithEntries.has(current.toDateString())) {
    streak++;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

export function getAverages(entries: Entry[], days: number): { calories: number; sugar: number } {
  if (entries.length === 0 || days <= 0) return { calories: 0, sugar: 0 };

  // Start of local calendar day (days - 1) ago = first day included in period
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - (days - 1));
  cutoffDate.setHours(0, 0, 0, 0);

  const total = entries
    .filter(entry => {
      const d = new Date(entry.timestamp);
      return !isNaN(d.getTime()) && d >= cutoffDate;
    })
    .reduce(
      (acc, entry) => ({ calories: acc.calories + entry.calories, sugar: acc.sugar + entry.sugar }),
      { calories: 0, sugar: 0 }
    );

  return {
    calories: total.calories / days,
    sugar: total.sugar / days,
  };
}
