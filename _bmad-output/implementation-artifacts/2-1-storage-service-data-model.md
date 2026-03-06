# Story 2.1: Storage Service & Data Model

Status: done

## Story

As a developer,
I want a robust storage abstraction layer that handles all localStorage operations with graceful error handling,
so that all other modules can persist and retrieve entry data without touching localStorage directly.

## Acceptance Criteria

1. **Given** the project foundation from Epic 1, **When** `src/services/storageService.ts` is implemented, **Then** it exports a `loadEntries()` function that reads from localStorage key `cst_entries`, parses the JSON array, validates each entry against the `Entry` interface, and returns `{ entries: Entry[], status: StorageStatus }`.
2. It exports a `saveEntries(entries: Entry[])` function that serialises the array to JSON, writes to localStorage key `cst_entries`, and returns a `StorageStatus`.
3. If localStorage is unavailable (private browsing, disabled), `loadEntries()` returns `{ entries: [], status: 'unavailable' }` and `saveEntries()` returns `'unavailable'` — both fail silently without throwing.
4. If localStorage quota is exceeded on write, `saveEntries()` catches the error and returns `'quota-exceeded'`.
5. If the data in `cst_entries` is corrupt or unparseable, `loadEntries()` returns `{ entries: [], status: 'available' }` — a fresh start without crashing.
6. `src/types.ts` exports `Entry` interface (`{ id: string, calories: number, sugar: number, timestamp: string }`), `InsightPeriod` type (`1 | 3 | 7 | 30 | 90`), and `StorageStatus` type (`'available' | 'unavailable' | 'quota-exceeded'`). **Note: all three are already implemented from Story 1.1 — no changes needed.**
7. All functions are covered by unit tests in `src/services/storageService.test.ts` including: successful read/write, empty storage (no key), corrupt data, unavailable localStorage, and quota exceeded scenarios.
8. No other module in the application accesses localStorage directly — `storageService.ts` is the sole point of contact.

## Tasks / Subtasks

