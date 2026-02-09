# Feature Specification: Paldex Core MVP

**Feature Branch**: `001-core-mvp`  
**Created**: 2026-01-17  
**Status**: Draft  
**Constitution**: v1.0.0

## Overview

This specification covers the four foundational features required for the Paldex MVP:

1. **Team Store** - Client-side favorites management (TanStack Store)
2. **Data Layer** - Server Functions for Pal data (TanStack Start)
3. **Dashboard** - Index route with virtual grid and filters (TanStack Virtual, Form, Ranger, Router)
4. **Detail View** - Individual Pal page with stats table (TanStack Table, Query)

## User Scenarios & Testing

### User Story 1 - Browse Pals in Virtual Grid (Priority: P1)

As a user, I want to browse a large list of Pals in a performant grid so that I can discover
creatures without lag or scroll jank.

**Why this priority**: The grid is the primary interface. Without performant browsing, the app is
unusable. This demonstrates TanStack Virtual's core value proposition.

**Independent Test**: Load the index route and scroll through 100+ Pals. Grid must render smoothly
at 60fps with no visible jank.

**Acceptance Scenarios**:

1. **Given** the index route loads, **When** the user scrolls the grid, **Then** only visible items
   are rendered in the DOM (virtualization active).
2. **Given** the browser window is resized, **When** the grid container dimensions change, **Then**
   the virtualizer recalculates and adjusts the visible items accordingly.
3. **Given** server data is loading, **When** the user views the page, **Then** a Suspense loading
   state is displayed (demonstrating the 500ms artificial delay).

---

### User Story 2 - Filter Pals by Search and Stats (Priority: P2)

As a user, I want to filter Pals by name and attack stats so that I can find specific creatures
matching my criteria.

**Why this priority**: Filtering transforms the grid from a simple list into a useful discovery
tool. This demonstrates TanStack Form, Ranger, and Router search params integration.

**Independent Test**: Enter a search term and adjust attack range slider. URL updates and grid
filters correctly.

**Acceptance Scenarios**:

1. **Given** the user types "Lamball" in the search input, **When** the form updates, **Then** the
   URL search params update to `?q=Lamball` and the grid shows only matching Pals.
2. **Given** the user drags the attack slider to 50-100, **When** the slider releases, **Then** the
   URL updates to `?atkMin=50&atkMax=100` and the grid filters to Pals within that range.
3. **Given** the user navigates directly to `/?q=Fox&atkMin=30`, **When** the page loads, **Then**
   the form inputs reflect these values and the grid is pre-filtered.
4. **Given** the user clears all filters, **When** the form resets, **Then** the URL returns to `/`
   with no search params.

---

### User Story 3 - View Pal Details with Stats Table (Priority: P3)

As a user, I want to view detailed information about a specific Pal including its suitability and
drops so that I can make informed decisions about which Pals to add to my team.

**Why this priority**: The detail view provides depth beyond the browse experience. This
demonstrates TanStack Table and Query prefetching.

**Independent Test**: Click a Pal in the grid, navigate to detail page, view suitability table with
sortable columns.

**Acceptance Scenarios**:

1. **Given** the user clicks a Pal card in the grid, **When** navigation completes, **Then** the
   detail page loads at `/pals/{palId}` with prefetched data (no loading spinner if cached).
2. **Given** the detail page is loaded, **When** the user views the Suitability section, **Then** a
   TanStack Table displays Work Type and Level columns.
3. **Given** the detail page is loaded, **When** the user views the Drops section, **Then** a
   TanStack Table displays item drops with quantities.
4. **Given** the Pal data loads, **When** the page renders, **Then** the browser tab title updates
   to "{Pal Name} | Paldex".

---

### User Story 4 - Manage Favorites Team (Priority: P4)

As a user, I want to add and remove Pals from my favorites team so that I can track creatures I'm
interested in across sessions.

**Why this priority**: The team feature adds personalization and demonstrates TanStack Store with
localStorage persistence. It's P4 because the app is useful without it.

**Independent Test**: Add a Pal to team, refresh page, team persists. Remove Pal, team updates.

**Acceptance Scenarios**:

1. **Given** the user is on a Pal detail page, **When** they click "Add to Team", **Then** the Pal
   is added to the team store and the button changes to "Remove from Team".
2. **Given** the user has Pals in their team, **When** they refresh the browser, **Then** the team
   list persists from localStorage.
3. **Given** a Pal is in the team, **When** the user clicks "Remove from Team", **Then** the Pal is
   removed and the button reverts to "Add to Team".
4. **Given** the team store is updated, **When** any component subscribes to the store, **Then** it
   re-renders with the updated team list (no React Context needed).

---

### Edge Cases

- What happens when search returns zero results? Display an empty state message.
- What happens when the Pal ID in the URL doesn't exist? Display a 404 error page.
- What happens when localStorage is unavailable (private browsing)? Gracefully degrade to
  session-only storage with a warning.
- What happens when the attack range slider min exceeds max? Prevent invalid state in the Ranger.
- What happens when the user has 6+ Pals in their team? Allow unlimited team size (no cap).

## Clarifications

### Session 2026-01-17

- Q: How should users filter by Pal type (Fire, Water, etc.)? → A: Multi-select dropdown (select multiple types from dropdown menu)
- Q: When should the search input update the URL and filter results? → A: Debounced (300ms) using TanStack Pacer
- Q: How should the Team component be displayed? → A: Collapsible bottom bar (persistent strip at bottom, expands on click)

