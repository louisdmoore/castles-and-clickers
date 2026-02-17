import { RAIDS, isRaidUnlocked, getRaidDifficultyTier } from '../../data/raids';
import { getMaxPartySize, getDungeonTier } from '../../data/milestones';
import { DUNGEON_THEMES } from '../../data/dungeonThemes';
import { getAscensionDungeonCap, hasAscensionUnlock } from '../../data/ascensionMilestones';
import { rollDungeonAffixes } from '../../data/dungeonAffixes';
import { clearStatCache, setAscensionCount } from '../helpers/statCalculator';
import throttledStorage from '../helpers/throttledStorage';

// Tower of Trials: map floor number to effective dungeon level
// Floors 1-5 map to D10-D14, then +1 per floor, scaling beyond max dungeon level
const getTowerEffectiveLevel = (floor) => Math.min(9 + floor, 50);

export const createDungeonSlice = (set, get) => ({
  // State
  dungeon: null,
  highestDungeonCleared: 0,
  dungeonUnlocked: 1,
  lastDungeonSuccess: null,
  dungeonProgress: {
    currentType: 'normal',
    currentRaidId: null,
    currentRaidWing: 0,
    completedRaidWings: [],
    weeklyRaidCompletions: [],
    lastWeeklyReset: Date.now(),
    activeAffixes: [],
  },
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
    lastSeenVersion: null,
  },
  maxDungeonLevel: 30,
  ascension: { count: 0 },
  raidState: {
    active: false,
    raidId: null,
    defeatedWingBosses: [],
    heroHpSnapshot: {},
  },
  pendingRaidRecap: null,
  lastRunSummary: null,
  lastDeathRecap: null,
  prepPhase: null, // { nextLevel, success, dungeonType }
  challengeScores: { tower: { best: 0, bestSeed: null } },
  towerState: null, // { floor, seed, active } — transient, not persisted

  // Actions
  startDungeon: (level, options = {}) => {
    const { heroes, dungeonUnlocked, maxDungeonLevel, initializeHeroHp, initRunStats, dungeonProgress, pendingDungeonBuffs } = get();
    if (heroes.length === 0 || level > dungeonUnlocked) return false;

    // Cap at max dungeon level (30)
    const cappedLevel = Math.min(level, maxDungeonLevel);

    // Initialize hero HP at full
    initializeHeroHp();

    // Initialize per-run stats accumulator
    initRunStats();

    // Set up dungeon type
    const dungeonType = options.type || 'normal';

    // Consume pending dungeon buffs into active buffs
    const activeBuffs = pendingDungeonBuffs.length > 0 ? [...pendingDungeonBuffs] : [];

    // Get difficulty multiplier from settings
    const difficultyMultiplier = get().dungeonSettings?.difficultyMultiplier || 1.0;

    // Roll dungeon affixes based on difficulty (2.0x→1, 2.5x→1-2, 3.0x→2)
    let affixes = options.affixes || [];
    if (affixes.length === 0 && difficultyMultiplier >= 2.0) {
      const affixCount = difficultyMultiplier >= 3.0 ? 2
        : difficultyMultiplier >= 2.5 ? (Math.random() < 0.5 ? 2 : 1)
        : 1;
      affixes = rollDungeonAffixes(affixCount);
    }

    // Look up favored affixes from dungeon theme for loot targeting
    const tier = getDungeonTier(cappedLevel);
    const theme = DUNGEON_THEMES[tier.theme];
    const favoredAffixes = theme?.favoredAffixes || [];

    set({
      dungeon: {
        level: cappedLevel,
        currentRoom: 0,
        totalRooms: 5 + Math.floor(cappedLevel / 2),
        completed: false,
        type: dungeonType,
        activeBuffs,
        difficultyMultiplier,
        favoredAffixes,
        affixes: affixes.map(a => a.id),
      },
      pendingDungeonBuffs: [],
      dungeonProgress: {
        ...dungeonProgress,
        currentType: dungeonType,
        activeAffixes: affixes,
      },
      combat: null,
      roomCombat: { phase: 'setup', tick: 0 }, // Initialize so game loop can start
      combatLog: [],
      isRunning: true,
    });
    return true;
  },

  dismissRunSummary: () => set({ lastRunSummary: null }),
  dismissDeathRecap: () => set({ lastDeathRecap: null }),

  dismissPrepPhase: () => set({ prepPhase: null }),

  startFromPrepPhase: () => {
    const { prepPhase } = get();
    if (!prepPhase) return;
    const { nextLevel, dungeonType } = prepPhase;
    set({ prepPhase: null });
    get().startDungeon(nextLevel, { type: dungeonType });
  },

  endDungeon: (success) => {
    const { maxDungeonLevel, processPendingRecruits, runStats, heroes, deathLog } = get();

    // Snapshot run stats for the summary popup before clearing state
    const dungeonLevel = get().dungeon?.level;
    const runSummary = {
      success,
      dungeonLevel,
      timestamp: Date.now(),
      heroStats: {},
    };
    let totalDamage = 0;
    let mvpId = null;
    let mvpDamage = 0;
    let biggestHit = 0;
    let biggestHitHero = null;

    for (const hero of heroes.filter(Boolean)) {
      const stats = runStats[hero.id];
      if (!stats) continue;
      runSummary.heroStats[hero.id] = {
        name: hero.name,
        classId: hero.classId,
        ...stats,
      };
      totalDamage += stats.damageDealt || 0;
      if ((stats.damageDealt || 0) > mvpDamage) {
        mvpDamage = stats.damageDealt || 0;
        mvpId = hero.id;
      }
      if ((stats.biggestHit || 0) > biggestHit) {
        biggestHit = stats.biggestHit || 0;
        biggestHitHero = hero.name;
      }
    }
    runSummary.totalDamage = totalDamage;
    runSummary.mvpId = mvpId;
    runSummary.biggestHit = biggestHit;
    runSummary.biggestHitHero = biggestHitHero;

    // Build death recap on defeat
    let deathRecap = null;
    if (!success && deathLog.length > 0) {
      deathRecap = {
        dungeonLevel,
        timestamp: Date.now(),
        deaths: deathLog,
        heroStats: {},
      };
      for (const hero of heroes.filter(Boolean)) {
        const stats = runStats[hero.id];
        if (!stats) continue;
        deathRecap.heroStats[hero.id] = {
          name: hero.name,
          classId: hero.classId,
          damageTaken: stats.damageTaken || 0,
          healingReceived: stats.healingReceived || 0,
          damageDealt: stats.damageDealt || 0,
        };
      }
    }

    set(state => {
      // Determine next dungeon level for prep phase
      const nextLevel = success
        ? Math.min((state.dungeon?.level || 1) + 1, maxDungeonLevel)
        : (state.dungeon?.level || 1);

      const updates = {
        dungeon: null,
        combat: null,
        roomCombat: null,
        isRunning: false,
        consumables: [], // Clear consumables on dungeon exit
        reforgeCount: 0, // Reset reforge cost escalation
        lastDungeonSuccess: success, // Track victory or defeat for transition screen
        lastRunSummary: totalDamage > 0 ? runSummary : null,
        lastDeathRecap: deathRecap,
        prepPhase: {
          nextLevel,
          success,
          dungeonType: state.dungeonSettings?.type || 'normal',
        },
        dungeonProgress: {
          ...state.dungeonProgress,
          currentType: 'normal',
          activeAffixes: [],
        },
      };

      // On failure, refund dungeon buffs so the player doesn't lose paid consumables
      if (!success && state.dungeon?.activeBuffs?.length > 0) {
        updates.pendingDungeonBuffs = [
          ...(state.pendingDungeonBuffs || []),
          ...state.dungeon.activeBuffs,
        ];
      }

      if (success && state.dungeon) {
        const clearedLevel = state.dungeon.level;

        const newHighest = Math.max(state.highestDungeonCleared, clearedLevel);
        updates.highestDungeonCleared = newHighest;

        // Expand party size based on dungeon progress
        const newMaxPartySize = getMaxPartySize(newHighest, state.ascension?.count || 0);
        if (newMaxPartySize > (state.maxPartySize || 4)) {
          updates.maxPartySize = newMaxPartySize;
        }

        // Cap dungeonUnlocked at maxDungeonLevel
        updates.dungeonUnlocked = Math.min(
          Math.max(state.dungeonUnlocked, clearedLevel + 1),
          maxDungeonLevel
        );
        updates.stats = {
          ...state.stats,
          totalDungeonsCleared: state.stats.totalDungeonsCleared + 1,
        };

        // Update nextLevel with the new highest for the prep phase
        updates.prepPhase.nextLevel = Math.min(clearedLevel + 1, maxDungeonLevel);
      }

      return updates;
    });

    // Process any pending recruits and party changes first
    processPendingRecruits();
    get().processPendingPartyChanges();

    // Reset hero HP after all party changes are applied
    get().resetHeroHp();

    // Check if dungeon clear unlocks auto-advance (D5)
    get().checkAutoAdvanceUnlock();

    // Immediate save on dungeon completion
    throttledStorage.flush();
  },

  abandonDungeon: () => {
    const { processPendingRecruits, raidState } = get();

    // Clear raid state if abandoning a raid
    const raidCleanup = raidState.active ? {
      raidState: {
        active: false,
        raidId: null,
        defeatedWingBosses: [],
        heroHpSnapshot: {},
      },
    } : {};

    set(state => {
      const updates = {
        dungeon: null,
        combat: null,
        roomCombat: null,
        isRunning: false,
        dungeonProgress: {
          ...state.dungeonProgress,
          currentType: 'normal',
          currentRaidId: null,
          activeAffixes: [],
        },
        ...raidCleanup,
      };

      // Refund dungeon buffs so the player doesn't lose paid consumables on abandon
      if (state.dungeon?.activeBuffs?.length > 0) {
        updates.pendingDungeonBuffs = [
          ...(state.pendingDungeonBuffs || []),
          ...state.dungeon.activeBuffs,
        ];
      }

      return updates;
    });

    // Still process pending recruits and party changes even on abandon
    processPendingRecruits();
    get().processPendingPartyChanges();

    // Reset HP for any new heroes
    get().resetHeroHp();
  },

  // Ascension: partial reset with persistent progress
  canAscend: () => {
    const { highestDungeonCleared, maxDungeonLevel, dungeon } = get();
    // Can ascend when max dungeon level is cleared and not in a dungeon
    return highestDungeonCleared >= maxDungeonLevel && !dungeon;
  },

  performAscension: () => {
    const { heroes, bench, ascension, highestDungeonCleared, maxDungeonLevel } = get();

    // Guard: must have cleared max dungeon level
    if (highestDungeonCleared < maxDungeonLevel) return false;

    const newCount = ascension.count + 1;
    const newDungeonCap = getAscensionDungeonCap(newCount);
    const newMaxPartySize = getMaxPartySize(9, newCount); // D9 cleared + new ascension count

    // Update ascension count for stat multiplier and clear cache
    setAscensionCount(newCount);
    clearStatCache();

    // Reset heroes: level to 10, XP to 0, clear skills (free respec), keep equipment/traits/class
    const resetHero = (hero) => {
      if (!hero) return hero;
      return {
        ...hero,
        level: 10,
        xp: 0,
        skills: [], // Full respec — all skill points available to reallocate
      };
    };

    const resetHeroes = heroes.map(resetHero);
    const resetBench = bench.map(resetHero);

    set(state => ({
      // Ascension state
      ascension: { count: newCount },
      maxDungeonLevel: newDungeonCap,
      maxPartySize: newMaxPartySize,

      // Dungeon progress resets to D10
      highestDungeonCleared: 9, // Cleared through D9, D10 is next
      dungeonUnlocked: 10,

      // Gold resets to starter fund
      gold: 10000,

      // Heroes reset to level 10 with free respec
      heroes: resetHeroes,
      bench: resetBench,

      // Clear inventory (equipped items on heroes are kept)
      inventory: [],

      // Clear dungeon state
      dungeon: null,
      combat: null,
      roomCombat: null,
      isRunning: false,
      prepPhase: null,
      lastRunSummary: null,
      lastDeathRecap: null,
      heroHp: {},

      // Clear consumables and shop
      consumables: [],
      shopConsumables: [],
      pendingDungeonBuffs: [],
      shop: { items: [], lastRefresh: 0 },

      // Reset tavern
      tavern: { ...state.tavern, heroes: [], lastRefresh: 0 },

      // Clear pending changes
      pendingRecruits: [],
      pendingPartyChanges: [],

      // Preserve: homestead, ownedUniques, uniqueLevels, stats, featureUnlocks, equipmentSettings, dungeonSettings
      // Preserve dungeonProgress raid completions
    }));

    // Immediate save after ascension
    throttledStorage.flush();

    return true;
  },

  setDungeonSettings: (settings) => {
    set(state => ({
      dungeonSettings: {
        ...state.dungeonSettings,
        ...settings,
      },
    }));
  },

  markFeatureSeen: (feature) => {
    const { highestDungeonCleared } = get();
    set(state => ({
      featureUnlocks: {
        ...state.featureUnlocks,
        // For raids, store the dungeon level to track when new raids unlock
        [feature]: feature === 'lastSeenRaidsAt' ? highestDungeonCleared : true,
      },
    }));
  },

  setLastSeenVersion: (version) => {
    set(state => ({
      featureUnlocks: {
        ...state.featureUnlocks,
        lastSeenVersion: version,
      },
    }));
    throttledStorage.flush();
  },

  checkAutoAdvanceUnlock: () => {
    const { highestDungeonCleared, featureUnlocks } = get();
    if (featureUnlocks?.autoAdvance) return; // Already unlocked

    if (highestDungeonCleared >= 5) {
      set(state => ({
        featureUnlocks: {
          ...state.featureUnlocks,
          autoAdvance: true,
        },
      }));
    }
  },

  // ========================================
  // MULTI-BOSS RAID DUNGEON ACTIONS
  // ========================================

  enterRaid: (raidId, difficulty = 'normal') => {
    const { heroes, highestDungeonCleared, heroHp, initializeHeroHp, pendingDungeonBuffs, ascension } = get();
    if (heroes.filter(Boolean).length === 0) return false;

    const raid = RAIDS[raidId];
    if (!raid) return false;

    // Check if raid is unlocked
    if (!isRaidUnlocked(raidId, highestDungeonCleared)) return false;

    // Get difficulty tier config
    const tier = getRaidDifficultyTier(difficulty);

    // Check ascension requirement (Mythic requires Ascension 3)
    if (tier.ascensionRequired > 0 && (ascension?.count || 0) < tier.ascensionRequired) return false;

    // Check and deduct gold cost (Heroic costs 50,000 gold)
    if (tier.goldCost > 0) {
      const { gold } = get();
      if (gold < tier.goldCost) {
        get().addToast({ type: 'error', message: `Not enough gold! Need ${tier.goldCost.toLocaleString()} gold` });
        return false;
      }
      set(state => ({ gold: state.gold - tier.goldCost }));
    }

    // Roll dungeon affixes for Mythic
    const raidAffixes = tier.affixCount > 0 ? rollDungeonAffixes(tier.affixCount) : [];

    // Snapshot hero HP at raid start
    const hpSnapshot = {};
    heroes.filter(Boolean).forEach(hero => {
      const maxHp = hero.stats?.maxHp || 100;
      hpSnapshot[hero.id] = heroHp[hero.id] ?? maxHp;
    });

    initializeHeroHp();

    set(state => ({
      raidState: {
        active: true,
        raidId,
        difficulty,
        defeatedWingBosses: [],
        heroHpSnapshot: hpSnapshot,
      },
      dungeonProgress: {
        ...state.dungeonProgress,
        currentType: 'raid',
        currentRaidId: raidId,
        activeAffixes: raidAffixes,
      },
      dungeon: {
        level: raid.requiredLevel,
        type: 'raid',
        isRaid: true,
        raidId,
        difficultyMultiplier: tier.statMultiplier,
        raidDifficulty: difficulty,
        raidUniqueDropBonus: tier.uniqueDropBonus,
        activeBuffs: pendingDungeonBuffs.length > 0 ? [...pendingDungeonBuffs] : [],
        affixes: raidAffixes.map(a => a.id),
      },
      pendingDungeonBuffs: [],
      roomCombat: null,
      combatLog: [],
      isRunning: true,
    }));

    return true;
  },

  defeatWingBoss: (bossId) => {
    if (!bossId) return; // Defensive check for null/undefined bossId

    const { raidState } = get();
    if (!raidState.active) return;

    if (raidState.defeatedWingBosses.includes(bossId)) return;

    set(state => ({
      raidState: {
        ...state.raidState,
        defeatedWingBosses: [...state.raidState.defeatedWingBosses, bossId],
      },
    }));
  },

  isFinalBossUnlocked: () => {
    const { raidState } = get();
    if (!raidState.active) return false;

    const raid = RAIDS[raidState.raidId];
    if (!raid) return false;

    return raid.wingBosses.every(
      wb => raidState.defeatedWingBosses.includes(wb.id)
    );
  },

  completeRaid: () => {
    const { raidState, combatLog } = get();
    if (!raidState.active) return;

    const raid = RAIDS[raidState.raidId];
    if (!raid) return;

    // Record completion
    const completionKey = `${raidState.raidId}:complete`;

    // Collect loot info from combat log
    const lootDrops = combatLog
      .filter(log => log.type === 'system' && (log.message?.includes('UNIQUE DROP') || log.message?.includes('Loot:')))
      .map(log => log.message);

    set(state => ({
      // Store recap info before clearing
      pendingRaidRecap: {
        raidId: raidState.raidId,
        raidName: raid.name,
        difficulty: raidState.difficulty || 'normal',
        defeatedBosses: [...raidState.defeatedWingBosses],
        totalBosses: raid.wingBosses.length + 1,
        lootDrops,
        completedAt: Date.now(),
      },
      raidState: {
        active: false,
        raidId: null,
        difficulty: undefined,
        defeatedWingBosses: [],
        heroHpSnapshot: {},
      },
      dungeonProgress: {
        ...state.dungeonProgress,
        currentType: 'normal',
        currentRaidId: null,
        completedRaidWings: [...state.dungeonProgress.completedRaidWings, completionKey],
      },
      stats: {
        ...state.stats,
        raidRuns: {
          ...state.stats.raidRuns,
          [raidState.raidId]: (state.stats.raidRuns?.[raidState.raidId] || 0) + 1,
        },
      },
      dungeon: null,
      roomCombat: null,
      isRunning: false,
    }));

    // Immediate save on raid completion
    throttledStorage.flush();
  },

  clearRaidRecap: () => {
    set({ pendingRaidRecap: null });
    get().showPendingMilestone();
  },

  abandonRaid: () => {
    // Delegate to abandonDungeon which already handles raid cleanup,
    // buff refunds, pending recruits, and HP reset
    get().abandonDungeon();
  },

  resetWeeklyLockouts: () => {
    set(state => ({
      dungeonProgress: {
        ...state.dungeonProgress,
        completedRaidWings: [],
        weeklyRaidCompletions: [],
        lastWeeklyReset: Date.now(),
      },
    }));
  },

  advanceRoom: () => {
    set(state => {
      if (!state.dungeon) return state;
      const nextRoom = state.dungeon.currentRoom + 1;

      if (nextRoom >= state.dungeon.totalRooms) {
        return {
          dungeon: { ...state.dungeon, currentRoom: nextRoom, completed: true },
        };
      }

      return {
        dungeon: { ...state.dungeon, currentRoom: nextRoom },
        combat: null,
      };
    });
  },

  // ========================================
  // TOWER OF TRIALS (CHALLENGE MODE)
  // ========================================

  canAccessTower: () => {
    const { ascension, dungeon } = get();
    return hasAscensionUnlock(ascension?.count || 0, 'challenge_access') && !dungeon;
  },

  startTowerOfTrials: () => {
    const { heroes, initializeHeroHp, initRunStats } = get();
    if (heroes.filter(Boolean).length === 0) return false;

    // Generate a seed for this run
    const seed = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');

    initializeHeroHp();
    initRunStats();

    const startFloor = 1;
    // Tower uses dungeon level scaling: floor N maps to effective dungeon level
    const effectiveLevel = getTowerEffectiveLevel(startFloor);

    // Look up theme for flavor
    const tier = getDungeonTier(Math.min(effectiveLevel, 30));
    const theme = DUNGEON_THEMES[tier.theme];

    set({
      towerState: { floor: startFloor, seed, active: true },
      dungeon: {
        level: effectiveLevel,
        currentRoom: 0,
        totalRooms: 5 + Math.floor(effectiveLevel / 2),
        completed: false,
        type: 'tower',
        isTower: true,
        towerFloor: startFloor,
        towerSeed: seed,
        activeBuffs: [],
        difficultyMultiplier: 1.0,
        favoredAffixes: theme?.favoredAffixes || [],
      },
      dungeonProgress: {
        ...get().dungeonProgress,
        currentType: 'tower',
        activeAffixes: [],
      },
      combat: null,
      roomCombat: { phase: 'setup', tick: 0 },
      combatLog: [],
      isRunning: true,
      prepPhase: null,
      lastRunSummary: null,
      lastDeathRecap: null,
    });
    return true;
  },

  // Called when a tower floor is completed — advance to next floor without healing
  advanceTowerFloor: () => {
    const { towerState, initRunStats } = get();
    if (!towerState?.active) return;

    const nextFloor = towerState.floor + 1;
    const effectiveLevel = getTowerEffectiveLevel(nextFloor);

    const tier = getDungeonTier(Math.min(effectiveLevel, 30));
    const theme = DUNGEON_THEMES[tier.theme];

    // Reset per-run stats for the new floor
    initRunStats();

    set(state => ({
      towerState: { ...state.towerState, floor: nextFloor },
      dungeon: {
        level: effectiveLevel,
        currentRoom: 0,
        totalRooms: 5 + Math.floor(Math.min(effectiveLevel, 30) / 2),
        completed: false,
        type: 'tower',
        isTower: true,
        towerFloor: nextFloor,
        towerSeed: state.towerState.seed,
        activeBuffs: [],
        difficultyMultiplier: 1.0,
        favoredAffixes: theme?.favoredAffixes || [],
      },
      combat: null,
      roomCombat: { phase: 'setup', tick: 0 },
      combatLog: [],
      isRunning: true,
    }));
  },

  // Called when the party wipes in the tower — record score and end
  endTowerRun: () => {
    const { towerState, runStats, heroes, deathLog } = get();
    if (!towerState?.active) return;

    const floor = towerState.floor;
    const seed = towerState.seed;

    // Build run summary
    const runSummary = {
      success: false,
      dungeonLevel: getTowerEffectiveLevel(floor),
      timestamp: Date.now(),
      heroStats: {},
      isTower: true,
      towerFloor: floor,
    };
    let totalDamage = 0;
    let mvpId = null;
    let mvpDamage = 0;
    let biggestHit = 0;
    let biggestHitHero = null;

    for (const hero of heroes.filter(Boolean)) {
      const stats = runStats[hero.id];
      if (!stats) continue;
      runSummary.heroStats[hero.id] = { name: hero.name, classId: hero.classId, ...stats };
      totalDamage += stats.damageDealt || 0;
      if ((stats.damageDealt || 0) > mvpDamage) {
        mvpDamage = stats.damageDealt;
        mvpId = hero.id;
      }
      if ((stats.biggestHit || 0) > biggestHit) {
        biggestHit = stats.biggestHit;
        biggestHitHero = hero.name;
      }
    }
    runSummary.totalDamage = totalDamage;
    runSummary.mvpId = mvpId;
    runSummary.biggestHit = biggestHit;
    runSummary.biggestHitHero = biggestHitHero;

    // Build death recap
    let deathRecap = null;
    if (deathLog.length > 0) {
      deathRecap = {
        dungeonLevel: getTowerEffectiveLevel(floor),
        timestamp: Date.now(),
        deaths: deathLog,
        heroStats: {},
        isTower: true,
        towerFloor: floor,
      };
      for (const hero of heroes.filter(Boolean)) {
        const stats = runStats[hero.id];
        if (!stats) continue;
        deathRecap.heroStats[hero.id] = {
          name: hero.name,
          classId: hero.classId,
          damageTaken: stats.damageTaken || 0,
          healingReceived: stats.healingReceived || 0,
          damageDealt: stats.damageDealt || 0,
        };
      }
    }

    // Update high score
    set(state => {
      const currentBest = state.challengeScores?.tower?.best || 0;
      const isNewBest = floor > currentBest;

      return {
        towerState: null,
        dungeon: null,
        combat: null,
        roomCombat: null,
        isRunning: false,
        lastRunSummary: totalDamage > 0 ? runSummary : null,
        lastDeathRecap: deathRecap,
        lastTowerResult: { floor, seed, isNewBest },
        prepPhase: null, // No prep phase after tower — go back to menu
        challengeScores: {
          ...state.challengeScores,
          tower: {
            best: isNewBest ? floor : currentBest,
            bestSeed: isNewBest ? seed : state.challengeScores?.tower?.bestSeed,
          },
        },
        dungeonProgress: {
          ...state.dungeonProgress,
          currentType: 'normal',
          activeAffixes: [],
        },
      };
    });

    // Reset HP and process pending changes
    get().resetHeroHp();
    throttledStorage.flush();
  },

  dismissTowerResult: () => set({ lastTowerResult: null }),
});
