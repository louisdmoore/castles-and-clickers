const SOURCE_ICONS = {
  base: '\u2694',       // crossed swords
  homestead: '\u2302',  // house
  equipment_weapon: '\u2694',
  equipment_armor: '\u26E8',   // shield
  equipment_accessory: '\u2B50', // star
  affix: '\u2728',      // sparkles
  skill: '\u26A1',      // lightning
  party_skill: '\u2764', // heart
  party_aura: '\u2764',
  specialization: '\u2726', // star
  ascension: '\u2B06',  // up arrow
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

const StatBreakdown = ({ statLabel, statColor, entries, total }) => {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded p-3 min-w-[200px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-1 border-b border-gray-700">
        <span className={`text-sm font-bold ${statColor}`}>{statLabel}</span>
        <span className={`text-lg font-bold ${statColor}`}>{total}</span>
      </div>

      {/* Breakdown rows */}
      <div className="space-y-1">
        {entries.map((entry, i) => {
          const icon = SOURCE_ICONS[entry.source] || '\u2022';
          const colorClass = SOURCE_COLORS[entry.source] || 'text-gray-400';
          const isNegative = entry.value < 0;

          return (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              {/* Tree connector */}
              <span className="text-gray-600 w-3 text-center">
                {i === entries.length - 1 ? '\u2514' : '\u251C'}
              </span>
              {/* Source icon */}
              <span className={`${colorClass} w-4 text-center text-[10px]`}>{icon}</span>
              {/* Label */}
              <span className="text-gray-400 flex-1 truncate" title={entry.label}>
                {entry.label}
              </span>
              {/* Value */}
              <span className={`font-medium tabular-nums ${isNegative ? 'text-red-400' : 'text-green-400'}`}>
                {isNegative ? '' : '+'}{entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatBreakdown;
