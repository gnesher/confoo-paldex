# Server Functions Contract: Paldex Core MVP

**Feature Branch**: `001-core-mvp`  
**Created**: 2026-01-17  
**File**: `app/utils/pals.ts`

## Overview

All data fetching in Paldex is performed via TanStack Start Server Functions. These functions run
exclusively on the server and are called from the client via RPC.

---

## getPals

Retrieves a filtered list of Pals.

### Signature

```typescript
import { createServerFn } from '@tanstack/start';

export const getPals = createServerFn('GET', async (params: GetPalsParams): Promise<Pal[]>)
```

### Input Schema

```typescript
import { z } from 'zod';

export const GetPalsParamsSchema = z.object({
  search: z.string().optional(),
  types: z.array(z.string()).optional(),
  minAttack: z.number().min(0).max(150).optional(),
  maxAttack: z.number().min(0).max(150).optional(),
});

export type GetPalsParams = z.infer<typeof GetPalsParamsSchema>;
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | `string` | No | Case-insensitive substring match on Pal name |
| `types` | `string[]` | No | Filter by Pal types (e.g., `['Fire', 'Water']`) |
| `minAttack` | `number` | No | Minimum attack stat (0-150) |
| `maxAttack` | `number` | No | Maximum attack stat (0-150) |

### Output Schema

```typescript
// Returns array of Pal objects
Promise<Pal[]>
```

### Response

Returns a filtered array of `Pal` objects matching all provided criteria. Filters are AND-combined.

### Behavior

1. If no parameters provided, returns all Pals
2. `search` performs case-insensitive partial match on `name`
3. `types` matches if Pal has ANY of the specified types
4. `minAttack` / `maxAttack` filter on `stats.attack`
5. **Includes 500ms artificial delay** to demonstrate Suspense loading states

### Example Usage

```typescript
// Get all Pals
const allPals = await getPals({});

// Search by name
const foxPals = await getPals({ search: 'fox' });

// Filter by type and attack range
const firePals = await getPals({
  types: ['Fire'],
  minAttack: 50,
  maxAttack: 100,
});
```

### Error Handling

| Error | Condition | Response |
|-------|-----------|----------|
| Validation Error | Invalid parameter types | Throws Zod validation error |

---

## getPalById

Retrieves a single Pal by ID.

### Signature

```typescript
import { createServerFn } from '@tanstack/start';

export const getPalById = createServerFn('GET', async (params: GetPalByIdParams): Promise<Pal | null>)
```

### Input Schema

```typescript
import { z } from 'zod';

export const GetPalByIdParamsSchema = z.object({
  id: z.string(),
});

export type GetPalByIdParams = z.infer<typeof GetPalByIdParamsSchema>;
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `string` | Yes | Unique Pal identifier (e.g., "001", "002") |

### Output Schema

```typescript
// Returns single Pal or null if not found
Promise<Pal | null>
```

### Response

Returns the `Pal` object matching the ID, or `null` if no Pal exists with that ID.

### Behavior

1. Looks up Pal by exact `id` match
2. Returns `null` for non-existent IDs (client handles 404 display)
3. **Includes 500ms artificial delay** to demonstrate Suspense loading states

### Example Usage

```typescript
// Get specific Pal
const lamball = await getPalById({ id: '001' });

// Handle not found
const pal = await getPalById({ id: 'nonexistent' });
if (!pal) {
  // Show 404 page
}
```

### Error Handling

| Error | Condition | Response |
|-------|-----------|----------|
| Validation Error | Missing or invalid `id` | Throws Zod validation error |
| Not Found | No Pal with given ID | Returns `null` |

---

## Query Integration

### Query Options Factory

```typescript
import { queryOptions } from '@tanstack/react-query';

// For list queries
export const palsQueryOptions = (params: GetPalsParams) => queryOptions({
  queryKey: ['pals', params],
  queryFn: () => getPals(params),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// For single Pal queries
export const palQueryOptions = (id: string) => queryOptions({
  queryKey: ['pal', id],
  queryFn: () => getPalById({ id }),
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

### Route Loader Prefetching

```typescript
// In app/routes/index.tsx
export const Route = createFileRoute('/')({
  validateSearch: SearchParamsSchema,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context: { queryClient }, deps: { search } }) => {
    const params = {
      search: search.q,
      types: search.type ? [search.type] : undefined,
      minAttack: search.atkMin,
      maxAttack: search.atkMax,
    };
    await queryClient.ensureQueryData(palsQueryOptions(params));
  },
});

// In app/routes/pals/$palId.tsx
export const Route = createFileRoute('/pals/$palId')({
  loader: async ({ context: { queryClient }, params: { palId } }) => {
    return queryClient.ensureQueryData(palQueryOptions(palId));
  },
});
```

---

## Implementation Notes

### Artificial Delay

Both functions include a 500ms delay to demonstrate:
- Suspense boundaries in React
- Loading states in the UI
- Query's stale-while-revalidate pattern

```typescript
// Inside server function
await new Promise(resolve => setTimeout(resolve, 500));
```

**For production**: Remove or make configurable via environment variable.

### Mock Data Source

Initial implementation uses in-memory mock data from `app/utils/pals.data.ts`. Future iterations
may integrate with a real API or database.

```typescript
import { mockPals } from './pals.data';

export const getPals = createServerFn('GET', async (params: GetPalsParams) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filtered = [...mockPals];
  
  if (params.search) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  
  // ... other filters
  
  return filtered;
});
```

### Security

Per Constitution Principle II (Server-First Data Flow):
- No API keys exposed to client
- No external URLs in client bundle
- All sensitive operations run server-side only
