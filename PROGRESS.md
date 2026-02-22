# Progress

**Current Version: v0.3.2**
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
- [ ] **#1 Paper doll is anemic** — 72px sprite with three empty squares. Needs to feel like a character showcase, not a form layout.
- [ ] **#2 Vertical scroll / settings clipping** — Stat breakdowns push settings below fold at 1440x900. Settings panel clips at bottom.
- [ ] **#3 Slot panel squishes hero side** — 40/60 split when slot panel opens compresses hero column too much.
- [ ] **#4 No equipped vs candidates hierarchy** — Equipped item tooltip floats ambiguously. No clear visual relationship between current gear and replacements.
- [x] **#9 Equipment slot icons are placeholder** — Replaced with detailed sword/chestplate/ring silhouettes + 8 new item type icons + mapped 25 unmapped class items (v0.3.2)
- [ ] **#11 Mobile barely functional** — Paper doll takes half viewport, stat breakdowns require scrolling, no way to see slot panel without pushing everything off-screen.
- [ ] **#12 Two tabs isn't enough** — Character tab has hero info + paper doll + stat breakdown + settings + slot panel. Too much for one tab.
- [ ] **#13 Sell Junk easy to miss** — Tiny 10px orange button next to inventory count. Primary action buried.
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
- [ ] Surface more info inline — 18 total modals. Consider inline skill bar, sidebar panels, split-view layouts.

### Priority 7: UI Polish Passes
- [ ] Overview/stats screen layout
- [ ] Dungeon view proportions
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

### Priority 11: Combat & Graphics
- [ ] Boss mechanics depth, attack/skill animations, status effect VFX, equipment reflected on sprites

---

## Handoff Notes

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
