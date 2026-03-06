import { describe, it, expect, afterEach, vi } from 'vitest';
import { loadEntries, saveEntries } from './storageService';
import type { Entry } from '../types';

const VALID_ENTRY: Entry = {
  id: 'test-id-1',
  calories: 500,
  sugar: 12,
  timestamp: '2026-03-06T12:00:00.000Z',
};

describe('storageService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('loadEntries()', () => {
    it('returns empty array with available status when no key exists', () => {
      const result = loadEntries();
      expect(result).toEqual({ entries: [], status: 'available' });
    });

    it('returns parsed entries with available status on valid data', () => {
      localStorage.setItem('cst_entries', JSON.stringify([VALID_ENTRY]));
      const result = loadEntries();
      expect(result.status).toBe('available');
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0]).toEqual(VALID_ENTRY);
    });

    it('returns multiple valid entries', () => {
      const entry2: Entry = { ...VALID_ENTRY, id: 'test-id-2', calories: 300, sugar: 8 };
      localStorage.setItem('cst_entries', JSON.stringify([VALID_ENTRY, entry2]));
      const result = loadEntries();
      expect(result.status).toBe('available');
      expect(result.entries).toHaveLength(2);
    });

    it('returns empty array with available status on corrupt JSON', () => {
      localStorage.setItem('cst_entries', 'not-valid-json{{{');
      const result = loadEntries();
      expect(result).toEqual({ entries: [], status: 'available' });
    });

    it('returns empty array with available status when stored value is not an array', () => {
      localStorage.setItem('cst_entries', JSON.stringify({ foo: 'bar' }));
      const result = loadEntries();
      expect(result).toEqual({ entries: [], status: 'available' });
    });

    it('filters out entries with invalid id type', () => {
      const invalid = { id: 123, calories: 500, sugar: 12, timestamp: '2026-03-06T12:00:00.000Z' };
      localStorage.setItem('cst_entries', JSON.stringify([VALID_ENTRY, invalid]));
      const result = loadEntries();
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0]).toEqual(VALID_ENTRY);
    });

    it('filters out entries with non-numeric calories', () => {
      const invalid = { id: 'x', calories: 'not-a-number', sugar: 12, timestamp: '2026-03-06T12:00:00.000Z' };
      localStorage.setItem('cst_entries', JSON.stringify([VALID_ENTRY, invalid]));
      const result = loadEntries();
      expect(result.entries).toHaveLength(1);
    });

    it('filters out entries with non-finite calories (NaN)', () => {
      // JSON.stringify turns NaN into null, simulate corrupt data manually
      localStorage.setItem('cst_entries', '[{"id":"x","calories":null,"sugar":12,"timestamp":"2026-03-06T12:00:00.000Z"}]');
      const result = loadEntries();
      expect(result.entries).toHaveLength(0);
    });

    it('accepts entries with zero and negative values (correcting entries)', () => {
      const correction: Entry = { id: 'corr-1', calories: -200, sugar: 0, timestamp: '2026-03-06T13:00:00.000Z' };
      localStorage.setItem('cst_entries', JSON.stringify([VALID_ENTRY, correction]));
      const result = loadEntries();
      expect(result.entries).toHaveLength(2);
      expect(result.entries[1].calories).toBe(-200);
    });

    it('filters out entries with missing properties', () => {
      const incomplete = { id: 'x' };
      localStorage.setItem('cst_entries', JSON.stringify([VALID_ENTRY, incomplete]));
      const result = loadEntries();
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0]).toEqual(VALID_ENTRY);
    });

    it('returns unavailable status when localStorage throws on getItem', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      const result = loadEntries();
      expect(result).toEqual({ entries: [], status: 'unavailable' });
    });
  });

  describe('saveEntries()', () => {
    it('writes entries to localStorage and returns available status', () => {
      const status = saveEntries([VALID_ENTRY]);
      expect(status).toBe('available');
      const stored = localStorage.getItem('cst_entries');
      expect(JSON.parse(stored!)).toEqual([VALID_ENTRY]);
    });

    it('writes empty array and returns available status', () => {
      const status = saveEntries([]);
      expect(status).toBe('available');
      expect(JSON.parse(localStorage.getItem('cst_entries')!)).toEqual([]);
    });

    it('overwrites existing data with new entries array', () => {
      saveEntries([VALID_ENTRY]);
      const entry2: Entry = { ...VALID_ENTRY, id: 'test-id-2', calories: 300 };
      saveEntries([VALID_ENTRY, entry2]);
      const stored = JSON.parse(localStorage.getItem('cst_entries')!);
      expect(stored).toHaveLength(2);
    });

    it('returns unavailable status when localStorage throws a non-DOMException', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      expect(saveEntries([VALID_ENTRY])).toBe('unavailable');
    });

    it('returns quota-exceeded status when storage quota is exceeded', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError', 'QuotaExceededError');
      });
      expect(saveEntries([VALID_ENTRY])).toBe('quota-exceeded');
    });

    it('returns unavailable status when a non-quota DOMException is thrown', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      });
      expect(saveEntries([VALID_ENTRY])).toBe('unavailable');
    });
  });
});
