---
stepsCompleted:
  - 1
  - 2
  - 3
  - 4
  - 5
  - 6
inputDocuments:
  - _bmad-output/brainstorming/brainstorming-session-2026-03-04-211300.md
date: 2026-03-04T00:00:00.000Z
author: Balaji
---
# Product Brief: calorie-sugar-tracker

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

calorie-sugar-tracker is a radically minimal food logging web app designed for the conscious, habit-forming tracker who doesn't need insights — they need the act of logging itself. By eliminating every source of friction (food databases, goal-setting, accounts, ads, and analytics overload), the app removes the cascade failure that kills consistent tracking: missing one entry shouldn't feel like losing a week's progress. Two numbers — calories and sugar — logged in seconds, with no judgment, no setup, and no distractions. The act of logging is the product.

---

## Core Vision

### Problem Statement

People who consciously want to eat better often discover that the simple act of tracking their food intake is itself the behavior change — not the analysis of what was tracked. Yet every existing tracker is built around precision, complexity, and engagement mechanics that work against this insight. The real problem is not that people lack nutritional data; it's that existing tools demand too much to keep going, and missing one or two entries triggers a cascading disengagement: the catch-up effort feels high, the value of the incomplete log drops, and the user abandons tracking entirely.

### Problem Impact

The users most affected are casual yet determined trackers — people who have the right intention but are not obsessive about precision. They try MyFitnessPal or similar tools, tolerate the complexity for a few days, miss a meal or two, and face an immediate recovery tax that feels disproportionate to the benefit. Once the streak breaks, the perceived value of the partial log collapses. This creates a pattern where the users who could benefit most from sustained awareness are exactly the ones most likely to churn. Separately, sugar tracking carries specific health significance for users managing or preventing diabetes — yet no minimal-friction tool treats sugar as a first-class metric alongside calories.

### Why Existing Solutions Fall Short

- **Food database paradigm:** Every major tracker requires searching a food database, matching items, adjusting portions, and confirming entries. This is the primary source of entry friction.
- **Setup walls:** Goal-setting, weight input, age, activity level — existing apps demand a profile before the user can log a single thing.
- **Distraction layers:** Ads, premium upsells, achievement badges, trend dashboards, and social features compete for attention in apps designed to maximize engagement, not minimize effort.
- **Precision over estimation:** Existing tools are biased toward accuracy (482 cal) when directional correctness (≈500 cal) is sufficient and far faster to capture.
- **Notes and spreadsheets:** Flexible by nature, but they require the user to build and maintain their own structure, offer no purpose-built affordances (quick search, running totals, time-period stats), and don't scale gracefully with even minor feature needs.

### Proposed Solution

A purpose-built single-screen web app where the user logs two numbers — calories and sugar grams — as directional estimates, timestamped automatically. Entry is designed around the assumption that a rough estimate logged consistently is vastly more valuable than a precise entry logged occasionally. The app maintains a running daily total, a scrollable entry history, and a lightweight insight panel (3-day averages by default) — all on one screen, with no account required, no onboarding, and no settings. A low-friction sanity check (smart search or quick Google lookup) is available for users who want to calibrate estimates without being forced into a food database workflow.

### Key Differentiators

- **Radical restraint as product philosophy:** What the app refuses to do (accounts, goals, notifications, ads, settings, food database) is as defining as what it does.
- **Estimation-first logging:** Trusts the user to know roughly what they ate. Directional accuracy over clinical precision.
- **Cascade failure prevention:** Entry friction is so low that missing a meal costs nothing to recover from. The app never punishes gaps.
- **Sugar as a first-class metric:** Treats sugar alongside calories as a primary signal, specifically for users managing diabetes risk — not an afterthought buried in a macro breakdown.
- **Habit as the outcome:** The product measures success not by data richness but by whether the user develops a sustained tracking habit — which coincidentally drives healthier choices through awareness alone.

## Target Users

### Primary Users

---

#### Persona 1: The Threshold Tracker

**Profile:** An adult with genuine health awareness and real motivation to eat better — but whose willingness to do the work has a hard ceiling. They are not fitness obsessives or data maximalists. They understand that tracking helps them stay conscious and make better choices, and they are willing to log consistently — right up until it starts feeling like a chore. The moment the effort-to-value ratio tips, they disengage entirely. Their defining characteristic is not laziness; it's a clear and reasonable limit on friction tolerance.

**Motivations:** Sustained awareness of what they're consuming. The confidence that comes from knowing, at any point in the day, roughly how much they've eaten. Not weight loss per se — more a sense of being in control without it consuming mental energy.

