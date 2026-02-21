import ItemIcon from '../icons/ItemIcon';
import { GoldIcon, StarIcon, ArrowUpIcon, SparkleIcon } from '../icons/ui';
import Tooltip from '../ui/Tooltip';
import EquipmentTooltip from '../ui/EquipmentTooltip';
import { getRarityBorderClass } from '../../utils/rarityStyles';
import { ITEM_AFFIXES } from '../../data/itemAffixes';
import { calculateSellValue } from '../../store/gameStore';
import { scaleUniqueStats } from '../../data/uniqueItems';

// Get display stats for an item, scaling unique items based on highest party level
const getItemDisplayStats = (item, highestPartyLevel) => {
  if (item?.isUnique && item?.baseStats) {
    return scaleUniqueStats(item.baseStats, highestPartyLevel);
  }
  return item?.stats || {};
};

const ItemCard = ({ item, canEquip, onEquip, onSell, comparison, highestPartyLevel }) => {
  const isUnique = item?.isUnique;
  const isBetter = comparison?.isBetter;
  const rarityClass = getRarityBorderClass(item);
  const displayStats = getItemDisplayStats(item, highestPartyLevel);
  const affixes = (item?.affixes || [])
    .map(id => ITEM_AFFIXES[id])
    .filter(Boolean);

  const tooltipContent = (
    <EquipmentTooltip
      item={item}
      comparedItem={comparison?.currentItem}
      showComparison={!!comparison?.currentItem}
    />
  );

  return (
    <Tooltip content={tooltipContent} position="left" delay={300}>
      <div
        className={`group relative rounded p-2 flex flex-col items-center gap-1 transition-all cursor-default
          ${rarityClass}
          ${isBetter ? 'bg-green-500/5' : 'bg-gray-900/80'}
          ${!canEquip ? 'opacity-50' : ''}
          hover:brightness-110
        `}
      >
        {/* Upgrade arrow */}
        {isBetter && (
          <div className="absolute -top-1 -right-1 z-10">
            <ArrowUpIcon size={12} />
          </div>
        )}

        {/* Item icon */}
        <div className="w-10 h-10 flex items-center justify-center relative">
          <ItemIcon item={item} size={28} />
          {isUnique && (
            <div className="absolute -top-1 -right-1">
              <StarIcon size={10} className="text-cyan-400 unique-sparkle" />
            </div>
          )}
        </div>

        {/* Item name */}
        <div
          className={`text-[10px] font-medium text-center leading-tight truncate w-full ${isUnique ? 'unique-text-shimmer' : ''}`}
          style={isUnique ? {} : { color: item.rarityColor }}
          title={item.name}
        >
          {item.name}
        </div>

        {/* Stats line */}
        <div className="text-[9px] text-gray-500 text-center leading-tight">
          {Object.entries(displayStats).map(([s, v]) =>
            `+${v} ${s.replace('maxHp', 'HP')}`
          ).join(' ')}
        </div>

        {/* Affix dots */}
        {affixes.length > 0 && !isUnique && (
          <div className="flex gap-0.5 mt-0.5">
            {affixes.map((affix, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: '#a855f7' }}
                title={affix.name}
              />
            ))}
          </div>
        )}

        {/* Unique power indicator */}
        {isUnique && item.uniquePower && (
          <div className="text-[8px] unique-text-shimmer text-center truncate w-full" title={item.uniquePower.name}>
            {item.uniquePower.name}
          </div>
        )}

        {/* Action buttons - visible on hover */}
        <div className="flex gap-1 mt-auto pt-1 opacity-0 group-hover:opacity-100 transition-opacity w-full">
          {canEquip && (
            <button
              onClick={(e) => { e.stopPropagation(); onEquip(item); }}
              className={`flex-1 px-1 py-0.5 text-white text-[9px] rounded font-medium ${
                isBetter ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              Equip
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); !isUnique && onSell(item.id); }}
            className={`px-1 py-0.5 text-[9px] rounded flex items-center gap-0.5 ${
              isUnique
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                : 'bg-gray-700 hover:bg-orange-600 text-gray-300'
            }`}
            title={isUnique ? 'Unique items cannot be sold' : `Sell for ${calculateSellValue(item)} gold`}
          >
            <GoldIcon size={8} />{isUnique ? '-' : calculateSellValue(item)}
          </button>
        </div>
      </div>
    </Tooltip>
  );
};

export default ItemCard;
