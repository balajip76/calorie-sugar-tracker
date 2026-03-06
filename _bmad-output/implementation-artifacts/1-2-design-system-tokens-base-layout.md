# Story 1.2: Design System Tokens & Base Layout

Status: done

## Story

As a developer,
I want the complete design system (colours, typography, spacing, radii) configured as Tailwind tokens and the base app layout shell in place,
so that all future components share a consistent visual foundation from the start.

## Acceptance Criteria

1. **Given** the scaffolded project from Story 1.1, **When** the design tokens are configured in `src/index.css` as CSS custom properties consumed by Tailwind, **Then** the "Warm Quiet" colour palette is available: Cream (#FAF7F2), Warm Linen (#F3EDE4), Sand Mist (#E8DFD3), Espresso (#3D3229), Warm Stone (#8C7E6F), Dusty Tan (#B5A898), Soft Terracotta (#C4856C), Deep Terracotta (#A96E57), Rose Blush (#F0DDD6), Warm Amber (#D4A574).
2. Plus Jakarta Sans is loaded from Google Fonts with weights 400, 500, 600, 700.
3. The typography scale is defined: Hero Total (48px/700), Section Label (14px/600), Entry Value (18px/500), Entry Meta (13px/400), Input Field (20px/500), Button (16px/600), Streak (14px/500).
4. Spacing tokens are available: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px).
5. Border radius tokens are available: sm (8px), md (12px), lg (16px), pill (9999px).
6. The shadow token is defined: `shadow-sheet` = `0 -4px 24px rgba(61,50,41,0.08)`.
7. `App.tsx` renders a base layout shell: single column, `max-w-[480px] mx-auto`, Cream background extending to viewport edges, responsive padding (`px-6 md:px-8`).
8. The app background is Cream (#FAF7F2) across the full viewport.
9. Focus indicator style is defined: 2px Soft Terracotta outline, 2px offset.
10. `prefers-reduced-motion` media query is set up to disable transitions when active.

## Tasks / Subtasks

- [x] Task 1: Define colour palette tokens in index.css (AC: #1)
  - [x] Add Tailwind v4 `@theme` block to `src/index.css` after the `@import "tailwindcss";` line
  - [x] Define all 10 colour tokens as `--color-*` custom properties inside the `@theme` block
- [x] Task 2: Load Plus Jakarta Sans font (AC: #2)
  - [x] Add Google Fonts `@import` for Plus Jakarta Sans (weights 400, 500, 600, 700) to `src/index.css` BEFORE the `@import "tailwindcss"` line
  - [x] Set Plus Jakarta Sans as the default font-family in the `@theme` block via `--font-sans`
- [x] Task 3: Define typography scale tokens (AC: #3)
  - [x] Create utility classes or CSS custom properties for the 7 typography levels in `src/index.css`
  - [x] Typography levels: hero-total (48px/700), section-label (14px/600), entry-value (18px/500), entry-meta (13px/400), input-field (20px/500), button (16px/600), streak (14px/500)
- [x] Task 4: Define spacing tokens (AC: #4)
  - [x] Add spacing tokens in the `@theme` block: `--spacing-xs: 4px`, `--spacing-sm: 8px`, `--spacing-md: 16px`, `--spacing-lg: 24px`, `--spacing-xl: 32px`, `--spacing-2xl: 48px`
- [x] Task 5: Define border radius tokens (AC: #5)
  - [x] Add radius tokens in the `@theme` block: `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-lg: 16px`, `--radius-pill: 9999px`
- [x] Task 6: Define shadow token (AC: #6)
  - [x] Add shadow token in the `@theme` block: `--shadow-sheet: 0 -4px 24px rgba(61,50,41,0.08)`
- [x] Task 7: Create base App layout shell (AC: #7, #8)
  - [x] Update `App.tsx` to render: `<main>` element with `max-w-[480px] mx-auto px-6 md:px-8` classes
  - [x] Set full-viewport Cream background via `<body>` or root-level CSS in `index.css`
  - [x] Ensure background extends to viewport edges beyond the 480px container
- [x] Task 8: Define focus indicator styles (AC: #9)
  - [x] Add global focus-visible styles in `index.css`: 2px Soft Terracotta (#C4856C) outline, 2px offset
- [x] Task 9: Set up prefers-reduced-motion (AC: #10)
  - [x] Add `@media (prefers-reduced-motion: reduce)` rule in `index.css` that disables all transitions and animations
- [x] Task 10: Update App test (AC: #7)
  - [x] Update `src/App.test.tsx` to verify the base layout renders with the `<main>` element
  - [x] Run tests to confirm passing
- [x] Task 11: Verify build and visual output
  - [x] Run `npm run build` to confirm no errors
  - [x] Run `npm run dev` and visually confirm Cream background, Plus Jakarta Sans font rendering, and 480px centred layout

## Dev Notes

### Tailwind CSS v4 Configuration -- CRITICAL

Tailwind v4 does NOT use `tailwind.config.js`. All configuration is done in CSS.

**How to define design tokens in Tailwind v4:**

```css
@import "tailwindcss";

@theme {
  --color-cream: #FAF7F2;
  --color-warm-linen: #F3EDE4;
  /* ... more colours ... */

  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;

  --spacing-xs: 4px;
  /* ... more spacing ... */

  --radius-sm: 8px;
  /* ... more radii ... */

  --shadow-sheet: 0 -4px 24px rgba(61,50,41,0.08);
}
```

Once defined in `@theme`, these become available as Tailwind utilities:
- `bg-cream`, `text-espresso`, `border-sand-mist`
- `p-spacing-md`, `gap-spacing-sm`
- `rounded-sm`, `rounded-pill`
- `shadow-sheet`
- `font-sans` (applies Plus Jakarta Sans)

**CRITICAL: Google Fonts import MUST come BEFORE `@import "tailwindcss"`** so the font is available when Tailwind processes.

### Colour Palette -- "Warm Quiet"

| Token Name | Hex | Tailwind Class | Usage |
|---|---|---|---|
| cream | #FAF7F2 | bg-cream | App background |
| warm-linen | #F3EDE4 | bg-warm-linen | Card backgrounds |
| sand-mist | #E8DFD3 | border-sand-mist | Borders, dividers |
| espresso | #3D3229 | text-espresso | Primary text, headings |
| warm-stone | #8C7E6F | text-warm-stone | Secondary text |
| dusty-tan | #B5A898 | text-dusty-tan | Placeholders, disabled |
| soft-terracotta | #C4856C | bg-soft-terracotta | Buttons, accents |
| deep-terracotta | #A96E57 | bg-deep-terracotta | Hover states |
| rose-blush | #F0DDD6 | bg-rose-blush | Active highlights |
| warm-amber | #D4A574 | text-warm-amber | Streak counter |

### Typography Scale

| Level | Size | Weight | Line Height | Tailwind Approach |
|---|---|---|---|---|
| Hero Total | 48px (3rem) | 700 | 1.1 | Custom class or direct utilities |
| Section Label | 14px (0.875rem) | 600 | 1.3 | Custom class or direct utilities |
| Entry Value | 18px (1.125rem) | 500 | 1.4 | Custom class or direct utilities |
| Entry Meta | 13px (0.8125rem) | 400 | 1.4 | Custom class or direct utilities |
| Input Field | 20px (1.25rem) | 500 | 1.3 | Custom class or direct utilities |
| Button | 16px (1rem) | 600 | 1.0 | Custom class or direct utilities |
| Streak | 14px (0.875rem) | 500 | 1.0 | Custom class or direct utilities |

**Implementation approach:** Define these as Tailwind theme extensions or use direct utility classes inline (`text-[48px] font-bold leading-[1.1]`). For Story 1.2, define the tokens/variables. Component usage happens in later stories.

### Previous Story Learnings (from Story 1.1)

- Tailwind v4 uses `@import "tailwindcss"` -- already in `index.css`
- Do NOT create `tailwind.config.js` or `postcss.config.js`
- `vite.config.ts` needs `/// <reference types="vitest/config" />` triple-slash directive
- File formatter may revert markdown checkbox changes -- use Write tool for full rewrites
- The `src/App.tsx` currently has a minimal placeholder that needs to be replaced with the layout shell

### Architecture Compliance

- **Styling:** Tailwind utility classes ONLY. No CSS modules, no styled-components, no custom class names
- **File structure:** All design tokens in `src/index.css`. No separate theme files
- **App.tsx:** Root component composes all UI. Single column layout, max-width 480px centred
- **Responsive:** Mobile-first. `px-6` (24px) base padding, `md:px-8` (32px) tablet+
- **Accessibility:** Focus indicators on all interactive elements, reduced motion support

### Anti-Patterns to Avoid

- Do NOT create `tailwind.config.js` -- use `@theme` in CSS instead
- Do NOT use `@apply` extensively -- prefer inline Tailwind utilities
- Do NOT add custom CSS class names -- Tailwind utilities only
- Do NOT hardcode colour hex values in components -- always use token names (`bg-cream` not `bg-[#FAF7F2]`)
- Do NOT use `@tailwind base/components/utilities` directives -- v4 uses `@import "tailwindcss"`
- Do NOT import fonts via `<link>` in `index.html` -- use CSS `@import` for consistency

### Project Structure Notes

Files modified in this story:
```
src/index.css          (modified - design tokens + font import + global styles)
src/App.tsx            (modified - base layout shell)
src/App.test.tsx       (modified - updated test for layout)
```

No new files created. No new dependencies.

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Color System] -- Complete colour palette with hex values and usage
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Typography System] -- Font choice, type scale, weights
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Spacing & Layout Foundation] -- Spacing tokens, border radius, shadow
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Accessibility Considerations] -- Focus indicators, reduced motion
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive Strategy] -- 480px max-width, padding values
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules] -- Tailwind-only styling rule
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture] -- CSS transitions + prefers-reduced-motion approach

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Typography scale defined as `--font-size-*` custom properties in `@theme` block, enabling `text-hero-total`, `text-section-label`, etc. as Tailwind utilities. Line-heights added as paired `--leading-*` tokens per code review (M1 fix).
- Google Fonts `@import url()` placed before `@import "tailwindcss"` as required by Tailwind v4 processing order.
- The esbuild CSS minifier warning about `file:line` is a pre-existing Tailwind v4 issue, not related to our changes.
- **[M2] CORRECTION to Dev Notes utility class examples:** The Dev Notes section says spacing utilities are accessed as `p-spacing-md`, `gap-spacing-sm`. This is INCORRECT. In Tailwind v4, `--spacing-md: 16px` in `@theme` generates `p-md`, `gap-md` (not `p-spacing-md`). The CSS variable prefix (`--spacing-`) is the category; only the suffix becomes the utility key. Future components should use `p-xs`, `p-sm`, `p-md`, `p-lg`, `p-xl`, `p-2xl` etc.

### Completion Notes List

- Defined all 10 "Warm Quiet" colour tokens as `--color-*` in `@theme` block (cream, warm-linen, sand-mist, espresso, warm-stone, dusty-tan, soft-terracotta, deep-terracotta, rose-blush, warm-amber)
- Loaded Plus Jakarta Sans from Google Fonts with weights 400, 500, 600, 700 via CSS `@import url()`
- Set `--font-sans` to Plus Jakarta Sans as default font family
- Defined 7 typography font-size tokens as `--font-size-*`: hero-total (3rem), section-label (0.875rem), entry-value (1.125rem), entry-meta (0.8125rem), input-field (1.25rem), button (1rem), streak (0.875rem)
- Defined 7 paired line-height tokens as `--leading-*`: hero-total (1.1), section-label (1.3), entry-value (1.4), entry-meta (1.4), input-field (1.3), button (1), streak (1) — added in code review
- Defined 6 spacing tokens: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px)
- Defined 4 border radius tokens: sm (8px), md (12px), lg (16px), pill (9999px)
- Defined shadow token: `--shadow-sheet: 0 -4px 24px rgba(61, 50, 41, 0.08)`
- Updated App.tsx with `<main>` layout shell: `max-w-[480px] mx-auto px-6 md:px-8`
- Set body background to Cream, default text to Espresso, and min-height to 100dvh for full-viewport coverage on mobile browsers
- Added global `*:focus-visible` styles: 2px Soft Terracotta outline, 2px offset
- Added `@media (prefers-reduced-motion: reduce)` to disable all transitions and animations
- Updated App.test.tsx: verifies `<main>` element exists with correct layout classes
- All 2 tests passing, build succeeds, lint clean
- All 10 acceptance criteria satisfied

### Senior Developer Review (AI)

#### Review Date: 2026-03-06

#### Review Outcome: Approve (with fixes applied)

#### Findings Summary: 0 High, 3 Medium, 3 Low

#### Action Items

- [x] [M1] `--font-size-*` tokens missing line-height pairing — added 7 `--leading-*` tokens to `@theme`
- [x] [M2] Dev Notes contain incorrect utility class examples (`p-spacing-md` → should be `p-md`) — correction note added to Debug Log
- [x] [M3] Body missing `min-height: 100dvh` for full-viewport Cream coverage on mobile — added to body rule
- [x] [L1] No default text colour on body — added `color: var(--color-espresso)` to body rule
- [ ] [L2] Spacing tokens use `px` — minor accessibility concern; deferred (spec explicitly calls for px)
- [ ] [L3] Shadow token has cosmetic `rgba()` spacing inconsistency with original spec — deferred (functionally identical)

### Change Log

- 2026-03-06: Implemented Story 1.2 - Design system tokens, typography, base layout, accessibility styles
- 2026-03-06: Code review fixes — line-height tokens added, body min-height + text color set, Dev Notes correction recorded

### File List

- src/index.css (modified - design tokens, font import, focus styles, reduced motion, line-height tokens, body defaults)
- src/App.tsx (modified - base layout shell with `<main>` element)
- src/App.test.tsx (modified - updated tests for layout verification)
