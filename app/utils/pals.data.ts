import type { Pal, PalType, Suitability } from '~/schemas/pal'

const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/mlg404/palworld-paldex-api/main/public/images/paldeck'

function getPalImageUrl(id: string): string {
  return `${IMAGE_BASE_URL}/${id}.png`
}

const REAL_PALS: { id: string; name: string; types: PalType[]; stats: { hp: number; attack: number; defense: number }; suitability: Suitability[]; drops: { item: string; quantity: number }[] }[] = [
  { id: '001', name: 'Lamball', types: ['Neutral'], stats: { hp: 70, attack: 70, defense: 70 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Transporting', level: 1 }, { workType: 'Farming', level: 1 }], drops: [{ item: 'Wool', quantity: 1 }] },
  { id: '002', name: 'Cattiva', types: ['Neutral'], stats: { hp: 70, attack: 70, defense: 70 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Mining', level: 1 }], drops: [{ item: 'Red Berries', quantity: 1 }] },
  { id: '003', name: 'Chikipi', types: ['Neutral'], stats: { hp: 60, attack: 70, defense: 60 }, suitability: [{ workType: 'Gathering', level: 1 }, { workType: 'Farming', level: 1 }], drops: [{ item: 'Egg', quantity: 1 }] },
  { id: '004', name: 'Lifmunk', types: ['Grass'], stats: { hp: 75, attack: 70, defense: 70 }, suitability: [{ workType: 'Planting', level: 1 }, { workType: 'Handiwork', level: 1 }, { workType: 'Lumbering', level: 1 }], drops: [{ item: 'Berry Seeds', quantity: 1 }] },
  { id: '005', name: 'Foxparks', types: ['Fire'], stats: { hp: 65, attack: 70, defense: 70 }, suitability: [{ workType: 'Kindling', level: 1 }], drops: [{ item: 'Leather', quantity: 1 }, { item: 'Flame Organ', quantity: 1 }] },
  { id: '006', name: 'Fuack', types: ['Water'], stats: { hp: 60, attack: 80, defense: 60 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Watering', level: 1 }], drops: [{ item: 'Pal Fluids', quantity: 1 }] },
  { id: '007', name: 'Sparkit', types: ['Electric'], stats: { hp: 60, attack: 60, defense: 70 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Generating Electricity', level: 1 }], drops: [{ item: 'Electric Organ', quantity: 1 }] },
  { id: '008', name: 'Tanzee', types: ['Grass'], stats: { hp: 80, attack: 100, defense: 70 }, suitability: [{ workType: 'Planting', level: 1 }, { workType: 'Handiwork', level: 1 }, { workType: 'Lumbering', level: 1 }], drops: [{ item: 'Mushroom', quantity: 1 }] },
  { id: '009', name: 'Rooby', types: ['Fire'], stats: { hp: 75, attack: 100, defense: 75 }, suitability: [{ workType: 'Kindling', level: 1 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '010', name: 'Pengullet', types: ['Water', 'Ice'], stats: { hp: 70, attack: 70, defense: 70 }, suitability: [{ workType: 'Watering', level: 1 }, { workType: 'Cooling', level: 1 }], drops: [{ item: 'Ice Organ', quantity: 1 }] },
  { id: '011', name: 'Penking', types: ['Water', 'Ice'], stats: { hp: 95, attack: 70, defense: 95 }, suitability: [{ workType: 'Watering', level: 2 }, { workType: 'Mining', level: 2 }, { workType: 'Cooling', level: 2 }], drops: [{ item: 'Ice Organ', quantity: 1 }] },
  { id: '012', name: 'Jolthog', types: ['Electric'], stats: { hp: 70, attack: 70, defense: 70 }, suitability: [{ workType: 'Generating Electricity', level: 1 }], drops: [{ item: 'Electric Organ', quantity: 1 }] },
  { id: '013', name: 'Gumoss', types: ['Grass', 'Ground'], stats: { hp: 70, attack: 100, defense: 70 }, suitability: [{ workType: 'Planting', level: 1 }], drops: [{ item: 'Berry Seeds', quantity: 1 }] },
  { id: '014', name: 'Vixy', types: ['Neutral'], stats: { hp: 70, attack: 70, defense: 70 }, suitability: [{ workType: 'Gathering', level: 1 }, { workType: 'Farming', level: 1 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '015', name: 'Hoocrates', types: ['Dark'], stats: { hp: 70, attack: 70, defense: 80 }, suitability: [{ workType: 'Gathering', level: 1 }], drops: [{ item: 'Fiber', quantity: 1 }] },
  { id: '016', name: 'Teafant', types: ['Water'], stats: { hp: 70, attack: 70, defense: 70 }, suitability: [{ workType: 'Watering', level: 1 }], drops: [{ item: 'Pal Fluids', quantity: 1 }] },
  { id: '017', name: 'Depresso', types: ['Dark'], stats: { hp: 70, attack: 70, defense: 70 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Mining', level: 1 }], drops: [{ item: 'Venom Gland', quantity: 1 }] },
  { id: '018', name: 'Cremis', types: ['Neutral'], stats: { hp: 70, attack: 100, defense: 75 }, suitability: [{ workType: 'Gathering', level: 1 }, { workType: 'Farming', level: 1 }], drops: [{ item: 'Wool', quantity: 1 }] },
  { id: '019', name: 'Daedream', types: ['Dark'], stats: { hp: 70, attack: 100, defense: 60 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Gathering', level: 1 }], drops: [{ item: 'Venom Gland', quantity: 1 }] },
  { id: '020', name: 'Rushoar', types: ['Ground'], stats: { hp: 80, attack: 100, defense: 70 }, suitability: [{ workType: 'Mining', level: 1 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '021', name: 'Nox', types: ['Dark'], stats: { hp: 75, attack: 70, defense: 70 }, suitability: [{ workType: 'Gathering', level: 1 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '022', name: 'Fuddler', types: ['Ground'], stats: { hp: 65, attack: 100, defense: 50 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Mining', level: 1 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '023', name: 'Killamari', types: ['Dark'], stats: { hp: 60, attack: 100, defense: 70 }, suitability: [{ workType: 'Transporting', level: 2 }, { workType: 'Gathering', level: 1 }], drops: [{ item: 'Venom Gland', quantity: 1 }] },
  { id: '024', name: 'Mau', types: ['Dark'], stats: { hp: 70, attack: 70, defense: 70 }, suitability: [{ workType: 'Farming', level: 1 }], drops: [{ item: 'Gold Coin', quantity: 1 }] },
  { id: '025', name: 'Celaray', types: ['Water'], stats: { hp: 80, attack: 100, defense: 80 }, suitability: [{ workType: 'Transporting', level: 1 }, { workType: 'Watering', level: 1 }], drops: [{ item: 'Pal Fluids', quantity: 1 }] },
  { id: '026', name: 'Direhowl', types: ['Neutral'], stats: { hp: 80, attack: 90, defense: 80 }, suitability: [{ workType: 'Gathering', level: 1 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '027', name: 'Tocotoco', types: ['Neutral'], stats: { hp: 60, attack: 75, defense: 60 }, suitability: [{ workType: 'Gathering', level: 1 }], drops: [{ item: 'Gunpowder', quantity: 1 }] },
  { id: '028', name: 'Flopie', types: ['Grass'], stats: { hp: 75, attack: 80, defense: 70 }, suitability: [{ workType: 'Planting', level: 1 }, { workType: 'Handiwork', level: 1 }, { workType: 'Medicine Production', level: 1 }], drops: [{ item: 'Wheat Seeds', quantity: 1 }] },
  { id: '029', name: 'Mozzarina', types: ['Neutral'], stats: { hp: 90, attack: 80, defense: 90 }, suitability: [{ workType: 'Farming', level: 1 }], drops: [{ item: 'Milk', quantity: 1 }] },
  { id: '030', name: 'Bristla', types: ['Grass'], stats: { hp: 80, attack: 80, defense: 80 }, suitability: [{ workType: 'Planting', level: 1 }, { workType: 'Medicine Production', level: 2 }], drops: [{ item: 'Wheat Seeds', quantity: 1 }] },
  { id: '031', name: 'Gobfin', types: ['Water'], stats: { hp: 80, attack: 90, defense: 75 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Watering', level: 2 }], drops: [{ item: 'Pal Fluids', quantity: 1 }] },
  { id: '032', name: 'Hangyu', types: ['Ground'], stats: { hp: 70, attack: 80, defense: 70 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Transporting', level: 2 }], drops: [{ item: 'Fiber', quantity: 1 }] },
  { id: '033', name: 'Mossanda', types: ['Grass'], stats: { hp: 100, attack: 100, defense: 90 }, suitability: [{ workType: 'Planting', level: 2 }, { workType: 'Handiwork', level: 2 }, { workType: 'Lumbering', level: 2 }], drops: [{ item: 'Mushroom', quantity: 1 }] },
  { id: '034', name: 'Woolipop', types: ['Neutral'], stats: { hp: 70, attack: 65, defense: 70 }, suitability: [{ workType: 'Farming', level: 1 }], drops: [{ item: 'Cotton Candy', quantity: 1 }] },
  { id: '035', name: 'Caprity', types: ['Grass'], stats: { hp: 80, attack: 70, defense: 85 }, suitability: [{ workType: 'Planting', level: 2 }, { workType: 'Farming', level: 1 }], drops: [{ item: 'Red Berries', quantity: 1 }] },
  { id: '036', name: 'Melpaca', types: ['Neutral'], stats: { hp: 90, attack: 75, defense: 90 }, suitability: [{ workType: 'Farming', level: 1 }], drops: [{ item: 'Wool', quantity: 1 }] },
  { id: '037', name: 'Eikthyrdeer', types: ['Neutral'], stats: { hp: 95, attack: 80, defense: 90 }, suitability: [{ workType: 'Lumbering', level: 2 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '038', name: 'Nitewing', types: ['Neutral'], stats: { hp: 100, attack: 80, defense: 85 }, suitability: [{ workType: 'Gathering', level: 2 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '039', name: 'Ribbuny', types: ['Neutral'], stats: { hp: 75, attack: 65, defense: 70 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Gathering', level: 1 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '040', name: 'Incineram', types: ['Fire', 'Dark'], stats: { hp: 95, attack: 105, defense: 85 }, suitability: [{ workType: 'Kindling', level: 1 }, { workType: 'Handiwork', level: 2 }, { workType: 'Mining', level: 1 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '041', name: 'Cinnamoth', types: ['Grass'], stats: { hp: 70, attack: 80, defense: 70 }, suitability: [{ workType: 'Planting', level: 2 }, { workType: 'Medicine Production', level: 1 }], drops: [{ item: 'Honey', quantity: 1 }] },
  { id: '042', name: 'Arsox', types: ['Fire'], stats: { hp: 85, attack: 95, defense: 80 }, suitability: [{ workType: 'Kindling', level: 2 }, { workType: 'Lumbering', level: 1 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '043', name: 'Dumud', types: ['Ground'], stats: { hp: 95, attack: 80, defense: 95 }, suitability: [{ workType: 'Watering', level: 1 }, { workType: 'Mining', level: 2 }], drops: [{ item: 'High Quality Pal Oil', quantity: 1 }] },
  { id: '044', name: 'Cawgnito', types: ['Dark'], stats: { hp: 70, attack: 95, defense: 75 }, suitability: [{ workType: 'Lumbering', level: 1 }], drops: [{ item: 'Bone', quantity: 1 }] },
  { id: '045', name: 'Leezpunk', types: ['Dark'], stats: { hp: 80, attack: 90, defense: 70 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Gathering', level: 1 }], drops: [{ item: 'Bone', quantity: 1 }] },
  { id: '046', name: 'Loupmoon', types: ['Dark'], stats: { hp: 80, attack: 105, defense: 80 }, suitability: [{ workType: 'Handiwork', level: 2 }], drops: [{ item: 'Bone', quantity: 1 }] },
  { id: '047', name: 'Galeclaw', types: ['Neutral'], stats: { hp: 75, attack: 90, defense: 70 }, suitability: [{ workType: 'Gathering', level: 2 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '048', name: 'Robinquill', types: ['Grass'], stats: { hp: 80, attack: 95, defense: 80 }, suitability: [{ workType: 'Planting', level: 1 }, { workType: 'Handiwork', level: 2 }, { workType: 'Lumbering', level: 1 }], drops: [{ item: 'Arrow', quantity: 1 }] },
  { id: '049', name: 'Gorirat', types: ['Neutral'], stats: { hp: 90, attack: 100, defense: 80 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Lumbering', level: 2 }, { workType: 'Transporting', level: 3 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '050', name: 'Beegarde', types: ['Grass'], stats: { hp: 80, attack: 90, defense: 80 }, suitability: [{ workType: 'Planting', level: 1 }, { workType: 'Handiwork', level: 1 }, { workType: 'Gathering', level: 1 }, { workType: 'Medicine Production', level: 1 }, { workType: 'Farming', level: 1 }], drops: [{ item: 'Honey', quantity: 1 }] },
  { id: '051', name: 'Elizabee', types: ['Grass'], stats: { hp: 100, attack: 100, defense: 90 }, suitability: [{ workType: 'Planting', level: 2 }, { workType: 'Handiwork', level: 2 }, { workType: 'Medicine Production', level: 2 }], drops: [{ item: 'Honey', quantity: 1 }] },
  { id: '052', name: 'Grintale', types: ['Neutral'], stats: { hp: 100, attack: 100, defense: 100 }, suitability: [{ workType: 'Gathering', level: 2 }], drops: [{ item: 'High Quality Pal Oil', quantity: 1 }] },
  { id: '053', name: 'Swee', types: ['Ice'], stats: { hp: 60, attack: 60, defense: 70 }, suitability: [{ workType: 'Gathering', level: 1 }, { workType: 'Cooling', level: 1 }], drops: [{ item: 'Wool', quantity: 1 }] },
  { id: '054', name: 'Sweepa', types: ['Ice'], stats: { hp: 100, attack: 100, defense: 100 }, suitability: [{ workType: 'Gathering', level: 2 }, { workType: 'Cooling', level: 2 }], drops: [{ item: 'Wool', quantity: 1 }] },
  { id: '055', name: 'Chillet', types: ['Ice', 'Dragon'], stats: { hp: 90, attack: 90, defense: 90 }, suitability: [{ workType: 'Gathering', level: 1 }, { workType: 'Cooling', level: 1 }], drops: [{ item: 'Ice Organ', quantity: 1 }] },
  { id: '056', name: 'Univolt', types: ['Electric'], stats: { hp: 80, attack: 100, defense: 80 }, suitability: [{ workType: 'Generating Electricity', level: 2 }, { workType: 'Lumbering', level: 1 }], drops: [{ item: 'Electric Organ', quantity: 1 }] },
  { id: '057', name: 'Foxcicle', types: ['Ice'], stats: { hp: 90, attack: 95, defense: 90 }, suitability: [{ workType: 'Cooling', level: 2 }], drops: [{ item: 'Ice Organ', quantity: 1 }] },
  { id: '058', name: 'Pyrin', types: ['Fire'], stats: { hp: 100, attack: 100, defense: 90 }, suitability: [{ workType: 'Kindling', level: 2 }, { workType: 'Lumbering', level: 1 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '059', name: 'Reindrix', types: ['Ice'], stats: { hp: 100, attack: 80, defense: 100 }, suitability: [{ workType: 'Lumbering', level: 2 }, { workType: 'Cooling', level: 2 }], drops: [{ item: 'Ice Organ', quantity: 1 }, { item: 'Leather', quantity: 1 }] },
  { id: '060', name: 'Rayhound', types: ['Electric'], stats: { hp: 85, attack: 100, defense: 80 }, suitability: [{ workType: 'Generating Electricity', level: 2 }], drops: [{ item: 'Electric Organ', quantity: 1 }] },
  { id: '061', name: 'Kitsun', types: ['Fire'], stats: { hp: 100, attack: 95, defense: 100 }, suitability: [{ workType: 'Kindling', level: 2 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '062', name: 'Dazzi', types: ['Electric'], stats: { hp: 70, attack: 80, defense: 70 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Generating Electricity', level: 1 }], drops: [{ item: 'Electric Organ', quantity: 1 }] },
  { id: '063', name: 'Lunaris', types: ['Neutral'], stats: { hp: 90, attack: 85, defense: 90 }, suitability: [{ workType: 'Gathering', level: 1 }, { workType: 'Transporting', level: 1 }], drops: [{ item: 'Paldium Fragment', quantity: 1 }] },
  { id: '064', name: 'Dinossom', types: ['Grass', 'Dragon'], stats: { hp: 110, attack: 80, defense: 100 }, suitability: [{ workType: 'Planting', level: 2 }, { workType: 'Lumbering', level: 2 }], drops: [{ item: 'Wheat Seeds', quantity: 1 }] },
  { id: '065', name: 'Surfent', types: ['Water'], stats: { hp: 90, attack: 90, defense: 80 }, suitability: [{ workType: 'Watering', level: 1 }], drops: [{ item: 'Pal Fluids', quantity: 1 }] },
  { id: '066', name: 'Maraith', types: ['Dark'], stats: { hp: 75, attack: 105, defense: 75 }, suitability: [{ workType: 'Gathering', level: 2 }, { workType: 'Mining', level: 1 }], drops: [{ item: 'Bone', quantity: 1 }] },
  { id: '067', name: 'Digtoise', types: ['Ground'], stats: { hp: 80, attack: 80, defense: 120 }, suitability: [{ workType: 'Mining', level: 3 }], drops: [{ item: 'Ore', quantity: 1 }] },
  { id: '068', name: 'Tombat', types: ['Dark'], stats: { hp: 90, attack: 100, defense: 80 }, suitability: [{ workType: 'Gathering', level: 2 }, { workType: 'Mining', level: 2 }], drops: [{ item: 'Small Pal Soul', quantity: 1 }] },
  { id: '069', name: 'Lovander', types: ['Neutral'], stats: { hp: 120, attack: 70, defense: 70 }, suitability: [{ workType: 'Handiwork', level: 2 }, { workType: 'Medicine Production', level: 2 }], drops: [{ item: 'Suspicious Juice', quantity: 1 }] },
  { id: '070', name: 'Flambelle', types: ['Fire'], stats: { hp: 60, attack: 70, defense: 60 }, suitability: [{ workType: 'Kindling', level: 1 }, { workType: 'Handiwork', level: 1 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '071', name: 'Vanwyrm', types: ['Fire', 'Dark'], stats: { hp: 90, attack: 115, defense: 80 }, suitability: [{ workType: 'Kindling', level: 1 }, { workType: 'Transporting', level: 3 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '072', name: 'Bushi', types: ['Fire'], stats: { hp: 80, attack: 120, defense: 80 }, suitability: [{ workType: 'Kindling', level: 2 }, { workType: 'Handiwork', level: 1 }], drops: [{ item: 'Bone', quantity: 1 }] },
  { id: '073', name: 'Beakon', types: ['Electric'], stats: { hp: 105, attack: 115, defense: 80 }, suitability: [{ workType: 'Gathering', level: 1 }, { workType: 'Generating Electricity', level: 2 }], drops: [{ item: 'Electric Organ', quantity: 1 }] },
  { id: '074', name: 'Ragnahawk', types: ['Fire'], stats: { hp: 95, attack: 105, defense: 90 }, suitability: [{ workType: 'Kindling', level: 3 }, { workType: 'Transporting', level: 3 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '075', name: 'Katress', types: ['Dark'], stats: { hp: 90, attack: 105, defense: 90 }, suitability: [{ workType: 'Handiwork', level: 2 }, { workType: 'Medicine Production', level: 2 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '076', name: 'Wixen', types: ['Fire'], stats: { hp: 80, attack: 100, defense: 75 }, suitability: [{ workType: 'Kindling', level: 2 }, { workType: 'Handiwork', level: 3 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '077', name: 'Verdash', types: ['Grass'], stats: { hp: 90, attack: 105, defense: 80 }, suitability: [{ workType: 'Planting', level: 2 }, { workType: 'Handiwork', level: 3 }, { workType: 'Gathering', level: 3 }, { workType: 'Lumbering', level: 2 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '078', name: 'Vaelet', types: ['Grass'], stats: { hp: 100, attack: 100, defense: 100 }, suitability: [{ workType: 'Planting', level: 2 }, { workType: 'Handiwork', level: 2 }, { workType: 'Medicine Production', level: 3 }, { workType: 'Gathering', level: 2 }], drops: [{ item: 'Tomato Seeds', quantity: 1 }] },
  { id: '079', name: 'Sibelyx', types: ['Ice'], stats: { hp: 110, attack: 80, defense: 110 }, suitability: [{ workType: 'Medicine Production', level: 2 }, { workType: 'Cooling', level: 2 }, { workType: 'Farming', level: 1 }], drops: [{ item: 'High Quality Cloth', quantity: 1 }] },
  { id: '080', name: 'Elphidran', types: ['Dragon'], stats: { hp: 110, attack: 80, defense: 90 }, suitability: [{ workType: 'Lumbering', level: 2 }], drops: [{ item: 'High Quality Pal Oil', quantity: 1 }] },
  { id: '081', name: 'Kelpsea', types: ['Water'], stats: { hp: 70, attack: 70, defense: 70 }, suitability: [{ workType: 'Watering', level: 1 }], drops: [{ item: 'Pal Fluids', quantity: 1 }] },
  { id: '082', name: 'Azurobe', types: ['Water', 'Dragon'], stats: { hp: 110, attack: 100, defense: 100 }, suitability: [{ workType: 'Watering', level: 3 }], drops: [{ item: 'Pal Fluids', quantity: 1 }] },
  { id: '083', name: 'Cryolinx', types: ['Ice'], stats: { hp: 100, attack: 140, defense: 110 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Lumbering', level: 2 }, { workType: 'Cooling', level: 3 }], drops: [{ item: 'Ice Organ', quantity: 1 }] },
  { id: '084', name: 'Blazehowl', types: ['Fire'], stats: { hp: 105, attack: 110, defense: 100 }, suitability: [{ workType: 'Kindling', level: 3 }, { workType: 'Lumbering', level: 2 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '085', name: 'Relaxaurus', types: ['Dragon', 'Water'], stats: { hp: 110, attack: 110, defense: 110 }, suitability: [{ workType: 'Watering', level: 2 }, { workType: 'Transporting', level: 1 }], drops: [{ item: 'High Quality Pal Oil', quantity: 1 }] },
  { id: '086', name: 'Broncherry', types: ['Grass'], stats: { hp: 120, attack: 80, defense: 100 }, suitability: [{ workType: 'Planting', level: 3 }], drops: [{ item: 'Broncherry Meat', quantity: 1 }] },
  { id: '087', name: 'Petallia', types: ['Grass'], stats: { hp: 100, attack: 90, defense: 100 }, suitability: [{ workType: 'Planting', level: 3 }, { workType: 'Handiwork', level: 2 }, { workType: 'Medicine Production', level: 2 }, { workType: 'Gathering', level: 2 }], drops: [{ item: 'Beautiful Flower', quantity: 1 }] },
  { id: '088', name: 'Reptyro', types: ['Fire', 'Ground'], stats: { hp: 110, attack: 105, defense: 120 }, suitability: [{ workType: 'Kindling', level: 3 }, { workType: 'Mining', level: 3 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '089', name: 'Kingpaca', types: ['Neutral'], stats: { hp: 120, attack: 85, defense: 90 }, suitability: [{ workType: 'Gathering', level: 1 }], drops: [{ item: 'Wool', quantity: 1 }] },
  { id: '090', name: 'Mammorest', types: ['Grass'], stats: { hp: 150, attack: 85, defense: 100 }, suitability: [{ workType: 'Planting', level: 2 }, { workType: 'Lumbering', level: 2 }, { workType: 'Mining', level: 2 }], drops: [{ item: 'High Quality Pal Oil', quantity: 1 }] },
  { id: '091', name: 'Wumpo', types: ['Ice'], stats: { hp: 140, attack: 80, defense: 100 }, suitability: [{ workType: 'Handiwork', level: 2 }, { workType: 'Lumbering', level: 3 }, { workType: 'Cooling', level: 2 }], drops: [{ item: 'Ice Organ', quantity: 1 }] },
  { id: '092', name: 'Warsect', types: ['Grass', 'Ground'], stats: { hp: 120, attack: 110, defense: 120 }, suitability: [{ workType: 'Planting', level: 1 }, { workType: 'Handiwork', level: 1 }, { workType: 'Lumbering', level: 3 }], drops: [{ item: 'Honey', quantity: 1 }] },
  { id: '093', name: 'Fenglope', types: ['Neutral'], stats: { hp: 110, attack: 100, defense: 100 }, suitability: [{ workType: 'Lumbering', level: 2 }], drops: [{ item: 'Leather', quantity: 1 }] },
  { id: '094', name: 'Felbat', types: ['Dark'], stats: { hp: 100, attack: 105, defense: 95 }, suitability: [{ workType: 'Medicine Production', level: 3 }], drops: [{ item: 'Small Pal Soul', quantity: 1 }] },
  { id: '095', name: 'Quivern', types: ['Dragon'], stats: { hp: 105, attack: 100, defense: 105 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Mining', level: 2 }, { workType: 'Transporting', level: 3 }], drops: [{ item: 'High Quality Pal Oil', quantity: 1 }] },
  { id: '096', name: 'Blazamut', types: ['Fire'], stats: { hp: 100, attack: 150, defense: 120 }, suitability: [{ workType: 'Kindling', level: 3 }, { workType: 'Mining', level: 4 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '097', name: 'Helzephyr', types: ['Dark'], stats: { hp: 100, attack: 125, defense: 100 }, suitability: [{ workType: 'Transporting', level: 3 }], drops: [{ item: 'Pal Metal Ingot', quantity: 1 }] },
  { id: '098', name: 'Astegon', types: ['Dark', 'Dragon'], stats: { hp: 100, attack: 150, defense: 120 }, suitability: [{ workType: 'Handiwork', level: 1 }, { workType: 'Mining', level: 4 }], drops: [{ item: 'Pal Metal Ingot', quantity: 1 }] },
  { id: '099', name: 'Menasting', types: ['Dark', 'Ground'], stats: { hp: 100, attack: 125, defense: 125 }, suitability: [{ workType: 'Lumbering', level: 2 }, { workType: 'Mining', level: 3 }], drops: [{ item: 'Pal Metal Ingot', quantity: 1 }] },
  { id: '100', name: 'Anubis', types: ['Ground'], stats: { hp: 120, attack: 130, defense: 100 }, suitability: [{ workType: 'Handiwork', level: 4 }, { workType: 'Mining', level: 3 }, { workType: 'Transporting', level: 2 }], drops: [{ item: 'Bone', quantity: 1 }] },
  { id: '101', name: 'Jormuntide', types: ['Dragon', 'Water'], stats: { hp: 130, attack: 150, defense: 100 }, suitability: [{ workType: 'Watering', level: 4 }], drops: [{ item: 'Pal Fluids', quantity: 1 }] },
  { id: '102', name: 'Suzaku', types: ['Fire'], stats: { hp: 120, attack: 135, defense: 100 }, suitability: [{ workType: 'Kindling', level: 3 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '103', name: 'Grizzbolt', types: ['Electric'], stats: { hp: 105, attack: 120, defense: 100 }, suitability: [{ workType: 'Handiwork', level: 2 }, { workType: 'Generating Electricity', level: 3 }, { workType: 'Transporting', level: 3 }], drops: [{ item: 'Electric Organ', quantity: 1 }] },
  { id: '104', name: 'Lyleen', types: ['Grass'], stats: { hp: 110, attack: 100, defense: 105 }, suitability: [{ workType: 'Planting', level: 4 }, { workType: 'Handiwork', level: 3 }, { workType: 'Medicine Production', level: 3 }, { workType: 'Gathering', level: 2 }], drops: [{ item: 'Beautiful Flower', quantity: 1 }] },
  { id: '105', name: 'Faleris', types: ['Fire'], stats: { hp: 100, attack: 130, defense: 100 }, suitability: [{ workType: 'Kindling', level: 3 }, { workType: 'Transporting', level: 3 }], drops: [{ item: 'Flame Organ', quantity: 1 }] },
  { id: '106', name: 'Orserk', types: ['Dragon', 'Electric'], stats: { hp: 100, attack: 140, defense: 100 }, suitability: [{ workType: 'Handiwork', level: 2 }, { workType: 'Generating Electricity', level: 4 }], drops: [{ item: 'Electric Organ', quantity: 1 }] },
  { id: '107', name: 'Shadowbeak', types: ['Dark'], stats: { hp: 120, attack: 145, defense: 100 }, suitability: [{ workType: 'Gathering', level: 1 }], drops: [{ item: 'Pal Metal Ingot', quantity: 1 }] },
  { id: '108', name: 'Paladius', types: ['Neutral'], stats: { hp: 130, attack: 100, defense: 145 }, suitability: [{ workType: 'Lumbering', level: 2 }, { workType: 'Mining', level: 2 }], drops: [{ item: 'Pal Metal Ingot', quantity: 1 }] },
  { id: '109', name: 'Necromus', types: ['Dark'], stats: { hp: 130, attack: 145, defense: 100 }, suitability: [{ workType: 'Lumbering', level: 2 }, { workType: 'Mining', level: 2 }], drops: [{ item: 'Pal Metal Ingot', quantity: 1 }] },
  { id: '110', name: 'Frostallion', types: ['Ice'], stats: { hp: 140, attack: 100, defense: 140 }, suitability: [{ workType: 'Cooling', level: 4 }], drops: [{ item: 'Ice Organ', quantity: 1 }] },
  { id: '111', name: 'Jetragon', types: ['Dragon'], stats: { hp: 110, attack: 160, defense: 100 }, suitability: [{ workType: 'Gathering', level: 3 }], drops: [{ item: 'Pal Metal Ingot', quantity: 1 }, { item: 'Diamond', quantity: 1 }] },
]

const ALL_PALS = REAL_PALS

function generatePals(): Pal[] {
  return ALL_PALS.map((pal) => ({
    ...pal,
    imageUrl: getPalImageUrl(pal.id),
  }))
}

export const mockPals: Pal[] = generatePals()

export function getMockPalById(id: string): Pal | undefined {
  return mockPals.find((pal) => pal.id === id)
}

export function filterMockPals(params: {
  search?: string
  types?: string[]
  minAttack?: number
  maxAttack?: number
}): Pal[] {
  let filtered = [...mockPals]

  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filtered = filtered.filter((pal) =>
      pal.name.toLowerCase().includes(searchLower)
    )
  }

  if (params.types && params.types.length > 0) {
    filtered = filtered.filter((pal) =>
      pal.types.some((type) => params.types!.includes(type))
    )
  }

  if (params.minAttack !== undefined) {
    filtered = filtered.filter((pal) => pal.stats.attack >= params.minAttack!)
  }

  if (params.maxAttack !== undefined) {
    filtered = filtered.filter((pal) => pal.stats.attack <= params.maxAttack!)
  }

  return filtered
}