**Current Experience:** Has tried apps like MyFitnessPal. Lasted a week or two. Missed a couple of entries during a busy stretch and felt the recovery cost was too high relative to the value of catching up. Stopped logging. The habit never formed because the tool demanded more consistency than it rewarded.

**What Success Looks Like:** Opens the app, taps in two numbers in under 10 seconds, sees the running daily total update, and closes it. Does this 3–5 times a day without thinking about it. After a few weeks, notices they are making slightly better food choices — not because the app told them to, but because the habit of awareness changed their relationship with food quietly.

**The Aha Moment:** The first time they miss a meal entry and realize it doesn't matter — there's no streak broken, no data gap that ruins the log. They just add the next entry and keep going.

---

#### Persona 2: The Diabetes-Conscious One-Number Thinker

**Profile:** An adult managing prediabetes, diabetes risk, or active diabetes who is already deeply familiar with the concept of tracking a single critical number — blood sugar. They understand intuitively that one metric, tracked consistently, can drive significant behavioral awareness. They want to apply the same mental model to food intake: monitor calories and sugar without the overhead of a clinical nutrition tool.

**Motivations:** Sugar is their primary signal — the number that tells them if a meal was a mistake. Calories provide useful context. They don't want a diabetes management platform; they want a lightweight log that respects their intelligence and the specificity of what they care about.

**Current Experience:** Existing calorie trackers bury sugar inside a macro breakdown that demands more setup and attention than they want. Clinical diabetes apps are medically oriented and overly complex. They are tracking calories and sugar in a notes app or not tracking food at all because no tool fits.

**What Success Looks Like:** A single daily view where they can see their running sugar intake at a glance alongside calories. No diabetes-specific framing, no medical warnings — just the number, clean and neutral.

**The Aha Moment:** Realising they can log a meal in the same mental gesture as checking their blood sugar — a quick, habitual number-check that takes seconds and provides immediate awareness.

---

### Secondary Users

Not applicable for the current scope. This is designed as a personal-use tool. No admin, sharing, or multi-user scenarios are in scope.

---

### User Journey

*Mapped for the Threshold Tracker as the primary design target.*

**Discovery:**
Word of mouth or a targeted search for "simple calorie tracker no signup" or "minimal food log app." The product's restraint — no account required, no app store friction — is itself a discovery differentiator. First click is the product. No landing page wall, no onboarding gate.

**First Use (Onboarding):**
There is no onboarding. The user lands on the app, sees a clean screen with today's total (0 cal / 0g sugar) and a single add button. They tap it, enter two numbers, and their first entry is logged. Time to first value: under 30 seconds. The app is self-evident by design.

**Core Usage (Day-to-Day):**
The user opens the app 3–5 times a day — after meals, after a snack, or whenever they want a quick calibration. They enter a calorie estimate and a sugar estimate (sometimes using a quick Google search as a sanity check), tap log, and see the daily total update. No decisions to make, no fields to fill beyond two numbers.

**Success Moment:**
Somewhere in week 2 or 3, the user realises they are still logging — something that has never happened with any other tracker they've tried. The habit formed not because the app demanded it, but because it never punished them for imperfection. The running total at the top of the screen has become a quiet daily companion.

**Long-Term:**
Logging becomes invisible effort — as automatic as checking the time. The user starts noticing their own patterns without the app surfacing them explicitly: "I always spike sugar on weekends," or "Big lunches mean I'm under for the day anyway." The awareness drives small, persistent behavioral shifts. The app never once told them what to do.

## Success Metrics

This is a personal-use tool designed to form a sustained tracking habit. Success metrics reflect that core purpose — not engagement maximization or revenue, but quiet, persistent usage. Metrics apply both to the builder-as-user now and to any future users.

### The North Star

**30-Day Retention:** A user is still logging entries 30 days after their first use. This is the single most important signal that the product has done its job. The frequency per day is irrelevant — one entry or five, the habit is present. The only question that matters: are they still here?

### Activation Threshold (Minimum Viability)

**3 Consecutive Days of Logging:** A user who logs on at least their first 3 consecutive days has crossed the activation threshold. This is the minimum pattern required for a habit to begin forming. A user who does not log for 3 consecutive days in their first week is considered a failed activation — the product did not clear the friction bar for them. No recovery attempt will be made; the product does not nudge.

**Failure Condition:** A user who does not log on 3 consecutive days within their first week has churned before activation. This is the primary product failure signal.

### Churn Signal

