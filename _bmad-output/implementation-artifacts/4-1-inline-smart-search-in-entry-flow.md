# Story 4.1: Inline Smart Search in Entry Flow

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to quickly look up a food's calorie and sugar content from within the entry flow,
so that I can make a more informed estimate without leaving the app or losing my place.

## Acceptance Criteria

1. **Given** the EntrySheet is open, **When** the smart search field renders, **Then** a text input field is displayed above the calorie and sugar fields in the EntrySheet.
2. The field has the same input styling (Warm Linen background, Sand Mist border, radius-sm) with a search affordance (magnifying glass icon button on the right side of the field).
3. The placeholder text reads "Search food (e.g. chicken rice)" in Dusty Tan.
4. The tab order is updated to: Smart search -> Calories -> Sugar -> Log button.
5. The smart search field has a programmatic label accessible to screen readers (NFR14).

6. **Given** the user has typed a food name in the smart search field, **When** the user submits the search (presses Enter in the field or taps the search icon button), **Then** a new browser tab opens with a Google search URL pre-populated with the query using `window.open()` (FR18).
7. The query is URL-encoded using `encodeURIComponent()` before constructing the URL (NFR4).
8. No query data is logged, stored, or retained by the application (NFR6).
9. No user data is transmitted to any server other than the Google search URL opened in the new tab (NFR5).
10. `window.open()` is called with `'_blank'` target and `'noopener,noreferrer'` as the third argument (security best practice).
11. If the smart search field is empty or whitespace-only, submitting does nothing (no tab opens).

12. **Given** the user has opened a Google search in a new tab, **When** the user switches back to the app tab, **Then** the EntrySheet is still open with all previously entered field values preserved (FR17).
13. The calorie and sugar fields retain any values the user had entered before searching.
14. The smart search field retains its query text after switching back.
15. The user can continue entering or adjusting values and tap Log as normal.

16. **Given** the EntrySheet is open, **When** the user does not interact with the smart search field at all, **Then** the entry flow works identically -- smart search is fully optional and never required to log an entry (FR19).
17. The calorie field remains auto-focused when the sheet opens (unchanged behaviour).
18. The user can go directly to the calorie field, enter values, and tap Log without touching smart search.

## Tasks / Subtasks

