# Story 3.2: Insights Panel with Pill Selector

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see my average daily calories and sugar over selectable time periods,
so that I can spot patterns in my eating habits at a glance.

## Acceptance Criteria

1. **Given** the calculations module, **When** `getAverages(entries: Entry[], days: number): { calories: number, sugar: number }` is added to `calculations.ts`, **Then** it calculates the average daily calories and average daily sugar over the specified number of past days (including today).
2. It divides total calories and sugar by the number of days in the period (not by the number of days with entries -- empty days count as zero).
3. The function is pure with no side effects.
4. Unit tests cover: no entries (returns 0/0), entries in one day, entries across multiple days, period longer than available data, entries exactly at period boundary.
5. **Given** the main screen layout, **When** the `PillSelector` component renders, **Then** it displays 5 pills in a horizontal row: 1d, 3d, 7d, 30d, 90d.
6. Each pill has `role="tab"` within a `role="tablist"` container.
7. The active pill has Rose Blush background with Soft Terracotta border and text.
8. Inactive pills have transparent background with Sand Mist border and Warm Stone text.
9. Keyboard navigation uses left/right arrow keys to move between pills, with `aria-selected` on the active pill.
10. Tapping a pill switches the selection immediately with no loading state (NFR2).
11. The default selection is 3d on every session (FR14) -- not persisted across sessions.
12. **Given** the PillSelector and calculations, **When** the `InsightsPanel` component renders, **Then** it is pinned at the bottom of the screen, full width, Warm Linen background with Sand Mist border-top.
13. It contains the PillSelector and two value displays: average daily calories and average daily sugar.
14. Values update immediately when the user switches pill selection.
15. Values have `aria-live="polite"` so screen readers announce changes when the pill selection changes.
16. The panel is compact and glanceable -- does not dominate the screen.
17. **Given** the user has no entries at all, **When** the InsightsPanel renders, **Then** it displays "Insights will appear after your first entry" in Dusty Tan text, centred.
18. The PillSelector is still visible and interactive even in the empty state.
19. **Given** the FAB from Story 2.6, **When** the InsightsPanel is rendered at the bottom, **Then** the FAB is positioned above the InsightsPanel so they do not overlap.

## Tasks / Subtasks

