---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain-skipped
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
  deploymentTarget: vercel
  sourceControl: github
  smartSearch: google_redirect
inputDocuments:
  - _bmad-output/planning-artifacts/product-brief-calorie-sugar-tracker-2026-03-04.md
  - _bmad-output/brainstorming/brainstorming-session-2026-03-04-211300.md
workflowType: prd
date: 2026-03-04T00:00:00.000Z
author: Balaji
project: calorie-sugar-tracker
---
# Product Requirements Document - calorie-sugar-tracker

**Author:** Balaji
**Date:** 2026-03-04

## Executive Summary

calorie-sugar-tracker is a radically minimal single-screen web app for people who know that the act of tracking — however imperfectly — is what changes how they eat. It captures two numbers (calories and sugar) per meal, timestamped automatically, with no accounts, no setup, and no food database. The product is deployed on Vercel, shareable via URL, with all data stored locally in the browser — each user's data is naturally isolated, private, and requires no server infrastructure.

The primary users are Threshold Trackers: motivated adults whose willingness to log has a hard ceiling. The moment tracking feels like a chore, they stop entirely. A secondary segment is Diabetes-Conscious One-Number Thinkers — users already familiar with monitoring a single critical number (blood sugar) who want the same low-friction awareness for food intake.

The product is designed to prevent cascade failure: the pattern where missing one entry makes recovery feel so costly that users abandon tracking entirely. By keeping every entry friction-free, missing a meal costs nothing to recover from and the habit survives imperfection.

### What Makes This Special

Every existing food tracker is built around the food database paradigm — search, match, portion, confirm. This product obliterates that paradigm entirely. Users provide directional estimates; the product trusts them. A rough 500 kcal logged consistently beats a precise 482 kcal logged twice then abandoned.

The product's character is defined equally by what it refuses to do: no goals, no warnings, no notifications, no ads, no settings, no onboarding, no accounts. These are not missing features — they are the product. Restraint is the architecture.

Data privacy requires zero engineering effort: localStorage scopes data to the user's browser automatically. The same URL can be shared with friends; each person gets a completely isolated data store on their own device.

## Project Classification

| Attribute | Value |
| --- | --- |
| Project Type | Web App (SPA, browser-based) |
| Domain | General (personal wellness, no regulation) |
| Complexity | Low |
| Project Context | Greenfield |
| Deployment | Vercel (auto-deploy from GitHub) |
| Source Control | GitHub |
| Data Storage | localStorage (no server, no backend) |
| Smart Search | Google redirect (no API integration) |

## Success Criteria

### User Success

The product succeeds for users when the tracking habit forms and sustains without conscious effort. Specific user success indicators:

- **First log in under 60 seconds:** A new user opens the app and completes their first entry within 60 seconds — with zero instruction, no onboarding, and no account creation.
- **3-day activation:** The user logs at least once on each of their first 3 consecutive days. This is the minimum pattern for habit formation. Failure to hit this threshold in the first week is the primary product failure signal.
- **30-day retention:** The user is still logging at day 30 — regardless of daily entry frequency. One entry counts. The habit is present.
- **Cascade failure prevention:** A user who misses 1–2 days returns and logs again without friction. Missing entries should never feel costly to recover.
- **Aha moment:** The user reaches a point — typically week 2 or 3 — where they notice they are still logging. The habit formed without the app demanding it.

### Business Success

This is a personal-use tool with a zero-cost infrastructure model. Business success is measured by habit metrics, not revenue:

| Metric | Target | Notes |
| --- | --- | --- |
| Activation Rate | >70% | % of users who log 3 consecutive days |
| 30-Day Retention | >50% | % of activated users still logging at d30 |
| Time-to-First-Log | <60 seconds | From first open to first saved entry |
| Infrastructure Cost | $0 | No backend, no database, no server |
| Churn Definition | 3+ days dark | No nudge or re-engagement action taken |

*Targets are directional. At scale they become benchmarks for validating whether the low-friction design hypothesis holds.*

### Technical Success

| Requirement | Specification |
| --- | --- |
| Browser Support | Modern browsers — Chrome, Firefox, Safari, Edge (latest 2 versions); mobile browsers included |
| Performance | No explicit target; SPA + localStorage is inherently fast |
| Connectivity | Internet connection required to load; no offline/PWA required |
| Data Storage | localStorage only — no server, no backend, no sync |
| Deployment | Vercel, auto-deploy on push to GitHub main branch |
| Source Control | GitHub repository |
| Data Isolation | Per-browser, automatic — sharing the URL does not share data |

