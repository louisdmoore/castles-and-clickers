/**
 * Factory for building a valid Zustand-persisted save object.
 * The shape must match what gameStore.js expects after hydration.
 *
 * Usage:
 *   const save = createGameState({ gold: 9999 });
 *   // → { state: { ...defaults, gold: 9999 }, version: 9 }
 */

const SAVE_VERSION = 9; // Must match src/store/helpers/migrations.js
const PERSIST_KEY = 'castles-and-clickers-save';

const defaultHero = () => ({
  id: 'hero_test_warrior_1',
  name: 'TestWarrior',
  classId: 'warrior',
  level: 20,
  xp: 0,
  equipment: { weapon: null, armor: null, accessory: null },
  skills: [],
  traits: [],
  prestige: { count: 0 },
});

const defaultState = () => ({
  gold: 5000,
  heroes: [defaultHero()],
  bench: [],
  usedSlotDiscounts: [],
  pendingRecruits: [],
  pendingPartyChanges: [],
  tavern: { heroes: [], lastRefresh: 0, refreshCost: 25 },
  inventory: [],
  consumables: [],
  dungeon: null,
  combat: null,
  combatLog: [],
  combatLogIndex: 0,
  combatLogCount: 0,
  isRunning: false,
  gameSpeed: 1,
  highestDungeonCleared: 0,
  dungeonUnlocked: 1,
  lastDungeonSuccess: null,
  prepPhase: null,
  lastDeathRecap: null,
  lastSaveTime: Date.now(),
  maxPartySize: 4,
  maxDungeonLevel: 30,
  stats: {
    totalGoldEarned: 0,
    totalGoldSpent: 0,
    totalItemsLooted: 0,
    totalMonstersKilled: 0,
    totalBossesKilled: 0,
    totalDungeonsCleared: 0,
    totalDeaths: 0,
    totalDamageDealt: 0,
    totalDamageTaken: 0,
    totalHealingDone: 0,
    totalHealingReceived: 0,
    totalCriticalHits: 0,
    totalDodges: 0,
    totalMitigated: 0,
    monsterKills: {},
    heroStats: {},
  },
  equipmentSettings: {
    autoSellJunk: true,
    autoEquipUpgrades: true,
    classPriority: {},
  },
  lootNotifications: [],
  homestead: {
    barracks: 0,
    armory: 0,
    fortress: 0,
    trainingGrounds: 0,
    treasury: 0,
    infirmary: 0,
    library: 0,
  },
  ownedUniques: [],
  uniqueLevels: {},
  unreadUniques: [],
  pendingUniqueCelebration: null,
  pendingCollectionMilestone: null,
  combatPauseUntil: 0,
  shopConsumables: [],
  pendingDungeonBuffs: [],
  shop: { items: [], lastRefresh: 0 },
  heroHp: {},
  roomCombat: null,
  saveStatus: { success: true, timestamp: Date.now() },
  toasts: [],
  ascension: { count: 0 },
  dungeonSettings: {
    type: 'normal',
    autoAdvance: false,
    targetLevel: null,
    difficultyMultiplier: 1.0,
  },
  featureUnlocks: {
    autoAdvance: false,
    homesteadSeen: false,
    lastSeenRaidsAt: 0,
    // Must match CURRENT_VERSION in src/data/changelog.js to prevent
    // the changelog modal from auto-opening and blocking interactions.
    lastSeenVersion: '0.2.0',
  },
  dungeonProgress: {
    currentType: 'normal',
    currentRaidId: null,
    currentRaidWing: 0,
    completedRaidWings: [],
    weeklyRaidCompletions: [],
    lastWeeklyReset: Date.now(),
  },
  raidState: {
    active: false,
    raidId: null,
    defeatedWingBosses: [],
    heroHpSnapshot: {},
  },
  challengeScores: { tower: { best: 0, bestSeed: null } },
  earnedAchievements: [],
  essence: 0,
  runStats: {},
  lastRunSummary: null,
  deathLog: [],
  reforgeCount: 0,
});

export function createGameState(overrides = {}) {
  return {
    state: { ...defaultState(), ...overrides },
    version: SAVE_VERSION,
  };
}

export { PERSIST_KEY, SAVE_VERSION };
