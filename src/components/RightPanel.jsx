import { memo, useMemo } from 'react';
import { useGameStore } from '../store/gameStore';
import { CLASSES } from '../data/classes';
import ClassIcon from './icons/ClassIcon';
import MilestoneWidget from './MilestoneWidget';
import { SwordIcon, HeartIcon, ShieldIcon, SkullIcon, ChartIcon } from './icons/ui';

function formatStat(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(Math.floor(value));
}

const HeroStatCard = memo(({ hero, stats }) => {
  const cls = CLASSES[hero.classId];
  return (
    <div className="pixel-panel-dark p-2">
      <div className="flex items-center gap-2 mb-1.5">
        <ClassIcon classId={hero.classId} size={16} />
        <span className="text-white text-xs font-bold truncate">{hero.name}</span>
        <span className="text-gray-500 text-[10px]">{cls?.name || ''}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px]">
        <div className="flex items-center gap-1">
          <SwordIcon size={10} className="text-red-400" />
          <span className="text-gray-400">DMG</span>
          <span className="text-red-300 ml-auto">{formatStat(stats.damageDealt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <HeartIcon size={10} className="text-green-400" />
          <span className="text-gray-400">Heal</span>
          <span className="text-green-300 ml-auto">{formatStat(stats.healingDone)}</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldIcon size={10} className="text-blue-400" />
          <span className="text-gray-400">Taken</span>
          <span className="text-blue-300 ml-auto">{formatStat(stats.damageTaken)}</span>
        </div>
        <div className="flex items-center gap-1">
          <SkullIcon size={10} className="text-amber-400" />
          <span className="text-gray-400">Kills</span>
          <span className="text-amber-300 ml-auto">{stats.kills}</span>
        </div>
      </div>
      {stats.biggestHit > 0 && (
        <div className="mt-1 text-[10px] text-gray-500">
          Biggest hit: <span className="text-amber-300">{formatStat(stats.biggestHit)}</span>
        </div>
      )}
    </div>
  );
});
HeroStatCard.displayName = 'HeroStatCard';

const RunStatsPanel = () => {
  const runStats = useGameStore(state => state.runStats);
  const heroes = useGameStore(state => state.heroes);

  const heroStats = useMemo(() => {
    if (!heroes?.length) return [];
    return heroes.filter(Boolean).map(hero => {
      const stats = runStats[hero.id] || {};
      return {
        hero,
        stats: {
          damageDealt: stats.damageDealt || 0,
          healingDone: stats.healingDone || 0,
          damageTaken: stats.damageTaken || 0,
          kills: stats.kills || 0,
          biggestHit: stats.biggestHit || 0,
        },
      };
    });
  }, [heroes, runStats]);

  if (heroStats.length === 0) {
    return (
      <div className="text-gray-500 text-xs p-2">
        No combat data yet.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {heroStats.map(({ hero, stats }) => (
        <HeroStatCard key={hero.id} hero={hero} stats={stats} />
      ))}
    </div>
  );
};

const RightPanel = ({ dungeon, onClose }) => {
  return (
    <aside
      className="right-panel-container flex-col h-full pixel-panel-dark overflow-hidden"
      style={{ borderRadius: 0 }}
    >
      <div className="flex items-center justify-between p-3 border-b-3 border-[var(--color-border)]">
        <div className="flex items-center gap-1">
          <ChartIcon size={14} />
          <span className="pixel-subtitle text-sm">
            {dungeon ? 'Run Stats' : 'Overview'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="pixel-btn text-xs px-2 py-0.5"
          aria-label="Close details panel"
          title="Close panel"
        >
          X
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {dungeon ? (
          <RunStatsPanel />
        ) : (
          <MilestoneWidget />
        )}
      </div>
    </aside>
  );
};

export default memo(RightPanel);
