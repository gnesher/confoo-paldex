# Research Notes: Paldex Core MVP

**Feature Branch**: `001-core-mvp`  
**Created**: 2026-01-17

## TanStack Start - Server Functions

### createServerFn Pattern

Server Functions in TanStack Start provide type-safe RPC-style communication between client and
server. They run exclusively on the server but can be called from client components.

```typescript
import { createServerFn } from '@tanstack/start';
import { z } from 'zod';

// Define with input validation
export const getPals = createServerFn('GET', async (params: GetPalsParams) => {
  // This code runs on the server only
  // Safe to access databases, APIs, secrets here
  
  // Artificial delay for Suspense demo
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return filteredPals;
});
```

**Key Points**:
- First argument is HTTP method hint ('GET' or 'POST')
- Function body runs server-side only
- Return value is serialized and sent to client
- Type inference works across the boundary
- Integrates with TanStack Query for caching

### Route Loaders with Query

Routes can prefetch data using Query in the loader:

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { queryOptions } from '@tanstack/react-query';

const palQueryOptions = (id: string) => queryOptions({
  queryKey: ['pal', id],
  queryFn: () => getPalById({ id }),
});

export const Route = createFileRoute('/pals/$palId')({
  loader: ({ context: { queryClient }, params: { palId } }) => {
    return queryClient.ensureQueryData(palQueryOptions(palId));
  },
});
```

---

## TanStack Router - Search Params

### validateSearch Pattern

Type-safe URL search params with Zod validation:

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchParamsSchema = z.object({
  q: z.string().optional(),
  type: z.string().optional(),
  atkMin: z.coerce.number().min(0).max(150).optional(),
  atkMax: z.coerce.number().min(0).max(150).optional(),
});

export const Route = createFileRoute('/')({
  validateSearch: searchParamsSchema,
});

// In component:
function Dashboard() {
  const { q, type, atkMin, atkMax } = Route.useSearch();
  const navigate = Route.useNavigate();
  
  // Update search params
  navigate({
    search: (prev) => ({ ...prev, q: 'Lamball' }),
  });
}
```

**Key Points**:
- Use `z.coerce.number()` for numeric params (they come as strings from URL)
- `validateSearch` provides runtime validation + TypeScript types
- `useSearch()` returns typed object
- `useNavigate()` with `search` callback for updates

---

## TanStack Virtual - Grid Virtualization

### useVirtualizer for Grid Layout

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useCallback } from 'react';