- [ ] Task 1: Update `src/components/EntrySheet.tsx` -- add smart search state, ref, and handler (AC: #1, #2, #3, #6, #7, #8, #9, #10, #11)
  - [ ] Add `const [searchQuery, setSearchQuery] = useState('')` alongside existing `calories` / `sugar` state
  - [ ] Add `const smartSearchRef = useRef<HTMLInputElement>(null)` alongside existing refs
  - [ ] Reset `searchQuery` to `''` inside the `isOpen` useEffect (alongside existing `setCalories('')` / `setSugar('')` resets)
  - [ ] Add `handleSearch` function: trim query, guard on empty string, construct URL with `encodeURIComponent`, call `window.open(url, '_blank', 'noopener,noreferrer')`
  - [ ] Update focus trap `focusable` array: insert `smartSearchRef.current` as the FIRST element (before `caloriesRef.current`); `logButtonRef.current` remains last
  - [ ] Add the smart search JSX block ABOVE the calories `<div>` block -- see Implementation Guide
  - [ ] Keep auto-focus on `caloriesRef` (unchanged) -- the `setTimeout` in the `isOpen` useEffect stays pointing to `caloriesRef`

- [ ] Task 2: Update `src/components/EntrySheet.test.tsx` -- update broken tests, add new tests (AC: #1-#18)
  - [ ] UPDATE: `'Tab from Log button wraps focus back to Calories input'` -> now wraps to Smart Search input
  - [ ] UPDATE: `'Shift+Tab from Calories input wraps focus to Log button'` -> change to `'Shift+Tab from Smart Search input wraps focus to Log button'`
  - [ ] ADD: `'renders smart search field with placeholder "Search food (e.g. chicken rice)"'`
  - [ ] ADD: `'smart search field has an accessible label'` -- assert `getByLabelText(/search food/i)` returns the input
  - [ ] ADD: `'pressing Enter in smart search opens Google with URL-encoded query'` -- spy on `window.open`, type query, press Enter on input
  - [ ] ADD: `'clicking search icon button opens Google with URL-encoded query'` -- spy on `window.open`, type query, click search button
  - [ ] ADD: `'smart search with empty field does not open new tab'` -- spy on `window.open`, press Enter without typing, assert not called
  - [ ] ADD: `'smart search with whitespace-only query does not open new tab'`
  - [ ] ADD: `'smart search field resets to empty when sheet reopens'` -- open, type query, close, reopen, assert field empty
  - [ ] ADD: `'smart search field value is preserved while user enters calories and sugar'` -- type in search, change calories, assert search still has value
  - [ ] ADD: `'logging an entry works with or without smart search content'` -- fill search, fill calories/sugar, click Log, assert saveEntries called with correct values
  - [ ] Use `vi.spyOn(window, 'open').mockImplementation(() => null)` for window.open tests; restore with `vi.restoreAllMocks()` in `afterEach` or per-test cleanup

## Dev Notes

### What This Story Delivers

- **One component modified:** `src/components/EntrySheet.tsx` -- adds the smart search field and handler. No other source files change.
- **Smart search is additive:** All existing entry flow behaviour is unchanged. Smart search is a new optional field sitting above calories.
- **No new dependencies:** `window.open`, `encodeURIComponent`, and `useState`/`useRef` are all already available.
- **No new Tailwind tokens needed:** All design tokens used are already in `index.css`.
- **No new components:** Smart search lives entirely within EntrySheet; no separate component needed.
- **No context or storage changes:** Smart search queries are never persisted. `EntriesContext` and `storageService` are untouched.

### Current Project State (before this story)

171 tests passing across 12 test files (from Story 3.2 + code review fixes).

```
src/
  main.tsx                          Done
  App.tsx                           Done (unchanged this story)
  App.test.tsx                      Done (unchanged this story)
  index.css                         Done (unchanged this story -- all tokens present)
  types.ts                          Done (unchanged this story)
  test-setup.ts                     Done
  components/
    DateStreakRow.tsx               Done (unchanged)
    DateStreakRow.test.tsx          Done (unchanged)
    StatCard.tsx                   Done (unchanged)
    StatCard.test.tsx              Done (unchanged)
    EntrySheet.tsx                 <- UPDATE (add smart search field)
    EntrySheet.test.tsx            <- UPDATE (fix 2 broken tests + add ~9 new tests)
    EntryCard.tsx                  Done (unchanged)
    EntryCard.test.tsx             Done (unchanged)
    FAB.tsx                        Done (unchanged)
    FAB.test.tsx                   Done (unchanged)
    ErrorBoundary.tsx              Done (unchanged)
    ErrorBoundary.test.tsx         Done (unchanged)
    PillSelector.tsx               Done (unchanged)
    PillSelector.test.tsx          Done (unchanged)
    InsightsPanel.tsx              Done (unchanged)
    InsightsPanel.test.tsx         Done (unchanged)
  services/storageService.ts        Done (unchanged)
  services/storageService.test.ts   Done (unchanged)
  utils/calculations.ts             Done (unchanged)
  utils/calculations.test.ts        Done (unchanged)
  context/EntriesContext.tsx        Done (unchanged)
  context/EntriesContext.test.tsx   Done (unchanged)
```

### Architecture Compliance Rules (MANDATORY)

- **`storageService` is NOT touched** -- smart search queries are never persisted. `saveEntries` is never called for search queries.
- **`EntriesContext` is NOT touched** -- no new context state. Search query is local UI state in `EntrySheet` only.
- **`window.open` with `noopener,noreferrer`** -- prevents the new tab from accessing `window.opener`. Security best practice (also aligns with NFR5: no unintended data exposure via tab opener reference).
- **`encodeURIComponent()` is MANDATORY** -- per NFR4, all user input must be sanitised before use in URLs. Raw string concatenation is an XSS/injection vector.
- **No `console.log`** -- remove any debug statements before commit.
- **No `any` types** -- `searchQuery` is `string`, `handleSearch` returns `void`. All typed.
- **Tailwind only** -- no inline `style` objects, no custom CSS classes.
- **`window.open` is the sole external interaction** -- no `fetch`, no `XMLHttpRequest`, no analytics.
- **Smart search resets on sheet open** -- `setSearchQuery('')` in the `isOpen` useEffect. Prevents stale queries from previous sessions.
- **State persists across tab switches automatically** -- React state is in-memory. When the user switches to Google's tab and back, the React component tree is untouched; `searchQuery`, `calories`, and `sugar` state values are preserved. No special handling needed.

### Implementation Guide: Changes to `EntrySheet.tsx`

#### 1. New state and ref

Add alongside existing state declarations (top of component function body):

```typescript
const [searchQuery, setSearchQuery] = useState('');
```

Add alongside existing refs (below `logButtonRef`):

```typescript
const smartSearchRef = useRef<HTMLInputElement>(null);
```

#### 2. Reset searchQuery on open

Inside the existing `isOpen` useEffect, add alongside the existing resets:

```typescript
useEffect(() => {
  if (isOpen) {
    isClosingRef.current = false;
    setIsClosing(false);
    setCalories('');
    setSugar('');
    setSearchQuery('');  // ADD THIS LINE
    const timeoutId = setTimeout(() => {
      caloriesRef.current?.focus();  // auto-focus stays on calories
    }, 50);
    return () => clearTimeout(timeoutId);
  }
}, [isOpen]);
```

#### 3. handleSearch function

Add between `handleClose` and `handleLog`:

```typescript
const handleSearch = () => {
  const query = searchQuery.trim();
  if (!query) return;
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
};
```

**Why `trim()` before guard:** A user who accidentally presses Enter with only spaces should not open a blank Google search. Trim first, then check empty.

**Why `noopener,noreferrer`:** Prevents the opened Google tab from accessing `window.opener` (which would point to the app). Standard security practice for `_blank` targets. Does not affect user experience.

**Why no state change after `handleSearch`:** The search field value is preserved intentionally (per AC #14). The user can tweak the query and search again, or leave it as-is and fill in their numbers.

#### 4. Update focus trap

In the `isOpen` keyboard useEffect, update the `focusable` array:

```typescript
const focusable = [
  smartSearchRef.current,  // ADDED: first in trap (was caloriesRef)
  caloriesRef.current,
  sugarRef.current,
  logButtonRef.current,
].filter((el): el is HTMLElement => el !== null);
```

This changes the focus trap wrapping:
- **Tab from Log button** → wraps to Smart Search input (was: Calories)
- **Shift+Tab from Smart Search** → wraps to Log button (was: Shift+Tab from Calories → Log)
- All other Tab/Shift+Tab interactions fall through to browser natural order (correct)

**Note:** The search icon button (inside the field wrapper) is naturally focusable via Tab between Smart Search input and Calories input. It does NOT need to be in the `focusable` trap array -- the trap only guards the first/last boundary.

#### 5. Smart search JSX block

Add ABOVE the existing Calories `<div>` block, inside the sheet panel:

```tsx
{/* Smart search field */}
<div className="flex flex-col gap-1">
  <label htmlFor="entry-search" className="text-section-label font-semibold text-warm-stone">
    Search food
  </label>
  <div className="relative">
    <input
      ref={smartSearchRef}
      id="entry-search"
      type="text"
      placeholder="Search food (e.g. chicken rice)"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
      className="w-full bg-warm-linen border border-sand-mist rounded-sm px-4 py-3 pr-12 text-input-field font-medium text-espresso placeholder:text-dusty-tan focus:outline-none focus:border-soft-terracotta transition-colors"
    />
    <button
      type="button"
      aria-label="Search Google"
      onClick={handleSearch}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-stone hover:text-soft-terracotta transition-colors p-1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>
  </div>
</div>
```

**Why `pr-12` on the input:** Prevents the user's text from running under the search icon button (which is positioned absolutely at `right-3`).

**Why `aria-hidden="true"` on the SVG:** The button already has `aria-label="Search Google"`. The SVG is decorative within the button and should be hidden from assistive technology to avoid double-reading.

**Why `type="text"` (not `type="search"`):** `type="search"` adds browser-native clear buttons and styling inconsistencies across platforms. `type="text"` gives full control over appearance. The search affordance is provided by the explicit icon button.

**Why NO `inputMode="numeric"` on search field:** Unlike the calories/sugar fields, this is a text field. No numeric keyboard needed.

**Why label text "Search food":** Matches the UX spec placeholder context. The label is short and clear; the placeholder provides the example ("Search food (e.g. chicken rice)").

#### 6. Full updated component structure (summary)

The sheet panel content order becomes:
1. Handle bar (unchanged)
2. **Smart search field** (NEW) -- `<label>` + `<div relative>` + `<input>` + `<button>` (search icon)
3. Calories field (unchanged)
4. Sugar field (unchanged)
5. Log button (unchanged)

### Implementation Guide: Updated `EntrySheet.test.tsx`

#### Tests to UPDATE (2 existing tests break due to focus trap change)

**Before (BROKEN after adding smart search):**

```typescript
it('Tab from Log button wraps focus back to Calories input', () => {
  renderSheet();
  const logButton = screen.getByRole('button', { name: /log/i });
  logButton.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
  expect(document.activeElement).toBe(screen.getByPlaceholderText('e.g. 450'));
});

it('Shift+Tab from Calories input wraps focus to Log button', () => {
  renderSheet();
  const caloriesInput = screen.getByPlaceholderText('e.g. 450');
  caloriesInput.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(screen.getByRole('button', { name: /log/i }));
});
```

**After (FIXED):**

```typescript
it('Tab from Log button wraps focus to Smart Search input', () => {
  renderSheet();
  const logButton = screen.getByRole('button', { name: /log/i });
  logButton.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
  expect(document.activeElement).toBe(screen.getByPlaceholderText('Search food (e.g. chicken rice)'));
});

it('Shift+Tab from Smart Search input wraps focus to Log button', () => {
  renderSheet();
  const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
  searchInput.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(screen.getByRole('button', { name: /log/i }));
});
```

#### New tests to ADD (~9 tests)

```typescript
it('renders smart search field with correct placeholder', () => {
  renderSheet();
  expect(screen.getByPlaceholderText('Search food (e.g. chicken rice)')).toBeInTheDocument();
});

it('smart search field has an accessible label', () => {
  renderSheet();
  expect(screen.getByLabelText(/search food/i)).toBeInTheDocument();
});

it('pressing Enter in smart search opens Google with URL-encoded query', () => {
  const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  renderSheet();
  const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
  fireEvent.change(searchInput, { target: { value: 'chicken rice' } });
  fireEvent.keyDown(searchInput, { key: 'Enter' });
  expect(openSpy).toHaveBeenCalledWith(
    `https://www.google.com/search?q=${encodeURIComponent('chicken rice')}`,
    '_blank',
    'noopener,noreferrer'
  );
  openSpy.mockRestore();
});

