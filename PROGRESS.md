# Progress

**Current Version: v0.3.4**
**Current: Equipment Screen Overhaul — critique-driven passes**

---

## Equipment Screen Overhaul (Priority 5b)

Tracking against `EQUIPMENT_SCREEN_CRITIQUE.md`. Each critique point is a discrete task.

### Done
- [x] **#5 Spreadsheet feel** → Rarity-scaled icon cells with glow, row background gradients, legendary shimmer sweep (v0.3.1)
- [x] **#6 Microscopic stats** → Stat chips at 10-11px in dark pills with triangle arrow diffs (v0.3.1)
- [x] **#7 No detail without hover** → Click-to-expand inline accordion replaces hover tooltip. Only one item expands at a time. Smooth CSS grid animation (v0.3.1)
- [x] **#8 Doesn't feel like loot** → Rarity glow animations on icon cells, tinted row backgrounds, rarity badge pills (v0.3.1)
- [x] **#10 No rarity moment** → Legendary rows have amber shimmer sweep, epic/rare icon cells pulse, unique items keep cyan glow + text shimmer (v0.3.1)

### Remaining
- [x] **#1 Paper doll is anemic** → Dramatic hero showcase: 224px portrait with 340px breathing halo, CSS particle system (12 floating motes), full-column atmospheric backdrop with role-themed gradients/vignette/light beam, class identity title (e.g. "WARRIOR") with epithet + role label + glowing level display (v0.3.3)
- [x] **#2 Vertical scroll / settings clipping** → Settings moved to dropdown in top bar with click-outside dismiss. Stats always visible in dedicated right column. No scroll needed (v0.3.3)
- [x] **#3 Slot panel squishes hero side** → Eliminated SlotPanel entirely. Clicking equipment slot filters inventory in center column instead. 3-column layout stays stable (v0.3.3)
- [x] **#4 No equipped vs candidates hierarchy** → When slot selected, equipped item pinned at top of inventory with "Equipped" label, candidates listed below with count. Clear visual separation (v0.3.3)
- [x] **#9 Equipment slot icons are placeholder** — Replaced with detailed sword/chestplate/ring silhouettes + 8 new item type icons + mapped 25 unmapped class items (v0.3.2)
- [ ] **#11 Mobile barely functional** — Paper doll takes half viewport, stat breakdowns require scrolling, no way to see slot panel without pushing everything off-screen.
- [x] **#12 Two tabs isn't enough** → Eliminated tabs entirely. Permanent 3-column layout: Hero showcase (left) | Inventory (center) | Stats dashboard (right). All content visible simultaneously (v0.3.3)
- [x] **#13 Sell Junk easy to miss** → Sell Junk button always visible in inventory header when showing all items. Promoted to prominent position (v0.3.3)
- [ ] **#14 No best-upgrade flow** — No auto-select best upgrade, sort dropdown only has "Rarity." Manual scanning for green arrows.

### Earlier Equipment Phases (completed before critique)
- **v0.2.8 — Component Architecture**: Decomposed EquipmentScreen into 6 subcomponents. Paper doll layout. Rarity glow CSS. Modal size xl→full.
- **v0.2.8 — Stat Breakdown**: `calculateHeroStatsWithBreakdown()` in statCalculator. Click-to-expand stat source tree.
- **v0.2.9 — Enhanced Tooltips**: Affix descriptions in tooltips. Inline stat comparison. Filter button labels. Rarity background tints.
- **v0.3.0 — Screen Redesign**: Two-tab layout (Character/Inventory). Slot panel on click. 96px hero portrait. Items as compact rows. Horizontal stats bar.

---

## Completed Priorities

### Priority 1: Real Bugs ✅
- [x] Party slot 8 unreachable — fixed, unlocks at Ascension 3
- [x] Skills screen unusable with large party — grid-cols-4 wrapping layout
- [x] Healers never cast Revive — dead-ally check + revive priority in AI

### Priority 2: DPS Meter & Stats Rework ✅
- [x] Live DPS/HPS/DTPS meter (role-aware) replacing contribution meter
- [x] Run history (last 50) with per-hero breakdown in Stats screen

