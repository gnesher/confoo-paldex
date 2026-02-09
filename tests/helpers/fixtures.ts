import type { Pal, Drop, Suitability } from '~/schemas/pal'

/**
 * Create a mock Pal with sensible defaults and optional overrides.
 */
export function createMockPal(overrides: Partial<Pal> = {}): Pal {
  return {
    id: '001',
    name: 'TestPal',
    types: ['Neutral'],
    stats: { hp: 70, attack: 70, defense: 70 },
    suitability: [{ workType: 'Handiwork', level: 1 }],
    drops: [{ item: 'Wool', quantity: 1 }],
    imageUrl: 'https://example.com/pal/001.png',
    ...overrides,
  }
}

/**
 * Create an array of mock Pals with unique IDs.
 */
export function createMockPals(count: number): Pal[] {
  return Array.from({ length: count }, (_, i) => {
    const id = String(i + 1).padStart(3, '0')
    return createMockPal({
      id,
      name: `Pal${id}`,
      imageUrl: `https://example.com/pal/${id}.png`,
    })
  })
}

/**
 * Well-known fixture: Lamball (ID 001)
 */
export const MOCK_LAMBALL: Pal = {
  id: '001',
  name: 'Lamball',
  types: ['Neutral'],
  stats: { hp: 70, attack: 70, defense: 70 },
  suitability: [
    { workType: 'Handiwork', level: 1 },
    { workType: 'Transporting', level: 1 },
    { workType: 'Farming', level: 1 },
  ],
  drops: [{ item: 'Wool', quantity: 1 }],
  imageUrl: 'https://example.com/pal/001.png',
}

/**
 * Well-known fixture: Foxparks (ID 005) -- Fire type
 */
export const MOCK_FOXPARKS: Pal = {
  id: '005',
  name: 'Foxparks',
  types: ['Fire'],
  stats: { hp: 65, attack: 70, defense: 70 },
  suitability: [{ workType: 'Kindling', level: 1 }],
  drops: [
    { item: 'Leather', quantity: 1 },
    { item: 'Flame Organ', quantity: 1 },
  ],
  imageUrl: 'https://example.com/pal/005.png',
}

/**
 * Dual-type Pal fixture: Pengullet (Water + Ice)
 */
export const MOCK_PENGULLET: Pal = {
  id: '010',
  name: 'Pengullet',
  types: ['Water', 'Ice'],
  stats: { hp: 70, attack: 70, defense: 70 },
  suitability: [
    { workType: 'Watering', level: 1 },
    { workType: 'Cooling', level: 1 },
  ],
  drops: [{ item: 'Ice Organ', quantity: 1 }],
  imageUrl: 'https://example.com/pal/010.png',
}

/**
 * Sample suitability data for table tests.
 */
export const MOCK_SUITABILITY: Suitability[] = [
  { workType: 'Kindling', level: 2 },
  { workType: 'Mining', level: 3 },
  { workType: 'Handiwork', level: 1 },
]

/**
 * Sample drops data for table tests.
 */
export const MOCK_DROPS: Drop[] = [
  { item: 'Flame Organ', quantity: 2, dropRate: 0.75 },
  { item: 'Leather', quantity: 1, dropRate: 0.5 },
  { item: 'Rare Gem', quantity: 1 },
]