it('clicking search icon button opens Google with URL-encoded query', () => {
  const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  renderSheet();
  const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
  fireEvent.change(searchInput, { target: { value: 'banana' } });
  fireEvent.click(screen.getByRole('button', { name: /search google/i }));
  expect(openSpy).toHaveBeenCalledWith(
    `https://www.google.com/search?q=${encodeURIComponent('banana')}`,
    '_blank',
    'noopener,noreferrer'
  );
  openSpy.mockRestore();
});

it('smart search with empty field does not open new tab', () => {
  const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  renderSheet();
  const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
  fireEvent.keyDown(searchInput, { key: 'Enter' });
  expect(openSpy).not.toHaveBeenCalled();
  openSpy.mockRestore();
});

it('smart search with whitespace-only query does not open new tab', () => {
  const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
  renderSheet();
  const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
  fireEvent.change(searchInput, { target: { value: '   ' } });
  fireEvent.keyDown(searchInput, { key: 'Enter' });
  expect(openSpy).not.toHaveBeenCalled();
  openSpy.mockRestore();
});

it('smart search field value is preserved while user fills in calories and sugar', () => {
  renderSheet();
  const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
  fireEvent.change(searchInput, { target: { value: 'salmon fillet' } });
  fireEvent.change(screen.getByPlaceholderText('e.g. 450'), { target: { value: '350' } });
  fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '0' } });
  expect(searchInput).toHaveValue('salmon fillet');
});