**3+ Consecutive Days Without an Entry:** For an activated user, three or more consecutive days with no entries is the operational definition of churn. The product takes no action — no notifications, no re-engagement prompts. The signal exists for product measurement purposes only, not to trigger user intervention.

---

### Business Objectives

| Objective | Description |
| --- | --- |
| Habit formation | Users who activate (3 consecutive days) go on to reach the 30-day mark |
| Frictionless activation | First-use experience clears the 3-day consecutive threshold without any guidance or onboarding |
| Silent retention | Users remain active at 30 days without any re-engagement mechanism |
| Zero-nudge sustainability | Long-term usage sustained entirely by product utility, not push mechanics |

---

### Key Performance Indicators

| KPI | Definition | Target |
| --- | --- | --- |
| **Activation Rate** | % of new users who log on 3 consecutive days in their first week | >70% |
| **30-Day Retention Rate** | % of activated users still logging at day 30 | >50% |
| **Churn Threshold** | Consecutive days without entry before a user is considered churned | 3 days |
| **Time-to-First-Log** | Time from first app open to first logged entry | <60 seconds |
| **Daily Entry Pattern** | Average entries per active day (informational only — no target) | Observed |

*Note: Targets are directional for a personal tool. At scale, these become benchmarks for evaluating whether the low-friction design hypothesis holds.*

## MVP Scope

### Core Features

The MVP is a single-screen web app. Every feature listed below must be present for the product to fulfil its core promise. Nothing beyond this list ships in v1.

**Entry & Logging**
- Manual entry of two numbers: calories (kcal) and sugar (grams)
- Auto-timestamp on every entry — no naming or labelling required
- Smart search: type a food description, receive a calorie/sugar estimate to accept or nudge before logging (replaces food database lookup with a low-friction sanity check)
- Immutable entries — no edit or delete; log a correcting entry if needed

**Screen & Display**
- Single screen — the entire product lives here, no navigation
- Running daily total displayed prominently (calories + sugar)
- Scrollable entry history for the current day
- Tap the daily total to initiate a new entry (the data is the interface)

**Insights**
- Lightweight insight panel: averages across selectable time periods
- Sliding pill time selector: 1d · 3d · 7d · 30d · 90d (defaults to 3d)
- Streak counter: consecutive days with at least one entry

**Infrastructure**
- Local storage only — data lives on the device
- No account, no sign-up, no server
- No onboarding — the app is self-evident on first open

---

### Out of Scope for MVP

These are firm exclusions — not deferred ideas, but deliberate decisions that define the product's character. Many of these are what makes the product work.

**Permanently excluded (by design philosophy):**
- Accounts, sign-up, login, or any server-side data storage
- Notifications, reminders, or push alerts of any kind
- Re-engagement nudges or lapsed-user recovery mechanics
- Goal setting, calorie budgets, or recommended daily values
- Red/green warnings, judgment indicators, or "over limit" messages
- Ads, premium upsells, or feature gating
- Settings screen or user configuration of any kind
- Social features, sharing, or multi-user support
- Badges, rewards, or gamification beyond the streak counter
- Macro breakdowns beyond calories and sugar (no protein, fat, carbs, etc.)
- Rich analytics, trend dashboards, or progress reports
- Food database or barcode scanning

**Deferred to post-MVP:**
- Voice input and voice-to-estimate pipeline
- Recent quick-pick chips (re-log from history in one tap)
- Auto-log with undo buffer (remove the confirm tap)
- Timeline view (24-hour spatial entry plot)
- Data export or backup

---

### MVP Success Criteria

The MVP is validated when:

1. **Activation gate cleared:** First-use experience enables a new user to log their first entry in under 60 seconds with zero instruction
2. **3-day habit signal:** The builder (primary user) logs consistently for 3+ consecutive days using only the MVP feature set — with no friction moments that prompt a workaround
3. **Restraint holds:** No out-of-scope features are added during building in response to "wouldn't it be nice if..." impulses
4. **Smart search works:** The estimate lookup reduces the need to guess blindly without requiring a full food database workflow

---

### Future Vision

If the MVP succeeds as a daily habit tool, the natural evolution is a **native mobile app** — bringing the same radical restraint to a platform where the logging gesture is even more natural (thumb-tap, always in pocket).

The mobile version would carry the same product philosophy exactly: no new features by virtue of being mobile, just a better-fitting form factor for a habit that happens throughout the day. The web app remains the foundation and proves the concept before any platform investment is made.

Beyond mobile, no specific future capabilities are committed to — the product's value is in what it refuses to become as much as what it is.