### Measurable Outcomes

- User logs first entry within 60 seconds of first open, with no guidance
- User returns and logs on day 2 and day 3 without any prompt
- User is still active at day 30
- App loads and is fully interactive in under 2 seconds on a standard broadband connection
- Smart search opens an inline Google-prefilled query in a new tab from within the add entry flow

---

## Product Scope

### MVP — Minimum Viable Product

Everything below must be present for the product to fulfil its core promise.

**Entry & Logging**
- Manual entry: two number fields (calories kcal, sugar grams)
- Auto-timestamp on every entry — no user naming required
- Immutable entries — no edit or delete; log a correcting entry if needed
- Inline smart search: pre-fills a Google query (e.g., "banana calories sugar") and opens result in a new tab; user reads result and enters numbers manually

**Screen & Display**
- Single screen — entire product lives here, no navigation
- Running daily total displayed prominently (calories + sugar)
- Tap daily total to initiate a new entry
- Scrollable entry history for current day

**Insights**
- Insight panel: averages across selectable time periods
- Sliding pill selector: 1d · 3d · 7d · 30d · 90d (defaults to 3d)
- Streak counter: consecutive days with at least one entry

**Infrastructure & Deployment**
- localStorage only — data lives in the user's browser
- No account, no sign-up, no server, no backend
- No onboarding — self-evident on first open
- GitHub repository with Vercel auto-deploy from main branch
- Shareable URL — each visitor gets isolated, private local data

**Permanently Excluded (not deferred — by design)**
- Accounts, sign-up, login, server-side storage
- Notifications, reminders, push alerts
- Re-engagement nudges or lapsed-user recovery
- Goal setting, calorie budgets, recommended daily values
- Red/green warnings or judgment indicators
- Ads, premium upsells, feature gating
- Settings screen or user configuration
- Social features, sharing, multi-user
- Macro breakdowns beyond calories and sugar
- Food database or barcode scanning
- PWA / offline mode

### Growth Features (Post-MVP)

- **Recent quick-pick chips:** Last 5 smart searches as tappable chips above the input — one tap pre-fills the estimate for repeat meals
- **Auto-log with undo buffer:** Entry auto-logs after 2-second pause; brief undo toast appears for 5 seconds — removes the confirm tap entirely
- **Timeline view:** Entries plotted on a 24-hour horizontal axis at their logged timestamp — turns the log into a spatial picture of the day
- **Data export / backup:** Export localStorage data as JSON or CSV

### Vision (Future)

Native mobile app (iOS/Android) carrying the identical product philosophy — same radical restraint, same two-number model, same zero-judgment design. Mobile is a form factor improvement, not a feature expansion. The web app proves the concept before any platform investment is made.

## User Journeys

### Journey 1: The Threshold Tracker — First Week (Success Path)

**Persona:** Priya, 34, works in marketing. Health-conscious but busy. Has tried MyFitnessPal twice; quit both times within two weeks. Currently tracking nothing.

**Opening Scene:**
Priya hears about the app from a colleague who mentions it takes "literally 10 seconds to log a meal." Sceptical but curious, she opens the URL on her phone during lunch. No sign-up screen. No "tell us your goals" prompt. Just a clean screen with two zeros and a + button. She taps it.

**Rising Action:**
A bottom sheet slides up. Two fields: calories, sugar. She had a sandwich — she types 550 and 8. No food search, no portion wrestling. She taps Log. The totals update instantly: 550 kcal · 8g sugar. She closes the app. Total time: 18 seconds.

That evening she logs dinner. The next morning, coffee and a muffin. By day 3 she is logging without thinking about it. The streak counter quietly shows 🔥3. She notices it, smiles slightly, keeps going.

**Climax:**
Week 2. Priya reaches for her phone after a large lunch and opens the app before consciously deciding to. The habit has formed. She didn't set a goal, didn't earn a badge, wasn't nudged. She simply kept coming back because coming back cost nothing.

