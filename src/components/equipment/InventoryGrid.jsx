import { useState, useMemo } from 'react';
import { WeaponSlotIcon, ArmorSlotIcon, AccessorySlotIcon } from '../icons/ItemIcon';
import { GoldIcon } from '../icons/ui';
import ItemRow from './ItemRow';

const SLOT_ICONS = {
  weapon: WeaponSlotIcon,
  armor: ArmorSlotIcon,
  accessory: AccessorySlotIcon,
};

const SLOT_CONFIG = [
  { slot: 'weapon', label: 'Weapon', short: 'Wpn' },
  { slot: 'armor', label: 'Armor', short: 'Arm' },
  { slot: 'accessory', label: 'Accessory', short: 'Acc' },
];

const SLOT_LABELS = {
  weapon: 'Weapons',
  armor: 'Armor',
  accessory: 'Accessories',
};

const InventoryGrid = ({
  inventory,
  selectedSlot,
  onSelectSlot,
  selectedHero,
  compareToEquipped,
  canClassUseEquipment,
  onEquip,
  onSell,
  onSellAllJunk,
  highestPartyLevel,
  isUpgradeForAnyHero,
}) => {
  const [sortBy, setSortBy] = useState('rarity');
  const [expandedItemId, setExpandedItemId] = useState(null);

  const equippedItem = (selectedSlot && selectedHero?.equipment?.[selectedSlot]) || null;

  const junkCount = useMemo(() => {
    return inventory.filter(item => !item.isUnique && !isUpgradeForAnyHero(item).isUpgrade).length;
  }, [inventory, isUpgradeForAnyHero]);

  const processedInventory = useMemo(() => {
    let items = [...inventory];
    if (selectedSlot) items = items.filter(item => item.slot === selectedSlot);

    const getUpgradeStatus = (item) => {
      if (!selectedHero) return false;
      return compareToEquipped(item, selectedHero.id)?.isBetter || false;
    };

    items.sort((a, b) => {
      const aUp = getUpgradeStatus(a), bUp = getUpgradeStatus(b);
      if (aUp !== bUp) return aUp ? -1 : 1;
      if (sortBy === 'upgrade') {
        const getScoreDiff = (item) => {
          if (!selectedHero) return 0;
          return compareToEquipped(item, selectedHero.id)?.scoreDiff || 0;
        };
        return getScoreDiff(b) - getScoreDiff(a);
      }
      if (sortBy === 'rarity') {
        const order = { unique: 0, legendary: 1, epic: 2, rare: 3, uncommon: 4, common: 5 };
        const aKey = a.isUnique ? 'unique' : a.rarity;
        const bKey = b.isUnique ? 'unique' : b.rarity;
        return (order[aKey] ?? 6) - (order[bKey] ?? 6);
      }
      if (sortBy === 'slot') {
        const slotOrder = { weapon: 0, armor: 1, accessory: 2 };
        return (slotOrder[a.slot] || 3) - (slotOrder[b.slot] || 3);
      }
      return 0;
    });
    return items;
  }, [inventory, selectedSlot, sortBy, selectedHero, compareToEquipped]);

  return (
    <div className="flex-1 flex flex-col min-w-0 min-h-0">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700/30 flex-wrap">
        {selectedSlot ? (
          <>
            <h4 className="text-white font-medium text-sm flex-1">
              {SLOT_LABELS[selectedSlot] || selectedSlot}
              <span className="text-gray-500 ml-1.5 text-xs font-normal">({processedInventory.length})</span>
            </h4>
            <button
              onClick={() => onSelectSlot(null)}
              className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              Show All
            </button>
          </>
        ) : (
          <>
            <h4 className="text-white font-medium text-sm">
              Inventory <span className="text-gray-500">({inventory.length})</span>
            </h4>
            <button
              onClick={onSellAllJunk}
              disabled={junkCount === 0}
              className={`px-2 py-0.5 text-white text-[10px] rounded flex items-center gap-1 transition-colors ${
                junkCount === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-orange-600/80 hover:bg-orange-600'
              }`}
            >
              <GoldIcon size={10} /> Sell Junk ({junkCount})
            </button>
          </>
        )}

        <div className="flex-1" />

        {/* Slot filter chips */}
        <div className="flex gap-1">
          {!selectedSlot && (
            <button
              className="px-1.5 py-0.5 text-[10px] rounded bg-blue-600 text-white"
              disabled
            >
              All
            </button>
          )}
          {SLOT_CONFIG.map(({ slot, short }) => {
            const SlotIcon = SLOT_ICONS[slot];
            const isActive = selectedSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => onSelectSlot(isActive ? null : slot)}
                className={`px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-gray-700/50 text-gray-400 hover:text-white'
                }`}
                aria-label={`Filter ${slot}s`}
              >
                <SlotIcon size={12} />
                <span className="text-[10px]">{short}</span>
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 text-white text-[10px] rounded px-1 py-0.5 border-none"
        >
          <option value="rarity">Rarity</option>
          <option value="upgrade">Upgrade</option>
          <option value="slot">Slot</option>
        </select>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto px-2 py-1.5">
        {/* Pinned equipped item when slot is selected */}
        {selectedSlot && equippedItem && (
          <div className="mb-2">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 px-1">Equipped</div>
            <ItemRow
              item={equippedItem}
              canEquip={false}
              onEquip={onEquip}
              onSell={onSell}
              comparison={null}
              highestPartyLevel={highestPartyLevel}
              expanded={expandedItemId === equippedItem.id}
              onToggleExpand={(id) => setExpandedItemId(prev => prev === id ? null : id)}
              isEquipped={true}
            />
            <div className="border-b border-gray-700/30 mt-2 mb-1.5" />
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 px-1">
              Candidates ({processedInventory.length})
            </div>
          </div>
        )}

        {processedInventory.length === 0 ? (
          <div className="text-gray-500 text-center py-8 text-sm">
            {selectedSlot ? `No ${SLOT_LABELS[selectedSlot]?.toLowerCase() || 'items'} in inventory` : 'Inventory is empty'}
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {processedInventory.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                canEquip={selectedHero && canClassUseEquipment(selectedHero.classId, item)}
                onEquip={onEquip}
                onSell={onSell}
                comparison={selectedHero ? compareToEquipped(item, selectedHero.id) : null}
                highestPartyLevel={highestPartyLevel}
                expanded={expandedItemId === item.id}
                onToggleExpand={(id) => setExpandedItemId(prev => prev === id ? null : id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryGrid;
