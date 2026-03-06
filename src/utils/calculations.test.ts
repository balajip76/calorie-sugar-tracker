import { describe, it, expect } from 'vitest';
import { getTodayEntries, getDailyTotal } from './calculations';
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
