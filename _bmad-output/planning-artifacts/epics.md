---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
status: complete
completedAt: "2026-03-06"
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
workflowType: epics
project_name: calorie-sugar-tracker
user_name: Balaji
date: "2026-03-06"
---
# calorie-sugar-tracker - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for calorie-sugar-tracker, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: User can log an entry by providing a calorie estimate (kcal) and a sugar estimate (grams)
FR2: System automatically timestamps each entry at the moment of logging - no user input required for the timestamp
FR3: User can initiate a new entry by tapping/clicking the running daily total displayed on the main screen
FR4: User can initiate a new entry via a dedicated add trigger (button or equivalent)
FR5: Logged entries are immutable - users cannot edit or delete an existing entry
FR6: User can log a correcting entry with any numeric values (including effectively negative offsets) to adjust a previous entry
FR7: System displays the running daily total of calories and sugar prominently as the dominant element on the main screen
FR8: System displays a scrollable list of all entries logged for the current calendar day
FR9: Each entry in the history list displays its timestamp, calorie value, and sugar value
FR10: System presents all product functionality on a single screen - no navigation, tabs, or page transitions required
FR11: System layout adapts to both mobile and desktop viewport sizes, with touch-friendly tap targets on mobile
FR12: System displays an insight panel showing the average daily calories and average daily sugar over a selectable time period
FR13: User can select the insight time period from the following options: 1 day, 3 days, 7 days, 30 days, 90 days
FR14: System defaults the insight time period to 3 days on every session
FR15: System displays a streak counter showing the number of consecutive calendar days on which at least one entry was logged
FR16: System resets the streak counter silently when a calendar day passes with no entries - no penalty message, warning, or re-engagement prompt is shown
FR17: User can access an inline smart search field from within the entry creation flow
FR18: System opens a Google search pre-populated with the user's food description query in a new browser tab when smart search is submitted
FR19: Smart search is optional - users can bypass it and enter calorie and sugar estimates directly without performing a search
FR20: System persists all entry data in the browser's localStorage with no server interaction required
FR21: System loads and displays all existing entry data from localStorage automatically on application start - no user action required
FR22: Entry data is scoped to the individual browser instance - users accessing the same URL on different devices or browsers have completely separate, non-shared data stores
FR23: User can begin logging entries immediately on first open - no account creation, sign-up, profile setup, or onboarding step required
FR24: System presents a self-evident interface to first-time users - the zero-state screen communicates the core interaction without instruction, tutorial, or walkthrough
FR25: The application is deployable as a static SPA to Vercel via an automated deployment pipeline triggered by pushes to the main branch of a GitHub repository
FR26: User can access and use the full application via a shareable URL in a supported browser - no installation, download, or account required

### NonFunctional Requirements

NFR1: Application must be fully interactive within 2 seconds of initial load on a standard broadband connection (10 Mbps+)
NFR2: All user interactions (logging an entry, switching insight period, tapping to add) must produce visible feedback within 100 milliseconds
NFR3: Application must remain responsive with up to 365 days of entry history stored in localStorage (approximately 3-5 entries/day)
NFR4: All user input (entry values, smart search queries) must be sanitised before rendering to the DOM to prevent XSS vulnerabilities
NFR5: The application must not transmit any user entry data to any external server or third-party service
NFR6: Smart search queries are passed as URL parameters to Google in a new tab - no query logging or retention by the application
NFR7: A new user must be able to log their first entry within 60 seconds of opening the app with no prior instruction or onboarding
NFR8: The entry flow must require no more than 3 user interactions from intent to logged entry (e.g., tap to open -> enter values -> confirm)
NFR9: All tap targets on mobile must meet a minimum size of 44x44px to ensure reliable touch interaction
NFR10: The application must function identically whether the user has zero prior entries or hundreds - no degraded experience for new users
NFR11: All interactive elements must be operable by keyboard alone
NFR12: All text content must meet WCAG AA colour contrast ratio (4.5:1 for normal text, 3:1 for large text)
NFR13: No information must be conveyed by colour alone
NFR14: All form input fields must have programmatic labels accessible to screen readers
NFR15: The static application bundle must be served via Vercel's CDN with no custom infrastructure - target uptime matches Vercel's SLA (99.99% for hosted static sites)
NFR16: Application must handle localStorage being unavailable (private browsing mode, storage quota exceeded) gracefully - with a clear, non-technical message explaining that data cannot be saved in the current browser context
NFR17: localStorage usage must not exceed 5MB to remain within browser storage limits across all supported browsers

