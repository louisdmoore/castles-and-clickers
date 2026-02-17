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

export const SAVE_VERSION = 2;

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
