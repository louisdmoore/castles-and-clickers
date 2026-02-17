import { memo, useMemo } from 'react';
import { useGameStore, xpForLevel } from '../store/gameStore';
import { CLASSES } from '../data/classes';
import { PARTY_SLOTS } from '../data/classes';
import { getAllUniqueItems } from '../data/uniqueItems';
import { BUILDINGS } from '../data/homestead';
import { StarIcon, TrophyIcon, LockIcon, ChestIcon, GoldIcon } from './icons/ui';
import ClassIcon from './icons/ClassIcon';

const MAX_MILESTONES = 3;

const MilestoneWidget = () => {
  const heroes = useGameStore(state => state.heroes);
  const highestDungeonCleared = useGameStore(state => state.highestDungeonCleared);
  const ownedUniques = useGameStore(state => state.ownedUniques || []);
  const gold = useGameStore(state => state.gold);
  const homestead = useGameStore(state => state.homestead);

  const milestones = useMemo(() => {
    const results = [];

    // 1. Nearest hero level-up
    const activeHeroes = heroes.filter(Boolean);
    if (activeHeroes.length > 0) {
      let closestHero = null;
      let closestXpRemaining = Infinity;
      let closestXpPercent = 0;

      for (const hero of activeHeroes) {
        const xpNeeded = xpForLevel(hero.level + 1);
        const xpRemaining = xpNeeded - (hero.xp || 0);
        if (xpRemaining < closestXpRemaining) {
          closestXpRemaining = xpRemaining;
          closestXpPercent = Math.min(100, ((hero.xp || 0) / xpNeeded) * 100);
          closestHero = hero;
        }
      }

      if (closestHero) {
        results.push({
          id: 'hero-levelup',
          icon: <ClassIcon classId={closestHero.classId} size={14} />,
          text: `${closestHero.name}: ${closestXpRemaining} XP to Lv${closestHero.level + 1}`,
          progress: closestXpPercent,
          priority: closestXpPercent, // Higher progress = closer to completion = higher priority
        });
      }
    }

    // 2. Next dungeon unlock (hero slot, feature, or raid)
    const allUnlocks = [
      ...PARTY_SLOTS.slice(1).map(slot => ({
        name: `${slot.role.charAt(0).toUpperCase() + slot.role.slice(1)} Slot`,
        dungeonRequired: slot.dungeonRequired,
      })),
      { name: 'Shop', dungeonRequired: 5 },
      { name: 'Auto-Run', dungeonRequired: 5 },
      { name: 'Sunken Temple Raid', dungeonRequired: 12 },
      { name: 'Cursed Manor Raid', dungeonRequired: 18 },
      { name: 'Sky Fortress Raid', dungeonRequired: 24 },
      { name: 'The Abyss Raid', dungeonRequired: 30 },
    ];

    const nextUnlock = allUnlocks
      .filter(u => highestDungeonCleared < u.dungeonRequired)
      .sort((a, b) => a.dungeonRequired - b.dungeonRequired)[0];

    if (nextUnlock) {
      const dungeonsTilUnlock = nextUnlock.dungeonRequired - highestDungeonCleared;
      const progress = (highestDungeonCleared / nextUnlock.dungeonRequired) * 100;
      results.push({
        id: 'dungeon-unlock',
        icon: <LockIcon size={14} className="text-blue-400" />,
        text: `${dungeonsTilUnlock} more clear${dungeonsTilUnlock !== 1 ? 's' : ''} to ${nextUnlock.name}`,
        progress,
        priority: progress,
      });
    }

    // 3. Unique collection progress
    const totalUniques = getAllUniqueItems().length;
    const ownedCount = ownedUniques.length;
    if (totalUniques > 0 && ownedCount < totalUniques) {
      const progress = (ownedCount / totalUniques) * 100;
      results.push({
        id: 'unique-collection',
        icon: <ChestIcon size={14} className="text-purple-400" />,
        text: `${ownedCount} of ${totalUniques} unique items found`,
        progress,
        priority: progress * 0.5, // Lower priority than level-ups and unlocks
      });
    }

    // 4. Nearest affordable homestead upgrade
    if (homestead) {
      let cheapestUpgrade = null;
      let cheapestCost = Infinity;

      for (const [buildingId, building] of Object.entries(BUILDINGS)) {
        const currentLevel = homestead[buildingId] || 0;
        if (currentLevel >= building.maxLevel) continue;
        const cost = Math.floor(building.baseCost * Math.pow(building.costMultiplier, currentLevel));
        if (cost < cheapestCost) {
          cheapestCost = cost;
          cheapestUpgrade = { name: building.name, cost, currentLevel };
        }
      }

      if (cheapestUpgrade) {
        const progress = Math.min(100, (gold / cheapestUpgrade.cost) * 100);
        results.push({
          id: 'homestead-upgrade',
          icon: <GoldIcon size={14} />,
          text: `${cheapestUpgrade.cost - gold > 0 ? `${cheapestUpgrade.cost - gold} gold` : 'Ready!'} to ${cheapestUpgrade.name} Lv${cheapestUpgrade.currentLevel + 1}`,
          progress,
          priority: progress * 0.3, // Lower priority
        });
      }
    }

    // Sort by priority (highest first = closest to completion) and take top 3
    return results
      .sort((a, b) => b.priority - a.priority)
      .slice(0, MAX_MILESTONES);
  }, [heroes, highestDungeonCleared, ownedUniques, gold, homestead]);

  if (milestones.length === 0) return null;

  return (
    <div className="pixel-panel-dark p-3">
      <div className="flex items-center gap-1 mb-2">
        <StarIcon size={12} className="text-amber-400" />
        <span className="pixel-label text-xs">Milestones</span>
      </div>
      <div className="space-y-2">
        {milestones.map(milestone => (
          <div key={milestone.id}>
            <div className="flex items-center gap-2 text-xs mb-0.5">
              {milestone.icon}
              <span className="text-[var(--color-text-dim)] flex-1">{milestone.text}</span>
            </div>
            <div className="pixel-bar h-1.5">
              <div
                className="pixel-bar-fill"
                style={{ background: 'linear-gradient(180deg, #ffd700 0%, #cc9900 50%, #886600 100%)' }}
                style={{ width: `${Math.min(100, milestone.progress)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(MilestoneWidget);
