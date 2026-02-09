<!--
  SYNC IMPACT REPORT
  ==================
  Version change: N/A → 1.0.0 (initial ratification)
  
  Added Principles:
    - I. TanStack Only
    - II. Server-First Data Flow
    - III. State Management Strategy
    - IV. Tutorial-Grade Quality
  
  Added Sections:
    - Technology Stack
    - Feature Specifications
    - Development Workflow (Spec-Kit)
  
  Removed Sections: N/A (initial constitution)
  
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ (compatible - Constitution Check section exists)
    - .specify/templates/spec-template.md ✅ (compatible - no changes needed)
    - .specify/templates/tasks-template.md ✅ (compatible - no changes needed)
    - .specify/templates/checklist-template.md ✅ (compatible - no changes needed)
    - .specify/templates/agent-file-template.md ✅ (compatible - no changes needed)
  
  Follow-up TODOs: None
-->

# Paldex Constitution

This document defines the non-negotiable architectural, technical, and stylistic principles for the
Paldex project. All AI agents and developers contributing to this project MUST adhere strictly to
these guidelines.

## Project Vision

The **Paldex** is a comprehensive tutorial-grade application designed to demonstrate the **entire**
TanStack ecosystem. It serves as a "Pokedex" for Palworld, featuring advanced filtering,
virtualization, detailed stats, and a client-side "Team Builder."

## Core Principles

### I. TanStack Only

The project MUST strictly utilize the TanStack ecosystem for all application concerns. No
alternative libraries for routing, state management, data fetching, or UI virtualization are
permitted.

**Rationale**: This project exists to demonstrate the full TanStack ecosystem as a cohesive
tutorial. Mixing in external alternatives defeats the educational purpose.

### II. Server-First Data Flow

- Server Functions MUST be used (`createServerFn`) for all backend logic including fetching Pals
  from external sources.
- The client MUST NOT perform direct API calls to external services.
- API keys, third-party URLs, and sensitive configuration MUST NOT be exposed to the client bundle.

**Rationale**: Server Functions provide a secure boundary, prevent credential leakage, and
demonstrate the TanStack Start full-stack architecture properly.

### III. State Management Strategy

State MUST be managed according to the following rules:

| State Type | Tool | Storage |
|------------|------|---------|
| **Ephemeral UI state** (filters, sorting, search queries) | TanStack Router | URL Search Params via `validateSearch` |
| **Server state** (fetched data) | TanStack Query | Query options with stale time, prefetching |
| **Global client state** (user preferences, "My Team" list) | TanStack Store | Persisted to `localStorage` |

**Rationale**: Clear separation of state concerns ensures predictability, enables URL sharing for
filters, and leverages each tool's strengths.

### IV. Tutorial-Grade Quality

- DevTools MUST be explicitly enabled: `TanStack Router Devtools` and `TanStack Query Devtools` in
  the root layout.
- Patterns MUST NOT be hidden: Components like `Ranger` slider or `Virtual` list MUST clearly show
  how hooks interact with the UI.
- Code MUST favor explicitness over cleverness to serve the educational purpose.

**Rationale**: As a tutorial project, visibility and clarity trump brevity. Developers learning from
this codebase MUST be able to trace data flow and understand hook interactions.

## Technology Stack

All dependencies MUST align with this approved stack:

| Concern | Library | Purpose |
|---------|---------|---------|
| Framework | [TanStack Start](https://tanstack.com/start/latest) | SSR, Server Functions, full-stack architecture |
| Routing | [TanStack Router](https://tanstack.com/router/latest) | File-based routing, type-safe URL search params |
| Data Fetching | [TanStack Query](https://tanstack.com/query/latest) | Server state management and caching |
| Virtualization | [TanStack Virtual](https://tanstack.com/virtual/latest) | Main Pal grid (critical for performance) |
| Data Tables | [TanStack Table](https://tanstack.com/table/latest) | Headless table for moves/skills |
| Forms | [TanStack Form](https://tanstack.com/form/latest) | Main search input |
| Range Sliders | [TanStack Ranger](https://tanstack.com/ranger/latest) | Stat range filters (HP, Attack, Defense) |
| Client State | [TanStack Store](https://tanstack.com/store/latest) | "My Team" (Favorites) feature |
| Debouncing | [TanStack Pacer](https://tanstack.com/pacer/latest) | Input debouncing for search filters |
| Validation | [Zod](https://zod.dev/) | Schema validation |
| Testing | [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) | Unit and integration tests |
| Styling | Tailwind CSS | Utility-first CSS |

## Feature Specifications

### The Index Route (Dashboard)

- **Virtual Grid**: Display Pals in a responsive grid using `useVirtualizer`.
- **Sidebar Filters**:
  - TanStack Form for text search.
  - TanStack Ranger for multi-handle sliders (Min/Max Attack, Defense).
  - All filter state MUST reflect in URL Search Params.

### The Detail Route (Pal Profile)

- **Moves Table**: TanStack Table to display the Pal's active skills.
- **Team Toggle**: Button to Add/Remove the Pal from "My Team" (via TanStack Store).

### The "My Team" Component

- Persistent floating drawer or bottom bar showing selected Pals.
- Powered exclusively by TanStack Store.
- MUST persist to `localStorage`.

## Development Workflow (Spec-Kit)

Implementation MUST follow this phased approach:

1. **Scaffold**: Setup TanStack Start + Tailwind + Vitest.
2. **Data Layer**: Define Zod schemas and `createServerFn` (mocked data initially).
3. **State Layer**: Initialize TanStack Store for the "Team" feature.
4. **UI Core**: Build Layout and integrate DevTools.
5. **Feature A**: Index page with Virtual Grid.
6. **Feature B**: Advanced Filters using Form + Ranger.
7. **Feature C**: Detail page with Table.
8. **Testing**: Unit tests for Store; Integration tests for Filters.

## Governance

- This constitution supersedes all other practices for the Paldex project.
- Amendments require:
  1. Documentation of the proposed change and rationale.
  2. Version increment following semantic versioning:
     - **MAJOR**: Backward-incompatible principle removals or redefinitions.
     - **MINOR**: New principle/section added or materially expanded guidance.
     - **PATCH**: Clarifications, wording fixes, non-semantic refinements.
  3. Update to `LAST_AMENDED_DATE`.
- All PRs and code reviews MUST verify compliance with this constitution.
- Complexity beyond these guidelines MUST be justified in the relevant spec or plan document.

**Version**: 1.0.0 | **Ratified**: 2026-01-17 | **Last Amended**: 2026-01-17
