# Story 2.5: Entry History List

Status: done

## Story

As a user,
I want to see a scrollable list of all my entries for today with timestamps,
so that I can review what I've logged and see my meal-by-meal breakdown.

## Acceptance Criteria

1. **Given** the user has logged one or more entries today, **When** the main screen renders, **Then** a scrollable list of `EntryCard` components is displayed below the StatCards.
2. Each EntryCard shows: timestamp on the left (Entry Meta style, 13px/400, formatted via `toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })` e.g. "12:34 PM") and calorie + sugar values on the right (Entry Value style, 18px/500).
3. EntryCards have Warm Linen background, radius-md (12px), p-4 (16px) padding, gap-2 (8px) gap between cards.
4. The most recent entry appears at the top of the list (reverse chronological order).
5. Entries are rendered as a semantic list (`<ul>`/`<li>`) for screen reader accessibility.
6. Each entry is announced by screen readers as e.g. "12:34 PM, 620 kilocalories, 14 grams sugar" (NFR14) — achieved via `aria-label` on each `<li>`.
7. **Given** the user just logged a new entry via the EntrySheet, **When** the sheet dismisses, **Then** the new EntryCard appears at the top with a fade-in animation (~200ms ease-in); with `prefers-reduced-motion` active, the card appears instantly.
8. **Given** the user has no entries for today, **When** the main screen renders, **Then** the entry history area is empty — clean whitespace, no placeholder text or illustration.
9. **Given** the user has entries from previous days in localStorage, **When** the main screen renders, **Then** only today's entries are displayed (FR8) — previous days' entries are stored but not shown.

## Tasks / Subtasks

