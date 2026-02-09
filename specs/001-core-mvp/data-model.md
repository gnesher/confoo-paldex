# Data Model: Paldex Core MVP

**Feature Branch**: `001-core-mvp`  
**Created**: 2026-01-17

## Entity Definitions

### Pal

The primary entity representing a creature in the Paldex.

```typescript
import { z } from 'zod';

// Work suitability for a Pal (what jobs they can do)
export const SuitabilitySchema = z.object({
  workType: z.enum([
    'Kindling',
    'Watering',
    'Planting',
    'Generating Electricity',
    'Handiwork',
    'Gathering',
    'Lumbering',
    'Mining',
    'Medicine Production',
    'Cooling',
    'Transporting',
    'Farming',
  ]),
  level: z.number().int().min(1).max(4),
});

// Item drop from a Pal
export const DropSchema = z.object({
  item: z.string(),
  quantity: z.number().int().min(1),
  dropRate: z.number().min(0).max(1).optional(), // 0-1 probability
});

// Base stats for a Pal
export const StatsSchema = z.object({
  hp: z.number().int().min(0),
  attack: z.number().int().min(0).max(150),
  defense: z.number().int().min(0),
  speed: z.number().int().min(0).optional(),
  stamina: z.number().int().min(0).optional(),
});

// Element types
export const PalTypeSchema = z.enum([
  'Neutral',
  'Fire',
  'Water',
  'Grass',
  'Electric',
  'Ice',
  'Ground',
  'Dark',
  'Dragon',
]);

// Complete Pal entity
export const PalSchema = z.object({
  id: z.string(), // e.g., "001", "002"
  name: z.string(),
  description: z.string().optional(),
  types: z.array(PalTypeSchema).min(1).max(2),
  stats: StatsSchema,
  suitability: z.array(SuitabilitySchema),
  drops: z.array(DropSchema),
  imageUrl: z.string().url(),
});

// Inferred TypeScript types
export type Suitability = z.infer<typeof SuitabilitySchema>;
export type Drop = z.infer<typeof DropSchema>;
export type Stats = z.infer<typeof StatsSchema>;
export type PalType = z.infer<typeof PalTypeSchema>;
export type Pal = z.infer<typeof PalSchema>;
```

### Team (Client State)

The team is an array of Pal objects stored in TanStack Store.

```typescript
import { z } from 'zod';
import { PalSchema } from './pal';

// Team is simply an array of Pals
export const TeamSchema = z.array(PalSchema);

export type Team = z.infer<typeof TeamSchema>;

// Team store state shape
export interface TeamState {
  pals: Team;
}
```

### Search Params (URL State)

Filter parameters stored in URL via TanStack Router.

```typescript
import { z } from 'zod';

export const SearchParamsSchema = z.object({
  q: z.string().optional(),           // Text search query
  types: z.array(z.string()).optional(),  // Multi-select Pal types (e.g., ["Fire", "Water"])
  atkMin: z.coerce.number().min(0).max(150).optional(),  // Minimum attack stat
  atkMax: z.coerce.number().min(0).max(150).optional(),  // Maximum attack stat
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;
```

### Server Function Parameters

```typescript
import { z } from 'zod';

// Parameters for getPals server function
export const GetPalsParamsSchema = z.object({
  search: z.string().optional(),
  types: z.array(z.string()).optional(),
  minAttack: z.number().min(0).max(150).optional(),
  maxAttack: z.number().min(0).max(150).optional(),
});

export type GetPalsParams = z.infer<typeof GetPalsParamsSchema>;

// Parameters for getPalById server function
export const GetPalByIdParamsSchema = z.object({
  id: z.string(),
});

export type GetPalByIdParams = z.infer<typeof GetPalByIdParamsSchema>;
```

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                         URL (Router)                            │
│  SearchParams: { q?, types[]?, atkMin?, atkMax? }              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Server Functions                             │
│  getPals(GetPalsParams) → Pal[]                                │
│  getPalById(id) → Pal                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TanStack Query                             │
│  Caches Pal[] and individual Pal data                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Components                              │
│  - PalGrid (uses Virtual)                                      │
│  - PalCard                                                      │
│  - PalDetail (uses Table)                                      │
│  - FilterSidebar (uses Form + Ranger)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      TanStack Store                             │
│  TeamState: { pals: Pal[] }                                    │
│  Persisted to localStorage                                      │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
app/
├── schemas/
│   ├── pal.ts           # PalSchema, StatsSchema, SuitabilitySchema, DropSchema
│   ├── team.ts          # TeamSchema, TeamState
│   └── search-params.ts # SearchParamsSchema
├── stores/
│   └── team.ts          # TanStack Store instance with actions
├── utils/
│   └── pals.ts          # Server Functions: getPals, getPalById
├── routes/
│   ├── index.tsx        # Dashboard with Virtual grid and filters
│   └── pals/
│       └── $palId.tsx   # Detail view with Table
└── components/
    ├── PalGrid.tsx      # Virtual grid component
    ├── PalCard.tsx      # Individual Pal card
    ├── FilterSidebar.tsx # Form + Ranger filters
    ├── SuitabilityTable.tsx # TanStack Table for work types
    ├── DropsTable.tsx   # TanStack Table for drops
    └── TeamButton.tsx   # Add/Remove from team
```

## Mock Data Example

For initial development, use mocked Pal data:

```typescript
export const mockPals: Pal[] = [
  {
    id: '001',
    name: 'Lamball',
    types: ['Neutral'],
    stats: { hp: 70, attack: 70, defense: 70 },
    suitability: [
      { workType: 'Handiwork', level: 1 },
      { workType: 'Transporting', level: 1 },
      { workType: 'Farming', level: 1 },
    ],
    drops: [
      { item: 'Wool', quantity: 1 },
      { item: 'Lamball Meat', quantity: 1 },
    ],
    imageUrl: '/images/pals/001-lamball.png',
  },
  {
    id: '002',
    name: 'Cattiva',
    types: ['Neutral'],
    stats: { hp: 70, attack: 70, defense: 70 },
    suitability: [
      { workType: 'Handiwork', level: 1 },
      { workType: 'Transporting', level: 1 },
      { workType: 'Gathering', level: 1 },
      { workType: 'Mining', level: 1 },
    ],
    drops: [
      { item: 'Red Berries', quantity: 1 },
    ],
    imageUrl: '/images/pals/002-cattiva.png',
  },
  {
    id: '003',
    name: 'Foxparks',
    types: ['Fire'],
    stats: { hp: 65, attack: 75, defense: 60 },
    suitability: [
      { workType: 'Kindling', level: 1 },
    ],
    drops: [
      { item: 'Flame Organ', quantity: 1 },
      { item: 'Leather', quantity: 1 },
    ],
    imageUrl: '/images/pals/003-foxparks.png',
  },
  // ... more Pals
];
```

## localStorage Schema

The team store persists to localStorage under the key `paldex-team`:

```typescript
// localStorage key
const STORAGE_KEY = 'paldex-team';

// Stored format (JSON stringified)
interface StoredTeam {
  version: 1;  // Schema version for future migrations
  pals: Pal[];
}
```
