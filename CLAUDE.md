# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A SvelteKit workout timer/planner app. Users select exercises, configure timing settings, reorder via drag-and-drop, and run timed workouts with audio cues. Built as a static site (adapter-static), no backend.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build (static output to `/build`)
- `npm run preview` — Preview production build
- `npm run check` — Type-check with svelte-check
- `npm run lint` — Run Prettier check + ESLint
- `npm run format` — Auto-format with Prettier

No test framework is configured.

## Architecture

**Routing:** Two pages via SvelteKit file-based routing:
- `/` (`src/routes/+page.svelte`) — Exercise selection, search, filtering, settings
- `/workout` (`src/routes/workout/+page.svelte`) — Workout timer with phases, audio beeps, progress ring

**State Management:** Custom Svelte writable stores distributed via Svelte Context API in `+layout.svelte`. Store interfaces are defined in `src/lib/types/customTypes.ts`:
- `ExerciseStore` — All available exercises with a `select()` method
- `SelectedExerciseStore` — Chosen exercises with `add()`, `remove()`, `swap()` methods
- `WorkoutSettingsStore` — Timer durations, repetitions, set/cycle mode

**Components** (`src/components/`):
- `ExerciseList.svelte` — Selectable exercise list with fuzzy search (fuse.js) and category filters
- `DraggableExerciseList.svelte` — Reorderable selected exercises via HTML5 drag-and-drop
- `FormattedTime.svelte` — Time display formatter
- `CategoryColorIndicator.svelte` — Category color dots

**Exercise Data:** `src/lib/data/exercises.json` — 60+ exercises with `id`, `name`, `description`, `categories[]`, optional `switchSides` boolean. Categories: core, arms, legs, cardio.

**Mobile Support:** `static/DragDropTouch.js` polyfill enables drag-and-drop on touch devices. Loaded in `app.html`.

## Tech Stack

- SvelteKit 2 + TypeScript + Vite 5
- Tailwind CSS 3 (utility-first, mobile-first breakpoints)
- fuse.js for fuzzy search, lucide-svelte for icons
- Web Audio API for workout beeps, Wake Lock API to prevent screen sleep

## Code Style

- Prettier: tabs, single quotes, 100 char print width
- ESLint with TypeScript + Svelte plugins
- Components use `createEventDispatcher` for child-to-parent communication
