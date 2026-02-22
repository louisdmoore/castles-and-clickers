import { useState } from 'react';
import { useGameStore, calculateHeroStats } from '../store/gameStore';
import { canClassUseEquipment } from '../data/equipment';
import { PartyIcon } from './icons/ui';
import HeroSelector from './equipment/HeroSelector';
import CharacterTab from './equipment/CharacterTab';
import InventoryGrid from './equipment/InventoryGrid';

const EquipmentScreen = () => {
  const {
    heroes,
    inventory,
    equipItem,
    unequipItem,
    sellItem,
    sellAllJunk,
    equipmentSettings,
    updateEquipmentSettings,
    setClassPriority,
    compareToEquipped,
  } = useGameStore();

  const [selectedHeroId, setSelectedHeroId] = useState(heroes[0]?.id || null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeTab, setActiveTab] = useState('character');
  const [inventorySlotFilter, setInventorySlotFilter] = useState(null);

  const selectedHero = heroes.find(h => h.id === selectedHeroId);
  const stats = selectedHero ? calculateHeroStats(selectedHero, heroes) : null;
  const highestPartyLevel = heroes.length > 0 ? Math.max(...heroes.map(h => h.level)) : 1;

  const handleSelectHero = (heroId) => {
    setSelectedHeroId(heroId);
    setSelectedSlot(null);
  };

  const handleEquip = (item) => {
    if (!selectedHero || !canClassUseEquipment(selectedHero.classId, item)) return;
    equipItem(selectedHero.id, item);
  };

  if (heroes.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8 flex items-center justify-center gap-2">
        <PartyIcon size={24} /> Recruit heroes first!
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] max-h-[85vh]">
      {/* Hero tabs */}
      <HeroSelector
        heroes={heroes}
        selectedHeroId={selectedHeroId}
        onSelectHero={handleSelectHero}
      />

      {/* Tab switcher */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => setActiveTab('character')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            activeTab === 'character'
              ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
          }`}
        >
          Character
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
            activeTab === 'inventory'
              ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50'
              : 'bg-gray-800 text-gray-400 border border-gray-700 hover:text-white'
          }`}
        >
          Inventory
          <span className="text-gray-500 ml-1">({inventory.length})</span>
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 mt-2">
        {activeTab === 'character' ? (
          <CharacterTab
            hero={selectedHero}
            stats={stats}
            allHeroes={heroes}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            onUnequip={unequipItem}
            inventory={inventory}
            compareToEquipped={compareToEquipped}
            canClassUseEquipment={canClassUseEquipment}
            onEquip={handleEquip}
            onSell={sellItem}
            equipmentSettings={equipmentSettings}
            updateEquipmentSettings={updateEquipmentSettings}
            setClassPriority={setClassPriority}
            highestPartyLevel={highestPartyLevel}
          />
        ) : (
          <InventoryGrid
            inventory={inventory}
            selectedSlot={inventorySlotFilter}
            onSelectSlot={setInventorySlotFilter}
            selectedHero={selectedHero}
            compareToEquipped={compareToEquipped}
            canClassUseEquipment={canClassUseEquipment}
            onEquip={handleEquip}
            onSell={sellItem}
            onSellAllJunk={sellAllJunk}
            highestPartyLevel={highestPartyLevel}
          />
        )}
      </div>
    </div>
  );
};

export default EquipmentScreen;
