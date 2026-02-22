import { useMemo } from 'react';
import { calculateHeroStatsWithBreakdown } from '../../store/gameStore';
import { useGameStore } from '../../store/gameStore';
import StatBreakdown from './StatBreakdown';

const STAT_CONFIG = [
  { key: 'maxHp', label: 'HP', color: 'text-green-400' },
  { key: 'attack', label: 'ATK', color: 'text-red-400' },
  { key: 'defense', label: 'DEF', color: 'text-blue-400' },
  { key: 'speed', label: 'SPD', color: 'text-yellow-400' },
];

const StatsSummary = ({ stats, hero, allHeroes }) => {
  const getHomesteadBonuses = useGameStore(state => state.getHomesteadBonuses);

  const breakdownData = useMemo(() => {
    if (!hero) return null;
    const homesteadBonuses = getHomesteadBonuses();
    return calculateHeroStatsWithBreakdown(hero, allHeroes || [], homesteadBonuses);
  }, [hero, allHeroes, getHomesteadBonuses]);

  if (!stats) return null;

  return (
    <div className="bg-gray-900/60 rounded px-3 py-2 space-y-2">
      {/* Stat totals row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {STAT_CONFIG.map(({ key, label, color }) => (
          <div
            key={key}
            className="flex items-center justify-between md:flex-col md:items-center rounded px-2 py-1.5"
          >
            <span className="text-[10px] text-gray-500 uppercase">{label}</span>
            <span className={`text-sm font-bold ${color}`}>
              {stats[key]}
            </span>
          </div>
        ))}
      </div>

      {/* All breakdowns always visible */}
      {breakdownData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-gray-700">
          {STAT_CONFIG.map(({ key, label, color }) => (
            <StatBreakdown
              key={key}
              statLabel={label}
              statColor={color}
              entries={breakdownData.breakdown[key]}
              total={breakdownData.stats[key]}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StatsSummary;
