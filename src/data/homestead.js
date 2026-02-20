// Homestead buildings and their upgrade effects

export const BUILDINGS = {
  barracks: {
    id: 'barracks',
    name: 'Barracks',
    description: 'Trains and houses more warriors',
    maxLevel: 10,
    effect: { type: 'attack', valuePerLevel: 0.05 }, // +5% ATK per level
    baseCost: 500,
    costMultiplier: 2.2,
    unlocks: {
      3: { type: 'partySlot', slot: 5, label: '5th party slot' },
      7: { type: 'partySlot', slot: 6, label: '6th party slot' },
      10: { type: 'partySlot', slot: 7, label: '7th party slot' },
    },
  },
  armory: {
    id: 'armory',
    name: 'Armory',
    description: 'Improves gear knowledge and management',
    maxLevel: 10,
    effect: { type: 'defense', valuePerLevel: 0.05 }, // +5% DEF per level
    baseCost: 500,
    costMultiplier: 2.2,
    unlocks: {
      3: { type: 'feature', key: 'equipComparison', label: 'Equipment comparison tooltips' },
      7: { type: 'feature', key: 'autoEquip', label: 'Auto-equip feature' },
    },
  },
  fortress: {
    id: 'fortress',
    name: 'Fortress',
    description: 'Reinforces defenses and unlocks harder challenges',
    maxLevel: 10,
    effect: { type: 'hp', valuePerLevel: 0.05 }, // +5% HP per level
    baseCost: 500,
    costMultiplier: 2.2,
    unlocks: {
      3: { type: 'difficultyMax', value: 1.5, label: 'Hard difficulty (1.5x)' },
      5: { type: 'difficultyMax', value: 2.0, label: 'Brutal difficulty (2.0x)' },
      7: { type: 'difficultyMax', value: 2.5, label: 'Nightmare difficulty (2.5x)' },
      10: { type: 'difficultyMax', value: 3.0, label: 'Infernal difficulty (3.0x)' },
    },
  },
  infirmary: {
    id: 'infirmary',
    name: 'Infirmary',
    description: 'Heals heroes between rooms',
    maxLevel: 7,
    effect: { type: 'healBetweenRooms', valuePerLevel: 0.002 }, // +0.2% between-room heal per level
    baseCost: 800,
    costMultiplier: 2.2,
    unlocks: {
      3: { type: 'feature', key: 'consumables', label: 'Consumable slots' },
      7: { type: 'feature', key: 'betterConsumables', label: 'Advanced consumables' },
    },
  },
  treasury: {
    id: 'treasury',
    name: 'Treasury',
    description: 'Increases gold earnings and unlocks commerce',
    maxLevel: 10,
    effect: { type: 'goldFind', valuePerLevel: 0.05 }, // +5% gold find per level
    baseCost: 500,
    costMultiplier: 2.2,
    unlocks: {
      3: { type: 'feature', key: 'shop', label: 'Shop unlocks' },
      7: { type: 'feature', key: 'shopFastRefresh', label: 'Shop auto-refresh rate halved' },
    },
  },
  trainingGrounds: {
    id: 'trainingGrounds',
    name: 'Training Grounds',
    description: 'Accelerates hero growth',
    maxLevel: 10,
    effect: { type: 'xpGain', valuePerLevel: 0.10 }, // +10% XP per level
    baseCost: 600,
    costMultiplier: 2.2,
    unlocks: {
      3: { type: 'feature', key: 'skillRespec', label: 'Skill respec available' },
      7: { type: 'feature', key: 'dungeonXpBonus', label: '+50% XP from higher dungeons' },
    },
  },
  library: {
    id: 'library',
    name: 'Library',
    description: 'Reveals knowledge about enemies and dungeons',
    maxLevel: 7,
    effect: { type: 'bestiaryDepth', valuePerLevel: 1 }, // More bestiary info per level
    baseCost: 400,
    costMultiplier: 2.2,
    unlocks: {
      3: { type: 'feature', key: 'bestiary', label: 'Bestiary unlocks' },
      7: { type: 'feature', key: 'dungeonPreview', label: 'Dungeon preview (show monster types)' },
    },
  },
};

// Calculate upgrade cost for a building at a given level
export const getUpgradeCost = (building, currentLevel) => {
  return Math.floor(building.baseCost * Math.pow(building.costMultiplier, currentLevel));
};

// Calculate total bonus from a building at a given level
export const getBuildingBonus = (building, level) => {
  return building.effect.valuePerLevel * level;
};

// Get the next unlock for a building at its current level
export const getNextUnlock = (building, currentLevel) => {
  if (!building.unlocks) return null;
  const unlockLevels = Object.keys(building.unlocks).map(Number).sort((a, b) => a - b);
  const next = unlockLevels.find(level => level > currentLevel);
  return next ? { level: next, ...building.unlocks[next] } : null;
};

// Get all unlocks achieved at or below a given level
export const getUnlocksAtLevel = (building, level) => {
  if (!building.unlocks) return [];
  return Object.entries(building.unlocks)
    .filter(([lvl]) => Number(lvl) <= level)
    .map(([lvl, data]) => ({ level: Number(lvl), ...data }));
};

// Check if a specific homestead feature is unlocked
export const isHomesteadFeatureUnlocked = (buildingLevels, buildingId, featureLevel) => {
  return (buildingLevels[buildingId] || 0) >= featureLevel;
};

// Get all homestead bonuses from current levels
export const calculateHomesteadBonuses = (buildingLevels) => {
  const bonuses = {
    hp: 0,
    attack: 0,
    defense: 0,
    xpGain: 0,
    goldFind: 0,
    healBetweenRooms: 0,
    bestiaryDepth: 0,
  };

  for (const [buildingId, level] of Object.entries(buildingLevels)) {
    const building = BUILDINGS[buildingId];
    if (building && level > 0) {
      const effectType = building.effect.type;
      if (effectType in bonuses) {
        bonuses[effectType] += getBuildingBonus(building, level);
      }
    }
  }

  return bonuses;
};

// Get building list in display order
export const getBuildingList = () => [
  BUILDINGS.barracks,
  BUILDINGS.armory,
  BUILDINGS.fortress,
  BUILDINGS.infirmary,
  BUILDINGS.treasury,
  BUILDINGS.trainingGrounds,
  BUILDINGS.library,
];
