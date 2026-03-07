import { describe, it, expect } from 'vitest';
import { getTodayEntries, getDailyTotal, getStreak, getAverages } from './calculations';
import type { Entry } from '../types';

let entryIdCounter = 0;
function makeEntry(overrides: Partial<Entry> = {}): Entry {
  return {
    id: `test-id-${++entryIdCounter}`,
    calories: 500,
    sugar: 12,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString();
}

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString();
}

function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

describe('getTodayEntries()', () => {
  it('silently excludes entries with invalid timestamps (defence-in-depth)', () => {
    const invalid = makeEntry({ timestamp: 'not-a-date' });
    // new Date('not-a-date').toDateString() === 'Invalid Date', never matches today
    expect(getTodayEntries([invalid])).toEqual([]);
  });

  it('returns empty array for empty input', () => {
    expect(getTodayEntries([])).toEqual([]);
  });

  it('includes an entry timestamped today', () => {
    const entry = makeEntry({ id: 'today-1' });
    expect(getTodayEntries([entry])).toEqual([entry]);
  });

  it('excludes an entry timestamped yesterday', () => {
    const entry = makeEntry({ timestamp: yesterdayISO() });
    expect(getTodayEntries([entry])).toEqual([]);
  });

  it('excludes an entry timestamped tomorrow', () => {
    const entry = makeEntry({ timestamp: tomorrowISO() });
    expect(getTodayEntries([entry])).toEqual([]);
  });

  it('filters mixed today and non-today entries correctly', () => {
    const todayEntry = makeEntry({ id: 'today' });
    const yesterdayEntry = makeEntry({ id: 'yesterday', timestamp: yesterdayISO() });
    expect(getTodayEntries([todayEntry, yesterdayEntry])).toEqual([todayEntry]);
  });

  it('returns all entries when all are today', () => {
    const e1 = makeEntry({ id: 'a', calories: 100, sugar: 5 });
    const e2 = makeEntry({ id: 'b', calories: 200, sugar: 10 });
    const result = getTodayEntries([e1, e2]);
    expect(result).toHaveLength(2);
    expect(result).toContain(e1);
    expect(result).toContain(e2);
  });
});

describe('getDailyTotal()', () => {
  it('returns zeros for empty input', () => {
    expect(getDailyTotal([])).toEqual({ calories: 0, sugar: 0 });
  });

  it('returns totals for a single today entry', () => {
    expect(getDailyTotal([makeEntry({ calories: 400, sugar: 10 })])).toEqual({
      calories: 400,
      sugar: 10,
    });
  });

  it('sums multiple today entries', () => {
    const entries = [
      makeEntry({ calories: 400, sugar: 10 }),
      makeEntry({ calories: 200, sugar: 5 }),
    ];
    expect(getDailyTotal(entries)).toEqual({ calories: 600, sugar: 15 });
  });

  it('ignores entries from yesterday', () => {
    const entries = [
      makeEntry({ calories: 400, sugar: 10 }),
      makeEntry({ calories: 999, sugar: 99, timestamp: yesterdayISO() }),
    ];
    expect(getDailyTotal(entries)).toEqual({ calories: 400, sugar: 10 });
  });

  it('ignores entries from tomorrow', () => {
    const entries = [
      makeEntry({ calories: 400, sugar: 10 }),
      makeEntry({ calories: 999, sugar: 99, timestamp: tomorrowISO() }),
    ];
    expect(getDailyTotal(entries)).toEqual({ calories: 400, sugar: 10 });
  });

  it('accepts negative values for correcting entries (FR6)', () => {
    const entries = [
      makeEntry({ calories: 400, sugar: 10 }),
      makeEntry({ calories: -100, sugar: -3 }),
    ];
    expect(getDailyTotal(entries)).toEqual({ calories: 300, sugar: 7 });
  });

  it('accepts zero values', () => {
    expect(getDailyTotal([makeEntry({ calories: 0, sugar: 0 })])).toEqual({
      calories: 0,
      sugar: 0,
    });
  });

  it('returns zeros when only non-today entries are present', () => {
    const entries = [
      makeEntry({ calories: 500, sugar: 20, timestamp: yesterdayISO() }),
    ];
    expect(getDailyTotal(entries)).toEqual({ calories: 0, sugar: 0 });
  });
});

