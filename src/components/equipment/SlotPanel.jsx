import { useState, useMemo } from 'react';
import ItemRow from './ItemRow';

const SLOT_LABELS = {
  weapon: 'Weapons',
  armor: 'Armor',
  accessory: 'Accessories',
};

const SlotPanel = ({
  slot,
  inventory,
  selectedHero,
  compareToEquipped,
  canClassUseEquipment,
  onEquip,
  onSell,
  onClose,
  highestPartyLevel,
}) => {
  const [sortBy, setSortBy] = useState('upgrade');
  const [expandedItemId, setExpandedItemId] = useState(null);

  const equippedItem = selectedHero?.equipment?.[slot] || null;

  const filteredItems = useMemo(() => {
    let items = inventory.filter(item => item.slot === slot);

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
      return 0;
    });
    return items;
  }, [inventory, slot, sortBy, selectedHero, compareToEquipped]);

  return (
    <div className="slot-panel-enter flex flex-col h-full bg-gray-950/90 rounded-lg border border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700/50">
        <h3 className="text-white font-medium text-sm flex-1">
          {SLOT_LABELS[slot] || slot}
          <span className="text-gray-500 ml-1.5 text-xs font-normal">({filteredItems.length})</span>
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 text-white text-[10px] rounded px-1.5 py-0.5 border-none"
        >
          <option value="upgrade">Upgrade</option>
          <option value="rarity">Rarity</option>
        </select>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-lg leading-none px-1 transition-colors"
          aria-label="Close slot panel"
        >
          &times;
        </button>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Pinned equipped item */}
        {equippedItem && (
          <div className="mb-1">
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
            <div className="border-b border-gray-700/50 mt-2 mb-1" />
            <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 px-1">
              Candidates ({filteredItems.length})
            </div>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="text-gray-500 text-center py-8 text-sm">
            No {SLOT_LABELS[slot]?.toLowerCase() || 'items'} in inventory
          </div>
        ) : (
          filteredItems.map(item => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default SlotPanel;