it('logging an entry works correctly regardless of smart search field content', () => {
  renderSheet();
  fireEvent.change(screen.getByPlaceholderText('Search food (e.g. chicken rice)'), {
    target: { value: 'pizza slice' },
  });
  fireEvent.change(screen.getByPlaceholderText('e.g. 450'), { target: { value: '600' } });
  fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '8' } });
  fireEvent.click(screen.getByRole('button', { name: /log/i }));
  expect(storageService.saveEntries).toHaveBeenCalledTimes(1);
  const saved = vi.mocked(storageService.saveEntries).mock.calls[0][0];
  expect(saved[0].calories).toBe(600);
  expect(saved[0].sugar).toBe(8);
});
```

**Note on `window.open` mock:** jsdom does not implement `window.open`. Use `vi.spyOn(window, 'open').mockImplementation(() => null)` per test, and call `openSpy.mockRestore()` after each assertion. Alternatively, add to `beforeEach`:

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [], status: 'available' });
  vi.mocked(storageService.saveEntries).mockReturnValue('available');
  // window.open is NOT globally mocked here -- spy per test for precise control
});
```

### Design System Token Reference (all already in `index.css`)

| Token | Tailwind class | Value |
| --- | --- | --- |
| Warm Linen | `bg-warm-linen` | #F3EDE4 |
| Sand Mist | `border-sand-mist` | #E8DFD3 |
| Soft Terracotta | `focus:border-soft-terracotta`, `hover:text-soft-terracotta` | #C4856C |
| Dusty Tan | `placeholder:text-dusty-tan` | #B5A898 |
| Warm Stone | `text-warm-stone` | #8C7E6F |
| Espresso | `text-espresso` | #3D3229 |
| radius-sm | `rounded-sm` | 8px |
| Input Field | `text-input-field` | 1.25rem (20px) / lh 1.3 |
| Section Label | `text-section-label` | 0.875rem (14px) / lh 1.3 |

