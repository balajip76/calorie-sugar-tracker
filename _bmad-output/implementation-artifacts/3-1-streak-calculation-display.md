# Story 3.1: Streak Calculation & Display

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see how many consecutive days I've logged at least one entry,
so that I have a quiet ambient signal of my tracking habit without any pressure or guilt.

## Acceptance Criteria

1. **Given** the calculations module, **When** `getStreak(entries: Entry[]): number` is added to `calculations.ts`, **Then** it returns the count of consecutive calendar days (ending with today or yesterday) on which at least one entry was logged.
2. If today has entries, today is included in the streak count.
3. If today has no entries but yesterday does, the streak counts back from yesterday (the streak is still alive until a full day is missed).
4. Calendar day boundaries use local timezone midnight (consistent with `getTodayEntries` which uses `new Date().toDateString()`).
5. The function is pure -- takes `Entry[]`, returns a number, no side effects.
6. Unit tests cover: no entries (returns 0), single day (returns 1), consecutive days (returns correct count), gap in the middle (streak breaks), entries spanning midnight boundary.
7. **Given** the `DateStreakRow` component from Story 2.3, **When** the streak calculation is wired in, **Then** the streak count is displayed on the right side of the DateStreakRow, aligned with the date on the left.
8. The streak displays as a number in Warm Amber colour, Streak style (14px/500), with a fire emoji prefix (e.g. "🔥3").
9. When the streak is 0, it displays "🔥0" with no special styling, no penalty message, no "you missed X days" banner (FR16).
10. The streak updates silently when entries are added -- no animation, no celebration.
11. The `<time>` element is used for semantic date display in the DateStreakRow (already implemented).

## Tasks / Subtasks