- [x] Task 1: Verify `src/types.ts` has all required exports (AC: #6)
  - [x] Confirm `Entry`, `InsightPeriod`, `StorageStatus` are exported — no code changes needed (already done in Story 1.1)
- [x] Task 2: Create `src/services/storageService.ts` (AC: #1, #2, #3, #4, #5, #8)
  - [x] Define module-level constant `STORAGE_KEY_ENTRIES = 'cst_entries'`
  - [x] Implement private type guard `isValidEntry(entry: unknown): entry is Entry`
  - [x] Implement `loadEntries(): { entries: Entry[], status: StorageStatus }`
  - [x] Implement `saveEntries(entries: Entry[]): StorageStatus`
  - [x] Delete `src/services/.gitkeep` placeholder file
- [x] Task 3: Create `src/services/storageService.test.ts` (AC: #7)
  - [x] Test `loadEntries()` — empty storage (key not present), expect `{ entries: [], status: 'available' }`
  - [x] Test `loadEntries()` — valid entries array, expect all entries returned with `status: 'available'`
  - [x] Test `loadEntries()` — corrupt/non-JSON string, expect `{ entries: [], status: 'available' }`
  - [x] Test `loadEntries()` — valid JSON array with some invalid entry shapes, expect only valid entries returned
  - [x] Test `loadEntries()` — localStorage unavailable (throws on getItem), expect `{ entries: [], status: 'unavailable' }`
  - [x] Test `saveEntries()` — successful write, expect `'available'` and data persisted
  - [x] Test `saveEntries()` — localStorage unavailable (throws on setItem), expect `'unavailable'`
  - [x] Test `saveEntries()` — quota exceeded (setItem throws DOMException), expect `'quota-exceeded'`
- [x] Task 4: Run `npm test` and confirm all tests pass

## Dev Notes

### What This Story Delivers

This is the data foundation layer for the entire app. `storageService.ts` is the **only** module that may touch `localStorage` — everything else goes through this abstraction. Its clean error handling enables Epic 2's inline storage-unavailable message (Story 2.6) and powers the `storageStatus` exposed by `EntriesContext` (Story 2.2).

This story is a pure TypeScript service layer — no React, no UI, no components. The output is two exported functions and their tests.

### Current Project State (after Stories 1.1, 1.2, 1.3)

```
src/
  main.tsx              ✅ React entry point
  App.tsx               ✅ base layout shell (max-w-[480px] mx-auto)
  App.test.tsx          ✅ 2 tests passing
  index.css             ✅ Tailwind v4 design tokens + Google Fonts
  types.ts              ✅ Entry, InsightPeriod, StorageStatus already defined
  test-setup.ts         ✅ imports @testing-library/jest-dom
  components/.gitkeep   placeholder — do NOT touch this story
  services/.gitkeep     ← DELETE when creating storageService.ts
  utils/.gitkeep        placeholder — do NOT touch this story
  context/.gitkeep      placeholder — do NOT touch this story
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

- **`storageService.ts`**** is the sole localStorage gateway** — AC #8 is a hard architectural constraint. Violating it breaks the entire abstraction.
- **No React imports** — this is a pure TypeScript utility module (`storageService.ts` not `storageService.tsx`)
- **No throws** — all errors are caught internally; functions always return a typed result
- **No \****`any`**\*\* types** — use `unknown` for unvalidated data, then narrow with a type guard
- **Use \****`Entry`***\* from \****`src/types.ts`** — never redefine the interface locally
- **SCREAMING\_SNAKE\_CASE for module-level constants** — `STORAGE_KEY_ENTRIES`, not `storageKey`
- **No \****`console.log`** — remove all debug logging before commit

### Implementation Guide: `storageService.ts`

```typescript
// src/services/storageService.ts
import type { Entry, StorageStatus } from '../types';

const STORAGE_KEY_ENTRIES = 'cst_entries';

function isValidEntry(entry: unknown): entry is Entry {
  if (typeof entry !== 'object' || entry === null) return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.calories === 'number' && isFinite(e.calories) &&
    typeof e.sugar === 'number' && isFinite(e.sugar) &&
    typeof e.timestamp === 'string'
  );
}

export function loadEntries(): { entries: Entry[]; status: StorageStatus } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ENTRIES);
    if (raw === null) return { entries: [], status: 'available' };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { entries: [], status: 'available' };
    return { entries: parsed.filter(isValidEntry), status: 'available' };
  } catch {
    return { entries: [], status: 'unavailable' };
  }
}

export function saveEntries(entries: Entry[]): StorageStatus {
  try {
    localStorage.setItem(STORAGE_KEY_ENTRIES, JSON.stringify(entries));
    return 'available';
  } catch (err) {
    if (err instanceof DOMException) return 'quota-exceeded';
    return 'unavailable';
  }
}
```

**Why two try/catch blocks in loadEntries:** The first try/catch isolates the `localStorage.getItem` call so that a truly unavailable storage returns `'unavailable'`. The second try/catch handles corrupt JSON — if storage IS accessible but the data is garbage, we return `{ entries: [], status: 'available' }` so the app gets a clean slate without misreporting storage as broken.

### Implementation Guide: `storageService.test.ts`

The test environment uses Vitest 4.x + jsdom (configured in `vite.config.ts`). `jsdom` provides a working `localStorage` in tests. Use `vi.spyOn` to simulate failure modes.

**Key patterns for mocking localStorage:**

```typescript
// Simulate localStorage fully unavailable (private browsing):
vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
  throw new Error('Storage unavailable');
});

// Simulate quota exceeded on write:
vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
  throw new DOMException('QuotaExceededError', 'QuotaExceededError');
});

// Simulate setItem unavailable (non-DOMException):
vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
  throw new Error('Storage unavailable');
});

