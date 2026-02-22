import { CLASSES } from '../../data/classes';
import PaperDoll from './PaperDoll';
import StatsSummary from './StatsSummary';
import EquipmentSettings from './EquipmentSettings';
import SlotPanel from './SlotPanel';

const CharacterTab = ({
  hero,
  stats,
  allHeroes,
  selectedSlot,
  onSelectSlot,
  onUnequip,
  inventory,
  compareToEquipped,
  canClassUseEquipment,
  onEquip,
  onSell,
  equipmentSettings,
  updateEquipmentSettings,
  setClassPriority,
  highestPartyLevel,
}) => {
  if (!hero) return null;

  const classData = CLASSES[hero.classId];
  const hasSlotPanel = selectedSlot !== null;

  return (
    <div className="flex flex-1 min-h-0 gap-3">
      {/* Hero area — centered when no panel, left-aligned when panel open */}
      <div
        className={`flex flex-col items-center gap-4 overflow-y-auto transition-all duration-200 ${
          hasSlotPanel ? 'w-2/5 flex-shrink-0' : 'flex-1'
        }`}
      >
        {/* Hero name / class / level */}
        <div className="text-center mt-2">
          <h2 className="text-white text-lg font-bold leading-tight">{hero.name}</h2>
          <div className="text-gray-400 text-xs">
            Lv{hero.level} {classData?.name || hero.classId}
          </div>
        </div>

        {/* Paper doll with slots */}
        <PaperDoll
          hero={hero}
          selectedSlot={selectedSlot}
          onSelectSlot={onSelectSlot}
          onUnequip={onUnequip}
        />

        {/* Stats bar */}
        <div className="w-full max-w-md">
          <StatsSummary stats={stats} hero={hero} allHeroes={allHeroes} />
        </div>

        {/* Settings */}
        <div className="w-full max-w-md">
          <EquipmentSettings
            heroes={allHeroes}
            equipmentSettings={equipmentSettings}
            updateEquipmentSettings={updateEquipmentSettings}
            setClassPriority={setClassPriority}
          />
        </div>
      </div>

      {/* Slot panel — slides in from right */}
      {hasSlotPanel && (
        <div className="w-3/5 flex-shrink-0 min-h-0">
          <SlotPanel
            slot={selectedSlot}
            inventory={inventory}
            selectedHero={hero}
            compareToEquipped={compareToEquipped}
            canClassUseEquipment={canClassUseEquipment}
            onEquip={onEquip}
            onSell={onSell}
            onClose={() => onSelectSlot(null)}
            highestPartyLevel={highestPartyLevel}
          />
        </div>
      )}
    </div>
  );
};

export default CharacterTab;
