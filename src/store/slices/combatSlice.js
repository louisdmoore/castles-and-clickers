import { calculateHeroStats } from '../helpers/statCalculator';

// OPTIMIZATION: Combat log batching to reduce state updates
let pendingCombatLogs = [];
let combatLogFlushScheduled = false;
let combatLogFlushFn = null;

const flushCombatLogs = () => {
  if (pendingCombatLogs.length > 0 && combatLogFlushFn) {
    const logs = pendingCombatLogs;
    pendingCombatLogs = [];
    combatLogFlushScheduled = false;
    combatLogFlushFn(logs);
  } else {
    combatLogFlushScheduled = false;
  }
};

// Reset combat log module state (called from resetGame)
export const resetCombatLogState = () => {
  combatLogFlushFn = null;
  pendingCombatLogs = [];
};

export const createCombatSlice = (set, get) => ({
  // State
  combat: null,
  combatLog: [],
  combatLogIndex: 0,
  combatLogCount: 0,
  heroHp: {},
  roomCombat: null,
  combatPauseUntil: 0,
  // Per-run stats accumulator — initialized on startDungeon, read by contribution meter / run summary / death recap
  runStats: {},
  // Death log for death recap — records each hero death event during a run
  deathLog: [],
  // Run history — last 50 runs with DPS metrics
  runHistory: [],
  // Pending modal request — lets non-layout components (e.g. RunSummary) request a modal open
  pendingModal: null,

  // Actions
  setCombat: (combat) => set({ combat }),

  // Initialize per-run stats for all heroes at dungeon start
  initRunStats: () => {
    const { heroes } = get();
    const stats = {
      totalCombatTime: 0,
      combatTicks: 0,
    };
    heroes.filter(Boolean).forEach(hero => {
      stats[hero.id] = {
        damageDealt: 0,
        healingDone: 0,
        healingReceived: 0,
        damageTaken: 0,
        damagePrevented: 0,
        controlTime: 0,
        turnsTaken: 0,
        kills: 0,
        biggestHit: 0,
      };
    });
    set({ runStats: stats, deathLog: [] });
  },

  // Accumulate run stats for a hero (called per-tick from useCombat)
  updateRunStats: (heroId, updates) => {
    set(state => {
      const current = state.runStats[heroId];
      if (!current) return state;
      const updated = { ...current };
      for (const [key, value] of Object.entries(updates)) {
        if (key === 'biggestHit') {
          updated.biggestHit = Math.max(updated.biggestHit, value);
        } else {
          updated[key] = (updated[key] || 0) + value;
        }
      }
      return { runStats: { ...state.runStats, [heroId]: updated } };
    });
  },

  // Record a hero death event for the death recap
  recordHeroDeath: (heroId, heroName, classId, killerName) => {
    set(state => {
      const deathOrder = state.deathLog.length + 1;
      const heroStats = state.runStats[heroId] || {};
      return {
        deathLog: [...state.deathLog, {
          heroId,
          heroName,
          classId,
          killerName,
          deathOrder,
          damageTaken: heroStats.damageTaken || 0,
          healingReceived: heroStats.healingReceived || 0,
        }],
      };
    });
  },

  // Increment combat tick counter (called once per round from useCombat)
  // Each tick = one combat round = 0.25s of game time
  incrementCombatTick: () => {
    set(state => ({
      runStats: {
        ...state.runStats,
        combatTicks: (state.runStats.combatTicks || 0) + 1,
      },
    }));
  },

  // Flush accumulated combat ticks into totalCombatTime (called at room end / dungeon end)
  flushCombatTicks: () => {
    set(state => {
      const { runStats } = state;
      const ticks = runStats.combatTicks || 0;
      if (ticks === 0) return state;

      const elapsed = ticks * 0.25; // Each tick = 0.25s game time
      return {
        runStats: {
          ...runStats,
          totalCombatTime: (runStats.totalCombatTime || 0) + elapsed,
          combatTicks: 0,
        },
      };
    });
  },

  // Save run to history (called from endDungeon)
  saveRunToHistory: (runSnapshot) => {
    set(state => {
      const newHistory = [runSnapshot, ...state.runHistory];
      // Keep only last 50 runs (FIFO)
      if (newHistory.length > 50) {
        newHistory.length = 50;
      }
      return { runHistory: newHistory };
    });
  },

  // Request a modal to be opened (consumed by GameLayout)
  setPendingModal: (modalId) => set({ pendingModal: modalId }),
  clearPendingModal: () => set({ pendingModal: null }),

  // OPTIMIZATION: Batched combat log to reduce state updates (44+ calls per tick -> 1)
  addCombatLog: (message) => {
    pendingCombatLogs.push(message);

    // Initialize flush function if not set
    if (!combatLogFlushFn) {
      combatLogFlushFn = (logs) => {
        set(state => {
          const maxSize = 50;
          let newLog = [...state.combatLog, ...logs];
          if (newLog.length > maxSize) {
            newLog = newLog.slice(-maxSize);
          }
          return { combatLog: newLog };
        });
      };
    }

    // Schedule flush if not already scheduled
    // Use requestAnimationFrame to align with browser render cycle
    if (!combatLogFlushScheduled) {
      combatLogFlushScheduled = true;
      requestAnimationFrame(flushCombatLogs);
    }
  },

  clearCombatLog: () => set({ combatLog: [], combatLogIndex: 0, combatLogCount: 0 }),

  // Initialize hero HP at dungeon start
  initializeHeroHp: () => {
    const { heroes } = get();
    const heroHp = {};
    heroes.filter(Boolean).forEach(hero => {
      const stats = calculateHeroStats(hero, heroes);
      heroHp[hero.id] = stats.maxHp;
    });
    set({ heroHp });
  },

  // Get current HP for a hero (persisted across rooms)
  getHeroHp: (heroId) => {
    const { heroHp, heroes } = get();
    if (heroHp[heroId] !== undefined) return heroHp[heroId];
    // Fallback to max if not set
    const hero = heroes.filter(Boolean).find(h => h.id === heroId);
    if (hero) return calculateHeroStats(hero, heroes).maxHp;
    return 0;
  },

  // Damage a hero (persists across rooms)
  damageHero: (heroId, amount) => {
    set(state => ({
      heroHp: {
        ...state.heroHp,
        [heroId]: Math.max(0, (state.heroHp[heroId] || 0) - amount),
      },
    }));
  },

  // OPTIMIZATION: Batch sync all hero HPs at once (for end of combat tick)
  syncHeroHp: (heroHpMap) => {
    set(state => {
      // Clean existing heroHp of any summon IDs that leaked in
      const cleanedHeroHp = {};
      for (const id in state.heroHp) {
        if (!id.startsWith('pet_') && !id.startsWith('clone_') && !id.startsWith('undead_')) {
          cleanedHeroHp[id] = state.heroHp[id];
        }
      }
      return { heroHp: { ...cleanedHeroHp, ...heroHpMap } };
    });
  },

  // Heal a hero
  healHero: (heroId, amount) => {
    const { heroes } = get();
    const hero = heroes.filter(Boolean).find(h => h.id === heroId);
    if (!hero) return;
    const maxHp = calculateHeroStats(hero, heroes).maxHp;
    set(state => ({
      heroHp: {
        ...state.heroHp,
        [heroId]: Math.min(maxHp, (state.heroHp[heroId] || maxHp) + amount),
      },
    }));
  },

  // Reset hero HP to full (at dungeon end)
  resetHeroHp: () => {
    const { heroes } = get();
    const heroHp = {};
    heroes.filter(Boolean).forEach(hero => {
      heroHp[hero.id] = calculateHeroStats(hero, heroes).maxHp;
    });
    set({ heroHp });
  },

  // Set room combat state
  setRoomCombat: (roomCombat) => set({ roomCombat }),

  // Update room combat state
  updateRoomCombat: (updates) => set(state => ({
    roomCombat: state.roomCombat ? { ...state.roomCombat, ...updates } : null,
  })),

  // Clear room combat
  clearRoomCombat: () => set({ roomCombat: null }),

  // Pause combat for a duration (for dramatic moments like phase transitions)
  pauseCombat: (durationMs) => {
    set({ combatPauseUntil: Date.now() + durationMs });
  },

  // Check if combat is currently paused
  isCombatPaused: () => {
    return Date.now() < get().combatPauseUntil;
  },
});
