// Achievement condition evaluator
// Maps achievement stat keys to actual game state values and evaluates custom conditions

import { ACHIEVEMENTS, getAllAchievements } from '../../data/achievements';
import { getAllUniqueItems } from '../../data/uniqueItems';
import { CLASSES } from '../../data/classes';

// Map achievement stat keys to game state values
const getStatValue = (statKey, state) => {
  switch (statKey) {
    case 'totalKills': return state.stats?.totalMonstersKilled || 0;
    case 'bossKills': return state.stats?.totalBossesKilled || 0;
    case 'worldBossKills': return state.stats?.worldBossKills || 0;
    case 'totalCrits': return state.stats?.totalCriticalHits || 0;
    case 'highestDungeon': return state.highestDungeonCleared || 0;
    case 'ascensionCount': return state.ascension?.count || 0;
    case 'highestHeroLevel': {
      const allHeroes = [...(state.heroes || []), ...(state.benchHeroes || [])].filter(Boolean);
      return allHeroes.length > 0 ? Math.max(...allHeroes.map(h => h.level || 0)) : 0;
    }
    case 'heroCount': return (state.heroes || []).filter(Boolean).length;
    case 'uniqueItemsFound': return (state.ownedUniques || []).length;
    case 'rareItemsFound': return state.stats?.rareItemsFound || 0;
    case 'epicItemsFound': return state.stats?.epicItemsFound || 0;
    case 'homesteadUpgrades': {
      const h = state.homestead || {};
      return Object.values(h).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
    }
    case 'peakGold': return state.stats?.peakGold || 0;
    case 'totalGoldSpent': return state.stats?.totalGoldSpent || 0;
    case 'raidsCompleted': {
      const runs = state.stats?.raidRuns || {};
      return Object.values(runs).reduce((sum, v) => sum + v, 0);
    }
    default: return state.stats?.[statKey] || 0;
  }
};

// Check if a custom condition is met
const checkCustomCondition = (condition, state) => {
  switch (condition.type) {
    case 'flawless_dungeon':
      return (state.stats?.flawlessRuns || 0) > 0;

    case 'all_classes_recruited': {
      const allHeroes = [...(state.heroes || []), ...(state.benchHeroes || [])].filter(Boolean);
      const classIds = new Set(allHeroes.map(h => h.classId));
      return classIds.size >= Object.keys(CLASSES).length;
    }

    case 'all_uniques_collected':
      return (state.ownedUniques || []).length >= getAllUniqueItems().length;

    case 'speed_clear':
      return (state.stats?.speedClears || 0) > 0;

    case 'solo_room_clear':
      return (state.stats?.soloRoomClears || 0) > 0;

    case 'difficulty_clear':
      return (state.stats?.difficultyClearsAt || {})[condition.threshold] > 0;

    default:
      return false;
  }
};

// Get progress (0-1) for an achievement
export const getAchievementProgress = (achievementId, state) => {
  const achievement = ACHIEVEMENTS[achievementId];
  if (!achievement) return 0;

  const { condition } = achievement;
  const earned = (state.earnedAchievements || []).includes(achievementId);
  if (earned) return 1;

  if (condition.stat) {
    const current = getStatValue(condition.stat, state);
    return Math.min(1, current / condition.threshold);
  }

  // Custom conditions are binary
  if (condition.type) {
    return checkCustomCondition(condition, state) ? 1 : 0;
  }

  return 0;
};

// Check all achievements and return newly earned ones
export const evaluateAchievements = (state) => {
  const earned = state.earnedAchievements || [];
  const earnedSet = new Set(earned);
  const newlyEarned = [];

  for (const achievement of getAllAchievements()) {
    if (earnedSet.has(achievement.id)) continue;

    const { condition } = achievement;
    let met = false;

    if (condition.stat) {
      const current = getStatValue(condition.stat, state);
      met = current >= condition.threshold;
    } else if (condition.type) {
      met = checkCustomCondition(condition, state);
    }

    if (met) {
      newlyEarned.push(achievement);
    }
  }

  return newlyEarned;
};
