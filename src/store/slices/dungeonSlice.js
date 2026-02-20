import { RAIDS, isRaidUnlocked, getRaidDifficultyTier } from '../../data/raids';
import { getMaxPartySize, getDungeonTier } from '../../data/milestones';
import { DUNGEON_THEMES } from '../../data/dungeonThemes';
import { getAscensionDungeonCap, getAscensionGoldCost } from '../../data/ascensionMilestones';
import { clearStatCache, setAscensionCount } from '../helpers/statCalculator';
import throttledStorage from '../helpers/throttledStorage';
import { buildRunSnapshot } from '../helpers/runSnapshotHelper';

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
        startTime: Date.now(),
      },
      pendingDungeonBuffs: [],
      dungeonProgress: {
        ...dungeonProgress,
        currentType: dungeonType,
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
    // Flush any in-progress combat ticks before reading runStats
    get().flushCombatTicks();

    const { maxDungeonLevel, processPendingRecruits, runStats, heroes, deathLog } = get();

    // Snapshot dungeon data before clearing state
    const dungeonLevel = get().dungeon?.level;

    // Use helper to build run snapshot and history entry
    const { historyEntry, runSummary, totalDamage } = buildRunSnapshot({
      dungeonLevel,
      success,
      heroes,
      runStats,
    });

    // Save to run history
    get().saveRunToHistory(historyEntry);

    // Build death recap on defeat
    let deathRecap = null;
    if (!success && deathLog.length > 0) {
      deathRecap = {
        dungeonLevel,
        timestamp: Date.now(),
        deaths: deathLog,
        roomNumber: get().dungeon?.currentRoom,
        totalRooms: get().dungeon?.totalRooms,
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
        const newMaxPartySize = getMaxPartySize(state.homestead?.barracks || 0, state.ascension?.count || 0);
        if (newMaxPartySize > (state.maxPartySize || 4)) {
          updates.maxPartySize = newMaxPartySize;
        }

        // Cap dungeonUnlocked at maxDungeonLevel
        updates.dungeonUnlocked = Math.min(
          Math.max(state.dungeonUnlocked, clearedLevel + 1),
          maxDungeonLevel
        );
        const updatedStats = {
          ...state.stats,
          totalDungeonsCleared: state.stats.totalDungeonsCleared + 1,
        };

        // Track achievement challenge stats
        if (deathLog.length === 0) {
          updatedStats.flawlessRuns = (state.stats.flawlessRuns || 0) + 1;
        }
        if (state.dungeon.startTime) {
          const elapsed = (Date.now() - state.dungeon.startTime) / 1000;
          if (elapsed < 30) {
            updatedStats.speedClears = (state.stats.speedClears || 0) + 1;
          }
        }
        const diff = state.dungeon.difficultyMultiplier || 1.0;
        if (diff >= 2.0) {
          const clears = { ...(state.stats.difficultyClearsAt || {}) };
          clears[diff] = (clears[diff] || 0) + 1;
          updatedStats.difficultyClearsAt = clears;
        }

        updates.stats = updatedStats;

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

    // Check for newly unlocked features (progressive disclosure)
    get().checkFeatureUnlocks();

    // Immediate save on dungeon completion
    throttledStorage.flush();

    // Check for newly earned achievements
    get().checkAchievements();
  },

  abandonDungeon: () => {
    // Flush any in-progress combat ticks before clearing state
    get().flushCombatTicks();

    const { processPendingRecruits, raidState, runStats, heroes, dungeon } = get();

    // Save raid defeat to run history
    if (raidState.active && raidState.raidId) {
      const raid = RAIDS[raidState.raidId];
      if (raid) {
        const dungeonLevel = dungeon?.level;
        const { historyEntry } = buildRunSnapshot({
          dungeonLevel,
          success: false,
          heroes,
          runStats,
          isRaid: true,
          raidName: raid.name,
        });
        get().saveRunToHistory(historyEntry);
      }
    } else if (dungeon) {
      // Save normal dungeon abandon to run history
      const dungeonLevel = dungeon.level;
      const { historyEntry } = buildRunSnapshot({
        dungeonLevel,
        success: false,
        heroes,
        runStats,
      });
      get().saveRunToHistory(historyEntry);
    }

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

  // Ascension: no-reset celebration with gold cost
  canAscend: () => {
    const { highestDungeonCleared, maxDungeonLevel, dungeon, gold, ascension } = get();
    const nextCount = (ascension?.count || 0) + 1;
    const cost = getAscensionGoldCost(nextCount);
    // Can ascend when max dungeon level is cleared, not in dungeon, and can afford it
    return highestDungeonCleared >= maxDungeonLevel && !dungeon && gold >= cost;
  },

  performAscension: () => {
    const { ascension, highestDungeonCleared, maxDungeonLevel, gold } = get();

    // Guard: must have cleared max dungeon level
    if (highestDungeonCleared < maxDungeonLevel) return false;

    const newCount = (ascension?.count || 0) + 1;
    const cost = getAscensionGoldCost(newCount);

    // Guard: must afford gold cost
    if (gold < cost) {
      get().addToast({ type: 'error', message: `Not enough gold! Need ${cost.toLocaleString()} gold` });
      return false;
    }

    const newDungeonCap = getAscensionDungeonCap(newCount);

    // Update ascension count for stat multiplier and clear cache
    setAscensionCount(newCount);
    clearStatCache();

    set(state => ({
      // Deduct gold cost
      gold: state.gold - cost,

      // Ascension state
      ascension: { count: newCount },
      maxDungeonLevel: newDungeonCap,

      // Unlock new dungeon levels (set dungeonUnlocked to current highest + 1)
      dungeonUnlocked: Math.min(state.highestDungeonCleared + 1, newDungeonCap),
    }));

    // Recalculate party size — ascension can unlock flex slots 7-8
    const newMaxPartySize = getMaxPartySize(get().homestead?.barracks || 0, newCount);
    if (newMaxPartySize > (get().maxPartySize || 4)) {
      set({ maxPartySize: newMaxPartySize });
      get().addToast({ type: 'success', message: `Flex party slot ${newMaxPartySize} unlocked!` });
    }

    // Celebration toast
    get().addToast({ type: 'success', message: `Ascended to A${newCount}! +${newCount * 10}% all stats, dungeon cap D${newDungeonCap}` });

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

  // Progressive disclosure: check for newly unlocked features and show celebrations
  checkFeatureUnlocks: () => {
    const { highestDungeonCleared, featureUnlocks } = get();
    const unlocks = { ...featureUnlocks };
    const celebrations = [];

    // Milestone-based unlocks
    const MILESTONES = [
      { key: 'tutorialComplete', check: () => highestDungeonCleared >= 1, message: 'Welcome to Castles & Clickers!' },
      { key: 'deathRecap', check: () => (get().stats?.totalDeaths || 0) > 0, message: 'Contribution Meter & Death Recap unlocked!' },
      { key: 'skillsUnlocked', check: () => highestDungeonCleared >= 2, message: 'Skill Trees unlocked — customize your heroes!' },
      { key: 'bestiaryUnlocked', check: () => highestDungeonCleared >= 3, message: 'Bestiary unlocked — track your enemies!' },
      { key: 'shopUnlocked', check: () => highestDungeonCleared >= 5, message: 'The Shop is open — buy gear and consumables!' },
      { key: 'difficultyUnlocked', check: () => highestDungeonCleared >= 10, message: 'Difficulty Slider unlocked — risk vs. reward!' },
      { key: 'raidsUnlocked', check: () => highestDungeonCleared >= 12, message: 'Raids unlocked — face the greatest challenges!' },
{ key: 'lootTargetingUnlocked', check: () => highestDungeonCleared >= 20, message: 'Dungeon Intel — each zone favors different loot!' },
      { key: 'ascensionPrompt', check: () => highestDungeonCleared >= 30, message: 'You have mastered the dungeon. A new path awaits...' },
    ];

    for (const milestone of MILESTONES) {
      if (!unlocks[milestone.key] && milestone.check()) {
        unlocks[milestone.key] = true;
        celebrations.push(milestone.message);
      }
    }

    if (celebrations.length > 0) {
      set({ featureUnlocks: unlocks });
      for (const msg of celebrations) {
        get().addToast({ type: 'success', message: msg });
      }
    }
  },

  // ========================================
  // MULTI-BOSS RAID DUNGEON ACTIONS
  // ========================================

  enterRaid: (raidId, difficulty = 'normal') => {
    const { heroes, highestDungeonCleared, heroHp, initializeHeroHp, initRunStats, pendingDungeonBuffs, ascension } = get();
    if (heroes.filter(Boolean).length === 0) return false;

    const raid = RAIDS[raidId];
    if (!raid) return false;

    // Check if raid is unlocked
    if (!isRaidUnlocked(raidId, highestDungeonCleared)) return false;

    // Get difficulty tier config
    const tier = getRaidDifficultyTier(difficulty);

    // Check ascension requirement
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

    // Snapshot hero HP at raid start
    const hpSnapshot = {};
    heroes.filter(Boolean).forEach(hero => {
      const maxHp = hero.stats?.maxHp || 100;
      hpSnapshot[hero.id] = heroHp[hero.id] ?? maxHp;
    });

    initializeHeroHp();
    initRunStats();

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

    // Flush any in-progress combat ticks before reading runStats
    get().flushCombatTicks();

    // Use helper to build run snapshot and history entry
    const state = get();
    const { runStats, heroes } = state;
    const dungeonLevel = state.dungeon?.level;
    const { historyEntry, runSummary, totalDamage } = buildRunSnapshot({
      dungeonLevel,
      success: true,
      heroes,
      runStats,
      isRaid: true,
      raidName: raid.name,
    });

    // Save to run history
    get().saveRunToHistory(historyEntry);

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
      lastRunSummary: totalDamage > 0 ? runSummary : null,
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
      runStats: {},
      deathLog: [],
    }));

    // Immediate save on raid completion
    throttledStorage.flush();

    // Check for newly earned achievements
    get().checkAchievements();
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

});