### Additional Requirements

**From Architecture - Starter Template & Tooling:**
- Starter: Vite + React + TypeScript (SWC) via `npm create vite@latest calorie-sugar-tracker -- --template react-swc-ts`
- Styling: Tailwind CSS v4.x via `@tailwindcss/vite` plugin
- Testing: Vitest 4.x with React Testing Library for component tests
- Linting: ESLint flat config

**From Architecture - Data Model & Storage:**
- Entry interface: `{ id: string, calories: number, sugar: number, timestamp: string }`
- localStorage key: `cst_entries` (single JSON array, append-only)
- ID generation: `crypto.randomUUID()`
- Timestamps: ISO 8601 via `new Date().toISOString()`
- Calendar day boundary: local timezone midnight
- Storage abstraction: `storageService.ts` is the only module that touches localStorage
- Calculations engine: `calculations.ts` as pure functions for totals, averages, streaks

**From Architecture - State Management & Components:**
- State: React `useState` + `useContext` (single `EntriesContext` provider)
- 7 UI components: StatCard, EntrySheet, EntryCard, PillSelector, InsightsPanel, FAB, DateStreakRow
- Plus ErrorBoundary component at App level
- By-type project organization: `components/`, `services/`, `utils/`, `context/`
- Co-located test files (`.test.ts(x)` next to source)

**From Architecture - Infrastructure & Deployment:**
- Public GitHub repository with GitHub Projects + Issues
- Vercel GitHub integration for auto-deploy on push to `main`
- `vercel.json` with SPA rewrite rule: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
- CSP headers in Vercel config
- Branch strategy: `main` (production) + feature branches

**From UX Design - Visual Foundation:**
- Font: Plus Jakarta Sans (Google Fonts) - weights 400, 500, 600, 700
- Color palette "Warm Quiet": Cream #FAF7F2, Warm Linen #F3EDE4, Sand Mist #E8DFD3, Espresso #3D3229, Warm Stone #8C7E6F, Dusty Tan #B5A898, Soft Terracotta #C4856C, Deep Terracotta #A96E57, Rose Blush #F0DDD6, Warm Amber #D4A574
- Typography scale: 7 levels (Hero Total 48px down to Entry Meta 13px)
- Spacing system: 4px base unit, 6 tokens (xs 4px through 2xl 48px)
- Border radius tokens: sm 8px, md 12px, lg 16px, pill 9999px
- Single shadow token for bottom sheet only

**From UX Design - Interaction & Layout:**
- Max content width: 480px (centred on desktop)
- Bottom sheet: max 60vh, anchored to bottom, radius-lg top corners
- FAB: 56px circle, fixed bottom-right, 24px offset from edges
- Animation specs: sheet slide-up 200ms, count-up 300ms, card fade-in 200ms, sheet dismiss 150ms
- `prefers-reduced-motion` support (replace animations with instant state changes)
- Focus trap in EntrySheet using `inert` attribute on background content
- Focus indicator: 2px Soft Terracotta outline, 2px offset
- Zero-state: Dusty Tan values on stat cards, empty insights message
- Tab order in entry sheet: Smart search -> Calories -> Sugar -> Log button

### FR Coverage Map

