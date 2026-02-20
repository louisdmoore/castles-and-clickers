import { useState, useMemo } from 'react';
import {
  SPEED_THRESHOLD, BASE_DODGE_PER_SPEED, MAX_DODGE_CHANCE,
  DOUBLE_ATTACK_PER_SPEED, MAX_DOUBLE_ATTACK, DOUBLE_ATTACK_DAMAGE,
  DEFENSE_REDUCTION_MULTIPLIER, DAMAGE_VARIANCE_MIN, DAMAGE_VARIANCE_RANGE,
  BASE_CRIT_MULTIPLIER, BASE_CRIT_CHANCE_DPS, BASE_CRIT_CHANCE_OTHER,
  BOSS_LOOT_DROP_CHANCE, NORMAL_LOOT_DROP_CHANCE,
} from '../game/balanceConstants';
import { RARITY } from '../data/equipment';
import { ITEM_AFFIXES } from '../data/itemAffixes';
import { CLASSES, PARTY_SLOTS } from '../data/classes';
import { DUNGEON_TIERS } from '../data/milestones';
import { STATUS_EFFECTS } from '../data/statusEffects';

const TABS = [
  { id: 'combat', label: 'Combat' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'classes', label: 'Classes' },
  { id: 'dungeons', label: 'Dungeons' },
  { id: 'status', label: 'Status FX' },
];

const SectionTitle = ({ children }) => (
  <h3 className="pixel-subtitle text-base mb-2 mt-4 border-b border-[var(--color-border)] pb-1">{children}</h3>
);

