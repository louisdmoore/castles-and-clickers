import HeroIcon from '../icons/HeroIcon';
import HelpTooltip from '../ui/HelpTooltip';

const EquipmentSettings = ({ heroes, equipmentSettings, updateEquipmentSettings, setClassPriority }) => {
  return (
    <div className="bg-gray-900/60 rounded px-3 py-2 space-y-2 text-xs">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-gray-400 font-medium flex items-center gap-1">
          Settings
          <HelpTooltip content={
            <div className="space-y-1">
              <div>Rarity tiers: Common, Uncommon, Rare, Epic, Legendary, Unique.</div>
              <div>Rare+ items can have affixes (special effects).</div>
              <div>Auto-equip replaces gear when a better item drops. Auto-sell converts junk to gold.</div>
            </div>
          } />
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={equipmentSettings.autoEquipUpgrades}
            onChange={(e) => updateEquipmentSettings({ autoEquipUpgrades: e.target.checked })}
            className="rounded bg-gray-700 border-gray-600 w-3 h-3"
          />
          <span className="text-gray-300">Auto-equip</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={equipmentSettings.autoSellJunk}
            onChange={(e) => updateEquipmentSettings({ autoSellJunk: e.target.checked })}
            className="rounded bg-gray-700 border-gray-600 w-3 h-3"
          />
          <span className="text-gray-300">Auto-sell junk</span>
        </label>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[10px] text-gray-500">Priority:</span>
        {heroes.filter(Boolean).map(hero => (
          <div key={hero.id} className="flex items-center gap-1">
            <HeroIcon classId={hero.classId} equipment={hero.equipment} size={16} />
            <select
              value={equipmentSettings.classPriority?.[hero.classId] || 'balanced'}
              onChange={(e) => setClassPriority(hero.classId, e.target.value)}
              className="bg-gray-700 text-white text-[10px] rounded px-1 py-0.5 border-none"
            >
              <option value="tank">Tank</option>
              <option value="damage">Damage</option>
              <option value="speed">Speed</option>
              <option value="balanced">Balanced</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentSettings;
