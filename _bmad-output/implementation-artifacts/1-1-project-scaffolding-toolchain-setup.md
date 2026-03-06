# Story 1.1: Project Scaffolding & Toolchain Setup

Status: done

## Story

As a developer,
I want a fully configured project with Vite, React, TypeScript, Tailwind CSS, Vitest, and ESLint,
so that I have a working development environment ready for feature implementation.

## Acceptance Criteria

1. **Given** a fresh project directory, **When** the project is scaffolded using `npm create vite@latest calorie-sugar-tracker -- --template react-swc-ts`, **Then** the project contains a working Vite + React + TypeScript (SWC) setup.
2. Tailwind CSS v4.x is installed via `@tailwindcss/vite` plugin and configured in `vite.config.ts`.
3. Vitest is installed and a sample test executes successfully via `npm test`.
4. ESLint is configured with a flat config (`eslint.config.js`).
5. The project directory structure matches the architecture spec: `src/components/`, `src/services/`, `src/utils/`, `src/context/`.
6. `src/types.ts` exists with the `Entry` interface: `{ id: string, calories: number, sugar: number, timestamp: string }`.
7. `src/index.css` contains `@import "tailwindcss"`.
8. `npm run dev` starts the dev server and renders a placeholder page without errors.
9. `npm run build` produces a static bundle in `dist/`.
10. All Vite template boilerplate (default logos, counter component, sample CSS) is removed.

## Tasks / Subtasks