### Priority 3: Player Guidance & Notification Audit ✅
- [x] Removed Key Insight from RunSummary
- [x] 3-level notification verbosity (Full/Reduced/Minimal)
- [x] Raid re-entry: "Run Again" button, per-raid difficulty persistence, Quick Raid on idle screen

### Priority 5: Difficulty System ✅
- [x] Global persistent difficulty + per-run override. HUD badge, PrepScreen panel, monster scaling, reward scaling, completion bonus. Save migration v10→v11.

---

## Open Priorities

### Priority 6: Reduce Modal Dependency
- [ ] **Unified Hero Profile modal** — Combine Heroes, Equipment, and Skills into one tabbed modal. Shared hero selector at top, tabs for Party / Gear / Skills. Eliminates bouncing between 3 modals for hero management. Equipment already uses `size="full"`, Skills uses `size="xl"`, Heroes is small — a tabbed `full` modal fits all three. Key challenge: Equipment's 3-column layout needs the width; Skills has a 2-column tree layout. Both already have hero selectors that can be unified.
- [ ] Surface more info inline — 18 total modals. Consider inline skill bar, sidebar panels, split-view layouts.

### Bug Backlog
- [ ] **Leave Dungeon / Change buttons off-screen during gameplay** — action buttons are clipped or pushed below the viewport during active dungeon runs. Likely a layout overflow issue in the combat view area.
- [ ] **Party gets stuck walking in circles** — Rare bug where heroes loop between the same tiles and never advance. Likely a pathfinding issue in `combatMovement.js` (A* pathfinding) or room navigation logic in `useDungeon.js`. May be a tie-breaking issue where the next target keeps flipping, or an edge case where the exit path routes through a visited room. Needs reproduction and logging to diagnose.
- [ ] **World boss prep screen says "Guaranteed legendary+ gear drop"** — World bosses drop uniques, not legendary gear. The prep screen / dungeon preview text doesn't distinguish between world boss levels and regular boss levels. Should say "Unique item drop" or similar for world boss floors.
- [ ] **Stat color / comparison color clash** — HP uses green, ATK uses red as their stat identity colors. But comparison tooltips also use green = better, red = worse. So "+10 ATK" shows as red (stat color) even though it's an upgrade. Confusing. Fix: stat identity colors should NOT be red/green, OR comparisons should use a different indicator (arrows, +/- symbols, background tint) instead of relying on red/green which conflicts.
- [x] ~~**Unique item powers not visible in gear screen**~~ (v0.3.4: unique power section added to EquipmentTooltip — shows power name, trigger type, and description in amber-styled block. Visible in both ItemRow accordion and PaperDoll hover tooltip)
- [ ] **Remove Infused/Ascended item quality tiers for now** — Difficulty-gated quality tiers in `equipment.js` (Infused at 2.0x+, Ascended at 3.0x). Bonus affixes and 1.3x stat multiplier. Has CSS shimmer animations, tooltip badges, color overrides. But: never explained to the player anywhere, adds complexity on top of an already cluttered rarity system (common/uncommon/rare/epic/legendary + unique + now infused/ascended). Remove until core loot loop, drop rates, and equipment UI are solid. Can reintroduce as a meaningful endgame reward later. Files: `equipment.js` (generation), `rarityStyles.js` (colors), `index.css` (shimmer animations), `EquipmentTooltip.jsx` (badges).
- [ ] **Rogue dual daggers don't render correctly in dungeons** — Canvas sprite rendering issue for rogue's dual dagger weapon type. Check `SkillSprites.js` / canvas sprite system for the rogue weapon drawing logic.
- [ ] **Kills not tracked in Recent Runs** — Per-hero kill counts missing or always zero in the Recent Runs tab of StatsScreen. Check `endDungeon` in `dungeonSlice.js` where the run snapshot is built — likely `kills` field isn't being pulled from `runStats.heroStats` or the combat system isn't incrementing kill counters. Also check `combatSlice.js` `saveRunToHistory()` and `runSnapshotHelper.js`.

