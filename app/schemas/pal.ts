import { z } from 'zod'

/**
 * Work suitability for a Pal (what jobs they can do)
 */
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
})

/**
 * Item drop from a Pal
 */
export const DropSchema = z.object({
  item: z.string(),
  quantity: z.number().int().min(1),
  dropRate: z.number().min(0).max(1).optional(),
})

/**
 * Base stats for a Pal
 */
export const StatsSchema = z.object({
  hp: z.number().int().min(0),
  attack: z.number().int().min(0).max(200),
  defense: z.number().int().min(0),
  speed: z.number().int().min(0).optional(),
  stamina: z.number().int().min(0).optional(),
})

/**
 * Element types available in Palworld
 */
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
])

/**
 * Complete Pal entity
 */
export const PalSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  types: z.array(PalTypeSchema).min(1).max(2),
  stats: StatsSchema,
  suitability: z.array(SuitabilitySchema),
  drops: z.array(DropSchema),
  imageUrl: z.string(),
})

// Inferred TypeScript types
export type Suitability = z.infer<typeof SuitabilitySchema>
export type Drop = z.infer<typeof DropSchema>
export type Stats = z.infer<typeof StatsSchema>
export type PalType = z.infer<typeof PalTypeSchema>
export type Pal = z.infer<typeof PalSchema>

// Work type labels for display
export const WORK_TYPE_ICONS: Record<Suitability['workType'], string> = {
  'Kindling': '🔥',
  'Watering': '💧',
  'Planting': '🌱',
  'Generating Electricity': '⚡',
  'Handiwork': '🔧',
  'Gathering': '🧺',
  'Lumbering': '🪓',
  'Mining': '⛏️',
  'Medicine Production': '💊',
  'Cooling': '❄️',
  'Transporting': '📦',
  'Farming': '🌾',
}

// Type colors for badges
export const PAL_TYPE_COLORS: Record<PalType, string> = {
  'Neutral': 'bg-neutral',
  'Fire': 'bg-fire',
  'Water': 'bg-water',
  'Grass': 'bg-grass',
  'Electric': 'bg-electric',
  'Ice': 'bg-ice',
  'Ground': 'bg-ground',
  'Dark': 'bg-dark',
  'Dragon': 'bg-dragon',
}