describe('getStreak()', () => {
  it('returns 0 for no entries', () => {
    expect(getStreak([])).toBe(0);
  });

  it('returns 1 for entries only today', () => {
    expect(getStreak([makeEntry({ calories: 100, sugar: 10 })])).toBe(1);
  });

  it('returns 2 for entries today and yesterday', () => {
    expect(getStreak([
      makeEntry({ calories: 100, sugar: 10 }),
      makeEntry({ calories: 200, sugar: 20, timestamp: yesterdayISO() }),
    ])).toBe(2);
  });

  it('returns 3 for entries today, yesterday, and 2 days ago', () => {
    expect(getStreak([
      makeEntry({ calories: 100, sugar: 10 }),
      makeEntry({ calories: 200, sugar: 20, timestamp: yesterdayISO() }),
      makeEntry({ calories: 300, sugar: 30, timestamp: daysAgoISO(2) }),
    ])).toBe(3);
  });

  it('returns 1 for entries yesterday only (no today)', () => {
    expect(getStreak([
      makeEntry({ calories: 100, sugar: 10, timestamp: yesterdayISO() }),
    ])).toBe(1);
  });

  it('breaks streak on gap (today + 3 days ago, nothing in between = streak 1)', () => {
    expect(getStreak([
      makeEntry({ calories: 100, sugar: 10 }),
      makeEntry({ calories: 200, sugar: 20, timestamp: daysAgoISO(3) }),
    ])).toBe(1);
  });

  it('counts multiple entries on the same day as 1 streak day', () => {
    expect(getStreak([
      makeEntry({ calories: 100, sugar: 10 }),
      makeEntry({ calories: 200, sugar: 20 }),
      makeEntry({ calories: 300, sugar: 30 }),
    ])).toBe(1);
  });

  it('returns 0 if only entries are 2+ days ago (neither today nor yesterday)', () => {
    expect(getStreak([
      makeEntry({ calories: 100, sugar: 10, timestamp: daysAgoISO(5) }),
    ])).toBe(0);
  });

  it('silently ignores entries with invalid timestamps', () => {
    expect(getStreak([
      makeEntry({ timestamp: 'not-a-date' }),
    ])).toBe(0);
  });
});

describe('getAverages()', () => {
  it('returns zeros for empty entries', () => {
    expect(getAverages([], 7)).toEqual({ calories: 0, sugar: 0 });
  });

  it('returns zeros when days is 0', () => {
    expect(getAverages([makeEntry({ calories: 300, sugar: 10 })], 0)).toEqual({ calories: 0, sugar: 0 });
  });

  it('returns exact values for single entry today with days=1', () => {
    expect(getAverages([makeEntry({ calories: 300, sugar: 10 })], 1)).toEqual({ calories: 300, sugar: 10 });
  });

  it('divides by days not by days-with-entries (days=3, entries only today)', () => {
    const result = getAverages([makeEntry({ calories: 900, sugar: 30 })], 3);
    expect(result.calories).toBeCloseTo(300);
    expect(result.sugar).toBeCloseTo(10);
  });

  it('divides by full period even when period exceeds data range', () => {
    const result = getAverages([makeEntry({ calories: 700, sugar: 14 })], 7);
    expect(result.calories).toBeCloseTo(100);
    expect(result.sugar).toBeCloseTo(2);
  });

  it('includes entries across multiple days within period', () => {
    const entries = [
      makeEntry({ calories: 400, sugar: 10 }),
      makeEntry({ calories: 600, sugar: 20, timestamp: yesterdayISO() }),
    ];
    const result = getAverages(entries, 3);
    expect(result.calories).toBeCloseTo((400 + 600) / 3);
    expect(result.sugar).toBeCloseTo((10 + 20) / 3);
  });

  it('excludes entries older than the period', () => {
    const entries = [
      makeEntry({ calories: 400, sugar: 10 }),
      makeEntry({ calories: 999, sugar: 99, timestamp: daysAgoISO(7) }),
    ];
    const result = getAverages(entries, 3);
    expect(result.calories).toBeCloseTo(400 / 3);
    expect(result.sugar).toBeCloseTo(10 / 3);
  });

  it('includes entry exactly at period boundary ((days-1) days ago)', () => {
    const entries = [
      makeEntry({ calories: 300, sugar: 6, timestamp: daysAgoISO(2) }),
    ];
    const result = getAverages(entries, 3);
    expect(result.calories).toBeCloseTo(300 / 3);
    expect(result.sugar).toBeCloseTo(6 / 3);
  });

  it('silently ignores entries with invalid timestamps', () => {
    const entries = [
      makeEntry({ timestamp: 'not-a-date', calories: 999, sugar: 99 }),
    ];
    expect(getAverages(entries, 3)).toEqual({ calories: 0, sugar: 0 });
  });

  it('accepts negative values for correcting entries', () => {
    const entries = [
      makeEntry({ calories: 900, sugar: 30 }),
      makeEntry({ calories: -300, sugar: -10 }),
    ];
    const result = getAverages(entries, 1);
    expect(result.calories).toBeCloseTo(600);
    expect(result.sugar).toBeCloseTo(20);
  });
});
