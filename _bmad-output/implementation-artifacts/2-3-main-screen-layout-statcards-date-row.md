# Story 2.3: Main Screen Layout, StatCards & Date Row

Status: done

## Story

As a user,
I want to see today's date and my running daily totals for calories and sugar prominently displayed when I open the app,
so that I immediately know where I stand for the day without any interaction.

## Acceptance Criteria

1. **Given** the app is opened in a browser, **When** the main screen renders, **Then** `DateStreakRow` displays the current date in the format "Thursday, March 6" (using `toLocaleDateString()`) aligned left (streak will be added in Epic 3).
2. Two `StatCard` components are displayed side-by-side below the date: one for calories (kcal) and one for sugar (g).
3. Each StatCard shows: a label (Section Label style, 14px/600), a value (32-40px Bold), and a unit.
4. StatCards have Warm Linen background, 16px border-radius, 16px gap between them, equal width.
5. StatCards are tappable with `role="button"`, `aria-label` (e.g. "Add entry. Today's calories: 1420 kcal"), keyboard focusable, Enter/Space activates.
6. StatCard hover/active state transitions to Rose Blush background.
7. The layout is single column, max-width 480px centred on desktop, full width on mobile with 24px horizontal padding (32px on tablet+).
8. All tap targets meet 44x44px minimum (NFR9).
9. **Given** the user has no entries for today (zero state), **When** the main screen renders, **Then** StatCard values display `0` in Dusty Tan colour instead of Espresso, the screen is clean with no onboarding/prompts/instruction text (FR23, FR24), and the entire product is on a single screen with no navigation elements (FR10).
10. **Given** the user has existing entries for today in localStorage, **When** the app loads, **Then** StatCards display the correct running daily totals in Espresso colour, loaded automatically from localStorage (FR7, FR21).

## Tasks / Subtasks

