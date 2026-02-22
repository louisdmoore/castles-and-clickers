import HeroIcon from '../icons/HeroIcon';
import ItemIcon, { WeaponSlotIcon, ArmorSlotIcon, AccessorySlotIcon } from '../icons/ItemIcon';
import { StarIcon } from '../icons/ui';
import Tooltip from '../ui/Tooltip';
import EquipmentTooltip from '../ui/EquipmentTooltip';
import { getRarityBorderClass } from '../../utils/rarityStyles';

const SLOT_ICONS = {
  weapon: WeaponSlotIcon,
  armor: ArmorSlotIcon,
  accessory: AccessorySlotIcon,
};

const SLOT_LABELS = {
  weapon: 'Weapon',
  armor: 'Armor',
  accessory: 'Accessory',
};

const EquipSlot = ({ slot, item, isSelected, onClick }) => {
  const SlotIcon = SLOT_ICONS[slot];
  const isUnique = item?.isUnique;
  const rarityClass = item ? getRarityBorderClass(item) : '';

  const tooltipContent = item ? <EquipmentTooltip item={item} /> : null;

  return (
    <Tooltip content={tooltipContent} position="bottom" delay={300} disabled={!item}>
      <button
        onClick={onClick}
        aria-label={`${SLOT_LABELS[slot]} slot${item ? `: ${item.name}` : ' (empty)'}`}
        className={`w-16 h-16 rounded flex items-center justify-center relative transition-all
          ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-gray-900' : ''}
          ${item ? rarityClass : 'border-2 border-dashed border-gray-600 bg-gray-900/50 hover:border-gray-400'}
          ${item && !isUnique ? 'bg-gray-900/80' : ''}
          ${isUnique ? 'unique-shimmer' : ''}
        `}
        style={item && !isUnique && !item.quality ? { backgroundColor: (item.rarityColor || '#9ca3af') + '10' } : {}}
      >
        {item ? (
          <>
            <ItemIcon item={item} size={28} />
            {isUnique && (
              <div className="absolute -top-1 -right-1 z-10">
                <StarIcon size={10} className="text-cyan-400 unique-sparkle" />
              </div>
            )}
          </>
        ) : (
          <SlotIcon size={24} />
        )}
      </button>
    </Tooltip>
  );
};

const PaperDoll = ({ hero, selectedSlot, onSelectSlot, onUnequip }) => {
  if (!hero) return null;

  const handleSlotClick = (slot) => {
    onSelectSlot(selectedSlot === slot ? null : slot);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Top row: Weapon — Portrait — Accessory */}
      <div className="flex items-center gap-6">
        <EquipSlot
          slot="weapon"
          item={hero.equipment.weapon}
          isSelected={selectedSlot === 'weapon'}
          onClick={() => handleSlotClick('weapon')}
        />

        {/* Large hero portrait */}
        <div className="w-24 h-24 rounded-lg border-2 border-gray-600 bg-gray-900/50 flex items-center justify-center">
          <HeroIcon classId={hero.classId} equipment={hero.equipment} size={72} />
        </div>

        <EquipSlot
          slot="accessory"
          item={hero.equipment.accessory}
          isSelected={selectedSlot === 'accessory'}
          onClick={() => handleSlotClick('accessory')}
        />
      </div>

      {/* Armor centered below */}
      <EquipSlot
        slot="armor"
        item={hero.equipment.armor}
        isSelected={selectedSlot === 'armor'}
        onClick={() => handleSlotClick('armor')}
      />

      {/* Unequip button */}
      {selectedSlot && hero.equipment[selectedSlot] && (
        <button
          onClick={() => { onUnequip(hero.id, selectedSlot); onSelectSlot(null); }}
          className="bg-red-600/80 hover:bg-red-600 text-white py-1.5 px-6 rounded text-xs font-medium transition-colors"
        >
          Unequip {SLOT_LABELS[selectedSlot]}
        </button>
      )}
    </div>
  );
};

export default PaperDoll;
