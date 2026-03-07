# Story 2.6: FAB & Error Handling

Status: done

## Story

As a user,
I want an always-visible add button and graceful handling when my browser can't save data,
so that I always have a clear way to add entries and understand if something prevents data persistence.

## Acceptance Criteria

1. **Given** the main screen is displayed, **When** the FAB renders, **Then** a 56x56px circular button is displayed fixed at bottom-right, 24px from both edges, with Soft Terracotta background and a white `+` icon centred.
2. The FAB has `aria-label="Add entry"`, is keyboard focusable, and activates on Enter/Space.
3. Hover state: Deep Terracotta background + `scale(1.08)` transform (~150ms ease-out transition).
4. Focus state: 2px Soft Terracotta outline, 2px offset — already handled globally in `index.css` via `*:focus-visible`.
5. **Given** the FAB is displayed, **When** the user taps/clicks it, **Then** the EntrySheet opens — identical behaviour to tapping a StatCard (FR4).
6. **Given** an `ErrorBoundary` wraps the App content, **When** an unhandled React render error occurs, **Then** it displays: "Something went wrong. Please refresh." on a Cream background. The ErrorBoundary does not interact with the data layer.
7. **Given** the app detects localStorage is unavailable or quota-exceeded, **When** `storageStatus !== 'available'`, **Then** an inline calm message is displayed: "Your browser can't save data right now. Try opening this page in a regular browser window." — Dusty Tan text, centred, no modal.
8. The app remains fully usable when storage is unavailable — entries work in memory via context, just not persisted (NFR16).

## Tasks / Subtasks

