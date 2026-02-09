# Tasks: Paldex Core MVP

**Input**: Design documents from `/specs/001-core-mvp/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Unit tests for Store, Integration tests for Filters (per spec.md)

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Exact file paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and TanStack Start scaffold

- [x] T001 Initialize TanStack Start project using `npx create-tsrouter@latest`
- [x] T002 Install all TanStack dependencies per plan.md (Router, Query, Virtual, Table, Form, Ranger, Store, Pacer)
- [x] T003 [P] Configure Tailwind CSS with `tailwind.config.js` and `app/styles/globals.css`
- [x] T004 [P] Configure Vitest with `vitest.config.ts` and `tests/setup.ts`
- [x] T005 [P] Create directory structure: `app/schemas/`, `app/stores/`, `app/utils/`, `app/components/`
- [x] T006 [P] Create placeholder directories: `public/images/pals/`, `tests/unit/stores/`, `tests/integration/`

**Checkpoint**: Project builds and runs with `npm run dev`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure required before ANY user story can begin

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Schemas (all parallel)

- [x] T007 [P] Create Pal schema in `app/schemas/pal.ts` (PalSchema, StatsSchema, SuitabilitySchema, DropSchema, PalTypeSchema)
- [x] T008 [P] Create Team schema in `app/schemas/team.ts` (TeamSchema, TeamState interface)
- [x] T009 [P] Create SearchParams schema in `app/schemas/search-params.ts` (with `types[]` array for multi-select)

### Mock Data

- [x] T010 Create mock Pal data (100+ entries) in `app/utils/pals.data.ts` with variety of types, stats, suitability

### Server Functions

- [x] T011 Implement `getPals` Server Function in `app/utils/pals.ts` with filter logic (search, types[], minAttack, maxAttack)
- [x] T012 Implement `getPalById` Server Function in `app/utils/pals.ts`
- [x] T013 Add 500ms artificial delay to both Server Functions for Suspense demo

### Team Store

- [x] T014 Implement TanStack Store in `app/stores/team.ts` with `new Store()` (FR-101)
- [x] T015 Add localStorage persistence with hydration on init (FR-102, FR-107)
- [x] T016 Implement `addPal`, `removePal`, `togglePal` actions (FR-103, FR-104, FR-105)

### Root Layout

- [x] T017 Create root layout `app/routes/__root.tsx` with QueryClient context
- [x] T018 Add TanStack Router DevTools to root layout (Constitution Principle IV)
- [x] T019 Add TanStack Query DevTools to root layout (Constitution Principle IV)

**Checkpoint**: Foundation ready - Server Functions return data, Store persists, DevTools visible

---

## Phase 3: User Story 1 - Browse Pals in Virtual Grid (Priority: P1) 🎯 MVP

**Goal**: Display 100+ Pals in a performant virtualized grid

**Independent Test**: Load index route, scroll through grid at 60fps with no jank

### Tests for User Story 1

- [ ] T020 [P] [US1] Unit test for mock data structure validation in `tests/unit/pals.data.test.ts`

### Implementation for User Story 1

- [x] T021 [P] [US1] Create `PalCard` component in `app/components/PalCard.tsx` (image, name, types display)
- [x] T022 [US1] Create `PalGrid` component in `app/components/PalGrid.tsx` with `useVirtualizer`
- [x] T023 [US1] Add window resize handler to `PalGrid` for responsive column count
- [x] T024 [US1] Create index route `app/routes/index.tsx` with basic layout (grid area + sidebar placeholder)
- [x] T025 [US1] Wire index route loader to call `getPals` Server Function
- [x] T026 [US1] Add Suspense boundary with loading skeleton in index route
- [x] T027 [US1] Style grid layout with Tailwind (responsive columns: 2/3/4 based on viewport)

**Checkpoint**: User Story 1 complete - Grid displays 100+ Pals, scrolls smoothly, handles resize

---

## Phase 4: User Story 2 - Filter Pals by Search and Stats (Priority: P2)

**Goal**: Filter grid by text search, type multi-select, and attack range

**Independent Test**: Enter search term, adjust filters → URL updates, grid filters correctly

### Tests for User Story 2

- [ ] T028 [P] [US2] Integration test for filter URL sync in `tests/integration/filters.test.tsx`

### Implementation for User Story 2

- [x] T029 [US2] Define `validateSearch` schema in `app/routes/index.tsx` (q, types[], atkMin, atkMax)
- [x] T030 [US2] Create `FilterSidebar` component in `app/components/FilterSidebar.tsx`
- [x] T031 [US2] Add TanStack Form text input with 300ms debounce via TanStack Pacer (`useDebouncedCallback`)
- [x] T032 [US2] Add multi-select dropdown for Pal type filtering (FR-310)
- [x] T033 [US2] Add TanStack Ranger dual-handle slider for attack range (0-150)
- [x] T034 [US2] Wire filter changes to `navigate({ search })` for URL update
- [x] T035 [US2] Update index route loader to pass search params to `getPals`
- [x] T036 [US2] Hydrate form inputs from URL search params on page load
- [x] T037 [US2] Add empty state component for zero results in `app/components/EmptyState.tsx`

**Checkpoint**: User Story 2 complete - Filters work, URL is shareable, form hydrates from URL

---

## Phase 5: User Story 3 - View Pal Details with Stats Table (Priority: P3)

**Goal**: Detail page with suitability and drops tables, Query prefetching

**Independent Test**: Click Pal card → navigate to detail page → view tables with data

### Implementation for User Story 3

- [x] T038 [P] [US3] Create `SuitabilityTable` component in `app/components/SuitabilityTable.tsx` using TanStack Table
- [x] T039 [P] [US3] Create `DropsTable` component in `app/components/DropsTable.tsx` using TanStack Table
- [x] T040 [US3] Create detail route `app/routes/pals/$palId.tsx` with dynamic parameter
- [x] T041 [US3] Implement route loader with QueryClient prefetch for `getPalById`
- [x] T042 [US3] Create `palQueryOptions` factory function for Query cache keys
- [x] T043 [US3] Build detail page layout (hero image, name, types, stats summary)
- [x] T044 [US3] Integrate `SuitabilityTable` into detail page
- [x] T045 [US3] Integrate `DropsTable` into detail page
- [x] T046 [US3] Update page `<head>` with Pal name in title using route meta
- [x] T047 [US3] Add Link from `PalCard` to detail route `/pals/{id}`
- [x] T048 [US3] Create 404 `NotFound` component for invalid Pal IDs

**Checkpoint**: User Story 3 complete - Detail page shows Pal info, tables render, navigation works

---

## Phase 6: User Story 4 - Manage Favorites Team (Priority: P4)

**Goal**: Add/remove Pals from team, persist to localStorage, show in bottom bar

**Independent Test**: Add Pal to team → refresh page → team persists

### Tests for User Story 4

- [ ] T049 [P] [US4] Unit test for Team Store actions in `tests/unit/stores/team.test.ts`
- [ ] T050 [P] [US4] Unit test for localStorage persistence in `tests/unit/stores/team.test.ts`

### Implementation for User Story 4

- [x] T051 [US4] Create `TeamButton` component in `app/components/TeamButton.tsx` using `useStore`
- [x] T052 [US4] Implement reactive button state (Add to Team / Remove from Team)
- [x] T053 [US4] Integrate `TeamButton` into detail page (FR-406)
- [x] T054 [US4] Create `TeamBottomBar` component in `app/components/TeamBottomBar.tsx` (FR-408)
- [x] T055 [US4] Implement collapsed state showing team count badge
- [x] T056 [US4] Implement expanded state showing Pal thumbnails with remove buttons
- [x] T057 [US4] Add expand/collapse toggle animation
- [x] T058 [US4] Integrate `TeamBottomBar` into root layout (persistent across routes)
- [x] T059 [US4] Handle localStorage unavailable gracefully (session-only fallback with warning)

**Checkpoint**: User Story 4 complete - Team persists, bottom bar shows count/thumbnails

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final quality improvements across all user stories

- [x] T060 [P] Add error boundary wrapper component in `app/components/ErrorBoundary.tsx`
- [x] T061 [P] Add loading skeleton components for grid and detail page
- [x] T062 [P] Add placeholder Pal images in `public/images/pals/` (or use external placeholder service)
- [x] T063 Style refinements: hover states, transitions, focus rings for accessibility
- [ ] T064 Performance validation: verify 60fps scroll in grid with 100+ items
- [ ] T065 Test window resize behavior at multiple viewport sizes
- [ ] T066 Verify all TanStack DevTools visible in development mode
- [ ] T067 Run quickstart.md validation checklist
- [x] T068 Final code review for Constitution compliance

**Checkpoint**: MVP complete and polished

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup ─────────────────────────────────────────────┐
                                                            │
Phase 2: Foundational ──────────────────────────────────────┤ BLOCKS ALL
                                                            │
    ┌───────────────────────────────────────────────────────┘
    │
    ├── Phase 3: US1 - Virtual Grid (P1) 🎯 MVP
    │       │
    │       └── Phase 4: US2 - Filters (P2) [builds on grid]
    │               │
    │               └── Phase 5: US3 - Detail View (P3) [adds navigation target]
    │                       │
    │                       └── Phase 6: US4 - Team Feature (P4) [adds team button]
    │
    └── Phase 7: Polish [after all user stories]
```

