// Single source of truth for the app version
export const CURRENT_VERSION = '0.5.0';

// Changelog entries, newest first
// always write for player, not developer
export const CHANGELOG = [
  {
    version: '0.5.0',
    title: 'Depth',
    date: '2026-02-17',
    changes: [
      { type: 'feature', text: 'Raid difficulty tiers — choose Normal, Heroic (1.5x stats, better unique drops, 50k gold), or Mythic (2x stats + 2 random dungeon affixes, requires Ascension 3)' },
      { type: 'feature', text: 'Raid-specific mechanics — Sunken Temple applies Water Curse (-20% hero speed), Cursed Manor activates Ghost Ward (enemies take 75% less damage)' },
      { type: 'feature', text: 'Dungeon affixes — at 2.0x+ difficulty, dungeons roll random modifiers (Fortified, Vampiric, Bolstering, Bountiful, etc.) shown in the zone header' },
      { type: 'feature', text: 'Achievement system — 30 achievements across Combat, Progression, Collection, Challenge, and Economy categories with gold rewards and progress tracking' },
    ],
  },
  {
    version: '0.4.0',
    title: 'The Full Picture',
    date: '2026-02-17',
    changes: [
      { type: 'feature', text: 'Unique item leveling — uniques now gain XP and level up (1-5), boosting their stats up to 2x at max level' },
      { type: 'feature', text: 'Duplicate fusion — finding a duplicate unique now fuses into your existing copy, advancing its level instead of converting to gold' },
      { type: 'feature', text: 'Each unique has a conditional XP bonus tied to its playstyle — lean into what makes your unique special' },
      { type: 'feature', text: 'Capstone skill auras — Warlord (+10% party attack), Iron Fortress (+15% party defense), Divine Radiance (2% party regen)' },
      { type: 'feature', text: 'Prestige stars — heroes at level 25+ can prestige to reset to level 10 and gain a permanent +3% all stats star' },
      { type: 'feature', text: 'Wide-screen layout — three-column grid with collapsible run stats panel (1440px+)' },
      { type: 'improvement', text: 'Restructured game interface for better performance and future layout improvements' },
    ],
  },
  {
    version: '0.3.2',
    title: 'Craft My Build',
    date: '2026-02-17',
    changes: [
      { type: 'feature', text: 'Reforging — reroll affixes on rare+ gear from the Equipment screen. Lock one affix to keep it (costs 2x)' },
      { type: 'feature', text: 'Escalating reforge costs that reset after each dungeon clear — choose your moments wisely' },
      { type: 'feature', text: 'Affix synergies — matching affix tags across gear activates set bonuses (Quicksilver, Ironclad, Lifebond, Headsman, Blood Rage, Siphon)' },
      { type: 'feature', text: 'Status effect combos — Shatter frozen targets for guaranteed crits, Punish stunned foes, ignite Toxic Fire, and more (6 combos)' },
    ],
  },
  {
    version: '0.3.1',
    title: 'Surprise Me',
    date: '2026-02-17',
    changes: [
      { type: 'feature', text: 'Room events — explore dungeons to find Healing Springs, Trapped Chests, Ancient Libraries, Wandering Merchants, and more (15% chance per room)' },
      { type: 'feature', text: '10 event types: heal your party, gain bonus loot, trade HP for gold, get XP boosts, or skip rooms entirely' },
      { type: 'feature', text: 'Shrine of Fortune — sacrifice gold for increased drop rates the rest of the run' },
      { type: 'feature', text: 'Monster Ambush and Ancient Library give bonus XP in their rooms' },
      { type: 'feature', text: 'Tower of Trials — endless challenge mode unlocked at Ascension 2. No healing between floors, scaling difficulty. How far can you go?' },
      { type: 'feature', text: 'Tower high score tracking with seed display — compete against your personal best' },
    ],
  },
  {
    version: '0.3.0',
    title: 'A New Chapter',
    date: '2026-02-17',
    changes: [
      { type: 'feature', text: 'Ascension system — clear the final dungeon to ascend, resetting progress but gaining permanent stat bonuses and new unlocks' },
      { type: 'feature', text: 'Each ascension raises the dungeon cap (D35, D40, D45...) and grants +10% to all stats' },
      { type: 'feature', text: 'Milestone unlocks: 7th party slot at A1, trait rerolling at A2, 8th slot at A3, and more' },
      { type: 'feature', text: 'Free skill respec on ascension — rebuild your heroes with new knowledge' },
      { type: 'feature', text: 'Versioned save migration system for future-proof game saves' },
    ],
  },
  {
    version: '0.2.2',
    title: 'Make Real Choices',
    date: '2026-02-17',
    changes: [
      { type: 'feature', text: 'Difficulty slider on prep screen — choose 1.0x to 3.0x challenge for better loot and harder monsters' },
      { type: 'feature', text: 'Loot targeting — each dungeon theme has favored affixes that drop at 2x rate. Farm specific dungeons for the gear you need' },
      { type: 'feature', text: 'Infused gear at 2.0x+ difficulty — items with a guaranteed bonus affix, shown in emerald green' },
      { type: 'feature', text: 'Ascended gear at 3.0x difficulty — exclusive items with 30% boosted stats and bonus affixes, shown in pink' },
    ],
  },
  {
    version: '0.2.1',
    title: 'Know What To Do',
    date: '2026-02-17',
    changes: [
      { type: 'feature', text: 'Death recap popup on party wipe — see kill order, damage vs healing, and what went wrong' },
      { type: 'feature', text: 'Equipment comparison tooltips — hover over items to see stat differences' },
      { type: 'feature', text: 'Smart auto-equip — rare+ upgrades now show a suggestion with stat comparison instead of silently swapping' },
    ],
  },
  {
    version: '0.2.0',
    title: 'See What\'s Happening',
    date: '2026-02-17',
    changes: [
      { type: 'feature', text: 'Contribution meter shows each hero\'s role performance during combat' },
      { type: 'feature', text: 'Run summary popup after each dungeon — see MVP, biggest hit, and hero breakdown' },
      { type: 'feature', text: 'Preparation screen between dungeon runs — party overview, dungeon preview with theme and favored drops' },
      { type: 'feature', text: 'Milestone widget tracks your nearest goals — next level-up, dungeon unlocks, collection progress' },
      { type: 'feature', text: 'Auto-advance now pauses briefly on the prep screen so you can see what\'s coming' },
    ],
  },
  {
    version: '0.1.29',
    title: 'Foundation Work',
    date: '2026-02-17',
    changes: [
      { type: 'feature', text: 'Added affix synergy tags and bonus definitions — matching affixes on gear will grant set bonuses' },
      { type: 'feature', text: 'Each dungeon theme now has favored affixes that drop more often' },
      { type: 'feature', text: 'Status effect combos defined — Freeze + attack = Shatter, Burn + Poison = Toxic Fire, and more' },
      { type: 'feature', text: 'Hero trait system defined — new heroes will roll random traits like Glass Cannon, Lucky, or Iron Will' },
      { type: 'feature', text: 'Room event system defined — treasure chests, healing springs, and ambushes coming to dungeons' },
      { type: 'feature', text: 'Achievement system with 30 milestones across combat, progression, collection, and economy' },
      { type: 'feature', text: 'Ascension milestone rewards planned — party slots, challenge modes, and prestige classes' },
    ],
  },
  {
    version: '0.1.28',
    title: 'Visual Polish',
    date: '2026-02-16',
    changes: [
      { type: 'feature', text: 'Replaced Unicode symbols with crisp pixel-art SVG icons throughout the UI' },
      { type: 'feature', text: 'Every skill now has a unique icon in the dungeon canvas view (130 total)' },
      { type: 'fix', text: 'Minor visual cleanup — removed inconsistent inline styles' },
    ],
  },
  {
    version: '0.1.27',
    title: 'Player Experience',
    date: '2026-02-16',
    changes: [
      { type: 'feature', text: 'Save indicator shows when your game was last saved' },
      { type: 'feature', text: 'Error notifications when actions fail (not enough gold, inventory full, etc.)' },
      { type: 'feature', text: 'In-game encyclopedia with searchable reference for combat, equipment, and more' },
      { type: 'feature', text: 'Help tooltips (?) next to complex mechanics' },
    ],
  },
  {
    version: '0.1.26',
    title: 'Accessibility Improvements',
    date: '2026-02-16',
    changes: [
      { type: 'feature', text: 'Animations now respect your OS "reduce motion" setting' },
      { type: 'feature', text: 'Keyboard navigation with visible focus indicators on all buttons' },
      { type: 'feature', text: 'Modal focus trapping — Tab stays inside open dialogs' },
      { type: 'feature', text: 'Screen reader improvements: ARIA labels on navigation, combat log, loot alerts, and skill nodes' },
      { type: 'fix', text: 'Improved contrast on secondary text for better readability' },
    ],
  },
  {
    version: '0.1.25',
    title: 'Under-the-Hood Improvements',
    date: '2026-02-14',
    changes: [
      { type: 'feature', text: 'Smaller download size — combat simulator no longer ships in the production build' },
      { type: 'feature', text: 'Internal code reorganization for faster future updates' },
    ],
  },
  {
    version: '0.1.23',
    title: 'Buff Refunds & Raid Polish',
    date: '2026-02-14',
    changes: [
      { type: 'feature', text: 'Consumable buffs (elixirs, XP scrolls) now apply to raids too' },
      { type: 'feature', text: 'Dungeon buffs are refunded if you fail or abandon a dungeon — no more wasted gold' },
      { type: 'fix', text: 'Offline progress now correctly unlocks auto-advance at D5' },
      { type: 'fix', text: 'Fixed shop items sometimes having mismatched stats after rarity capping' },
      { type: 'fix', text: 'Fixed healing potion "Use" button breaking when owning multiple potions' },
    ],
  },
  {
    version: '0.1.22',
    title: 'Shop Rework & Consumables',
    date: '2026-02-14',
    changes: [
      { type: 'feature', text: 'New Consumables tab in the shop — buy healing potions, XP scrolls, and stat elixirs' },
      { type: 'feature', text: 'Shop now scales with progress: higher rarities unlock at D10, D20, and D25' },
      { type: 'feature', text: 'Added "Sell Non-Upgrades" button to quickly clear junk from your inventory' },
      { type: 'balance', text: 'Respec cost is now linear (250g per point) instead of exponential' },
      { type: 'balance', text: 'Heroes earn their first skill point at level 2 and choose their own starter skill' },
      { type: 'balance', text: 'Elite mobs now appear starting at dungeon 8 instead of 10' },     
      { type: 'fix', text: 'Fixed healing potions healing for the wrong amount' },
      { type: 'fix', text: 'Fixed attack and defense elixirs applying their bonus twice' },
    ],
  },
  {
    version: '0.1.21',
    title: "What's New",
    date: '2026-02-14',
    changes: [
      { type: 'feature', text: 'Added a "What\'s New" popup so you can see what changed after each update' },
      { type: 'feature', text: 'Click the version number in the header to revisit the changelog anytime' },
    ],
  },
  {
    version: '0.1.20',
    title: 'Bug Fixes & Balance',
    date: '2026-02-13',
    changes: [
      { type: 'fix', text: 'Fixed combat log slowing down during very long dungeon runs' },
      { type: 'balance', text: 'Smoothed difficulty curve for dungeon levels 25–30' },
      { type: 'fix', text: 'Unique item drop celebration no longer gets stuck on fast clears' },
    ],
  },
  {
    version: '0.1.19',
    title: 'Performance Improvements',
    date: '2026-02-12',
    changes: [
      { type: 'feature', text: 'Significant performance boost — less lag during combat and menus' },
      { type: 'fix', text: 'Fixed old saves occasionally losing new feature flags on load' },
    ],
  },
  {
    version: '0.1.18',
    title: 'Combat Polish',
    date: '2026-02-11',
    changes: [
      { type: 'fix', text: 'Fixed turn order glitches when speed buffs expire mid-combat' },
      { type: 'balance', text: 'Healers now prioritize the lowest-HP ally more consistently' },
    ],
  },
  {
    version: '0.1.17',
    title: 'Stability & Saving',
    date: '2026-02-10',
    changes: [
      { type: 'feature', text: 'Game now auto-saves more frequently during raids' },
      { type: 'fix', text: 'Fixed a rare crash when abandoning a raid during a boss phase transition' },
      { type: 'fix', text: 'Improved recovery if something goes wrong mid-combat' },
    ],
  },
];

// Max entries to show in the changelog modal
const MAX_CHANGELOG_ENTRIES = 5;

/**
 * Returns changelog entries newer than the given version, capped at MAX_CHANGELOG_ENTRIES.
 * If lastSeenVersion is null/undefined, returns the most recent entries up to the limit.
 */
export function getChangesSince(lastSeenVersion) {
  if (!lastSeenVersion) return CHANGELOG.slice(0, MAX_CHANGELOG_ENTRIES);

  const result = [];
  for (const entry of CHANGELOG) {
    if (entry.version === lastSeenVersion) break;
    result.push(entry);
    if (result.length >= MAX_CHANGELOG_ENTRIES) break;
  }
  return result;
}
