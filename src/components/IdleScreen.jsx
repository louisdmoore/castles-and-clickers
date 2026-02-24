import { useMemo, useState, useEffect, useCallback, memo } from 'react';
import { useGameStore, calculateSkillPoints, calculateUsedSkillPoints } from '../store/gameStore';
import { CLASSES, ROLE_INFO } from '../data/classes';
import { getWorldBossForLevel } from '../data/worldBosses';
import { RAIDS, isRaidUnlocked, RAID_DIFFICULTY_TIERS } from '../data/raids';
import { getBuildingList, getUpgradeCost } from '../data/homestead';
import { getDungeonTier } from '../data/milestones';
import { DUNGEON_THEMES } from '../data/dungeonThemes';
import { getAffix } from '../data/itemAffixes';
import { DIFFICULTY_STOPS, getDifficultyInfo, DIFFICULTY_UNLOCK_LEVEL } from '../data/difficulty';
import { WorldBossIcon } from './icons/worldBosses';
import HeroIcon from './icons/HeroIcon';
import { RoleIcon } from './icons/ClassIcon';
import { CrownIcon, SwordIcon, ShieldIcon, HeartIcon, GoldIcon, HomeIcon, ChestIcon, StarIcon } from './icons/ui';

// Difficulty override panel (from PrepScreen — per-run difficulty adjustment)
const DifficultyOverridePanel = memo(({ globalDifficulty, difficultyOverride, setDifficultyOverride, clearDifficultyOverride }) => {
  const [showSlider, setShowSlider] = useState(difficultyOverride !== null);
  const effectiveValue = difficultyOverride ?? globalDifficulty;
  const stopIndex = DIFFICULTY_STOPS.indexOf(effectiveValue);
  const info = getDifficultyInfo(effectiveValue);
  const globalInfo = getDifficultyInfo(globalDifficulty);
  const hasOverride = difficultyOverride !== null;

  const handleChange = useCallback((e) => {
    const idx = parseInt(e.target.value, 10);
    setDifficultyOverride(DIFFICULTY_STOPS[idx]);
  }, [setDifficultyOverride]);

  const handleReset = useCallback(() => {
    clearDifficultyOverride();
    setShowSlider(false);
  }, [clearDifficultyOverride]);

  return (
    <div className="pixel-panel-dark p-3 mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="pixel-label text-xs">Difficulty</span>
        <span className="pixel-label text-xs font-bold" style={{ color: info.color }}>
          {info.label} ({effectiveValue}x)
        </span>
      </div>
      {!showSlider ? (
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[var(--color-text-dim)]">
            Using global: <span style={{ color: globalInfo.color }}>{globalInfo.label}</span>
          </span>
          <button
            onClick={() => setShowSlider(true)}
            className="text-[10px] text-blue-400 hover:text-blue-300 underline"
          >
            Override for this run
          </button>
        </div>
      ) : (
        <>
          <input
            type="range"
            min={0}
            max={DIFFICULTY_STOPS.length - 1}
            step={1}
            value={stopIndex >= 0 ? stopIndex : 0}
            onChange={handleChange}
            className="w-full accent-current"
            style={{ accentColor: info.color }}
            aria-label={`Difficulty override: ${info.label}`}
          />
          <div className="flex justify-between text-[10px] text-[var(--color-text-dim)] mt-1">
            {DIFFICULTY_STOPS.map(s => (
              <span key={s} style={s === effectiveValue ? { color: info.color, fontWeight: 'bold' } : undefined}>{s}x</span>
            ))}
          </div>
          <div className="text-[10px] text-[var(--color-text-dim)] mt-1 text-center">{info.desc}</div>
          <div className="flex items-center justify-between mt-2">
            {hasOverride ? (
              <span className="text-[10px] text-amber-400">Override active (this run only)</span>
            ) : (
              <span className="text-[10px] text-[var(--color-text-dim)]">Matches global setting</span>
            )}
            <button
              onClick={handleReset}
              className="text-[10px] text-gray-400 hover:text-gray-300 underline"
            >
              Reset to global
            </button>
          </div>
        </>
      )}
    </div>
  );
});

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
  const gold = useGameStore(state => state.gold);
  const homestead = useGameStore(state => state.homestead);
  const upgradeBuilding = useGameStore(state => state.upgradeBuilding);
  const stats = useGameStore(state => state.stats);
  const ascensionCount = useGameStore(state => state.ascension?.count || 0);

  // PrepScreen state (merged)
  const prepPhase = useGameStore(state => state.prepPhase);
  const lastRunSummary = useGameStore(state => state.lastRunSummary);
  const startFromPrepPhase = useGameStore(state => state.startFromPrepPhase);
  const dismissPrepPhase = useGameStore(state => state.dismissPrepPhase);
  const globalDifficulty = useGameStore(state => state.globalDifficulty ?? 1.0);
  const difficultyOverride = useGameStore(state => state.difficultyOverride);
  const setDifficultyOverride = useGameStore(state => state.setDifficultyOverride);
  const clearDifficultyOverride = useGameStore(state => state.clearDifficultyOverride);
  const canAscend = useGameStore(state => state.canAscend);
  const ascension = useGameStore(state => state.ascension);
  const dungeonSettings = useGameStore(state => state.dungeonSettings);

  // Auto-advance timer (from PrepScreen)
  useEffect(() => {
    if (!prepPhase || !dungeonSettings?.autoAdvance || lastRunSummary) return;
    const atTargetLevel = dungeonSettings?.targetLevel && prepPhase.nextLevel > dungeonSettings.targetLevel;
    if (atTargetLevel) return;
    if (prepPhase.nextLevel > maxDungeonLevel) return;

    const timer = setTimeout(startFromPrepPhase, 5000);
    return () => clearTimeout(timer);
  }, [prepPhase, dungeonSettings, lastRunSummary, startFromPrepPhase, maxDungeonLevel]);

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

  // Find cheapest affordable homestead upgrade
  const cheapestUpgrade = useMemo(() => {
    if (highestDungeonCleared < 3) return null;
    const buildings = getBuildingList();
    let cheapest = null;
    for (const building of buildings) {
      const level = homestead?.[building.id] || 0;
      const cost = getUpgradeCost(building, level);
      if (cost <= gold && (!cheapest || cost < cheapest.cost)) {
        cheapest = { building, cost, level };
      }
    }
    return cheapest;
  }, [highestDungeonCleared, homestead, gold]);

  // Dungeon preview for prepPhase
  const dungeonPreview = useMemo(() => {
    if (!prepPhase) return null;
    const level = prepPhase.nextLevel;
    const tier = getDungeonTier(level);
    const theme = DUNGEON_THEMES[tier.theme];
    const totalRooms = 5 + Math.floor(level / 2);
    const worldBoss = getWorldBossForLevel(level);
    const favoredAffixes = (theme?.favoredAffixes || []).map(id => {
      const affix = getAffix(id);
      return affix ? affix.name : id;
    });
    return { level, tier, theme, totalRooms, worldBoss, favoredAffixes };
  }, [prepPhase]);

  // Party power assessment for prepPhase
  const partyPower = useMemo(() => {
    if (!prepPhase || !dungeonPreview) return null;
    const active = heroes.filter(Boolean);
    if (active.length === 0) return null;
    const totalAttack = active.reduce((sum, hero) => {
      const cls = CLASSES[hero.classId];
      if (!cls) return sum;
      return sum + cls.baseStats.attack + cls.growthPerLevel.attack * (hero.level - 1);
    }, 0);
    const effectiveDifficulty = difficultyOverride ?? globalDifficulty;
    const estimatedDifficulty = dungeonPreview.level * 15 * effectiveDifficulty;
    const ratio = totalAttack / Math.max(1, estimatedDifficulty);
    if (ratio >= 1.5) return { color: '#22c55e', label: 'Strong' };
    if (ratio >= 1.0) return { color: '#fbbf24', label: 'Fair' };
    if (ratio >= 0.7) return { color: '#f97316', label: 'Tough' };
    return { color: '#ef4444', label: 'Dangerous' };
  }, [heroes, prepPhase, dungeonPreview, globalDifficulty, difficultyOverride]);

  // Prep phase state
  const showPrepCard = prepPhase && !lastRunSummary;
  const atMaxLevel = prepPhase && prepPhase.nextLevel > maxDungeonLevel;
  const canEnter = heroes.filter(Boolean).length > 0 && prepPhase && prepPhase.nextLevel <= maxDungeonLevel;

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
  if (lastDungeonSuccess == null && !prepPhase) {
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
    <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto p-2">
      <div className="w-full max-w-lg space-y-3">
        {/* Journey Progress */}
        <button
          onClick={() => onOpenModal('dungeonSelect')}
          className="w-full pixel-panel-dark px-3 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors cursor-pointer"
          title="Open dungeon map"
        >
          <span className="text-[10px] text-gray-400 flex-shrink-0">Journey</span>
          <div className="flex-1 pixel-bar h-2">
            <div
              className="pixel-bar-fill pixel-bar-hp"
              style={{ width: `${maxDungeonLevel > 0 ? (highestDungeonCleared / maxDungeonLevel) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[10px] text-[var(--color-gold)] tabular-nums flex-shrink-0">
            {highestDungeonCleared}/{maxDungeonLevel}
          </span>
          {ascensionCount > 0 && (
            <span className="text-[10px] text-amber-400 flex-shrink-0">A{ascensionCount}</span>
          )}
        </button>

        {/* Next Dungeon card (when prepPhase is active) */}
        {showPrepCard && (
          <div className="pixel-panel p-3">
            {/* Header */}
            <h3 className="pixel-subtitle mb-2 text-center">
              {atMaxLevel
                ? 'All Dungeons Cleared!'
                : prepPhase.success
                ? `Prepare for D${dungeonPreview?.level}`
                : `Retry D${dungeonPreview?.level}`}
            </h3>

            {atMaxLevel ? (
              /* Ascension panel */
              <div className="text-center">
                {canAscend() ? (
                  <>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <StarIcon size={14} />
                      <span className="pixel-label text-xs" style={{ color: '#f59e0b' }}>Ready to Ascend!</span>
                    </div>
                    <div className="text-xs text-[var(--color-text-dim)] mb-2">
                      Permanent +{((ascension?.count || 0) + 1) * 10}% all stats
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => onOpenModal('ascension')}
                        className="pixel-btn text-xs"
                        style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                      >
                        <span className="flex items-center gap-1">
                          <StarIcon size={10} />
                          Ascend to A{(ascension?.count || 0) + 1}
                        </span>
                      </button>
                      <button onClick={dismissPrepPhase} className="pixel-btn pixel-btn-secondary text-xs">
                        Continue
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-[var(--color-text-dim)] mb-2">
                      Select a dungeon to replay
                    </div>
                    <button onClick={dismissPrepPhase} className="pixel-btn pixel-btn-secondary text-xs">
                      Continue
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* Dungeon preview + actions */
              <>
                {dungeonPreview && (
                  <div className="pixel-panel-dark p-2 space-y-1.5 text-xs">
                    {/* Theme + tier */}
                    <div className="text-center">
                      <span style={{ color: dungeonPreview.tier.color }}>{dungeonPreview.theme?.name}</span>
                    </div>

                    {/* Compact info row */}
                    <div className="flex items-center justify-center gap-3 text-[var(--color-text-dim)]">
                      <span>{dungeonPreview.totalRooms} rooms</span>
                      {dungeonPreview.worldBoss && (
                        <span className="flex items-center gap-1 text-amber-400">
                          <CrownIcon size={10} />
                          {dungeonPreview.worldBoss.name}
                        </span>
                      )}
                    </div>

                    {/* Party power */}
                    {partyPower && (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-[var(--color-text-dim)]">Party Power:</span>
                        <span className="font-bold" style={{ color: partyPower.color }}>
                          {partyPower.label}
                        </span>
                      </div>
                    )}

                    {/* Favored drops */}
                    {highestDungeonCleared >= 20 && dungeonPreview.favoredAffixes.length > 0 && (
                      <div className="flex items-center justify-center gap-1 pt-1 border-t border-[var(--color-border)]">
                        <ChestIcon size={10} className="text-[var(--color-text-dim)]" />
                        <span className="text-[10px] text-[var(--color-text-dim)]">Favored:</span>
                        {dungeonPreview.favoredAffixes.map(name => (
                          <span key={name} className="text-[10px]" style={{ color: dungeonPreview.tier.color }}>
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Difficulty override (unlocks at D10) */}
                {highestDungeonCleared >= DIFFICULTY_UNLOCK_LEVEL && (
                  <DifficultyOverridePanel
                    globalDifficulty={globalDifficulty}
                    difficultyOverride={difficultyOverride}
                    setDifficultyOverride={setDifficultyOverride}
                    clearDifficultyOverride={clearDifficultyOverride}
                  />
                )}

                {/* Auto-advance indicator */}
                {dungeonSettings?.autoAdvance && canEnter && (
                  <div className="text-center mt-2">
                    <span className="text-[10px] text-[var(--color-text-dim)]">
                      Auto-advancing in 5s...
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-3 justify-center mt-3">
                  {canEnter && (
                    <button onClick={startFromPrepPhase} className="pixel-btn pixel-btn-primary text-sm">
                      {prepPhase.success ? 'Enter Dungeon' : 'Retry Dungeon'}
                    </button>
                  )}
                  <button onClick={dismissPrepPhase} className="pixel-btn pixel-btn-secondary text-sm">
                    Dismiss
                  </button>
                </div>
              </>
            )}
          </div>
        )}

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

        {/* Next Target (only when not in prepPhase) */}
        {!showPrepCard && (
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
        )}

        {/* Homestead Quick Upgrade */}
        {cheapestUpgrade && (
          <div className="pixel-panel-dark p-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <HomeIcon size={14} className="text-amber-400 flex-shrink-0" />
                <span className="text-xs text-gray-300 truncate">
                  {cheapestUpgrade.building.name} Lv{cheapestUpgrade.level + 1}
                </span>
                <span className="text-[10px] text-[var(--color-gold)] flex-shrink-0">
                  {cheapestUpgrade.cost.toLocaleString()}g
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => upgradeBuilding(cheapestUpgrade.building.id)}
                  className="pixel-btn pixel-btn-primary text-[10px] px-2 py-0.5"
                >
                  Upgrade
                </button>
                <button
                  onClick={() => onOpenModal('homestead')}
                  className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
                >
                  View All {'\u2192'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Journey Stats */}
        {stats && (
          <div className="text-center text-[10px] text-[var(--color-text-dark)]">
            {(stats.totalDungeonsCleared || 0).toLocaleString()} dungeons
            {' \u00B7 '}
            {(stats.totalMonstersKilled || 0).toLocaleString()} monsters
            {' \u00B7 '}
            {(stats.totalGoldEarned || 0).toLocaleString()}g earned
          </div>
        )}
      </div>
    </div>
  );
};

export default IdleScreen;
