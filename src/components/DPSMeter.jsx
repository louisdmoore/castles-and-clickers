import { memo, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { CLASSES } from '../data/classes';
import { formatTime, formatRate } from '../game/constants';
import ClassIcon from './icons/ClassIcon';
import { SwordIcon, HeartIcon, ShieldIcon } from './icons/ui';

const ROLE_CONFIG = {
  tank: { Icon: ShieldIcon, color: 'text-blue-400', barColor: 'pixel-bar-blue' },
  healer: { Icon: HeartIcon, color: 'text-green-400', barColor: 'pixel-bar-green' },
  dps: { Icon: SwordIcon, color: 'text-red-400', barColor: 'pixel-bar-red' },
};

const HeroBar = memo(({ hero, rate, maxRate, roleConfig, suffix }) => {
  const pct = maxRate > 0 ? (rate / maxRate) * 100 : 0;

  return (
    <div className="flex items-center gap-1 mb-1">
      <ClassIcon classId={hero.classId} size={14} />
      <span className="pixel-label text-xs w-12 truncate" title={hero.name}>{hero.name}</span>
      <div className="pixel-bar flex-1 h-1.5">
        <div
          className={`pixel-bar-fill ${roleConfig.barColor}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className={`pixel-label text-xs w-14 text-right ${roleConfig.color}`}>
        {formatRate(rate)} {suffix}
      </span>
    </div>
  );
});
HeroBar.displayName = 'HeroBar';

const DPSMeter = () => {
  const runStats = useGameStore(state => state.runStats);
  const heroes = useGameStore(state => state.heroes);
  const dungeon = useGameStore(state => state.dungeon);

  const { heroData, totalDPS, timeDisplay } = useMemo(() => {
    if (!dungeon || !heroes?.length || !runStats) {
      return { heroData: [], totalDPS: 0, timeDisplay: '0:00' };
    }

    // Compute live combat time from flushed time + in-progress ticks (floor at one tick)
    const totalCombatTime = Math.max((runStats.totalCombatTime || 0) + (runStats.combatTicks || 0) * 0.25, 0.25);
    const timeDisplay = formatTime(totalCombatTime);

    const heroData = heroes.filter(Boolean).map(hero => {
      const cls = CLASSES[hero.classId];
      const role = cls?.role || 'dps';
      const config = ROLE_CONFIG[role] || ROLE_CONFIG.dps;
      const stats = runStats[hero.id] || {};

      // Calculate rate based on role
      let rate = 0;
      let suffix = '';
      if (role === 'healer') {
        rate = (stats.healingDone || 0) / totalCombatTime;
        suffix = 'HPS';
      } else if (role === 'tank') {
        rate = (stats.damageTaken || 0) / totalCombatTime;
        suffix = 'DTPS';
      } else {
        rate = (stats.damageDealt || 0) / totalCombatTime;
        suffix = 'DPS';
      }

      return { hero, role, config, rate, suffix };
    });

    // Sort by rate descending
    heroData.sort((a, b) => b.rate - a.rate);

    // Calculate total party DPS (all heroes contribute damage, regardless of role)
    const totalDPS = heroes.filter(Boolean).reduce((sum, hero) => {
      const stats = runStats[hero.id] || {};
      return sum + ((stats.damageDealt || 0) / totalCombatTime);
    }, 0);

    return { heroData, totalDPS, timeDisplay };
  }, [heroes, runStats, dungeon]);

  const maxRate = useMemo(() => {
    return Math.max(1, ...heroData.map(d => d.rate));
  }, [heroData]);

  if (!dungeon || heroData.length === 0) return null;

  return (
    <div className="pixel-panel-dark p-2">
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1">
          <SwordIcon size={14} />
          <span className="pixel-label text-xs">DPS Meter</span>
        </div>
        <span className="pixel-label text-xs text-gray-400">{timeDisplay}</span>
      </div>
      {heroData.map(({ hero, config, rate, suffix }) => (
        <HeroBar
          key={hero.id}
          hero={hero}
          rate={rate}
          maxRate={maxRate}
          roleConfig={config}
          suffix={suffix}
        />
      ))}
      {totalDPS > 0 && (
        <div className="mt-1 pt-1 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="pixel-label text-xs text-gray-400">Party DPS</span>
            <span className="pixel-label text-xs text-red-400">{formatRate(totalDPS)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(DPSMeter);
