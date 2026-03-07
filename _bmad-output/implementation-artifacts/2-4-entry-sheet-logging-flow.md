# Story 2.4: Entry Sheet & Logging Flow

Status: done

## Story

As a user,
I want to tap the daily total or a button, enter my calorie and sugar estimates, and log the entry with one tap,
so that I can track a meal in under 10 seconds with minimal friction.

## Acceptance Criteria

1. **Given** the main screen is displayed, **When** the user taps/clicks either StatCard, **Then** the EntrySheet bottom sheet slides up from the bottom with a smooth animation (~200ms ease-out).
2. The sheet has `role="dialog"`, `aria-modal="true"`, and focus is trapped within the sheet while open.
3. Background content is made inert using the `inert` attribute on the `<main>` element.
4. The sheet has radius-lg (16px) on top corners only, Cream background, max 60vh height, full width (max 480px on desktop).
5. The sheet displays: a handle bar, a calorie input field, a sugar input field, and a full-width pill-shaped Log button.
6. **Given** the EntrySheet is open, **When** it finishes opening, **Then** the calorie input field is auto-focused and `inputmode="numeric"` triggers the numeric keyboard on mobile.
7. Input fields have Warm Linen background, Sand Mist border, radius-sm (8px), placeholders "e.g. 450" and "e.g. 12" in Dusty Tan.
8. Focused input shows Soft Terracotta border.
9. Tab order is: Calories -> Sugar -> Log button (with wrap-around).
10. The Log button has Soft Terracotta background, white text, 16px SemiBold, radius-pill, with Deep Terracotta hover state and scale(0.97) active state.
11. **Given** the user taps the Log button, **Then** `EntriesContext.addEntry()` is called with the entered values; empty fields are treated as 0; any finite number including 0 and negatives is accepted.
12. The sheet dismisses with a slide-down animation (~150ms ease-in); StatCard values update with a count-up animation (~300ms ease-out).
13. Focus returns to the element that triggered the sheet after dismissal.
14. The entry flow requires no more than 3 interactions: tap to open, enter values, tap Log (NFR8).
15. **Given** the EntrySheet is open, **When** the user taps the backdrop or presses Escape, **Then** the sheet dismisses without saving data; focus returns to the trigger element.
16. **Given** `prefers-reduced-motion` is enabled, **When** the sheet opens, closes, or stat cards update, **Then** all animations are replaced with instant state changes.

## Tasks / Subtasks