**Resolution:**
Day 30. Priya is still logging — something that has never happened with any tracker she's tried. She has started noticing her own patterns: sugar spikes on weekends, lighter weekdays. The app never pointed this out. She just saw it in the numbers over time. Her relationship with food has quietly shifted.

**Requirements Revealed:**
- Zero-friction entry (two fields, auto-timestamp, one tap to log)
- Running daily total always visible
- Streak counter as ambient feedback
- No onboarding, no goals, no setup barrier

---

### Journey 2: The Threshold Tracker — Recovery Path (Edge Case)

**Persona:** Same Priya. Day 18. Two consecutive days missed — she was travelling, forgot completely.

**Opening Scene:**
Priya opens the app on day 20 expecting to feel the familiar guilt of a broken habit. She sees the history for today: empty. Yesterday: empty. The streak counter shows 🔥0. The app says nothing else. No "you missed 2 days" banner. No "get back on track" prompt. Just today's blank slate.

**Rising Action:**
She logs her breakfast. 420 kcal, 12g sugar. The total updates. The streak restarts at 🔥1. There is no catch-up required — she doesn't need to reconstruct the last two days. The gap simply exists in the history, neutral and unjudged.

**Climax:**
Priya realises this is the moment every other tracker lost her. The two-day gap used to feel like a debt she couldn't repay. Here it costs nothing. She logs lunch an hour later.

**Resolution:**
The habit continues. The two-day gap becomes a minor blip in the history scroll — visible but irrelevant. Priya never quits.

**Requirements Revealed:**
- No re-engagement nudges or guilt mechanics
- Streak resets silently — no penalty messaging
- History displays gaps neutrally (no warnings, no red indicators)
- Recovery is identical to a normal first log — zero extra friction

---

### Journey 3: The Diabetes-Conscious One-Number Thinker

**Persona:** Rajan, 58, recently diagnosed with prediabetes. Already monitors his blood sugar daily with a glucometer. Understands deeply what it means to watch a single number. Wants to apply the same discipline to food — but every app he's looked at is built for gym-goers, not him.

**Opening Scene:**
Rajan's doctor mentioned that reducing sugar intake was more important for his situation than overall calorie restriction. He searches for a food tracking app. He finds one that has a "sugar" column visible front and centre without burying it in a macro breakdown. He opens the URL.

**Rising Action:**
He logs his morning chai: 80 kcal, 14g sugar. The daily total shows 14g sugar prominently alongside 80 kcal. That single number — 14g — is all he needed to see. He uses the smart search before lunch: types "idli sambar" into the inline search bar, glances at the result in the new tab, and closes it with a calibrated estimate: 350 kcal, 4g sugar.

**Climax:**
After dinner, Rajan checks the 3-day insight panel. His average daily sugar over the past 3 days: 42g. He knows from his doctor that staying under 50g is his personal target. He didn't set this target in the app — he carries it in his head. The app just gives him the number to compare it against.

**Resolution:**
Rajan has found the first tracker that fits his mental model: one number, tracked daily, without a clinical dashboard or diabetes-specific framing. He logs every day. After 6 weeks his blood sugar readings have stabilised — his doctor notes the improvement at their next appointment.

**Requirements Revealed:**
- Sugar displayed as a first-class metric alongside calories (never buried)
- Insight panel shows multi-day averages (3-day default)
- Smart search available inline within the entry flow
- No diabetes-specific framing, no medical warnings — data is neutral

---

### Journey 4: The Friend User — Shared URL

**Persona:** Leila, 29, friend of Priya. Heard about the app during a conversation about eating habits. Priya texts her the URL.

**Opening Scene:**
Leila taps the link on her phone. The app loads in her browser. She sees a clean screen: two zeros, a + button, a streak of 🔥0. She is not Priya. She has her own completely blank data store — Priya's months of entries are invisible to her, stored only in Priya's browser.

**Rising Action:**
No "create an account" screen. No "are you a new user?" prompt. Leila taps + and logs her lunch. She didn't need to be told how. The interface told her with one button.

**Climax:**
Leila bookmarks the URL and opens it again at dinner. Her total updates. She has two entries. The streak shows 🔥1.

**Resolution:**
Leila and Priya are using the same app at the same URL. Their data has never touched. Neither needed to configure anything, create an account, or worry about the other's data.

