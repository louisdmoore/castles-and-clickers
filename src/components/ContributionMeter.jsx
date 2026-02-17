import { memo, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { CLASSES } from '../data/classes';
import ClassIcon from './icons/ClassIcon';
import { SwordIcon, HeartIcon, ShieldIcon } from './icons/ui';

const ROLE_CONFIG = {
  tank: { stat: 'damageTaken', label: 'DMG Taken', Icon: ShieldIcon, color: 'pixel-bar-blue' },
  healer: { stat: 'healingDone', label: 'Healing', Icon: HeartIcon, color: 'pixel-bar-green' },
  dps: { stat: 'damageDealt', label: 'Damage', Icon: SwordIcon, color: 'pixel-bar-red' },
};

const HeroBar = memo(({ hero, value, maxValue, roleConfig }) => {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;

  return (
    <div className="flex items-center gap-1.5 mb-1">
      <ClassIcon classId={hero.classId} size={16} />
      <span className="pixel-label text-xs w-14 truncate" title={hero.name}>{hero.name}</span>
      <div className="pixel-bar flex-1 h-2">
        <div
          className={`pixel-bar-fill ${roleConfig.color}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
      <span className="pixel-label text-xs w-10 text-right">{formatStat(value)}</span>
    </div>
  );
});
HeroBar.displayName = 'HeroBar';

function formatStat(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}

const ContributionMeter = () => {
  const runStats = useGameStore(state => state.runStats);
  const heroes = useGameStore(state => state.heroes);
  const dungeon = useGameStore(state => state.dungeon);

  const heroData = useMemo(() => {
    if (!dungeon || !heroes?.length) return [];

    return heroes.filter(Boolean).map(hero => {
      const cls = CLASSES[hero.classId];
      const role = cls?.role || 'dps';
      const config = ROLE_CONFIG[role] || ROLE_CONFIG.dps;
      const stats = runStats[hero.id] || {};
      const value = stats[config.stat] || 0;

      return { hero, role, config, value };
    });
  }, [heroes, runStats, dungeon]);

  const maxValue = useMemo(() => {
    return Math.max(1, ...heroData.map(d => d.value));
  }, [heroData]);

  if (!dungeon || heroData.length === 0) return null;

  return (
    <div className="pixel-panel-dark p-2 mt-2">
      <div className="flex items-center gap-1 mb-1.5">
        <SwordIcon size={14} />
        <span className="pixel-label text-xs">Contribution</span>
      </div>
      {heroData.map(({ hero, config, value }) => (
        <HeroBar
          key={hero.id}
          hero={hero}
          value={value}
          maxValue={maxValue}
          roleConfig={config}
        />
      ))}
    </div>
  );
};

export default memo(ContributionMeter);