function PalGrid({ pals }: { pals: Pal[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Calculate columns based on container width
  const [columns, setColumns] = useState(4);
  
  const rowCount = Math.ceil(pals.length / columns);
  
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated row height
    overscan: 2, // Render 2 extra rows above/below viewport
  });

  return (
    <div ref={parentRef} className="h-screen overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns;
          const rowPals = pals.slice(startIndex, startIndex + columns);
          
          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="grid grid-cols-4 gap-4"
            >
              {rowPals.map((pal) => (
                <PalCard key={pal.id} pal={pal} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Window Resize Handling

```typescript
useEffect(() => {
  const handleResize = () => {
    const width = parentRef.current?.clientWidth ?? 0;
    const newColumns = width < 640 ? 2 : width < 1024 ? 3 : 4;
    setColumns(newColumns);
    virtualizer.measure(); // Force recalculation
  };
  
  window.addEventListener('resize', handleResize);
  handleResize(); // Initial calculation
  
  return () => window.removeEventListener('resize', handleResize);
}, [virtualizer]);
```

---

## TanStack Form - Search Input

### Basic Form Setup

```typescript
import { useForm } from '@tanstack/react-form';

function SearchForm({ defaultValue, onSubmit }) {
  const form = useForm({
    defaultValues: { search: defaultValue ?? '' },
    onSubmit: async ({ value }) => {
      onSubmit(value.search);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="search"
        children={(field) => (
          <input
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder="Search Pals..."
          />
        )}
      />
    </form>
  );
}
```

**Key Points**:
- `useForm` creates form instance with default values
- `form.Field` renders individual fields with automatic state binding
- `field.state.value` for controlled input
- `field.handleChange` for updates

---

## TanStack Ranger - Range Slider

### Dual-Handle Slider

```typescript
import { useRanger } from '@tanstack/react-ranger';
import { useState } from 'react';

function AttackRangeSlider({ min, max, onChange }) {
  const [values, setValues] = useState([min ?? 0, max ?? 150]);
  
  const rangerInstance = useRanger({
    getRangerElement: () => rangerRef.current,
    values,
    min: 0,
    max: 150,
    stepSize: 5,
    onChange: (instance) => {
      setValues(instance.sortedValues);
    },
    onDrag: (instance) => {
      setValues(instance.sortedValues);
    },
  });
  
  const rangerRef = useRef<HTMLDivElement>(null);

  // Notify parent on change complete
  useEffect(() => {
    onChange({ min: values[0], max: values[1] });
  }, [values, onChange]);

  return (
    <div ref={rangerRef} className="relative h-2 bg-gray-200 rounded">
      {/* Track fill */}
      <div
        className="absolute h-full bg-blue-500 rounded"
        style={{
          left: `${rangerInstance.getPercentageForValue(values[0])}%`,
          width: `${rangerInstance.getPercentageForValue(values[1]) - rangerInstance.getPercentageForValue(values[0])}%`,
        }}
      />
      {/* Handles */}
      {rangerInstance.handles().map((handle, i) => (
        <button
          key={i}
          {...handle.getHandleProps()}
          className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-full -translate-x-1/2 -translate-y-1/4"
          style={{ left: `${handle.getPercentageForValue()}%` }}
        />
      ))}
    </div>
  );
}
```

---

## TanStack Table - Headless Tables

### Basic Table Setup

```typescript
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<Suitability>();

const columns = [
  columnHelper.accessor('workType', {
    header: 'Work Type',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('level', {
    header: 'Level',
    cell: (info) => '⭐'.repeat(info.getValue()),
  }),
];

function SuitabilityTable({ data }: { data: Suitability[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

## TanStack Store - Client State

### Store with localStorage Persistence

```typescript
import { Store } from '@tanstack/store';
import type { Pal } from '../schemas/pal';

const STORAGE_KEY = 'paldex-team';

// Hydrate from localStorage
function loadInitialState(): { pals: Pal[] } {
  if (typeof window === 'undefined') return { pals: [] };
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { pals: parsed.pals ?? [] };
    }
  } catch {
    // Ignore parse errors
  }
  return { pals: [] };
}

// Create store
export const teamStore = new Store(loadInitialState());

// Persist on changes
teamStore.subscribe(() => {
  const state = teamStore.state;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, pals: state.pals }));
});

// Actions
export function addPal(pal: Pal) {
  teamStore.setState((prev) => ({
    pals: prev.pals.some((p) => p.id === pal.id) ? prev.pals : [...prev.pals, pal],
  }));
}

export function removePal(palId: string) {
  teamStore.setState((prev) => ({
    pals: prev.pals.filter((p) => p.id !== palId),
  }));
}

export function togglePal(pal: Pal) {
  const exists = teamStore.state.pals.some((p) => p.id === pal.id);
  if (exists) {
    removePal(pal.id);
  } else {
    addPal(pal);
  }
}
```

### Using Store in Components (No Context)

```typescript
import { useStore } from '@tanstack/react-store';
import { teamStore } from '../stores/team';

function TeamButton({ pal }: { pal: Pal }) {
  const isInTeam = useStore(teamStore, (state) => 
    state.pals.some((p) => p.id === pal.id)
  );

  return (
    <button onClick={() => togglePal(pal)}>
      {isInTeam ? 'Remove from Team' : 'Add to Team'}
    </button>
  );
}
```

**Key Points**:
- `new Store(initialState)` creates the store
- `store.subscribe()` for side effects (persistence)
- `store.setState()` with updater function for immutable updates
- `useStore(store, selector)` for reactive component binding
- No React Context needed - import store directly

---

## DevTools Integration

### Root Layout Setup

```typescript
// app/routes/__root.tsx
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      {/* DevTools - Constitution Principle IV */}
      <ReactQueryDevtools initialIsOpen={false} />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
```
