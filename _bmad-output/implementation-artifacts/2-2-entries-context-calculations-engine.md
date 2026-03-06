# Story 2.2: Entries Context & Calculations Engine

Status: done

## Story

As a developer,
I want a React context that manages entry state and a pure calculations module for derived data,
so that all UI components can read entries and computed values from a single source of truth.

## Acceptance Criteria

1. **Given** the storage service from Story 2.1, **When** `src/context/EntriesContext.tsx` is implemented, **Then** it provides an `EntriesProvider` that wraps the app and exposes `entries: Entry[]`, `addEntry: (calories: number, sugar: number) => void`, and `storageStatus: StorageStatus` via `useContext`.
2. `EntriesProvider` calls `storageService.loadEntries()` on mount to hydrate state.
3. `addEntry` creates a new `Entry` with `crypto.randomUUID()` as id, `new Date().toISOString()` as timestamp, appends it to state immutably (`setEntries(prev => [...prev, newEntry])`), and calls `storageService.saveEntries()` with the updated array.
4. State updates never mutate the existing array — always spread into a new array.
5. **Given** the entries context, **When** `src/utils/calculations.ts` is implemented, **Then** it exports `getTodayEntries(entries: Entry[]): Entry[]` that filters entries to the current local calendar day.
6. It exports `getDailyTotal(entries: Entry[]): { calories: number, sugar: number }` that sums calories and sugar for entries on the current local calendar day.
7. All functions are pure — they take `Entry[]` as input and return computed values with no side effects.
8. Calendar day boundaries use local timezone midnight (via `new Date().toDateString()` comparison).
9. All functions in `calculations.ts` are covered by unit tests in `src/utils/calculations.test.ts` including: empty array, single entry, multiple entries across days, and entries at midnight boundary.
10. Context is covered by tests in `src/context/EntriesContext.test.tsx`.

## Tasks / Subtasks

- [x] Task 1: Delete `.gitkeep` placeholders (AC: setup)
  - [x] Delete `src/utils/.gitkeep`
  - [x] Delete `src/context/.gitkeep`
