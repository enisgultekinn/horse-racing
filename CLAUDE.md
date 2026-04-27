# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Vue 3 (Composition API, `<script setup lang="ts">`) + Vite + Pinia + TypeScript. Styling via SCSS (`sass-embedded`). Unit tests via Vitest, E2E via Cypress. Package manager is **bun** (see `bun.lock`).

## Commands

- `bun dev` — Vite dev server with HMR
- `bun run build` — runs `type-check` (via `vue-tsc --build`) and `build-only` (Vite build) in parallel
- `bun run type-check` — type-check only, no emit
- `bun test:unit` — Vitest (watch mode by default; pass `--run` for single-shot, or a path/name pattern to filter)
- `bun test:e2e:dev` — Cypress against the Vite dev server (fast, for local iteration)
- `bun test:e2e` — Cypress against `vite preview` of a production build (run `bun run build` first; this is what CI should use)
- `bun lint` — ESLint with `--fix --cache`
- `bun format` — Prettier across `src/`

Single Cypress spec: `bunx cypress run --spec cypress/e2e/race-flow.cy.ts` (server must already be running on `http://localhost:4173`).

## Architecture notes

- Entry: [src/main.ts](src/main.ts) creates the app, installs Pinia, imports the global SCSS, and mounts `#app`. No router is configured.
- App shell: [src/App.vue](src/App.vue) just renders [src/layouts/MainLayout.vue](src/layouts/MainLayout.vue), which composes the page from `SectionCard`-wrapped sections (`HorseListSection`, `CurrentRaceSection`, `RaceProgramSection`, `ResultsSection`) plus `AppHeader`.
- State: Pinia stores live in [src/stores/](src/stores/) and use the **setup-store** form (`defineStore('name', () => { ... })`). Files are named `<domain>.store.ts`. Current stores:
  - [horse.store.ts](src/stores/horse.store.ts) — generates the horse pool with randomized condition.
  - [race.store.ts](src/stores/race.store.ts) — owns `rounds`, `currentRoundIndex`, and round lifecycle (`generateRace`, `startRound`, `pauseRound`, `nextRound`, `markHorseFinished`). Round status flows `idle → running ↔ paused → finished`. Exposes status flags (`isRunning`, `isPaused`, `isFinished`) derived from the current round's status, plus `isRaceFinished` (true once every round is finished).
- Domain types live in [src/types/index.ts](src/types/index.ts) (`Horse`, `RaceHorse`, `RaceRound`, `RaceRoundStatus`).
- Constants live in [src/constants/](src/constants/) (`horse.constants.ts`, `race.constants.ts`) — keep magic values (horse roster, race distances, easings, horses-per-round) here, not inline.
- Utilities live in [src/utils/](src/utils/) (`array.ts`, `random.ts`, `race.ts`, `time.ts`). `race.ts#getRaceHorses` is where per-horse animation `duration`/`easing` is computed from condition + distance.
- Components are organized by role under [src/components/](src/components/): `Header/`, `Sections/`, `Cards/`, `Button/`, `Item/`, `List/`. Filenames use `<Name>.component.vue`. Icons are SFCs under [src/assets/icons/](src/assets/icons/).
- Path alias: `@/*` → `./src/*` (configured in both [vite.config.ts](vite.config.ts) and [tsconfig.app.json](tsconfig.app.json)). Prefer `@/...` imports over long relative paths.
- TS config is split: `tsconfig.app.json` for app code (excludes `__tests__`), `tsconfig.vitest.json` for unit tests, `tsconfig.node.json` for build tooling. `noUncheckedIndexedAccess` is on — array/object index access returns `T | undefined`, handle accordingly.
- Tests colocate under `src/**/__tests__/` (excluded from the app tsconfig; picked up by Vitest). Unit tests cover utils ([src/utils/__tests__/](src/utils/__tests__/)), Pinia stores ([src/stores/__tests__/](src/stores/__tests__/)), and components ([src/components/__tests__/](src/components/__tests__/)). Component tests use `@vue/test-utils` `mount` and reset Pinia per test via `setActivePinia(createPinia())` in a `beforeEach`. Test files are named `<name>.test.ts`.

## Styling

- Global SCSS entry: [src/assets/style/main.scss](src/assets/style/main.scss), imported once from `main.ts`.
- Layout: `base/` (resets, general), `shared/` (utilities, support, mixins), `variables/` (colors, font-size). CSS custom properties (e.g. `--color-neutral-200`, `--text-sm`) come from the variables files and are the preferred way to consume design tokens from component styles.
- Components use scoped SCSS: `<style scoped lang="scss">`. When responsive rules or shared mixins are needed, `@use '@/assets/style/shared/mixins' as *;` and use `@include respond-to(md)`.
- Class naming follows BEM (`.block`, `.block__element`, `.block--modifier`).

## Workflow

- **After every commit, re-read this `CLAUDE.md` and check whether it still matches the codebase.** If anything has drifted (new directories, renamed/removed stores, changed scripts, new conventions, etc.), update this file in the same or a follow-up commit. Do not let it go stale.