- [x] Task 1: Create `src/components/FAB.tsx` (AC: #1, #2, #3, #4, #5)
  - [x] Props interface: `{ onClick: () => void }`
  - [x] Render `<button type="button" aria-label="Add entry" onClick={onClick}>`
  - [x] Classes: `fixed bottom-6 right-6 w-14 h-14 rounded-full bg-soft-terracotta text-cream flex items-center justify-center text-2xl hover:bg-deep-terracotta hover:scale-[1.08] active:scale-[0.97] transition-all duration-150 ease-out`
  - [x] Inner `<span aria-hidden="true" className="leading-none">+</span>` (aria-hidden prevents double-announcement; aria-label on button provides accessible name)
- [x] Task 2: Create `src/components/FAB.test.tsx` (AC: #1, #2, #3, #5)
  - [x] No mocks needed — FAB is a pure presentational component with no context/storage dependency
  - [x] Test: renders button with `aria-label="Add entry"` (`getByRole('button', { name: 'Add entry' })`)
  - [x] Test: calls `onClick` when clicked
  - [x] Test: has fixed position classes (`fixed`, `bottom-6`, `right-6`)
  - [x] Test: is circle shape (`rounded-full`, `w-14`, `h-14`)
  - [x] Test: has `bg-soft-terracotta` class
  - [x] Test: displays `+` icon (`getByText('+')`)
- [x] Task 3: Create `src/components/ErrorBoundary.tsx` (AC: #6)
  - [x] Must be a React class component — Error Boundaries REQUIRE class components (no hooks alternative)
  - [x] State: `{ hasError: boolean }`, initialized `{ hasError: false }`
  - [x] `static getDerivedStateFromError(): ErrorBoundaryState { return { hasError: true }; }`
  - [x] No `componentDidCatch` needed (no logging in this app)
  - [x] Fallback JSX: `<div className="min-h-dvh bg-cream flex items-center justify-center p-6"><p className="text-espresso text-center">Something went wrong. Please refresh.</p></div>`
  - [x] When `hasError` is false: `return this.props.children`
  - [x] Props: `{ children: ReactNode }`, import `Component` and `ReactNode` from `'react'`
  - [x] No test file required (class component error boundaries are difficult to test with RTL; not listed in architecture)
- [x] Task 4: Update `src/App.tsx` (AC: #1, #5, #6, #7, #8)
  - [x] Add import: `import { FAB } from './components/FAB'`
  - [x] Add import: `import { ErrorBoundary } from './components/ErrorBoundary'`
  - [x] In `AppContent`: add `storageStatus` to destructure from `useEntries()` (already exported by context)
  - [x] In `AppContent` JSX — inside `<main>`, after the history list `<ul>`, add `<FAB onClick={handleOpenSheet} />`
  - [x] In `AppContent` JSX — inside `<main>`, between StatCards grid and history list, add storage message (see exact JSX below)
  - [x] In `App()`: wrap `<EntriesProvider>` with `<ErrorBoundary>` as outermost wrapper
  - [x] Do NOT add any new state or props — `handleOpenSheet` already exists and is passed to FAB
- [x] Task 5: Update `src/App.test.tsx` (AC: #1, #5, #7)
  - [x] **CRITICAL UPDATE**: Change `expect(buttons).toHaveLength(2)` → `toHaveLength(3)` in `'renders two stat card buttons'` test (FAB adds a 3rd button)
  - [x] Add test: FAB button renders with `aria-label="Add entry"`
  - [x] Add test: clicking the FAB opens the EntrySheet dialog
  - [x] Add test: storage unavailable message appears when `loadEntries` returns `status: 'unavailable'`
  - [x] Add test: no storage message when storage is available
- [x] Task 6: Run `npm test` — all tests passing, zero regressions

## Dev Notes

### What This Story Delivers

- **FAB** (`src/components/FAB.tsx`): always-visible fixed add button (FR4 — dedicated add trigger)
- **ErrorBoundary** (`src/components/ErrorBoundary.tsx`): catches React render errors at App level
- **Storage unavailable message**: inline calm message when localStorage is inaccessible (NFR16)

**What is NOT in this story:**
- InsightsPanel / PillSelector (Story 3.2) — FAB position note: bottom-right `bottom-6 right-6` is fine for now; in Story 3.2, FAB will be repositioned above the InsightsPanel
- StreakCalculation (Story 3.1)
- Smart search (Story 4.1)

### Current Project State (after Story 2.5)

```
src/
  main.tsx                          ✅ React entry point
  App.tsx                           <- UPDATE (FAB, ErrorBoundary, storageStatus, storage message)
  App.test.tsx                      <- UPDATE (fix 2→3 buttons, add FAB/storage tests)
  index.css                         ✅ all tokens done including card-fade-in (Story 2.5)
  types.ts                          ✅ Entry, InsightPeriod, StorageStatus = 'available' | 'unavailable' | 'quota-exceeded'
  test-setup.ts                     ✅ window.matchMedia global mock
  components/
    DateStreakRow.tsx               ✅ DONE (Story 2.3)
    DateStreakRow.test.tsx          ✅ DONE (Story 2.3)
    StatCard.tsx                   ✅ DONE (Story 2.4)
    StatCard.test.tsx              ✅ DONE (Story 2.4)
    EntrySheet.tsx                 ✅ DONE (Story 2.4)
    EntrySheet.test.tsx            ✅ DONE (Story 2.4)
    EntryCard.tsx                  ✅ DONE (Story 2.5)
    EntryCard.test.tsx             ✅ DONE (Story 2.5)
    FAB.tsx                        <- CREATE THIS STORY
    FAB.test.tsx                   <- CREATE THIS STORY
    ErrorBoundary.tsx              <- CREATE THIS STORY (no test file)
  services/storageService.ts        ✅ DONE (Story 2.1)
  utils/calculations.ts             ✅ DONE (Story 2.2)
  context/EntriesContext.tsx        ✅ DONE (Story 2.2) — exports { entries, addEntry, storageStatus }
```

**Test count baseline:** 100 tests passing across 8 test files (Story 2.5 final state).

### Architecture Compliance Rules (MANDATORY)

- **FAB is a pure presentational component** — it receives `onClick` as a prop and renders a button. It NEVER calls `useEntries()`, never touches localStorage, never imports from context.
- **FAB belongs inside `<main>` in the DOM** — even though it's `position: fixed` (renders visually at bottom-right regardless of DOM location), placing it inside `<main>` means it becomes `inert` when `isSheetOpen` is true. This prevents the user from clicking FAB while the sheet is already open. Do NOT place FAB outside `<main>`.
- **ErrorBoundary wraps everything** — it must be outermost in `App()`, wrapping `<EntriesProvider>`. This ensures any React render error in any component (including providers) is caught.
- **`storageStatus` is already in context** — `useEntries()` returns `{ entries, addEntry, storageStatus }`. Do NOT add any new context values or new state. Just destructure `storageStatus` in `AppContent`.
- **`StorageStatus` condition**: use `storageStatus !== 'available'` (not `=== 'unavailable'`) — this covers both `'unavailable'` and `'quota-exceeded'` states defined in `types.ts`.
- **Tailwind only** — no custom CSS, no inline style objects, no CSS modules.
- **No `any` types** — type all props explicitly.
- **No `console.log`** — remove before commit.
- **No new dependencies** — all tooling (React class components, Tailwind) is already in place.

### Implementation Guide: `FAB.tsx`

```tsx
// src/components/FAB.tsx

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      type="button"
      aria-label="Add entry"
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-soft-terracotta text-cream flex items-center justify-center text-2xl hover:bg-deep-terracotta hover:scale-[1.08] active:scale-[0.97] transition-all duration-150 ease-out"
    >
      <span aria-hidden="true" className="leading-none">+</span>
    </button>
  );
}
```

**Why `text-2xl` for the `+`:** 24px (1.5rem) in a 56px circle gives the right visual weight without being oversized.

**Why `aria-hidden="true"` on `<span>`:** The `aria-label="Add entry"` on `<button>` provides the complete accessible name. The `+` text is visible decoration only — hiding it from AT prevents double-announcement.

**Why `leading-none`:** Removes default line-height that could push the `+` off-centre in the flex container. With `flex items-center justify-center` on the button, `leading-none` ensures precise vertical centring.

**Why `transition-all duration-150 ease-out`:** Matches UX spec "~150ms ease-out" for hover/active transitions. `transition-all` covers both `background-color` (hover) and `transform` (hover scale, active scale).

**Why `bottom-6 right-6`:** Tailwind `bottom-6` = `1.5rem` = `24px`, `right-6` = `24px`. Matches UX spec "24px from the edges". ✓

**Why `active:scale-[0.97]`:** UX spec says "scale(0.97) active state". Tailwind v4 supports `active:scale-[0.97]` with arbitrary value. ✓

**Note on `prefers-reduced-motion`:** The global `@media (prefers-reduced-motion: reduce)` rule in `index.css` sets `transition-duration: 0.01ms !important` — this makes all FAB transitions instant when reduced motion is active. No JS-side check needed.

### Implementation Guide: `ErrorBoundary.tsx`

```tsx
// src/components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh bg-cream flex items-center justify-center p-6">
          <p className="text-espresso text-center">Something went wrong. Please refresh.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**Why class component:** React Error Boundaries are exclusively class components — there is no hook-based equivalent (as of React 19). `getDerivedStateFromError` is only available on class components.

**Why no `componentDidCatch`:** Used for logging (Sentry, etc.). This app has no logging service, so it's omitted.

**Why `min-h-dvh`:** Consistent with `body { min-height: 100dvh }` in `index.css`. The fallback fills the full viewport.

**No test file:** ErrorBoundary class components require `react-error-boundary` or complex render-throw test setups. Not required per architecture. The component is intentionally minimal and correct-by-inspection.

### Implementation Guide: `App.tsx` Changes

Add to imports at top:
```tsx
import { FAB } from './components/FAB';
import { ErrorBoundary } from './components/ErrorBoundary';
```

In `AppContent`, update destructure:
```tsx
const { entries, storageStatus } = useEntries();
```

In `AppContent` JSX, add storage message between StatCards grid and history list, and add FAB at end of `<main>`:
```tsx
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
  {storageStatus !== 'available' && (
    <p className="text-dusty-tan text-center text-sm">
      Your browser can't save data right now. Try opening this page in a regular browser window.
    </p>
  )}
  {todayEntries.length > 0 && (
    <ul className="flex flex-col gap-2">
      {[...todayEntries].reverse().map(entry => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </ul>
  )}
  <FAB onClick={handleOpenSheet} />
</main>
```

Update `App()`:
```tsx
function App() {
  return (
    <ErrorBoundary>
      <EntriesProvider>
        <AppContent />
      </EntriesProvider>
    </ErrorBoundary>
  );
}
```

### Implementation Guide: `FAB.test.tsx`

```tsx
// src/components/FAB.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FAB } from './FAB';

describe('FAB', () => {
  it('renders a button with aria-label "Add entry"', () => {
    render(<FAB onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Add entry' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<FAB onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add entry' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has fixed positioning classes', () => {
    render(<FAB onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Add entry' });
    expect(btn).toHaveClass('fixed', 'bottom-6', 'right-6');
  });

  it('is a circle shape with correct size', () => {
    render(<FAB onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Add entry' });
    expect(btn).toHaveClass('rounded-full', 'w-14', 'h-14');
  });

  it('has soft-terracotta background', () => {
    render(<FAB onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Add entry' });
    expect(btn).toHaveClass('bg-soft-terracotta');
  });

  it('displays a + icon', () => {
    render(<FAB onClick={vi.fn()} />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });
});
```

**Why no `vi.mock` or `vi.clearAllMocks`:** FAB has zero dependencies — no context, no storage, no async. A plain render with a `vi.fn()` prop is sufficient.

**Why `{ name: 'Add entry' }` (not regex):** StatCard aria-labels start with "Add entry. Today's calories..." — an exact string match `'Add entry'` isolates the FAB button uniquely.

### Implementation Guide: `App.test.tsx` Changes

**CRITICAL UPDATE — must apply first:**
```typescript
// Change this existing test:
it('renders two stat card buttons', () => {
  render(<App />);
  const buttons = screen.getAllByRole('button');
  expect(buttons).toHaveLength(2);  // ← CHANGE to 3
});
```

After the change:
```typescript
it('renders two stat card buttons and the FAB', () => {
  render(<App />);
  const buttons = screen.getAllByRole('button');
  expect(buttons).toHaveLength(3);  // 2 stat cards + 1 FAB
});
```

**New tests to add to the existing `describe('App', ...)` block:**
```typescript
it('renders the FAB button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: 'Add entry' })).toBeInTheDocument();
});

it('clicking the FAB opens the EntrySheet dialog', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Add entry' }));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

it('shows storage unavailable message when storage cannot save', () => {
  vi.mocked(storageService.loadEntries).mockReturnValue({
    entries: [],
    status: 'unavailable',
  });
  render(<App />);
  expect(screen.getByText(/can't save data right now/i)).toBeInTheDocument();
});

it('does not show storage message when storage is available', () => {
  render(<App />);
  expect(screen.queryByText(/can't save data right now/i)).not.toBeInTheDocument();
});
```

**Why existing tests still pass after FAB is added:**
- Tests using `screen.getAllByRole('button')[0]` (clicking StatCard) still work — DOM order is: [0] Calories, [1] Sugar, [2] FAB. FAB is last, so index 0 still targets Calories StatCard. ✓
- `'renders no history list when there are no entries'`: no list = no FAB impact ✓
- `'main element has inert attribute while sheet is open'`: FAB inside `<main>` becomes inert too — correct behaviour ✓

### Design System Token Reference

| Token | Tailwind class | Value |
| --- | --- | --- |
| Soft Terracotta | `bg-soft-terracotta` | #C4856C |
| Deep Terracotta | `hover:bg-deep-terracotta` | #A96E57 |
| Cream (fallback bg) | `bg-cream` | #FAF7F2 |
| Dusty Tan (storage msg) | `text-dusty-tan` | #B5A898 |
| Espresso (error text) | `text-espresso` | #3D3229 |
| FAB size | `w-14 h-14` | 56px × 56px |
| FAB offset | `bottom-6 right-6` | 24px × 24px |
| FAB shape | `rounded-full` | 9999px radius |
| Focus outline | global `*:focus-visible` in `index.css` | 2px Soft Terracotta, 2px offset |

### Previous Story Intelligence (Stories 2.1–2.5 Learnings)

1. **`vi.clearAllMocks()` in `beforeEach`** — CRITICAL: prevents cross-test mock call count accumulation. Already in `App.test.tsx` beforeEach — do not remove it.
2. **rAF mock in `App.test.tsx` `beforeEach`** — MANDATORY for any App-level test that triggers entry logging (StatCard count-up). Already present — do not remove it.
3. **`fireEvent(screen.getByTestId('sheet-panel'), new Event('animationend', { bubbles: true }))`** — Required to fully close the EntrySheet in tests. The real EntrySheet uses `isClosing` state + `animationend` to call `onClose`. Existing tests already demonstrate this pattern.
4. **`vi.mocked(storageService.saveEntries).mockReturnValue('available')`** — Already in `beforeEach`. When logging entries in tests, `addEntry` calls `saveEntries`. ✓
5. **`getByRole('button', { name: 'Add entry' })`** — Exact string match needed to isolate FAB from StatCards (whose aria-labels start with "Add entry. Today's calories..."). Regex `/add entry/i` would match all 3 buttons.
6. **Do NOT use `getAllByRole('button')[2]` in tests** — Use `getByRole('button', { name: 'Add entry' })` for FAB. Index-based queries are fragile; name-based are intention-revealing.
7. **EntrySheet `data-testid="sheet-panel"`** — Already exists in `EntrySheet.tsx`. Use when tests need to dispatch `animationend`.
8. **ErrorBoundary wraps outside `EntriesProvider`** — If provider itself throws (unlikely, but possible), the boundary catches it. Correct nesting: `<ErrorBoundary><EntriesProvider>...</EntriesProvider></ErrorBoundary>`.
9. **FAB inside `<main>` for inert propagation** — This is a deliberate architectural decision for accessibility. When the sheet is open, `<main inert>` makes ALL children (including FAB) non-interactive, preventing the user from opening a second sheet. Do NOT place FAB after `</main>`.
10. **Commit pattern:** `feat: FAB, ErrorBoundary, storage message (Story 2.6)` — conventional commits, direct to `main`.

### Git Intelligence

Recent commits (at story start):
```
9aec273 feat: entries context, calculations, StatCards, DateStreakRow (Stories 2.2-2.3)
8fea68e feat: storage service and data model (Story 2.1)
```
(Stories 2.4 and 2.5 work is uncommitted but exists in working tree)

**Patterns confirmed in codebase:**
- `useEntries()` returns `{ entries, addEntry, storageStatus }` — verified in `EntriesContext.tsx:5-8`
- `StorageStatus = 'available' | 'unavailable' | 'quota-exceeded'` — verified in `types.ts:10`
- `storageStatus` already updated on `addEntry` if save fails — `EntriesContext.tsx:31-33`
- `EntrySheet` uses `isClosing` state + native `animationend` listener on `data-testid="sheet-panel"` — verified in `EntrySheet.tsx:88-99`
- `handleOpenSheet` captures `document.activeElement` → `lastFocusedRef.current` — FAB tap returns focus to FAB on sheet close ✓
- `inert` is set on `<main>` (not a wrapper div) — `App.tsx:31`

**Suggested commit message:** `feat: FAB, ErrorBoundary, storage message (Story 2.6)`

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
    EntryCard.tsx           (unchanged)
    EntryCard.test.tsx      (unchanged)
    FAB.tsx                 (NEW)
    FAB.test.tsx            (NEW)
    ErrorBoundary.tsx       (NEW — no test file)
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
  App.tsx                   (UPDATED — FAB import, ErrorBoundary import, storageStatus, storage message, ErrorBoundary wrapper)
  App.test.tsx              (UPDATED — fix 2→3 buttons, 4 new tests)
  index.css                 (unchanged — all tokens already present)
```

**Files NOT to touch this story:**
- `src/utils/calculations.ts` — do NOT add `getStreak` or `getAverages`
- `src/services/storageService.ts` — already complete
- `src/context/EntriesContext.tsx` — already complete
- `src/index.css` — all tokens done, including `prefers-reduced-motion` and focus rules
- All existing component files — zero modifications needed
- `vercel.json`, `vite.config.ts`, `package.json` — no changes

**Do NOT create in this story:**
- `InsightsPanel.tsx` (Story 3.2)
- `PillSelector.tsx` (Story 3.2)
- `DateStreakRow` streak update (Story 3.1)

### Project Structure Notes

- `FAB.tsx` → `src/components/` — one component per file, co-located test ✓
- `ErrorBoundary.tsx` → `src/components/` — per architecture directory structure spec ✓
- No barrel re-exports — `components/` still has fewer than ~8 files, threshold not reached ✓

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.6] — Full acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory] — FR4, NFR16
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] — 7 UI components including FAB, ErrorBoundary; component boundaries table
- [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines] — Anti-patterns, no direct localStorage in components
- [Source: _bmad-output/planning-artifacts/architecture.md#Complete Project Directory Structure] — ErrorBoundary.tsx in components/, no test file
- [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling] — ErrorBoundary at App level, calm localStorage message pattern
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md] — FAB 56px, Soft Terracotta, scale(1.08), 150ms ease-out
- [Source: src/context/EntriesContext.tsx#L5-8] — StorageStatus in context value
- [Source: src/types.ts#L10] — StorageStatus union type
- [Source: src/App.tsx] — Current implementation baseline (stories 2.2–2.5 applied)
- [Source: src/components/EntrySheet.tsx#L88-99] — animationend pattern for test guidance
- [Source: src/App.test.tsx] — Existing test patterns, rAF mock, animationend usage

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — implementation completed cleanly on first run. 110 tests pass across 9 test files.

### Completion Notes List

1. **FAB pure component** — `FAB.tsx` has zero dependencies (no context, no storage). Receives `onClick` prop; passes `handleOpenSheet` from `AppContent`. Focus returns to FAB after sheet close via existing `lastFocusedRef` mechanism.
2. **FAB inside `<main>` for inert propagation** — DOM placement in `<main>` means FAB becomes non-interactive when `inert` is set (sheet open). Prevents double-open. `position: fixed` CSS ensures visual placement at `bottom-6 right-6` regardless of DOM parent.
3. **ErrorBoundary class component** — React class component required; no hooks alternative. `getDerivedStateFromError` catches all render errors. No `componentDidCatch` needed (no logging service).
4. **`storageStatus !== 'available'` condition** — Covers both `'unavailable'` and `'quota-exceeded'` StorageStatus values from `types.ts`. Inline calm message in Dusty Tan text, no modal.
5. **App test regression fixed** — `'renders two stat card buttons'` updated from `toHaveLength(2)` to `toHaveLength(3)` (StatCard×2 + FAB). All 100 pre-existing tests continue to pass.
6. **Final test count: 114** — 100 baseline + 6 FAB + 5 App integration + 3 ErrorBoundary = 114. All 10 test files pass.

### File List

- `src/components/FAB.tsx` — NEW: fixed circular button, 56px, Soft Terracotta, aria-label, hover/active states
- `src/components/FAB.test.tsx` — NEW: 6 tests covering aria-label, onClick, positioning, shape, colour, icon
- `src/components/ErrorBoundary.tsx` — NEW: React class component, catches render errors, Cream fallback screen
- `src/components/ErrorBoundary.test.tsx` — NEW: 3 tests covering children render, error fallback, error state isolation
- `src/App.tsx` — UPDATED: FAB + ErrorBoundary imports, storageStatus destructure, storage message with `role="status"`, FAB in JSX, ErrorBoundary wrapper, `pb-24` for FAB clearance
- `src/App.test.tsx` — UPDATED: fixed button count (2→3), 5 new tests (FAB renders, FAB opens sheet, storage unavailable, quota-exceeded, storage available)
- `_bmad-output/implementation-artifacts/2-6-fab-error-handling.md` — story file (tasks marked [x], Dev Agent Record populated)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story status updated to `done`

## Senior Developer Review (AI)

**Reviewer:** claude-opus-4-6
**Date:** 2026-03-06
**Outcome:** Approve (after fixes applied)

### AC Validation

All 8 Acceptance Criteria verified as IMPLEMENTED against actual source code.

### Issues Found: 0 High, 3 Medium, 3 Low

### Action Items

- [x] [M1] Missing `padding-bottom` on `<main>` — FAB overlays last entry card when list is long. Fixed by adding `pb-24` (96px) to `<main>` classes.
- [x] [M2] No test for `quota-exceeded` storage status — only `'unavailable'` was tested. Fixed by adding dedicated quota-exceeded test case in App.test.tsx.
- [x] [M3] ErrorBoundary has zero test coverage — safety-critical component untested. Fixed by creating ErrorBoundary.test.tsx with 3 tests (children render, error fallback, error state isolation).
- [x] [L1] Storage message missing `role="status"` for screen reader announcement. Fixed by adding `role="status"` to the `<p>` element.
- [ ] [L2] `text-cream` on FAB `+` icon has borderline contrast (~2.6:1 vs 3:1 AA). Inherited UX design pattern — same combination used on Log button. Not fixed (requires design system change).
- [ ] [L3] `text-sm` on storage message is undocumented design decision. Not fixed (reasonable choice, informational only).

### Change Log

- Code review fixes applied: 3 MEDIUM + 1 LOW issues resolved (2026-03-06)
