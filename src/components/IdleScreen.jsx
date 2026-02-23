import { useMemo } from 'react';
import { useGameStore, calculateSkillPoints, calculateUsedSkillPoints } from '../store/gameStore';
import { CLASSES, ROLE_INFO } from '../data/classes';
import { getWorldBossForLevel } from '../data/worldBosses';
import { RAIDS, isRaidUnlocked, RAID_DIFFICULTY_TIERS } from '../data/raids';
import { WorldBossIcon } from './icons/worldBosses';
import HeroIcon from './icons/HeroIcon';
import { RoleIcon } from './icons/ClassIcon';
import { CrownIcon, SwordIcon, ShieldIcon, HeartIcon, GoldIcon } from './icons/ui';

const HeroReadinessRow = ({ hero, onOpenModal }) => {
  const inventory = useGameStore(state => state.inventory);
  const compareToEquipped = useGameStore(state => state.compareToEquipped);

  const badges = useMemo(() => {
    const result = [];
    // Unspent skill points
    const totalSP = calculateSkillPoints(hero.level);
    const usedSP = calculateUsedSkillPoints(hero);
    const availSP = totalSP - usedSP;
    if (availSP > 0) {
      result.push({ type: 'skills', label: `${availSP} skill pt${availSP > 1 ? 's' : ''}`, color: 'text-yellow-400', symbol: '\u26A0', modal: 'heroes-skills' });
    }
    // Empty equipment slots
    const emptySlots = ['weapon', 'armor', 'accessory'].filter(s => !hero.equipment?.[s]);
    if (emptySlots.length > 0) {
      const shortLabel = emptySlots.length === 3 ? 'No gear' : `No ${emptySlots.join(', ')}`;
      result.push({ type: 'emptySlot', label: shortLabel, color: 'text-red-400', symbol: '\u25CB', modal: 'heroes-gear' });
    }
    // Upgrade available
    if (inventory && compareToEquipped) {
      const hasUpgrade = inventory.some(item => {
        const cmp = compareToEquipped(item, hero.id);
        return cmp?.isBetter;
      });
      if (hasUpgrade) {
        result.push({ type: 'upgrade', label: 'Better gear in bags', color: 'text-green-400', symbol: '\u25B2', modal: 'heroes-gear' });
      }
    }
    return result;
  }, [hero, inventory, compareToEquipped]);

  const heroClass = CLASSES[hero.classId];
  const heroRole = heroClass?.role;
  const roleInfo = heroRole ? ROLE_INFO[heroRole] : null;
  const isReady = badges.length === 0;

  return (
    <div className="flex items-center gap-2 py-1 px-2 rounded hover:bg-white/5 transition-colors">
      <HeroIcon classId={hero.classId} equipment={hero.equipment} size={16} />
      <div className="flex items-center gap-1 min-w-0 flex-1">
        <span className="text-xs text-white truncate">{hero.name}</span>
        <span className="text-[10px] text-yellow-400">Lv{hero.level || 1}</span>
        {roleInfo && (
          <span className="opacity-50" title={roleInfo.name}>
            <RoleIcon role={heroRole} size={10} />
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {isReady ? (
          <span className="text-[10px] text-green-400" title="Ready">{'\u2713'} Ready</span>
        ) : (
          badges.map(b => (
            <button
              key={b.type}
              onClick={() => onOpenModal(b.modal)}
              className={`text-[10px] ${b.color} hover:underline cursor-pointer flex items-center gap-0.5`}
              title={b.label}
            >
              <span>{b.symbol}</span>
              <span>{b.type === 'skills' ? b.label.split(' ')[0] + ' SP' : b.type === 'upgrade' ? 'Upgrade' : b.label}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

const IdleScreen = ({
  heroes,
  onStartDungeon,
  onOpenModal,
  lastDungeonSuccess,
  highestDungeonCleared,
  maxDungeonLevel,
  hasNewHeroSlotAvailable,
  upcomingUnlocks,
}) => {
  // All hooks must be called unconditionally (before any early returns)
  const raidPreferences = useGameStore(state => state.raidPreferences);
  const enterRaid = useGameStore(state => state.enterRaid);

  // Quick Raid: show if player has a last raid and it's still unlocked
  const quickRaid = useMemo(() => {
    if (!raidPreferences?.lastRaidId) return null;
    const raid = RAIDS[raidPreferences.lastRaidId];
    if (!raid) return null;
    if (!isRaidUnlocked(raidPreferences.lastRaidId, highestDungeonCleared)) return null;
    const difficulty = raidPreferences.lastRaidDifficulty || 'normal';
    const tier = RAID_DIFFICULTY_TIERS[difficulty];
    return { raid, difficulty, tierName: tier?.name || 'Normal', tierColor: tier?.color || '#9ca3af' };
  }, [raidPreferences, highestDungeonCleared]);

  // New player experience
  if (heroes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center pixel-panel p-8">
          <div className="text-6xl mb-4">
            <svg width="96" height="96" viewBox="0 0 16 16">
              <rect x="3" y="8" width="10" height="8" fill="#4a4a6a"/>
              <rect x="4" y="6" width="8" height="2" fill="#5a5a7a"/>
              <rect x="5" y="4" width="6" height="2" fill="#6a6a8a"/>
              <rect x="7" y="2" width="2" height="2" fill="#ffd700"/>
              <rect x="6" y="10" width="4" height="6" fill="#2a2a4a"/>
              <rect x="7" y="11" width="2" height="3" fill="#8b4513"/>
            </svg>
          </div>
          <h2 className="pixel-title text-2xl mb-2">Castles & Clickers</h2>
          <p className="text-[var(--color-text-dim)] mb-4">
            Recruit some heroes to begin your adventure!
          </p>
          <button
            onClick={() => onOpenModal('heroes')}
            className="pixel-btn pixel-btn-primary"
          >
            Recruit Heroes
          </button>
        </div>
      </div>
    );
  }

  // First adventure
  if (lastDungeonSuccess == null) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center pixel-panel p-8">
          <h2 className="pixel-title text-xl mb-2">Your heroes are ready!</h2>
          <p className="text-[var(--color-text-dim)] mb-4">
            Start your first adventure to explore the dungeon.
          </p>
          <button
            onClick={() => onStartDungeon(1)}
            className="pixel-btn pixel-btn-primary animate-pulse"
          >
            Start Your First Adventure!
          </button>
        </div>
      </div>
    );
  }

  // Party Dashboard
  const activeHeroes = heroes.filter(Boolean);
  const nextLevel = highestDungeonCleared + 1;
  const worldBoss = getWorldBossForLevel(nextLevel);

  return (
    <div className="flex-1 flex items-center justify-center p-2">
      <div className="w-full max-w-lg space-y-3">
        {/* Party Readiness */}
        <div className="pixel-panel p-3">
          <h3 className="pixel-subtitle mb-2">Party Readiness</h3>
          <div className="space-y-0.5">
            {activeHeroes.map(hero => (
              <HeroReadinessRow key={hero.id} hero={hero} onOpenModal={onOpenModal} />
            ))}
          </div>
          {hasNewHeroSlotAvailable && (
            <button
              onClick={() => onOpenModal('heroes')}
              className="mt-2 w-full px-3 py-1.5 bg-green-600/20 border border-green-500/50 rounded text-green-400 text-xs hover:bg-green-600/30 transition-colors"
            >
              New Hero Slot Available!
            </button>
          )}
        </div>

        {/* Next Target */}
        <div className="pixel-panel p-3">
          <h3 className="pixel-subtitle mb-2">Next Target</h3>

          {/* Status message */}
          <p className="text-[var(--color-text-dim)] text-xs mb-2">
            {lastDungeonSuccess === false
              ? 'Your heroes need to regroup and try again!'
              : 'Victory! Ready for the next challenge?'}
          </p>

          {/* World Boss preview */}
          {worldBoss && (
            <div className="mb-3 pixel-panel-dark p-3 border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CrownIcon size={14} className="text-amber-400" />
                <span className="text-amber-400 font-bold text-xs">WORLD BOSS</span>
              </div>
              <div className="flex items-center gap-3">
                <WorldBossIcon bossId={worldBoss.id} size={48} />
                <div className="flex-1">
                  <div className="text-amber-300 font-bold text-sm">{worldBoss.name}</div>
                  <div className="text-[10px] text-amber-400/70 italic mb-1">"{worldBoss.title}"</div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                    <div className="flex items-center gap-1 text-red-400">
                      <SwordIcon size={10} /> {worldBoss.baseStats.attack}
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <ShieldIcon size={10} /> {worldBoss.baseStats.defense}
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <HeartIcon size={10} /> {worldBoss.baseStats.maxHp}
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <GoldIcon size={10} /> {worldBoss.goldReward.min}-{worldBoss.goldReward.max}
                    </div>
                  </div>
                </div>
              </div>
              {worldBoss.uniqueDrop ? (
                <div className="mt-1.5 text-[10px] text-center text-cyan-400">
                  Unique item drop
                </div>
              ) : worldBoss.guaranteedRarity && (
                <div className="mt-1.5 text-[10px] text-center text-purple-400">
                  Guaranteed {worldBoss.guaranteedRarity}+ gear drop
                </div>
              )}
            </div>
          )}

          {/* Upcoming unlock */}
          {!hasNewHeroSlotAvailable && upcomingUnlocks && (
            <div className="mb-3 px-3 py-2 bg-blue-600/10 border border-blue-500/20 rounded text-xs">
              <span className="text-blue-300">
                Clear D{upcomingUnlocks.dungeonRequired} {'\u2192'}{' '}
                {upcomingUnlocks.unlocks.map((u, i) => (
                  <span key={i}>
                    {i > 0 && ', '}
                    {u.type === 'raid' ? <span className="text-amber-400">{u.name} (Raid)</span> : u.name}
                  </span>
                ))}
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {highestDungeonCleared < maxDungeonLevel && (
              <button
                onClick={() => onStartDungeon(highestDungeonCleared + 1)}
                className="pixel-btn pixel-btn-primary w-full"
              >
                {lastDungeonSuccess === false ? 'Retry' : 'Continue to'} Level {highestDungeonCleared + 1}
              </button>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => onOpenModal('dungeonSelect')}
                className="pixel-btn pixel-btn-secondary flex-1"
              >
                Select Dungeon
              </button>
              {highestDungeonCleared >= 12 && (
                <button
                  onClick={() => onOpenModal('raids')}
                  className="pixel-btn pixel-btn-secondary flex-1 flex items-center justify-center gap-1"
                >
                  <CrownIcon size={14} className="text-amber-400" />
                  <span>Raids</span>
                </button>
              )}
            </div>
            {quickRaid && (
              <button
                onClick={() => enterRaid(quickRaid.raid.id, quickRaid.difficulty)}
                className="pixel-btn w-full flex items-center justify-center gap-2 text-sm"
                style={{ borderColor: quickRaid.tierColor }}
              >
                <CrownIcon size={14} style={{ color: quickRaid.tierColor }} />
                <span>
                  Quick Raid: {quickRaid.raid.name}
                  {quickRaid.difficulty !== 'normal' && (
                    <span className="ml-1" style={{ color: quickRaid.tierColor }}>
                      ({quickRaid.tierName})
                    </span>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdleScreen;
