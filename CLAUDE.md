# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Vue 3 (Composition API, `<script setup lang="ts">`) + Vite + Pinia + TypeScript. Unit tests via Vitest, E2E via Cypress. Package manager is **bun** (see `bun.lock`).

## Commands

- `bun dev` — Vite dev server with HMR
- `bun run build` — runs `type-check` (via `vue-tsc --build`) and `build-only` (Vite build) in parallel
- `bun run type-check` — type-check only, no emit
- `bun test:unit` — Vitest (watch mode by default; pass `--run` for single-shot, or a path/name pattern to filter e.g. `bun test:unit src/stores/counter.spec.ts`)
- `bun test:e2e:dev` — Cypress against the Vite dev server (fast, for local iteration)
- `bun test:e2e` — Cypress against `vite preview` of a production build (run `bun run build` first; this is what CI should use)
- `bun lint` — ESLint with `--fix --cache`
- `bun format` — Prettier across `src/`

Single Cypress spec: `bunx cypress run --spec cypress/e2e/example.cy.ts` (server must already be running on `http://localhost:4173`).

## Architecture notes

- Entry: [src/main.ts](src/main.ts) creates the app, installs Pinia, and mounts `#app`. No router is configured yet.
- State: Pinia stores live in [src/stores/](src/stores/) and use the **setup-store** form (`defineStore('name', () => { ... })`) rather than the options form. Follow that pattern for new stores.
- Path alias: `@/*` → `./src/*` (configured in both [vite.config.ts](vite.config.ts) and [tsconfig.app.json](tsconfig.app.json)). Prefer `@/...` imports over long relative paths.
- TS config is split: `tsconfig.app.json` for app code (excludes `__tests__`), `tsconfig.vitest.json` for unit tests, `tsconfig.node.json` for build tooling. `noUncheckedIndexedAccess` is on — array/object index access returns `T | undefined`, handle accordingly.
- Tests colocate under `src/**/__tests__/` (excluded from the app tsconfig; picked up by Vitest).

## Current state

The project is a fresh scaffold: [src/App.vue](src/App.vue) is an empty shell and [src/stores/counter.ts](src/stores/counter.ts) is the default template store. Expect to build the horse-racing feature from scratch.