### Priority 7: UI Polish Passes
- [ ] **App-wide color pass** — Colors are defined ad-hoc across 40+ files (289 Tailwind color class usages, dozens of inline hex values). No central palette. Same colors duplicated (zone theme colors in DungeonHeader, DungeonMap, CurrentZoneIndicator — all with identical hex maps). Stat colors (green HP, red ATK) clash with comparison colors (green better, red worse). Rarity colors defined in equipment.js, rarityStyles.js, and inline in LootNotifications/ShopScreen. Need: a single `src/data/colors.js` or CSS custom properties palette that all files import from. Define semantic color roles (stat identity, comparison, rarity, zone theme, UI feedback) that don't conflict. Kill inline hex values.
- [ ] Overview/stats screen layout
- [ ] **Dungeon view full redesign** — The entire in-game combat screen needs a relook:
  - **Sidebar during combat**: Hero cards are tiny (16px icons, 5px HP bars, 3px XP bars) with status effect icons crammed in. Status/buff/debuff icons are unreadable at this size. DPS meter wedged below party cards. "Exit Dungeon" and "Select Dungeon" buttons at the very bottom — reported as off-screen/clipped (see Bug Backlog).
  - **Canvas area**: Takes flex-1 but shares vertical space with DungeonHeader (~35px) and CombatLog (96-160px). On smaller viewports the canvas gets squeezed. Minimap (140x105px) and boss panel (160px wide) overlay on the canvas, eating into the actual gameplay view.
  - **DungeonHeader**: Cramped single row with zone name, difficulty badge, phase indicator, enemy progress bar, and boss indicator all fighting for space.
  - **Combat log**: max-h-24 (96px) showing last 5 entries in text-xs. Click to expand to max-h-40. Tiny text, no icons, hard to parse during fast combat. Takes fixed vertical space even when empty.
  - **Right panel**: Only shows on 1440px+. Contains per-hero run stats (DMG/Heal/Taken/Kills). Most players never see this.
  - **Overall feel**: The combat view is a utilitarian data dump. Canvas is the star of the show but it's hemmed in by chrome on all sides. No sense of drama, no visual hierarchy between "exploring peacefully" and "fighting a boss." Consider: collapsible sidebar during combat, combat log as an overlay instead of fixed space, boss encounters that give the canvas more room, mobile-first thinking.
- [ ] All modals audit (sizing, padding, scroll, mobile)
- [ ] Homestead screen visual improvements
- [ ] Achievement UI polish
- [ ] DPS meter clarity
- [ ] RunSummary "View Details" is useless
- [ ] Shop & consumables rework
- [ ] Raid completion says "Dungeon Level X Cleared" incorrectly

### Priority 8: Skill Management UX
- [ ] Reduce tedium — auto-spend, saved builds, batch level-up

### Priority 9: Raid Rethink
- [ ] Gate ascension behind raid clears
- [ ] More raid loot beyond uniques
- [ ] Raid selector UI overhaul

### Priority 10: Balance Pass
- [ ] Party size question, monster scaling vs party size, difficulty curve audit, unique items underpowered
- [ ] **Loot drop rate overhaul** — Common/uncommon drops are auto-sold noise (60-70% cut). Keep rare+ rates same or buff. Tie loot quality to difficulty (better table, not more drops). Audit current rates in mazeGenerator.js, inventorySlice.js, equipment.js, balanceConstants.js first.
- [ ] **Remove auto-equip and auto-sell** — These are band-aids for over-generous drops. With reduced drop rates and a good equipment screen, players should evaluate loot manually. Remove auto-equip two-tier pipeline, auto-sell, suggest-equip notifications, and the notification verbosity setting (exists only to mute auto-action spam). Simplify `processLootDrop` to: drop → inventory. Add bulk "sell all below rare" action in equipment screen instead.

### Priority 11: Combat & Graphics
- [ ] Boss mechanics depth, attack/skill animations, status effect VFX, equipment reflected on sprites

---

## Handoff Notes

### Session 21 (2026-02-22) — v0.3.4: Unique Power Visibility

