// Single source of truth for the app version
export const CURRENT_VERSION = '0.2.2';

// Changelog entries, newest first
// always write for player, not developer
export const CHANGELOG = [
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