**No new tokens needed. All tokens already defined.**

### Previous Story Intelligence (3.2 + Code Review Learnings)

1. **`fireEvent` not `userEvent`** -- `@testing-library/user-event` is NOT installed in this project. Use `fireEvent.change`, `fireEvent.click`, `fireEvent.keyDown` throughout. Confirmed in Story 3.2 debug log.
2. **`vi.clearAllMocks()` in `beforeEach`** -- already in `EntrySheet.test.tsx`. Preserves pattern, prevents mock contamination.
3. **`data-testid="sheet-panel"` exists** -- the `animationend` tests use `screen.getByTestId('sheet-panel')`. Do not remove this attribute from the sheet panel div.
4. **`tabIndex` roving for ARIA tabs** -- Story 3.2 code review added `tabIndex={period === selected ? 0 : -1}` to PillSelector buttons. The search icon button in EntrySheet does NOT need roving tabIndex (it's a standard action button, not a tab-pattern element).
5. **`z-10` on FAB** -- added in 3.2 code review to prevent FAB painting under InsightsPanel. EntrySheet already has `z-50` -- no change needed.
6. **Absolute positioned icon pattern** -- use `relative` on wrapper, `absolute right-3 top-1/2 -translate-y-1/2` on the icon button. Standard Tailwind pattern, no custom CSS needed.
7. **`vi.spyOn(window, 'open')`** -- jsdom stubs `window.open` as `undefined` by default. Spying on it with `.mockImplementation(() => null)` is the correct approach. Restore with `.mockRestore()` to avoid cross-test contamination.
8. **`onKeyDown` on input for Enter** -- use `fireEvent.keyDown(searchInput, { key: 'Enter' })` in tests. This fires the `onKeyDown` handler.
9. **`getByRole('button', { name: /search google/i })`** -- matches the `aria-label="Search Google"` on the search icon button. This is how tests will find the search trigger.
10. **Existing `EntrySheet.test.tsx` has 16 tests** -- 2 will be updated, ~9 will be added, for a total of ~23 EntrySheet tests. Total project test count: ~184 (171 baseline - 2 removed descriptions + 2 updated + 9 new).

### Git Intelligence

Recent commits:
```
9aec273 feat: entries context, calculations, StatCards, DateStreakRow (Stories 2.2-2.3)
8fea68e feat: storage service and data model (Story 2.1)
c6ea5e2 review: story 1.3 done — security headers, gitignore, story status
```

**Patterns confirmed:**
- Commits are pushed directly to `main` with conventional commit format: `feat: <description> (Story X.Y)`
- After code review approval, status is updated in sprint-status.yaml from `review` to `done`
- Story files are updated with all tasks checked, Dev Agent Record populated
- Suggested commit message: `feat: inline smart search in entry flow (Story 4.1)`

**Codebase patterns relevant to this story:**
- `EntrySheet.tsx` uses `useRef` for focus management (pattern already established -- `caloriesRef`, `sugarRef`, `logButtonRef`)
- `EntrySheet.tsx` uses `useState` for field values -- adding `searchQuery` follows the identical pattern
- Focus trap uses a `focusable` array with `first`/`last` guards -- adding `smartSearchRef` as first is a mechanical change
- `window.open` is the only external call per the architecture -- confirmed in Architecture Decision Document section "API & Communication Patterns"
- `encodeURIComponent` for Google URL -- confirmed in Architecture Decision Document section "Authentication & Security"

### Project Structure After This Story

```
src/
  components/
    EntrySheet.tsx         (UPDATED -- smart search field + state + handler + updated focus trap)
    EntrySheet.test.tsx    (UPDATED -- 2 tests fixed, ~9 tests added)
    [all other components] (UNCHANGED)
  [all other directories]  (UNCHANGED)
```

**Files NOT to touch this story:**
- `src/App.tsx` -- no changes needed; EntrySheet receives no new props
- `src/context/EntriesContext.tsx` -- smart search is not persisted
- `src/services/storageService.ts` -- smart search is not persisted
- `src/utils/calculations.ts` -- no new calculations needed
- `src/types.ts` -- no new types needed
- `src/index.css` -- all tokens already present
- `vercel.json`, `vite.config.ts`, `package.json` -- no changes

**Do NOT create in this story:**
- A new component for the search field (it lives inside EntrySheet)
- Any new localStorage keys
- Any analytics or logging for search queries
- Any server-side interaction

### Project Structure Notes

- The smart search field is co-located inside `EntrySheet.tsx` -- consistent with architecture's "one component per file" rule. No new file needed.
- No barrel re-exports -- `EntrySheet` is already imported directly in `App.tsx`.
- No new types in `src/types.ts` -- `string` is sufficient for `searchQuery`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1] -- Full acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4] -- Epic objectives: Smart Search
- [Source: _bmad-output/planning-artifacts/epics.md#Requirements Inventory] -- FR17 (inline smart search), FR18 (Google search in new tab), FR19 (optional), NFR4 (encodeURIComponent), NFR5 (no data transmission), NFR6 (no query retention), NFR14 (programmatic labels)
- [Source: _bmad-output/planning-artifacts/architecture.md#Authentication & Security] -- XSS prevention via encodeURIComponent, no outbound data except Google search URL
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns] -- "The only external interaction is opening a Google search URL in a new browser tab via window.open()"
- [Source: _bmad-output/planning-artifacts/architecture.md#Input Handling] -- "Smart search query: URL-encode with encodeURIComponent() before constructing Google URL"
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] -- No new state in context; field-level state stays in component
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Flow 4: Smart Search Assist] -- Full user flow, tab persistence behaviour
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Form Patterns] -- "Same input style with search affordance", placeholder text, tab order
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy - EntrySheet] -- Anatomy: Handle bar + Smart search + Calorie + Sugar + Log
- [Source: src/components/EntrySheet.tsx] -- Current implementation (state, refs, focus trap, JSX structure)
- [Source: src/components/EntrySheet.test.tsx] -- Current test suite (16 tests, patterns to follow)
- [Source: _bmad-output/implementation-artifacts/3-2-insights-panel-with-pill-selector.md#Debug Log] -- userEvent not installed; use fireEvent throughout
- [Source: _bmad-output/implementation-artifacts/3-2-insights-panel-with-pill-selector.md#Senior Developer Review] -- tabIndex roving for ARIA tabs, z-index on FAB

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

### File List