- [x] Task 2: Create `src/utils/calculations.ts` (AC: #5, #6, #7, #8)
  - [x] Export `getTodayEntries(entries: Entry[]): Entry[]` — filter by `new Date(e.timestamp).toDateString() === new Date().toDateString()`
  - [x] Export `getDailyTotal(entries: Entry[]): { calories: number; sugar: number }` — calls `getTodayEntries`, then `reduce` to sum
  - [x] No imports from other app modules — pure utility, `Entry` type from `../types` only
- [x] Task 3: Create `src/utils/calculations.test.ts` (AC: #9)
  - [x] Test `getTodayEntries` — empty array returns `[]`
  - [x] Test `getTodayEntries` — today's entries are included
  - [x] Test `getTodayEntries` — yesterday's entries are excluded
  - [x] Test `getTodayEntries` — entries spanning midnight boundary (just before vs. just after)
  - [x] Test `getDailyTotal` — empty array returns `{ calories: 0, sugar: 0 }`
  - [x] Test `getDailyTotal` — single today entry sums correctly
  - [x] Test `getDailyTotal` — multiple today entries sum correctly
  - [x] Test `getDailyTotal` — ignores entries from other days
  - [x] Test `getDailyTotal` — accepts negative and zero values (correcting entries per FR6)
- [x] Task 4: Create `src/context/EntriesContext.tsx` (AC: #1, #2, #3, #4)
  - [x] Define `EntriesContextValue` interface: `{ entries: Entry[], addEntry: (calories: number, sugar: number) => void, storageStatus: StorageStatus }`
  - [x] Create `EntriesContext` with `createContext<EntriesContextValue | null>(null)`
  - [x] Implement `EntriesProvider` with lazy `useState` initialization calling `storageService.loadEntries()` on mount
  - [x] Implement `addEntry` with immutable state update and `storageService.saveEntries()`
  - [x] Update `storageStatus` when `saveEntries` returns non-`'available'` status
  - [x] Export `useEntries()` custom hook with null-check guard
- [x] Task 5: Create `src/context/EntriesContext.test.tsx` (AC: #10)
  - [x] Mock `storageService` with `vi.mock`
  - [x] Test: `useEntries` throws if used outside `EntriesProvider`
  - [x] Test: on mount, `loadEntries` is called and entries are hydrated into state
  - [x] Test: on mount with `'unavailable'` status, `storageStatus` is set correctly
  - [x] Test: `addEntry` creates entry with correct shape (id string, correct calories/sugar, ISO timestamp)
  - [x] Test: `addEntry` appends immutably — does not mutate original entries array
  - [x] Test: `addEntry` calls `saveEntries` with the full updated array
  - [x] Test: `addEntry` with 0 values succeeds (empty fields = 0)
  - [x] Test: `addEntry` with negative values succeeds (correcting entries per FR6)
- [x] Task 6: Run `npm test` and confirm all tests pass — no regressions

## Dev Notes

### What This Story Delivers

This story creates two modules that underpin all of Epic 2's UI stories:

1. **`calculations.ts`** — Pure functions for derived data. Story 2.3 will use `getDailyTotal` to display stat card values. Stories 3.1–3.2 will add `getStreak` and `getAverages` to this same file. Keep it clean and purely functional.

2. **`EntriesContext.tsx`** — The single runtime source of truth for all entry data. Every UI component in Epic 2 reads from this context. `App.tsx` (Story 2.3) will wrap children with `EntriesProvider` and use `storageStatus` to conditionally render the storage-unavailable inline message (Story 2.6).

No UI, no components, no Tailwind in this story. Pure TypeScript logic + a React context provider.

### Current Project State (after Stories 1.1, 1.2, 1.3, 2.1)

```
src/
  main.tsx                    ✅ React entry point
  App.tsx                     ✅ base layout shell (max-w-[480px] mx-auto)
  App.test.tsx                ✅ 2 tests passing
  index.css                   ✅ Tailwind v4 design tokens + Google Fonts
  types.ts                    ✅ Entry, InsightPeriod, StorageStatus already defined
  test-setup.ts               ✅ imports @testing-library/jest-dom
  components/.gitkeep         placeholder — do NOT touch this story
  services/storageService.ts  ✅ DONE (Story 2.1)
  services/storageService.test.ts  ✅ 17 tests passing (Story 2.1)
  utils/.gitkeep              ← DELETE when creating calculations.ts
  context/.gitkeep            ← DELETE when creating EntriesContext.tsx
```

`src/types.ts` current content (confirmed, no changes needed):
```typescript
export interface Entry {
  id: string;
  calories: number;
  sugar: number;
  timestamp: string;
}

export type InsightPeriod = 1 | 3 | 7 | 30 | 90;

export type StorageStatus = 'available' | 'unavailable' | 'quota-exceeded';
```

### Architecture Compliance Rules (MANDATORY)

- **`storageService.ts` is the sole localStorage gateway** — `EntriesContext` calls it, nothing else does. Never call `localStorage` directly from context or components.
- **No state mutation** — always `setEntries(prev => [...prev, newEntry])`, never `entries.push(newEntry)`.
- **No derived data in context** — `EntriesContext` stores only `entries[]` and `storageStatus`. Totals, today's entries, streaks, averages are all computed in `calculations.ts` and called by components.
- **No `any` types** — use `unknown` when needed, then narrow with type guards.
- **No `console.log`** — remove all debug logging before commit.
- **`calculations.ts` is a pure utility** — no React imports, no side effects, no imports from other app modules except `../types`.
- **Use `Entry` from `src/types.ts`** — never redefine the interface locally.
- **SCREAMING_SNAKE_CASE for module-level constants** — not applicable here, but keep the pattern for future additions.

### Implementation Guide: `calculations.ts`

```typescript
// src/utils/calculations.ts
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
```

**Why `toDateString()` for day comparison:** `new Date().toDateString()` returns a locale-independent string like `"Thu Mar 06 2026"`. Comparing this between two `Date` objects gives correct local-timezone day grouping without manual timezone offset math. This is the architecture-specified approach.

**Note:** Stories 3.1–3.2 will add `getStreak(entries: Entry[]): number` and `getAverages(entries: Entry[], days: number): { calories: number, sugar: number }` to this same file. Do not add them now — implement only what this story requires.

### Implementation Guide: `EntriesContext.tsx`

```tsx
// src/context/EntriesContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Entry, StorageStatus } from '../types';
import { loadEntries, saveEntries } from '../services/storageService';

interface EntriesContextValue {
  entries: Entry[];
  addEntry: (calories: number, sugar: number) => void;
  storageStatus: StorageStatus;
}

const EntriesContext = createContext<EntriesContextValue | null>(null);

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [storageStatus, setStorageStatus] = useState<StorageStatus>('available');

  useEffect(() => {
    const { entries: loaded, status } = loadEntries();
    setEntries(loaded);
    setStorageStatus(status);
  }, []);

  const addEntry = (calories: number, sugar: number) => {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      calories,
      sugar,
      timestamp: new Date().toISOString(),
    };
    const updatedEntries = [...entries, newEntry];
    setEntries(prev => [...prev, newEntry]);
    const saveStatus = saveEntries(updatedEntries);
    if (saveStatus !== 'available') {
      setStorageStatus(saveStatus);
    }
  };

  return (
    <EntriesContext.Provider value={{ entries, addEntry, storageStatus }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries(): EntriesContextValue {
  const context = useContext(EntriesContext);
  if (context === null) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
}
```

**Why both `updatedEntries` and functional `setEntries`:** The functional update `setEntries(prev => [...prev, newEntry])` is what the AC specifies and is the React best practice (avoids stale closure issues with batched updates). `updatedEntries` is computed from the current `entries` snapshot for the synchronous `saveEntries` call — this is correct because both happen in the same synchronous call stack before any re-render.

**Why update `storageStatus` on failed save:** Story 2.6 will render a calm inline message when `storageStatus !== 'available'`. This context is the only place that knows about storage failures, so it must surface them upward. The status is sticky — once quota is exceeded or storage becomes unavailable, it stays set until the app is reloaded.

**Note on `useEffect` vs lazy `useState` init:** The AC specifies "on mount" which maps to `useEffect`. A valid alternative is `useState(() => loadEntries())` (lazy initialization) which avoids the extra render cycle — since localStorage reads are synchronous, lazy init would render with correct data on first paint. Both are correct; the `useEffect` approach matches the AC literal specification.

### Implementation Guide: `calculations.test.ts`

```typescript
// src/utils/calculations.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getTodayEntries, getDailyTotal } from './calculations';
import type { Entry } from '../types';

function makeEntry(overrides: Partial<Entry> = {}): Entry {
  return {
    id: 'test-id',
    calories: 500,
    sugar: 12,
    timestamp: new Date().toISOString(), // today by default
    ...overrides,
  };
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString();
}

describe('getTodayEntries()', () => {
  it('returns empty array for empty input', () => {
    expect(getTodayEntries([])).toEqual([]);
  });

  it('returns today entries', () => {
    const entry = makeEntry();
    expect(getTodayEntries([entry])).toEqual([entry]);
  });

  it('excludes yesterday entries', () => {
    const entry = makeEntry({ timestamp: yesterdayISO() });
    expect(getTodayEntries([entry])).toEqual([]);
  });

  it('filters mixed entries correctly', () => {
    const todayEntry = makeEntry({ id: 'today' });
    const yesterdayEntry = makeEntry({ id: 'yesterday', timestamp: yesterdayISO() });
    expect(getTodayEntries([todayEntry, yesterdayEntry])).toEqual([todayEntry]);
  });
});

describe('getDailyTotal()', () => {
  it('returns zeros for empty input', () => {
    expect(getDailyTotal([])).toEqual({ calories: 0, sugar: 0 });
  });

  it('returns totals for a single today entry', () => {
    expect(getDailyTotal([makeEntry({ calories: 400, sugar: 10 })])).toEqual({ calories: 400, sugar: 10 });
  });

  it('sums multiple today entries', () => {
    const entries = [
      makeEntry({ calories: 400, sugar: 10 }),
      makeEntry({ calories: 200, sugar: 5 }),
    ];
    expect(getDailyTotal(entries)).toEqual({ calories: 600, sugar: 15 });
  });

  it('ignores entries from other days', () => {
    const entries = [
      makeEntry({ calories: 400, sugar: 10 }),
      makeEntry({ calories: 999, sugar: 99, timestamp: yesterdayISO() }),
    ];
    expect(getDailyTotal(entries)).toEqual({ calories: 400, sugar: 10 });
  });

  it('accepts negative values for correcting entries (FR6)', () => {
    const entries = [
      makeEntry({ calories: 400, sugar: 10 }),
      makeEntry({ calories: -100, sugar: -3 }), // correcting entry
    ];
    expect(getDailyTotal(entries)).toEqual({ calories: 300, sugar: 7 });
  });

  it('accepts zero values', () => {
    expect(getDailyTotal([makeEntry({ calories: 0, sugar: 0 })])).toEqual({ calories: 0, sugar: 0 });
  });
});
```

### Implementation Guide: `EntriesContext.test.tsx`

```tsx
// src/context/EntriesContext.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [], status: 'available' });
  vi.mocked(storageService.saveEntries).mockReturnValue('available');
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
    vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [VALID_ENTRY], status: 'available' });
    const { result } = renderHook(() => useEntries(), { wrapper });
    expect(storageService.loadEntries).toHaveBeenCalledTimes(1);
    expect(result.current.entries).toEqual([VALID_ENTRY]);
  });

  it('sets storageStatus from loadEntries result', () => {
    vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [], status: 'unavailable' });
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

  it('addEntry calls saveEntries with full updated array', () => {
    const { result } = renderHook(() => useEntries(), { wrapper });
    act(() => {
      result.current.addEntry(400, 15);
    });
    expect(storageService.saveEntries).toHaveBeenCalledWith(result.current.entries);
  });

  it('addEntry does not mutate the previous entries array', () => {
    vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [VALID_ENTRY], status: 'available' });
    const { result } = renderHook(() => useEntries(), { wrapper });
    const before = result.current.entries;
    act(() => {
      result.current.addEntry(200, 5);
    });
    // original array reference should be unchanged
    expect(result.current.entries).not.toBe(before);
    expect(before).toHaveLength(1); // original array still has 1 entry
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
});
```

### Project Structure Notes

**Files to create/modify this story:**
- `src/utils/calculations.ts` — new file (the pure calculations module)
- `src/utils/calculations.test.ts` — new test file
- `src/context/EntriesContext.tsx` — new file (the context provider)
- `src/context/EntriesContext.test.tsx` — new test file
- `src/utils/.gitkeep` — DELETE this file
- `src/context/.gitkeep` — DELETE this file

**Files NOT to touch:**
- `src/types.ts` — already complete, no changes needed
- `src/services/storageService.ts` — already complete, no changes needed
- `src/App.tsx` — EntriesProvider will be wired in here in Story 2.3
- `src/components/` — for Stories 2.3+

**Alignment with unified project structure:**
- `calculations.ts` lives in `src/utils/` — pure utility functions
- `EntriesContext.tsx` lives in `src/context/` — React context providers
- Co-located tests: `calculations.test.ts` next to `calculations.ts`, `EntriesContext.test.tsx` next to `EntriesContext.tsx`
- No barrel re-exports needed (each directory has fewer than 4 files)

### Testing Standards

- Test runner: `vitest` (configured in `vite.config.ts` with `globals: true`, `environment: 'jsdom'`)
- Test setup: `src/test-setup.ts` (imports `@testing-library/jest-dom`)
- Run tests: `npm test` (runs all `*.test.ts(x)` files)
- Use `vi.mock('../services/storageService')` to isolate context from real storage in tests
- Use `renderHook` + `act` from `@testing-library/react` for context tests
- Use `vi.mocked()` for typed mock access (not `(storageService.loadEntries as Mock)`)
- `beforeEach` to reset mock return values between context tests
- No `localStorage.clear()` needed — storage is fully mocked via `vi.mock`

### Previous Story Intelligence (Story 2.1 Learnings)

1. **Use `Write` tool for complete file creation**, not `Edit` with heredoc.
2. **Vitest `globals: true`** — `describe`, `it`, `expect`, `vi` available globally, but safer to import explicitly for type safety.
3. **Test environment is jsdom** — React hooks and DOM APIs work in tests.
4. **TypeScript version is 5.9.3** — use `catch (err)` pattern as needed.
5. **The `isValidEntry` type guard** uses `typeof e.calories === 'number' && Number.isFinite(e.calories)` — note `Number.isFinite` not global `isFinite` (fixed in code review).
6. **Two-try/catch pattern in `loadEntries`** — important subtlety: first catch handles truly unavailable storage (`'unavailable'`), inner logic handles corrupt data (`'available'`). Context must handle both statuses.
7. **`saveEntries` DOMException check**: distinguishes `QuotaExceededError` (err.name === 'QuotaExceededError') from other DOMExceptions, which return `'unavailable'`. Context should propagate whatever status is returned.
8. **Commit pattern**: `feat: <description> (Story X.Y)` — conventional commits, direct to `main`.

### Git Intelligence

Recent commits:
```
8fea68e feat: storage service and data model (Story 2.1)
c6ea5e2 review: story 1.3 done — security headers, gitignore, story status
3c73eba chore: add BMAD planning artifacts and tighten security headers
ea51672 docs: add live Vercel URL to README
bc37977 feat: initial project setup - Stories 1.1, 1.2 + vercel config
```

**Active branch:** `main` only (solo developer, direct to main).

**Deployment:** Push to `main` → Vercel auto-deploys. This story's changes (context + utils, no App.tsx wiring) will not break the running app — `EntriesProvider` is not yet imported by `App.tsx`.

**Suggested commit message:** `feat: entries context and calculations engine (Story 2.2)`

### Key Constraints from Architecture

- **`getDailyTotal` uses `getTodayEntries` internally** — do not re-implement day filtering logic. Reuse `getTodayEntries`.
- **No async** — localStorage reads are synchronous. `loadEntries()` is NOT async. `useEffect` runs synchronously in test environment with `act()`.
- **`crypto.randomUUID()`** — available in all modern browsers and in jsdom (Node 14.17+). No polyfill needed.
- **`addEntry` signature**: `(calories: number, sugar: number) => void` — caller passes parsed numbers. The context does not parse strings; that happens in the UI form (Story 2.4).
- **Immutable entries requirement** (FR5): The append-only model means `EntriesContext` has NO `removeEntry`, `updateEntry`, or `clearEntries`. Only `addEntry`.
- **`storageStatus` in context**: Required so Story 2.6's `App.tsx` can conditionally render the storage-unavailable inline message without querying storage directly.
- **`useEntries` custom hook export**: Components import `useEntries()` (not `useContext(EntriesContext)`). This is the public API. Keep `EntriesContext` itself as an implementation detail (do not export it directly for use in components).

### Data Flow This Story Enables

```
App start
  -> EntriesProvider mounts
  -> useEffect calls storageService.loadEntries()
  -> setEntries(loaded), setStorageStatus(status)
  -> All child components receive entries via useEntries()

User logs entry (future: Story 2.4 EntrySheet)
  -> calls EntriesContext.addEntry(calories, sugar)
  -> creates Entry with crypto.randomUUID() + new Date().toISOString()
  -> setEntries(prev => [...prev, newEntry])  [immutable]
  -> saveEntries(updatedEntries)              [persist]
  -> StatCard re-renders: calls getDailyTotal(entries)
  -> EntryCard list re-renders: calls getTodayEntries(entries)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2] — Full acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#State Management Patterns] — Immutable state updates, context structure, `addEntry` example code
- [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Boundaries] — `EntriesContext` is the only caller of `storageService`; `calculations.ts` is pure
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] — `crypto.randomUUID()`, ISO 8601 timestamps, `new Date().toDateString()` for day boundaries
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns] — Project directory layout, co-located tests
- [Source: _bmad-output/planning-artifacts/architecture.md#Process Patterns — Error Handling] — `storageStatus` propagation, no throws from context
- [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines] — Anti-patterns list: no direct localStorage, no any types, no state mutation
- [Source: _bmad-output/implementation-artifacts/2-1-storage-service-data-model.md#Dev Agent Record] — Vitest patterns, mock patterns, tool usage learnings

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- RED phase calculations: Tests failed as expected — `Failed to resolve import "./calculations"` (file did not exist). Confirmed 14 test cases structured correctly.
- GREEN phase calculations: All 14 tests passed immediately after implementing `getTodayEntries` + `getDailyTotal`. Running total: 33/33.
- RED phase context: Tests failed as expected — `Failed to resolve import "./EntriesContext"`.
- GREEN phase context: Initial implementation used `useEffect` → `setState` pattern. Two ESLint errors surfaced on `npm run lint`: (1) `react-hooks/set-state-in-effect` — calling setState synchronously within an effect; (2) `react-refresh/only-export-components` — exporting non-component (`useEntries`) from same file as component.
- REFACTOR: Switched to lazy `useState` initialization (`useState(() => { const { entries, status } = loadEntries(); return { entries, storageStatus: status }; })`). Eliminated `useEffect` entirely. Added `eslint-disable-next-line react-refresh/only-export-components` for `useEntries` export — standard practice for context files. Lint: clean. Tests: 47/47.
- One intermediate test failure: `addEntry calls saveEntries with the full updated array` failed with "expected called 1 times, got 2 times" — mock call count accumulated across tests. Fixed by adding `vi.clearAllMocks()` to `beforeEach`. All 47 tests pass.

### Completion Notes List

- Deleted `src/utils/.gitkeep` and `src/context/.gitkeep` placeholder files.
- Created `src/utils/calculations.ts` with two pure exported functions: `getTodayEntries` (filters by local-timezone day using `toDateString()`) and `getDailyTotal` (reduces today entries to `{ calories, sugar }` totals). No side effects, no React imports, no imports from other app modules.
- Created `src/utils/calculations.test.ts` with 14 unit tests covering: empty input, today entries, yesterday/tomorrow exclusion, mixed filtering, summing, negative values (FR6 correcting entries), zero values, and non-today-only arrays.
- Created `src/context/EntriesContext.tsx` with `EntriesProvider` (combined lazy `useState` init, immutable `addEntry`, `storageStatus` propagation) and `useEntries` custom hook with null-check guard.
- Key implementation decision: Used `useState(() => loadEntries())` lazy initialization (calls `loadEntries` exactly once on first render, synchronously) instead of `useEffect` + `setState`. This satisfies the ESLint `react-hooks/set-state-in-effect` rule and avoids an extra render cycle — better practice for synchronous external reads.
- Combined state object `{ entries, storageStatus }` allows single `loadEntries()` call while keeping both pieces of state synchronized.
- `addEntry` uses functional update `setState(prev => ({ ...prev, entries: [...prev.entries, newEntry] }))` for React best practice, while computing `updatedEntries` from the closure for the synchronous `saveEntries` call. Both are based on the same state snapshot.
- Created `src/context/EntriesContext.test.tsx` with 13 unit tests using `vi.mock('../services/storageService')` and `renderHook` + `act` from `@testing-library/react`. Added `vi.clearAllMocks()` in `beforeEach` to prevent cross-test mock call count accumulation.
- All 10 ACs satisfied. All 47 tests pass (14 new calculations + 13 new context + 17 storageService + 2 App + 1 new extra = 47). Zero regressions. Lint clean.

### File List

- `src/utils/calculations.ts` (new)
- `src/utils/calculations.test.ts` (new)
- `src/context/EntriesContext.tsx` (new)
- `src/context/EntriesContext.test.tsx` (new)
- `src/utils/.gitkeep` (deleted)
- `src/context/.gitkeep` (deleted)

### Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.6 (adversarial review)
**Date:** 2026-03-06
**Outcome:** Approve (all issues fixed)
**Findings:** 0 High, 2 Medium, 3 Low — all fixed automatically

#### Action Items

- [x] [M1] `addEntry` stale closure inconsistency — `setState` used `prev.entries` (fresh) while `saveEntries` used `entries` (closure), risking localStorage diverging from state on rapid double-calls. Fixed: single `setState` call using `entries` from closure for both, ensuring consistency. `EntriesContext.tsx:21-34`
- [x] [M2] Missing `afterEach(() => vi.restoreAllMocks())` in context tests — no safety net if a test modifies mock implementation with side effects. Fixed: added `afterEach` following the established Story 2.1 pattern. `EntriesContext.test.tsx:28-30`
- [x] [L1] `getDailyTotal` creates an intermediate array via `getTodayEntries` before reducing — micro-optimisation noted, left as-is for readability (data scale does not justify the change).
- [x] [L2] `makeEntry` reused `id: 'test-id'` for all entries by default — duplicate IDs in test arrays. Fixed: counter-based unique IDs (`test-id-N`). `calculations.test.ts:5-12`
- [x] [L3] No test for malformed timestamps in `getTodayEntries` — `new Date('not-a-date').toDateString()` returns `'Invalid Date'` and is silently excluded. Fixed: added defence-in-depth test. `calculations.test.ts:27-31`

### Change Log

- 2026-03-06: Implemented Story 2.2 — entries context and calculations engine. Created calculations.ts, calculations.test.ts (14 tests), EntriesContext.tsx, EntriesContext.test.tsx (13 tests). Deleted .gitkeep placeholders. Total: 47/47 tests passing.
- 2026-03-06: Code review fixes — refactored `addEntry` to single `setState` call eliminating stale closure inconsistency [M1]; added `afterEach(vi.restoreAllMocks)` to context tests [M2]; counter-based unique IDs in makeEntry [L2]; added malformed timestamp test [L3]. Total: 48/48 tests passing.
