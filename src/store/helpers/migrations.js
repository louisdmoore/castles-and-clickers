/**
 * Versioned save migration system.
 *
 * Each migration function transforms persisted state from version N to N+1.
 * Zustand's persist middleware calls `migrate(state, version)` when
 * the saved version is older than the current SAVE_VERSION.
 *
 * To add a new migration:
 *   1. Increment SAVE_VERSION
 *   2. Add a `[oldVersion]: (state) => newState` entry to MIGRATIONS
 *   3. The migration receives the full persisted state and returns the updated state
 */

export const SAVE_VERSION = 6;

// Sequential migration functions: fromVersion -> transform
const MIGRATIONS = {
  // v1 → v2: Phase 3 additions (difficulty slider, hero traits, loot targeting)
  1: (state) => {
    // Add difficultyMultiplier to dungeonSettings
    if (state.dungeonSettings && state.dungeonSettings.difficultyMultiplier === undefined) {
      state.dungeonSettings.difficultyMultiplier = 1.0;
    }

    // Add traits array to existing heroes (old heroes have trait object or null)
    if (state.heroes) {
      state.heroes = state.heroes.map(hero => {
        if (!hero) return hero;
        // Convert old trait (object/null) to new traits (array of IDs)
        if (hero.traits === undefined) {
          hero.traits = [];
          // Don't roll random traits for existing heroes — they get none
          // (rolling would change save state unpredictably)
        }
        // Clean up old trait field
        if (hero.trait !== undefined) {
          delete hero.trait;
        }
        return hero;
      });
    }

    // Add traits to bench heroes too
    if (state.bench) {
      state.bench = state.bench.map(hero => {
        if (!hero) return hero;
        if (hero.traits === undefined) hero.traits = [];
        if (hero.trait !== undefined) delete hero.trait;
        return hero;
      });
    }

    return state;
  },

  // v2 → v3: Phase 4 — Ascension system
  2: (state) => {
    // Initialize ascension state
    if (!state.ascension) {
      state.ascension = { count: 0 };
    }

    // Ensure maxDungeonLevel exists (should already be 30)
    if (state.maxDungeonLevel === undefined) {
      state.maxDungeonLevel = 30;
    }

    return state;
  },

  // v3 → v4: Phase 5 — Challenge modes (Tower of Trials)
  3: (state) => {
    if (!state.challengeScores) {
      state.challengeScores = { tower: { best: 0, bestSeed: null } };
    }
    return state;
  },

  // v4 → v5: Phase 7 — Unique item leveling + duplicate fusion + hero prestige stars
  4: (state) => {
    // Initialize uniqueLevels from existing ownedUniques
    if (!state.uniqueLevels) {
      state.uniqueLevels = {};
      if (state.ownedUniques && Array.isArray(state.ownedUniques)) {
        for (const templateId of state.ownedUniques) {
          if (typeof templateId === 'string') {
            state.uniqueLevels[templateId] = { xp: 0, level: 1, awakened: false };
          }
        }
      }
    }

    // Add prestige field to existing heroes (party and bench)
    const addPrestige = (hero) => {
      if (!hero) return hero;
      if (!hero.prestige) hero.prestige = { count: 0 };
      return hero;
    };
    if (state.heroes) {
      state.heroes = state.heroes.map(addPrestige);
    }
    if (state.bench) {
      state.bench = state.bench.map(addPrestige);
    }

    return state;
  },

  // v5 → v6: Phase 8 — Achievement system
  5: (state) => {
    if (!state.earnedAchievements) {
      state.earnedAchievements = [];
    }
    return state;
  },
};

/**
 * Apply all necessary migrations from `fromVersion` to SAVE_VERSION.
 * Called by Zustand persist middleware.
 */
export const migrate = (persistedState, fromVersion) => {
  let state = persistedState;
  let version = fromVersion;

  while (version < SAVE_VERSION) {
    const migration = MIGRATIONS[version];
    if (migration) {
      console.log(`[SaveMigration] Migrating v${version} → v${version + 1}`);
      state = migration(state);
    } else {
      console.warn(`[SaveMigration] No migration found for v${version}, skipping`);
    }
    version++;
  }

  return state;
};
