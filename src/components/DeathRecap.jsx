import { memo, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { CLASSES } from '../data/classes';
import ClassIcon from './icons/ClassIcon';
import ModalOverlay from './ModalOverlay';
import { SkullIcon, SwordIcon, ShieldIcon, HeartIcon } from './icons/ui';

function formatStat(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

const DeathRecap = () => {
  const lastDeathRecap = useGameStore(state => state.lastDeathRecap);
  const autoAdvance = useGameStore(state => state.dungeonSettings?.autoAdvance);
  const dismissDeathRecap = useGameStore(state => state.dismissDeathRecap);

  // Auto-dismiss after 8s when auto-advance is on (longer than run summary for readability)
  useEffect(() => {
    if (!lastDeathRecap || !autoAdvance) return;
    const timer = setTimeout(dismissDeathRecap, 8000);
    return () => clearTimeout(timer);
  }, [lastDeathRecap, autoAdvance, dismissDeathRecap]);

  const handleClose = useCallback(() => {
    dismissDeathRecap();
  }, [dismissDeathRecap]);

  if (!lastDeathRecap) return null;

  const { dungeonLevel, deaths, heroStats } = lastDeathRecap;

  // Calculate total damage taken and healing received across all heroes
  let totalDamageTaken = 0;
  let totalHealingReceived = 0;
  for (const stats of Object.values(heroStats)) {
    totalDamageTaken += stats.damageTaken || 0;
    totalHealingReceived += stats.healingReceived || 0;
  }

  return (
    <ModalOverlay
      isOpen={true}
      onClose={handleClose}
      title="Defeat Breakdown"
      size="sm"
    >
      <div className="text-center mb-4">
        <div className="pixel-label text-lg mb-1" style={{ color: 'var(--color-red)' }}>
          <SkullIcon size={20} /> Dungeon Level {dungeonLevel}
        </div>
        <p className="pixel-label text-xs" style={{ color: 'var(--color-text-dim)' }}>
          Data, not prescription. What happened?
        </p>
      </div>

      {/* Kill order */}
      <div className="pixel-panel-dark p-3 mb-3">
        <div className="pixel-label text-xs mb-2">Kill Order</div>
        {deaths.map((death, index) => {
          const heroStat = heroStats[death.heroId];
          const dmgTaken = heroStat?.damageTaken || death.damageTaken || 0;
          const healRecv = heroStat?.healingReceived || death.healingReceived || 0;

          return (
            <div key={death.heroId} className="mb-2.5 last:mb-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-red-400 w-4">{index + 1}.</span>
                <ClassIcon classId={death.classId} size={16} />
                <span className="pixel-label text-xs flex-1">{death.heroName}</span>
                <span className="text-[10px] text-[var(--color-text-dim)]">
                  killed by {death.killerName}
                </span>
              </div>
              <div className="ml-6 flex gap-3 text-[10px]">
                <span className="flex items-center gap-0.5 text-red-400">
                  <ShieldIcon size={8} /> {formatStat(dmgTaken)} taken
                </span>
                <span className="flex items-center gap-0.5 text-green-400">
                  <HeartIcon size={8} /> {formatStat(healRecv)} healed
                </span>
                {dmgTaken > 0 && healRecv > 0 && (
                  <span className={healRecv >= dmgTaken ? 'text-green-300' : 'text-red-300'}>
                    ({healRecv >= dmgTaken ? '+' : ''}{formatStat(healRecv - dmgTaken)} net)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall stats */}
      <div className="pixel-panel-dark p-3 mb-3">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <div className="flex items-center justify-center gap-1">
              <ShieldIcon size={12} />
              <span className="pixel-label text-xs">Total Damage Taken</span>
            </div>
            <span className="text-red-400 font-bold">{formatStat(totalDamageTaken)}</span>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <HeartIcon size={12} />
              <span className="pixel-label text-xs">Total Healing</span>
            </div>
            <span className="text-green-400 font-bold">{formatStat(totalHealingReceived)}</span>
          </div>
        </div>
        {totalDamageTaken > totalHealingReceived && totalHealingReceived > 0 && (
          <div className="text-center mt-2 text-xs text-[var(--color-text-dim)]">
            Incoming damage outpaced healing by {formatStat(totalDamageTaken - totalHealingReceived)}
          </div>
        )}
      </div>

      {/* Hero breakdown */}
      <div className="pixel-panel-dark p-3">
        <div className="pixel-label text-xs mb-2">Hero Summary</div>
        {Object.entries(heroStats)
          .sort(([, a], [, b]) => (b.damageTaken || 0) - (a.damageTaken || 0))
          .map(([heroId, stats]) => {
            const isDead = deaths.some(d => d.heroId === heroId);
            return (
              <div key={heroId} className={`flex items-center gap-2 mb-1.5 text-sm ${isDead ? 'opacity-60' : ''}`}>
                <ClassIcon classId={stats.classId} size={16} />
                <span className="pixel-label text-xs w-16 truncate">{stats.name}</span>
                {isDead && <SkullIcon size={10} className="text-red-400" />}
                <div className="flex gap-3 text-xs ml-auto">
                  <span className="flex items-center gap-0.5 text-red-400">
                    <SwordIcon size={10} /> {formatStat(stats.damageDealt || 0)}
                  </span>
                  <span className="flex items-center gap-0.5 text-blue-400">
                    <ShieldIcon size={10} /> {formatStat(stats.damageTaken || 0)}
                  </span>
                  <span className="flex items-center gap-0.5 text-green-400">
                    <HeartIcon size={10} /> {formatStat(stats.healingReceived || 0)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {autoAdvance && (
        <div className="text-center mt-3">
          <span className="pixel-label text-xs" style={{ color: 'var(--color-text-dim)' }}>
            Auto-retrying in 8s...
          </span>
        </div>
      )}

      <div className="text-center mt-3">
        <button onClick={handleClose} className="pixel-btn pixel-btn-primary">
          Continue
        </button>
      </div>
    </ModalOverlay>
  );
};

export default memo(DeathRecap);