- Added unique power section to `EquipmentTooltip.jsx` — amber-bordered block with diamond icon, power name, trigger type label, and full description
- Imports `UNIQUE_TRIGGER` from `uniqueItems.js`, adds `getUniqueTriggerDisplay()` covering all 14 trigger types
- Renders between affixes and comparison sections, only for unique items (`isUnique && uniquePower`)
- Fixes both ItemRow expanded panel and PaperDoll hover tooltip in one change

### Session 20 (2026-02-22) — v0.3.3: Equipment Screen Layout Overhaul

**Major structural redesign of the equipment screen:**

- **Eliminated tab system** — Character/Inventory tabs replaced with permanent 3-column layout (Hero showcase | Inventory | Stats dashboard). All content visible simultaneously.
- **Hero showcase column** — Full-column atmospheric backdrop (`character-atmosphere` CSS) with role-themed radial gradients, vignette, vertical light beam, and 12 CSS-only floating particles. 224px portrait with 340px breathing halo. Class identity title system: role label ("TANK"), class name ("WARRIOR") in dramatic 4xl uppercase with triple-layer glow, glowing level number. Per-class epithets defined but not displayed (future use).
- **Equipment slots refactored** — Triangle pattern (weapon—portrait—accessory row + armor below) replaced with vertical stack below portrait. Each slot is a full-width row: 48px icon box + slot label + item name. Tooltips repositioned from bottom to right.
- **Stats dashboard (right column)** — `StatsSummary` rewritten as 2x2 grid of "stat pillars" with breakdowns always visible. SOURCE_ICONS/SOURCE_COLORS moved from StatBreakdown.jsx (now dead code). Each pillar has colored left border, gradient divider, tree connectors for breakdown entries.
- **Inventory column (center)** — Equipped item pinning: when a slot is selected and hero has gear in that slot, the equipped item pins at top with "Equipped" label and candidates listed below. Slot filter chips sync with paper doll selection.
- **Settings moved to dropdown** — Settings button in top bar next to HeroSelector, click-outside dismiss via useRef + mousedown listener. `pixel-panel` styled dropdown with slide-down animation.
- **Dead code created**: `SlotPanel.jsx` (no longer imported), `StatBreakdown.jsx` (logic moved to StatsSummary)

**Files changed:** EquipmentScreen.jsx, CharacterTab.jsx, PaperDoll.jsx, StatsSummary.jsx, InventoryGrid.jsx, ItemRow.jsx, index.css

**Critique points resolved:** #1 (paper doll anemic), #2 (scroll/settings clipping), #3 (slot panel squish), #4 (no equipped hierarchy), #12 (two tabs insufficient), #13 (sell junk buried)

**Remaining:** #11 (mobile), #14 (best-upgrade flow)

### Session 19 (2026-02-21) — v0.2.9-v0.3.1: Equipment Screen Visual Overhaul

**v0.2.9: Enhanced Tooltips & Loot Feel**
- EquipmentTooltip now shows affix descriptions with trigger labels
- Inline stat comparison (green/red diffs) on inventory items
- Filter buttons have text labels (Wpn, Arm, Acc)
- Rarity background tints on item rows

**v0.3.0: Equipment Screen Redesign**
- Two-tab layout: Character tab (hero-centric) + Inventory tab (bulk management)
- Click equipment slot → side panel filtered to that slot type
- 96px hero portrait with equipment slots arranged around it
- Items as compact rows instead of cards
- Horizontal stats bar

