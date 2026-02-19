// Ascension milestone reward table (Section 8)
// No-reset ascension: costs gold, grants permanent stat bonus + dungeon cap increase
// Power budget: ~3x total power at ascension 10 with full investment

export const ASCENSION_MILESTONES = {
  1: {
    level: 1,
    statBonus: 0.10,
    label: '+10% all stats',
    unlock: {
      id: 'void_throne_access',
      name: 'Void Throne Access',
      description: 'The Void Throne raid becomes available',
    },
    dungeonCap: 35,
  },
  2: {
    level: 2,
    statBonus: 0.20,
    label: '+20% all stats',
    unlock: null,
    dungeonCap: 40,
  },
  3: {
    level: 3,
    statBonus: 0.30,
    label: '+30% all stats',
    unlock: null,
    dungeonCap: 45,
  },
  5: {
    level: 5,
    statBonus: 0.50,
    label: '+50% all stats',
    unlock: null,
    dungeonCap: 50,
  },
  10: {
    level: 10,
    statBonus: 1.00,
    label: '+100% all stats',
    unlock: null,
    dungeonCap: 60,
  },
};

// Intermediate ascension levels (4, 6, 7, 8, 9) get stat bonuses only
// Stat bonus scales linearly: +10% per ascension level
const STAT_BONUS_PER_LEVEL = 0.10;

// Get the stat multiplier for a given ascension count
// Returns the multiplier to apply: 1 + (count * 0.10)
export const getAscensionStatMultiplier = (ascensionCount) => {
  return 1 + (ascensionCount * STAT_BONUS_PER_LEVEL);
};

// Get the dungeon level cap for a given ascension count
export const getAscensionDungeonCap = (ascensionCount) => {
  // Find the highest milestone at or below the count
  const milestoneKeys = Object.keys(ASCENSION_MILESTONES)
    .map(Number)
    .sort((a, b) => b - a);

  for (const key of milestoneKeys) {
    if (ascensionCount >= key) {
      return ASCENSION_MILESTONES[key].dungeonCap;
    }
  }
  return 30; // Base cap before any ascension
};

// Get all unlocks earned up to a given ascension count
export const getAscensionUnlocks = (ascensionCount) => {
  const unlocks = [];
  for (const [level, milestone] of Object.entries(ASCENSION_MILESTONES)) {
    if (ascensionCount >= Number(level)) {
      if (milestone.unlock) unlocks.push(milestone.unlock);
    }
  }
  return unlocks;
};

// Check if a specific unlock is earned
export const hasAscensionUnlock = (ascensionCount, unlockId) => {
  return getAscensionUnlocks(ascensionCount).some(u => u.id === unlockId);
};

// Get the next milestone for display purposes
export const getNextMilestone = (ascensionCount) => {
  const milestoneKeys = Object.keys(ASCENSION_MILESTONES)
    .map(Number)
    .sort((a, b) => a - b);

  for (const key of milestoneKeys) {
    if (ascensionCount < key) {
      return { level: key, ...ASCENSION_MILESTONES[key] };
    }
  }
  return null; // All milestones reached
};

// Gold cost to ascend: 50,000 × ascension level (scaling)
export const getAscensionGoldCost = (nextAscensionLevel) => {
  return 50000 * nextAscensionLevel;
};

// Cost scaling for gold sinks with ascension
export const getAscensionCostMultiplier = (ascensionCount) => {
  return 1 + (ascensionCount * 0.5);
};
