import { useState, useEffect, useRef } from 'react';
import { useGameStore, calculateHeroStats } from '../store/gameStore';
import { canClassUseEquipment } from '../data/equipment';
import { PartyIcon } from './icons/ui';
import HeroSelector from './equipment/HeroSelector';
import CharacterTab from './equipment/CharacterTab';
import StatsSummary from './equipment/StatsSummary';
import InventoryGrid from './equipment/InventoryGrid';
import EquipmentSettings from './equipment/EquipmentSettings';

const EquipmentScreen = ({ selectedHeroId: externalHeroId, onSelectHero: externalSelectHero, selectedSlot: externalSlot, onSelectSlot: externalSetSlot, embedded } = {}) => {
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
    isUpgradeForAnyHero,
  } = useGameStore();

  const [internalHeroId, setInternalHeroId] = useState(heroes[0]?.id || null);
  const [internalSlot, setInternalSlot] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  const selectedHeroId = externalHeroId ?? internalHeroId;
  const setSelectedHeroId = externalSelectHero ?? setInternalHeroId;
  const selectedSlot = externalSetSlot ? externalSlot : internalSlot;
  const setSelectedSlot = externalSetSlot ?? setInternalSlot;

  // Click-outside to close settings dropdown
  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [settingsOpen]);

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
    <div className="flex flex-col" style={{ height: embedded ? '100%' : 'calc(100vh - 10rem)' }}>
      {/* Top bar: Hero selector + settings toggle (hidden when embedded) */}
      {!embedded && (
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <HeroSelector
              heroes={heroes}
              selectedHeroId={selectedHeroId}
              onSelectHero={handleSelectHero}
            />
          </div>

          {/* Settings gear toggle */}
          <div className="relative flex-shrink-0" ref={settingsRef}>
            <button
              className={`settings-toggle ${settingsOpen ? 'settings-toggle-open' : ''}`}
              onClick={() => setSettingsOpen(v => !v)}
              aria-expanded={settingsOpen}
              aria-label="Equipment settings"
            >
              &#9881; Settings
              <span className="settings-toggle-chevron">&#9662;</span>
            </button>

            {/* Dropdown panel */}
            {settingsOpen && (
              <div className="absolute right-0 top-full mt-1 z-30 w-80 pixel-panel p-2 settings-dropdown-enter">
                <EquipmentSettings
                  heroes={heroes}
                  equipmentSettings={equipmentSettings}
                  updateEquipmentSettings={updateEquipmentSettings}
                  setClassPriority={setClassPriority}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings toggle when embedded (inline, no hero selector) */}
      {embedded && (
        <div className="flex justify-end mb-1">
          <div className="relative flex-shrink-0" ref={settingsRef}>
            <button
              className={`settings-toggle ${settingsOpen ? 'settings-toggle-open' : ''}`}
              onClick={() => setSettingsOpen(v => !v)}
              aria-expanded={settingsOpen}
              aria-label="Equipment settings"
            >
              &#9881; Settings
              <span className="settings-toggle-chevron">&#9662;</span>
            </button>

            {settingsOpen && (
              <div className="absolute right-0 top-full mt-1 z-30 w-80 pixel-panel p-2 settings-dropdown-enter">
                <EquipmentSettings
                  heroes={heroes}
                  equipmentSettings={equipmentSettings}
                  updateEquipmentSettings={updateEquipmentSettings}
                  setClassPriority={setClassPriority}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Column layout: Hero (standalone only) | Inventory | Stats */}
      <div className="flex flex-1 min-h-0 mt-2 gap-0">
        {/* LEFT: Hero showcase (hidden when embedded — parent renders it) */}
        {!embedded && (
          <CharacterTab
            hero={selectedHero}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            onUnequip={unequipItem}
          />
        )}

        {/* CENTER: Inventory — always visible */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col border-x border-gray-700/20 bg-gray-900/20">
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
            isUpgradeForAnyHero={isUpgradeForAnyHero}
          />
        </div>

        {/* RIGHT: Stats dashboard — always visible */}
        <div className="w-[38%] min-w-[320px] flex-shrink-0 min-h-0 overflow-y-auto bg-gray-950/30 rounded-r-lg">
          <StatsSummary
            stats={stats}
            hero={selectedHero}
            allHeroes={heroes}
          />
        </div>
      </div>
    </div>
  );
};

export default EquipmentScreen;
