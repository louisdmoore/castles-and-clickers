import ItemIcon from '../icons/ItemIcon';
import { GoldIcon, StarIcon, ArrowUpIcon } from '../icons/ui';
import EquipmentTooltip from '../ui/EquipmentTooltip';
import { RARITY } from '../../data/equipment';
import { ITEM_AFFIXES } from '../../data/itemAffixes';
import { calculateSellValue } from '../../store/gameStore';
import { scaleUniqueStats } from '../../data/uniqueItems';

const STAT_SHORT = { maxHp: 'HP', attack: 'ATK', defense: 'DEF', speed: 'SPD' };
const STAT_COLOR = { maxHp: 'text-green-400', attack: 'text-red-400', defense: 'text-blue-400', speed: 'text-yellow-400' };

const getRarityRowStyle = (item, rarityData) => {
  const rarity = item?.isUnique ? 'unique' : (item?.rarity || 'common');
  switch (rarity) {
    case 'legendary':
      return { background: `linear-gradient(90deg, ${rarityData.color}1a 0%, transparent 40%)` };
    case 'epic':
      return { background: `linear-gradient(90deg, ${rarityData.color}14 0%, transparent 30%)` };
    case 'rare':
      return { background: 'rgba(59, 130, 246, 0.04)' };
    case 'unique':
      return { background: 'linear-gradient(90deg, rgba(6,182,212,0.08) 0%, transparent 30%)' };
    default:
      return {};
  }
};

const getRarityIconClass = (item) => {
  if (item?.isUnique) return 'unique-glow';
  switch (item?.rarity) {
    case 'legendary': return 'rarity-glow-icon-legendary';
    case 'epic': return 'rarity-glow-icon-epic';
    case 'rare': return 'rarity-glow-icon-rare';
    default: return '';
  }
};

const getRarityRowClass = (item) => {
  if (item?.rarity === 'legendary' && !item?.isUnique) return 'item-row-legendary';
  return '';
};

const getItemDisplayStats = (item, highestPartyLevel) => {
  if (item?.isUnique && item?.baseStats) {
    return scaleUniqueStats(item.baseStats, highestPartyLevel);
  }
  return item?.stats || {};
};

