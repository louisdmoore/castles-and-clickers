import { useState, useMemo } from 'react';
import { WeaponSlotIcon, ArmorSlotIcon, AccessorySlotIcon } from '../icons/ItemIcon';
import ItemCard from './ItemCard';

const SLOT_ICONS = {
  weapon: WeaponSlotIcon,
  armor: ArmorSlotIcon,
  accessory: AccessorySlotIcon,
};

const SLOT_CONFIG = [
  { slot: 'weapon', label: 'Weapon' },
  { slot: 'armor', label: 'Armor' },
  { slot: 'accessory', label: 'Accessory' },
];

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
}) => {
  const [sortBy, setSortBy] = useState('rarity');

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
      if (sortBy === 'rarity') {
        const order = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
        return (order[a.rarity] || 5) - (order[b.rarity] || 5);
      }
      return 0;
    });
    return items;
  }, [inventory, selectedSlot, sortBy, selectedHero, compareToEquipped]);

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Header with filters */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <h4 className="text-white font-medium text-sm">
          Inventory <span className="text-gray-500">({inventory.length})</span>
        </h4>
        <button
          onClick={onSellAllJunk}
          className="px-2 py-0.5 bg-orange-600/80 hover:bg-orange-600 text-white text-[10px] rounded transition-colors"
        >
          Sell Junk
        </button>
        <div className="flex-1" />

        {/* Slot filters */}
        <div className="flex gap-1">
          <button
            onClick={() => onSelectSlot(null)}
            className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
              !selectedSlot ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          {SLOT_CONFIG.map(({ slot }) => {
            const SlotIcon = SLOT_ICONS[slot];
            return (
              <button
                key={slot}
                onClick={() => onSelectSlot(selectedSlot === slot ? null : slot)}
                className={`px-1.5 py-0.5 rounded flex items-center justify-center transition-colors ${
                  selectedSlot === slot ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
                aria-label={`Filter ${slot}s`}
              >
                <SlotIcon size={14} />
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 text-white text-[10px] rounded px-1 py-0.5 border-none"
        >
          <option value="rarity">Rarity</option>
          <option value="slot">Slot</option>
        </select>
      </div>

      {/* Grid of items */}
      <div className="flex-1 overflow-y-auto pr-1">
        {processedInventory.length === 0 ? (
          <div className="text-gray-500 text-center py-8 text-sm">
            {selectedSlot ? `No ${selectedSlot}s in inventory` : 'Inventory is empty'}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {processedInventory.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                canEquip={selectedHero && canClassUseEquipment(selectedHero.classId, item)}
                onEquip={onEquip}
                onSell={onSell}
                comparison={selectedHero ? compareToEquipped(item, selectedHero.id) : null}
                highestPartyLevel={highestPartyLevel}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryGrid;