- [x] Task 1: Add `getAverages()` to `src/utils/calculations.ts` (AC: #1, #2, #3)
  - [x] Function signature: `getAverages(entries: Entry[], days: number): { calories: number; sugar: number }`
  - [x] Build cutoff: start of local calendar day `(days - 1)` days ago using `setHours(0, 0, 0, 0)`
  - [x] Filter entries with `!isNaN(d.getTime()) && d >= cutoffDate` (matches defensive pattern of getTodayEntries/getStreak)
  - [x] Sum filtered entries, divide totals by `days` (not by days-with-entries)
  - [x] Return `{ calories: 0, sugar: 0 }` for empty entries array or days <= 0

- [x] Task 2: Add `getAverages` tests to `src/utils/calculations.test.ts` (AC: #4)
  - [x] Test: no entries returns `{ calories: 0, sugar: 0 }`
  - [x] Test: single entry today with days=1 returns correct average (calories/1, sugar/1)
  - [x] Test: entries on multiple days within period returns correct average (total/days)
  - [x] Test: period longer than available data still divides by `days` (e.g. 3 entries over 3 days, period=7 divides by 7)
  - [x] Test: entries exactly at period boundary (entry from (days-1) days ago at midnight) is included
  - [x] Test: entries outside the period are excluded
  - [x] Test: days=3 with today + yesterday entries calculates correctly (divides by 3, not 2)
  - [x] Test: invalid timestamps silently excluded

- [x] Task 3: Create `src/components/PillSelector.tsx` (AC: #5, #6, #7, #8, #9, #10, #11)
  - [x] Props: `{ selected: InsightPeriod; onChange: (period: InsightPeriod) => void }`
  - [x] `PERIODS: InsightPeriod[] = [1, 3, 7, 30, 90]` as module-level constant
  - [x] `LABELS: Record<InsightPeriod, string> = { 1: '1d', 3: '3d', 7: '7d', 30: '30d', 90: '90d' }` as module-level constant
  - [x] Outer container: `role="tablist"` with `aria-label="Insight period"`
  - [x] Each pill: `role="tab"`, `aria-selected={period === selected}`, `onClick`, `onKeyDown`
  - [x] Active pill classes: `bg-rose-blush border-soft-terracotta text-soft-terracotta`
  - [x] Inactive pill classes: `bg-transparent border-sand-mist text-warm-stone`
  - [x] All pills: `border rounded-pill text-button font-semibold flex-1 py-1` (full row fill)
  - [x] `onKeyDown`: ArrowRight advances index, ArrowLeft retreats index (wrapping), calls `onChange`
  - [x] Import `InsightPeriod` from `../types` (type import only)

- [x] Task 4: Create `src/components/PillSelector.test.tsx` (AC: #5, #6, #7, #8, #9, #10, #11)
  - [x] Test: renders all 5 period labels (1d, 3d, 7d, 30d, 90d)
  - [x] Test: active pill (3d default) has `aria-selected="true"`
  - [x] Test: inactive pills have `aria-selected="false"`
  - [x] Test: clicking a pill calls `onChange` with the correct `InsightPeriod`
  - [x] Test: pressing ArrowRight on last pill wraps to first pill
  - [x] Test: pressing ArrowLeft on first pill wraps to last pill
  - [x] Test: tablist container has `role="tablist"`
  - [x] Test: active pill has `bg-rose-blush` class

- [x] Task 5: Create `src/components/InsightsPanel.tsx` (AC: #12, #13, #14, #15, #16, #17, #18)
  - [x] Props: `{ entries: Entry[] }`
  - [x] Internal state: `const [period, setPeriod] = useState<InsightPeriod>(3)` (default 3d per FR14)
  - [x] `const DEFAULT_PERIOD: InsightPeriod = 3` as module-level constant
  - [x] Compute `averages = getAverages(entries, period)` from `calculations.ts`
  - [x] Outer div: `fixed bottom-0 inset-x-0 bg-warm-linen border-t border-sand-mist`
  - [x] Inner div: `max-w-[480px] mx-auto px-6 py-4 flex flex-col gap-3`
  - [x] Always render `<PillSelector>` (visible even in empty state per AC #18)
  - [x] If `entries.length > 0`: render two value displays with `aria-live="polite"` on wrapper
  - [x] Values: `Math.round(averages.calories)` kcal and `Math.round(averages.sugar)` g
  - [x] If `entries.length === 0`: render empty state `<p aria-live="polite" className="text-dusty-tan text-center text-sm">Insights will appear after your first entry</p>`
  - [x] Import types from `../types`, getAverages from `../utils/calculations`, PillSelector from `./PillSelector`

- [x] Task 6: Create `src/components/InsightsPanel.test.tsx` (AC: #12, #13, #14, #15, #17, #18)
  - [x] Test: renders PillSelector with 5 pills
  - [x] Test: empty state shows "Insights will appear after your first entry"
  - [x] Test: empty state still shows PillSelector pills
  - [x] Test: with entries, shows average calorie and sugar values
  - [x] Test: switching pill updates displayed values (simulate click, check re-render)
  - [x] Test: values container has `aria-live="polite"`
  - [x] Test: values display `Math.round()` result (no excessive decimal places)
  - [x] Used local `makeEntry` helper (no shared utility — co-located)

- [x] Task 7: Update `src/components/FAB.tsx` (AC: #19)
  - [x] Add optional prop `bottomClass?: string` (default `'bottom-6'`)
  - [x] Replace hardcoded `bottom-6` in className with `bottomClass` prop
  - [x] Existing behaviour (no prop = `bottom-6`) is unchanged for tests that don't provide it

- [x] Task 8: Update `src/App.tsx` (AC: #12, #13, #19)
  - [x] Import `InsightsPanel` from `./components/InsightsPanel`
  - [x] Render `<InsightsPanel entries={entries} />` inside the JSX fragment, placed after `<main>` (as a sibling)
  - [x] Add `inert={isSheetOpen ? true : undefined}` to `<InsightsPanel>` (pass through as div attribute)
  - [x] Pass `bottomClass="bottom-[148px]"` to `<FAB>` so FAB clears InsightsPanel (~120px) + 24px gap
  - [x] Increase main's `pb-24` to `pb-[180px]` to ensure last entry card is not hidden behind InsightsPanel + FAB

- [x] Task 9: Update `src/App.test.tsx`
  - [x] Test: InsightsPanel renders with empty state message when no entries
  - [x] Test: InsightsPanel renders with pill selector buttons
  - [x] Updated button count test (pills use role="tab" not role="button", count stays 3)
  - [x] No regressions on existing tests (all 23 App tests pass)

- [x] Task 10: Update `src/components/FAB.test.tsx`
  - [x] Existing tests unchanged (bottomClass is optional, default preserved)
  - [x] Added test: FAB applies custom bottomClass when provided
  - [x] Added test: FAB uses default bottom-6 when bottomClass not provided

- [x] Task 11: Run `npm test` -- all 166 tests passing, zero regressions

## Dev Notes

### What This Story Delivers

- **`getAverages()`** function in `src/utils/calculations.ts`: pure function computing average daily calories and sugar over N days
- **`PillSelector`** component: tab-list of 1d/3d/7d/30d/90d selectors with full keyboard support
- **`InsightsPanel`** component: fixed bottom panel with PillSelector + live average values
- **Wiring** in `App.tsx`: InsightsPanel receives all entries from context, FAB repositioned above panel

**What is NOT in this story:**
- Smart search (Story 4.1)
- Any server-side computation or analytics
- Persisting the selected insight period across sessions (FR14 explicitly says "defaults to 3d on every session")

### Current Project State (after Story 3.1)

128 tests passing across 10 test files.

```
src/
  main.tsx                          Done
  App.tsx                           <- UPDATE (import InsightsPanel, wire entries, adjust FAB bottom, increase pb)
  App.test.tsx                      <- UPDATE (add InsightsPanel render tests)
  index.css                         Done (all tokens present)
  types.ts                          Done (Entry, InsightPeriod=1|3|7|30|90, StorageStatus)
  test-setup.ts                     Done
  components/
    DateStreakRow.tsx               Done (streak prop wired)
    DateStreakRow.test.tsx          Done
    StatCard.tsx                   Done
    StatCard.test.tsx              Done
    EntrySheet.tsx                 Done
    EntrySheet.test.tsx            Done
    EntryCard.tsx                  Done
    EntryCard.test.tsx             Done
    FAB.tsx                        <- UPDATE (add optional bottomClass prop)
    FAB.test.tsx                   <- UPDATE (add bottomClass prop test)
    ErrorBoundary.tsx              Done
    ErrorBoundary.test.tsx         Done
    PillSelector.tsx               <- CREATE
    PillSelector.test.tsx          <- CREATE
    InsightsPanel.tsx              <- CREATE
    InsightsPanel.test.tsx         <- CREATE
  services/storageService.ts        Done
  utils/
    calculations.ts                <- UPDATE (add getAverages function)
    calculations.test.ts           <- UPDATE (add getAverages tests)
  context/EntriesContext.tsx        Done
```

### Architecture Compliance Rules (MANDATORY)

- **`getAverages()` is a pure function** in `calculations.ts` -- takes `Entry[]` and `number`, returns `{ calories, sugar }`. No side effects, no state, no imports from context or services.
- **InsightsPanel owns its own `period` state** -- this is component-local UI state, not global. It does NOT go into EntriesContext. React `useState` is correct.
- **InsightsPanel receives `entries` as a prop** -- it does NOT call `useEntries()` directly. The parent (App.tsx) passes entries down.
- **PillSelector is a controlled component** -- selected period is a prop, not internal state. InsightsPanel manages the state and passes it down.
- **Tailwind only** -- no custom CSS, no inline style objects.
- **No `any` types** -- `InsightPeriod` is already typed as `1 | 3 | 7 | 30 | 90` in `src/types.ts`. Use it.
- **No new dependencies** -- everything needed is already in place.
- **`InsightPeriod` is already in `src/types.ts`** -- do NOT redefine it locally in components.
- **No `console.log`** -- remove before commit.

### Implementation Guide: `getAverages()` in `calculations.ts`

```typescript
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
```

**Why `setHours(0, 0, 0, 0)`:** Sets cutoff to midnight at start of local day. An entry logged at 11:59 PM (days-1) days ago is included; an entry from earlier (days) days ago is excluded. Uses local time, matching `toDateString()` convention in `getTodayEntries` and `getStreak`.

**Why divide by `days` not by `days-with-entries`:** Per AC #2. A user who logged 3 days out of 7 should see a 7-day average, not a 3-day average. Empty days count as zero contribution to the total.

**Why no rounding in `getAverages()`:** The function returns raw floats. The component (`InsightsPanel`) handles display formatting with `Math.round()`. Pure functions should not make presentation decisions.

**Why `isNaN(d.getTime())` guard:** Matches the defensive pattern established in `getTodayEntries` and `getStreak`. Invalid timestamps are silently excluded.

### Implementation Guide: `PillSelector.tsx`

```tsx
import type { InsightPeriod } from '../types';

const PERIODS: InsightPeriod[] = [1, 3, 7, 30, 90];
const LABELS: Record<InsightPeriod, string> = { 1: '1d', 3: '3d', 7: '7d', 30: '30d', 90: '90d' };

interface PillSelectorProps {
  selected: InsightPeriod;
  onChange: (period: InsightPeriod) => void;
}

export function PillSelector({ selected, onChange }: PillSelectorProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      onChange(PERIODS[(index + 1) % PERIODS.length]);
    } else if (e.key === 'ArrowLeft') {
      onChange(PERIODS[(index - 1 + PERIODS.length) % PERIODS.length]);
    }
  };

  return (
    <div role="tablist" aria-label="Insight period" className="flex gap-2">
      {PERIODS.map((period, index) => (
        <button
          key={period}
          role="tab"
          aria-selected={period === selected}
          onClick={() => onChange(period)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`flex-1 py-1 rounded-pill text-button font-semibold border transition-colors ${
            period === selected
              ? 'bg-rose-blush border-soft-terracotta text-soft-terracotta'
              : 'bg-transparent border-sand-mist text-warm-stone'
          }`}
        >
          {LABELS[period]}
        </button>
      ))}
    </div>
  );
}
```

**Why `role="tablist"` / `role="tab"`:** Per UX spec and AC #6. ARIA tab pattern for pill selectors is the accessible standard. `aria-selected` on each tab communicates current selection to screen readers.

**Why `aria-label="Insight period"` on tablist:** The tablist needs a label for screen readers to identify the group. Without it, screen readers just say "tab list" with no context.

**Why `flex-1`:** Makes all 5 pills share equal width within the row. More touch-friendly and visually consistent than intrinsic sizing.

**Why `ArrowLeft` wraps: `(index - 1 + PERIODS.length) % PERIODS.length`:** Prevents negative modulo giving negative index. Standard circular navigation pattern.

**Why `transition-colors`:** Matches UX spec "Pill switched: Active pill highlight swaps, values update -- Instant (< 100ms)". The transition is CSS-driven and fast, not a React loading state.

### Implementation Guide: `InsightsPanel.tsx`

```tsx
import { useState } from 'react';
import type { Entry, InsightPeriod } from '../types';
import { getAverages } from '../utils/calculations';
import { PillSelector } from './PillSelector';

const DEFAULT_PERIOD: InsightPeriod = 3;

interface InsightsPanelProps {
  entries: Entry[];
}

export function InsightsPanel({ entries }: InsightsPanelProps) {
  const [period, setPeriod] = useState<InsightPeriod>(DEFAULT_PERIOD);
  const averages = getAverages(entries, period);
  const hasEntries = entries.length > 0;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-warm-linen border-t border-sand-mist">
      <div className="max-w-[480px] mx-auto px-6 py-4 flex flex-col gap-3">
        <PillSelector selected={period} onChange={setPeriod} />
        {hasEntries ? (
          <div className="flex gap-8" aria-live="polite">
            <div>
              <p className="text-section-label text-warm-stone">Avg daily calories</p>
              <p className="text-entry-value font-medium text-espresso">
                {Math.round(averages.calories)} kcal
              </p>
            </div>
            <div>
              <p className="text-section-label text-warm-stone">Avg daily sugar</p>
              <p className="text-entry-value font-medium text-espresso">
                {Math.round(averages.sugar)} g
              </p>
            </div>
          </div>
        ) : (
          <p aria-live="polite" className="text-dusty-tan text-center text-sm">
            Insights will appear after your first entry
          </p>
        )}
      </div>
    </div>
  );
}
```

**Why `fixed bottom-0 inset-x-0`:** Pins the panel to the bottom of the viewport, full width. `inset-x-0` sets left:0 and right:0 simultaneously.

**Why `max-w-[480px] mx-auto`:** Matches the 480px max-width cap from the architecture. The panel background spans full viewport width (Warm Linen edge-to-edge) while content is centred and capped.

**Why `DEFAULT_PERIOD = 3` as module-level constant:** Per FR14, default is 3d every session. Module-level constant (SCREAMING_SNAKE_CASE not required for non-exported values, `DEFAULT_PERIOD` is fine) makes the value obvious and changeable.

**Why `useState` (not context):** The selected period is purely local UI state with no effect on other components. Putting it in EntriesContext would be over-engineering. React `useState` is exactly right here.

**Why `PillSelector` always renders (even in empty state):** Per AC #18, pills are visible and interactive even with no entries. The empty state message appears below the PillSelector, not in place of it.

**Why `aria-live="polite"`:** Values update when period changes. Screen readers need to announce the new values. `polite` waits for the user to finish their current interaction, which is appropriate for non-critical updates.

**Why `Math.round()` in display:** Averages are floats (e.g., 1500/3 = 500, 1500/7 = 214.28...). Displaying `214` kcal is clean and sufficient for the app's intent. `Math.round()` handles this.

### Implementation Guide: Updated `FAB.tsx`

```tsx
interface FABProps {
  onClick: () => void;
  bottomClass?: string;
}

export function FAB({ onClick, bottomClass = 'bottom-6' }: FABProps) {
  return (
    <button
      type="button"
      aria-label="Add entry"
      onClick={onClick}
      className={`fixed ${bottomClass} right-6 w-14 h-14 rounded-full bg-soft-terracotta text-cream flex items-center justify-center text-2xl hover:bg-deep-terracotta hover:scale-[1.08] active:scale-[0.97] transition-all duration-150 ease-out`}
    >
      <span aria-hidden="true" className="leading-none">+</span>
    </button>
  );
}
```

**Why `bottomClass` not `bottomOffset`:** Tailwind is utility-class based. Accepting a string class (e.g., `'bottom-[148px]'`) is idiomatic and lets App.tsx control positioning declaratively without converting numbers to Tailwind syntax in JS.

**Why `bottomClass = 'bottom-6'` default:** Preserves existing behaviour for all current tests and renders. No regression.

### Implementation Guide: `App.tsx` Changes

```tsx
// Add to imports
import { InsightsPanel } from './components/InsightsPanel';

// In AppContent return JSX -- InsightsPanel placed OUTSIDE main, BEFORE EntrySheet
// Both InsightsPanel and main get inert when sheet is open
return (
  <>
    <main
      className="max-w-[480px] mx-auto px-6 md:px-8 flex flex-col gap-6 pt-6 pb-[180px]"
      inert={isSheetOpen ? true : undefined}
    >
      <DateStreakRow streak={streak} />
      <div className="grid grid-cols-2 gap-4">
        <StatCard ... />
        <StatCard ... />
      </div>
      {storageStatus !== 'available' && (...)}
      {todayEntries.length > 0 && <ul>...</ul>}
      <FAB onClick={handleOpenSheet} bottomClass="bottom-[148px]" />
    </main>
    <InsightsPanel
      entries={entries}
      inert={isSheetOpen ? true : undefined}
    />
    <EntrySheet ... />
  </>
);
```

**Why `InsightsPanel` is OUTSIDE `<main>`:** InsightsPanel is `position: fixed` so it renders at the bottom of the viewport regardless of DOM position. However, placing it outside main means it won't inherit `inert` from main. We apply `inert` to InsightsPanel separately. This is cleaner than wrapping both main and InsightsPanel in another div.

**Why `inert` on both main and InsightsPanel:** When the EntrySheet is open, both the main content and the InsightsPanel should be inert (no tab stops, no click targets) per the focus trap requirement. EntrySheet already handles focus trapping; these inert attributes prevent users from interacting with background content.

**Why `pb-[180px]` on main:** Ensures the bottom of the entry list doesn't hide behind InsightsPanel (~120px) + gap. 180px provides sufficient clearance for both InsightsPanel and comfortable scrolling.

**Why `bottomClass="bottom-[148px]"` for FAB:** InsightsPanel height is approximately 120px (py-4=32px + gap-3=12px + PillSelector=36px + values row=44px). FAB at 24px above InsightsPanel = 120+24 = 144px, rounded to 148px for visual comfort.

**Important:** `inert` on InsightsPanel requires that the InsightsPanel component's root div passes through HTML attributes. The `InsightsPanel` component's outer div will receive `inert` as an HTML attribute automatically when App.tsx passes it -- React forwards unknown DOM attributes on native elements. No special prop handling needed in InsightsPanel component itself.

### Implementation Guide: Key Test Patterns

**`getAverages` tests (add to `calculations.test.ts`):**

```typescript
describe('getAverages()', () => {
  it('returns zeros for empty entries', () => {
    expect(getAverages([], 7)).toEqual({ calories: 0, sugar: 0 });
  });

  it('returns zeros for days <= 0', () => {
    expect(getAverages([makeEntry({ calories: 300, sugar: 10 })], 0)).toEqual({ calories: 0, sugar: 0 });
  });

  it('returns exact average for single entry today with days=1', () => {
    expect(getAverages([makeEntry({ calories: 300, sugar: 10 })], 1)).toEqual({ calories: 300, sugar: 10 });
  });

  it('divides by days not by days-with-entries (days=3, entries only today)', () => {
    const result = getAverages([makeEntry({ calories: 900, sugar: 30 })], 3);
    expect(result.calories).toBeCloseTo(300);  // 900/3, not 900/1
    expect(result.sugar).toBeCloseTo(10);       // 30/3, not 30/1
  });

  it('divides by full period even when period exceeds data range', () => {
    const result = getAverages([makeEntry({ calories: 700, sugar: 14 })], 7);
    expect(result.calories).toBeCloseTo(100);  // 700/7
    expect(result.sugar).toBeCloseTo(2);        // 14/7
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
      makeEntry({ calories: 400, sugar: 10 }),                         // today -- included
      makeEntry({ calories: 999, sugar: 99, timestamp: daysAgoISO(7) }), // outside 3d -- excluded
    ];
    const result = getAverages(entries, 3);
    expect(result.calories).toBeCloseTo(400 / 3);
    expect(result.sugar).toBeCloseTo(10 / 3);
  });

  it('includes entry exactly at period boundary ((days-1) days ago)', () => {
    const entries = [
      makeEntry({ calories: 300, sugar: 6, timestamp: daysAgoISO(2) }), // exactly at 3d boundary
    ];
    const result = getAverages(entries, 3);
    expect(result.calories).toBeCloseTo(300 / 3);
  });

  it('silently ignores entries with invalid timestamps', () => {
    const entries = [
      makeEntry({ timestamp: 'not-a-date', calories: 999, sugar: 99 }),
    ];
    expect(getAverages(entries, 3)).toEqual({ calories: 0, sugar: 0 });
  });
});
```

**PillSelector tests (`PillSelector.test.tsx`):**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PillSelector } from './PillSelector';
import type { InsightPeriod } from '../types';

describe('PillSelector', () => {
  it('renders all 5 period labels', () => {
    const onChange = vi.fn();
    render(<PillSelector selected={3} onChange={onChange} />);
    expect(screen.getByText('1d')).toBeInTheDocument();
    expect(screen.getByText('3d')).toBeInTheDocument();
    expect(screen.getByText('7d')).toBeInTheDocument();
    expect(screen.getByText('30d')).toBeInTheDocument();
    expect(screen.getByText('90d')).toBeInTheDocument();
  });

  it('marks selected pill with aria-selected=true', () => {
    render(<PillSelector selected={7} onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '7d' })).toHaveAttribute('aria-selected', 'true');
  });

  it('marks non-selected pills with aria-selected=false', () => {
    render(<PillSelector selected={3} onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '1d' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: '7d' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange with correct period on click', async () => {
    const onChange = vi.fn();
    render(<PillSelector selected={3} onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: '30d' }));
    expect(onChange).toHaveBeenCalledWith(30);
  });

  it('ArrowRight navigates to next pill', async () => {
    const onChange = vi.fn();
    render(<PillSelector selected={3} onChange={onChange} />);
    const tab3d = screen.getByRole('tab', { name: '3d' });
    tab3d.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('ArrowLeft wraps from first pill to last', async () => {
    const onChange = vi.fn();
    render(<PillSelector selected={1} onChange={onChange} />);
    screen.getByRole('tab', { name: '1d' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(onChange).toHaveBeenCalledWith(90);
  });
});
```

**InsightsPanel tests (`InsightsPanel.test.tsx`):**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InsightsPanel } from './InsightsPanel';
import type { Entry } from '../types';

function makeEntry(overrides: Partial<Entry> = {}): Entry {
  return {
    id: crypto.randomUUID(),
    calories: 400,
    sugar: 12,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe('InsightsPanel', () => {
  it('shows empty state message when no entries', () => {
    render(<InsightsPanel entries={[]} />);
    expect(screen.getByText('Insights will appear after your first entry')).toBeInTheDocument();
  });

  it('shows PillSelector pills in empty state', () => {
    render(<InsightsPanel entries={[]} />);
    expect(screen.getByText('3d')).toBeInTheDocument();
    expect(screen.getByText('7d')).toBeInTheDocument();
  });

  it('shows average values when entries exist', () => {
    const entries = [makeEntry({ calories: 900, sugar: 30 })];
    render(<InsightsPanel entries={entries} />);
    // Default 3d period: 900/3 = 300 kcal avg
    expect(screen.getByText('300 kcal')).toBeInTheDocument();
    expect(screen.getByText('10 g')).toBeInTheDocument();
  });

  it('updates values when pill selection changes', async () => {
    const entries = [makeEntry({ calories: 700, sugar: 14 })];
    render(<InsightsPanel entries={entries} />);
    // Default 3d: 700/3 ≈ 233 kcal
    await userEvent.click(screen.getByRole('tab', { name: '7d' }));
    // 7d: 700/7 = 100 kcal
    expect(screen.getByText('100 kcal')).toBeInTheDocument();
  });

  it('values container has aria-live polite', () => {
    const entries = [makeEntry()];
    render(<InsightsPanel entries={entries} />);
    const liveRegion = screen.getByText(/kcal/).closest('[aria-live]');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });
});
```

### Design System Token Reference

| Token | Tailwind class | Value | Source |
| --- | --- | --- | --- |
| Rose Blush | `bg-rose-blush` | #F0DDD6 | `index.css --color-rose-blush` |
| Soft Terracotta | `border-soft-terracotta`, `text-soft-terracotta` | #C4856C | `index.css --color-soft-terracotta` |
| Sand Mist | `border-sand-mist` | #E8DFD3 | `index.css --color-sand-mist` |
| Warm Stone | `text-warm-stone` | #8C7E6F | `index.css --color-warm-stone` |
| Warm Linen | `bg-warm-linen` | #F3EDE4 | `index.css --color-warm-linen` |
| Dusty Tan | `text-dusty-tan` | #B5A898 | `index.css --color-dusty-tan` |
| Espresso | `text-espresso` | #3D3229 | `index.css --color-espresso` |
| Button size | `text-button` | 1rem (16px) / line-height 1 | `index.css --font-size-button` |
| Section label | `text-section-label` | 0.875rem (14px) / lh 1.3 | `index.css --font-size-section-label` |
| Entry value | `text-entry-value` | 1.125rem (18px) / lh 1.4 | `index.css --font-size-entry-value` |
| Pill shape | `rounded-pill` | 9999px | `index.css --radius-pill` |

**All tokens already defined in `index.css` -- no new tokens needed for this story.**

### Previous Story Intelligence (Stories 2.1-3.1 Learnings)

1. **`vi.clearAllMocks()` in `beforeEach`** -- prevents cross-test mock contamination. Already in `App.test.tsx`. Apply same pattern in new test files.
2. **rAF mock in `App.test.tsx`** -- required for StatCard count-up animation in tests. Already present, do not remove.
3. **`makeEntry()` helper** -- already in `calculations.test.ts`. Create a local version in `InsightsPanel.test.tsx` (co-located, not a shared utility -- no barrel re-exports).
4. **`daysAgoISO(n)` helper** -- already in `calculations.test.ts`. Reuse in `getAverages` tests.
5. **Fake timers in `DateStreakRow.test.tsx`** -- only needed for date-sensitive tests. `InsightsPanel` and `PillSelector` tests do not need fake timers.
6. **StorageService mock pattern** -- `App.test.tsx` already mocks `storageService.loadEntries`. For InsightsPanel integration tests in `App.test.tsx`, use the same mock pattern to provide test entries.
7. **Component receives data as props** -- InsightsPanel gets `entries` from App.tsx, not from `useEntries()`. Matches the architectural boundary rule.
8. **No barrel re-exports** -- import directly: `import { InsightsPanel } from './components/InsightsPanel'`.
9. **`inert` on HTML elements** -- React 18 forwards unknown DOM attributes. `inert={true}` on a native `div` works. React 19 has first-class `inert` support. The current codebase already uses `inert={isSheetOpen ? true : undefined}` on `<main>` -- follow the same pattern.
10. **`transition-colors` class** -- Tailwind utility for smooth colour transitions. Already used in `StatCard.tsx` for hover state. Safe to use in PillSelector.
11. **`userEvent` from `@testing-library/user-event`** -- used in `EntrySheet.test.tsx` for keyboard/click interactions. Use same import for PillSelector keyboard tests.
12. **Commit pattern:** `feat: insights panel with pill selector (Story 3.2)` -- conventional commits, direct to `main`.

### Git Intelligence

Recent commits (from Story 3.1 story file):
```
9aec273 feat: entries context, calculations, StatCards, DateStreakRow (Stories 2.2-2.3)
8fea68e feat: storage service and data model (Story 2.1)
c6ea5e2 review: story 1.3 done -- security headers, gitignore, story status
```

**Patterns confirmed in codebase:**
- `calculations.ts` exports pure functions, imports only `Entry` type from `../types`. `getAverages` follows same pattern.
- `DateStreakRow` receives computed data as a prop from App.tsx -- InsightsPanel also follows this prop-driven pattern.
- `App.tsx` uses fragment `<>...</>` to render siblings (main + EntrySheet). InsightsPanel slots in as another sibling.
- `index.css` already has ALL design tokens needed: `rose-blush`, `soft-terracotta`, `sand-mist`, `warm-stone`, `warm-linen`, `dusty-tan`, `section-label`, `entry-value`, `button`, `radius-pill`.
- `src/types.ts` already exports `InsightPeriod = 1 | 3 | 7 | 30 | 90` -- do not redeclare.
- FAB has `fixed bottom-6 right-6` -- this needs to change to `fixed bottom-[148px] right-6` via the new `bottomClass` prop.

### Project Structure After This Story

```
src/
  components/
    DateStreakRow.tsx               (unchanged)
    DateStreakRow.test.tsx          (unchanged)
    StatCard.tsx                   (unchanged)
    StatCard.test.tsx              (unchanged)
    EntrySheet.tsx                 (unchanged)
    EntrySheet.test.tsx            (unchanged)
    EntryCard.tsx                  (unchanged)
    EntryCard.test.tsx             (unchanged)
    FAB.tsx                        (UPDATED -- added optional bottomClass prop)
    FAB.test.tsx                   (UPDATED -- added bottomClass prop test)
    ErrorBoundary.tsx              (unchanged)
    ErrorBoundary.test.tsx         (unchanged)
    PillSelector.tsx               (NEW)
    PillSelector.test.tsx          (NEW)
    InsightsPanel.tsx              (NEW)
    InsightsPanel.test.tsx         (NEW)
  context/
    EntriesContext.tsx             (unchanged)
    EntriesContext.test.tsx        (unchanged)
  services/
    storageService.ts              (unchanged)
    storageService.test.ts         (unchanged)
  utils/
    calculations.ts                (UPDATED -- added getAverages function)
    calculations.test.ts           (UPDATED -- added getAverages tests)
  types.ts                         (unchanged -- InsightPeriod already there)
  main.tsx                         (unchanged)
  App.tsx                          (UPDATED -- InsightsPanel import + render + FAB bottomClass + pb increase)
  App.test.tsx                     (UPDATED -- InsightsPanel integration tests)
  index.css                        (unchanged -- all tokens already present)
```

**Files NOT to touch this story:**
- `src/services/storageService.ts` -- already complete
- `src/context/EntriesContext.tsx` -- already complete, no new state needed
- `src/types.ts` -- `InsightPeriod` already defined, no changes needed
- `src/index.css` -- all tokens done
- All component files except FAB -- zero modifications needed
- `vercel.json`, `vite.config.ts`, `package.json` -- no changes

**Do NOT create in this story:**
- Smart search field in EntrySheet (Story 4.1)
- Any new localStorage keys or persistence for selected period

### Project Structure Notes

- Alignment with unified project structure: all new components go in `src/components/`, tests co-located
- No conflicts or variances: InsightPeriod type already in types.ts, all Tailwind tokens already in index.css
- InsightsPanel placed outside main in JSX fragment (architectural decision for clean inert handling)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2] -- Full acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3] -- Epic objectives: Insights & Streaks
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory] -- FR12 (insight panel), FR13 (selectable periods), FR14 (default 3d), NFR2 (100ms feedback)
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] -- calculations.ts as pure utility module, component architecture
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] -- camelCase for functions, PascalCase for components, SCREAMING_SNAKE_CASE for module constants
- [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Boundaries] -- calculations.ts pure, UI components read from props
- [Source: _bmad-output/planning-artifacts/architecture.md#State Management Patterns] -- Component-local state (period) stays in component, not in context
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Flow] -- InsightsPanel re-renders calling calculations.getAverages()
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy - PillSelector] -- role="tablist"/role="tab", active/inactive states
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy - InsightsPanel] -- anatomy, sizing, accessibility, fixed bottom
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Feedback Patterns] -- Pill switched: instant, no loading state
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Accessibility] -- PillSelector keyboard nav, InsightsPanel aria-live
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Screen Layout] -- InsightsPanel pinned at bottom, FAB above it
- [Source: src/utils/calculations.ts] -- getTodayEntries/getStreak patterns (toDateString, isNaN guard)
- [Source: src/utils/calculations.test.ts] -- makeEntry, yesterdayISO, daysAgoISO helpers
- [Source: src/App.tsx] -- Current AppContent structure, inert pattern, fragment usage
- [Source: src/components/FAB.tsx] -- Current bottomClass = 'bottom-6' to update
- [Source: src/types.ts] -- InsightPeriod = 1 | 3 | 7 | 30 | 90 already defined
- [Source: src/index.css] -- All design tokens confirmed present
- [Source: _bmad-output/implementation-artifacts/3-1-streak-calculation-display.md] -- Previous story learnings, 128 baseline tests

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — implementation completed cleanly. One fix during test run: `@testing-library/user-event` not installed; replaced all `userEvent` calls with `fireEvent` in PillSelector.test.tsx and InsightsPanel.test.tsx. Also corrected App.test.tsx button count: pills use `role="tab"` not `role="button"`, so count stays 3.

