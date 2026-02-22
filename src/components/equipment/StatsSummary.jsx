import { useMemo } from 'react';
import { calculateHeroStatsWithBreakdown } from '../../store/gameStore';
import { useGameStore } from '../../store/gameStore';

const SOURCE_ICONS = {
  base: '\u2694',
  homestead: '\u2302',
  equipment_weapon: '\u2694',
  equipment_armor: '\u26E8',
  equipment_accessory: '\u2B50',
  affix: '\u2728',
  skill: '\u26A1',
  party_skill: '\u2764',
  party_aura: '\u2764',
  specialization: '\u2726',
  ascension: '\u2B06',
};

const SOURCE_COLORS = {
  base: 'text-gray-300',
  homestead: 'text-amber-400',
  equipment_weapon: 'text-red-300',
  equipment_armor: 'text-blue-300',
  equipment_accessory: 'text-yellow-300',
  affix: 'text-purple-400',
  skill: 'text-blue-400',
  party_skill: 'text-pink-400',
  party_aura: 'text-pink-400',
  specialization: 'text-cyan-400',
  ascension: 'text-amber-300',
};

const STAT_CONFIG = [
  { key: 'maxHp', label: 'HP', colorClass: 'text-green-400', color: '#4ade80' },
  { key: 'attack', label: 'ATK', colorClass: 'text-red-400', color: '#f87171' },
  { key: 'defense', label: 'DEF', colorClass: 'text-blue-400', color: '#60a5fa' },
  { key: 'speed', label: 'SPD', colorClass: 'text-yellow-400', color: '#facc15' },
];

const StatPillar = ({ stat, value, entries }) => {
  if (!entries) return null;

  return (
    <div
      className="stat-pillar"
      style={{
        '--stat-color': stat.color,
      }}
    >
      {/* Header: label + big value */}
      <div className="flex items-baseline justify-between px-3 pt-2.5 pb-1.5">
        <span className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">{stat.label}</span>
        <span className={`text-2xl font-bold ${stat.colorClass} tabular-nums`} style={{ textShadow: `0 0 12px ${stat.color}40` }}>
          {value}
        </span>
      </div>

      {/* Colored gradient divider */}
      <div className="h-px mx-2" style={{ background: `linear-gradient(90deg, ${stat.color}60, ${stat.color}15)` }} />

      {/* Breakdown rows */}
      <div className="px-2.5 py-2 space-y-0.5">
        {entries.length === 0 ? (
          <div className="text-[10px] text-gray-600 italic px-1">No bonuses</div>
        ) : (
          entries.map((entry, i) => {
            const icon = SOURCE_ICONS[entry.source] || '\u2022';
            const colorClass = SOURCE_COLORS[entry.source] || 'text-gray-400';
            const isNegative = entry.value < 0;
            const isLast = i === entries.length - 1;

            return (
              <div key={i} className="flex items-center gap-1 text-[11px] leading-tight">
                <span className="text-gray-600 w-3 text-center text-[10px] flex-shrink-0">
                  {isLast ? '\u2514' : '\u251C'}
                </span>
                <span className={`${colorClass} w-3.5 text-center text-[10px] flex-shrink-0`}>{icon}</span>
                <span className="text-gray-400 flex-1 truncate" title={entry.label}>
                  {entry.label}
                </span>
                <span className={`font-medium tabular-nums flex-shrink-0 ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                  {isNegative ? '' : '+'}{entry.value}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const StatsSummary = ({ stats, hero, allHeroes }) => {
  const getHomesteadBonuses = useGameStore(state => state.getHomesteadBonuses);

  const breakdownData = useMemo(() => {
    if (!hero) return null;
    const homesteadBonuses = getHomesteadBonuses();
    return calculateHeroStatsWithBreakdown(hero, allHeroes || [], homesteadBonuses);
  }, [hero, allHeroes, getHomesteadBonuses]);

  if (!stats || !breakdownData) return null;

  return (
    <div className="h-full flex flex-col px-3 py-3">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.3))' }} />
        <span className="text-[10px] text-gray-500 uppercase tracking-[3px] flex-shrink-0">Power Breakdown</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(148,163,184,0.3), transparent)' }} />
      </div>

      {/* 2x2 grid of stat pillars */}
      <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0">
        {STAT_CONFIG.map((stat) => (
          <StatPillar
            key={stat.key}
            stat={stat}
            value={stats[stat.key]}
            entries={breakdownData.breakdown[stat.key]}
          />
        ))}
      </div>
    </div>
  );
};

export default StatsSummary;