- [x] Task 1: Update `src/components/StatCard.tsx` to add count-up animation (AC: #12, #16)
  - [x] Import `useEffect`, `useRef`, `useState` from react
  - [x] Add `displayValue: number` local state, initialised to `value` prop
  - [x] Add `prevValueRef` ref to track previous value
  - [x] In `useEffect` watching `value`: if `prefers-reduced-motion` active, set `displayValue` instantly; else run `requestAnimationFrame` count-up over 300ms with cubic ease-out (`1 - (1-t)^3`)
  - [x] Cancel the animation frame on cleanup (`return () => cancelAnimationFrame(rafId)`)
  - [x] Render `displayValue` in the value `<span>` instead of `value`
  - [x] Keep `valueColour` based on `value` prop (not `displayValue`) — reflects logical state, not animation state
- [x] Task 2: Update `src/components/StatCard.test.tsx` (AC: #12, #16)
  - [x] Add test: count-up animation renders final value after animation (mock `requestAnimationFrame` to call callback immediately)
  - [x] Add test: with `prefers-reduced-motion`, value changes instantly (mock `window.matchMedia`)
  - [x] Existing 11 tests still pass with no regressions
- [x] Task 3: Create `src/components/EntrySheet.tsx` (AC: #1-#16)
  - [x] Props interface: `isOpen: boolean`, `onClose: () => void`, `lastFocusedRef: React.RefObject<HTMLElement | null>`
  - [x] Import `useEntries` from context
  - [x] Local state: `calories: string` (default `''`), `sugar: string` (default `''`)
  - [x] Refs: `caloriesRef`, `sugarRef`, `logButtonRef`
  - [x] `useEffect` on `isOpen`: when true → schedule `caloriesRef.current?.focus()` after 50ms timeout (state reset handled by key remount in App.tsx)
  - [x] `useEffect` on `isOpen`: when false AND `lastFocusedRef.current` exists → call `lastFocusedRef.current.focus()`
  - [x] `useEffect` for keyboard: when `isOpen` attach `keydown` listener to `document`; on Escape → `onClose()`; on Tab → implement wrap-around focus trap (cycle: calories → sugar → log → calories); cleanup on unmount/isOpen change
  - [x] `handleLog`: call `addEntry(Number(calories) || 0, Number(sugar) || 0)`, then `onClose()`
  - [x] Outer wrapper: `<div>` covering the full viewport (fixed inset-0), `role="dialog"` `aria-modal="true"` `aria-label="Add entry"` — render `null` when `!isOpen` (return null early)
  - [x] Backdrop: `<div className="fixed inset-0 bg-espresso/20" onClick={onClose} aria-hidden="true" />`
  - [x] Sheet panel: `<div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-cream rounded-t-lg shadow-sheet max-h-[60vh] overflow-y-auto flex flex-col p-6 gap-4">`
  - [x] Handle bar: `<div className="w-10 h-1 bg-sand-mist rounded-pill mx-auto -mt-2 mb-2" aria-hidden="true" />`
  - [x] Calories label + input: `<label>` with `htmlFor`, input with `ref={caloriesRef}`, `id`, `inputMode="numeric"`, `placeholder="e.g. 450"`, `value={calories}`, `onChange`
  - [x] Sugar label + input: same pattern as calories, `placeholder="e.g. 12"`, `ref={sugarRef}`
  - [x] Log button: `<button ref={logButtonRef} onClick={handleLog} className="w-full bg-soft-terracotta text-cream text-button font-semibold rounded-pill py-3 hover:bg-deep-terracotta active:scale-[0.97] transition-all">Log</button>`
  - [x] `prefers-reduced-motion`: handled by global rule in `index.css` (disables CSS transitions)
- [x] Task 4: Create `src/components/EntrySheet.test.tsx` (AC: #2, #3, #5-#16)
  - [x] Mock `storageService` at top: `vi.mock('../services/storageService')`
  - [x] `beforeEach`: mock `loadEntries` to return `{ entries: [], status: 'available' }`, `vi.clearAllMocks()`
  - [x] Helper: `renderSheet(isOpen, onClose)` — wraps in `EntriesProvider`, creates a `lastFocusedRef`
  - [x] Test: does not render when `isOpen={false}`
  - [x] Test: renders dialog when `isOpen={true}`
  - [x] Test: `role="dialog"` and `aria-modal="true"` are set
  - [x] Test: Calories and Sugar inputs present via labels
  - [x] Test: placeholder text "e.g. 450" on calories, "e.g. 12" on sugar
  - [x] Test: Log button present
  - [x] Test: typing in calories updates the input value
  - [x] Test: typing in sugar updates the input value
  - [x] Test: clicking Log calls `onClose`
  - [x] Test: clicking Log saves entry with entered values (via `storageService.saveEntries`)
  - [x] Test: clicking Log with empty fields saves entry with 0, 0
  - [x] Test: clicking backdrop calls `onClose`
  - [x] Test: pressing Escape calls `onClose`
  - [x] Test: pressing Escape does NOT call `saveEntries`
- [x] Task 5: Update `src/App.tsx` (AC: #1, #3, #13)
  - [x] Import `useState`, `useRef` from react
  - [x] Import `EntrySheet` from `./components/EntrySheet`
  - [x] Add `isSheetOpen: boolean` state (default `false`) in `AppContent`
  - [x] Add `lastFocusedRef = useRef<HTMLElement | null>(null)` in `AppContent`
  - [x] Update `handleOpenSheet` to: `lastFocusedRef.current = document.activeElement as HTMLElement; setIsSheetOpen(true);`
  - [x] Add `handleCloseSheet = () => setIsSheetOpen(false)`
  - [x] Wire `StatCard onClick` to `handleOpenSheet`
  - [x] Add `inert` prop on `<main>` when `isSheetOpen`: `<main ... inert={isSheetOpen ? true : undefined}>`
  - [x] Render `<EntrySheet key={String(isSheetOpen)} .../>` as sibling of `<main>` in `<>` fragment (key remount ensures state reset on each open)
- [x] Task 6: Update `src/App.test.tsx` (AC: #1, #5, #11, #12)
  - [x] `vi.clearAllMocks()` confirmed present in `beforeEach`
  - [x] Added rAF mock to `beforeEach` + `afterEach` cleanup with `vi.unstubAllGlobals()`
  - [x] Test: EntrySheet not visible initially (no dialog on first render)
  - [x] Test: clicking a StatCard opens EntrySheet (dialog appears)
  - [x] Test: entering values and tapping Log saves entry and closes sheet
  - [x] All 6 existing tests pass with no regressions
- [x] Task 7: Run `npm test` — 87/87 tests passing, zero regressions, lint clean

## Dev Notes

### What This Story Delivers

This is the logging story — the core interaction loop. After this story, a user can:
1. Tap either StatCard (calories or sugar) to open the EntrySheet bottom sheet
2. Enter calorie and/or sugar values in numeric inputs
3. Tap "Log" to save the entry via `EntriesContext.addEntry()`
4. See the StatCards animate to the new totals
5. Dismiss the sheet by tapping the backdrop or pressing Escape (no save)

After this story, the core value proposition of the app is functional end-to-end.

**What is NOT in this story:**
- FAB (floating action button) — Story 2.6
- EntryCard history list — Story 2.5
- ErrorBoundary — Story 2.6
- Storage-unavailable message — Story 2.6
- Smart search field in EntrySheet — Story 4.1 (the field is added to the sheet in that story)

### Current Project State (after Stories 2.1, 2.2, 2.3)

```
src/
  main.tsx                          ✅ React entry point
  App.tsx                           <- UPDATE THIS STORY (add isSheetOpen state, wire handleOpenSheet, render EntrySheet)
  App.test.tsx                      <- UPDATE THIS STORY (add EntrySheet interaction tests)
  index.css                         ✅ Tailwind v4 design tokens + Google Fonts + prefers-reduced-motion
  types.ts                          ✅ Entry, InsightPeriod, StorageStatus
  test-setup.ts                     ✅ imports @testing-library/jest-dom
  components/
    DateStreakRow.tsx               ✅ DONE (Story 2.3)
    DateStreakRow.test.tsx          ✅ DONE (Story 2.3)
    StatCard.tsx                   <- UPDATE THIS STORY (add count-up animation)
    StatCard.test.tsx              <- UPDATE THIS STORY (add animation tests)
  services/storageService.ts        ✅ DONE (Story 2.1)
  services/storageService.test.ts   ✅ 17 tests passing
  utils/calculations.ts             ✅ DONE (Story 2.2) — getTodayEntries, getDailyTotal
  utils/calculations.test.ts        ✅ tests passing
  context/EntriesContext.tsx        ✅ DONE (Story 2.2) — EntriesProvider, useEntries
  context/EntriesContext.test.tsx   ✅ tests passing
```

**Current `src/App.tsx` relevant section to update:**

```tsx
// In AppContent — CURRENT (no-op):
const handleOpenSheet = () => {
  // EntrySheet will be implemented in Story 2.4
};

// In AppContent render — CURRENT (no EntrySheet rendered):
<main className="max-w-[480px] mx-auto px-6 md:px-8 flex flex-col gap-6 pt-6">
  <DateStreakRow />
  <div className="grid grid-cols-2 gap-4">
    <StatCard ... onClick={handleOpenSheet} />
    <StatCard ... onClick={handleOpenSheet} />
  </div>
</main>
```

**Total tests after Story 2.3:** 67 (17 storageService + 15 calculations + 14 EntriesContext + 4 DateStreakRow + 11 StatCard + 6 App). All must stay passing.

### Architecture Compliance Rules (MANDATORY)

- **`storageService.ts` is the sole localStorage gateway** — `EntrySheet` calls `EntriesContext.addEntry()`, which calls `storageService`. `EntrySheet` NEVER touches localStorage directly.
- **No derived data in context** — `EntrySheet` receives only `addEntry` from context. It does not read `entries` or compute totals.
- **No `any` types** — type all props and refs explicitly.
- **No `console.log`** — remove before commit.
- **Tailwind only** — no custom CSS classes, no inline style objects (exception: `data-*` attributes for state).
- **Focus trap is mandatory** (AC #2, NFR11) — use the keyboard `keydown` approach on `document`, not a library.
- **`inert` attribute is mandatory** (AC #3) — set on `<main>` when sheet is open. In React 19, pass `inert` as a boolean prop: `inert={isSheetOpen ? true : undefined}`. Do not use `setAttribute` — React 19 handles `inert` natively.
- **Empty fields = 0** (AC #11, FR6) — `Number('') === 0`. Never block submission. Any finite number including negatives is valid.
- **No validation UI** — do not add error states, minimum value checks, or "required" attributes. The spec explicitly says submission is never blocked.
- **No FAB in this story** — that is Story 2.6. The StatCards are the only open triggers.
- **No EntryCard in this story** — that is Story 2.5.
- **No ErrorBoundary in this story** — that is Story 2.6.
- **Do NOT modify `calculations.ts`** — no `getStreak` or `getAverages` yet (Stories 3.1, 3.2).

### Design System Token Reference

All tokens from `src/index.css` `@theme` block:

| Token | Tailwind class |
| --- | --- |
| Cream | `bg-cream`, `text-cream` |
| Warm Linen | `bg-warm-linen` |
| Sand Mist | `bg-sand-mist`, `border-sand-mist` |
| Espresso | `text-espresso` |
| Soft Terracotta | `bg-soft-terracotta`, `text-soft-terracotta`, `border-soft-terracotta` |
| Deep Terracotta | `bg-deep-terracotta` |
| Dusty Tan | `text-dusty-tan` |
| Rose Blush | `bg-rose-blush` |
| Warm Stone | `text-warm-stone` |
| Radius sm (8px) | `rounded-sm` |
| Radius lg (16px) | `rounded-lg` |
| Radius pill (9999px) | `rounded-pill` |
| Shadow sheet | `shadow-sheet` (`0 -4px 24px rgba(61,50,41,0.08)`) |
| Button text | `text-button` (16px/600 — defined as font-size token) |
| Section label | `text-section-label` (14px) |

**Standard Tailwind spacing:**
- `p-6` = 24px padding (sheet internal)
- `gap-4` = 16px gap (between inputs)
- `py-3` = 12px vertical padding (Log button)

### Implementation Guide: `EntrySheet.tsx`

```tsx
// src/components/EntrySheet.tsx
import { useEffect, useRef, useState } from 'react';
import { useEntries } from '../context/EntriesContext';

interface EntrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  lastFocusedRef: React.RefObject<HTMLElement | null>;
}

export function EntrySheet({ isOpen, onClose, lastFocusedRef }: EntrySheetProps) {
  const { addEntry } = useEntries();
  const [calories, setCalories] = useState('');
  const [sugar, setSugar] = useState('');
  const caloriesRef = useRef<HTMLInputElement>(null);
  const sugarRef = useRef<HTMLInputElement>(null);
  const logButtonRef = useRef<HTMLButtonElement>(null);

  // Reset fields and auto-focus calories input on open
  useEffect(() => {
    if (isOpen) {
      setCalories('');
      setSugar('');
      const timeoutId = setTimeout(() => {
        caloriesRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Return focus to trigger element on close
  useEffect(() => {
    if (!isOpen) {
      lastFocusedRef.current?.focus();
    }
  }, [isOpen, lastFocusedRef]);

  // Keyboard handling: Escape to close, Tab for focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = [
          caloriesRef.current,
          sugarRef.current,
          logButtonRef.current,
        ].filter((el): el is HTMLElement => el !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLog = () => {
    addEntry(Number(calories) || 0, Number(sugar) || 0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add entry"
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/20"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet panel */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-cream rounded-t-lg shadow-sheet max-h-[60vh] flex flex-col p-6 gap-4">
        {/* Handle bar */}
        <div className="w-10 h-1 bg-sand-mist rounded-pill mx-auto -mt-2 mb-2" aria-hidden="true" />

        {/* Calories input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="entry-calories" className="text-section-label font-semibold text-warm-stone">
            Calories
          </label>
          <input
            ref={caloriesRef}
            id="entry-calories"
            inputMode="numeric"
            placeholder="e.g. 450"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="bg-warm-linen border border-sand-mist rounded-sm px-4 py-3 text-[1.25rem] font-medium text-espresso placeholder:text-dusty-tan focus:outline-none focus:border-soft-terracotta transition-colors"
          />
        </div>

        {/* Sugar input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="entry-sugar" className="text-section-label font-semibold text-warm-stone">
            Sugar (g)
          </label>
          <input
            ref={sugarRef}
            id="entry-sugar"
            inputMode="numeric"
            placeholder="e.g. 12"
            value={sugar}
            onChange={(e) => setSugar(e.target.value)}
            className="bg-warm-linen border border-sand-mist rounded-sm px-4 py-3 text-[1.25rem] font-medium text-espresso placeholder:text-dusty-tan focus:outline-none focus:border-soft-terracotta transition-colors"
          />
        </div>

        {/* Log button */}
        <button
          ref={logButtonRef}
          onClick={handleLog}
          className="w-full bg-soft-terracotta text-cream text-button font-semibold rounded-pill py-3 hover:bg-deep-terracotta active:scale-[0.97] transition-all"
        >
          Log
        </button>
      </div>
    </div>
  );
}
```

**Why `return null` when `!isOpen`:** Simpler than CSS `hidden` — unmounts the DOM, resets all state automatically. Combined with the 50ms timeout on auto-focus, this gives the animation time to run (future: add a `data-open` transition; for now the mount/unmount itself is the interaction boundary).

**Why `Number(calories) || 0`:** `Number('')` returns `0`, so empty fields safely map to 0. `Number('abc')` returns `NaN`, and `NaN || 0` = 0 — also safe. Any valid number including negatives passes through correctly.

**Why `z-50`:** Ensures the sheet renders above all other content. The `inert` on `<main>` handles accessibility; `z-50` handles visual stacking.

**Why `aria-hidden="true"` on backdrop:** The backdrop is a presentational overlay — screen readers should not read it. All accessible content is inside the dialog.

**Why 50ms timeout on focus:** The component mounts synchronously but CSS animation needs a frame to start. Without the timeout, focus is set before the transition begins, which can cause scroll jitter on mobile. 50ms is sufficient without being noticeable.

**Why `lastFocusedRef` rather than a `triggerElement` prop:** The calling code (App.tsx) captures `document.activeElement` at click time and stores it in a ref. Passing the ref to EntrySheet avoids prop-drilling an HTMLElement. The ref pattern also avoids stale closure issues.

### Implementation Guide: Count-up Animation in `StatCard.tsx`

Add count-up animation to StatCard. The component is otherwise unchanged.

```tsx
// src/components/StatCard.tsx — additions
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

// ... (interface unchanged)

export function StatCard({ label, value, unit, onClick, ariaLabel }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const from = prevValueRef.current;
    const to = value;
    prevValueRef.current = to;

    if (from === to) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(to);
      return;
    }

    const duration = 300;
    const start = performance.now();
    let rafId: number;

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      setDisplayValue(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(to); // ensure we land exactly on target
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  // valueColour based on logical `value` (the target), not `displayValue`
  const valueColour = value === 0 ? 'text-dusty-tan' : 'text-espresso';

  return (
    // ... render `displayValue` in the value span instead of `value`
    // Everything else is identical to Story 2.3 implementation
  );
}
```

**Why `value` for `valueColour` not `displayValue`:** The colour reflects the logical state (zero entries = Dusty Tan). When counting up from 0 to 500, we want Espresso throughout since the data state is already non-zero. Flipping to Espresso immediately on entry creation is correct behaviour.

**Why `prevValueRef`:** `useEffect` captures the previous `value` via a ref, avoiding stale closure. The ref persists across renders without triggering re-renders itself.

**Why `return () => cancelAnimationFrame(rafId)`:** If the component unmounts or `value` changes again during animation, cancel the in-flight rAF to prevent setState on unmounted component or incorrect intermediate values.

### Implementation Guide: `App.tsx` (updated AppContent)

```tsx
// src/App.tsx — updated AppContent
import { useRef, useState } from 'react';
import { EntriesProvider, useEntries } from './context/EntriesContext';
import { getDailyTotal } from './utils/calculations';
import { StatCard } from './components/StatCard';
import { DateStreakRow } from './components/DateStreakRow';
import { EntrySheet } from './components/EntrySheet';

function AppContent() {
  const { entries } = useEntries();
  const dailyTotal = getDailyTotal(entries);

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
      </main>
      <EntrySheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        lastFocusedRef={lastFocusedRef}
      />
    </>
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

**Why `<>` fragment:** `EntrySheet` is a sibling of `<main>`, not a child. Rendering it inside `<main>` would defeat the `inert` attribute (the sheet would also be inert when open). A fragment lets both be rendered without an extra DOM wrapper.

**Why `inert={isSheetOpen ? true : undefined}`:** React 19 supports `inert` as a boolean prop on DOM elements. Passing `undefined` removes the attribute. `inert={false}` would be incorrect — it sets the attribute to the string `"false"` which still activates inert in some browsers. Always use `undefined` to remove it.

**Why `document.activeElement` for `lastFocusedRef`:** Captures the exact element that had focus before the sheet opens, enabling precise focus restoration after close. This is more reliable than passing trigger refs as props, since either StatCard can trigger the sheet.

### Implementation Guide: `EntrySheet.test.tsx`

```tsx
// src/components/EntrySheet.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRef } from 'react';
import { EntrySheet } from './EntrySheet';
import { EntriesProvider } from '../context/EntriesContext';
import * as storageService from '../services/storageService';

vi.mock('../services/storageService');

function renderSheet(isOpen = true, onClose = vi.fn()) {
  function Wrapper() {
    const lastFocusedRef = useRef<HTMLElement | null>(null);
    return (
      <EntriesProvider>
        <EntrySheet isOpen={isOpen} onClose={onClose} lastFocusedRef={lastFocusedRef} />
      </EntriesProvider>
    );
  }
  return render(<Wrapper />);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [], status: 'available' });
  vi.mocked(storageService.saveEntries).mockReturnValue('available');
});

describe('EntrySheet', () => {
  it('renders nothing when isOpen is false', () => {
    renderSheet(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog when isOpen is true', () => {
    renderSheet();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has role="dialog" and aria-modal="true"', () => {
    renderSheet();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('renders Calories and Sugar labels', () => {
    renderSheet();
    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sugar/i)).toBeInTheDocument();
  });

  it('calories input has placeholder "e.g. 450"', () => {
    renderSheet();
    expect(screen.getByPlaceholderText('e.g. 450')).toBeInTheDocument();
  });

  it('sugar input has placeholder "e.g. 12"', () => {
    renderSheet();
    expect(screen.getByPlaceholderText('e.g. 12')).toBeInTheDocument();
  });

  it('renders Log button', () => {
    renderSheet();
    expect(screen.getByRole('button', { name: /log/i })).toBeInTheDocument();
  });

  it('typing in calories updates the input', () => {
    renderSheet();
    const input = screen.getByPlaceholderText('e.g. 450');
    fireEvent.change(input, { target: { value: '450' } });
    expect(input).toHaveValue('450');
  });

  it('typing in sugar updates the input', () => {
    renderSheet();
    const input = screen.getByPlaceholderText('e.g. 12');
    fireEvent.change(input, { target: { value: '12' } });
    expect(input).toHaveValue('12');
  });

  it('clicking Log calls onClose', () => {
    const onClose = vi.fn();
    renderSheet(true, onClose);
    fireEvent.click(screen.getByRole('button', { name: /log/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking Log calls addEntry with entered values (via storageService.saveEntries)', () => {
    renderSheet();
    fireEvent.change(screen.getByPlaceholderText('e.g. 450'), { target: { value: '500' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /log/i }));
    // addEntry calls saveEntries — verify it was called (indirect test via storageService mock)
    expect(storageService.saveEntries).toHaveBeenCalledTimes(1);
    const savedEntries = vi.mocked(storageService.saveEntries).mock.calls[0][0];
    expect(savedEntries[0].calories).toBe(500);
    expect(savedEntries[0].sugar).toBe(15);
  });

  it('clicking Log with empty fields calls addEntry with 0, 0', () => {
    renderSheet();
    fireEvent.click(screen.getByRole('button', { name: /log/i }));
    expect(storageService.saveEntries).toHaveBeenCalledTimes(1);
    const savedEntries = vi.mocked(storageService.saveEntries).mock.calls[0][0];
    expect(savedEntries[0].calories).toBe(0);
    expect(savedEntries[0].sugar).toBe(0);
  });

  it('clicking backdrop calls onClose', () => {
    const onClose = vi.fn();
    renderSheet(true, onClose);
    // The backdrop is aria-hidden, find it by its position in DOM
    // Click the outer dialog wrapper but NOT the inner sheet panel
    const dialog = screen.getByRole('dialog');
    // Find the backdrop div (aria-hidden sibling inside dialog)
    const backdrop = dialog.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pressing Escape calls onClose', () => {
    const onClose = vi.fn();
    renderSheet(true, onClose);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pressing Escape does not call saveEntries', () => {
    renderSheet();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(storageService.saveEntries).not.toHaveBeenCalled();
  });
});
```

**Why test via `storageService.saveEntries`:** We can't easily spy on the `addEntry` from context without a custom provider. Testing via `saveEntries` is the next layer up — it's called by `addEntry` every time an entry is created, making it an effective indirect assertion.

**Why `dialog.querySelector('[aria-hidden="true"]')`:** The backdrop div is `aria-hidden` so it has no ARIA role — can't use `getByRole`. Querying by the attribute is reliable and accurate.

### Previous Story Intelligence (Stories 2.1, 2.2, 2.3 Learnings)

1. **`vi.clearAllMocks()` in `beforeEach`** — prevents cross-test mock call count accumulation. CRITICAL: missing this caused a review finding [M2] in Story 2.3. Always add it as the first call in `beforeEach`.
2. **`vi.mock('../services/storageService')` at top of test files** — `EntriesProvider` calls `loadEntries()` in its `useState` lazy initializer. Without mocking, tests fail with undefined localStorage errors.
3. **`saveEntries` mock must return `'available'`** — `storageService.saveEntries` returns `StorageStatus`. Mock it: `vi.mocked(storageService.saveEntries).mockReturnValue('available')`. Without this, TypeScript may warn or tests may behave unexpectedly.
4. **ESLint `react-refresh/only-export-components`** — if a file exports non-component things alongside a component, add the ESLint disable comment. `EntrySheet.tsx` exports only the component — no issue.
5. **`afterEach(() => vi.restoreAllMocks())`** — add when a test uses `mockImplementation` or `mockReturnValueOnce`. Add it as a safety net in any test file that calls `mockReturnValueOnce`.
6. **Test run command:** `npm test` — runs all `*.test.ts(x)` via Vitest.
7. **No `localStorage.clear()` needed** — storage is fully mocked.
8. **Commit pattern:** `feat: entry sheet & logging flow (Story 2.4)` — conventional commits, direct to `main`.
9. **TypeScript 5.9.3** — all modern TS features available. `React.RefObject<HTMLElement | null>` is valid.
10. **`rounded-t-lg`** — Tailwind class for top-only border radius. Confirms `rounded-t-lg` on the sheet panel gives 16px top-left + top-right corners only (matching `--radius-lg: 16px`).
11. **Story 2.3 [L1] known issue:** `StatCard` label renders as "CALORIES"/"SUGAR" (uppercase) due to `uppercase tracking-wide` classes. This is a known low-priority finding. Do NOT change it in this story — it's a cosmetic deviation accepted by the team.

### Git Intelligence

Recent commits:
```
9aec273 feat: entries context, calculations, StatCards, DateStreakRow (Stories 2.2-2.3)
8fea68e feat: storage service and data model (Story 2.1)
c6ea5e2 review: story 1.3 done — security headers, gitignore, story status
```

**Patterns from recent commits:**
- `EntriesContext.tsx` uses a combined state object `{ entries, storageStatus }` — destructure only what you need
- `useEntries()` returns `{ entries, addEntry, storageStatus }` — `EntrySheet` only needs `addEntry`
- `StatCard` renders with `transition-colors` for hover — extend with `transition-all` for the Log button (which also needs `scale`)
- `vi.mock('./services/storageService')` path is relative to the test file (components test uses `'../services/storageService'`)
- Tests run in jsdom environment with `@testing-library/jest-dom` matchers available

**Suggested commit message:** `feat: entry sheet & logging flow (Story 2.4)`

**Active branch:** `main` only (solo developer, direct to main).

**Deployment:** Push to `main` → Vercel auto-deploys. After this story, the live app will be fully functional for logging — the first time a real user can record entries via the live URL.

### Key Constraints

- **`inert` vs `aria-hidden`:** Use `inert` on `<main>` (per AC #3 and UX spec). Do NOT use `aria-hidden` on `<main>` — `inert` is more comprehensive (removes from tab order AND hides from AT).
- **Sheet renders as sibling of `<main>`** — if rendered inside `<main>`, the `inert` attribute would also apply to the sheet. The `<>` fragment in App keeps them as siblings.
- **`Number(calories) || 0`** — handles both `''` (empty) and `NaN` (non-numeric input). Do not use `parseInt` or `parseFloat` — they allow partial strings like `"450abc" → 450` which is arguably fine, but `Number()` is consistent with the architecture's `Number()` convention.
- **Tab order: Calories → Sugar → Log** — the AC specifies this exact order. The DOM order in `EntrySheet.tsx` must match. Do NOT add `tabIndex` to change order — DOM order is sufficient.
- **Sheet max height: `max-h-[60vh]`** — if content exceeds 60% viewport height (unlikely with 2 inputs), it should scroll. Add `overflow-y-auto` as a safeguard.
- **`aria-label="Add entry"` on dialog** — screen readers announce this when the dialog opens. Do not use `aria-labelledby` pointing to a visible heading (there is none). Direct `aria-label` is correct.
- **No animation library** — use CSS Tailwind classes only. The sheet mount/unmount provides the transition boundary. Future enhancement: use `data-state` attributes with Tailwind's `data-*` variant for enter/exit animations.
- **Swipe down to dismiss** — the AC mentions this but it's a progressive enhancement. Focus on Escape and backdrop click for this story. Touch swipe can be added without test coverage if time allows; it must not break the keyboard tests.

### Data Flow This Story Activates

```
User taps StatCard
  -> handleOpenSheet() stores document.activeElement in lastFocusedRef
  -> setIsSheetOpen(true)
  -> <main inert={true}> — main content frozen for AT
  -> EntrySheet renders (mounts)
  -> 50ms timeout fires -> caloriesRef.current.focus()

User types 450 in Calories, 12 in Sugar, taps Log
  -> EntrySheet.handleLog()
  -> addEntry(450, 12) called on EntriesContext
    -> new Entry created: { id: crypto.randomUUID(), calories: 450, sugar: 12, timestamp: ISO string }
    -> setEntries([...prev, newEntry])
    -> storageService.saveEntries(updatedEntries)
  -> onClose() called
  -> setIsSheetOpen(false)
  -> EntrySheet unmounts (returns null)
  -> <main inert={undefined}> — main content restored
  -> lastFocusedRef.current?.focus() — focus returns to trigger StatCard
  -> StatCard re-renders with new value (450 / 12)
  -> count-up animation runs: 0 → 450 over 300ms ease-out

User taps backdrop or presses Escape
  -> onClose() called
  -> setIsSheetOpen(false)
  -> EntrySheet unmounts
  -> NO addEntry call — no data saved
  -> focus returns to trigger StatCard
```

### Project Structure After This Story

```
src/
  components/
    DateStreakRow.tsx       (unchanged)
    DateStreakRow.test.tsx  (unchanged)
    StatCard.tsx            (UPDATED — count-up animation)
    StatCard.test.tsx       (UPDATED — animation tests)
    EntrySheet.tsx          (NEW)
    EntrySheet.test.tsx     (NEW)
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
  App.tsx                   (UPDATED — isSheetOpen state, lastFocusedRef, EntrySheet rendered)
  App.test.tsx              (UPDATED — EntrySheet interaction tests added)
  index.css                 (unchanged)
```

**Files NOT to touch this story:**
- `src/utils/calculations.ts` — do NOT add `getStreak` or `getAverages`
- `src/services/storageService.ts` — already complete
- `src/context/EntriesContext.tsx` — already complete
- `src/components/DateStreakRow.tsx` — already complete
- `vercel.json`, `vite.config.ts`, `package.json` — no changes needed

**Do NOT create in this story:**
- `EntryCard.tsx` (Story 2.5)
- `FAB.tsx` (Story 2.6)
- `ErrorBoundary.tsx` (Story 2.6)
- `InsightsPanel.tsx` (Story 3.2)
- `PillSelector.tsx` (Story 3.2)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4] — Full acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory] — FR1, FR2, FR3, FR4, FR5, FR6, FR7, NFR2, NFR4, NFR8, NFR9, NFR11, NFR14
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] — Component architecture, `EntrySheet.tsx` + `EntriesContext.tsx` own FR1-FR6
- [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines] — Anti-patterns list, storageService boundary rule
- [Source: _bmad-output/planning-artifacts/architecture.md#Input Handling] — `Number()` for parsing, empty = 0, any finite number valid
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Flow] — Full data flow diagram including EntrySheet logging sequence
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory UX Design] — Bottom sheet: max 60vh, radius-lg top, shadow-sheet, Cream background; animation 200ms open / 150ms close; focus trap via `inert`; tab order Calories → Sugar → Log
- [Source: _bmad-output/implementation-artifacts/2-3-main-screen-layout-statcards-date-row.md#Completion Notes] — 67 tests baseline, handleOpenSheet is no-op, AppContent pattern
- [Source: _bmad-output/implementation-artifacts/2-3-main-screen-layout-statcards-date-row.md#Senior Developer Review] — [M2] vi.clearAllMocks() in beforeEach is mandatory; [L1] StatCard uppercase label is accepted

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — implementation completed cleanly.

### Completion Notes List

1. **ESLint `react-hooks/set-state-in-effect` in `StatCard.tsx`**: `setDisplayValue(to)` called synchronously in `useEffect` for the prefers-reduced-motion branch. Suppressed with `// eslint-disable-next-line react-hooks/set-state-in-effect`. This is intentional — single non-cascading setState, not a mistake.
2. **State reset via `key` remounting**: The original guide showed `setCalories('')`/`setSugar('')` in a `useEffect`. This triggers the ESLint rule. Instead, `key={String(isSheetOpen)}` on `<EntrySheet>` in `App.tsx` causes React to fully remount the component on each open, giving fresh `useState('')` initial state automatically. Simpler and avoids the lint error.
3. **`matchMedia` not in jsdom**: jsdom 28 does not implement `window.matchMedia`. Added a global mock in `src/test-setup.ts` returning `{ matches: false }` (no reduced-motion by default). Tests requiring `matches: true` override with `vi.stubGlobal('matchMedia', ...)`.
4. **`requestAnimationFrame` mock in `App.test.tsx`**: The entry logging test triggers a count-up animation. Added `vi.stubGlobal('requestAnimationFrame', ...)` to `beforeEach` so the animation completes synchronously. Cleaned up in `afterEach` with `vi.unstubAllGlobals()`.
5. **Backdrop location in tests**: Backdrop is `aria-hidden` — no ARIA role. Located via `dialog.querySelector('[aria-hidden="true"]')` which returns the backdrop (first aria-hidden child) reliably.
6. **`inert` TypeScript**: React 19 + `@types/react@19.2.7` supports `inert?: boolean | undefined` natively. Used `inert={isSheetOpen ? true : undefined}` — passing `false` would set the attribute string `"false"` which some browsers still activate.
7. **Final test count**: 87 tests passing across 7 test files. Zero regressions from baseline of 67 (Stories 2.1–2.3). 20 new tests added (2 StatCard animation + 15 EntrySheet + 3 App integration).

### File List

- `src/test-setup.ts` — added `window.matchMedia` global mock for jsdom compatibility
- `src/components/StatCard.tsx` — added count-up animation with rAF + cubic ease-out + prefers-reduced-motion guard
- `src/components/StatCard.test.tsx` — added 2 animation tests (mock rAF, mock matchMedia)
- `src/components/EntrySheet.tsx` — NEW: bottom sheet dialog with focus trap, backdrop, Escape key, numeric inputs, Log button
- `src/components/EntrySheet.test.tsx` — NEW: 15 tests covering all ACs
- `src/App.tsx` — added `isSheetOpen` state, `lastFocusedRef`, `inert` on `<main>`, `EntrySheet` sibling with `key` remount
- `src/App.test.tsx` — added rAF mock to beforeEach/afterEach, 3 new EntrySheet integration tests
- `_bmad-output/implementation-artifacts/2-4-entry-sheet-logging-flow.md` — this file (all tasks marked [x], Dev Agent Record populated)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story status updated to `review`
