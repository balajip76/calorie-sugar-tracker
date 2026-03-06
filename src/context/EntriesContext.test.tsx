import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { EntriesProvider, useEntries } from './EntriesContext';
import * as storageService from '../services/storageService';
import type { Entry } from '../types';

vi.mock('../services/storageService');

const VALID_ENTRY: Entry = {
  id: 'test-id-1',
  calories: 500,
  sugar: 12,
  timestamp: new Date().toISOString(),
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <EntriesProvider>{children}</EntriesProvider>
);

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [], status: 'available' });
  vi.mocked(storageService.saveEntries).mockReturnValue('available');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useEntries()', () => {
  it('throws when used outside EntriesProvider', () => {
    expect(() => renderHook(() => useEntries())).toThrow(
      'useEntries must be used within an EntriesProvider'
    );
  });
});

describe('EntriesProvider', () => {
  it('calls loadEntries on mount and hydrates entries', () => {
    vi.mocked(storageService.loadEntries).mockReturnValue({
      entries: [VALID_ENTRY],
      status: 'available',
    });
    const { result } = renderHook(() => useEntries(), { wrapper });
    expect(storageService.loadEntries).toHaveBeenCalledTimes(1);
    expect(result.current.entries).toEqual([VALID_ENTRY]);
  });

  it('sets storageStatus to available when loadEntries returns available', () => {
    const { result } = renderHook(() => useEntries(), { wrapper });
    expect(result.current.storageStatus).toBe('available');
  });

  it('sets storageStatus from loadEntries unavailable result', () => {
    vi.mocked(storageService.loadEntries).mockReturnValue({
      entries: [],
      status: 'unavailable',
    });
    const { result } = renderHook(() => useEntries(), { wrapper });
    expect(result.current.storageStatus).toBe('unavailable');
  });

  it('starts with empty entries when loadEntries returns empty', () => {
    const { result } = renderHook(() => useEntries(), { wrapper });
    expect(result.current.entries).toEqual([]);
  });

  it('addEntry appends a new entry with correct shape', () => {
    const { result } = renderHook(() => useEntries(), { wrapper });
    act(() => {
      result.current.addEntry(400, 15);
    });
    expect(result.current.entries).toHaveLength(1);
    const added = result.current.entries[0];
    expect(typeof added.id).toBe('string');
    expect(added.calories).toBe(400);
    expect(added.sugar).toBe(15);
    expect(typeof added.timestamp).toBe('string');
    // timestamp should be a valid ISO string
    expect(new Date(added.timestamp).toISOString()).toBe(added.timestamp);
  });

  it('addEntry calls saveEntries with the full updated array', () => {
    const { result } = renderHook(() => useEntries(), { wrapper });
    act(() => {
      result.current.addEntry(400, 15);
    });
    expect(storageService.saveEntries).toHaveBeenCalledTimes(1);
    expect(storageService.saveEntries).toHaveBeenCalledWith(result.current.entries);
  });

  it('addEntry does not mutate the previous entries array', () => {
    vi.mocked(storageService.loadEntries).mockReturnValue({
      entries: [VALID_ENTRY],
      status: 'available',
    });
    const { result } = renderHook(() => useEntries(), { wrapper });
    const before = result.current.entries;
    act(() => {
      result.current.addEntry(200, 5);
    });
    expect(result.current.entries).not.toBe(before);
    expect(before).toHaveLength(1);
  });

  it('addEntry accepts zero values (empty field treated as 0)', () => {
    const { result } = renderHook(() => useEntries(), { wrapper });
    act(() => {
      result.current.addEntry(0, 0);
    });
    expect(result.current.entries[0].calories).toBe(0);
    expect(result.current.entries[0].sugar).toBe(0);
  });

  it('addEntry accepts negative values (correcting entries, FR6)', () => {
    const { result } = renderHook(() => useEntries(), { wrapper });
    act(() => {
      result.current.addEntry(-100, -5);
    });
    expect(result.current.entries[0].calories).toBe(-100);
    expect(result.current.entries[0].sugar).toBe(-5);
  });

  it('updates storageStatus when saveEntries returns quota-exceeded', () => {
    vi.mocked(storageService.saveEntries).mockReturnValue('quota-exceeded');
    const { result } = renderHook(() => useEntries(), { wrapper });
    act(() => {
      result.current.addEntry(400, 15);
    });
    expect(result.current.storageStatus).toBe('quota-exceeded');
  });

  it('updates storageStatus when saveEntries returns unavailable', () => {
    vi.mocked(storageService.saveEntries).mockReturnValue('unavailable');
    const { result } = renderHook(() => useEntries(), { wrapper });
    act(() => {
      result.current.addEntry(400, 15);
    });
    expect(result.current.storageStatus).toBe('unavailable');
  });

  it('preserves available storageStatus when saveEntries succeeds', () => {
    const { result } = renderHook(() => useEntries(), { wrapper });
    act(() => {
      result.current.addEntry(400, 15);
    });
    expect(result.current.storageStatus).toBe('available');
  });

  it('addEntry accumulates multiple entries in order', () => {
    const { result } = renderHook(() => useEntries(), { wrapper });
    act(() => {
      result.current.addEntry(100, 5);
    });
    act(() => {
      result.current.addEntry(200, 10);
    });
    expect(result.current.entries).toHaveLength(2);
    expect(result.current.entries[0].calories).toBe(100);
    expect(result.current.entries[1].calories).toBe(200);
  });
});
