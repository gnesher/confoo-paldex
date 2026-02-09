# Implementation Plan: Paldex Core MVP

**Branch**: `001-core-mvp` | **Date**: 2026-01-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-core-mvp/spec.md`

## Summary

Build the Paldex MVP: a tutorial-grade TanStack ecosystem demo featuring a virtualized Pal browser
with advanced filters, a detail view with stats tables, and a persistent favorites system. The
implementation showcases TanStack Start (Server Functions), Router (search params), Query (caching),
Virtual (grid), Table (stats), Form (search), Ranger (sliders), and Store (favorites).

## Technical Context

**Language/Version**: TypeScript 5.x, React 18.x  
**Primary Dependencies**: TanStack Start, Router, Query, Virtual, Table, Form, Ranger, Store, Pacer, Zod  
**Storage**: localStorage (client-side team persistence), no database  
**Testing**: Vitest + React Testing Library  
**Target Platform**: Web (SSR via TanStack Start, all modern browsers)  
**Project Type**: Full-stack web application (single project structure)  
**Performance Goals**: 60fps grid scrolling, <100ms filter response, <200ms navigation  
**Constraints**: No external state libraries, TanStack ecosystem only  
**Scale/Scope**: 100+ Pals in grid, single user, tutorial-focused

## Constitution Check

*GATE: Must pass before implementation. All items verified against Constitution v1.0.0.*

| Principle | Gate | Status |
|-----------|------|--------|
| **I. TanStack Only** | All routing, state, data fetching, virtualization, tables, forms, and sliders use TanStack libraries | ✅ Pass |
| **II. Server-First Data Flow** | `getPals` and `getPalById` implemented as Server Functions via `createServerFn` | ✅ Pass |
| **III. State Management Strategy** | Filters in URL (Router), server data in Query, team in Store + localStorage | ✅ Pass |
| **IV. Tutorial-Grade Quality** | DevTools enabled, 500ms delay for Suspense demo, explicit hook patterns | ✅ Pass |

**No violations. Complexity Tracking section not required.**

## Project Structure

### Documentation (this feature)

```text
specs/001-core-mvp/
├── plan.md              # This file
├── spec.md              # Feature specification
├── data-model.md        # Zod schemas and entity definitions
├── research.md          # TanStack library research notes
├── quickstart.md        # Developer setup guide
├── contracts/
│   └── server-functions.md  # Server Function API contracts
└── tasks.md             # Task breakdown (created by /speckit.tasks)
```

### Source Code (repository root)

```text
app/
├── routes/
│   ├── __root.tsx           # Root layout with DevTools
│   ├── index.tsx            # Dashboard route (P1 + P2)
│   └── pals/
│       └── $palId.tsx       # Detail view route (P3 + P4)
├── components/
│   ├── PalGrid.tsx          # Virtual grid (P1)
│   ├── PalCard.tsx          # Grid item card (P1)
│   ├── FilterSidebar.tsx    # Form + Ranger filters (P2)
│   ├── SuitabilityTable.tsx # TanStack Table for work types (P3)
│   ├── DropsTable.tsx       # TanStack Table for drops (P3)
│   ├── TeamButton.tsx       # Add/Remove team button (P4)
│   └── TeamDrawer.tsx       # Floating team display (P4)
├── schemas/
│   ├── pal.ts               # Pal, Stats, Suitability, Drop schemas
│   ├── team.ts              # Team schema
│   └── search-params.ts     # URL search params schema
├── stores/
│   └── team.ts              # TanStack Store for favorites
├── utils/
│   ├── pals.ts              # Server Functions: getPals, getPalById
│   └── pals.data.ts         # Mock Pal data (100+ entries)
└── styles/
    └── globals.css          # Tailwind imports

public/
└── images/
    └── pals/                # Pal images (placeholders initially)

tests/
├── unit/
│   └── stores/
│       └── team.test.ts     # Store unit tests
└── integration/
    └── filters.test.tsx     # Filter integration tests
```

**Structure Decision**: Single full-stack project using TanStack Start's file-based routing. No
separate frontend/backend split since Server Functions handle all server-side logic within the
same codebase.

## Implementation Phases

### Phase 0: Project Scaffold

- Initialize TanStack Start project
- Configure Tailwind CSS
- Setup Vitest with React Testing Library
- Create base project structure (folders, empty files)
- Add all TanStack dependencies

### Phase 1: Foundation Layer

- Define Zod schemas (`app/schemas/`)
- Create mock Pal data (100+ entries for virtualization testing)
- Implement Server Functions (`app/utils/pals.ts`)
- Implement Team Store (`app/stores/team.ts`)
- Setup root layout with DevTools (`app/routes/__root.tsx`)

### Phase 2: User Story P1 - Virtual Grid

- Build `PalCard` component
- Build `PalGrid` component with `useVirtualizer`
- Implement index route with basic grid display
- Handle window resize for virtualizer
- Add Suspense boundary for loading state

### Phase 3: User Story P2 - Filters

- Define search params schema with `validateSearch`
- Build `FilterSidebar` with TanStack Form (text search)
- Integrate TanStack Ranger for attack range slider
- Wire filters to URL search params
- Connect filtered params to `getPals` Server Function

### Phase 4: User Story P3 - Detail View

- Create detail route with dynamic `$palId` parameter
- Implement Query prefetching in route loader
- Build `SuitabilityTable` with TanStack Table
- Build `DropsTable` with TanStack Table
- Update page head (title, meta)

### Phase 5: User Story P4 - Team Feature

- Build `TeamButton` component (subscribes to Store)
- Build `TeamDrawer` floating component
- Integrate team button into detail view
- Test localStorage persistence

### Phase 6: Polish

- Empty states (no results, 404)
- Error boundaries
- Loading skeletons
- Final styling pass
- Performance validation (60fps scroll test)

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Grid virtualization** | `useVirtualizer` with estimated item size | Handles 100+ items without DOM bloat |
| **Filter state** | URL search params | Shareable URLs, browser back/forward support |
| **Team persistence** | localStorage with version field | Simple, no backend needed, supports migration |
| **Data fetching** | Server Functions + Query | SSR support, automatic caching, deduplication |
| **Form library** | TanStack Form | Constitution compliance, type-safe field binding |
| **Table library** | TanStack Table (headless) | Constitution compliance, full control over rendering |

## Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-form": "latest",
    "@tanstack/react-query": "latest",
    "@tanstack/react-query-devtools": "latest",
    "@tanstack/react-ranger": "latest",
    "@tanstack/react-router": "latest",
    "@tanstack/react-router-devtools": "latest",
    "@tanstack/react-table": "latest",
    "@tanstack/react-virtual": "latest",
    "@tanstack/start": "latest",
    "@tanstack/store": "latest",
    "@tanstack/react-pacer": "latest",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@testing-library/react": "latest",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "latest",
    "postcss": "latest",
    "tailwindcss": "latest",
    "typescript": "^5.3.0",
    "vitest": "latest"
  }
}
```

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| TanStack Start API changes | Medium | High | Pin versions, check docs frequently |
| Virtual grid resize edge cases | Medium | Medium | Test on multiple viewport sizes |
| localStorage quota exceeded | Low | Low | Limit team size to 50 Pals if needed |
| Form + Router search param sync | Medium | Medium | Follow official TanStack patterns |

## Complexity Tracking

> No violations. All implementation choices align with constitution principles.