- [x] Task 1: Delete `src/components/.gitkeep` (AC: setup)
- [x] Task 2: Create `src/components/DateStreakRow.tsx` (AC: #1)
  - [x] Format date with `new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })` → "Thursday, March 6"
  - [x] Render inside `<time>` element with `dateTime={new Date().toISOString().split('T')[0]}`
  - [x] Flex row layout: date left-aligned, right side empty (streak placeholder for Story 3.1)
  - [x] No streak display in this story — do NOT add any streak-related code
- [x] Task 3: Create `src/components/DateStreakRow.test.tsx` (AC: #1)
  - [x] Test: renders a `<time>` element
  - [x] Test: `<time>` has a valid `dateTime` attribute in YYYY-MM-DD format
  - [x] Test: displayed text matches "Weekday, Month Day" pattern (use `vi.setSystemTime` to fix date)
- [x] Task 4: Create `src/components/StatCard.tsx` (AC: #2, #3, #4, #5, #6, #8, #9, #10)
  - [x] Props interface: `label: string`, `value: number`, `unit: string`, `onClick: () => void`, `ariaLabel: string`
  - [x] Root element: `<div role="button" tabIndex={0} aria-label={ariaLabel}>`
  - [x] `onKeyDown` handler: call `onClick()` and `e.preventDefault()` on Enter or Space
  - [x] Value colour: `text-dusty-tan` when `value === 0`, `text-espresso` when `value !== 0`
  - [x] Background: `bg-warm-linen`, `rounded-lg` (maps to `--radius-lg: 16px`)
  - [x] Hover/active: `hover:bg-rose-blush active:bg-rose-blush` with `transition-colors`
  - [x] Label: `text-section-label font-semibold text-warm-stone` (14px/600)
  - [x] Value: `text-[2.25rem] font-bold leading-none` (36px, within the 32-40px range)
  - [x] Unit: `text-section-label text-warm-stone` (14px)
  - [x] Min touch target: `min-h-[44px]` + `p-4` to ensure 44px+ height (NFR9)
  - [x] `cursor-pointer` for pointer cursor on hover
- [x] Task 5: Create `src/components/StatCard.test.tsx` (AC: #2-#10)
  - [x] Test: renders label, value, and unit text
  - [x] Test: `role="button"` is set
  - [x] Test: `aria-label` prop is applied
  - [x] Test: value `0` renders with `text-dusty-tan` class
  - [x] Test: non-zero positive value renders with `text-espresso` class
  - [x] Test: negative value renders with `text-espresso` class (negative totals are valid via FR6)
  - [x] Test: `onClick` called when clicked
  - [x] Test: `onClick` called when Enter key is pressed
  - [x] Test: `onClick` called when Space key is pressed
  - [x] Test: `tabIndex={0}` is set (keyboard focusable)
- [x] Task 6: Update `src/App.tsx` (AC: #2, #7, #9, #10)
  - [x] Import `EntriesProvider` and `useEntries` from context
  - [x] Import `getDailyTotal` from `../utils/calculations`
  - [x] Import `StatCard` from `./components/StatCard`
  - [x] Import `DateStreakRow` from `./components/DateStreakRow`
  - [x] Create inner `AppContent` function component (uses `useEntries()` which must be inside `EntriesProvider`)
  - [x] In `AppContent`: call `useEntries()`, compute `getDailyTotal(entries)`, render layout
  - [x] Layout in `AppContent`: `<main className="max-w-[480px] mx-auto px-6 md:px-8 flex flex-col gap-6 pt-6">`
  - [x] Render `<DateStreakRow />` then `<div className="grid grid-cols-2 gap-4">` with two `StatCard`s
  - [x] Calories StatCard with correct props and no-op onClick
  - [x] Sugar StatCard with correct props and no-op onClick
  - [x] Wrap `AppContent` with `EntriesProvider` in the default `App` export
  - [x] Remove the old `<h1>calorie-sugar-tracker</h1>` placeholder
- [x] Task 7: Update `src/App.test.tsx` (AC: #2, #7, #9, #10)
  - [x] Add `vi.mock('./services/storageService')` at top
  - [x] Add `beforeEach`: mock `loadEntries` to return `{ entries: [], status: 'available' }` by default
  - [x] Test: `<main>` element renders with correct layout classes
  - [x] Test: two elements with `role="button"` render (the two StatCards)
  - [x] Test: "Calories" and "Sugar" labels are present
  - [x] Test: zero state — both values display "0"
  - [x] Test: with entries — StatCards show correct daily totals
  - [x] Test: `<time>` element is present (DateStreakRow rendered)
- [x] Task 8: Run `npm test` — 67/67 tests passing, zero regressions, lint clean

## Dev Notes

### What This Story Delivers

This is the first story that produces visible UI. It wires the `EntriesProvider` into `App`, renders `DateStreakRow` and two `StatCard` components, and connects them to live data from `EntriesContext` + `calculations.ts`.

After this story, a user who opens the app will see:
- Today's date (e.g. "Thursday, March 6") at the top
- Two tappable stat cards showing today's running calorie and sugar totals (both 0 on first visit)
- Correct totals if entries already exist in localStorage

No entry logging UI yet — that is Story 2.4 (EntrySheet). The StatCard `onClick` is a no-op in this story.

### Current Project State (after Stories 1.1, 1.2, 1.3, 2.1, 2.2)

```
src/
  main.tsx                          ✅ React entry point
  App.tsx                           ← UPDATE THIS STORY (currently bare layout shell with h1)
  App.test.tsx                      ← UPDATE THIS STORY (currently 2 placeholder tests)
  index.css                         ✅ Tailwind v4 design tokens + Google Fonts
  types.ts                          ✅ Entry, InsightPeriod, StorageStatus
  test-setup.ts                     ✅ imports @testing-library/jest-dom
  components/.gitkeep               ← DELETE when creating components
  services/storageService.ts        ✅ DONE (Story 2.1)
  services/storageService.test.ts   ✅ 17 tests passing
  utils/calculations.ts             ✅ DONE (Story 2.2) — getTodayEntries, getDailyTotal
  utils/calculations.test.ts        ✅ tests passing
  context/EntriesContext.tsx        ✅ DONE (Story 2.2) — EntriesProvider, useEntries
  context/EntriesContext.test.tsx   ✅ tests passing
```

**Current `src/App.tsx` (replace this entirely):**
```tsx
function App() {
  return (
    <main className="max-w-[480px] mx-auto px-6 md:px-8">
      <h1 className="text-espresso font-sans">calorie-sugar-tracker</h1>
    </main>
  )
}
export default App
```

**Current `src/App.test.tsx` tests to update:**
- Test 1 checks `<main>` with class `max-w-[480px] mx-auto px-6 md:px-8` — this class must be preserved on the `<main>` element
- Test 2 checks for "calorie-sugar-tracker" h1 text — this placeholder is removed in this story, so this test must be replaced

### Architecture Compliance Rules (MANDATORY)

- **`storageService.ts` is the sole localStorage gateway** — `EntriesContext` calls it; `App.tsx` and components NEVER call `localStorage` directly.
- **No derived data in context** — `EntriesContext` stores only `entries[]` and `storageStatus`. Call `getDailyTotal(entries)` in `AppContent`, not inside context.
- **No state mutation** — context already enforces this; do not add any state mutations in components.
- **No `any` types** — type all props explicitly.
- **No `console.log`** — remove before commit.
- **Tailwind only** — no custom CSS classes, no CSS modules, no inline style objects (exception: truly arbitrary values use `[...]` syntax, e.g. `text-[2.25rem]`).
- **`useEntries` must be called inside `EntriesProvider`** — this is why `AppContent` is a separate component inside App.
- **`getDailyTotal` must be called in the component that has context access, NOT inside `StatCard`** — `StatCard` is a pure presentational component receiving `value` as a prop.
- **StatCard `onClick` is a no-op `() => {}` in this story** — do NOT add EntrySheet logic yet (Story 2.4).
- **No `ErrorBoundary` yet** — that is Story 2.6. Do not add it in this story.
- **No storage-unavailable message yet** — that is Story 2.6.

### Design System Token Reference

All design tokens are defined in `src/index.css` under `@theme`. In Tailwind v4, these map directly to utility classes:

| Token | CSS variable | Tailwind class |
| --- | --- | --- |
| Cream | `--color-cream` | `bg-cream`, `text-cream` |
| Warm Linen | `--color-warm-linen` | `bg-warm-linen` |
| Sand Mist | `--color-sand-mist` | `bg-sand-mist`, `border-sand-mist` |
| Espresso | `--color-espresso` | `text-espresso` |
| Warm Stone | `--color-warm-stone` | `text-warm-stone` |
| Dusty Tan | `--color-dusty-tan` | `text-dusty-tan` |
| Soft Terracotta | `--color-soft-terracotta` | `text-soft-terracotta`, `bg-soft-terracotta` |
| Rose Blush | `--color-rose-blush` | `bg-rose-blush` |
| Radius sm | `--radius-sm: 8px` | `rounded-sm` |
| Radius md | `--radius-md: 12px` | `rounded-md` |
| Radius lg | `--radius-lg: 16px` | `rounded-lg` |
| Section Label | `--font-size-section-label: 0.875rem` | `text-section-label` |
| Plus Jakarta Sans | `--font-sans` | `font-sans` |

**Standard Tailwind spacing used (not custom tokens):**
- `px-6` = 24px horizontal padding (mobile)
- `md:px-8` = 32px horizontal padding (tablet+)
- `gap-4` = 16px gap (between StatCards)
- `p-4` = 16px padding (StatCard internal)
- `pt-6` = 24px top padding
- `gap-6` = 24px gap (between layout rows)

### Implementation Guide: `DateStreakRow.tsx`

```tsx
// src/components/DateStreakRow.tsx

export function DateStreakRow() {
  const now = new Date();
  const dateTimeAttr = now.toISOString().split('T')[0]; // "2026-03-06"
  const displayDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }); // "Thursday, March 6"

  return (
    <div className="flex items-center justify-between">
      <time dateTime={dateTimeAttr} className="text-espresso font-sans text-section-label font-medium">
        {displayDate}
      </time>
      {/* Streak counter will be added in Story 3.1 — do not add anything here */}
    </div>
  );
}
```

**Why `toLocaleDateString('en-US', ...)`:** The AC specifies the format "Thursday, March 6". The explicit `'en-US'` locale ensures consistent output regardless of the user's system locale. This is intentional: the app currently supports English only.

**Why `<time>` with `dateTime`:** Semantic HTML for accessibility. Screen readers can parse machine-readable dates. The Story 3.1 acceptance criteria explicitly references `<time>` in `DateStreakRow` — adding it now avoids a regression fix later.

### Implementation Guide: `StatCard.tsx`

```tsx
// src/components/StatCard.tsx
import type { KeyboardEvent } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  onClick: () => void;
  ariaLabel: string;
}

export function StatCard({ label, value, unit, onClick, ariaLabel }: StatCardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const valueColour = value === 0 ? 'text-dusty-tan' : 'text-espresso';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`
        bg-warm-linen rounded-lg p-4 min-h-[44px]
        flex flex-col gap-1
        cursor-pointer transition-colors
        hover:bg-rose-blush active:bg-rose-blush
        focus-visible:outline-none
      `}
    >
      <span className="text-section-label font-semibold text-warm-stone uppercase tracking-wide">
        {label}
      </span>
      <span className={`text-[2.25rem] font-bold leading-none ${valueColour}`}>
        {value}
      </span>
      <span className="text-section-label text-warm-stone">
        {unit}
      </span>
    </div>
  );
}
```

**Why `value === 0` (strict equality) for colour:** Zero means no entries today. Any non-zero value (including negative from correcting entries per FR6) means data exists, so Espresso is correct.

**Why `e.preventDefault()` on Space:** The browser default for Space on a div with role="button" may scroll the page. Preventing default ensures the click handler fires cleanly.

**Why `focus-visible:outline-none`:** The global `*:focus-visible` rule in `index.css` already applies the 2px Soft Terracotta outline. We don't need to override it — the global rule handles focus indicators. If needed, add `focus-visible:ring-2 focus-visible:ring-soft-terracotta` instead.

**Note on `text-[2.25rem]`:** The UX spec says 32-40px Bold. 2.25rem = 36px, within range. Using an arbitrary value is correct here because the design system doesn't define a token for this exact size (the nearest token is `--font-size-hero-total: 3rem` = 48px, which is too large).

### Implementation Guide: `App.tsx` (full replacement)

```tsx
// src/App.tsx
import { EntriesProvider, useEntries } from './context/EntriesContext';
import { getDailyTotal } from './utils/calculations';
import { StatCard } from './components/StatCard';
import { DateStreakRow } from './components/DateStreakRow';

function AppContent() {
  const { entries } = useEntries();
  const dailyTotal = getDailyTotal(entries);

  const handleOpenSheet = () => {
    // EntrySheet will be implemented in Story 2.4
  };

  return (
    <main className="max-w-[480px] mx-auto px-6 md:px-8 flex flex-col gap-6 pt-6">
      <DateStreakRow />
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Calories"
          value={dailyTotal.calories}
          unit="kcal"
          onClick={handleOpenSheet}
          ariaLabel={`Add entry. Today's calories: ${dailyTotal.calories} kcal`}
        />
        <StatCard
          label="Sugar"
          value={dailyTotal.sugar}
          unit="g"
          onClick={handleOpenSheet}
          ariaLabel={`Add entry. Today's sugar: ${dailyTotal.sugar} g`}
        />
      </div>
    </main>
  );
}

function App() {
  return (
    <EntriesProvider>
      <AppContent />
    </EntriesProvider>
  );
}

export default App;
```

**Why `AppContent` is a separate function:** `useEntries()` must be called inside a component that is a descendant of `EntriesProvider`. Since `App` renders the `EntriesProvider`, it cannot itself call `useEntries()` — we need a child component to do that.

**Why `handleOpenSheet` is empty for now:** Story 2.4 implements `EntrySheet`. The handler is a no-op placeholder so the StatCard `onClick` prop is satisfied. Do NOT implement any sheet logic yet.

**Why `flex flex-col gap-6 pt-6`:** Creates vertical spacing between the date row and the stat cards. `pt-6` (24px) gives breathing room from the viewport top on mobile.

### Implementation Guide: `App.test.tsx` (full replacement)

```tsx
// src/App.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as storageService from './services/storageService';
import type { Entry } from './types';

vi.mock('./services/storageService');

const TODAY_ENTRY: Entry = {
  id: 'test-1',
  calories: 500,
  sugar: 12,
  timestamp: new Date().toISOString(), // today
};

beforeEach(() => {
  vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [], status: 'available' });
  vi.mocked(storageService.saveEntries).mockReturnValue('available');
});

describe('App', () => {
  it('renders the base layout with a main element', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('max-w-[480px]', 'mx-auto', 'px-6', 'md:px-8');
  });

  it('renders the date row with a time element', () => {
    render(<App />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });

  it('renders two stat card buttons', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('renders Calories and Sugar labels', () => {
    render(<App />);
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Sugar')).toBeInTheDocument();
  });

  it('shows zero totals in zero state', () => {
    render(<App />);
    // Both stat cards show "0"
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it('shows correct totals when entries exist for today', () => {
    vi.mocked(storageService.loadEntries).mockReturnValue({
      entries: [TODAY_ENTRY],
      status: 'available',
    });
    render(<App />);
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});
```

**Why `vi.mock('./services/storageService')`:** `EntriesProvider` calls `loadEntries()` synchronously during its `useState` lazy initializer. Without mocking, the test would attempt to access real `localStorage` (which is undefined in jsdom by default without setup), causing errors or flaky behavior.

### Implementation Guide: `DateStreakRow.test.tsx`

```tsx
// src/components/DateStreakRow.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DateStreakRow } from './DateStreakRow';

describe('DateStreakRow', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a time element', () => {
    render(<DateStreakRow />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });

  it('time element has a YYYY-MM-DD dateTime attribute', () => {
    render(<DateStreakRow />);
    const timeEl = screen.getByRole('time');
    expect(timeEl.getAttribute('dateTime')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('displays date in weekday, month day format', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-06T10:00:00'));
    render(<DateStreakRow />);
    // "Thursday, March 6" — exact format from toLocaleDateString('en-US', {...})
    expect(screen.getByRole('time')).toHaveTextContent('Thursday, March 6');
    vi.useRealTimers();
  });
});
```

**Why `vi.setSystemTime`:** `DateStreakRow` calls `new Date()` internally. To test the exact output format, we pin the system time to a known date. This avoids test brittleness from the current date changing.

**Why `afterEach(() => vi.useRealTimers())`:** Restore real timers after each test to prevent side effects on other tests in the suite.

### Implementation Guide: `StatCard.test.tsx`

```tsx
// src/components/StatCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StatCard } from './StatCard';

function renderCard(overrides: Partial<{
  label: string; value: number; unit: string; onClick: () => void; ariaLabel: string
}> = {}) {
  const props = {
    label: 'Calories',
    value: 500,
    unit: 'kcal',
    onClick: vi.fn(),
    ariaLabel: 'Add entry. Today\'s calories: 500 kcal',
    ...overrides,
  };
  return { ...render(<StatCard {...props} />), onClick: props.onClick };
}

describe('StatCard', () => {
  it('renders label, value, and unit', () => {
    renderCard();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('kcal')).toBeInTheDocument();
  });

  it('has role="button"', () => {
    renderCard();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    renderCard();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Add entry. Today\'s calories: 500 kcal');
  });

  it('is keyboard focusable (tabIndex=0)', () => {
    renderCard();
    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0');
  });

  it('value 0 has text-dusty-tan class', () => {
    renderCard({ value: 0 });
    const valueEl = screen.getByText('0');
    expect(valueEl.className).toContain('text-dusty-tan');
  });

  it('positive value has text-espresso class', () => {
    renderCard({ value: 500 });
    const valueEl = screen.getByText('500');
    expect(valueEl.className).toContain('text-espresso');
  });

  it('negative value (correcting entry) has text-espresso class', () => {
    renderCard({ value: -100 });
    const valueEl = screen.getByText('-100');
    expect(valueEl.className).toContain('text-espresso');
  });

  it('calls onClick when clicked', () => {
    const { onClick } = renderCard();
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    const { onClick } = renderCard();
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    const { onClick } = renderCard();
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick for other keys', () => {
    const { onClick } = renderCard();
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' });
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

### Project Structure After This Story

```
src/
  components/
    DateStreakRow.tsx      (new)
    DateStreakRow.test.tsx (new)
    StatCard.tsx           (new)
    StatCard.test.tsx      (new)
  context/
    EntriesContext.tsx     (unchanged)
    EntriesContext.test.tsx (unchanged)
  services/
    storageService.ts      (unchanged)
    storageService.test.ts (unchanged)
  utils/
    calculations.ts        (unchanged)
    calculations.test.ts   (unchanged)
  types.ts                 (unchanged)
  main.tsx                 (unchanged)
  App.tsx                  (UPDATED — full replacement)
  App.test.tsx             (UPDATED — full replacement)
  index.css                (unchanged)
```

**Files NOT to touch this story:**
- `src/types.ts` — already complete
- `src/services/storageService.ts` — already complete
- `src/utils/calculations.ts` — already complete (do NOT add `getStreak` or `getAverages` yet — those are Stories 3.1 and 3.2)
- `src/context/EntriesContext.tsx` — already complete
- `vercel.json`, `vite.config.ts`, `package.json` — no changes needed

**Do NOT create in this story:**
- `ErrorBoundary.tsx` (Story 2.6)
- `EntrySheet.tsx` (Story 2.4)
- `EntryCard.tsx` (Story 2.5)
- `FAB.tsx` (Story 2.6)
- `InsightsPanel.tsx` (Story 3.2)
- `PillSelector.tsx` (Story 3.2)

### Previous Story Intelligence (Stories 2.1 + 2.2 Learnings)

1. **Lazy `useState` initializer** (`useState(() => loadEntries())`) was used in `EntriesContext` to avoid ESLint's `react-hooks/set-state-in-effect` rule and the extra render cycle. This is already implemented — do not change it.
2. **`vi.clearAllMocks()` in `beforeEach`** prevents cross-test mock call count accumulation. Use this pattern in all test files that use mocks.
3. **`afterEach(() => vi.restoreAllMocks())`** — safety net for tests that modify mock implementations. Add this when a test calls `mockImplementation` or `mockReturnValueOnce`.
4. **ESLint `react-refresh/only-export-components`** — if you export non-component functions from the same file as a component (like the `useEntries` hook), add `// eslint-disable-next-line react-refresh/only-export-components` before the export. For this story, `DateStreakRow` and `StatCard` each export only a single component — no issue.
5. **TypeScript version is 5.9.3** — all modern TypeScript features available.
6. **Test run command:** `npm test` runs all `*.test.ts(x)` files via Vitest.
7. **No `localStorage.clear()` needed in tests** — storage is fully mocked via `vi.mock('../services/storageService')`.
8. **Commit pattern:** `feat: <description> (Story X.Y)` — conventional commits, direct to `main`.
9. **`EntriesContext` combined state object** — `state` has `{ entries, storageStatus }`. `useEntries()` returns `{ entries, addEntry, storageStatus }`. In this story, `AppContent` only destructures `entries` from `useEntries()`.

### Git Intelligence

Recent commits:
```
8fea68e feat: storage service and data model (Story 2.1)
c6ea5e2 review: story 1.3 done — security headers, gitignore, story status
3c73eba chore: add BMAD planning artifacts and tighten security headers
ea51672 docs: add live Vercel URL to README
bc37977 feat: initial project setup - Stories 1.1, 1.2 + vercel config
```

**Note:** Story 2.2 files (`EntriesContext.tsx`, `calculations.ts`, and their tests) are implemented and present but currently untracked (not yet committed). The dev agent for this story may wish to commit Story 2.2 files before or alongside Story 2.3 work, or leave them for a combined commit. Either is fine — just run `npm test` to confirm all 48+ tests pass before committing.

**Suggested commit message:** `feat: main screen layout, StatCards, DateStreakRow (Story 2.3)`

**Active branch:** `main` only (solo developer, direct to main).

**Deployment:** Push to `main` → Vercel auto-deploys. After this story, the live app at the Vercel URL will show the actual UI for the first time — date row and stat cards visible to anyone visiting the URL.

### Key Constraints

- **`getDailyTotal` is called in `AppContent`**, not inside `StatCard`. StatCard is purely presentational — it receives `value: number` as a prop and renders it. It has no knowledge of entries or calculations.
- **`useEntries()` is only called in `AppContent`**, the component rendered inside `EntriesProvider`. Calling it in `App()` directly would throw "useEntries must be used within an EntriesProvider".
- **`getStreak` and `getAverages` do NOT exist yet** — they are added in Stories 3.1 and 3.2. Do not reference them.
- **The `storageStatus` from `useEntries()` is available** but not used in this story. The storage-unavailable message renders in Story 2.6. Just ignore `storageStatus` in `AppContent` for now.
- **`grid grid-cols-2 gap-4`** gives the two equal-width columns with 16px gap. This satisfies AC #4 ("equal width, 16px gap").
- **`rounded-lg` maps to `--radius-lg: 16px`** due to the custom `@theme` override in `index.css`. This is the correct class for 16px border radius.

### Data Flow This Story Activates

```
App mounts
  -> EntriesProvider initializes (lazy useState)
  -> storageService.loadEntries() called once
  -> entries[] hydrated from localStorage (or [] if empty)
  -> AppContent renders with entries from context
  -> getDailyTotal(entries) computed
  -> DateStreakRow renders with today's date
  -> StatCard (Calories) renders with dailyTotal.calories
  -> StatCard (Sugar) renders with dailyTotal.sugar

User clicks StatCard (Story 2.4 will activate this)
  -> handleOpenSheet() called — currently a no-op
  -> EntrySheet will open in Story 2.4
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3] — Full acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] — Component architecture table, state management pattern
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns] — Project directory layout, one component per file rule
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — PascalCase components, camelCase functions
- [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines] — Anti-patterns list
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Flow] — Full data flow diagram
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory] — UX design system tokens (colours, typography, spacing, radii)
- [Source: _bmad-output/implementation-artifacts/2-2-entries-context-calculations-engine.md#Completion Notes] — Combined state pattern, lazy useState, ESLint notes
- [Source: _bmad-output/implementation-artifacts/2-2-entries-context-calculations-engine.md#Senior Developer Review] — [M1] stale closure fix in addEntry (do not change context)

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- RED phase DateStreakRow: No file existed — 4 tests failed as expected.
- GREEN phase DateStreakRow: Component created; 3/4 tests passed immediately. One test failure: expected "Thursday, March 6" but received "Friday, March 6" — the test had a wrong day name (March 6, 2026 is actually a Friday). Fixed test assertion to "Friday, March 6" and changed mock date to explicit UTC noon (`2026-03-06T12:00:00Z`) for timezone robustness. All 4 tests green.
- RED phase StatCard: No file existed — 11 tests failed as expected.
- GREEN phase StatCard: Component created; all 11 tests passed immediately.
- RED phase App: Old App.tsx used placeholder h1; App.test.tsx had 2 tests including one checking for "calorie-sugar-tracker" text. Replaced both files entirely.
- GREEN phase App: EntriesProvider + AppContent pattern; all 6 App tests pass. storageService mocked via `vi.mock('./services/storageService')` in App.test.tsx.
- REFACTOR: Lint clean on first pass — no ESLint issues with any new file.
- Final run: 67/67 tests passing across 6 test files. Zero regressions.

### Completion Notes List

- Deleted `src/components/.gitkeep` placeholder.
- Created `src/components/DateStreakRow.tsx`: renders current date as "Friday, March 6" format using `toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })` wrapped in a `<time>` element with ISO date `dateTime` attribute. Right side of flex row left empty — streak added in Story 3.1.
- Created `src/components/DateStreakRow.test.tsx`: 4 tests — time element renders, dateTime format validated, date display format verified with `vi.setSystemTime` (using UTC noon for timezone robustness), dateTime attribute pattern test.
- Created `src/components/StatCard.tsx`: pure presentational component with `role="button"`, `tabIndex={0}`, `aria-label`, `onKeyDown` (Enter/Space → onClick), zero-state Dusty Tan vs non-zero Espresso value colour, Warm Linen background with Rose Blush hover/active, 36px bold value, 14px/600 label and unit, `min-h-[44px]` for NFR9 tap target compliance.
- Created `src/components/StatCard.test.tsx`: 11 tests — rendering, role, aria-label, tabIndex, zero/positive/negative value colours (FR6), click, Enter key, Space key, other-key no-op.
- Updated `src/App.tsx`: full replacement — `AppContent` inner component (reads `useEntries()`, computes `getDailyTotal(entries)`), renders `DateStreakRow` + two `StatCard`s in `grid grid-cols-2 gap-4`, `handleOpenSheet` no-op for Story 2.4. `App` wraps with `EntriesProvider`.
- Updated `src/App.test.tsx`: full replacement — mocks `storageService`, 6 tests covering layout, time element, button count, labels, zero state, and loaded entries state.
- All 10 ACs satisfied. 67/67 tests passing (17 storageService + 15 calculations + 14 EntriesContext + 4 DateStreakRow + 11 StatCard + 6 App). Zero regressions. Lint clean.

### File List

- `src/components/.gitkeep` (deleted)
- `src/components/DateStreakRow.tsx` (new, review-fixed: dateTime UTC bug)
- `src/components/DateStreakRow.test.tsx` (new, review-fixed: test 4 now asserts correct value)
- `src/components/StatCard.tsx` (new)
- `src/components/StatCard.test.tsx` (new)
- `src/App.tsx` (modified)
- `src/App.test.tsx` (modified, review-fixed: vi.clearAllMocks() added)

### Senior Developer Review (AI)

**Reviewer:** claude-sonnet-4-6 (adversarial review)
**Date:** 2026-03-06
**Outcome:** Approve (all HIGH and MEDIUM issues fixed automatically)
**Findings:** 1 High, 2 Medium, 3 Low — HIGH + MEDIUM fixed, LOW noted

#### Action Items

- [x] [H1] `DateStreakRow.tsx:3` — `dateTime` attribute used `toISOString().split('T')[0]` (UTC date) while `displayDate` used local timezone. Fixed: replaced with local date construction using `getFullYear()`, `getMonth()+1`, `getDate()` padded to YYYY-MM-DD. `DateStreakRow.tsx:3-4`
- [x] [M1] `DateStreakRow.test.tsx:29-36` — Test 4 was redundant with test 2 (same regex check, no actual value assertion). Fixed: now computes expected local date same way component does and verifies `toHaveAttribute('dateTime', expectedDate)`. `DateStreakRow.test.tsx:29-39`
- [x] [M2] `App.test.tsx:16-19` — Missing `vi.clearAllMocks()` in `beforeEach`. Fixed: added as first call in `beforeEach`. `App.test.tsx:17`
- [ ] [L1] `StatCard.tsx:30` — `uppercase tracking-wide` on label not in UX spec or any AC. Labels render as "CALORIES"/"SUGAR" rather than design-spec "Calories"/"Sugar". Accept or fix based on visual preference.
- [ ] [L2] `App.test.tsx:46-50` — Zero-state assertion uses `toBeGreaterThanOrEqual(2)` — overly loose. Could tighten to find specific StatCard value elements.
- [ ] [L3] `DateStreakRow.test.tsx` — Test 3's format assertion covers test 4's old weak check; now that test 4 asserts the actual value, coverage is solid. LOW remains: no test for local-date vs display-date alignment across midnight boundary (edge case).

### Change Log

- 2026-03-06: Implemented Story 2.3 — main screen layout, StatCards, DateStreakRow. Created DateStreakRow.tsx + test (4 tests), StatCard.tsx + test (11 tests). Replaced App.tsx with EntriesProvider + AppContent pattern. Replaced App.test.tsx with 6 meaningful tests. Total: 67/67 tests passing.
- 2026-03-06: Code review fixes — fixed `dateTime` UTC/local mismatch in DateStreakRow [H1]; replaced redundant dateTime test with value-asserting test [M1]; added `vi.clearAllMocks()` to App.test.tsx beforeEach [M2]. 67/67 tests passing.
