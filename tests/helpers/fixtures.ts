import type { Pal, Drop, Suitability } from '~/schemas/pal'

const IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/mlg404/palworld-paldex-api/main/public/images/paldeck'

export function createMockPal(overrides: Partial<Pal> = {}): Pal {
  const id = overrides.id ?? '001'
  return {
    id,
    name: 'TestPal',
    types: ['Neutral'],
    stats: { hp: 70, attack: 70, defense: 70 },
    suitability: [{ workType: 'Handiwork', level: 1 }],
    drops: [{ item: 'Wool', quantity: 1 }],
    imageUrl: `${IMAGE_BASE_URL}/${id}.png`,
    ...overrides,
  }
}

export function createMockPals(count: number): Pal[] {
  return Array.from({ length: count }, (_, i) => {
    const id = String(i + 1).padStart(3, '0')
    return createMockPal({
      id,
      name: `Pal${id}`,
      imageUrl: `${IMAGE_BASE_URL}/${id}.png`,
    })
  })
}

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
  imageUrl: `${IMAGE_BASE_URL}/001.png`,
}

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
  imageUrl: `${IMAGE_BASE_URL}/005.png`,
}

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
  imageUrl: `${IMAGE_BASE_URL}/010.png`,
}

export const MOCK_SUITABILITY: Suitability[] = [
  { workType: 'Kindling', level: 2 },
  { workType: 'Mining', level: 3 },
  { workType: 'Handiwork', level: 1 },
]

export const MOCK_DROPS: Drop[] = [
  { item: 'Flame Organ', quantity: 2, dropRate: 0.75 },
  { item: 'Leather', quantity: 1, dropRate: 0.5 },
  { item: 'Rare Gem', quantity: 1 },
]
