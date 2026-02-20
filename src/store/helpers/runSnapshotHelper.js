/**
 * Helper to build run snapshot data and save to history
 * Consolidates duplicated logic from endDungeon, abandonDungeon, and completeRaid
 */

export const buildRunSnapshot = (params) => {
  const {
    dungeonLevel,
    success,
    heroes,
    runStats,
    isRaid = false,
    raidName = null,
  } = params;

  // Calculate DPS metrics (floor at one tick to avoid division by zero)
  const totalCombatTime = Math.max(runStats.totalCombatTime || 0, 0.25);
  let totalDamage = 0;
  let mvpId = null;
  let mvpDamage = 0;
  let biggestHit = 0;
  let biggestHitHeroId = null;

  const heroStats = {};
  for (const hero of heroes.filter(Boolean)) {
    const stats = runStats[hero.id];
    if (!stats) continue;

    // Build hero stats with per-second rates
    heroStats[hero.id] = {
      name: hero.name,
      classId: hero.classId,
      damageDealt: stats.damageDealt || 0,
      damageTaken: stats.damageTaken || 0,
      healingDone: stats.healingDone || 0,
      kills: stats.kills || 0,
      dps: (stats.damageDealt || 0) / totalCombatTime,
      hps: (stats.healingDone || 0) / totalCombatTime,
      dtps: (stats.damageTaken || 0) / totalCombatTime,
    };

    // Accumulate totals
    totalDamage += stats.damageDealt || 0;

    // Track MVP (highest damage dealer)
    if ((stats.damageDealt || 0) > mvpDamage) {
      mvpDamage = stats.damageDealt || 0;
      mvpId = hero.id;
    }

    // Track biggest hit
    if ((stats.biggestHit || 0) > biggestHit) {
      biggestHit = stats.biggestHit || 0;
      biggestHitHeroId = hero.id;
    }
  }

  // Find MVP and biggest hit hero names
  const mvpHero = heroes.find(h => h?.id === mvpId);
  const biggestHitHero = biggestHitHeroId ? heroes.find(h => h?.id === biggestHitHeroId) : null;

  // Calculate average DPS
  const averageDPS = totalDamage / totalCombatTime;

  // Build history entry
  const historyEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    dungeonLevel,
    success,
    timestamp: Date.now(),
    totalCombatTime,
    totalDamageDealt: totalDamage,
    averageDPS,
    mvpId,
    mvpName: mvpHero?.name || 'Unknown',
    biggestHit,
    biggestHitHero: biggestHitHero?.name || null,
    heroStats: Object.fromEntries(
      Object.entries(heroStats).map(([id, s]) => [id, {
        name: s.name,
        classId: s.classId,
        damageDealt: s.damageDealt,
        damageTaken: s.damageTaken,
        healingDone: s.healingDone,
        kills: s.kills,
        dps: s.dps,
        hps: s.hps,
        dtps: s.dtps,
      }])
    ),
  };

  // Add raid-specific fields if applicable
  if (isRaid && raidName) {
    historyEntry.isRaid = true;
    historyEntry.raidName = raidName;
  }

  // Build run summary for modal display
  const runSummary = {
    success,
    dungeonLevel,
    timestamp: Date.now(),
    heroStats,
    totalDamage,
    mvpId,
    biggestHit,
    biggestHitHero: biggestHitHero?.name || null,
    totalCombatTime,
    averageDPS,
  };

  // Add raid-specific fields to summary if applicable
  if (isRaid && raidName) {
    runSummary.isRaid = true;
    runSummary.raidName = raidName;
  }

  return {
    historyEntry,
    runSummary,
    totalDamage,
  };
};
