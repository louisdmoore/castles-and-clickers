// Achievement definitions — conditions and rewards
// Tracked via lifetime stats and game state
// Categories: combat, progression, collection, challenge, economy

export const ACHIEVEMENT_CATEGORY = {
  COMBAT: 'combat',
  PROGRESSION: 'progression',
  COLLECTION: 'collection',
  CHALLENGE: 'challenge',
  ECONOMY: 'economy',
};

export const ACHIEVEMENTS = {
  // === COMBAT ===
  first_blood: {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Defeat your first monster',
    category: ACHIEVEMENT_CATEGORY.COMBAT,
    condition: { stat: 'totalKills', threshold: 1 },
    reward: { gold: 100 },
    hidden: false,
  },
  monster_slayer: {
    id: 'monster_slayer',
    name: 'Monster Slayer',
    description: 'Defeat 100 monsters',
    category: ACHIEVEMENT_CATEGORY.COMBAT,
    condition: { stat: 'totalKills', threshold: 100 },
    reward: { gold: 500 },
    hidden: false,
  },
  exterminator: {
    id: 'exterminator',
    name: 'Exterminator',
    description: 'Defeat 1,000 monsters',
    category: ACHIEVEMENT_CATEGORY.COMBAT,
    condition: { stat: 'totalKills', threshold: 1000 },
    reward: { gold: 2000 },
    hidden: false,
  },
  genocide: {
    id: 'genocide',
    name: 'The Culling',
    description: 'Defeat 10,000 monsters',
    category: ACHIEVEMENT_CATEGORY.COMBAT,
    condition: { stat: 'totalKills', threshold: 10000 },
    reward: { gold: 10000 },
    hidden: false,
  },
  boss_hunter: {
    id: 'boss_hunter',
    name: 'Boss Hunter',
    description: 'Defeat 10 dungeon bosses',
    category: ACHIEVEMENT_CATEGORY.COMBAT,
    condition: { stat: 'bossKills', threshold: 10 },
    reward: { gold: 1000 },
    hidden: false,
  },
  world_boss_slayer: {
    id: 'world_boss_slayer',
    name: 'World Boss Slayer',
    description: 'Defeat a world boss',
    category: ACHIEVEMENT_CATEGORY.COMBAT,
    condition: { stat: 'worldBossKills', threshold: 1 },
    reward: { gold: 2000 },
    hidden: false,
  },
  flawless_run: {
    id: 'flawless_run',
    name: 'Flawless',
    description: 'Complete a dungeon without any hero falling',
    category: ACHIEVEMENT_CATEGORY.COMBAT,
    condition: { type: 'flawless_dungeon' },
    reward: { gold: 1500 },
    hidden: false,
  },
  critical_master: {
    id: 'critical_master',
    name: 'Critical Master',
    description: 'Land 500 critical hits',
    category: ACHIEVEMENT_CATEGORY.COMBAT,
    condition: { stat: 'totalCrits', threshold: 500 },
    reward: { gold: 1000 },
    hidden: false,
  },

  // === PROGRESSION ===
  dungeon_5: {
    id: 'dungeon_5',
    name: 'Getting Started',
    description: 'Clear Dungeon 5',
    category: ACHIEVEMENT_CATEGORY.PROGRESSION,
    condition: { stat: 'highestDungeon', threshold: 5 },
    reward: { gold: 200 },
    hidden: false,
  },
  dungeon_10: {
    id: 'dungeon_10',
    name: 'Into the Deep',
    description: 'Clear Dungeon 10',
    category: ACHIEVEMENT_CATEGORY.PROGRESSION,
    condition: { stat: 'highestDungeon', threshold: 10 },
    reward: { gold: 500 },
    hidden: false,
  },
  dungeon_20: {
    id: 'dungeon_20',
    name: 'Veteran Explorer',
    description: 'Clear Dungeon 20',
    category: ACHIEVEMENT_CATEGORY.PROGRESSION,
    condition: { stat: 'highestDungeon', threshold: 20 },
    reward: { gold: 2000 },
    hidden: false,
  },
  dungeon_30: {
    id: 'dungeon_30',
    name: 'Conqueror',
    description: 'Clear Dungeon 30',
    category: ACHIEVEMENT_CATEGORY.PROGRESSION,
    condition: { stat: 'highestDungeon', threshold: 30 },
    reward: { gold: 5000 },
    hidden: false,
  },
  first_ascension: {
    id: 'first_ascension',
    name: 'New Beginning',
    description: 'Complete your first ascension',
    category: ACHIEVEMENT_CATEGORY.PROGRESSION,
    condition: { stat: 'ascensionCount', threshold: 1 },
    reward: { gold: 5000 },
    hidden: false,
  },
  level_25_hero: {
    id: 'level_25_hero',
    name: 'Battle Hardened',
    description: 'Reach level 25 with any hero',
    category: ACHIEVEMENT_CATEGORY.PROGRESSION,
    condition: { stat: 'highestHeroLevel', threshold: 25 },
    reward: { gold: 1500 },
    hidden: false,
  },
  full_party: {
    id: 'full_party',
    name: 'Full House',
    description: 'Have a full party of 6 heroes',
    category: ACHIEVEMENT_CATEGORY.PROGRESSION,
    condition: { stat: 'heroCount', threshold: 6 },
    reward: { gold: 500 },
    hidden: false,
  },
  all_classes: {
    id: 'all_classes',
    name: 'Diverse Roster',
    description: 'Recruit one hero of every class',
    category: ACHIEVEMENT_CATEGORY.PROGRESSION,
    condition: { type: 'all_classes_recruited' },
    reward: { gold: 3000 },
    hidden: false,
  },

  // === COLLECTION ===
  first_unique: {
    id: 'first_unique',
    name: 'Legendary Find',
    description: 'Obtain your first unique item',
    category: ACHIEVEMENT_CATEGORY.COLLECTION,
    condition: { stat: 'uniqueItemsFound', threshold: 1 },
    reward: { gold: 1000 },
    hidden: false,
  },
  unique_collector: {
    id: 'unique_collector',
    name: 'Collector',
    description: 'Obtain 10 unique items',
    category: ACHIEVEMENT_CATEGORY.COLLECTION,
    condition: { stat: 'uniqueItemsFound', threshold: 10 },
    reward: { gold: 5000 },
    hidden: false,
  },
  full_collection: {
    id: 'full_collection',
    name: 'Completionist',
    description: 'Obtain every unique item',
    category: ACHIEVEMENT_CATEGORY.COLLECTION,
    condition: { type: 'all_uniques_collected' },
    reward: { gold: 25000 },
    hidden: true,
  },
  first_rare: {
    id: 'first_rare',
    name: 'Rare Find',
    description: 'Find a Rare quality item',
    category: ACHIEVEMENT_CATEGORY.COLLECTION,
    condition: { stat: 'rareItemsFound', threshold: 1 },
    reward: { gold: 200 },
    hidden: false,
  },
  first_epic: {
    id: 'first_epic',
    name: 'Epic Discovery',
    description: 'Find an Epic quality item',
    category: ACHIEVEMENT_CATEGORY.COLLECTION,
    condition: { stat: 'epicItemsFound', threshold: 1 },
    reward: { gold: 500 },
    hidden: false,
  },

  // === CHALLENGE ===
  speed_clear: {
    id: 'speed_clear',
    name: 'Speed Demon',
    description: 'Clear a dungeon in under 30 seconds',
    category: ACHIEVEMENT_CATEGORY.CHALLENGE,
    condition: { type: 'speed_clear', threshold: 30 },
    reward: { gold: 2000 },
    hidden: false,
  },
  survive_wipe: {
    id: 'survive_wipe',
    name: 'Last One Standing',
    description: 'Win a room with only 1 hero alive',
    category: ACHIEVEMENT_CATEGORY.CHALLENGE,
    condition: { type: 'solo_room_clear' },
    reward: { gold: 1000 },
    hidden: false,
  },
  tower_floor_10: {
    id: 'tower_floor_10',
    name: 'Tower Climber',
    description: 'Reach floor 10 in Tower of Trials',
    category: ACHIEVEMENT_CATEGORY.CHALLENGE,
    condition: { stat: 'towerHighScore', threshold: 10 },
    reward: { gold: 2000 },
    hidden: false,
  },
  tower_floor_25: {
    id: 'tower_floor_25',
    name: 'Tower Champion',
    description: 'Reach floor 25 in Tower of Trials',
    category: ACHIEVEMENT_CATEGORY.CHALLENGE,
    condition: { stat: 'towerHighScore', threshold: 25 },
    reward: { gold: 5000 },
    hidden: false,
  },
  tower_floor_50: {
    id: 'tower_floor_50',
    name: 'Tower Legend',
    description: 'Reach floor 50 in Tower of Trials',
    category: ACHIEVEMENT_CATEGORY.CHALLENGE,
    condition: { stat: 'towerHighScore', threshold: 50 },
    reward: { gold: 15000 },
    hidden: true,
  },
  difficulty_2x: {
    id: 'difficulty_2x',
    name: 'Brave',
    description: 'Complete a dungeon at 2.0x difficulty',
    category: ACHIEVEMENT_CATEGORY.CHALLENGE,
    condition: { type: 'difficulty_clear', threshold: 2.0 },
    reward: { gold: 2000 },
    hidden: false,
  },
  difficulty_3x: {
    id: 'difficulty_3x',
    name: 'Fearless',
    description: 'Complete a dungeon at 3.0x difficulty',
    category: ACHIEVEMENT_CATEGORY.CHALLENGE,
    condition: { type: 'difficulty_clear', threshold: 3.0 },
    reward: { gold: 5000 },
    hidden: false,
  },

  // === ECONOMY ===
  first_homestead: {
    id: 'first_homestead',
    name: 'Homeowner',
    description: 'Build your first homestead upgrade',
    category: ACHIEVEMENT_CATEGORY.ECONOMY,
    condition: { stat: 'homesteadUpgrades', threshold: 1 },
    reward: { gold: 300 },
    hidden: false,
  },
  gold_hoarder: {
    id: 'gold_hoarder',
    name: 'Gold Hoarder',
    description: 'Accumulate 50,000 gold at once',
    category: ACHIEVEMENT_CATEGORY.ECONOMY,
    condition: { stat: 'peakGold', threshold: 50000 },
    reward: { gold: 5000 },
    hidden: false,
  },
  big_spender: {
    id: 'big_spender',
    name: 'Big Spender',
    description: 'Spend 100,000 gold total',
    category: ACHIEVEMENT_CATEGORY.ECONOMY,
    condition: { stat: 'totalGoldSpent', threshold: 100000 },
    reward: { gold: 5000 },
    hidden: false,
  },
  first_raid: {
    id: 'first_raid',
    name: 'Raider',
    description: 'Complete your first raid',
    category: ACHIEVEMENT_CATEGORY.ECONOMY,
    condition: { stat: 'raidsCompleted', threshold: 1 },
    reward: { gold: 2000 },
    hidden: false,
  },
};

// Get achievement by ID
export const getAchievement = (id) => ACHIEVEMENTS[id];

// Get all achievements
export const getAllAchievements = () => Object.values(ACHIEVEMENTS);

// Get achievements by category
export const getAchievementsByCategory = (category) =>
  Object.values(ACHIEVEMENTS).filter(a => a.category === category);

// Get visible achievements (non-hidden or already earned)
export const getVisibleAchievements = (earnedIds = []) =>
  Object.values(ACHIEVEMENTS).filter(a => !a.hidden || earnedIds.includes(a.id));

// Count total achievements
export const getTotalAchievementCount = () => Object.keys(ACHIEVEMENTS).length;
