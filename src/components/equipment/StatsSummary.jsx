import { useState, useMemo } from 'react';
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
  const [expandedStat, setExpandedStat] = useState(null);
  const getHomesteadBonuses = useGameStore(state => state.getHomesteadBonuses);

  // Only compute breakdown when a stat is clicked (on-demand)
  const breakdownData = useMemo(() => {
    if (!expandedStat || !hero) return null;
    const homesteadBonuses = getHomesteadBonuses();
    return calculateHeroStatsWithBreakdown(hero, allHeroes || [], homesteadBonuses);
  }, [expandedStat, hero, allHeroes, getHomesteadBonuses]);

  if (!stats) return null;

  const handleStatClick = (key) => {
    setExpandedStat(expandedStat === key ? null : key);
  };

  return (
    <div className="bg-gray-900 rounded p-2">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {STAT_CONFIG.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => handleStatClick(key)}
            className={`flex items-center justify-between rounded px-1 py-0.5 transition-colors text-left
              ${expandedStat === key ? 'bg-gray-800' : 'hover:bg-gray-800/50'}
            `}
            aria-label={`Show ${label} breakdown`}
          >
            <span className="text-[11px] text-gray-500 uppercase">{label}</span>
            <span className={`text-sm font-bold ${color}`}>
              {stats[key]}
            </span>
          </button>
        ))}
      </div>

      {/* Expandable breakdown below the grid */}
      {expandedStat && breakdownData && (
        <div className="mt-2 pt-1 border-t border-gray-700">
          <StatBreakdown
            statLabel={STAT_CONFIG.find(s => s.key === expandedStat)?.label}
            statColor={STAT_CONFIG.find(s => s.key === expandedStat)?.color}
            entries={breakdownData.breakdown[expandedStat]}
            total={breakdownData.stats[expandedStat]}
          />
        </div>
      )}
    </div>
  );
};

export default StatsSummary;