- [x] Task 1: Add `getStreak()` to `src/utils/calculations.ts` (AC: #1, #2, #3, #4, #5)
  - [x] Function signature: `getStreak(entries: Entry[]): number`
  - [x] Determine starting day: if today has entries, start from today; else if yesterday has entries, start from yesterday; else return 0
  - [x] Walk backwards day-by-day counting consecutive days with at least one entry
  - [x] Use `new Date().toDateString()` for calendar day comparison (matches existing pattern in `getTodayEntries`)
- [x] Task 2: Add streak tests to `src/utils/calculations.test.ts` (AC: #6)
  - [x] Test: no entries returns 0
  - [x] Test: entries only today returns 1
  - [x] Test: entries today + yesterday returns 2
  - [x] Test: entries today + yesterday + 2 days ago returns 3
  - [x] Test: entries yesterday only (no today) returns 1
  - [x] Test: gap breaks streak (today + 3 days ago, no yesterday = streak 1)
  - [x] Test: entries spanning midnight boundary (invalid timestamp silently excluded)
  - [x] Test: multiple entries on same day count as 1 day
  - [x] Test: entries only from 2+ days ago (no today or yesterday) returns 0
- [x] Task 3: Update `src/components/DateStreakRow.tsx` (AC: #7, #8, #9, #10)
  - [x] Add `streak` prop: `{ streak: number }`
  - [x] Render streak span on the right side: `<span className="text-streak font-medium text-warm-amber">🔥{streak}</span>`
  - [x] Remove the placeholder comment `{/* Streak counter will be added in Story 3.1 */}`
- [x] Task 4: Update `src/components/DateStreakRow.test.tsx` (AC: #7, #8, #9)
  - [x] Test: displays streak value with fire emoji (e.g. "🔥5")
  - [x] Test: displays "🔥0" when streak is 0
  - [x] Test: streak has `text-warm-amber` class
- [x] Task 5: Update `src/App.tsx` (AC: #7, #10)
  - [x] Import `getStreak` from `./utils/calculations`
  - [x] Compute `streak = getStreak(entries)` in `AppContent`
  - [x] Pass `streak` prop to `<DateStreakRow streak={streak} />`
- [x] Task 6: Update `src/App.test.tsx` (AC: #7)
  - [x] Test: streak value renders in DateStreakRow (verify "🔥0" appears with empty entries)
  - [x] Test: streak value updates when entries span multiple days
- [x] Task 7: Run `npm test` -- all tests passing, zero regressions

## Dev Notes

### What This Story Delivers

- **`getStreak()`**** function** in `src/utils/calculations.ts`: pure function calculating consecutive logging days
- **Streak display** in `DateStreakRow`: fire emoji + number in Warm Amber, right-aligned
- **Wiring** in `App.tsx`: computes streak from all entries and passes to DateStreakRow

**What is NOT in this story:**
- InsightsPanel / PillSelector (Story 3.2)
- `getAverages()` calculation (Story 3.2)
- Any animation or celebration for streak changes
- Any penalty messaging for streak = 0

### Current Project State (after Story 2.6)

```
src/
  main.tsx                          Done
  App.tsx                           <- UPDATE (import getStreak, compute streak, pass to DateStreakRow)
  App.test.tsx                      <- UPDATE (add streak display tests)
  index.css                         Done (all tokens present including text-streak, text-warm-amber)
  types.ts                          Done (Entry, InsightPeriod, StorageStatus)
  test-setup.ts                     Done (window.matchMedia mock)
  components/
    DateStreakRow.tsx               <- UPDATE (add streak prop + display)
    DateStreakRow.test.tsx          <- UPDATE (add streak display tests)
    StatCard.tsx                   Done
    StatCard.test.tsx              Done
    EntrySheet.tsx                 Done
    EntrySheet.test.tsx            Done
    EntryCard.tsx                  Done
    EntryCard.test.tsx             Done
    FAB.tsx                        Done
    FAB.test.tsx                   Done
    ErrorBoundary.tsx              Done
    ErrorBoundary.test.tsx         Done
  services/storageService.ts        Done
  utils/
    calculations.ts                <- UPDATE (add getStreak function)
    calculations.test.ts           <- UPDATE (add getStreak tests)
  context/EntriesContext.tsx        Done (exports { entries, addEntry, storageStatus })
```

### Architecture Compliance Rules (MANDATORY)

- **`getStreak()`**** is a pure function** in `calculations.ts` -- takes `Entry[]`, returns `number`. No side effects, no state, no imports from context or services.
- **DateStreakRow receives streak as a prop** -- it does NOT call `useEntries()` or `getStreak()` directly. The computation happens in `App.tsx` and is passed down.
- **Calendar day boundary**: use `new Date(timestamp).toDateString()` for day comparison -- this is the established pattern in `getTodayEntries()`. Do NOT use UTC methods.
- **Tailwind only** -- no custom CSS, no inline style objects.
- **No \****`any`**\*\* types** -- type the `streak` prop explicitly.
- **No \****`console.log`** -- remove before commit.
- **No new dependencies** -- everything needed is already in place.
- **No animation on streak** -- UX spec says "Number updates silently" and "Streak changes: No animation". The streak just shows the current value.

### Implementation Guide: `getStreak()` in `calculations.ts`

```typescript
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
  let current = new Date(today);
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
```

**Why \****`Set<string>`**\*\* of date strings:** O(1) lookup per day instead of scanning the full entries array for each day. Efficient even with 365 days of data (NFR3).

**Why \****`toDateString()`**\*\* comparison:** Matches the exact pattern used in `getTodayEntries()`. Uses local timezone, not UTC. A user logging at 11:59 PM sees that entry counted for today, not tomorrow.

**Why check both today and yesterday:** Per AC #2 and #3 -- if today has no entries but yesterday does, the streak is still alive. This prevents the streak from dropping to 0 at midnight before the user has had a chance to log.

**Why \****`isNaN(d.getTime())`**\*\* guard:** Matches the defensive pattern from `getTodayEntries` -- invalid timestamps are silently excluded rather than crashing.

### Implementation Guide: Updated `DateStreakRow.tsx`

```tsx
interface DateStreakRowProps {
  streak: number;
}

export function DateStreakRow({ streak }: DateStreakRowProps) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateTimeAttr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const displayDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between">
      <time dateTime={dateTimeAttr} className="font-sans text-section-label font-medium text-espresso">
        {displayDate}
      </time>
      <span className="text-streak font-medium text-warm-amber">
        🔥{streak}
      </span>
    </div>
  );
}
```

**Why \****`text-streak`**\*\*:** Design token defined in `index.css` as `--font-size-streak: 0.875rem` (14px) with `--leading-streak: 1` (line-height 1). Matches UX spec "Streak: 14px/500 (Medium)".

**Why \****`text-warm-amber`**\*\*:** Design token `--color-warm-amber: #D4A574`. UX spec states "Streak counter: Warm Amber colour".

**Why \****`font-medium`**\*\*:** Tailwind `font-medium` = `font-weight: 500`. Matches UX spec "Streak: 14px/500 (Medium)".

**Why no conditional rendering for streak = 0:** UX spec says "When the streak is 0, it displays '🔥0' with no special styling". Always render the streak, always with fire emoji.

### Implementation Guide: `App.tsx` Changes

Add to imports:
```tsx
import { getTodayEntries, getStreak } from './utils/calculations';
```

In `AppContent`, after `dailyTotal` computation:
```tsx
const streak = getStreak(entries);
```

Update `DateStreakRow` in JSX:
```tsx
<DateStreakRow streak={streak} />
```

**Why pass \****`entries`***\* (all entries) not \****`todayEntries`**\*\*:** Streak needs ALL historical entries to count consecutive days. `todayEntries` only has today's entries -- useless for streak calculation.

### Implementation Guide: Test Helpers for `calculations.test.ts`

The existing test file already has `makeEntry()` and `yesterdayISO()` helpers. You'll need to add helpers for arbitrary days ago:

```typescript
function daysAgoISO(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
```

Then use in tests:
```typescript
describe('getStreak', () => {
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

  it('returns 1 for entries yesterday only (no today)', () => {
    expect(getStreak([
      makeEntry({ calories: 100, sugar: 10, timestamp: yesterdayISO() }),
    ])).toBe(1);
  });

  it('breaks streak on gap', () => {
    // Today + 3 days ago (no yesterday, no 2 days ago) = streak 1
    expect(getStreak([
      makeEntry({ calories: 100, sugar: 10 }),
      makeEntry({ calories: 200, sugar: 20, timestamp: daysAgoISO(3) }),
    ])).toBe(1);
  });

  it('returns 0 if only entries are 2+ days ago', () => {
    expect(getStreak([
      makeEntry({ calories: 100, sugar: 10, timestamp: daysAgoISO(5) }),
    ])).toBe(0);
  });

  it('counts multiple entries on same day as 1 day', () => {
    expect(getStreak([
      makeEntry({ calories: 100, sugar: 10 }),
      makeEntry({ calories: 200, sugar: 20 }),
      makeEntry({ calories: 300, sugar: 30 }),
    ])).toBe(1);
  });
});
```

### Implementation Guide: `DateStreakRow.test.tsx` Updates

Add to existing test file:
```typescript
it('displays streak with fire emoji', () => {
  render(<DateStreakRow streak={5} />);
  expect(screen.getByText('🔥5')).toBeInTheDocument();
});

it('displays zero streak', () => {
  render(<DateStreakRow streak={0} />);
  expect(screen.getByText('🔥0')).toBeInTheDocument();
});

it('streak has warm-amber colour class', () => {
  render(<DateStreakRow streak={3} />);
  const streakEl = screen.getByText('🔥3');
  expect(streakEl).toHaveClass('text-warm-amber');
});
```

**CRITICAL:** Existing tests for DateStreakRow render `<DateStreakRow />` without a `streak` prop. These must be updated to `<DateStreakRow streak={0} />` (or any number) since `streak` is now a required prop.

### Implementation Guide: `App.test.tsx` Updates

Add to existing tests:
```typescript
it('displays the streak counter', () => {
  render(<App />);
  expect(screen.getByText('🔥0')).toBeInTheDocument();
});
```

For a test with entries spanning multiple days, mock `loadEntries` to return entries from consecutive days:
```typescript
it('shows correct streak for multi-day entries', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  vi.mocked(storageService.loadEntries).mockReturnValue({
    entries: [
      { id: '1', calories: 100, sugar: 10, timestamp: new Date().toISOString() },
      { id: '2', calories: 200, sugar: 20, timestamp: yesterday.toISOString() },
    ],
    status: 'available',
  });
  render(<App />);
  expect(screen.getByText('🔥2')).toBeInTheDocument();
});
```

### Design System Token Reference

| Token | Tailwind class | Value | Source |
| --- | --- | --- | --- |
| Warm Amber | `text-warm-amber` | #D4A574 | index.css `--color-warm-amber` |
| Streak font size | `text-streak` | 14px (0.875rem) | index.css `--font-size-streak` |
| Streak line-height | (included in `text-streak`) | 1 | index.css `--leading-streak` |
| Font medium | `font-medium` | 500 | Tailwind default |

### Previous Story Intelligence (Stories 2.1-2.6 Learnings)

1. **`vi.clearAllMocks()`**** in \****`beforeEach`** -- prevents cross-test mock contamination. Already in `App.test.tsx`.
2. **rAF mock in \****`App.test.tsx`** -- required for StatCard count-up animation in tests. Already present.
3. **`makeEntry()`**** helper in \****`calculations.test.ts`** -- already exists, accepts partial overrides. Use it for streak tests.
4. **`yesterdayISO()`**** helper in \****`calculations.test.ts`** -- already exists. Reuse for streak tests.
5. **Fake timers in \****`DateStreakRow.test.tsx`** -- already uses `vi.useFakeTimers()` and `vi.setSystemTime()`. Streak tests should also use frozen time for deterministic results.
6. **StorageService mock pattern** -- `App.test.tsx` already mocks `storageService.loadEntries`. Use same pattern for multi-day streak tests.
7. **Component receives data as props** -- per architecture boundaries, DateStreakRow is a UI component that receives computed data, never calls context or calculations directly.
8. **`isNaN`**** guard on timestamps** -- `getTodayEntries` silently skips invalid timestamps. `getStreak` should follow the same defensive pattern.
9. **No barrel re-exports** -- import `getStreak` directly from `'./utils/calculations'` alongside `getTodayEntries`.
10. **Commit pattern:** `feat: streak calculation and display (Story 3.1)` -- conventional commits, direct to `main`.

### Git Intelligence

Recent commits:
```
9aec273 feat: entries context, calculations, StatCards, DateStreakRow (Stories 2.2-2.3)
8fea68e feat: storage service and data model (Story 2.1)
c6ea5e2 review: story 1.3 done -- security headers, gitignore, story status
```
(Stories 2.4-2.6 work exists in working tree, uncommitted)

**Patterns confirmed in codebase:**
- `calculations.ts` exports pure functions, imports only `Entry` type from `../types`
- `DateStreakRow` is a functional component, currently takes no props
- `App.tsx` imports `getTodayEntries` from `./utils/calculations` -- add `getStreak` to same import
- `App.tsx` passes `entries` (all entries) from context, not just `todayEntries`
- Design token `--font-size-streak: 0.875rem` and `--leading-streak: 1` confirmed in `index.css`
- Design token `--color-warm-amber: #D4A574` confirmed in `index.css`

### Project Structure After This Story

```
src/
  components/
    DateStreakRow.tsx       (UPDATED -- added streak prop + display)
    DateStreakRow.test.tsx  (UPDATED -- added streak display tests, updated existing tests with streak prop)
    StatCard.tsx            (unchanged)
    StatCard.test.tsx       (unchanged)
    EntrySheet.tsx          (unchanged)
    EntrySheet.test.tsx     (unchanged)
    EntryCard.tsx           (unchanged)
    EntryCard.test.tsx      (unchanged)
    FAB.tsx                 (unchanged)
    FAB.test.tsx            (unchanged)
    ErrorBoundary.tsx       (unchanged)
    ErrorBoundary.test.tsx  (unchanged)
  context/
    EntriesContext.tsx      (unchanged)
    EntriesContext.test.tsx (unchanged)
  services/
    storageService.ts       (unchanged)
    storageService.test.ts  (unchanged)
  utils/
    calculations.ts         (UPDATED -- added getStreak function)
    calculations.test.ts    (UPDATED -- added getStreak tests + daysAgoISO helper)
  types.ts                  (unchanged)
  main.tsx                  (unchanged)
  App.tsx                   (UPDATED -- import getStreak, compute streak, pass to DateStreakRow)
  App.test.tsx              (UPDATED -- streak display tests)
  index.css                 (unchanged -- all tokens already present)
```

**Files NOT to touch this story:**
- `src/services/storageService.ts` -- already complete
- `src/context/EntriesContext.tsx` -- already complete
- `src/types.ts` -- no new types needed
- `src/index.css` -- all tokens done (text-streak, text-warm-amber already defined)
- All component files except DateStreakRow -- zero modifications needed
- `vercel.json`, `vite.config.ts`, `package.json` -- no changes

**Do NOT create in this story:**
- `InsightsPanel.tsx` (Story 3.2)
- `PillSelector.tsx` (Story 3.2)
- `getAverages()` function (Story 3.2)

### Project Structure Notes

- Alignment with unified project structure: all changes within existing files, no new files created
- No conflicts or variances detected

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1] -- Full acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3] -- Epic objectives: Insights & Streaks
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory] -- FR15 (streak counter), FR16 (silent streak reset)
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] -- calculations.ts as pure utility module
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] -- camelCase for functions (getStreak)
- [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Boundaries] -- calculations.ts: pure functions, no side effects
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Flow] -- DateStreakRow re-renders calling calculations.getStreak()
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Color System] -- Warm Amber #D4A574 for streak
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Typography System] -- Streak: 14px/0.875rem, 500 (Medium)
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Feedback Patterns] -- Streak changes: No animation
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Empty States] -- Streak shows 0, same style
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy - DateStreakRow] -- Date text left, streak text right, Warm Amber
- [Source: src/utils/calculations.ts] -- Current pure functions, toDateString() pattern
- [Source: src/components/DateStreakRow.tsx] -- Current implementation with placeholder comment
- [Source: src/App.tsx] -- Current layout, entries from context
- [Source: src/index.css] -- --font-size-streak, --leading-streak, --color-warm-amber tokens
- [Source: _bmad-output/implementation-artifacts/2-6-fab-error-handling.md] -- Previous story learnings, test patterns

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None -- implementation completed cleanly on first run. 128 tests pass across 10 test files.