// Always restore mocks after tests:
afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear(); // clean slate between tests
});
```

**Test file structure:**

```typescript
// src/services/storageService.test.ts
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

    it('filters out entries with invalid shapes', () => {
      const invalid = { id: 123, calories: 'not-a-number', sugar: 5, timestamp: '...' };
      localStorage.setItem('cst_entries', JSON.stringify([VALID_ENTRY, invalid]));
      const result = loadEntries();
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0]).toEqual(VALID_ENTRY);
    });

    it('returns unavailable status when localStorage throws on read', () => {
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

    it('returns unavailable status when localStorage throws non-DOMException', () => {
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

    it('overwrites existing data with new entries array', () => {
      saveEntries([VALID_ENTRY]);
      const entry2: Entry = { ...VALID_ENTRY, id: 'test-id-2', calories: 300 };
      saveEntries([VALID_ENTRY, entry2]);
      const stored = JSON.parse(localStorage.getItem('cst_entries')!);
      expect(stored).toHaveLength(2);
    });
  });
});
```

### Project Structure Notes

**Files to create/modify this story:**
- `src/services/storageService.ts` — new file (the deliverable)
- `src/services/storageService.test.ts` — new test file
- `src/services/.gitkeep` — DELETE this file

**Files NOT to touch:**
- `src/types.ts` — already complete, no changes needed
- `src/App.tsx` — not involved in this story
- `src/index.css` — not involved in this story
- `src/context/`, `src/utils/`, `src/components/` — those are for Stories 2.2+

**Tailwind v4 token usage reminder (from Story 1.2):**
This story has no UI components so Tailwind is not involved. But for future reference in this epic: use `p-md`, `gap-sm`, `text-espresso` etc. NOT `p-spacing-md` or `text-color-espresso`.

### Testing Standards

- Test runner: `vitest` (configured in `vite.config.ts` with `globals: true`, `environment: 'jsdom'`)
- Test setup: `src/test-setup.ts` (imports `@testing-library/jest-dom`)
- Run tests: `npm test` (runs all `*.test.ts(x)` files)
- Co-located: `storageService.test.ts` lives next to `storageService.ts` in `src/services/`
- No separate `__tests__/` directory
- Use `vi` from `vitest` for spies/mocks — NOT `jest`
- `localStorage.clear()` in `afterEach` to prevent test pollution

### Key Constraints from Architecture

- **Append-only model**: `saveEntries()` takes the full updated array, NOT a single entry to append. The immutable append happens in `EntriesContext` (Story 2.2), not in the storage service.
- **ID generation**: `crypto.randomUUID()` is called in `EntriesContext.addEntry()`, NOT in `storageService.ts`. The storage service just persists whatever it receives.
- **Timestamps**: ISO 8601 via `new Date().toISOString()` — also handled in context, not storage service.
- **No loading states**: localStorage reads are synchronous. `loadEntries()` is NOT async.
- **Validation on read**: `isValidEntry` validates the shape on load to protect against corrupted/manually modified localStorage. It does NOT validate on write (caller owns that responsibility).

### Previous Story Intelligence (Epic 1 Learnings)

From Stories 1.1–1.3 dev agent records:

1. **Use \****`Write`**\*\* tool for complete file creation**, not `Edit` with heredoc — markdown file formatter causes issues with Edit tool for new files.
2. **Tailwind v4 — no \****`tailwind.config.js`** — design tokens live in `@theme {}` in `src/index.css`. Not relevant for this story but remember for future stories.
3. **Vitest config** — already has `/// <reference types="vitest/config" />` in `vite.config.ts`, `globals: true` means `describe`, `it`, `expect`, `vi` are globally available without imports — BUT it is safer to explicitly import them for type safety.
4. **Test environment is jsdom** — `window.localStorage` is available in tests with full read/write support.
5. **TypeScript version is 5.9.3** — uses `catch (err)` (no binding needed for empty catch in TS 4+, but use `catch` with no binding or `catch (err)` as needed).

### Git Intelligence (Recent Commits)

```
c6ea5e2 review: story 1.3 done — security headers, gitignore, story status
3c73eba chore: add BMAD planning artifacts and tighten security headers
ea51672 docs: add live Vercel URL to README
bc37977 feat: initial project setup - Stories 1.1, 1.2 + vercel config
```

**Active branches:** `main` only (solo developer, direct to main).

**Deployment:** Push to `main` → Vercel auto-deploys. This story's changes (pure service layer + tests) will not break the running app since `storageService.ts` is not yet imported by any UI code.