**Requirements Revealed:**
- localStorage isolation is automatic and total — no URL-based or session-based data sharing
- App must be fully functional from first load with zero state — no "returning user vs new user" branching
- No account creation path exists — it is simply not in the app

---

### Journey Requirements Summary

| Capability | Journeys That Require It |
| --- | --- |
| Zero-friction entry (2 fields, auto-timestamp) | J1, J2, J3, J4 |
| Running daily total (cal + sugar) | J1, J2, J3, J4 |
| Streak counter (ambient, no guilt) | J1, J2 |
| Gap handling (neutral, no penalty) | J2 |
| No re-engagement mechanics | J2 |
| Sugar as first-class metric | J1, J3 |
| Multi-day insight panel (3d default) | J3 |
| Inline smart search | J3 |
| localStorage isolation (per-browser) | J4 |
| Zero-state first load (no onboarding) | J1, J4 |
| No account path | J1, J4 |

## Innovation & Novel Patterns

### Detected Innovation Areas

**Estimation-First Food Logging**
The dominant paradigm in food tracking requires searching a curated food database, matching items, selecting portions, and confirming entries. calorie-sugar-tracker challenges this assumption entirely: users provide directional number estimates directly, with an optional Google search as a lightweight sanity check. This eliminates the food database as an architectural dependency — not as a cost-saving measure, but as a deliberate design philosophy. The hypothesis: a rough estimate logged consistently is more valuable than a precise entry logged twice then abandoned.

**Data-as-Interface Interaction Pattern**
The primary interaction point for adding a new entry is the running daily total itself — tapping the numbers initiates the add flow. No dedicated button required. This collapses the UI to its minimum: the data is both the display and the trigger. For a web app, this represents a genuine departure from conventional button-centric interaction design.

**Architectural Forgiveness (Cascade Failure Prevention)**
The app is explicitly designed so that non-use costs nothing. Missing an entry, or two, or five, creates no recovery debt — the user simply logs the next entry and continues. This inverts the standard engagement design pattern (which maximises friction-to-leave) in favour of friction-to-return being zero. The habit is designed to survive imperfection.

**Privacy-by-Architecture**
Data isolation is not a feature — it is a side effect of the storage model. localStorage is scoped to the browser automatically. The same URL shared with any number of people gives each person a completely separate, private data store with zero engineering effort. No privacy policy, no data handling, no GDPR surface area.

### Market Context & Competitive Landscape

Existing food trackers (MyFitnessPal, Cronometer, Lose It, Yazio) are all built on the food database paradigm and optimise for precision, completeness, and engagement. The market has no significant player competing on radical minimalism and estimation-first logging. The closest analogues are paper food diaries and notes apps — neither offers the purpose-built affordances (running totals, time-period insights, streak tracking) this product provides.

The innovation is not in the technology stack — it is in the product philosophy. The technical implementation is simple by design. The differentiation is in what is deliberately excluded.

### Validation Approach

- **Primary validation:** Does the builder (Balaji) still use the app daily after 30 days? This is both the product's north star metric and its innovation proof point.
- **Estimation accuracy:** Is directional logging (±20% of actual) good enough to drive behavioural awareness? Anecdotal usage data from the builder's own habits will validate or challenge this.
- **Cascade failure test:** Does a 2–3 day gap result in return (success) or permanent churn (failure)? Observation over 90 days will surface this.

## Web App Specific Requirements

### Project-Type Overview

calorie-sugar-tracker is a Single-Page Application (SPA) — the entire product is one screen with no navigation, no page loads, and no routing. All state is managed client-side via localStorage. There is no backend, no API, and no server-rendered content.

### Technical Architecture Considerations

| Attribute | Decision |
| --- | --- |
| Architecture | SPA — single screen, no routing required |
| Rendering | Client-side only |
| State Management | localStorage — all data persists in the browser |
| Real-Time | Not required — no server, no WebSockets, no live updates |
| Backend | None — zero server-side components |
| Build/Deploy | Static site — deployable to Vercel as a static SPA |

### Browser Matrix

| Browser | Support |
| --- | --- |
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |
| Mobile Chrome (Android) | Latest 2 versions |
| Mobile Safari (iOS) | Latest 2 versions |

### Responsive Design

The app must work on both desktop and mobile browsers from day one — the primary use case (logging after a meal) happens on a phone. Layout must be touch-friendly with adequate tap target sizes. The single-screen design simplifies responsive requirements significantly: one layout adapts to viewport width, no separate mobile/desktop flows.

