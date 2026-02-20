import { memo, useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { CLASSES } from '../data/classes';
import { formatTime, formatRate } from '../game/constants';
import ClassIcon from './icons/ClassIcon';
import ModalOverlay from './ModalOverlay';
import { SwordIcon, HeartIcon, ShieldIcon, TrophyIcon, StarIcon, SpeedIcon } from './icons/ui';

function formatStat(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

const POSITIVE_MESSAGES = [
  'Well fought!',
  'Victory is yours!',
  'The dungeon trembles!',
  'Heroes triumphant!',
  'Another conquest!',
  'Strength in numbers!',
];

const DEFEAT_MESSAGES = [
  'A valiant effort.',
  'The dungeon claims its toll.',
  'Retreat and regroup.',
  'Next time will be different.',
];

const RunSummary = () => {
  const lastRunSummary = useGameStore(state => state.lastRunSummary);
  const autoAdvance = useGameStore(state => state.dungeonSettings?.autoAdvance);
  const dismissRunSummary = useGameStore(state => state.dismissRunSummary);
  const [lastInteractionTime, setLastInteractionTime] = useState(0);
  const timerRef = useRef(null);

  // Derive userInteracted: true if user interacted AFTER this summary appeared
  // This automatically resets to false when a new summary with newer timestamp appears
  const userInteracted = lastRunSummary?.timestamp
    ? lastInteractionTime > lastRunSummary.timestamp
    : false;

  // Auto-dismiss after 3s when auto-advance is on, unless user has interacted
  useEffect(() => {
    if (!lastRunSummary || !autoAdvance || userInteracted) return;
    timerRef.current = setTimeout(dismissRunSummary, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lastRunSummary, autoAdvance, dismissRunSummary, userInteracted]);

  const handleClose = useCallback(() => {
    dismissRunSummary();
  }, [dismissRunSummary]);

  const message = useMemo(() => {
    if (!lastRunSummary) return '';
    const messages = lastRunSummary.success ? POSITIVE_MESSAGES : DEFEAT_MESSAGES;
    return messages[lastRunSummary.timestamp % messages.length];
  }, [lastRunSummary]);

  const handleViewDetails = useCallback(() => {
    dismissRunSummary();
    useGameStore.getState().setPendingModal('stats');
  }, [dismissRunSummary]);

  // Cancel auto-dismiss when user interacts with modal
  const handleMouseEnter = useCallback(() => {
    setLastInteractionTime(Date.now());
  }, []);

  if (!lastRunSummary) return null;

  const { success, dungeonLevel, heroStats, totalDamage, mvpId, biggestHit, biggestHitHero, totalCombatTime, averageDPS } = lastRunSummary;
  const mvpHero = mvpId ? heroStats[mvpId] : null;

  const heroEntries = Object.entries(heroStats).sort(
    ([, a], [, b]) => (b.damageDealt || 0) - (a.damageDealt || 0)
  );

  return (
    <ModalOverlay
      isOpen={true}
      onClose={handleClose}
      title={success ? 'Dungeon Complete!' : 'Dungeon Failed'}
      size="sm"
    >
      <div onMouseEnter={handleMouseEnter}>
        <div className="text-center mb-4">
          <div className="pixel-label text-lg mb-1" style={{ color: success ? 'var(--color-green)' : 'var(--color-red)' }}>
            {success ? <TrophyIcon size={20} /> : null} Dungeon Level {dungeonLevel}
          </div>
          <p className="pixel-label" style={{ color: 'var(--color-gold)' }}>{message}</p>
        </div>

        {mvpHero && (
          <div className="pixel-panel-dark p-3 mb-3 text-center">
            <div className="pixel-label text-xs mb-1">MVP</div>
            <div className="flex items-center justify-center gap-2">
              <ClassIcon classId={mvpHero.classId} size={24} />
              <span className="pixel-title text-base">{mvpHero.name}</span>
            </div>
            <div className="pixel-label text-xs mt-1">
              {formatStat(mvpHero.damageDealt || 0)} damage dealt
            </div>
          </div>
        )}

        <div className="pixel-panel-dark p-3 mb-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="flex items-center justify-center gap-1">
                <SwordIcon size={14} />
                <span className="pixel-label text-xs">Total Damage</span>
              </div>
              <span className="text-red-400 font-bold">{formatStat(totalDamage)}</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <SwordIcon size={14} />
                <span className="pixel-label text-xs">Average DPS</span>
              </div>
              <span className="text-amber-400 font-bold">{formatRate(averageDPS || 0)}</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <SpeedIcon size={14} />
                <span className="pixel-label text-xs">Duration</span>
              </div>
              <span className="font-bold">{formatTime(totalCombatTime || 0)}</span>
            </div>
          </div>
          {biggestHit > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-700 text-center">
              <div className="flex items-center justify-center gap-1">
                <StarIcon size={14} />
                <span className="pixel-label text-xs">Biggest Hit</span>
              </div>
              <span className="text-amber-400 font-bold">{formatStat(biggestHit)}</span>
              {biggestHitHero && (
                <span className="pixel-label text-xs ml-1">by {biggestHitHero}</span>
              )}
            </div>
          )}
        </div>

        <div className="pixel-panel-dark p-3">
          <div className="pixel-label text-xs mb-2">Hero Breakdown</div>
          {heroEntries.map(([heroId, stats]) => {
            const cls = CLASSES[stats.classId];
            const role = cls?.role || 'dps';
            return (
              <div key={heroId} className="flex items-center gap-2 mb-1.5 text-sm">
                <ClassIcon classId={stats.classId} size={16} />
                <span className="pixel-label text-xs w-16 truncate">{stats.name}</span>
                <div className="flex gap-3 text-xs ml-auto">
                  {role === 'dps' || (stats.damageDealt || 0) > 0 ? (
                    <span className="flex items-center gap-0.5 text-red-400">
                      <SwordIcon size={10} /> {formatStat(stats.damageDealt || 0)}
                    </span>
                  ) : null}
                  {role === 'healer' || (stats.healingDone || 0) > 0 ? (
                    <span className="flex items-center gap-0.5 text-green-400">
                      <HeartIcon size={10} /> {formatStat(stats.healingDone || 0)}
                    </span>
                  ) : null}
                  {role === 'tank' || (stats.damageTaken || 0) > 0 ? (
                    <span className="flex items-center gap-0.5 text-blue-400">
                      <ShieldIcon size={10} /> {formatStat(stats.damageTaken || 0)}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {autoAdvance && !userInteracted && (
          <div className="text-center mt-3">
            <span className="pixel-label text-xs" style={{ color: 'var(--color-text-dim)' }}>
              Auto-advancing in 3s...
            </span>
          </div>
        )}

        <div className="flex gap-2 justify-center mt-3">
          <button onClick={handleViewDetails} className="pixel-btn">
            View Details
          </button>
          <button onClick={handleClose} className="pixel-btn pixel-btn-primary">
            Continue
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default memo(RunSummary);
