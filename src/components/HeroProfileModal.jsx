import { useState, useMemo, useCallback } from 'react';
import { useGameStore, calculateSkillPoints, calculateUsedSkillPoints } from '../store/gameStore';
import { PARTY_SLOTS, ROLE_INFO, getClassesByRole } from '../data/classes';
import { TreeIcon, BagIcon } from './icons/ui';
import HeroSelector from './equipment/HeroSelector';
import CharacterTab from './equipment/CharacterTab';
import EquipmentScreen from './EquipmentScreen';
import SkillTreeScreen from './SkillTreeScreen';

const BASE_RECRUIT_COSTS = { tank: 100, healer: 150, dps: 200 };

const TAB_DEFS = [
  { id: 'gear', label: 'Gear', Icon: BagIcon },
  { id: 'skills', label: 'Skills', Icon: TreeIcon },
];

const HeroProfileModal = ({ initialTab = 'gear' }) => {
  const heroes = useGameStore(state => state.heroes);
  const gold = useGameStore(state => state.gold);
  const maxPartySize = useGameStore(state => state.maxPartySize);
  const usedSlotDiscounts = useGameStore(state => state.usedSlotDiscounts);
  const dungeon = useGameStore(state => state.dungeon);
  const pendingRecruits = useGameStore(state => state.pendingRecruits);
  const addHero = useGameStore(state => state.addHero);
  const spendGold = useGameStore(state => state.spendGold);
  const unequipItem = useGameStore(state => state.unequipItem);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedHeroId, setSelectedHeroId] = useState(() => {
    const first = heroes.find(Boolean);
    return first?.id || null;
  });
  const [selectedSlot, setSelectedSlot] = useState(null);

  const selectedHero = heroes.find(h => h.id === selectedHeroId) || null;

  // Skill points badge
  const totalAvailableSkillPoints = useMemo(() => {
    return heroes.filter(Boolean).reduce((sum, hero) => {
      const total = calculateSkillPoints(hero.level);
      const used = calculateUsedSkillPoints(hero);
      return sum + (total - used);
    }, 0);
  }, [heroes]);

  // Skill points for the selected hero only
  const selectedHeroSkillPoints = useMemo(() => {
    if (!selectedHero) return 0;
    return calculateSkillPoints(selectedHero.level) - calculateUsedSkillPoints(selectedHero);
  }, [selectedHero]);

  const getTabBadge = (tabId) => {
    if (tabId === 'skills' && selectedHeroSkillPoints > 0) return selectedHeroSkillPoints;
    return null;
  };

  // Next recruitable slot
  const recruitSlot = useMemo(() => {
    const pendingSlots = new Set(pendingRecruits.map(p => p.slotIndex));
    for (let i = 0; i < maxPartySize && i < PARTY_SLOTS.length; i++) {
      if (!heroes[i] && !pendingSlots.has(i)) {
        const slot = PARTY_SLOTS[i];
        if (!slot) continue;
        const discountUsed = usedSlotDiscounts.includes(i);
        const cost = discountUsed
          ? BASE_RECRUIT_COSTS[slot.role] || 150
          : slot.cost;
        const roleInfo = slot.role ? ROLE_INFO[slot.role] : null;
        return {
          index: i,
          cost,
          roleName: slot.flex ? 'Any Class' : roleInfo?.name || 'Hero',
          classes: getClassesByRole(slot.role || null),
          canAfford: gold >= cost,
          isDungeon: !!dungeon,
        };
      }
    }
    return null;
  }, [heroes, maxPartySize, gold, usedSlotDiscounts, pendingRecruits, dungeon]);

  const handleRecruit = useCallback((classId, slotIndex) => {
    const slot = PARTY_SLOTS[slotIndex];
    if (!slot) return;
    const discountUsed = usedSlotDiscounts.includes(slotIndex);
    const cost = discountUsed
      ? BASE_RECRUIT_COSTS[slot.role] || 150
      : slot.cost;
    if (cost > 0) {
      if (gold < cost) return;
      if (!spendGold(cost)) return;
    }
    addHero(classId, null, slotIndex);
  }, [gold, usedSlotDiscounts, spendGold, addHero]);

  const handleSelectHero = useCallback((heroId) => {
    setSelectedHeroId(heroId);
    setSelectedSlot(null);
  }, []);

  const handleSwitchTab = useCallback((tabId) => {
    setActiveTab(tabId);
    setSelectedSlot(null);
  }, []);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 10rem)' }}>
      {/* Hero Selector + Recruit */}
      <div className="flex-shrink-0 mb-1">
        <HeroSelector
          heroes={heroes}
          selectedHeroId={selectedHeroId}
          onSelectHero={handleSelectHero}
          recruitSlot={recruitSlot}
          onRecruit={handleRecruit}
        />
      </div>

      {/* Content: persistent paper doll + (tabs + tab content) */}
      <div className="flex flex-1 min-h-0 gap-0">
        {/* LEFT: Paper doll — always visible */}
        {selectedHero && (
          <CharacterTab
            hero={selectedHero}
            selectedSlot={activeTab === 'gear' ? selectedSlot : null}
            onSelectSlot={setSelectedSlot}
            onUnequip={unequipItem}
          />
        )}

        {/* RIGHT: Tab bar + content */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col">
          {/* Tab bar — spans the right content area */}
          <div className="flex flex-shrink-0 gap-1 p-1 mb-1">
            {TAB_DEFS.map(tab => {
              const badge = getTabBadge(tab.id);
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSwitchTab(tab.id)}
                  className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors pixel-btn
                    ${isActive
                      ? 'pixel-btn-primary'
                      : ''
                    }`}
                >
                  <tab.Icon size={18} />
                  <span>{tab.label}</span>
                  {badge != null && (
                    <span className="pixel-badge text-[10px] ml-1">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTab === 'gear' && (
              <EquipmentScreen
                selectedHeroId={selectedHeroId}
                onSelectHero={handleSelectHero}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                embedded
              />
            )}
            {activeTab === 'skills' && (
              <div className="h-full overflow-y-auto">
                <SkillTreeScreen
                  selectedHeroId={selectedHeroId}
                  onSelectHero={handleSelectHero}
                  embedded
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProfileModal;