- [x] Task 1: Scaffold project (AC: #1)
  - [x] Run `npm create vite@latest calorie-sugar-tracker -- --template react-swc-ts` in the project root directory
  - [x] Move all generated files from the nested `calorie-sugar-tracker/` subfolder up to the project root (since we're already in the `calorie-sugar-tracker` directory)
  - [x] Run `npm install`
- [x] Task 2: Install additional dependencies (AC: #2, #3)
  - [x] Run `npm install @tailwindcss/vite`
  - [x] Run `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [x] Task 3: Configure Vite with Tailwind plugin (AC: #2)
  - [x] Edit `vite.config.ts` to add `@tailwindcss/vite` plugin alongside the React plugin
  - [x] Configure Vitest in `vite.config.ts` with `test: { globals: true, environment: 'jsdom', setupFiles: './src/test-setup.ts' }`
- [x] Task 4: Configure Tailwind CSS entry (AC: #7)
  - [x] Replace all contents of `src/index.css` with `@import "tailwindcss";`
- [x] Task 5: Configure ESLint flat config (AC: #4)
  - [x] Ensure `eslint.config.js` exists (Vite template generates it by default with flat config)
  - [x] Verify it works: `npx eslint src/`
- [x] Task 6: Create project directory structure (AC: #5)
  - [x] Create `src/components/` directory (add `.gitkeep` or placeholder)
  - [x] Create `src/services/` directory
  - [x] Create `src/utils/` directory
  - [x] Create `src/context/` directory
- [x] Task 7: Create types file (AC: #6)
  - [x] Create `src/types.ts` with `Entry` interface, `InsightPeriod` type, and `StorageStatus` type
- [x] Task 8: Create test setup file (AC: #3)
  - [x] Create `src/test-setup.ts` with `import '@testing-library/jest-dom'`
  - [x] Add `"test": "vitest"` to `package.json` scripts if not present
- [x] Task 9: Remove boilerplate (AC: #10)
  - [x] Delete `src/App.css`
  - [x] Delete `src/assets/react.svg` and `public/vite.svg`
  - [x] Replace `src/App.tsx` with a minimal placeholder: a `<div>` with text "calorie-sugar-tracker" (no imports of deleted files)
  - [x] Clean `src/index.css` (already done in Task 4)
- [x] Task 10: Create a sample test (AC: #3)
  - [x] Create `src/App.test.tsx` that verifies the placeholder renders
  - [x] Run `npm test` to confirm it passes
- [x] Task 11: Verify build (AC: #8, #9)
  - [x] Run `npm run dev` and confirm no errors
  - [x] Run `npm run build` and confirm `dist/` output

## Dev Notes

### Architecture Compliance

- **Project organization:** By-type, NOT by-feature. Directories: `components/`, `services/`, `utils/`, `context/` under `src/`.
- **Naming conventions:**
  - React components: PascalCase files (e.g., `StatCard.tsx`)
  - Utility/service files: camelCase (e.g., `storageService.ts`, `calculations.ts`)
  - Test files: co-located with `.test.ts(x)` suffix (e.g., `App.test.tsx`)
  - Types/interfaces: PascalCase, no `I` prefix (e.g., `Entry`, not `IEntry`)
  - Module-level constants: SCREAMING_SNAKE_CASE
- **No barrel re-exports** unless a directory has 4+ files
- **No ****`src/utils/helpers.ts`** grab-bag files
- **Tailwind only** for styling -- no CSS modules, no styled-components, no custom class names

### Critical Technical Details

**Vite config structure (****`vite.config.ts`****):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
```

**Types to define in ****`src/types.ts`****:**
```typescript
export interface Entry {
  id: string;          // crypto.randomUUID()
  calories: number;    // kcal, any finite number
  sugar: number;       // grams, any finite number
  timestamp: string;   // ISO 8601
}

export type InsightPeriod = 1 | 3 | 7 | 30 | 90;

export type StorageStatus = 'available' | 'unavailable' | 'quota-exceeded';
```

**index.css -- ENTIRE contents should be:**
```css
@import "tailwindcss";
```
Nothing else. Design tokens will be added in Story 1.2.

**Tailwind CSS v4.x specifics:**
- v4 uses `@import "tailwindcss"` instead of the old `@tailwind base/components/utilities` directives
- v4 uses the `@tailwindcss/vite` plugin directly -- no PostCSS config needed, no `tailwind.config.js` needed
- Design tokens are defined as CSS custom properties in `index.css` and consumed via `@theme` directive (Story 1.2)

### Anti-Patterns to Avoid

- Do NOT create `tailwind.config.js` -- Tailwind v4 uses CSS-based configuration
- Do NOT create `postcss.config.js` -- the Vite plugin handles everything
- Do NOT add React Router, Redux, Zustand, or any dependency not listed above
- Do NOT add `console.log` in production code
- Do NOT use `any` type -- always use typed interfaces
- Do NOT create a `__tests__/` directory -- tests are co-located

### Scaffolding Warning

The `npm create vite@latest` command creates a nested directory. Since the working directory IS already `calorie-sugar-tracker`, you must either:
- Run the create command from the parent directory, OR
- Run it with `.` as the project name: `npm create vite@latest . -- --template react-swc-ts` (if the directory is empty enough), OR
- Run it, then move files up from the nested subfolder

Choose the approach that works cleanly. The end result must have `package.json` at the project root.

### Project Structure Notes

Final expected structure after this story:
```
calorie-sugar-tracker/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.test.tsx
│   ├── index.css
│   ├── types.ts
│   ├── test-setup.ts
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── context/
└── dist/                  (gitignored, created by build)
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Starter Template Evaluation] -- Vite + React + TS + SWC selection, init commands
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules] -- Naming conventions, structure patterns
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] -- Complete directory tree, boundary rules
- [Source: _bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions] -- Entry interface, technology versions
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1] -- Acceptance criteria

## Senior Developer Review (AI)

### Review Date: 2026-03-06

### Review Outcome: Approve (with fixes applied)

### Findings Summary: 3 High, 3 Medium, 2 Low

### Action Items

- [x] [H1] index.html referenced deleted vite.svg favicon -- removed broken link
- [x] [H2] index.html title was "temp-scaffold" -- fixed to "calorie-sugar-tracker"
- [x] [H3] Story file task checkboxes were unchecked due to formatter -- rewritten with all [x]
- [x] [M1] README.md was Vite boilerplate -- replaced with project-specific content
- [x] [M3] @tailwindcss/vite was in dependencies instead of devDependencies -- moved
- [ ] [M2] src/vite-env.d.ts missing from structure (covered by tsconfig.app.json types) -- no action needed
- [ ] [L1] package.json version is "0.0.0" -- cosmetic, deferred
- [ ] [L2] Redundant vitest imports with globals:true -- style preference, deferred

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Vite scaffold required temp-folder approach (current dir not empty due to _bmad/ and _bmad-output/)
- TypeScript build initially failed due to missing `/// <reference types="vitest/config" />` in vite.config.ts -- added triple-slash directive to resolve

### Completion Notes List

- Scaffolded Vite 7.3.1 + React 19.2.0 + TypeScript 5.9.3 (SWC) project
- Installed Tailwind CSS v4.2.1 via @tailwindcss/vite plugin (devDependency)
- Installed Vitest 4.0.18 with React Testing Library and jsdom
- Configured vite.config.ts with React SWC, Tailwind, and Vitest plugins
- Set up index.css with Tailwind v4 `@import "tailwindcss"` directive
- ESLint flat config confirmed working (generated by Vite template)
- Created architecture-specified directory structure: components/, services/, utils/, context/
- Created src/types.ts with Entry, InsightPeriod, and StorageStatus types
- Created test-setup.ts with jest-dom matchers
- Removed all Vite boilerplate (App.css, logos, counter component, boilerplate README)
- Created App.test.tsx -- 1 test passing
- Build produces dist/ output successfully
- Code review: Fixed broken favicon ref, wrong title, boilerplate README, misplaced dependency
- All 10 acceptance criteria satisfied

### Change Log

- 2026-03-06: Initial implementation of Story 1.1 - Project scaffolding complete
- 2026-03-06: Code review fixes -- index.html cleanup, README replacement, dependency correction

### File List

- package.json (new)
- package-lock.json (new)
- vite.config.ts (new)
- tsconfig.json (new)
- tsconfig.app.json (new)
- tsconfig.node.json (new)
- eslint.config.js (new)
- index.html (new, updated during review)
- .gitignore (new)
- README.md (new, rewritten during review)
- src/main.tsx (new)
- src/App.tsx (new - minimal placeholder)
- src/App.test.tsx (new)
- src/index.css (new - Tailwind import)
- src/types.ts (new - Entry, InsightPeriod, StorageStatus)
- src/test-setup.ts (new - jest-dom setup)
- src/components/.gitkeep (new)
- src/services/.gitkeep (new)
- src/utils/.gitkeep (new)
- src/context/.gitkeep (new)
