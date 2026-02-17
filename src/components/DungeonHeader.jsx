import { DUNGEON_TIERS } from '../data/milestones';
import { RAIDS, RAID_DIFFICULTY_TIERS } from '../data/raids';
import { getWorldBossForLevel, getZoneWorldBoss } from '../data/worldBosses';
import { PHASES } from '../game/constants';
import {
  CrownIcon, SkullIcon, LockIcon,
  GemIcon, TreeIcon, CastleIcon, FireIcon, GhostIcon,
} from './icons/ui';
import { WorldBossIcon } from './icons/worldBosses';

const TIER_THEME_ICONS = {
  cave: GemIcon,
  crypt: SkullIcon,
  forest: TreeIcon,
  castle: CastleIcon,
  volcano: FireIcon,
  void: GhostIcon,
};

const TIER_THEME_COLORS = {
  cave: '#06b6d4',
  crypt: '#84cc16',
  forest: '#22c55e',
  castle: '#f59e0b',
  volcano: '#ef4444',
  void: '#a855f7',
};

const DungeonHeader = ({ dungeon, phase, enemyCount, displayRoomCombat, highestDungeonCleared, raidState, upcomingUnlocks }) => {
  const currentTier = DUNGEON_TIERS.find(
    t => dungeon.level >= t.minLevel && dungeon.level <= t.maxLevel
  ) || DUNGEON_TIERS[0];
  const TierIcon = TIER_THEME_ICONS[currentTier.theme];
  const tierColor = TIER_THEME_COLORS[currentTier.theme];
  const tierSize = currentTier.maxLevel - currentTier.minLevel + 1;

  const totalMonsters = enemyCount.total;
  const killedMonsters = totalMonsters - enemyCount.alive;

  const monsters = displayRoomCombat?.monsters || [];
  const boss = monsters.find(m => m.isBoss);
  const bossAlive = boss && boss.stats.hp > 0;
  const bossUnlocked = enemyCount.alive === 0 && totalMonsters > 0;

  const getPhaseDisplay = () => {
    switch (phase) {
      case PHASES.EXPLORING: return { text: 'Exploring', color: 'text-blue-400' };
      case PHASES.COMBAT: return { text: 'In Combat', color: 'text-red-400' };
      case PHASES.COMPLETE: return { text: 'Complete!', color: 'text-green-400' };
      case PHASES.DEFEAT: return { text: 'Defeated', color: 'text-red-500' };
      default: return { text: 'Idle', color: 'text-gray-400' };
    }
  };
  const phaseInfo = getPhaseDisplay();

  const isRaidDungeon = dungeon.isRaid && dungeon.raidId;
  const raidData = isRaidDungeon ? RAIDS[dungeon.raidId] : null;

  const zoneBoss = !isRaidDungeon ? getZoneWorldBoss(dungeon.level) : null;
  const zoneBossDefeated = zoneBoss && highestDungeonCleared >= zoneBoss.level;

  return (
    <div className="pixel-panel mb-3" style={isRaidDungeon ? { borderColor: '#f59e0b' } : {}}>
      <div className="flex items-center gap-4 px-3 py-2">
        {/* Zone World Boss Mascot */}
        {!isRaidDungeon && zoneBoss && (
          <div className={`flex items-center gap-2 px-2 py-1 rounded border ${
            zoneBossDefeated
              ? 'border-green-500/40 bg-green-900/20'
              : 'border-amber-500/40 bg-amber-900/20'
          }`}>
            <WorldBossIcon bossId={zoneBoss.id} size={28} />
            <div className="text-[10px] leading-tight">
              <div className="text-gray-500">World Boss:</div>
              <div className={zoneBossDefeated ? 'text-green-400' : 'text-amber-400'}>
                {zoneBoss.name}
              </div>
              <div className="text-gray-500">
                {zoneBossDefeated ? 'Defeated' : `Lv ${zoneBoss.level}`}
              </div>
            </div>
          </div>
        )}

        {/* Raid name OR Zone icon and name */}
        {isRaidDungeon && raidData ? (() => {
          const raidDiff = dungeon.raidDifficulty || 'normal';
          const diffTier = RAID_DIFFICULTY_TIERS[raidDiff];
          return (
            <div className="flex items-center gap-2">
              <CrownIcon size={24} className="text-amber-400" />
              <div>
                <div className="pixel-text font-bold text-amber-400">
                  {raidData.name}
                  {raidDiff !== 'normal' && (
                    <span className="text-xs ml-1.5 font-normal" style={{ color: diffTier?.color }}>
                      [{diffTier?.name}]
                    </span>
                  )}
                </div>
                <div className="pixel-label">
                  Raid{raidDiff !== 'normal' ? ` · ${diffTier?.statMultiplier}x` : ''}
                </div>
              </div>
            </div>
          );
        })() : (
          <div className="flex items-center gap-2">
            <div style={{ color: tierColor }}>
              <TierIcon size={24} />
            </div>
            <div>
              <div className="pixel-text font-bold" style={{ color: tierColor }}>
                {currentTier.name}
              </div>
              <div className="pixel-label">
                {dungeon.isTower ? `Tower Floor ${dungeon.towerFloor}` : `Level ${dungeon.level}`}
              </div>
            </div>
          </div>
        )}

        {/* Tier progress mini-bar */}
        {!isRaidDungeon && (
          <div className="flex gap-1">
            {Array.from({ length: tierSize }, (_, i) => {
              const level = currentTier.minLevel + i;
              const isCurrent = level === dungeon.level;
              const isCleared = level < dungeon.level || (level === dungeon.level && phase === PHASES.COMPLETE);
              return (
                <div
                  key={level}
                  className="w-4 h-2 border border-[var(--color-border)]"
                  style={{
                    background: isCleared ? tierColor : isCurrent ? `${tierColor}60` : 'var(--color-panel-dark)',
                  }}
                  title={`Level ${level}${isCleared ? ' (Cleared)' : isCurrent ? ' (Current)' : ''}`}
                />
              );
            })}
          </div>
        )}

        {/* Next unlock indicator */}
        {!isRaidDungeon && upcomingUnlocks && (() => {
          const isCurrentLevel = dungeon.level === upcomingUnlocks.dungeonRequired;
          return (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
              isCurrentLevel
                ? 'bg-green-900/30 border border-green-500/50 animate-pulse'
                : 'bg-blue-900/30 border border-blue-500/30'
            }`}>
              <LockIcon size={12} className={isCurrentLevel ? 'text-green-400' : 'text-blue-400'} />
              <span className={isCurrentLevel ? 'text-green-300' : 'text-blue-300'}>
                {isCurrentLevel ? 'Unlocking Now!' : `Next Unlock at Lv ${upcomingUnlocks.dungeonRequired}`}:{' '}
                {upcomingUnlocks.unlocks.map((u, i) => (
                  <span key={i}>
                    {i > 0 && ', '}
                    {u.type === 'raid' ? (
                      <><span className="text-amber-400">(Raid)</span> {u.name}</>
                    ) : u.name}
                  </span>
                ))}
              </span>
            </div>
          );
        })()}

        {/* Phase indicator */}
        <div className={`pixel-label ${phaseInfo.color}`}>
          {phaseInfo.text}
        </div>

        {/* Enemy progress */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="pixel-label">
            Enemies: {killedMonsters}/{totalMonsters}
          </span>
          <div className="pixel-bar w-20 h-2">
            <div
              className="pixel-bar-fill pixel-bar-red"
              style={{ width: `${totalMonsters > 0 ? (killedMonsters / totalMonsters) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Boss indicator */}
        {!isRaidDungeon && boss && (() => {
          const worldBoss = getWorldBossForLevel(dungeon.level);
          const isWorldBoss = boss.isWorldBoss || worldBoss;

          return (
            <div className={`flex items-center gap-1.5 ${
              bossUnlocked
                ? isWorldBoss ? 'text-amber-400' : 'text-red-400'
                : 'text-gray-500'
            }`}>
              {isWorldBoss ? (
                <CrownIcon size={16} />
              ) : (
                <SkullIcon size={16} />
              )}
              <span className="pixel-label">
                {bossAlive
                  ? (bossUnlocked
                      ? (isWorldBoss ? worldBoss?.name || 'World Boss' : 'Boss Ready')
                      : 'Locked')
                  : (isWorldBoss ? `${worldBoss?.name || 'World Boss'} Slain!` : 'Slain!')
                }
              </span>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default DungeonHeader;