const DataTable = ({ headers, rows }) => (
  <div className="overflow-x-auto mb-4">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-[var(--color-border)]">
          {headers.map((h, i) => (
            <th key={i} className="px-2 py-1 text-left pixel-label text-xs">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-[var(--color-border)]/30 hover:bg-[var(--color-bg-light)]">
            {row.map((cell, j) => (
              <td key={j} className="px-2 py-1">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// === TAB SECTIONS ===

const CombatSection = () => (
  <div>
    <SectionTitle>Combat Phases</SectionTitle>
    <DataTable
      headers={['Phase', 'Description']}
      rows={[
        ['Setup', 'Dungeon is generated, heroes placed at start'],
        ['Exploring', 'Heroes navigate rooms, reveal fog of war'],
        ['Combat', 'Initiative-based turns, heroes vs monsters'],
        ['Clearing', 'Room cleared, loot dropped, move to next room'],
        ['Complete', 'Boss defeated, dungeon rewards given'],
        ['Defeat', 'All heroes fallen, dungeon failed'],
      ]}
    />

    <SectionTitle>Initiative & Turn Order</SectionTitle>
    <p className="text-[var(--color-text-dim)] mb-2">
      Each combat round, all units roll initiative: <span className="text-[var(--color-gold)]">Speed + d20</span>.
      Units act in descending initiative order. Heroes win ties.
    </p>

    <SectionTitle>Dodge Chance</SectionTitle>
    <p className="text-[var(--color-text-dim)] mb-2">
      Speed above {SPEED_THRESHOLD} grants dodge chance:
      <span className="text-[var(--color-gold)]"> {(BASE_DODGE_PER_SPEED * 100).toFixed(0)}% per speed point</span> above
      threshold. Max: <span className="text-[var(--color-gold)]">{(MAX_DODGE_CHANCE * 100).toFixed(0)}%</span>.
    </p>

    <SectionTitle>Double Attack</SectionTitle>
    <p className="text-[var(--color-text-dim)] mb-2">
      Speed advantage over target grants double attack chance:
      <span className="text-[var(--color-gold)]"> {(DOUBLE_ATTACK_PER_SPEED * 100).toFixed(0)}% per speed advantage</span>.
      Max: <span className="text-[var(--color-gold)]">{(MAX_DOUBLE_ATTACK * 100).toFixed(0)}%</span>.
      Second hit deals <span className="text-[var(--color-gold)]">{(DOUBLE_ATTACK_DAMAGE * 100).toFixed(0)}%</span> damage.
    </p>

    <SectionTitle>Damage Formula</SectionTitle>
    <p className="text-[var(--color-text-dim)] mb-2">
      Base damage = Attack - (Defense * {DEFENSE_REDUCTION_MULTIPLIER}), with
      <span className="text-[var(--color-gold)]"> {(DAMAGE_VARIANCE_MIN * 100).toFixed(0)}%–{((DAMAGE_VARIANCE_MIN + DAMAGE_VARIANCE_RANGE) * 100).toFixed(0)}%</span> variance.
      Critical hits multiply by <span className="text-[var(--color-gold)]">{BASE_CRIT_MULTIPLIER}x</span>.
    </p>

    <SectionTitle>Critical Hit Chance</SectionTitle>
    <DataTable
      headers={['Class Type', 'Base Crit %']}
      rows={[
        ['DPS (Mage, Rogue, Ranger, etc.)', `${(BASE_CRIT_CHANCE_DPS * 100).toFixed(0)}%`],
        ['Tank & Healer', `${(BASE_CRIT_CHANCE_OTHER * 100).toFixed(0)}%`],
      ]}
    />

    <SectionTitle>Loot Drops</SectionTitle>
    <DataTable
      headers={['Source', 'Drop Chance']}
      rows={[
        ['Boss kills', `${(BOSS_LOOT_DROP_CHANCE * 100).toFixed(0)}%`],
        ['Normal monsters', `${(NORMAL_LOOT_DROP_CHANCE * 100).toFixed(0)}%`],
      ]}
    />

    <SectionTitle>Movement</SectionTitle>
    <p className="text-[var(--color-text-dim)] mb-2">
      Units move 1–3 tiles per turn based on speed (1 tile per 8 speed).
      Movement uses A* pathfinding through the dungeon grid.
    </p>
  </div>
);

const EquipmentSection = () => {
  const rarityRows = Object.entries(RARITY).map(([key, cfg]) => [
    <span key={key} style={{ color: cfg.color }}>{cfg.name}</span>,
    `${cfg.multiplier}x`,
  ]);

  const affixRows = Object.values(ITEM_AFFIXES).map(a => [
    a.name,
    a.type === 'prefix' ? 'Prefix' : 'Suffix',
    `Tier ${a.minTier}`,
    a.trigger || 'passive',
    a.description || '—',
  ]);

  return (
    <div>
      <SectionTitle>Rarity Tiers</SectionTitle>
      <DataTable
        headers={['Rarity', 'Stat Multiplier']}
        rows={rarityRows}
      />

      <SectionTitle>Equipment Slots</SectionTitle>
      <DataTable
        headers={['Slot', 'Notes']}
        rows={[
          ['Weapon', 'Primary stat source for Attack. Some are class-restricted.'],
          ['Armor', 'Primary stat source for Defense and HP.'],
          ['Accessory', 'Utility stats (speed, mixed). Mostly universal.'],
        ]}
      />

      <SectionTitle>Shop Pricing</SectionTitle>
      <p className="text-[var(--color-text-dim)] mb-2">
        Shop items cost <span className="text-[var(--color-gold)]">1.75x</span> their sell value.
        The shop refreshes every 2 hours automatically, or can be manually refreshed for gold.
      </p>

      {affixRows.length > 0 && (
        <>
          <SectionTitle>Item Affixes</SectionTitle>
          <p className="text-[var(--color-text-dim)] mb-2">
            Items of Rare+ quality can roll affixes — prefixes (offensive) and suffixes (defensive/utility).
            Higher tier affixes appear on rarer items.
          </p>
          <DataTable
            headers={['Name', 'Type', 'Tier', 'Trigger', 'Effect']}
            rows={affixRows}
          />
        </>
      )}
    </div>
  );
};

const ClassesSection = () => {
  const classEntries = Object.values(CLASSES);

  return (
    <div>
      <SectionTitle>Hero Classes</SectionTitle>
      <DataTable
        headers={['Class', 'Role', 'HP', 'ATK', 'DEF', 'SPD', 'Range']}
        rows={classEntries.map(c => [
          c.name,
          <span key={c.id} className={
            c.role === 'tank' ? 'text-blue-400' :
            c.role === 'healer' ? 'text-green-400' : 'text-red-400'
          }>{c.role}</span>,
          c.baseStats.maxHp,
          c.baseStats.attack,
          c.baseStats.defense,
          c.baseStats.speed,
          c.attackRange ? `${c.attackRange} tiles` : 'Melee',
        ])}
      />

      <SectionTitle>Stat Growth Per Level</SectionTitle>
      <DataTable
        headers={['Class', '+HP', '+ATK', '+DEF', '+SPD']}
        rows={classEntries.map(c => [
          c.name,
          `+${c.growthPerLevel.maxHp}`,
          `+${c.growthPerLevel.attack}`,
          `+${c.growthPerLevel.defense}`,
          `+${c.growthPerLevel.speed}`,
        ])}
      />

      <SectionTitle>Skill Points</SectionTitle>
      <p className="text-[var(--color-text-dim)] mb-2">
        Heroes earn 1 skill point every 2 levels (starting at level 2).
        Skills are organized in tiers:
      </p>
      <DataTable
        headers={['Tier', 'Prerequisite', 'Skills']}
        rows={[
          ['Tier 0', 'None', 'Core starter abilities'],
          ['Tier 1', '2 Tier 0 skills', 'Intermediate abilities'],
          ['Tier 2', '3 Tier 1 skills', 'Advanced abilities'],
          ['Tier 3', '4 Tier 2 skills', 'Capstone (pick 1 of 3)'],
        ]}
      />

      <SectionTitle>Party Slots</SectionTitle>
      <DataTable
        headers={['Slot', 'Role', 'Unlocks At', 'First Recruit Cost']}
        rows={PARTY_SLOTS.map((slot, i) => [
          `Slot ${i + 1}`,
          <span key={i} className={
            slot.role === 'tank' ? 'text-blue-400' :
            slot.role === 'healer' ? 'text-green-400' : 'text-red-400'
          }>{slot.role}</span>,
          slot.ascensionRequired ? `A${slot.ascensionRequired}` : slot.barracksRequired ? `Barracks ${slot.barracksRequired}` : 'Start',
          `${slot.cost}g`,
        ])}
      />
    </div>
  );
};

const DungeonsSection = () => (
  <div>
    <SectionTitle>Dungeon Tiers</SectionTitle>
    <DataTable
      headers={['Tier', 'Name', 'Levels', 'Theme']}
      rows={DUNGEON_TIERS.map(t => [
        t.tier || '—',
        <span key={t.name} style={{ color: t.color || 'inherit' }}>{t.name}</span>,
        `${t.minLevel}–${t.maxLevel}`,
        t.theme,
      ])}
    />

    <SectionTitle>Progression Milestones</SectionTitle>
    <DataTable
      headers={['Dungeon', 'Unlock']}
      rows={[
        ['D5', 'Item Shop, Auto-Run'],
        ['D10', 'Shop rare items, Party size 5'],
        ['D12', 'Sunken Temple raid'],
        ['D18', 'Cursed Manor raid'],
        ['D20', 'Shop epic items, Party size 6'],
        ['D24', 'Sky Fortress raid'],
        ['D25', 'Shop legendary items'],
        ['D30', 'The Abyss raid'],
        ['D35', 'Void Throne raid'],
      ]}
    />

    <SectionTitle>Elite Monsters</SectionTitle>
    <p className="text-[var(--color-text-dim)] mb-2">
      Elite monsters appear at dungeon level 8+. They have <span className="text-[var(--color-gold)]">1.5x HP/ATK/DEF</span>,
      give <span className="text-[var(--color-gold)]">2x XP and gold</span>, and guarantee a rare+ equipment drop.
    </p>
    <p className="text-[var(--color-text-dim)] mb-2">
      Elite affixes: Vampiric, Enraged, Thorny, Arcane, Chilling, Bolstered, Shielded, Explosive, Rallying.
    </p>
  </div>
);

const StatusSection = () => {
  const effects = STATUS_EFFECTS
    ? Object.entries(STATUS_EFFECTS)
    : [];

  if (effects.length === 0) {
    return (
      <div>
        <SectionTitle>Status Effects</SectionTitle>
        <p className="text-[var(--color-text-dim)]">Status effect data not available.</p>
      </div>
    );
  }

  const grouped = { dot: [], control: [], debuff: [], buff: [] };
  effects.forEach(([key, e]) => {
    const cat = e.type;
    if (grouped[cat]) grouped[cat].push([key, e]);
    else grouped.debuff.push([key, e]);
  });

  const renderGroup = (label, items, color) => (
    items.length > 0 && (
      <>
        <SectionTitle>{label}</SectionTitle>
        <DataTable
          headers={['Effect', 'Duration', 'Stackable', 'Description']}
          rows={items.map(([key, e]) => [
            <span key={key} style={{ color }}>{e.name || key}</span>,
            e.duration ? `${e.duration} turns` : '—',
            e.maxStacks > 1 ? `${e.maxStacks}x` : 'No',
            e.description || '—',
          ])}
        />
      </>
    )
  );

  return (
    <div>
      {renderGroup('Damage Over Time', grouped.dot, '#ef4444')}
      {renderGroup('Control Effects', grouped.control, '#eab308')}
      {renderGroup('Debuffs', grouped.debuff, '#a855f7')}
      {renderGroup('Buffs', grouped.buff, '#22c55e')}
    </div>
  );
};

const TAB_COMPONENTS = {
  combat: CombatSection,
  equipment: EquipmentSection,
  classes: ClassesSection,
  dungeons: DungeonsSection,
  status: StatusSection,
};

// Text content for search filtering
const TAB_SEARCH_TEXT = {
  combat: 'initiative dodge speed double attack damage formula critical hit crit loot drop movement phases exploring combat complete defeat',
  equipment: 'rarity common uncommon rare epic legendary unique affix prefix suffix weapon armor accessory shop pricing',
  classes: 'warrior paladin knight mage rogue ranger necromancer cleric druid shaman tank healer dps skill points tier',
  dungeons: 'dungeon tier crystal caves ancient crypt dark forest ruined castle volcanic depths void elite milestone raid party size',
  status: 'poison burn bleed stun slow freeze root weakness vulnerable blind cursed regeneration fortify haste might invisible',
};

const EncyclopediaScreen = () => {
  const [activeTab, setActiveTab] = useState('combat');
  const [search, setSearch] = useState('');

  const filteredTabs = useMemo(() => {
    if (!search.trim()) return TABS;
    const q = search.toLowerCase();
    return TABS.filter(tab =>
      tab.label.toLowerCase().includes(q) ||
      (TAB_SEARCH_TEXT[tab.id] || '').includes(q)
    );
  }, [search]);

  // If active tab is filtered out, switch to first available
  const effectiveTab = filteredTabs.find(t => t.id === activeTab)
    ? activeTab
    : (filteredTabs[0]?.id || 'combat');

  const TabContent = TAB_COMPONENTS[effectiveTab];

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search encyclopedia..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 bg-[var(--color-bg-dark)] border-2 border-[var(--color-border)] text-[var(--color-text)] pixel-label text-sm"
          style={{ fontFamily: "'VT323', monospace" }}
        />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 flex-wrap mb-3">
        {filteredTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pixel-btn text-xs px-3 py-1 ${effectiveTab === tab.id ? 'pixel-btn-primary' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-1">
        {TabContent ? <TabContent /> : (
          <p className="text-[var(--color-text-dim)]">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default EncyclopediaScreen;
