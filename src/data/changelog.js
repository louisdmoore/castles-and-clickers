// Single source of truth for the app version
export const CURRENT_VERSION = '0.3.4';

// Changelog entries, newest first
// always write for player, not developer
export const CHANGELOG = [
  {
    version: '0.3.4',
    title: 'Unique Power Visibility',
    date: '2026-02-22',
    changes: [
      { type: 'improvement', text: 'Unique item powers now display in the equipment screen — see the power name, trigger, and full description when expanding or hovering any unique item' },
    ],
  },
  {
    version: '0.3.3',
    title: 'Equipment Screen Overhaul',
    date: '2026-02-22',
    changes: [
      { type: 'improvement', text: 'Equipment screen redesigned with permanent 3-column layout — hero showcase, inventory, and stat breakdown all visible at once' },
      { type: 'improvement', text: 'Dramatic hero showcase with atmospheric backdrop, floating particles, and large portrait with breathing halo effect' },
      { type: 'improvement', text: 'Class identity display — each class has a unique title treatment with role label and glowing level number' },
      { type: 'improvement', text: 'Equipment slots arranged as a clean vertical list with item names visible at a glance' },
      { type: 'improvement', text: 'Stat breakdowns always visible — see exactly where your HP, ATK, DEF, and SPD come from' },
      { type: 'improvement', text: 'Selecting an equipment slot now pins your equipped item at the top of the inventory for easy comparison' },
      { type: 'improvement', text: 'Settings moved to a compact dropdown in the header, out of the way' },
    ],
  },
  {
    version: '0.3.2',
    title: 'Equipment Icon Variety',
    date: '2026-02-21',
    changes: [
      { type: 'improvement', text: 'Empty equipment slots now show detailed sword, chestplate, and ring silhouettes instead of placeholder shapes' },
      { type: 'improvement', text: '8 new equipment icons — greatswords, wands, shields, scepters, totems, quivers, belts, and relics all have distinct art' },
      { type: 'improvement', text: '25 class-specific items (Paladin, Knight, Druid, Shaman gear) now display proper icons instead of generic placeholders' },
    ],
  },
  {
    version: '0.3.1',
    title: 'Item Visual Overhaul',
    date: '2026-02-21',
    changes: [
      { type: 'improvement', text: 'Items now have rarity-scaled visuals — icon cells glow for rare+, legendary items have a shimmer sweep, and row backgrounds tint by rarity' },
      { type: 'improvement', text: 'Rarity badge pill next to each item name for quick identification' },
      { type: 'improvement', text: 'Stats displayed as readable chips with triangle arrow diffs instead of microscopic text' },
      { type: 'improvement', text: 'Click any item row to expand full details inline — replaces hover tooltip that was hard to read' },
    ],
  },
  {
    version: '0.3.0',
    title: 'Equipment Screen Redesign',
    date: '2026-02-21',
    changes: [
      { type: 'feature', text: 'Two-tab equipment screen — Character tab for hero-centric gear view, Inventory tab for bulk management' },
      { type: 'feature', text: 'Click any equipment slot to open a side panel showing only items for that slot' },
      { type: 'improvement', text: 'Larger hero portrait (96px) with equipment slots arranged around it — Diablo 4 inspired layout' },
      { type: 'improvement', text: 'Items displayed as compact rows instead of cards — more items visible at once with stat diffs inline' },
      { type: 'improvement', text: 'Stats bar now displays horizontally for a cleaner look' },
      { type: 'improvement', text: 'More breathing room and dark space throughout the equipment screen' },
    ],
  },
  {
    version: '0.2.9',
    title: 'Enhanced Tooltips & Loot Feel',
    date: '2026-02-21',
    changes: [
      { type: 'feature', text: 'Equipment tooltips now show affix descriptions — see exactly what Blazing, Vampiric, etc. do on hover' },
      { type: 'feature', text: 'Inline stat comparison on inventory items — green/red numbers show how each stat compares to your equipped gear' },
      { type: 'improvement', text: 'Filter buttons now have text labels (Wpn, Arm, Acc) instead of just icons' },
      { type: 'improvement', text: 'Rarity visual weight — uncommon/rare/epic/legendary items have distinct background tints and rarity badges' },
    ],
  },
  {
    version: '0.2.8',
    title: 'Equipment Screen Overhaul',
    date: '2026-02-21',
    changes: [
      { type: 'feature', text: 'Completely redesigned equipment screen with paper doll character display and grid inventory' },
      { type: 'feature', text: 'Click any stat (HP, ATK, DEF, SPD) to see a full breakdown of where your stats come from' },
      { type: 'feature', text: 'Rarity glow effects — rare items pulse blue, epic glows purple, legendary shines gold' },
      { type: 'improvement', text: 'Items now display as visual cards in a grid instead of a scrolling list' },
      { type: 'improvement', text: 'Equipment slots shown as clickable tiles around your hero portrait' },
      { type: 'improvement', text: 'Infused and Ascended quality items have shimmering border effects' },
    ],
  },
  {
    version: '0.2.6',
    title: 'Difficulty Overhaul',
    date: '2026-02-20',
    changes: [
      { type: 'feature', text: 'Global difficulty badge in the HUD — change difficulty anytime without visiting PrepScreen' },
      { type: 'feature', text: 'Per-run difficulty override on PrepScreen — try a harder setting without changing your global preference' },
      { type: 'feature', text: 'Difficulty completion bonus — earn bonus gold for clearing dungeons above Normal difficulty' },
      { type: 'improvement', text: 'XP and gold rewards now properly scale with difficulty — 3.0x enemies give ~3x rewards' },
      { type: 'improvement', text: 'Higher difficulty makes monsters faster, not just tankier — dodge and initiative scale up' },
      { type: 'improvement', text: 'More elite monsters spawn at higher difficulty levels' },
      { type: 'improvement', text: 'Difficulty badges now show named labels (Normal, Hard, Brutal, Nightmare, Infernal) everywhere' },
    ],
  },
  {
    version: '0.2.5',
    title: 'Notification Settings & Raid QoL',
    date: '2026-02-20',
    changes: [
      { type: 'feature', text: 'Notification verbosity setting — choose Full, Reduced, or Minimal in the settings gear to control loot notification spam' },
      { type: 'feature', text: 'Quick Raid button on the idle screen — one click to re-run your last raid at the same difficulty' },
      { type: 'feature', text: '"Run Again" button on raid completion — instantly restart the same raid without reopening the selector' },
      { type: 'improvement', text: 'Raid difficulty is now remembered per raid — no more resetting to Normal every time you reopen the modal' },
      { type: 'improvement', text: 'Homestead upgrades now toast when unlocking new features (difficulty tiers, shop, consumables, etc.)' },
      { type: 'improvement', text: 'Unique item drops no longer show a redundant loot notification behind the celebration modal' },
    ],
  },
  {
    version: '0.2.4',
    title: 'DPS Meter & Run History',
    date: '2026-02-20',
    changes: [
      { type: 'feature', text: 'DPS Meter — replaces contribution meter with live DPS/HPS tracking and combat timer. See real damage per second rates!' },
      { type: 'feature', text: 'Run History — new "Recent Runs" tab in Stats screen shows your last 50 dungeon runs with full DPS metrics per hero' },
      { type: 'improvement', text: 'Run Summary now displays average DPS, combat duration, and biggest hit in a cleaner layout' },
      { type: 'improvement', text: 'Simplified run insights — removed vague "solid run" feedback, keeping only specific actionable advice' },
      { type: 'improvement', text: '"View Details" button added to Run Summary — opens stats screen to see full run breakdown' },
    ],
  },
  {
    version: '0.2.3',
    title: 'Bug Fixes',
    date: '2026-02-20',
    changes: [
      { type: 'fix', text: 'Fresh games now start with only 4 party slots — slots 5-8 unlock via Barracks and Ascension as intended' },
      { type: 'fix', text: 'Recruitment now costs gold as designed — Slot 1: free, Slot 2: 75g, Slot 3: 1000g, Slot 4: 5000g' },
      { type: 'fix', text: 'Skills screen now uses a grid layout that wraps at 5+ heroes — no more overlapping tabs!' },
      { type: 'fix', text: 'Healers will now properly cast Resurrection when allies are dead — Cleric capstone is no longer dead code' },
    ],
  },
  {
    version: '0.2.2',
    title: 'UI Design Pass',
    date: '2026-02-19',
    changes: [
      { type: 'feature', text: 'Idle screen redesigned into a Party Dashboard — see party readiness, actionable badges, and next target at a glance' },
      { type: 'feature', text: 'Hero badges in sidebar show unspent skill points, empty gear slots, and available upgrades between runs' },
      { type: 'improvement', text: 'Navigation split into 5 core buttons + "More" overflow menu — less header clutter' },
      { type: 'improvement', text: 'Settings gear icon replaces the Reset button — cleaner header' },
      { type: 'improvement', text: 'Dungeon header stripped of tier progress squares and unlock indicators — less noise during combat' },
      { type: 'improvement', text: 'Contribution meter moved to sidebar — combat log now full-width' },
    ],
  },
  {
    version: '0.2.1',
    title: 'UI Compaction',
    date: '2026-02-19',
    changes: [
      { type: 'improvement', text: 'Header merged into a single compact row — more vertical space for the dungeon view' },
      { type: 'improvement', text: 'Sidebar slimmed from 256px to 176px — wider canvas viewport' },
      { type: 'improvement', text: 'Tighter spacing on panels, buttons, bars, and badges throughout the UI' },
      { type: 'improvement', text: 'Combat log takes less space when collapsed' },
      { type: 'improvement', text: 'Overall ~100px of vertical space reclaimed for gameplay' },
    ],
  },
  {
    version: '0.2.0',
    title: 'The Quality Pass',
    date: '2026-02-18',
    changes: [
      { type: 'feature', text: 'Homestead rework — 7 buildings now unlock gameplay features (party slots, shop, difficulty tiers, consumables) alongside stat bonuses' },
      { type: 'feature', text: 'Specialization system — at level 30, heroes choose 1 of 2 subclasses with unique passive bonuses and active abilities' },
      { type: 'feature', text: 'Ascension redesign — no more resets! Ascending costs gold and grants permanent +10% stats + higher dungeon cap' },
      { type: 'feature', text: 'Run summary now shows a "Key Insight" after each dungeon — actionable advice based on how your party performed' },
      { type: 'feature', text: 'Death recap now explains why you lost with concrete suggestions for improvement' },
      { type: 'feature', text: 'Achievement rewards scaled for late-game — bigger payouts for harder milestones' },
      { type: 'improvement', text: 'Homestead costs rebalanced — buildings are achievable goals, not endless grinds' },
      { type: 'improvement', text: 'Raids simplified to Normal + Hard — focused on the content that matters' },
      { type: 'improvement', text: 'UI responsive improvements for tablet-sized screens' },
      { type: 'improvement', text: 'Loot notifications capped at 3 visible — no more notification floods' },
      { type: 'improvement', text: 'Combat log improved with better color coding and expandable view' },
      { type: 'balance', text: 'Removed 10 thin systems that added complexity without depth — room for better systems in the future' },
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