### Completion Notes List

1. **`getAverages()` pure function** — Added to `calculations.ts`. Uses `setHours(0,0,0,0)` cutoff for local timezone day boundaries. Divides total by `days` (not days-with-entries). Same `isNaN` defensive guard as `getTodayEntries`/`getStreak`. 10 unit tests added covering: empty, days=0, days=1, divides-by-days (not days-with-entries), period-exceeds-data, multi-day, boundary inclusion/exclusion, invalid timestamps, negative corrections.
2. **`PillSelector` component** — New component in `src/components/PillSelector.tsx`. Controlled: `selected: InsightPeriod` + `onChange` props. `role="tablist"` / `role="tab"` ARIA pattern. ArrowLeft/ArrowRight keyboard navigation with wraparound. Active pill: `bg-rose-blush border-soft-terracotta text-soft-terracotta`. 12 tests covering render, ARIA, clicks, keyboard navigation (wrapping in both directions).
3. **`InsightsPanel` component** — New component in `src/components/InsightsPanel.tsx`. Local `period` state (default 3d per FR14). Fixed bottom panel (`fixed bottom-0 inset-x-0`). Empty state: "Insights will appear after your first entry" with `aria-live="polite"`. Values display: `Math.round()` avg kcal/g with `aria-live="polite"` on wrapper. PillSelector always visible. Accepts `inert` prop for focus-trap integration. 11 tests.
4. **`FAB.tsx` updated** — Added optional `bottomClass?: string` (default `'bottom-6'`). Backwards-compatible: all existing tests pass unchanged. 2 new tests.
5. **`App.tsx` updated** — Imports InsightsPanel, renders it after `<main>` as a sibling with `inert` passthrough. FAB gets `bottomClass="bottom-[148px]"` to clear InsightsPanel. main gets `pb-[180px]` for scroll clearance.
6. **`App.test.tsx` updated** — 3 new InsightsPanel integration tests. Button count test updated (pills are tabs, not buttons — stays at 3). All 23 App tests pass.
7. **Final test count: 166** — 128 baseline + 10 getAverages + 12 PillSelector + 11 InsightsPanel + 2 FAB + 3 App = 166. All 12 test files pass, zero regressions.

