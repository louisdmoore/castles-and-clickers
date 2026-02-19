import { useGameStore } from '../store/gameStore';
import { BUILDINGS, getUpgradeCost, getBuildingBonus, getBuildingList, getNextUnlock, getUnlocksAtLevel } from '../data/homestead';
import {
  CastleIcon, GoldIcon, HeartIcon, SwordIcon, ShieldIcon, ChartIcon,
  BookIcon, RegenIcon, BarracksIcon, ArmoryIcon, FortressIcon,
  TrainingIcon, TreasuryIcon, AcademyIcon, InfirmaryIcon, StarIcon, CheckIcon
} from './icons/ui';
import HelpTooltip from './ui/HelpTooltip';

// Map building IDs to icon components
const BUILDING_ICONS = {
  barracks: BarracksIcon,
  armory: ArmoryIcon,
  fortress: FortressIcon,
  trainingGrounds: TrainingIcon,
  treasury: TreasuryIcon,
  library: AcademyIcon,
  infirmary: InfirmaryIcon,
};

// Map stat types to icon components
const STAT_ICONS = {
  barracks: SwordIcon,
  armory: ShieldIcon,
  fortress: HeartIcon,
  trainingGrounds: ChartIcon,
  treasury: GoldIcon,
  library: BookIcon,
  infirmary: RegenIcon,
};

