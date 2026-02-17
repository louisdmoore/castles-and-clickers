import { memo, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { CLASSES } from '../data/classes';
import { getDungeonTier } from '../data/milestones';
import { DUNGEON_THEMES } from '../data/dungeonThemes';
import { getAffix } from '../data/itemAffixes';
import { getWorldBossForLevel } from '../data/worldBosses';
import ClassIcon from './icons/ClassIcon';
import { SwordIcon, ShieldIcon, HeartIcon, CrownIcon, ChestIcon } from './icons/ui';
import MilestoneWidget from './MilestoneWidget';

const PrepScreen = () => {
  const prepPhase = useGameStore(state => state.prepPhase);
  const heroes = useGameStore(state => state.heroes);
  const autoAdvance = useGameStore(state => state.dungeonSettings?.autoAdvance);
  const lastRunSummary = useGameStore(state => state.lastRunSummary);
  const startFromPrepPhase = useGameStore(state => state.startFromPrepPhase);
  const dismissPrepPhase = useGameStore(state => state.dismissPrepPhase);
  const maxDungeonLevel = useGameStore(state => state.maxDungeonLevel);
  const dungeonSettings = useGameStore(state => state.dungeonSettings);
  const highestDungeonCleared = useGameStore(state => state.highestDungeonCleared);

  // Auto-dismiss after 5s when auto-advance is on and run summary is gone
  useEffect(() => {
    if (!prepPhase || !autoAdvance || lastRunSummary) return;
    // Check target level cap
    const atTargetLevel = dungeonSettings?.targetLevel && prepPhase.nextLevel > dungeonSettings.targetLevel;
    if (atTargetLevel) return;
    // Don't auto-advance past max dungeon level
    if (prepPhase.nextLevel > maxDungeonLevel) return;

    const timer = setTimeout(startFromPrepPhase, 5000);
    return () => clearTimeout(timer);
  }, [prepPhase, autoAdvance, lastRunSummary, startFromPrepPhase, maxDungeonLevel, dungeonSettings]);

  const handleEnterDungeon = useCallback(() => {
    startFromPrepPhase();
  }, [startFromPrepPhase]);

  const handleDismiss = useCallback(() => {
    dismissPrepPhase();
  }, [dismissPrepPhase]);

  // Compute dungeon preview info
  const dungeonPreview = useMemo(() => {
    if (!prepPhase) return null;
    const level = prepPhase.nextLevel;
    const tier = getDungeonTier(level);
    const theme = DUNGEON_THEMES[tier.theme];
    const totalRooms = 5 + Math.floor(level / 2);
    const worldBoss = getWorldBossForLevel(level);

    // Resolve favored affix names
    const favoredAffixes = (theme?.favoredAffixes || []).map(id => {
      const affix = getAffix(id);
      return affix ? affix.name : id;
    });

    return { level, tier, theme, totalRooms, worldBoss, favoredAffixes };
  }, [prepPhase]);

  // Don't render if no prep phase or run summary is still showing
  if (!prepPhase || lastRunSummary) return null;

  const activeHeroes = heroes.filter(Boolean);
  const canEnter = activeHeroes.length > 0 && prepPhase.nextLevel <= maxDungeonLevel;
  const atMaxLevel = prepPhase.nextLevel > maxDungeonLevel;

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="pixel-panel p-6 max-w-lg w-full mx-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="pixel-title text-xl mb-1">
            {atMaxLevel
              ? 'All Dungeons Cleared!'
              : prepPhase.success
              ? `Prepare for D${dungeonPreview?.level}`
              : `Retry D${dungeonPreview?.level}`}
          </h2>
          {dungeonPreview && !atMaxLevel && (
            <div className="pixel-label" style={{ color: dungeonPreview.tier.color }}>
              {dungeonPreview.tier.name}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Party Overview */}
          <div className="pixel-panel-dark p-3">
            <div className="pixel-label text-xs mb-2">Party</div>
            {activeHeroes.map(hero => {
              const cls = CLASSES[hero.classId];
              const role = cls?.role || 'dps';
              const RoleIcon = role === 'tank' ? ShieldIcon : role === 'healer' ? HeartIcon : SwordIcon;
              return (
                <div key={hero.id} className="flex items-center gap-2 mb-1.5 text-sm">
                  <ClassIcon classId={hero.classId} size={16} />
                  <span className="pixel-label text-xs truncate flex-1">{hero.name}</span>
                  <span className="text-xs text-[var(--color-text-dim)]">Lv{hero.level}</span>
                  <RoleIcon size={10} className={
                    role === 'tank' ? 'text-blue-400' : role === 'healer' ? 'text-green-400' : 'text-red-400'
                  } />
                </div>
              );
            })}
            {activeHeroes.length === 0 && (
              <div className="text-xs text-[var(--color-text-dim)]">No heroes recruited</div>
            )}
          </div>

          {/* Dungeon Preview */}
          {dungeonPreview && !atMaxLevel && (
            <div className="pixel-panel-dark p-3">
              <div className="pixel-label text-xs mb-2">Dungeon Info</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-dim)]">Level</span>
                  <span>{dungeonPreview.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-dim)]">Theme</span>
                  <span style={{ color: dungeonPreview.tier.color }}>{dungeonPreview.theme?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-dim)]">Rooms</span>
                  <span>{dungeonPreview.totalRooms}</span>
                </div>
                {dungeonPreview.worldBoss && (
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--color-text-dim)]">Boss</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <CrownIcon size={10} />
                      {dungeonPreview.worldBoss.name}
                    </span>
                  </div>
                )}
                {dungeonPreview.favoredAffixes.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-1 mb-1">
                      <ChestIcon size={10} />
                      <span className="text-[var(--color-text-dim)]">Favored Drops</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dungeonPreview.favoredAffixes.map(name => (
                        <span key={name} className="px-1.5 py-0.5 bg-[var(--color-panel)] rounded text-[10px]" style={{ color: dungeonPreview.tier.color }}>
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Max level reached panel */}
          {atMaxLevel && (
            <div className="pixel-panel-dark p-3 flex items-center justify-center">
              <div className="text-center">
                <div className="pixel-label text-xs mb-1">Max Level Reached</div>
                <div className="text-xs text-[var(--color-text-dim)]">
                  Select a dungeon to replay
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Milestone widget */}
        <div className="mb-4">
          <MilestoneWidget />
        </div>

        {/* Auto-advance indicator */}
        {autoAdvance && canEnter && (
          <div className="text-center mb-3">
            <span className="pixel-label text-xs" style={{ color: 'var(--color-text-dim)' }}>
              Auto-advancing in 5s...
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          {canEnter && (
            <button onClick={handleEnterDungeon} className="pixel-btn pixel-btn-primary">
              {prepPhase.success ? 'Enter Dungeon' : 'Retry Dungeon'}
            </button>
          )}
          <button onClick={handleDismiss} className="pixel-btn pixel-btn-secondary">
            {canEnter ? 'Back to Menu' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(PrepScreen);
