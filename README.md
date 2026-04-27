# Horse Racing

A turn-based horse racing simulation built with Vue 3 and Vite. Each round runs as an animation whose per-horse durations are derived from condition and distance; results are tracked through a program board and a results table.

**Live Demo:** [https://horse-racing-sandy.vercel.app/](https://horse-racing-sandy.vercel.app/)

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Commands](#commands)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
  - [Application Shell](#application-shell)
  - [State Management (Pinia)](#state-management-pinia)
  - [Domain Types](#domain-types)
  - [Constants and Utilities](#constants-and-utilities)
  - [Path Alias](#path-alias)
- [Styling](#styling)
- [Testing](#testing)
  - [Unit Tests](#unit-tests)
  - [Visual Regression Tests](#visual-regression-tests)
  - [End-to-End Tests](#end-to-end-tests)
- [Recommended IDE Setup](#recommended-ide-setup)
- [Recommended Browser Setup](#recommended-browser-setup)

## Overview

The app generates a six-round program from a fixed pool of horses. Each round runs at a different distance; per-horse animation timing is computed from the horse's `condition` and the round's distance. Round status flows `idle → running ↔ paused → finished`, and the race ends once every round is finished.

The page is composed of a `MainLayout` with four primary sections:

- **HorseListSection** — lists the horse pool
- **CurrentRaceSection** — animates the round currently being run
- **RaceProgramSection** — lists the schedule of all rounds
- **ResultsSection** — shows the standings of finished rounds

## Tech Stack

- **Framework:** Vue 3 (Composition API, `<script setup lang="ts">`)
- **Build:** Vite
- **State:** Pinia (setup-store form)
- **Language:** TypeScript
- **Styling:** SCSS (`sass-embedded`), BEM, scoped styles
- **Testing:** Vitest (unit), Vitest Browser Mode + Playwright (visual), Cypress (E2E)
- **Package Manager:** Bun

## Getting Started

```sh
bun install
```

Start the dev server:

```sh
bun dev
```

Produce a production build:

```sh
bun run build
```

## Commands


| Command                  | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| `bun dev`                | Vite dev server with HMR                                |
| `bun run build`          | Runs `type-check` and `build-only` in parallel          |
| `bun run type-check`     | Type-check only via `vue-tsc --build`                   |
| `bun test:unit`          | Vitest (watch by default; use `--run` for single-shot)  |
| `bun test:visual`        | Vitest Browser Mode (Chromium, headless)                |
| `bun test:visual:update` | Re-seed visual baselines                                |
| `bun test:e2e:dev`       | Cypress against the dev server                          |
| `bun test:e2e`           | Cypress against the production preview (use this in CI) |
| `bun lint`               | ESLint with `--fix --cache`                             |
| `bun format`             | Prettier across `src/`                                  |


To run a single Cypress spec:

```sh
bunx cypress run --spec cypress/e2e/race-flow.cy.ts
```

## Project Structure

```
src/
├── assets/
│   ├── icons/          # Icons as SFCs
│   └── style/          # main.scss, base/, shared/, variables/
├── components/
│   ├── Button/
│   ├── Cards/
│   ├── Header/
│   ├── Item/
│   ├── List/
│   └── Sections/       # HorseListSection, CurrentRaceSection, ...
├── constants/          # horse.constants.ts, race.constants.ts
├── layouts/            # MainLayout.vue
├── stores/             # horse.store.ts, race.store.ts
├── types/              # Horse, RaceHorse, RaceRound, RaceRoundStatus
├── utils/              # array.ts, random.ts, race.ts, time.ts
├── App.vue
└── main.ts
```

## Architecture

### Application Shell

[src/main.ts](src/main.ts) installs Pinia, imports the global SCSS, and mounts the app on `#app`. No router is configured. [src/App.vue](src/App.vue) only renders [src/layouts/MainLayout.vue](src/layouts/MainLayout.vue); the page is composed of `SectionCard`-wrapped sections plus `AppHeader`.

### State Management (Pinia)

Stores use the setup-store form `defineStore('name', () => { ... })` and follow the `<domain>.store.ts` naming convention.

- [horse.store.ts](src/stores/horse.store.ts) — generates the horse pool with randomized condition.
- [race.store.ts](src/stores/race.store.ts) — owns `rounds`, `currentRoundIndex`, and the round lifecycle (`generateRace`, `startRound`, `pauseRound`, `nextRound`, `markHorseFinished`). Exposes derived flags `isRunning`, `isPaused`, `isFinished`, and `isRaceFinished`.

### Types

All  types live in [src/types/index.ts](src/types/index.ts): `Horse`, `RaceHorse`, `RaceRound`, `RaceRoundStatus`.

### Constants and Utilities

- [src/constants/](src/constants/) — horse roster, race distances, easings, horses-per-round.
- [src/utils/](src/utils/) — `race.ts#getRaceHorses` derives per-horse animation `duration`/`easing` from condition and distance.

> Magic values belong in `constants/` or `utils/`, not inline in components.

### Path Alias

`@/*` → `./src/*`, configured in both [vite.config.ts](vite.config.ts) and [tsconfig.app.json](tsconfig.app.json). Prefer alias imports over long relative paths. `noUncheckedIndexedAccess` is enabled, so indexed access returns `T | undefined`.

## Styling

- Global entry: [src/assets/style/main.scss](src/assets/style/main.scss).
- Folders: `base/` (resets, general), `shared/` (utilities, mixins), `variables/` (colors, font-size). CSS custom properties (`--color-neutral-200`, `--text-sm`) are the preferred way to consume design tokens.
- Components use `<style scoped lang="scss">`. When mixins are needed:

```scss
@use '@/assets/style/shared/mixins' as *;

.block {
  @include respond-to(md) {
    /* ... */
  }
}
```

- Class naming follows BEM: `.block`, `.block__element`, `.block--modifier`.

## Testing

Tests are colocated under `src/**/__tests__/`. Naming is `<name>.test.ts` for unit tests and `<name>.visual.test.ts` for visual regression specs.

### Unit Tests

```sh
bun test:unit
```

Vitest (jsdom). Covers utilities ([src/utils/**tests**/](src/utils/__tests__/)), Pinia stores ([src/stores/**tests**/](src/stores/__tests__/)), and components ([src/components/**tests**/](src/components/__tests__/)). Component tests use `@vue/test-utils` `mount` and reset Pinia per test via `setActivePinia(createPinia())` in `beforeEach`.

### Visual Regression Tests

```sh
bun test:visual
bun test:visual:update    # regenerate baselines
```

Vitest Browser Mode (Chromium, viewport 1280×1400) — see [vitest.visual.config.ts](vitest.visual.config.ts). The [renderAt](src/__tests__/visual.helpers.ts) helper mounts a component into a `data-testid`-tagged host `<div>`. Comparison uses `pixelmatch` with `allowedMismatchedPixelRatio: 0.01`. Baselines under `__screenshots__/` are **gitignored**; visual tests act as a local-only safety net (not enforced in CI as currently configured).

```ts
await expect(locator.getByRole('button')).toMatchScreenshot('cta')
```

> For Pinia-backed components, set state directly (e.g. `race.rounds = [makeRound('running')]`) instead of calling store actions — actions pull random data and would make baselines flaky.

### End-to-End Tests

For local iteration against the dev server:

```sh
bun test:e2e:dev
```

For CI or pre-deploy verification against the production preview:

```sh
bun run build
bun test:e2e
```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur). For type support of `.vue` imports, `tsc` is replaced with `vue-tsc`.

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Custom Object Formatters](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Custom Object Formatters](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