const HomesteadScreen = () => {
  const gold = useGameStore(state => state.gold);
  const homestead = useGameStore(state => state.homestead);
  const upgradeBuilding = useGameStore(state => state.upgradeBuilding);
  const buildings = getBuildingList();

  const handleUpgrade = (buildingId) => {
    upgradeBuilding(buildingId);
  };

  const formatBonus = (building, level) => {
    const bonus = getBuildingBonus(building, level);
    const effect = building.effect;

    switch (effect.type) {
      case 'hp':
        return `+${Math.round(bonus * 100)}% HP`;
      case 'attack':
        return `+${Math.round(bonus * 100)}% Attack`;
      case 'defense':
        return `+${Math.round(bonus * 100)}% Defense`;
      case 'xpGain':
        return `+${Math.round(bonus * 100)}% XP`;
      case 'goldFind':
        return `+${Math.round(bonus * 100)}% Gold`;
      case 'healBetweenRooms':
        return `+${(bonus * 100).toFixed(1)}% Regen`;
      case 'bestiaryDepth':
        return `+${Math.round(bonus)} depth`;
      default:
        return `+${Math.round(bonus * 100)}%`;
    }
  };

  const formatNextBonus = (building) => {
    const perLevel = building.effect.valuePerLevel;
    switch (building.effect.type) {
      case 'bestiaryDepth':
        return `+${perLevel} depth`;
      case 'healBetweenRooms':
        return `+${(perLevel * 100).toFixed(1)}%`;
      default:
        return `+${Math.round(perLevel * 100)}%`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CastleIcon size={24} /> Homestead
          <HelpTooltip content={
            <div className="space-y-1">
              <div>Buildings provide permanent bonuses to all heroes.</div>
              <div>Level up buildings to unlock new features and party slots.</div>
              <div>Unlocks at Dungeon 3.</div>
            </div>
          } />
        </h2>
        <div className="text-yellow-400 font-bold flex items-center gap-1">
          <GoldIcon size={18} /> {gold.toLocaleString()} gold
        </div>
      </div>

      <p className="text-gray-400 text-sm">
        Upgrade buildings to gain permanent bonuses and unlock new features.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {buildings.map(building => {
          const currentLevel = homestead[building.id] || 0;
          const isMaxed = currentLevel >= building.maxLevel;
          const cost = isMaxed ? 0 : getUpgradeCost(building, currentLevel);
          const canAfford = gold >= cost;
          const nextUnlock = getNextUnlock(building, currentLevel);
          const achievedUnlocks = getUnlocksAtLevel(building, currentLevel);

          return (
            <div
              key={building.id}
              className={`pixel-panel-dark p-4 border-2 transition-all ${
                isMaxed
                  ? 'border-yellow-500/50'
                  : canAfford
                  ? 'border-green-500/30 hover:border-green-500/60'
                  : 'border-gray-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                {(() => {
                  const BuildingIcon = BUILDING_ICONS[building.id] || CastleIcon;
                  return <BuildingIcon size={40} />;
                })()}
                <div className="flex-1">
                  <div className="text-white font-bold">{building.name}</div>
                  <div className="text-xs text-gray-500">
                    Level {currentLevel}/{building.maxLevel}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-3">{building.description}</p>

              {/* Current Bonus */}
              {currentLevel > 0 && (
                <div className="pixel-panel px-3 py-2 mb-3">
                  <span className="text-gray-500 text-xs">Current: </span>
                  <span className="text-green-400 font-bold">
                    {formatBonus(building, currentLevel)}
                  </span>
                </div>
              )}

              {/* Level Progress Bar */}
              <div className="h-2 bg-gray-700 rounded-full mb-3 overflow-hidden">
                <div
                  className={`h-full transition-all ${isMaxed ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  style={{ width: `${(currentLevel / building.maxLevel) * 100}%` }}
                />
              </div>

              {/* Next Unlock Preview */}
              {nextUnlock && (
                <div className="pixel-panel p-2 mb-3">
                  <div className="text-[10px] text-[var(--color-text-dim)]">
                    Next at Lv{nextUnlock.level}:
                  </div>
                  <div className="text-xs" style={{ color: '#fbbf24' }}>
                    {nextUnlock.label}
                  </div>
                </div>
              )}

              {/* Achieved Unlocks */}
              {achievedUnlocks.length > 0 && (
                <div className="mb-2">
                  {achievedUnlocks.map(u => (
                    <div key={u.level} className="flex items-center gap-1 text-[10px] text-green-400">
                      <CheckIcon size={8} /> {u.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Upgrade Button */}
              {isMaxed ? (
                <div className="text-center text-yellow-400 font-bold py-2 flex items-center justify-center gap-1">
                  <StarIcon size={16} /> MAX LEVEL <StarIcon size={16} />
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(building.id)}
                  disabled={!canAfford}
                  className={`pixel-btn w-full py-2 px-4 font-bold transition-all ${
                    canAfford
                      ? 'pixel-btn-primary'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Upgrade</span>
                    <span className="text-yellow-300 flex items-center gap-1">
                      <GoldIcon size={14} /> {cost.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs opacity-75">
                    {formatNextBonus(building)}
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Total Bonuses Summary */}
      <div className="pixel-panel-dark p-4 mt-6">
        <h3 className="text-white font-bold mb-3 flex items-center gap-2">
          <ChartIcon size={20} /> Total Bonuses
        </h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { id: 'barracks', label: 'Attack' },
            { id: 'armory', label: 'Defense' },
            { id: 'fortress', label: 'HP' },
            { id: 'trainingGrounds', label: 'XP' },
            { id: 'treasury', label: 'Gold' },
            { id: 'library', label: 'Bestiary' },
            { id: 'infirmary', label: 'Heal' },
          ].map(({ id, label }) => {
            const building = BUILDINGS[id];
            const level = homestead[id] || 0;
            const bonus = getBuildingBonus(building, level);
            const effectType = building.effect.type;
            const StatIcon = STAT_ICONS[id] || StarIcon;

            let displayValue;
            if (effectType === 'bestiaryDepth') {
              displayValue = bonus > 0 ? `+${Math.round(bonus)}` : '0';
            } else if (effectType === 'healBetweenRooms') {
              displayValue = bonus > 0 ? `+${(bonus * 100).toFixed(1)}%` : '0';
            } else {
              displayValue = `+${Math.round(bonus * 100)}%`;
            }

            return (
              <div key={id} className="pixel-panel p-2">
                <div className="flex justify-center">
                  <StatIcon size={24} />
                </div>
                <div className="text-xs text-gray-500">{label}</div>
                <div className={`font-bold ${level > 0 ? 'text-green-400' : 'text-gray-600'}`}>
                  {displayValue}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomesteadScreen;
