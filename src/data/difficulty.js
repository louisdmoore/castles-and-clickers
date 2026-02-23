/**
 * Centralized difficulty constants and helpers.
 * Replaces magic numbers scattered across PrepScreen and dungeonSlice.
 */

export const DIFFICULTY_STOPS = [1.0, 1.5, 2.0, 2.5, 3.0];

export const DIFFICULTY_INFO = {
  1.0: { label: 'Normal', color: '#9ca3af', desc: 'Standard difficulty and rewards' },
  1.5: { label: 'Hard', color: '#fbbf24', desc: '+50% enemy stats & rewards, faster enemies' },
  2.0: { label: 'Brutal', color: '#f97316', desc: '+100% stats & rewards, more elites' },
  2.5: { label: 'Nightmare', color: '#ef4444', desc: '+150% stats & rewards, many elites' },
  3.0: { label: 'Infernal', color: '#a855f7', desc: '+200% stats & rewards, most elites' },
};

/** Per-stop speed bonus applied on top of base speed scaling */
export const DIFFICULTY_SPEED_BONUS = {
  1.0: 0,
  1.5: 0.10,
  2.0: 0.20,
  2.5: 0.30,
  3.0: 0.40,
};

/** Per-stop extra elite monsters added to the dungeon */
export const DIFFICULTY_ELITE_BONUS = {
  1.0: 0,
  1.5: 1,
  2.0: 2,
  2.5: 3,
  3.0: 4,
};

/** Multiplier for completion gold bonus: baseGold * (difficulty - 1) * factor */
export const COMPLETION_BONUS_FACTOR = 0.5;

/** Dungeon clear level required to unlock difficulty slider */
export const DIFFICULTY_UNLOCK_LEVEL = 10;

/** Get info for a difficulty multiplier value */
export const getDifficultyInfo = (multiplier) =>
  DIFFICULTY_INFO[multiplier] || DIFFICULTY_INFO[1.0];
