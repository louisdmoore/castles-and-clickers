import { useState, useMemo } from 'react';
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
  { key: 'maxHp', label: 'HP', colorClass: 'text-green-400', color: '#4ade80', tooltip: 'Hit Points \u2014 hero falls at 0. Boosted by armor, homestead, and class growth.' },
  { key: 'attack', label: 'ATK', colorClass: 'text-red-400', color: '#f87171', tooltip: 'Attack \u2014 base damage dealt. Reduced by target\'s Defense.' },
  { key: 'defense', label: 'DEF', colorClass: 'text-blue-400', color: '#60a5fa', tooltip: 'Defense \u2014 reduces incoming damage by DEF \u00D7 0.7.' },
  { key: 'speed', label: 'SPD', colorClass: 'text-yellow-400', color: '#facc15', tooltip: 'Speed \u2014 determines turn order, dodge chance (above 15), and double attack chance.' },
];

const StatsSummary = ({ stats, hero, allHeroes }) => {
  const getHomesteadBonuses = useGameStore(state => state.getHomesteadBonuses);
  const [selectedStat, setSelectedStat] = useState('maxHp');

  const breakdownData = useMemo(() => {
    if (!hero) return null;
    const homesteadBonuses = getHomesteadBonuses();
    return calculateHeroStatsWithBreakdown(hero, allHeroes || [], homesteadBonuses);
  }, [hero, allHeroes, getHomesteadBonuses]);

  if (!stats || !breakdownData) return null;

  const activeStat = STAT_CONFIG.find(s => s.key === selectedStat);
  const activeEntries = breakdownData.breakdown[selectedStat] || [];

  return (
    <div className="h-full flex flex-col px-4 py-4">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.3))' }} />
        <span className="text-[11px] text-gray-500 uppercase tracking-[3px] flex-shrink-0">Stats</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(148,163,184,0.3), transparent)' }} />
      </div>

      {/* Summary bar — all 4 stats, always stable */}
      <div className="grid grid-cols-4 gap-1.5 flex-shrink-0 mb-3">
        {STAT_CONFIG.map((stat) => {
          const isActive = selectedStat === stat.key;
          return (
            <button
              key={stat.key}
              onClick={() => setSelectedStat(stat.key)}
              className={`flex flex-col items-center py-2.5 px-1 rounded transition-colors cursor-pointer ${
                isActive
                  ? 'bg-gray-800/80 ring-1'
                  : 'bg-gray-900/40 hover:bg-gray-800/50'
              }`}
              style={isActive ? { ringColor: stat.color + '60', boxShadow: `inset 0 -2px 0 ${stat.color}` } : undefined}
              title={stat.tooltip}
            >
              <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">{stat.label}</span>
              <span
                className={`text-xl font-bold tabular-nums leading-none mt-1 ${stat.colorClass}`}
                style={{ textShadow: isActive ? `0 0 12px ${stat.color}40` : undefined }}
              >
                {stats[stat.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Breakdown panel — full width, only selected stat */}
      {activeStat && (
        <div
          className="stat-pillar flex-1 min-h-0"
          style={{ '--stat-color': activeStat.color }}
        >
          {/* Panel header */}
          <div className="flex items-center gap-2 px-3.5 pt-3 pb-2">
            <span className={`text-sm font-bold ${activeStat.colorClass}`}>{activeStat.label} Breakdown</span>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${activeStat.color}30, transparent)` }} />
            <span
              className={`text-2xl font-bold ${activeStat.colorClass} tabular-nums`}
              style={{ textShadow: `0 0 12px ${activeStat.color}40` }}
            >
              {stats[selectedStat]}
            </span>
          </div>

          {/* Colored gradient divider */}
          <div className="h-px mx-3" style={{ background: `linear-gradient(90deg, ${activeStat.color}60, ${activeStat.color}10)` }} />

          {/* Source rows */}
          <div className="px-3.5 py-3 space-y-1.5">
            {activeEntries.length === 0 ? (
              <div className="text-xs text-gray-600 italic">No bonuses</div>
            ) : (
              activeEntries.map((entry, i) => {
                const icon = SOURCE_ICONS[entry.source] || '\u2022';
                const colorClass = SOURCE_COLORS[entry.source] || 'text-gray-400';
                const isNegative = entry.value < 0;

                return (
                  <div key={i} className="flex items-center gap-2 text-sm leading-snug">
                    <span className={`${colorClass} w-5 text-center flex-shrink-0`}>{icon}</span>
                    <span className="text-gray-400 flex-1 min-w-0 truncate" title={entry.label}>
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
      )}
    </div>
  );
};

export default StatsSummary;