**v0.3.1: Item Visual Overhaul (critique-driven)**
- `ItemRow.jsx` rewritten: rarity-scaled icon cells (w-11, bordered, tinted bg, glow for rare+)
- Row backgrounds: gradients for epic/legendary/unique, subtle tint for rare
- Legendary shimmer sweep via `item-row-legendary::after` using `quality-shimmer-infused` keyframe
- Rarity badge pill inline with item name
- Removed 4px left border — rarity now multi-channel (icon + bg + badge)
- Stat display: dark pill chips at 10-11px with ▲/▼ triangle diffs
- Click-to-expand accordion replaces hover tooltip — `EquipmentTooltip` with `hideHeader` prop
- Single-expand constraint: `expandedItemId` lifted to InventoryGrid + SlotPanel
- Smooth CSS grid accordion animation (`grid-template-rows: 0fr → 1fr`)
- Chevron rotation indicator on expand
- Hover highlight on rows (bg transition)
- Files changed: ItemRow.jsx, InventoryGrid.jsx, SlotPanel.jsx, EquipmentTooltip.jsx, index.css
- REPASS.md: tooltip positioning + mobile touch issues marked resolved, new item for expand scroll-into-view
- DEVELOPER_GUIDE.md: updated Equipment Comparison section, added Item Row Detail subsection

### Session 18 (2026-02-21) — v0.2.6-v0.2.8: Difficulty System + Equipment Overhaul Phases 1-2

**v0.2.6: Difficulty System** (pre-existing in working tree, committed this session)
- `src/data/difficulty.js`: 5 difficulty stops, speed/elite bonuses, `getDifficultyInfo()`
- `globalDifficulty` (persistent) + `difficultyOverride` (transient per-run) state
- Monster scaling via `statMultiplier` + `difficultyMultiplier` in `placeMonsters`
- XP/Gold rewards multiply by difficulty. Completion bonus in `endDungeon`
- HUD badge, PrepScreen override panel, DungeonHeader label, RunSummary bonus line
- Save migration v10→v11

**v0.2.7: Equipment Phase 1 — Paper Doll + Component Architecture**
- 6 new components: `HeroSelector`, `PaperDoll`, `StatsSummary`, `ItemCard`, `InventoryGrid`, `EquipmentSettings`
- `EquipmentScreen.jsx` gutted to thin orchestrator
- Rarity glow CSS + `rarityStyles.js` utility
- Modal size `xl` → `full`

**v0.2.8: Equipment Phase 2 — Stat Breakdown**
- `calculateHeroStatsWithBreakdown()` in statCalculator.js
- `StatBreakdown.jsx` component, wired into `StatsSummary.jsx` click-to-expand
- Re-exported from `gameStore.js`

### Session 17 (2026-02-20) — v0.2.5 Notification Settings & Raid QoL

Completed Priority 3 in full (notification audit + raid re-entry friction):

**Part A: Notification Settings & Audit**
- Save migration v9→v10: `notificationSettings: { level: 'full' }` and `raidPreferences` state
- `economySlice.js`: Added `notificationSettings` initial state + `setNotificationLevel(level)` action
- `inventorySlice.js`: Filtering logic at top of `addLootNotification` — checks `notificationSettings.level` before creating notification
- `GameHUD.jsx`: Added Full/Reduced/Minimal toggle in settings dropdown

**Part B: Raid Re-entry Friction**
- `dungeonSlice.js`: Added `raidPreferences` state + `setRaidDifficulty` / `setLastRaid` actions
- `RaidRecapScreen.jsx`: "Run Again" button
- `RaidSelectorModal.jsx`: Difficulty persisted per raid
- `IdleScreen.jsx`: Quick Raid button for one-click re-entry

### Session 16 (2026-02-20) — v0.2.4 DPS Meter & Run History

Completed Priority 2 in full. DPS meter, combat timing, run history (50 max), Recent Runs tab in StatsScreen, RunSummary improvements.

### Session 15 (2026-02-19) — PROGRESS.md Audit

Full codebase audit. Trimmed phantom bugs, confirmed shipped features, fixed priority numbering.

### Session 14 (2026-02-19) — v0.2.2 UI Design Pass

Idle screen → Party Dashboard, hero badges, nav overflow menu, settings gear dropdown.

### Session 13 (2026-02-19) — v0.2.1 UI Compaction

Header merged, sidebar slimmed 256→176px, ~100px vertical space reclaimed.

### Session 12 (2026-02-18) — v0.2.0 Quality Pass Complete

Scaled achievement rewards, rebalanced homestead costs, consolidated changelog, verified cut system stubs.