### Completion Notes List

1. **`getStreak()`**** pure function** -- Added to `calculations.ts`. Uses a `Set<string>` of `toDateString()` values for O(1) day lookup. Walks backward from today (or yesterday if today has no entries). Follows same defensive `isNaN` guard pattern as `getTodayEntries`.
2. **9 streak unit tests** -- Added to `calculations.test.ts` with a new `daysAgoISO(n)` helper. Covers: empty array, today-only, today+yesterday, 3-day streak, yesterday-only, gap breaking streak, multiple entries same day, 2+ days ago only, invalid timestamps.
3. **DateStreakRow updated** -- Added required `streak: number` prop. Renders `<span className="text-streak font-medium text-warm-amber">🔥{streak}</span>` on the right side. Removed placeholder comment.
4. **DateStreakRow tests updated** -- All 4 existing tests updated to pass `streak={0}` (now required prop). 3 new tests added for streak display, zero streak, and warm-amber class.
5. **App.tsx wiring** -- Added `getStreak` to import, computes `streak = getStreak(entries)` from ALL entries (not just today's), passes to `<DateStreakRow streak={streak} />`.
6. **App tests** -- 2 new tests: zero-state shows `🔥0`, consecutive-day entries show `🔥2`.
7. **Final test count: 128** -- 114 baseline + 9 getStreak + 3 DateStreakRow + 2 App = 128. All 10 test files pass, zero regressions.

### File List

- `src/utils/calculations.ts` -- UPDATED: added `getStreak()` pure function
- `src/utils/calculations.test.ts` -- UPDATED: added `daysAgoISO()` helper and 9 `getStreak()` tests
- `src/components/DateStreakRow.tsx` -- UPDATED: added `streak` prop and streak display span
- `src/components/DateStreakRow.test.tsx` -- UPDATED: fixed 4 existing tests (added streak prop), added 3 new streak tests
- `src/App.tsx` -- UPDATED: imported `getStreak`, computed `streak`, passed to `DateStreakRow`
- `src/App.test.tsx` -- UPDATED: added 2 streak display integration tests
- `_bmad-output/implementation-artifacts/3-1-streak-calculation-display.md` -- story file (tasks marked [x], Dev Agent Record populated)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` -- story status updated to `review`
