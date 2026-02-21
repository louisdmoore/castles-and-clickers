import { useState } from 'react';
import { useGameStore, calculateHeroStats } from '../store/gameStore';
import { canClassUseEquipment } from '../data/equipment';
import { PartyIcon } from './icons/ui';
import HeroSelector from './equipment/HeroSelector';
import PaperDoll from './equipment/PaperDoll';
import StatsSummary from './equipment/StatsSummary';
import InventoryGrid from './equipment/InventoryGrid';
import EquipmentSettings from './equipment/EquipmentSettings';

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
      {/* Hero tabs - top bar */}
      <HeroSelector
        heroes={heroes}
        selectedHeroId={selectedHeroId}
        onSelectHero={handleSelectHero}
      />

      {/* Three-column layout */}
      <div className="flex gap-3 mt-3 flex-1 min-h-0">
        {/* LEFT: Stats + Settings */}
        <div className="hidden md:flex w-48 flex-shrink-0 flex-col gap-2 overflow-y-auto">
          <StatsSummary stats={stats} hero={selectedHero} allHeroes={heroes} />

          {/* Synergies placeholder for Phase 3 */}

          <div className="mt-auto">
            <EquipmentSettings
              heroes={heroes}
              equipmentSettings={equipmentSettings}
              updateEquipmentSettings={updateEquipmentSettings}
              setClassPriority={setClassPriority}
            />
          </div>
        </div>

        {/* CENTER: Paper Doll */}
        <div className="hidden md:flex w-56 flex-shrink-0 flex-col items-center pt-2">
          <PaperDoll
            hero={selectedHero}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            onUnequip={unequipItem}
          />
        </div>

        {/* MOBILE: Combined stats + paper doll (visible only on small screens) */}
        <div className="flex md:hidden flex-col gap-2 w-full mb-2">
          <div className="flex gap-3">
            <div className="flex-1">
              <StatsSummary stats={stats} hero={selectedHero} allHeroes={heroes} />
            </div>
            <PaperDoll
              hero={selectedHero}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              onUnequip={unequipItem}
            />
          </div>
        </div>

        {/* RIGHT: Inventory Grid */}
        <InventoryGrid
          inventory={inventory}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          selectedHero={selectedHero}
          compareToEquipped={compareToEquipped}
          canClassUseEquipment={canClassUseEquipment}
          onEquip={handleEquip}
          onSell={sellItem}
          onSellAllJunk={sellAllJunk}
          highestPartyLevel={highestPartyLevel}
        />
      </div>
    </div>
  );
};

export default EquipmentScreen;