## Requirements

### Feature 1: Team Store (TanStack Store)

| ID | Requirement |
|----|-------------|
| **FR-101** | System MUST create a global store using `new Store()` from `@tanstack/store`. |
| **FR-102** | Store MUST persist team data to `localStorage` on every mutation. |
| **FR-103** | Store MUST expose `addPal(pal)` action that adds a Pal to the team array. |
| **FR-104** | Store MUST expose `removePal(palId)` action that removes a Pal by ID. |
| **FR-105** | Store MUST expose `togglePal(pal)` action that adds if absent, removes if present. |
| **FR-106** | Store MUST NOT use React Context for state distribution. Components subscribe directly. |
| **FR-107** | Store MUST hydrate from `localStorage` on initialization. |

**File Location**: `app/stores/team.ts`

---

### Feature 2: Data Layer (Server Functions)

| ID | Requirement |
|----|-------------|
| **FR-201** | System MUST implement `getPals()` as a Server Function using `createServerFn`. |
| **FR-202** | `getPals` MUST accept filter parameters: `{ search?: string, types?: string[], minAttack?: number, maxAttack?: number }`. |
| **FR-203** | System MUST implement `getPalById(id)` as a Server Function. |
| **FR-204** | Both Server Functions MUST include 500ms artificial delay to demonstrate Suspense. |
| **FR-205** | Server Functions MUST NOT expose any API keys or external URLs to the client. |
| **FR-206** | Server Functions MUST return typed data validated by Zod schemas. |

**File Location**: `app/utils/pals.ts`

---

### Feature 3: Dashboard (Index Route)

| ID | Requirement |
|----|-------------|
| **FR-301** | Route MUST be located at `app/routes/index.tsx`. |
| **FR-302** | Route MUST define search params schema: `{ q?: string, types?: string[], atkMin?: number, atkMax?: number }`. |
| **FR-303** | Route MUST use `validateSearch` from TanStack Router for type-safe search params. |
| **FR-304** | Sidebar MUST include a text input connected via TanStack Form with 300ms debounce using TanStack Pacer (`useDebouncedCallback`). |
| **FR-305** | Sidebar MUST include a range slider (0-150) connected via TanStack Ranger for attack filtering. |
| **FR-310** | Sidebar MUST include a multi-select dropdown for Pal type filtering (Fire, Water, Grass, etc.). |
| **FR-306** | Filter changes MUST update URL search params (shareable URLs). |
| **FR-307** | Main grid MUST use `useVirtualizer` from TanStack Virtual. |
| **FR-308** | Grid MUST handle dynamic window resizing without breaking virtualization. |
| **FR-309** | Grid MUST display Pal cards with image, name, and types. |

---

### Feature 4: Pal Detail View

| ID | Requirement |
|----|-------------|
| **FR-401** | Route MUST be located at `app/routes/pals/$palId.tsx`. |
| **FR-402** | Route loader MUST prefetch Pal data using QueryClient. |
| **FR-403** | Route MUST update page `<head>` with Pal name in title and appropriate meta tags. |
| **FR-404** | Page MUST display a Suitability table using TanStack Table (columns: Work Type, Level). |
| **FR-405** | Page MUST display a Drops table using TanStack Table (columns: Item, Quantity). |
| **FR-406** | Page MUST include "Add to Team" / "Remove from Team" button connected to TanStack Store. |
| **FR-407** | Button state MUST reflect current team membership (reactive to store changes). |
| **FR-408** | Team MUST be displayed as a collapsible bottom bar, persistent across all routes. |
| **FR-409** | Bottom bar MUST show team count when collapsed and expand on click to show Pal thumbnails. |

---

### Key Entities

- **Pal**: Represents a creature with `id`, `name`, `types[]`, `stats` (HP, Attack, Defense),
  `suitability[]` (Work Type + Level), `drops[]` (Item + Quantity), `imageUrl`.
- **Team**: Array of Pal objects stored client-side, persisted to localStorage.
- **SearchParams**: URL state object containing `q`, `types[]` (multi-select), `atkMin`, `atkMax`.

## Constitution Compliance

| Principle | Compliance |
|-----------|------------|
| **I. TanStack Only** | ✅ All features use approved TanStack libraries exclusively. |
| **II. Server-First Data Flow** | ✅ `getPals` and `getPalById` use `createServerFn`. No client-side external API calls. |
| **III. State Management Strategy** | ✅ URL params for filters (Router), server data (Query), team list (Store). |
| **IV. Tutorial-Grade Quality** | ✅ Explicit patterns, 500ms delay for Suspense demo, DevTools integration required. |

## Success Criteria

### Measurable Outcomes

| ID | Criterion |
|----|-----------|
| **SC-001** | Virtual grid scrolls at 60fps with 100+ items in the list. |
| **SC-002** | Filter changes reflect in URL within 100ms of user input. |
| **SC-003** | Detail page loads with prefetched data in under 200ms (excluding artificial delay). |
| **SC-004** | Team state persists across browser refresh 100% of the time. |
| **SC-005** | All TanStack DevTools (Router + Query) are visible in development mode. |
| **SC-006** | Window resize does not cause scroll position loss or rendering errors in the grid. |
| **SC-007** | Direct navigation to filtered URL (e.g., `/?q=Fox&atkMin=30`) renders correctly filtered grid. |