| FR | Epic | Description |
| --- | --- | --- |
| FR1 | Epic 2 | Log entry with calories + sugar |
| FR2 | Epic 2 | Auto-timestamp on log |
| FR3 | Epic 2 | Tap daily total to add entry |
| FR4 | Epic 2 | Dedicated add trigger (FAB) |
| FR5 | Epic 2 | Immutable entries |
| FR6 | Epic 2 | Correcting entries with any numeric value |
| FR7 | Epic 2 | Running daily total displayed prominently |
| FR8 | Epic 2 | Scrollable entry history for current day |
| FR9 | Epic 2 | Entry shows timestamp, calories, sugar |
| FR10 | Epic 2 | Single screen, no navigation |
| FR11 | Epic 2 | Responsive mobile + desktop layout |
| FR12 | Epic 3 | Insight panel with averages |
| FR13 | Epic 3 | Selectable time periods (1d/3d/7d/30d/90d) |
| FR14 | Epic 3 | Default insight period = 3 days |
| FR15 | Epic 3 | Streak counter |
| FR16 | Epic 3 | Silent streak reset |
| FR17 | Epic 4 | Inline smart search field |
| FR18 | Epic 4 | Google search in new tab |
| FR19 | Epic 4 | Smart search is optional |
| FR20 | Epic 2 | Persist data in localStorage |
| FR21 | Epic 2 | Auto-load data on app start |
| FR22 | Epic 2 | Per-browser data isolation |
| FR23 | Epic 2 | No account/onboarding required |
| FR24 | Epic 2 | Self-evident zero-state interface |
| FR25 | Epic 1 | Deployable to Vercel via GitHub |
| FR26 | Epic 1 | Accessible via shareable URL |

## Epic List

### Epic 1: Project Foundation & First Deployable App
Scaffolded project with full toolchain (Vite + React + TypeScript + Tailwind + Vitest), design system tokens configured, and a working app deployed to Vercel via GitHub auto-deploy. The delivery pipeline is proven end-to-end -- a user can visit the URL and see a live app.
**FRs covered:** FR25, FR26
**Scope:** All 4 epics are MVP. Nothing is post-MVP.

### Epic 2: Core Entry & Daily Total
User can open the app on mobile or desktop, see today's running calorie and sugar totals, add entries via stat cards or FAB, see scrollable entry history for the current day, all persisted in localStorage. Responsive layout with proper tap targets from day one. Zero onboarding -- self-evident on first open.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR20, FR21, FR22, FR23, FR24

### Epic 3: Insights & Streaks
Streak counter showing consecutive logging days with silent reset. Insight panel with average daily calories and sugar across selectable time periods (1d/3d/7d/30d/90d, defaulting to 3d). No guilt mechanics, no penalty messaging.
**FRs covered:** FR12, FR13, FR14, FR15, FR16

### Epic 4: Smart Search
Inline smart search within the entry flow -- user types a food name, Google search opens pre-populated in a new tab, user returns and enters their estimate. Fully optional, never required to log an entry.
**FRs covered:** FR17, FR18, FR19

---

## Epic 1: Project Foundation & First Deployable App

Scaffolded project with full toolchain (Vite + React + TypeScript + Tailwind + Vitest), design system tokens configured, and a working app deployed to Vercel via GitHub auto-deploy. The delivery pipeline is proven end-to-end -- a user can visit the URL and see a live app.

### Story 1.1: Project Scaffolding & Toolchain Setup

As a developer,
I want a fully configured project with Vite, React, TypeScript, Tailwind CSS, Vitest, and ESLint,
So that I have a working development environment ready for feature implementation.

**Acceptance Criteria:**

**Given** a fresh project directory
**When** the project is scaffolded using `npm create vite@latest calorie-sugar-tracker -- --template react-swc-ts`
**Then** the project contains a working Vite + React + TypeScript (SWC) setup
**And** Tailwind CSS v4.x is installed via `@tailwindcss/vite` plugin and configured in `vite.config.ts`
**And** Vitest is installed and a sample test executes successfully via `npm test`
**And** ESLint is configured with a flat config
**And** the project directory structure matches the architecture spec: `src/components/`, `src/services/`, `src/utils/`, `src/context/`
**And** `src/types.ts` exists with the `Entry` interface: `{ id: string, calories: number, sugar: number, timestamp: string }`
**And** `src/index.css` contains `@import "tailwindcss"`
**And** `npm run dev` starts the dev server and renders a placeholder page without errors
**And** `npm run build` produces a static bundle in `dist/`
**And** all Vite template boilerplate (default logos, counter component, sample CSS) is removed