- [x] Task 1: Update `src/index.css` — add card-fade-in animation (AC: #7)
  - [x] Add `--animate-card-fade-in: cardFadeIn 200ms ease-in` inside the `@theme` block
  - [x] Add `@keyframes cardFadeIn { from { opacity: 0; } to { opacity: 1; } }` below the existing `@keyframes slideDown` block
  - [x] No other changes to `index.css` — all other tokens are untouched
- [x] Task 2: Create `src/components/EntryCard.tsx` (AC: #2, #3, #4, #5, #6, #7)
  - [x] Props interface: `entry: Entry` (import `Entry` from `'../types'`)
  - [x] Compute `formattedTime`: `new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })`
  - [x] Render root element as `<li>` with `aria-label={`${formattedTime}, ${entry.calories} kilocalories, ${entry.sugar} grams sugar`}`
  - [x] Apply classes on `<li>`: `flex items-center justify-between bg-warm-linen rounded-md p-4 animate-card-fade-in`
  - [x] Left side: `<time dateTime={entry.timestamp} className="text-entry-meta text-warm-stone">{formattedTime}</time>`
  - [x] Right side: `<div className="flex gap-3 text-entry-value font-medium text-espresso" aria-hidden="true">` containing `<span>{entry.calories} kcal</span>` and `<span>{entry.sugar} g</span>`
  - [x] `aria-hidden="true"` on the right-side div because the `aria-label` on `<li>` provides the full accessible description
- [x] Task 3: Create `src/components/EntryCard.test.tsx` (AC: #2, #3, #5, #6)
  - [x] Mock `storageService` at top: `vi.mock('../services/storageService')`
  - [x] `beforeEach`: `vi.clearAllMocks()`, mock `loadEntries` to return `{ entries: [], status: 'available' }`
  - [x] Define a `mockEntry: Entry` fixture with known values: `{ id: 'test-1', calories: 620, sugar: 14, timestamp: new Date('2026-03-06T12:34:00').toISOString() }`
  - [x] Render `<ul><EntryCard entry={mockEntry} /></ul>` (wrap in `<ul>` since `<li>` requires list parent)
  - [x] Test: renders an `<li>` element (`screen.getByRole('listitem')`)
  - [x] Test: time is displayed (check formatted time string present in document)
  - [x] Test: calories value is rendered (e.g. `screen.getByText(/620/)`)
  - [x] Test: sugar value is rendered (e.g. `screen.getByText(/14 g/)`)
  - [x] Test: `aria-label` contains "kilocalories" (`expect(li).toHaveAttribute('aria-label', expect.stringContaining('kilocalories'))`)
  - [x] Test: `aria-label` contains "grams sugar" (`expect(li).toHaveAttribute('aria-label', expect.stringContaining('grams sugar'))`)
  - [x] Test: `animate-card-fade-in` class is applied to the `<li>` element
- [x] Task 4: Update `src/App.tsx` — render entry history list (AC: #1, #4, #8, #9)
  - [x] Add `getTodayEntries` to import from `'./utils/calculations'` (getDailyTotal is already imported)
  - [x] Import `EntryCard` from `'./components/EntryCard'`
  - [x] In `AppContent`: compute `const todayEntries = getTodayEntries(entries)` (after `const dailyTotal = getDailyTotal(entries)`)
  - [x] Below the StatCards `<div className="grid grid-cols-2 gap-4">` in `<main>`, add the history list with conditional render and reverse-sorted entries
  - [x] The spread `[...todayEntries]` prevents mutating the original array before reversing
  - [x] No other changes to App.tsx — `isSheetOpen`, `lastFocusedRef`, `handleOpenSheet`, `handleCloseSheet`, `EntrySheet` are all unchanged
- [x] Task 5: Update `src/App.test.tsx` — add entry list tests (AC: #1, #4, #8, #9)
  - [x] Ensure rAF mock and `vi.clearAllMocks()` are still in `beforeEach` (unchanged from Story 2.4)
  - [x] Test: with no entries, no list is rendered (`screen.queryByRole('list')` returns null or list is not present)
  - [x] Test: after logging an entry, a list appears containing a listitem with the entry values
  - [x] Test: multiple entries render in reverse order (most recent first)
- [x] Task 6: Run `npm test` — all tests passing, zero regressions

## Dev Notes

### What This Story Delivers

EntryCard component and the history list display. After this story, users can:
1. Open the app and see all entries logged today in reverse chronological order
2. Glance at each entry's timestamp and the calorie/sugar values
3. See new entries appear at the top with a fade-in animation when logged via EntrySheet

**What is NOT in this story:**
- FAB (floating action button) — Story 2.6
- ErrorBoundary — Story 2.6
- Storage-unavailable message — Story 2.6
- Streak counter — Story 3.1 (DateStreakRow already renders the date, streak is added later)
- InsightsPanel / PillSelector — Story 3.2

### Current Project State (after Story 2.4)

```
src/
  main.tsx                          ✅ React entry point
  App.tsx                           <- UPDATE THIS STORY (add todayEntries, EntryCard list)
  App.test.tsx                      <- UPDATE THIS STORY (add history list tests)
  index.css                         <- UPDATE THIS STORY (add card-fade-in animation)
  types.ts                          ✅ Entry, InsightPeriod, StorageStatus
  test-setup.ts                     ✅ window.matchMedia global mock
  components/
    DateStreakRow.tsx               ✅ DONE (Story 2.3)
    DateStreakRow.test.tsx          ✅ DONE (Story 2.3)
    StatCard.tsx                   ✅ DONE (Story 2.4 — with count-up animation)
    StatCard.test.tsx              ✅ DONE (Story 2.4)
    EntrySheet.tsx                 ✅ DONE (Story 2.4)
    EntrySheet.test.tsx            ✅ DONE (Story 2.4)
    EntryCard.tsx                  <- CREATE THIS STORY
    EntryCard.test.tsx             <- CREATE THIS STORY
  services/storageService.ts        ✅ DONE (Story 2.1) — 17 tests
  utils/calculations.ts             ✅ DONE (Story 2.2) — getTodayEntries, getDailyTotal
  utils/calculations.test.ts        ✅ tests passing
  context/EntriesContext.tsx        ✅ DONE (Story 2.2) — EntriesProvider, useEntries
  context/EntriesContext.test.tsx   ✅ tests passing
```

**Test count baseline:** 87 tests passing across 7 test files (Story 2.4 final state).

### Architecture Compliance Rules (MANDATORY)

- **Read entries from `EntriesContext`** — `AppContent` already calls `useEntries()`. `todayEntries` is derived from `getTodayEntries(entries)`. `EntryCard` receives an `Entry` prop — it NEVER calls `useEntries()` or `useContext` directly.
- **`getTodayEntries` already exists** in `src/utils/calculations.ts` — do NOT reimplement it. Import and use it.
- **No derived data in context** — `todayEntries` is computed in `AppContent`, not stored in `EntriesContext`.
- **`storageService.ts` is the sole localStorage gateway** — `EntryCard` never touches localStorage. It is a pure display component.
- **No `any` types** — type all props explicitly.
- **No `console.log`** — remove before commit.
- **Tailwind only** — no custom CSS classes, no inline style objects.
- **Do NOT modify `calculations.ts`** — `getTodayEntries` is already implemented. No `getStreak` or `getAverages` yet (Stories 3.1, 3.2).
- **Do NOT add `EntryCard.tsx` inside `<EntrySheet>`** — the history list is in `App.tsx`, not inside the sheet.
- **`[...todayEntries].reverse()`** — always spread before reversing. `Array.reverse()` mutates in place; mutating the context-provided array is an anti-pattern.

### Implementation Guide: `index.css` (minimal change)

Only two additions to `index.css`:

```css
/* Inside @theme block — add after --animate-slide-down: */
--animate-card-fade-in: cardFadeIn 200ms ease-in;

/* After @keyframes slideDown block — add: */
@keyframes cardFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

The global `@media (prefers-reduced-motion: reduce)` rule at the bottom of `index.css` already sets `animation-duration: 0.01ms !important` — this makes the fade-in effectively instant when reduced motion is active. No JS check needed in EntryCard.

### Implementation Guide: `EntryCard.tsx`

```tsx
// src/components/EntryCard.tsx
import type { Entry } from '../types';

interface EntryCardProps {
  entry: Entry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const formattedTime = new Date(entry.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <li
      aria-label={`${formattedTime}, ${entry.calories} kilocalories, ${entry.sugar} grams sugar`}
      className="flex items-center justify-between bg-warm-linen rounded-md p-4 animate-card-fade-in"
    >
      <time dateTime={entry.timestamp} className="text-entry-meta text-warm-stone">
        {formattedTime}
      </time>
      <div className="flex gap-3 text-entry-value font-medium text-espresso" aria-hidden="true">
        <span>{entry.calories} kcal</span>
        <span>{entry.sugar} g</span>
      </div>
    </li>
  );
}
```

**Why `aria-label` on `<li>` with `aria-hidden` on the value div:**
The visible values display as "620 kcal" and "14 g" — short-form units. Screen readers should announce the full form "620 kilocalories, 14 grams sugar" per NFR14. The `aria-label` on `<li>` provides the complete accessible description. The `aria-hidden="true"` on the value div prevents double-reading (the `<time>` element isn't hidden — it reads the time naturally, which is already in the aria-label; some screen readers may still read it from the `<time>` tag, which is acceptable).

**Why `<time dateTime={entry.timestamp}>`:**
The `<time>` element provides semantic meaning for machine-readable dates. `dateTime` is set to the full ISO timestamp; the display text is the human-readable local time. This follows the same semantic pattern used in `DateStreakRow` (Story 3.1 requirement).

**Why `toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })`:**
- Empty locale `[]` uses the browser's default locale
- `hour: '2-digit', minute: '2-digit'` produces "12:34 PM" (en-US) — consistent with the epics spec example
- No `second` — seconds are not needed for meal logging timestamps

**Why `animate-card-fade-in`:**
Tailwind v4 with `--animate-card-fade-in` defined in `@theme` generates the `animate-card-fade-in` utility class automatically. Each card mount applies the keyframe animation. Because it's a CSS animation (not a transition), it triggers on mount — exactly when a new entry appears. `prefers-reduced-motion` is handled globally in `index.css`.

### Implementation Guide: `App.tsx` (additions only)

```tsx
// Updated imports line (add getTodayEntries):
import { getDailyTotal, getTodayEntries } from './utils/calculations';

// Add EntryCard import:
import { EntryCard } from './components/EntryCard';

// In AppContent, after dailyTotal:
const todayEntries = getTodayEntries(entries);

// In JSX, inside <main>, after the StatCards grid div:
{todayEntries.length > 0 && (
  <ul className="flex flex-col gap-2">
    {[...todayEntries].reverse().map(entry => (
      <EntryCard key={entry.id} entry={entry} />
    ))}
  </ul>
)}
```

**Full updated AppContent (for reference):**

```tsx
function AppContent() {
  const { entries } = useEntries();
  const dailyTotal = getDailyTotal(entries);
  const todayEntries = getTodayEntries(entries);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const handleOpenSheet = () => {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => setIsSheetOpen(false);

  return (
    <>
      <main
        className="max-w-[480px] mx-auto px-6 md:px-8 flex flex-col gap-6 pt-6"
        inert={isSheetOpen ? true : undefined}
      >
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
        {todayEntries.length > 0 && (
          <ul className="flex flex-col gap-2">
            {[...todayEntries].reverse().map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </main>
      <EntrySheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        lastFocusedRef={lastFocusedRef}
      />
    </>
  );
}
```

### Implementation Guide: `EntryCard.test.tsx`

```tsx
// src/components/EntryCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EntryCard } from './EntryCard';
import type { Entry } from '../types';

vi.mock('../services/storageService');

const mockEntry: Entry = {
  id: 'test-1',
  calories: 620,
  sugar: 14,
  timestamp: new Date('2026-03-06T12:34:00').toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

function renderCard(entry: Entry = mockEntry) {
  return render(
    <ul>
      <EntryCard entry={entry} />
    </ul>
  );
}

describe('EntryCard', () => {
  it('renders a list item', () => {
    renderCard();
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('displays the formatted time', () => {
    renderCard();
    const formattedTime = new Date(mockEntry.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    expect(screen.getByText(formattedTime)).toBeInTheDocument();
  });

  it('displays the calories value', () => {
    renderCard();
    expect(screen.getByText(/620/)).toBeInTheDocument();
  });

  it('displays the sugar value', () => {
    renderCard();
    expect(screen.getByText(/14 g/)).toBeInTheDocument();
  });

  it('aria-label contains "kilocalories"', () => {
    renderCard();
    const listitem = screen.getByRole('listitem');
    expect(listitem).toHaveAttribute('aria-label', expect.stringContaining('kilocalories'));
  });

  it('aria-label contains "grams sugar"', () => {
    renderCard();
    const listitem = screen.getByRole('listitem');
    expect(listitem).toHaveAttribute('aria-label', expect.stringContaining('grams sugar'));
  });

  it('applies the card fade-in animation class', () => {
    renderCard();
    const listitem = screen.getByRole('listitem');
    expect(listitem).toHaveClass('animate-card-fade-in');
  });
});
```

**Note on `vi.mock('../services/storageService')`:** EntryCard itself does NOT call storageService. But Vitest hoists all `vi.mock()` calls, and if another test in the same run imports a module that ultimately imports storageService, the mock prevents issues. Since `EntryCard` imports `Entry` from `types` only, the mock is technically unnecessary here — but it's consistent with the project's pattern and harmless. Include it for consistency.

### Implementation Guide: `App.test.tsx` additions

The existing `App.test.tsx` tests the sheet open/close flow with a rAF mock in `beforeEach`. Add the following tests to the existing `describe` block:

```tsx
it('renders no history list when there are no entries', () => {
  render(<App />);
  // No list if there are no entries
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});

it('renders an entry card after logging an entry', async () => {
  render(<App />);
  // Open sheet
  const caloriesCard = screen.getByRole('button', { name: /today's calories/i });
  fireEvent.click(caloriesCard);
  // Enter values and log
  fireEvent.change(screen.getByPlaceholderText('e.g. 450'), { target: { value: '500' } });
  fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '15' } });
  fireEvent.click(screen.getByRole('button', { name: /log/i }));
  // Entry should appear in the list
  expect(screen.getByRole('list')).toBeInTheDocument();
  expect(screen.getByRole('listitem')).toBeInTheDocument();
  expect(screen.getByText(/500/)).toBeInTheDocument();
});
```

**Note:** The `beforeEach` rAF mock and `vi.clearAllMocks()` from Story 2.4 must remain. The rAF mock is needed because logging an entry triggers the StatCard count-up animation.

### Design System Token Reference

| Token | Tailwind class | Value |
| --- | --- | --- |
| Warm Linen background | `bg-warm-linen` | #F3EDE4 |
| Radius md | `rounded-md` | 12px (`--radius-md`) |
| Warm Stone (time text) | `text-warm-stone` | #8C7E6F |
| Espresso (values text) | `text-espresso` | #3D3229 |
| Entry Meta size | `text-entry-meta` | 13px / line-height 1.4 |
| Entry Value size | `text-entry-value` | 18px / line-height 1.4 |
| p-4 padding | `p-4` | 16px (space-md) |
| gap-2 between cards | `gap-2` | 8px (space-sm) |
| gap-3 between value spans | `gap-3` | 12px |
| New animation | `animate-card-fade-in` | cardFadeIn 200ms ease-in |

### Previous Story Intelligence (Stories 2.1–2.4 Learnings)

1. **`vi.clearAllMocks()` in `beforeEach`** — CRITICAL: prevents cross-test mock call count accumulation. First call in every `beforeEach`.
2. **`vi.mock('../services/storageService')` at top** — Even for components that don't touch storage, include for consistency and to prevent transitive import issues.
3. **`saveEntries` mock must return `'available'`** — When `EntriesContext` is rendered in tests, `saveEntries` is called on `addEntry`. Mock it: `vi.mocked(storageService.saveEntries).mockReturnValue('available')`.
4. **`window.matchMedia` is mocked globally in `test-setup.ts`** — No need to mock it again per test unless you need `matches: true`.
5. **rAF mock in `App.test.tsx`** — The `requestAnimationFrame` global mock in `beforeEach` is MANDATORY for any App-level test that triggers entry logging (which causes StatCard count-up). Keep it from Story 2.4.
6. **Wrap `<li>` in `<ul>` for tests** — `<li>` outside a list parent produces a JSDOM warning and may affect `getByRole('listitem')`. Always wrap in `<ul>` or `<ol>` in renderCard helper.
7. **`[...todayEntries].reverse()`** — `Array.prototype.reverse()` mutates the original. Always spread first. In-place mutation of the context entries array is an anti-pattern.
8. **`getTodayEntries` is already tested** in `calculations.test.ts` — do NOT add redundant tests for it in App or EntryCard tests.
9. **Commit pattern:** `feat: entry history list (Story 2.5)` — conventional commits, direct to `main`.
10. **`text-entry-meta` and `text-entry-value`** — These Tailwind v4 classes are generated from `--font-size-entry-meta` and `--font-size-entry-value` in `@theme`. Verified pattern matches `text-section-label` and `text-button` already in use.

### Git Intelligence

Recent commits (at story start):
```
9aec273 feat: entries context, calculations, StatCards, DateStreakRow (Stories 2.2-2.3)
8fea68e feat: storage service and data model (Story 2.1)
```
(Story 2.4 commit will appear before this story is worked — `feat: entry sheet & logging flow (Story 2.4)`)

**Patterns confirmed across recent commits:**
- `useEntries()` returns `{ entries, addEntry, storageStatus }` — `AppContent` uses `entries`
- `getTodayEntries` and `getDailyTotal` are named exports from `calculations.ts` — import both on one line
- `EntriesContext.addEntry()` calls `storageService.saveEntries()` internally — tests verify via mock
- `vi.mock('../services/storageService')` path is relative to the test file
- jsdom environment with `@testing-library/jest-dom` matchers available via `test-setup.ts`

**Suggested commit message:** `feat: entry history list (Story 2.5)`

### Project Structure After This Story

```
src/
  components/
    DateStreakRow.tsx       (unchanged)
    DateStreakRow.test.tsx  (unchanged)
    StatCard.tsx            (unchanged)
    StatCard.test.tsx       (unchanged)
    EntrySheet.tsx          (unchanged)
    EntrySheet.test.tsx     (unchanged)
    EntryCard.tsx           (NEW)
    EntryCard.test.tsx      (NEW)
  context/
    EntriesContext.tsx      (unchanged)
    EntriesContext.test.tsx (unchanged)
  services/
    storageService.ts       (unchanged)
    storageService.test.ts  (unchanged)
  utils/
    calculations.ts         (unchanged — no getStreak/getAverages yet)
    calculations.test.ts    (unchanged)
  types.ts                  (unchanged)
  main.tsx                  (unchanged)
  App.tsx                   (UPDATED — getTodayEntries import, EntryCard import, todayEntries, list render)
  App.test.tsx              (UPDATED — 2 new history list tests)
  index.css                 (UPDATED — card-fade-in animation added)
```

**Files NOT to touch this story:**
- `src/utils/calculations.ts` — do NOT add `getStreak` or `getAverages`
- `src/services/storageService.ts` — already complete
- `src/context/EntriesContext.tsx` — already complete
- `src/components/DateStreakRow.tsx` — already complete
- `src/components/StatCard.tsx` — already complete (count-up animation done in 2.4)
- `src/components/EntrySheet.tsx` — already complete
- `vercel.json`, `vite.config.ts`, `package.json` — no changes needed

**Do NOT create in this story:**
- `FAB.tsx` (Story 2.6)
- `ErrorBoundary.tsx` (Story 2.6)
- `InsightsPanel.tsx` (Story 3.2)
- `PillSelector.tsx` (Story 3.2)

### Project Structure Notes

- `EntryCard.tsx` goes in `src/components/` per architecture spec — one component per file
- `EntryCard.test.tsx` co-located next to `EntryCard.tsx` — no separate `__tests__/` directory
- No barrel re-exports needed — components directory has fewer than 4 exports at this point
- The `animate-card-fade-in` CSS animation is defined in `index.css` alongside the existing `slideUp`/`slideDown` animations — consistent pattern

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.5] — Full acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory] — FR8, FR9, NFR9, NFR14
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] — EntryCard component, calculations.ts pure functions, by-type structure
- [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines] — Anti-patterns, storageService boundary, no direct localStorage access in components
- [Source: _bmad-output/planning-artifacts/architecture.md#Format Patterns] — `toLocaleTimeString()` for time display
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory UX Design] — Entry Meta 13px/400, Entry Value 18px/500, Warm Linen card background, radius-md, 16px padding, 8px gap
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy] — Card-based history, Day One calm scrollable timeline inspiration
- [Source: _bmad-output/implementation-artifacts/2-4-entry-sheet-logging-flow.md#Previous Story Intelligence] — vi.clearAllMocks() mandatory, rAF mock in App.test.tsx, saveEntries mock pattern
- [Source: _bmad-output/implementation-artifacts/2-4-entry-sheet-logging-flow.md#Completion Notes] — 87 tests baseline, matchMedia global mock in test-setup.ts
- [Source: src/index.css] — Existing @theme tokens, @keyframes slideUp/slideDown pattern, prefers-reduced-motion global rule

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — implementation completed cleanly. All 100 tests pass on first run.

### Completion Notes List

1. **`index.css` animation token** — `--animate-card-fade-in: cardFadeIn 200ms ease-in` added to `@theme` block; `@keyframes cardFadeIn` added after existing `slideDown` keyframes. Follows identical pattern to existing sheet animations.
2. **`prefers-reduced-motion` handled globally** — The existing `@media (prefers-reduced-motion: reduce)` rule in `index.css` sets `animation-duration: 0.01ms !important`, making all CSS animations effectively instant. No JS-side check needed in `EntryCard`.
3. **`aria-hidden="true"` on value div** — The `<li>` carries the full screen reader label via `aria-label`. The inner value div is hidden from AT to prevent double-announcement. The `<time>` element is not hidden — it carries semantic meaning and its natural reading is already covered by `aria-label`.
4. **`[...todayEntries].reverse()`** — Spread before reverse to prevent mutating the context-provided array. `Array.prototype.reverse()` is in-place.
5. **Conditional render `{todayEntries.length > 0 && ...}`** — AC #8 requires empty state = clean whitespace. No `<ul>` rendered when zero entries. Verified by test.
6. **`vi.mock('../services/storageService')` removed from EntryCard.test.tsx** — Code review [M2] identified this was unnecessary dead code. EntryCard has zero runtime dependency on storageService. Removed for clarity.
7. **Actual EntrySheet implementation differs from story guide** — The real `EntrySheet.tsx` uses an `isClosing` state + `animationend` event (not simple `return null` on close). This means sheet stays mounted during slide-down animation. App.test.tsx fires `animationend` manually to close the sheet in tests. New App tests follow the same pattern.
8. **Final test count: 100** — 87 baseline + 7 new EntryCard + 3 new App integration = 100. All 8 test files pass.

### File List

- `src/index.css` — added `--animate-card-fade-in` token + `@keyframes cardFadeIn`
- `src/components/EntryCard.tsx` — NEW: `<li>` display component with time, values, aria-label, fade-in animation
- `src/components/EntryCard.test.tsx` — NEW: 7 tests covering listitem, time, calories, sugar, aria-labels, animation class
- `src/App.tsx` — added `getTodayEntries` import, `EntryCard` import, `todayEntries` computation, entry list render
- `src/App.test.tsx` — 3 new tests: no list when empty, list after logging, reverse chronological order
- `_bmad-output/implementation-artifacts/2-5-entry-history-list.md` — story file (tasks marked [x], Dev Agent Record populated)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story status updated to `done`

## Senior Developer Review (AI)

**Reviewer:** claude-opus-4-6
**Date:** 2026-03-06
**Outcome:** Approve (after fixes applied)

### AC Validation

All 9 Acceptance Criteria verified as IMPLEMENTED against actual source code.

### Issues Found: 0 High, 3 Medium, 3 Low

### Action Items

- [x] [M1] Redundant double-computation: `getDailyTotal(entries)` internally calls `getTodayEntries`, duplicating work. Fixed by computing `todayEntries` first and inlining the reduce in `App.tsx`. Removed unused `getDailyTotal` import.
- [x] [M2] Unnecessary `vi.mock('../services/storageService')` in `EntryCard.test.tsx`. EntryCard has zero dependency on storageService. Removed mock and unused `vi`/`beforeEach` imports.
- [x] [M3] Timezone-sensitive hardcoded dates in reverse-order test (`App.test.tsx`). `new Date('2026-03-06T10:00:00')` may parse as UTC in some environments, causing `getTodayEntries` to exclude them. Fixed by constructing dates from `new Date()` with explicit local hours.
- [ ] [L1] No explicit `font-normal` on `<time>` element — works by inheritance (browser default 400). Not fixed (low risk, accepted).
- [ ] [L2] `<time>` element not `aria-hidden` — may cause partial duplication in edge-case SR combos. Not fixed (mainstream SR behaviour is correct).
- [ ] [L3] `animate-card-fade-in` replays on remount — informational only, current behaviour is correct via React key reconciliation.

### Change Log

- Code review fixes applied: 3 MEDIUM issues resolved (2026-03-06)