### User Story Dependencies

| Story | Can Start After | Dependencies |
|-------|----------------|--------------|
| US1 (P1) | Phase 2 complete | None (MVP baseline) |
| US2 (P2) | US1 complete | Grid must exist to filter |
| US3 (P3) | US1 complete | Grid cards link to detail |
| US4 (P4) | US3 complete | Team button goes on detail page |

### Within Each User Story

1. Tests first (if applicable) - ensure they fail
2. Components before routes
3. Route loader before UI integration
4. Core functionality before styling

### Parallel Opportunities

**Phase 1** (all parallel after T001, T002):
- T003, T004, T005, T006

**Phase 2** (schemas parallel, then sequential):
- T007, T008, T009 (parallel)
- T010 → T011, T012, T013 (sequential - data before functions)
- T014, T015, T016 (sequential - store setup)
- T017, T018, T019 (sequential - layout setup)

**Phase 3+** (tests parallel with each other):
- T020 parallel
- T021 parallel with T028 (different files)
- T038, T039 parallel (separate table components)
- T049, T050 parallel (same test file, different cases)

---

## Task Count Summary

| Phase | Task Count | Parallel Opportunities |
|-------|------------|----------------------|
| Setup | 6 | 4 |
| Foundational | 13 | 3 |
| US1 (P1) | 8 | 2 |
| US2 (P2) | 10 | 1 |
| US3 (P3) | 11 | 2 |
| US4 (P4) | 11 | 2 |
| Polish | 9 | 3 |
| **Total** | **68** | **17** |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Virtual Grid)
4. **STOP and VALIDATE**: Grid works, 60fps scroll
5. Demo/deploy basic browsing capability

### Full Feature Set

Continue after MVP validation:
1. Phase 4: US2 (Filters) → shareable filtered URLs
2. Phase 5: US3 (Detail View) → deep Pal information
3. Phase 6: US4 (Team Feature) → personalization
4. Phase 7: Polish → production quality

---

## Notes

- All file paths are relative to repository root
- [P] tasks have no dependencies and can run in parallel
- [USn] label maps task to user story for traceability
- Commit after each task or logical group
- Constitution compliance verified in T068
