import { useMemo } from 'react';
import { RARITY } from '../../data/equipment';
import { ITEM_AFFIXES } from '../../data/itemAffixes';
import ItemIcon from '../icons/ItemIcon';
import { ArrowUpIcon, ArrowDownIcon } from '../icons/ui';

// Trigger display labels
const TRIGGER_LABELS = {
  on_hit: 'On Hit',
  on_crit: 'On Crit',
  on_kill: 'On Kill',
  on_damage_taken: 'On Hit Taken',
  passive: 'Passive',
  on_turn_start: 'Turn Start',
};

// Stat display names
const STAT_NAMES = {
  maxHp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  speed: 'SPD',
};

// Get stat color
const getStatColor = (stat) => {
  switch (stat) {
    case 'maxHp': return 'text-green-400';
    case 'attack': return 'text-red-400';
    case 'defense': return 'text-blue-400';
    case 'speed': return 'text-yellow-400';
    default: return 'text-gray-300';
  }
};

const EquipmentTooltip = ({ item, comparedItem = null, showComparison = true, hideHeader = false }) => {
  const rarityData = RARITY[item?.rarity] || RARITY.common;

  // Calculate stat differences if comparing
  const statDiffs = useMemo(() => {
    if (!item || !showComparison || !comparedItem) return null;

    const diffs = {};
    const allStats = new Set([
      ...Object.keys(item.stats || {}),
      ...Object.keys(comparedItem.stats || {}),
    ]);

    for (const stat of allStats) {
      const newVal = item.stats?.[stat] || 0;
      const oldVal = comparedItem.stats?.[stat] || 0;
      if (newVal !== oldVal) {
        diffs[stat] = newVal - oldVal;
      }
    }

    return Object.keys(diffs).length > 0 ? diffs : null;
  }, [item, comparedItem, showComparison]);

  // Calculate total score difference
  const isUpgrade = useMemo(() => {
    if (!statDiffs) return null;
    const totalDiff = Object.values(statDiffs).reduce((sum, val) => sum + val, 0);
    return totalDiff > 0;
  }, [statDiffs]);

  if (!item) return null;

  return (
    <div className="min-w-[200px]">
      {/* Header with rarity gradient */}
      {!hideHeader && (
        <div
          className="px-3 py-2 rounded-t-lg -mx-3 -mt-2 mb-2"
          style={{
            background: `linear-gradient(135deg, ${rarityData.color}40 0%, ${rarityData.color}10 100%)`,
            borderBottom: `2px solid ${rarityData.color}`,
          }}
        >
          <div className="flex items-center gap-2">
            <ItemIcon item={item} size={24} />
            <div>
              <div className="font-bold" style={{ color: rarityData.color }}>
                {item.name}
              </div>
              <div className="text-xs text-gray-400 capitalize">
                {item.slot} - {rarityData.name}
                {item.quality === 'infused' && <span style={{ color: '#34d399' }}> [Infused]</span>}
                {item.quality === 'ascended' && <span style={{ color: '#f472b6' }}> [Ascended]</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="space-y-1">
        {Object.entries(item.stats || {}).map(([stat, value]) => (
          <div key={stat} className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{STAT_NAMES[stat] || stat}</span>
            <span className={`font-medium ${getStatColor(stat)}`}>
              +{value}
            </span>
          </div>
        ))}
      </div>

      {/* Affixes */}
      {item.affixes?.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-700 space-y-1.5">
          {item.affixes.map(affixId => {
            const affix = ITEM_AFFIXES[affixId];
            if (!affix) return null;
            return (
              <div key={affixId}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium" style={{ color: '#a855f7' }}>
                    {affix.name}
                  </span>
                  <span className="text-[9px] px-1 py-px rounded bg-gray-700 text-gray-400">
                    {TRIGGER_LABELS[affix.trigger] || affix.trigger}
                  </span>
                </div>
                <div className="text-xs text-gray-400">{affix.description}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison section */}
      {statDiffs && (
        <div className="mt-3 pt-2 border-t border-gray-700">
          <div className={`text-xs font-bold mb-1 flex items-center gap-1 ${isUpgrade ? 'text-green-400' : 'text-red-400'}`}>
            {isUpgrade ? <ArrowUpIcon size={12} /> : <ArrowDownIcon size={12} />}
            {isUpgrade ? 'UPGRADE' : 'DOWNGRADE'}
          </div>
          <div className="text-xs space-y-0.5">
            {Object.entries(statDiffs).map(([stat, diff]) => (
              <div key={stat} className="flex justify-between">
                <span className="text-gray-500">{STAT_NAMES[stat] || stat}</span>
                <span className={diff > 0 ? 'text-green-400' : 'text-red-400'}>
                  {diff > 0 ? '+' : ''}{diff}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Class restrictions */}
      {item.classes && (
        <div className="mt-2 pt-2 border-t border-gray-700">
          <div className="text-xs text-gray-500">
            Classes: {item.classes.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentTooltip;