const ItemRow = ({ item, canEquip, onEquip, onSell, comparison, highestPartyLevel, expanded, onToggleExpand }) => {
  const isUnique = item?.isUnique;
  const isBetter = comparison?.isBetter;
  const displayStats = getItemDisplayStats(item, highestPartyLevel);
  const rarityData = isUnique ? RARITY.unique : (RARITY[item.rarity] || RARITY.common);
  const affixes = (item?.affixes || [])
    .map(id => ITEM_AFFIXES[id])
    .filter(Boolean);

  const rarityIconClass = getRarityIconClass(item);
  const rarityRowClass = getRarityRowClass(item);
  const rarityRowStyle = getRarityRowStyle(item, rarityData);

  return (
    <div className="item-row-wrapper">
      <div
        className={`item-row-header group flex items-center gap-2 px-2 py-2 rounded cursor-pointer
          ${isBetter ? 'bg-green-500/10' : ''}
          ${!canEquip ? 'opacity-50' : ''}
          ${rarityRowClass}
          ${expanded ? 'rounded-b-none item-row-expanded' : ''}
        `}
        style={{
          ...(!isBetter ? rarityRowStyle : {}),
          position: 'relative',
        }}
        onClick={() => onToggleExpand(item.id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggleExpand(item.id); } }}
        aria-expanded={expanded}
        aria-label={`${item.name} details`}
      >
        {/* Upgrade arrow */}
        {isBetter && (
          <div className="flex-shrink-0 -ml-1">
            <ArrowUpIcon size={14} />
          </div>
        )}

        {/* Item icon with rarity treatment */}
        <div
          className={`w-11 h-11 rounded flex items-center justify-center flex-shrink-0 relative ${rarityIconClass}`}
          style={{
            backgroundColor: `${rarityData.color}12`,
            border: `2px solid ${rarityData.color}40`,
          }}
        >
          <ItemIcon item={item} size={32} />
          {isUnique && (
            <div className="absolute -top-1 -right-1">
              <StarIcon size={10} className="text-cyan-400 unique-sparkle" />
            </div>
          )}
        </div>

        {/* Name + rarity badge + affixes */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-0.5 min-w-0">
            <span
              className={`text-xs font-medium truncate ${isUnique ? 'unique-text-shimmer' : ''} ${item?.rarity === 'legendary' && !isUnique ? 'font-bold' : ''}`}
              style={isUnique ? {} : { color: rarityData.color }}
              title={item.name}
            >
              {item.name}
            </span>
            <span
              className="text-[9px] font-semibold uppercase tracking-wider px-1 py-px rounded flex-shrink-0"
              style={{
                color: rarityData.color,
                backgroundColor: `${rarityData.color}15`,
              }}
            >
              {rarityData.name}
            </span>
          </div>
          {affixes.length > 0 && !isUnique && (
            <div className="text-[10px] text-purple-400 truncate">
              {affixes.map(a => a.name).join(' \u00b7 ')}
            </div>
          )}
          {isUnique && item.uniquePower && (
            <div className="text-[10px] unique-text-shimmer truncate" title={item.uniquePower.name}>
              {item.uniquePower.name}
            </div>
          )}
        </div>

        {/* Stats with diffs - chip style */}
        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
          {Object.entries(displayStats).map(([s, v]) => {
            const diff = comparison?.statDiff?.[s];
            return (
              <div key={s} className="flex items-center gap-0.5 bg-gray-800/80 rounded px-1.5 py-0.5">
                <span className="text-[10px] text-gray-500 uppercase">{STAT_SHORT[s] || s}</span>
                <span className={`text-[11px] font-medium ${STAT_COLOR[s] || 'text-gray-300'}`}>+{v}</span>
                {diff != null && diff !== 0 && (
                  <span className={`text-[11px] font-bold ${diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {diff > 0 ? '\u25B2' : '\u25BC'}{Math.abs(diff)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 flex-shrink-0">
          {canEquip && (
            <button
              onClick={(e) => { e.stopPropagation(); onEquip(item); }}
              className={`px-2 py-1 text-white text-[10px] rounded font-medium transition-colors ${
                isBetter ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'
              }`}
              aria-label={`Equip ${item.name}`}
            >
              Equip
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); !isUnique && onSell(item.id); }}
            className={`px-1.5 py-1 text-[10px] rounded flex items-center gap-0.5 transition-colors ${
              isUnique
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-orange-600 text-gray-300'
            }`}
            title={isUnique ? 'Unique items cannot be sold' : `Sell for ${calculateSellValue(item)} gold`}
            aria-label={isUnique ? 'Cannot sell unique items' : `Sell ${item.name} for ${calculateSellValue(item)} gold`}
          >
            <GoldIcon size={10} />{isUnique ? '-' : calculateSellValue(item)}
          </button>
        </div>

        {/* Expand chevron */}
        <span className={`item-row-chevron flex-shrink-0 ml-0.5 text-gray-500 ${expanded ? 'item-row-chevron-open' : ''}`}>
          &#9662;
        </span>
      </div>

      {/* Expanded detail panel with slide animation */}
      <div className={`item-row-detail ${expanded ? 'item-row-detail-open' : ''}`}>
        <div className="min-h-0">
          <div
            className="px-3 py-2"
            style={{
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              borderLeft: `2px solid ${rarityData.color}40`,
              borderRight: '1px solid rgba(55, 65, 81, 0.3)',
              borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
              borderRadius: '0 0 0.25rem 0.25rem',
            }}
          >
            <EquipmentTooltip
              item={item}
              comparedItem={comparison?.currentItem}
              showComparison={!!comparison?.currentItem}
              hideHeader
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRow;