### Story 1.2: Design System Tokens & Base Layout

As a developer,
I want the complete design system (colours, typography, spacing, radii) configured as Tailwind tokens and the base app layout shell in place,
So that all future components share a consistent visual foundation from the start.

**Acceptance Criteria:**

**Given** the scaffolded project from Story 1.1
**When** the design tokens are configured in `src/index.css` as CSS custom properties consumed by Tailwind
**Then** the "Warm Quiet" colour palette is available: Cream (#FAF7F2), Warm Linen (#F3EDE4), Sand Mist (#E8DFD3), Espresso (#3D3229), Warm Stone (#8C7E6F), Dusty Tan (#B5A898), Soft Terracotta (#C4856C), Deep Terracotta (#A96E57), Rose Blush (#F0DDD6), Warm Amber (#D4A574)
**And** Plus Jakarta Sans is loaded from Google Fonts with weights 400, 500, 600, 700
**And** the typography scale is defined: Hero Total (48px/700), Section Label (14px/600), Entry Value (18px/500), Entry Meta (13px/400), Input Field (20px/500), Button (16px/600), Streak (14px/500)
**And** spacing tokens are available: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px)
**And** border radius tokens are available: sm (8px), md (12px), lg (16px), pill (9999px)
**And** the shadow token is defined: `shadow-sheet` = `0 -4px 24px rgba(61,50,41,0.08)`
**And** `App.tsx` renders a base layout shell: single column, `max-w-[480px] mx-auto`, Cream background extending to viewport edges, responsive padding (`px-6 md:px-8`)
**And** the app background is Cream (#FAF7F2) across the full viewport
**And** focus indicator style is defined: 2px Soft Terracotta outline, 2px offset
**And** `prefers-reduced-motion` media query is set up to disable transitions when active

### Story 1.3: GitHub Repository & Vercel Deployment

As a user,
I want to access the app via a live URL that auto-deploys when code is pushed,
So that the latest version is always available without manual deployment steps.

**Acceptance Criteria:**

**Given** the project with design tokens and base layout from Story 1.2
**When** the code is pushed to a public GitHub repository on the `main` branch
**Then** the repository is named `calorie-sugar-tracker` and is publicly accessible
**And** `.gitignore` excludes `node_modules/`, `dist/`, and other build artifacts
**And** `vercel.json` is present with the SPA rewrite rule: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`
**And** `vercel.json` includes CSP headers restricting `script-src` to `'self'`
**And** Vercel is connected to the GitHub repository with auto-deploy on push to `main`
**And** the live Vercel URL (*.vercel.app) loads the app with the Cream background, Plus Jakarta Sans font rendering, and base layout visible
**And** the app is fully interactive within 2 seconds of load (NFR1)
**And** `README.md` contains basic project description and setup instructions

---

## Epic 2: Core Entry & Daily Total

User can open the app on mobile or desktop, see today's running calorie and sugar totals, add entries via stat cards or FAB, see scrollable entry history for the current day, all persisted in localStorage. Responsive layout with proper tap targets from day one. Zero onboarding -- self-evident on first open.

### Story 2.1: Storage Service & Data Model

As a developer,
I want a robust storage abstraction layer that handles all localStorage operations with graceful error handling,
So that all other modules can persist and retrieve entry data without touching localStorage directly.

**Acceptance Criteria:**

**Given** the project foundation from Epic 1
**When** `src/services/storageService.ts` is implemented
**Then** it exports a `loadEntries()` function that reads from localStorage key `cst_entries`, parses the JSON array, validates each entry against the `Entry` interface, and returns `Entry[]`
**And** it exports a `saveEntries(entries: Entry[])` function that serialises the array to JSON and writes to localStorage key `cst_entries`
**And** if localStorage is unavailable (private browsing, disabled), `loadEntries()` returns an empty array and `saveEntries()` fails silently, both returning a status indicating storage is unavailable
**And** if localStorage quota is exceeded on write, `saveEntries()` catches the error and returns a status indicating quota exceeded
**And** if the data in `cst_entries` is corrupt or unparseable, `loadEntries()` returns an empty array (fresh start) without crashing
**And** `src/types.ts` exports `Entry` interface (`{ id: string, calories: number, sugar: number, timestamp: string }`), `InsightPeriod` type, and `StorageStatus` type
**And** all functions are covered by unit tests in `storageService.test.ts` including: successful read/write, empty storage, corrupt data, unavailable localStorage, and quota exceeded scenarios
**And** no other module in the application accesses localStorage directly -- `storageService.ts` is the sole point of contact

### Story 2.2: Entries Context & Calculations Engine

As a developer,
I want a React context that manages entry state and a pure calculations module for derived data,
So that all UI components can read entries and computed values from a single source of truth.

**Acceptance Criteria:**

**Given** the storage service from Story 2.1
**When** `src/context/EntriesContext.tsx` is implemented
**Then** it provides an `EntriesProvider` that wraps the app and exposes `entries: Entry[]`, `addEntry: (calories: number, sugar: number) => void`, and `storageStatus` via `useContext`
**And** `EntriesProvider` calls `storageService.loadEntries()` on mount to hydrate state
**And** `addEntry` creates a new `Entry` with `crypto.randomUUID()` as id, `new Date().toISOString()` as timestamp, appends it to state immutably (`setEntries(prev => [...prev, newEntry])`), and calls `storageService.saveEntries()` with the updated array
**And** state updates never mutate the existing array -- always spread into a new array

**Given** the entries context
**When** `src/utils/calculations.ts` is implemented
**Then** it exports `getTodayEntries(entries: Entry[]): Entry[]` that filters entries to the current local calendar day
**And** it exports `getDailyTotal(entries: Entry[]): { calories: number, sugar: number }` that sums calories and sugar for entries on the current local calendar day
**And** all functions are pure -- they take `Entry[]` as input and return computed values with no side effects
**And** calendar day boundaries use local timezone midnight (via `new Date().toDateString()` comparison)
**And** all functions are covered by unit tests in `calculations.test.ts` including: empty array, single entry, multiple entries across days, and entries at midnight boundary
**And** context is covered by tests in `EntriesContext.test.tsx`

### Story 2.3: Main Screen Layout, StatCards & Date Row

As a user,
I want to see today's date and my running daily totals for calories and sugar prominently displayed when I open the app,
So that I immediately know where I stand for the day without any interaction.

**Acceptance Criteria:**

**Given** the app is opened in a browser
**When** the main screen renders
**Then** `DateStreakRow` displays the current date in the format "Thursday, March 6" (using `toLocaleDateString()`) aligned left (streak will be added in Epic 3)
**And** two `StatCard` components are displayed side-by-side below the date: one for calories (kcal) and one for sugar (g)
**And** each StatCard shows: a label (Section Label style, 14px/600), a value (32-40px Bold), and a unit
**And** StatCards have Warm Linen background, 16px border-radius, 16px gap between them, equal width
**And** StatCards are tappable with `role="button"`, `aria-label` (e.g., "Add entry. Today's calories: 1420 kcal"), keyboard focusable, Enter/Space activates
**And** StatCard hover/active state transitions to Rose Blush background
**And** the layout is single column, max-width 480px centred on desktop, full width on mobile with 24px horizontal padding (32px on tablet+)
**And** all tap targets meet 44x44px minimum (NFR9)

**Given** the user has no entries for today (zero state)
**When** the main screen renders
**Then** StatCard values display `0` in Dusty Tan colour instead of Espresso
**And** the screen is clean with no onboarding, no prompts, no instruction text (FR23, FR24)
**And** the entire product is on a single screen with no navigation elements (FR10)

**Given** the user has existing entries for today in localStorage
**When** the app loads
**Then** StatCards display the correct running daily totals in Espresso colour, loaded automatically from localStorage (FR7, FR21)

### Story 2.4: Entry Sheet & Logging Flow

As a user,
I want to tap the daily total or a button, enter my calorie and sugar estimates, and log the entry with one tap,
So that I can track a meal in under 10 seconds with minimal friction.

**Acceptance Criteria:**

**Given** the main screen is displayed
**When** the user taps/clicks either StatCard
**Then** the EntrySheet bottom sheet slides up from the bottom with a smooth animation (~200ms ease-out)
**And** the sheet has `role="dialog"`, `aria-modal="true"`, and focus is trapped within the sheet while open
**And** background content is made inert using the `inert` attribute
**And** the sheet has radius-lg (16px) on top corners, Cream background, max 60vh height, full width (max 480px on desktop)
**And** the sheet displays: a handle bar, a calorie input field, a sugar input field, and a full-width pill-shaped Log button

**Given** the EntrySheet is open
**When** it finishes opening
**Then** the calorie input field is auto-focused and the numeric keyboard opens on mobile (`inputmode="numeric"`)
**And** input fields have Warm Linen background, Sand Mist border, radius-sm (8px), placeholders "e.g. 450" and "e.g. 12" in Dusty Tan
**And** focused input shows Soft Terracotta border
**And** tab order is: Calories -> Sugar -> Log button
**And** the Log button is Soft Terracotta background with white text, 16px SemiBold, radius-pill, with Deep Terracotta hover state and scale(0.97) active state

**Given** the user has entered values in the calorie and sugar fields
**When** the user taps the Log button
**Then** a new entry is created via `EntriesContext.addEntry()` with the entered values (FR1, FR2)
**And** empty fields are treated as 0 -- submission is never blocked (FR6)
**And** any finite number is accepted including 0 and negative values for corrections
**And** the sheet dismisses with a smooth slide-down (~150ms ease-in)
**And** the StatCard values update with a count-up animation (~300ms ease-out) (FR7)
**And** focus returns to the element that triggered the sheet
**And** the entry flow requires no more than 3 interactions: tap to open, enter values, tap Log (NFR8)

**Given** the EntrySheet is open
**When** the user taps the backdrop area or swipes down or presses Escape
**Then** the sheet dismisses without saving any data
**And** focus returns to the trigger element

**Given** the user has `prefers-reduced-motion` enabled
**When** the sheet opens, closes, or stat cards update
**Then** all animations are replaced with instant state changes -- no transitions

### Story 2.5: Entry History List

As a user,
I want to see a scrollable list of all my entries for today with timestamps,
So that I can review what I've logged and see my meal-by-meal breakdown.

**Acceptance Criteria:**

**Given** the user has logged one or more entries today
**When** the main screen renders
**Then** a scrollable list of `EntryCard` components is displayed between the StatCards and the bottom of the screen
**And** each EntryCard shows: timestamp on the left (Entry Meta style, 13px/400, formatted via `toLocaleTimeString()` e.g. "12:34 PM") and calorie + sugar values on the right (Entry Value style, 18px/500)
**And** EntryCards have Warm Linen background, radius-md (12px), space-md (16px) padding, space-sm (8px) gap between cards
**And** the most recent entry appears at the top of the list
**And** entries are rendered as a semantic list (`<ul>`/`<li>`) for screen reader accessibility
**And** each entry is read by screen readers as e.g. "12:34 PM, 620 kilocalories, 14 grams sugar" (NFR14)

**Given** the user just logged a new entry via the EntrySheet
**When** the sheet dismisses
**Then** the new EntryCard appears at the top of the history list with a fade-in animation (~200ms ease-in)
**And** with `prefers-reduced-motion` active, the card appears instantly with no animation

**Given** the user has no entries for today
**When** the main screen renders
**Then** the entry history area is empty -- clean whitespace, no placeholder text or illustration

**Given** the user has entries from previous days in localStorage
**When** the main screen renders
**Then** only today's entries are displayed in the history (FR8) -- previous days' entries are stored but not shown in the list

### Story 2.6: FAB & Error Handling

As a user,
I want an always-visible add button and graceful handling when my browser can't save data,
So that I always have a clear way to add entries and understand if something prevents data persistence.

**Acceptance Criteria:**

**Given** the main screen is displayed
**When** the FAB component renders
**Then** a 56x56px circular button is displayed in the bottom-right corner, 24px from the edges, position fixed
**And** the FAB has Soft Terracotta background with a white `+` icon centred
**And** the FAB has `aria-label="Add entry"`, is keyboard focusable, and activates on Enter/Space
**And** hover state: Deep Terracotta background with scale(1.08) transform (~150ms ease-out)
**And** focus state: 2px Soft Terracotta outline, 2px offset
**And** the FAB is positioned above the insights panel area (which will be added in Epic 3)

**Given** the FAB is displayed
**When** the user taps/clicks the FAB
**Then** the EntrySheet opens -- identical behaviour to tapping a StatCard (FR4)

**Given** the app is wrapping its content
**When** an `ErrorBoundary` component is placed at the App level
**Then** any unhandled React render error is caught and displays a simple message: "Something went wrong. Please refresh." on a clean Cream background
**And** the error boundary does not interact with the data layer

**Given** the user opens the app in a browser where localStorage is unavailable (e.g. private browsing with storage disabled)
**When** the storage service detects unavailability
**Then** a calm inline message is displayed: "Your browser can't save data right now. Try opening this page in a regular browser window."
**And** the message is in Dusty Tan text, centred, on the Cream background -- no modal, no red, no alarm
**And** the app remains usable for the session (entries work in memory via context, just not persisted) (NFR16)

---

## Epic 3: Insights & Streaks

Streak counter showing consecutive logging days with silent reset. Insight panel with average daily calories and sugar across selectable time periods (1d/3d/7d/30d/90d, defaulting to 3d). No guilt mechanics, no penalty messaging.

### Story 3.1: Streak Calculation & Display

As a user,
I want to see how many consecutive days I've logged at least one entry,
So that I have a quiet ambient signal of my tracking habit without any pressure or guilt.

**Acceptance Criteria:**

**Given** the calculations module from Story 2.2
**When** `getStreak(entries: Entry[]): number` is added to `calculations.ts`
**Then** it returns the count of consecutive calendar days (ending with today or yesterday) on which at least one entry was logged
**And** if today has entries, today is included in the streak count
**And** if today has no entries but yesterday does, the streak counts back from yesterday (the streak is still alive until a full day is missed)
**And** calendar day boundaries use local timezone midnight
**And** the function is pure -- takes `Entry[]`, returns a number, no side effects
**And** unit tests cover: no entries (returns 0), single day (returns 1), consecutive days (returns correct count), gap in the middle (streak breaks), entries spanning midnight boundary

**Given** the DateStreakRow component from Story 2.3
**When** the streak calculation is wired in
**Then** the streak count is displayed on the right side of the DateStreakRow, aligned with the date on the left
**And** the streak displays as a number in Warm Amber colour, Streak style (14px/500), with a fire emoji prefix (e.g. "🔥3")
**And** when the streak is 0, it displays "🔥0" with no special styling, no penalty message, no "you missed X days" banner (FR16)
**And** the streak updates silently when entries are added -- no animation, no celebration
**And** the `<time>` element is used for semantic date display in the DateStreakRow

### Story 3.2: Insights Panel with Pill Selector

As a user,
I want to see my average daily calories and sugar over selectable time periods,
So that I can spot patterns in my eating habits at a glance.

**Acceptance Criteria:**

**Given** the calculations module
**When** `getAverages(entries: Entry[], days: number): { calories: number, sugar: number }` is added to `calculations.ts`
**Then** it calculates the average daily calories and average daily sugar over the specified number of past days (including today)
**And** it divides total calories and sugar by the number of days in the period (not by the number of days with entries -- empty days count as zero)
**And** the function is pure with no side effects
**And** unit tests cover: no entries (returns 0/0), entries in one day, entries across multiple days, period longer than available data, entries exactly at period boundary

**Given** the main screen layout
**When** the `PillSelector` component renders
**Then** it displays 5 pills in a horizontal row: 1d, 3d, 7d, 30d, 90d
**And** each pill has `role="tab"` within a `role="tablist"` container
**And** the active pill has Rose Blush background with Soft Terracotta border and text
**And** inactive pills have transparent background with Sand Mist border and Warm Stone text
**And** keyboard navigation uses left/right arrow keys to move between pills, with `aria-selected` on the active pill
**And** tapping a pill switches the selection immediately with no loading state (NFR2)
**And** the default selection is 3d on every session (FR14) -- not persisted across sessions

**Given** the PillSelector and calculations
**When** the `InsightsPanel` component renders
**Then** it is pinned at the bottom of the screen, full width, Warm Linen background with Sand Mist border-top
**And** it contains the PillSelector and two value displays: average daily calories and average daily sugar
**And** values update immediately when the user switches pill selection
**And** values have `aria-live="polite"` so screen readers announce changes when the pill selection changes
**And** the panel is compact and glanceable -- does not dominate the screen

**Given** the user has no entries at all
**When** the InsightsPanel renders
**Then** it displays "Insights will appear after your first entry" in Dusty Tan text, centred
**And** the PillSelector is still visible and interactive (selecting pills shows the same empty message)

**Given** the FAB from Story 2.6
**When** the InsightsPanel is rendered at the bottom
**Then** the FAB is positioned above the InsightsPanel so they do not overlap

---

## Epic 4: Smart Search

Inline smart search within the entry flow -- user types a food name, Google search opens pre-populated in a new tab, user returns and enters their estimate. Fully optional, never required to log an entry.

### Story 4.1: Inline Smart Search in Entry Flow

As a user,
I want to quickly look up a food's calorie and sugar content from within the entry flow,
So that I can make a more informed estimate without leaving the app or losing my place.

**Acceptance Criteria:**

**Given** the EntrySheet is open
**When** the smart search field renders
**Then** a text input field is displayed above the calorie and sugar fields in the EntrySheet
**And** the field has the same input styling (Warm Linen background, Sand Mist border, radius-sm) with a search affordance
**And** the placeholder text reads "Search food (e.g. chicken rice)" in Dusty Tan
**And** the tab order is updated to: Smart search -> Calories -> Sugar -> Log button
**And** the smart search field has a programmatic label accessible to screen readers (NFR14)

**Given** the user has typed a food name in the smart search field
**When** the user submits the search (presses Enter or taps a search trigger)
**Then** a new browser tab opens with a Google search URL pre-populated with the query using `window.open()` (FR18)
**And** the query is URL-encoded using `encodeURIComponent()` before constructing the URL (NFR4)
**And** no query data is logged, stored, or retained by the application (NFR6)
**And** no user data is transmitted to any server other than the Google search URL opened in the new tab (NFR5)

**Given** the user has opened a Google search in a new tab
**When** the user switches back to the app tab
**Then** the EntrySheet is still open with all previously entered field values preserved (FR17)
**And** the calorie and sugar fields retain any values the user had entered before searching
**And** the user can continue entering or adjusting values and tap Log as normal

**Given** the EntrySheet is open
**When** the user does not interact with the smart search field at all
**Then** the entry flow works identically -- smart search is fully optional and never required to log an entry (FR19)
**And** the user can go directly to the calorie field (which is auto-focused), enter values, and tap Log