### Performance Targets

No explicit performance budget. SPA + localStorage is inherently fast with no server round-trips. See NFR1–NFR3 for specific load time and responsiveness targets.

### SEO Strategy

Not applicable. This is a personal tool distributed by URL sharing, not search discovery. No meta tags, sitemaps, or structured data required. A basic `<title>` and `<meta description>` are sufficient for browser tab identification.

### Accessibility Level

Good-faith WCAG AA baseline — no strict compliance audit required. See NFR11–NFR14 for specific accessibility targets.

### Implementation Considerations

- **Framework:** Any modern SPA framework is suitable (React, Vue, Svelte, vanilla JS). Selection should optimise for build simplicity and minimal bundle size given the product's single-screen scope.
- **Static hosting:** Output is a static bundle (HTML/CSS/JS) — Vercel serves it with zero configuration for this architecture.
- **No build-time environment variables needed:** No API keys, no backend URLs, no secrets. The app has no external dependencies at runtime.
- **localStorage key namespace:** Use a consistent key prefix (e.g., `cst_`) to avoid collisions if the browser has other apps using localStorage on the same origin.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP — the smallest version that delivers the core promise: a logging habit that survives imperfection.

**MVP Philosophy:** Ship when all MVP features work reliably on mobile and desktop. No phased rollout needed — the product is simple enough to complete entirely before first use.

**Resource Requirements:** Single developer. No backend infrastructure. Static hosting on Vercel (free tier). Zero ongoing operational cost.

---

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Threshold Tracker — first week success path (J1)
- Threshold Tracker — recovery path after missed days (J2)
- Diabetes-Conscious Thinker — sugar-first logging (J3)
- Friend user — shared URL, isolated data (J4)

**Must-Have Capabilities:**

| Capability | Rationale |
| --- | --- |
| Manual entry (calories + sugar, auto-timestamp) | Without this, there is no product |
| Running daily total (prominent) | Without this, logging has no feedback loop |
| Scrollable entry history (current day) | Without this, entries feel lost |
| Inline smart search (Google redirect, new tab) | Reduces estimation anxiety without a food database |
| Insight panel with sliding pill selector (1d/3d/7d/30d/90d, default 3d) | Without this, patterns are invisible |
| Streak counter | Ambient habit signal — not gamification |
| localStorage persistence | Without this, data disappears on close |
| Tap daily total to initiate entry | Core "data-as-interface" interaction pattern |
| Immutable entries | Eliminates edit/delete complexity entirely |
| No onboarding, no accounts, no settings | These exclusions are requirements, not omissions |
| Responsive layout (mobile + desktop) | Primary use case is on a phone |
| GitHub repo + Vercel auto-deploy | Distribution and delivery mechanism |

---

### Post-MVP Features (Phase 2 — Growth)

See the Growth Features list in the Product Scope section.

---

### Phase 3 — Expansion (Vision)

See the Vision paragraph in the Product Scope section.

---

### Risk Mitigation Strategy

**Technical Risks:**
- *localStorage data loss on browser clear:* Known and accepted for v1. Data export in Phase 2 mitigates this. Low risk — users who care about data persistence will adopt a habit of export or stay on one device.
- *Smart search UX (Google redirect):* Opens in a new tab, user must return to the app. Acceptable friction for a sanity-check feature that is optional by design.

**Market Risks:**
- *"Just use Notes":* Mitigated by purpose-built affordances (running totals, streak, insight panel) that a notes app cannot replicate without significant user effort.
- *Low adoption beyond builder:* Accepted — this is a personal tool first. Word-of-mouth sharing is the distribution model.

**Resource Risks:**
- *Single developer:* The entire product is in scope for one person. No coordination risk. The simplicity of the architecture is itself a resource risk mitigation.
- *Scope creep:* The permanently excluded list in the PRD is the primary defence. Revisit only if the core habit metric (30-day retention) is validated and growth features are specifically requested.

## Functional Requirements

### Entry & Logging

