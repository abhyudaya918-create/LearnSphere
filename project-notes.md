# LearnSphere project notes

## Reference review

The workspace includes `LearnSphere_Reference.pdf`. The first rendered reference page shows the dashboard and subject picker. The dashboard uses a compact white header, warm near-white page background, a broad blue learning-journey card, a four-item statistics strip, a two-row achievement grid, and blue/green subject shortcuts. The subjects view has a pale blue title band and two white cards with thin subject-coloured top borders. The composition is centered and restrained, with small radii, subtle borders and limited shadow.

The Games, quiz feedback/results, and matching screenshots were inspected on PDF pages 6–9. The Games screen uses a tinted lesson banner and two game cards; quiz states show a single question card with answer feedback before advancing; matching uses a compact four-column blue-backed card grid with green matched pairs and a temporary incorrect state. The narrated Drive walkthrough was not accessed.

## Architecture

- Static HTML pages provide direct, refresh-safe routes.
- `data.js` owns the subject catalogue and achievement definitions.
- `app.js` renders shared navigation and dashboard data.
- `progress.js` owns the versioned `learnsphere.progress` record, reward ledger, streaks and derived progress. Its storage adapter isolates browser storage for a future UID-backed implementation.
- `firebase-config.js`, `auth.js` and `auth-ui.js` configure the modular Firebase SDK, watch session state and render shared login/logout UI. The auth SDK is loaded from Firebase's CDN only when a project config is filled in.
- Page scripts (`subjects.js`, `lessons.js`) render content from the shared catalogue.

## Milestones

- **1 — Foundation:** Complete. Dashboard, subjects, lesson listing routes, shared responsive shell, data-driven achievements and baseline progress helpers.
- **2 — Lessons:** Complete. Six data-driven lesson pages, subject progress, lesson navigation, completion persistence, and six interactive activity types: fraction identification, array building, shape identification, planet ordering, living/non-living sorting, and property matching.
- **3 — Games:** Complete. Games hub with subject/lesson selection and separate pre-game instruction screens; six four-question quiz banks; six four-pair matching decks; results, replay, and game progress.
- **4 — Progress:** Complete. Lesson completion and game attempts award XP idempotently; game records keep attempts and best results; levels and all eight achievements update from saved state; local-day streaks track current and longest runs; dashboard, subject list, lesson list and learner profile use the same completion data. Learners can choose a local nickname. The record migrates from the previous unversioned shape.
- **Firebase Authentication:** Implemented with email/password, Google popup, password reset, persistent auth state, protected profile access and guest progress migration. Firebase project setup is required before live sign-in can run. Per-UID progress is browser-local; Firestore sync is not included.
- **5 — Testing and polish:** Behavior checks completed with a local JavaScriptCore harness. Browser-rendered visual and responsive checks remain useful because this environment has no browser automation runtime.

## Known scope note

The progress record remains under `learnsphere.progress`; there is no authentication or cloud storage. A lesson earns 10 XP on its first completion. A first quiz or matching completion for each lesson earns 5 XP, and a distinct completed replay earns 2 XP. Attempt IDs prevent repeat saves from awarding XP twice. Legacy XP and game results are preserved during migration, and completed lessons receive the 10 XP missing from the previous lesson flow.

Thirty progress scenarios were checked with a local JavaScriptCore harness, covering initial state, level boundaries, rewards, duplicate completions and attempts, score/move bests, streak dates, achievement persistence, subject totals, migration, malformed storage and reset. Browser-rendered visual and responsive checks were not run because this environment has no browser automation runtime.