### File List

- `src/utils/calculations.ts` — UPDATED: added `getAverages()` pure function
- `src/utils/calculations.test.ts` — UPDATED: added `getAverages()` import and 10 tests
- `src/components/PillSelector.tsx` — NEW: pill tab selector with ARIA + keyboard navigation
- `src/components/PillSelector.test.tsx` — NEW: 12 tests for PillSelector
- `src/components/InsightsPanel.tsx` — NEW: fixed-bottom insights panel with PillSelector + averages
- `src/components/InsightsPanel.test.tsx` — NEW: 11 tests for InsightsPanel
- `src/components/FAB.tsx` — UPDATED: added optional `bottomClass` prop (default `'bottom-6'`)
- `src/components/FAB.test.tsx` — UPDATED: added 2 tests for bottomClass prop
- `src/App.tsx` — UPDATED: InsightsPanel wired with entries + inert, FAB repositioned, pb increased
- `src/App.test.tsx` — UPDATED: 3 new InsightsPanel tests, button count test corrected
- `_bmad-output/implementation-artifacts/3-2-insights-panel-with-pill-selector.md` — story file (tasks [x], Dev Agent Record populated)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story status updated to `review`

## Senior Developer Review (AI)

### Reviewer

claude-opus-4-6 (adversarial code review, 2026-03-06)

