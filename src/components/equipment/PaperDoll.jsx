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
    <Tooltip content={tooltipContent} position="right" delay={300} disabled={!item}>
      <button
        onClick={onClick}
        aria-label={`${SLOT_LABELS[slot]} slot${item ? `: ${item.name}` : ' (empty)'}`}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group
          ${isSelected ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-gray-900 bg-gray-800/60' : 'hover:bg-gray-800/40'}
        `}
      >
        {/* Slot icon box */}
        <div
          className={`w-12 h-12 rounded-md flex items-center justify-center relative flex-shrink-0 transition-all
            ${item ? `${rarityClass} hover:brightness-110` : 'border-2 border-dashed border-gray-600 bg-gray-900/50 group-hover:border-gray-400'}
            ${item && !isUnique ? 'bg-gray-900/80' : ''}
            ${isUnique ? 'unique-shimmer' : ''}
          `}
          style={item && !isUnique ? { backgroundColor: (item.rarityColor || '#9ca3af') + '10' } : {}}
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
            <SlotIcon size={22} />
          )}
        </div>

        {/* Label + item name */}
        <div className="flex flex-col items-start min-w-0">
          <span className="text-[11px] text-gray-500 uppercase tracking-wider leading-none font-medium">{SLOT_LABELS[slot]}</span>
          <span className={`text-sm truncate max-w-[140px] leading-tight mt-0.5 ${item ? 'text-gray-200' : 'text-gray-600'}`}>
            {item ? item.name : 'Empty'}
          </span>
        </div>
      </button>
    </Tooltip>
  );
};

const ROLE_ACCENT = { tank: '#60a5fa', healer: '#4ade80', dps: '#f87171' };

const PaperDoll = ({ hero, selectedSlot, onSelectSlot, onUnequip, role, compact = false }) => {
  if (!hero) return null;

  const handleSlotClick = (slot) => {
    onSelectSlot(selectedSlot === slot ? null : slot);
  };

  const accent = ROLE_ACCENT[role] || '#9ca3af';

  const portraitSize = compact ? 'w-32 h-32' : 'w-56 h-56';
  const iconSize = compact ? 96 : 176;
  const haloSize = compact ? 200 : 340;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Portrait with halo */}
      <div className="relative flex items-center justify-center">
        {/* Halo — behind portrait */}
        <div
          className="portrait-halo"
          style={{
            width: haloSize,
            height: haloSize,
            '--atmo-accent-strong': accent + '30',
            '--atmo-accent-mid': accent + '20',
          }}
        />

        {/* Portrait */}
        <div
          className={`${portraitSize} rounded-lg portrait-frame portrait-ambient flex items-center justify-center relative z-[1]`}
          style={{
            '--portrait-glow': accent + '40',
            '--portrait-glow-soft': accent + '20',
          }}
        >
          <HeroIcon classId={hero.classId} equipment={hero.equipment} size={iconSize} />
        </div>
      </div>

      {/* Equipment slots — vertical stack */}
      <div className="w-full max-w-[240px] flex flex-col gap-1.5">
        <EquipSlot
          slot="weapon"
          item={hero.equipment.weapon}
          isSelected={selectedSlot === 'weapon'}
          onClick={() => handleSlotClick('weapon')}
        />
        <EquipSlot
          slot="armor"
          item={hero.equipment.armor}
          isSelected={selectedSlot === 'armor'}
          onClick={() => handleSlotClick('armor')}
        />
        <EquipSlot
          slot="accessory"
          item={hero.equipment.accessory}
          isSelected={selectedSlot === 'accessory'}
          onClick={() => handleSlotClick('accessory')}
        />
      </div>

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
