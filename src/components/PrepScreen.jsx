import { memo, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { CLASSES } from '../data/classes';
import { getDungeonTier } from '../data/milestones';
import { DUNGEON_THEMES } from '../data/dungeonThemes';
import { getAffix } from '../data/itemAffixes';
import { getWorldBossForLevel } from '../data/worldBosses';
import { hasAscensionUnlock } from '../data/ascensionMilestones';
import ClassIcon from './icons/ClassIcon';
import { SwordIcon, ShieldIcon, HeartIcon, CrownIcon, ChestIcon, StarIcon } from './icons/ui';
import MilestoneWidget from './MilestoneWidget';

const DIFFICULTY_STOPS = [1.0, 1.5, 2.0, 2.5, 3.0];

const DIFFICULTY_INFO = {
  1.0: { label: 'Normal', color: '#9ca3af', desc: 'Standard difficulty' },
  1.5: { label: 'Hard', color: '#fbbf24', desc: '+50% enemy stats, +50% drop rate' },
  2.0: { label: 'Brutal', color: '#f97316', desc: '+100% enemy stats, +100% drops, Infused gear, +1 dungeon affix' },
  2.5: { label: 'Nightmare', color: '#ef4444', desc: '+150% enemy stats, +150% drops, higher Infused rate, +1-2 affixes' },
  3.0: { label: 'Mythic', color: '#a855f7', desc: '+200% enemy stats, +200% drops, Ascended gear, +2 affixes' },
};

const DifficultySlider = memo(({ value, onChange }) => {
  const stopIndex = DIFFICULTY_STOPS.indexOf(value);
  const info = DIFFICULTY_INFO[value] || DIFFICULTY_INFO[1.0];

  const handleChange = useCallback((e) => {
    const idx = parseInt(e.target.value, 10);
    onChange(DIFFICULTY_STOPS[idx]);
  }, [onChange]);

  return (
    <div className="pixel-panel-dark p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="pixel-label text-xs">Difficulty</span>
        <span className="pixel-label text-xs font-bold" style={{ color: info.color }}>
          {info.label} ({value}x)
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={DIFFICULTY_STOPS.length - 1}
        step={1}
        value={stopIndex >= 0 ? stopIndex : 0}
        onChange={handleChange}
        className="w-full accent-current"
        style={{ accentColor: info.color }}
        aria-label={`Difficulty: ${info.label}`}
      />
      <div className="flex justify-between text-[10px] text-[var(--color-text-dim)] mt-1">
        {DIFFICULTY_STOPS.map(s => (
          <span key={s} style={s === value ? { color: info.color, fontWeight: 'bold' } : undefined}>{s}x</span>
        ))}
      </div>
      <div className="text-[10px] text-[var(--color-text-dim)] mt-1 text-center">{info.desc}</div>
    </div>
  );
});

const PrepScreen = ({ onOpenAscension }) => {
  const prepPhase = useGameStore(state => state.prepPhase);
  const heroes = useGameStore(state => state.heroes);
  const autoAdvance = useGameStore(state => state.dungeonSettings?.autoAdvance);
  const lastRunSummary = useGameStore(state => state.lastRunSummary);
  const startFromPrepPhase = useGameStore(state => state.startFromPrepPhase);
  const dismissPrepPhase = useGameStore(state => state.dismissPrepPhase);
  const maxDungeonLevel = useGameStore(state => state.maxDungeonLevel);
  const dungeonSettings = useGameStore(state => state.dungeonSettings);
  const setDungeonSettings = useGameStore(state => state.setDungeonSettings);
  const highestDungeonCleared = useGameStore(state => state.highestDungeonCleared);
  const canAscend = useGameStore(state => state.canAscend);
  const ascension = useGameStore(state => state.ascension);
  const challengeScores = useGameStore(state => state.challengeScores);
  const startTowerOfTrials = useGameStore(state => state.startTowerOfTrials);
  const canAccessTower = hasAscensionUnlock(ascension?.count || 0, 'challenge_access');

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
                  <span className="pixel-label text-xs truncate flex-1">
                    {hero.name}
                    {(hero.prestige?.count || 0) > 0 && (
                      <span className="text-amber-400 ml-0.5">{'★'.repeat(Math.min(hero.prestige.count, 5))}</span>
                    )}
                  </span>
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

          {/* Max level reached / ascension panel */}
          {atMaxLevel && (
            <div className="pixel-panel-dark p-3 flex items-center justify-center">
              <div className="text-center">
                {canAscend() ? (
                  <>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <StarIcon size={14} />
                      <span className="pixel-label text-xs" style={{ color: '#f59e0b' }}>Ready to Ascend!</span>
                    </div>
                    <div className="text-xs text-[var(--color-text-dim)] mb-2">
                      Begin a new chapter with permanent bonuses
                    </div>
                    <button
                      onClick={onOpenAscension}
                      className="pixel-btn text-xs"
                      style={{ borderColor: '#f59e0b', color: '#f59e0b' }}
                    >
                      <span className="flex items-center gap-1">
                        <StarIcon size={10} />
                        Ascend to A{(ascension?.count || 0) + 1}
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="pixel-label text-xs mb-1">Max Level Reached</div>
                    <div className="text-xs text-[var(--color-text-dim)]">
                      Select a dungeon to replay
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Difficulty slider */}
        {!atMaxLevel && (
          <DifficultySlider
            value={dungeonSettings?.difficultyMultiplier || 1.0}
            onChange={(val) => setDungeonSettings({ difficultyMultiplier: val })}
          />
        )}

        {/* Milestone widget */}
        <div className="mb-4">
          <MilestoneWidget />
        </div>

        {/* Tower of Trials */}
        {canAccessTower && (
          <div className="pixel-panel-dark p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <SwordIcon size={12} />
                  <span className="pixel-label text-xs" style={{ color: '#a855f7' }}>Tower of Trials</span>
                </div>
                <div className="text-[10px] text-[var(--color-text-dim)] mt-0.5">
                  Endless floors. No healing. How far can you go?
                </div>
                {(challengeScores?.tower?.best || 0) > 0 && (
                  <div className="text-[10px] mt-0.5" style={{ color: '#fbbf24' }}>
                    Best: Floor {challengeScores.tower.best}
                    {challengeScores.tower.bestSeed && (
                      <span className="text-[var(--color-text-dim)] ml-1">#{challengeScores.tower.bestSeed}</span>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={startTowerOfTrials}
                className="pixel-btn text-xs"
                style={{ borderColor: '#a855f7', color: '#a855f7' }}
              >
                Enter Tower
              </button>
            </div>
          </div>
        )}

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