**Suggested commit message:** `feat: storage service and data model (Story 2.1)`

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] — Entry interface, `cst_entries` key, `crypto.randomUUID()`, ISO 8601 timestamps, append-only model, localStorage validation
- [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Boundaries] — `storageService` is sole localStorage access point; never throws; returns typed data
- [Source: _bmad-output/planning-artifacts/architecture.md#Process Patterns — Error Handling] — localStorage unavailable → return `{ available: false }` (now typed as `StorageStatus`)
- [Source: _bmad-output/planning-artifacts/architecture.md#Process Patterns — Input Handling] — validation on read, no validation on write
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1] — Full acceptance criteria
- [Source: _bmad-output/implementation-artifacts/1-3-github-repository-vercel-deployment.md#Previous Story Learnings] — Use Write tool, Tailwind v4 patterns, Vitest config details

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- RED phase: Tests failed as expected — `Failed to resolve import "./storageService"` (file did not exist yet). Test structure and import paths confirmed valid.
- GREEN phase: All 15 tests passed immediately after implementing `storageService.ts` with two-try/catch pattern.
- Full suite: 17/17 tests passed (15 new + 2 existing App.test.tsx). Zero regressions.
- Lint: `npm run lint` passed with no errors or warnings.

### Completion Notes List

- Verified `src/types.ts` already exports `Entry`, `InsightPeriod`, `StorageStatus` — no changes needed.
- Created `src/services/storageService.ts` with `STORAGE_KEY_ENTRIES` constant, `isValidEntry` type guard, `loadEntries()`, and `saveEntries()`.
- Used two separate try/catch blocks in `loadEntries()`: first for `localStorage.getItem` (returns `'unavailable'` if storage truly inaccessible), second for `JSON.parse` (returns `{ entries: [], status: 'available' }` if data is corrupt but storage works).
- `saveEntries()` distinguishes `DOMException` (quota exceeded) from other errors (unavailable) for precise status reporting.
- `isValidEntry` type guard validates id (string), calories (finite number), sugar (finite number), timestamp (string) — accepts 0 and negative values for correcting entries per FR6.
- Deleted `src/services/.gitkeep` placeholder as part of Task 2.
- Created `src/services/storageService.test.ts` with 15 unit tests covering all 8 required scenarios plus edge cases (multiple entries, negative/zero values, non-array JSON, non-finite calories via null).
- All acceptance criteria (AC #1–#8) satisfied.

### File List

- `src/services/storageService.ts` (new)
- `src/services/storageService.test.ts` (new)
- `src/services/.gitkeep` (deleted)

### Senior Developer Review (AI)

**Reviewer:** Claude Opus 4.6 (adversarial review)
**Date:** 2026-03-06
**Outcome:** Approve (all issues fixed)
**Findings:** 0 High, 1 Medium, 4 Low — all fixed automatically

#### Action Items

- [x] [M1] `saveEntries` DOMException check too broad — `instanceof DOMException` catches `SecurityError` as quota-exceeded. Fixed: added `err.name === 'QuotaExceededError'` check.
- [x] [L1] Missing test: non-quota DOMException (`SecurityError`) in `saveEntries` should return `'unavailable'`. Fixed: added test.
- [x] [L2] Missing test: entries with entirely missing properties (e.g., `{ id: 'x' }`). Fixed: added test.
- [x] [L3] Prefer `Number.isFinite()` over global `isFinite()`. Fixed: replaced both occurrences.
- [x] [L4] Timestamp validation is shape-only — noted for awareness, no fix needed. Storage service validates shape, `calculations.ts` should handle semantics.

### Change Log

- 2026-03-06: Implemented Story 2.1 — storage service and data model. Created storageService.ts and storageService.test.ts (15 tests, all passing). Deleted services/.gitkeep placeholder.
- 2026-03-06: Code review fixes — narrowed DOMException check to QuotaExceededError specifically, replaced `isFinite()` with `Number.isFinite()`, added 2 edge case tests (missing properties, SecurityError DOMException). Total tests: 17.