### Issues Found and Resolved

| ID | Severity | Finding | Resolution |
|----|----------|---------|------------|
| M1 | Medium | PillSelector missing roving `tabIndex` — all pills had implicit `tabIndex=0`, keyboard focus management incomplete (WAI-ARIA Tabs Pattern requires `tabIndex=0` on active, `-1` on inactive) | Added `tabIndex={period === selected ? 0 : -1}` to each button; added `useRef` array + `.focus()` call on arrow navigation |
| M2 | Medium | FAB missing `z-index` — rendered without `z-10`, could be painted under InsightsPanel as panel heights evolve | Added `z-10` to FAB className |
| L1 | Low | PillSelector `transition-colors` had no explicit duration — browser default (300ms) violated NFR2 (< 100ms switch feel) | Added `duration-100` to transition utility classes |
| L2 | Low | `InsightsPanel` `inert` prop typed as `true \| undefined` (unconventional) | Changed to `boolean` |
| L3 | Low | Arrow key navigation called `onChange` but did not move DOM focus — screen reader / keyboard users stay on original element | Added `tabRefs.current[targetIndex]?.focus()` after `onChange` call |

### Tests Updated

- `src/components/PillSelector.test.tsx` — rewritten with `fireEvent` (no `userEvent` installed); added tabIndex assertions, DOM focus checks (`document.activeElement`), and `duration-100` class test. Total: 17 tests.
- `src/components/FAB.test.tsx` — updated positioning test to assert `z-10`.

### Final Verification

All 171 tests pass (12 test files). Zero regressions. All HIGH/MEDIUM issues resolved. All 19 ACs implemented.

### Review Outcome

**APPROVED — Story 3.2 complete.**