- FR1: User can log an entry by providing a calorie estimate (kcal) and a sugar estimate (grams)
- FR2: System automatically timestamps each entry at the moment of logging — no user input required for the timestamp
- FR3: User can initiate a new entry by tapping/clicking the running daily total displayed on the main screen
- FR4: User can initiate a new entry via a dedicated add trigger (button or equivalent)
- FR5: Logged entries are immutable — users cannot edit or delete an existing entry
- FR6: User can log a correcting entry with any numeric values (including effectively negative offsets) to adjust a previous entry

### Display & Visualization

- FR7: System displays the running daily total of calories and sugar prominently as the dominant element on the main screen
- FR8: System displays a scrollable list of all entries logged for the current calendar day
- FR9: Each entry in the history list displays its timestamp, calorie value, and sugar value
- FR10: System presents all product functionality on a single screen — no navigation, tabs, or page transitions required
- FR11: System layout adapts to both mobile and desktop viewport sizes, with touch-friendly tap targets on mobile

### Insights & Patterns

- FR12: System displays an insight panel showing the average daily calories and average daily sugar over a selectable time period
- FR13: User can select the insight time period from the following options: 1 day, 3 days, 7 days, 30 days, 90 days
- FR14: System defaults the insight time period to 3 days on every session
- FR15: System displays a streak counter showing the number of consecutive calendar days on which at least one entry was logged
- FR16: System resets the streak counter silently when a calendar day passes with no entries — no penalty message, warning, or re-engagement prompt is shown

### Search & Estimation

- FR17: User can access an inline smart search field from within the entry creation flow
- FR18: System opens a Google search pre-populated with the user's food description query in a new browser tab when smart search is submitted
- FR19: Smart search is optional — users can bypass it and enter calorie and sugar estimates directly without performing a search

### Data Persistence

- FR20: System persists all entry data in the browser's localStorage with no server interaction required
- FR21: System loads and displays all existing entry data from localStorage automatically on application start — no user action required
- FR22: Entry data is scoped to the individual browser instance — users accessing the same URL on different devices or browsers have completely separate, non-shared data stores

### First Use & Access

- FR23: User can begin logging entries immediately on first open — no account creation, sign-up, profile setup, or onboarding step required
- FR24: System presents a self-evident interface to first-time users — the zero-state screen communicates the core interaction without instruction, tutorial, or walkthrough

### Deployment & Distribution

- FR25: The application is deployable as a static SPA to Vercel via an automated deployment pipeline triggered by pushes to the main branch of a GitHub repository
- FR26: User can access and use the full application via a shareable URL in a supported browser — no installation, download, or account required

## Non-Functional Requirements

### Performance

- NFR1: Application must be fully interactive within 2 seconds of initial load on a standard broadband connection (10 Mbps+)
- NFR2: All user interactions (logging an entry, switching insight period, tapping to add) must produce visible feedback within 100 milliseconds
- NFR3: Application must remain responsive with up to 365 days of entry history stored in localStorage (approximately 3–5 entries/day)

### Security

- NFR4: All user input (entry values, smart search queries) must be sanitised before rendering to the DOM to prevent XSS vulnerabilities
- NFR5: The application must not transmit any user entry data to any external server or third-party service
- NFR6: Smart search queries are passed as URL parameters to Google in a new tab — no query logging or retention by the application

### Usability

- NFR7: A new user must be able to log their first entry within 60 seconds of opening the app with no prior instruction or onboarding
- NFR8: The entry flow must require no more than 3 user interactions from intent to logged entry (e.g., tap to open → enter values → confirm)
- NFR9: All tap targets on mobile must meet a minimum size of 44×44px to ensure reliable touch interaction
- NFR10: The application must function identically whether the user has zero prior entries or hundreds — no degraded experience for new users

### Accessibility

- NFR11: All interactive elements must be operable by keyboard alone
- NFR12: All text content must meet WCAG AA colour contrast ratio (4.5:1 for normal text, 3:1 for large text)
- NFR13: No information must be conveyed by colour alone
- NFR14: All form input fields must have programmatic labels accessible to screen readers

### Reliability

- NFR15: The static application bundle must be served via Vercel's CDN with no custom infrastructure — target uptime matches Vercel's SLA (99.99% for hosted static sites)
- NFR16: Application must handle localStorage being unavailable (private browsing mode, storage quota exceeded) gracefully — with a clear, non-technical message explaining that data cannot be saved in the current browser context
- NFR17: localStorage usage must not exceed 5MB to remain within browser storage limits across all supported browsers

