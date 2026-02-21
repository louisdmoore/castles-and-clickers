# Progress

**Current Version: v0.2.8**
**Current: Equipment & RPG Overhaul (Phase 2 of 5 complete, needs visual feedback testing)**

---

## v0.2.0 Quality Pass ✅

Consolidated a massive design rethink (Phases 0-8, 11 sessions, ~15 systems built) into a clean release. Cut 10 thin systems, kept what serves the core loop (build → run → learn → improve), redesigned ascension/homestead/specialization.

**What shipped:**
- Ascension: no-reset, gold cost, +10% stats + dungeon cap per level
- Specialization: 20 subclasses (2 per class) at level 30, replaces prestige
- Homestead: 7 buildings with gameplay unlock tiers (party slots, shop, difficulty, consumables)
- Core loop feedback: RunSummary insights, DeathRecap analysis, PrepScreen party power
- Raids: Normal + Hard only
- Achievement reward scaling, homestead cost rebalancing (2.8→2.2)
- UI triage: tablet responsive, notification cap, modal sizing, combat log

**What was cut (stubbed, can return later):**
Room events, Tower of Trials, affix synergies, reforging, dungeon affixes, status effect combos, essence/awakening, raid mastery, mythic raids, hero trait generation

---

## v0.2.2 UI Design Pass ✅

Rethought information hierarchy from a player-decision perspective. The idle screen was the biggest UX failure — player in peak decision-making mode saw a castle icon and "No Active Dungeon."

**What shipped:**
- Idle screen → Party Dashboard: Party Readiness panel (per-hero badges, clickable to open Skills/Gear) + Next Target panel (world boss, upcoming unlocks, action buttons)
- Hero actionable badges in sidebar: yellow star for unspent skill points, red circle for empty equipment slots, green arrow for upgrade available — only shown between runs
- Nav overflow menu: 7 core buttons (Heroes, Skills, Gear, Shop, Home, Raids, Uniques) + "More" dropdown (Bestiary, Achieve, Stats, Help) with aggregate badge
- Settings gear dropdown replaces bare Reset button
- DungeonHeader stripped of tier progress squares and next-unlock indicator (moved to idle dashboard)
- ContributionMeter moved from combat log area to sidebar (combat-only)

---

## v0.2.1 UI Compaction ✅

Header merged into single compact row, sidebar slimmed from 256px to 176px, tighter spacing throughout. ~100px of vertical space reclaimed for gameplay.

---

## Next: Bug Fixes & Gameplay Polish

### Priority 1: Real Bugs
- [x] **Party slot 8 unreachable** — `PARTY_SLOTS` in `classes.js` defines 8 slots, but `getMaxPartySize` in `milestones.js` caps at 7 (barracks level 10). Slot 8 has no unlock path. Also: CLAUDE.md claims flex slots are ascension-gated, but the `ascensionCount` parameter is unused (underscore-prefixed). Decision needed: enable slot 8 (add unlock condition) or remove it from data. ✅ FIXED in commit f784959 - now correctly unlocks at Ascension 3.
- [x] **Skills screen unusable with large party** — Hero tabs in `SkillTreeScreen.jsx` are `flex-1` inside a 288px-wide column. At 5+ heroes, tabs shrink to ~40px each and overlap badge indicators. Needs wrapping, scrolling, or a different selection pattern. ✅ FIXED - changed to grid-cols-4 layout that wraps to 2 rows.
- [x] **Healers never cast Revive** — `chooseBestSkill` in `skillAI.js` only enters the heal path when *living* allies are below HP thresholds. Dead allies don't trigger heal selection, so Cleric's Resurrection capstone is effectively dead code. Fix: add dead-ally check that triggers revive skill selection. ✅ FIXED - added deadAllyCount tracking and revive skill priority at top of AI decision tree.

### Priority 2: DPS Meter & Stats Rework ✅
- [x] **Replace contribution meter with real DPS meter** — `DPSMeter.jsx` now shows live DPS/HPS/DTPS with elapsed combat timer. Combat timing tracked via `runStats.totalCombatTime` (accumulated across rooms). Role-aware display: damage dealers show DPS, healers show HPS, tanks show damage taken per second.
- [x] **Move detailed run stats to stats screen** — Added 5th tab "Recent Runs" to `StatsScreen.jsx`. Last 50 runs stored in `runHistory` with full per-hero DPS breakdown. Filter by all/victories/defeats, expandable cards show complete per-hero stats.

### Priority 3: Player Guidance & Notification Audit ✅
- [x] **Improve or remove Key Insight** — Completely removed the entire Key Insight section from `RunSummary.jsx`. Players now get cleaner, faster feedback with just the core stats (DPS, duration, hero breakdown).
- [x] **Notification surface audit** — Added 3-level verbosity setting (Full/Reduced/Minimal) in settings gear. Reduced suppresses auto-sold and common/uncommon auto-equips. Minimal also suppresses looted and partial collection milestones. Unique-drop loot notification removed (celebration modal is primary feedback). Homestead unlock toasts added for non-partySlot features.
- [x] **Raid re-entry friction** — "Run Again" button on RaidRecapScreen re-enters same raid/difficulty. Difficulty persisted per raid in `raidPreferences.difficultyPerRaid`. Quick Raid button on IdleScreen for one-click re-entry to last raid.

### Priority 5: Difficulty System
- [ ] **Move difficulty to persistent global setting** — Currently a per-dungeon slider on PrepScreen (5 stops, 1.0x-3.0x, unlocks at D10). Backed by `dungeonSettings.difficultyMultiplier` in dungeonSlice. Move to a "set and forget" global setting accessible from settings or HUD, with optional per-dungeon override.

### Priority 5: Equipment Screen Overhaul
- [ ] **Diablo-inspired item UI** — Current equipment screen is a compact list layout with hero tabs. Has hover-to-compare via EquipmentTooltip and colored rarity borders, but no paper doll, no grid inventory, no animated rarity glow, no sort/filter. *Plan separately — significant undertaking.*

### Priority 6: Reduce Modal Dependency
- [ ] **Surface more info inline** — 18 total modals (12 in ModalManager + 6 floating). Every major feature requires a full-screen modal that hides the dungeon canvas. Consider: inline skill bar, sidebar panels, floating tooltips, split-view layouts. Phase 7 from the original design rethink.

### Priority 7: UI Polish Passes
- [ ] **Overview/stats screen** — layout, spacing, information hierarchy
- [ ] **Dungeon view** — canvas, header bar, combat area proportions
- [ ] **All modals audit** — consistent sizing, padding, scroll, close buttons, mobile
- [ ] **Homestead screen** — visual improvements, unlock previews, progression feel
- [ ] **Achievement improvements** — polish UI, rename away from "achieve" terminology, progress indicators, celebration effects, category filtering
- [ ] **Status effect icon consistency** — unify status effect icons across all contexts (combat log, sidebar hero cards, tooltips, dungeon canvas)
- [ ] **HUD top-right info rethink** — evaluate the resource/stat bar. Polish pass.
- [ ] **DPS meter clarity** — showing DPS/HPS/DTPS per role is confusing. Consider: just show DPS for everyone (damage is the universal metric), or use clearer labels, or show a single "contribution %" instead of raw per-second numbers.
- [ ] **RunSummary "View Details" is useless** — just opens generic stats screen. Either: expand RunSummary inline with full per-hero table, deep-link to the specific run in Recent Runs tab, or remove the button entirely.
- [ ] **Overall UX pass** — friction points, click counts, information discoverability
- [ ] **Shop & consumables rework** — current shop feels weak. More consumable types, bulk buying, pre-dungeon loadout, visible buff durations
- [ ] **Raid completion says "Dungeon Level X Cleared"** — message/toast incorrectly refers to raid as a dungeon clear

### Priority 8: Skill Management UX
- [ ] **Reduce skill management tedium** — Currently manual per-hero allocation with no templates or auto-spend. With 5-7 heroes, that's 7 context switches minimum. Options: auto-spend with manual override, saved builds per class, batch level-up, or fewer/bigger skill choices.

### Priority 9: Raid Rethink
- [ ] **Raids gate ascension** — require clearing a specific raid before ascending. One-time checkpoint.
- [ ] **More raid loot** — raids should feel rewarding beyond uniques. Raid-exclusive gear sets, homestead materials, large gold payouts.
- [ ] **Raid re-entry friction** (see P3) — if raids matter more, getting back into one needs to be frictionless
- [ ] **Raid selector UI overhaul** — replace dropdown modal with visual raid selection screen: raid cards with art/theme, difficulty indicators, loot previews, clear history.

### Priority 10: Balance Pass
- [ ] **Rethink party size** — Is 7 slots right? (Slot 8 is unreachable — see P1.) Does party size dilute individual hero identity?
- [ ] **Monster scaling vs party size** — No party-size scaling exists currently. Monster HP/damage/count only scales by dungeon level/tier. Larger parties are a free power boost.
- [ ] **Overall difficulty curve audit** — verify D1-D30+ feels right with homestead bonuses, specializations, and larger parties all stacking

### Priority 11: Combat & Graphics
- [ ] **Boss mechanics** — Boss phase system exists (HP thresholds + ability rotations + enrage), but could be deeper. Telegraphed attacks, phase transitions with visual feedback.
- [ ] **Raid mechanics depth** — more interesting raid-specific modifiers beyond stat multipliers
- [ ] **Attack/skill animations** — Generic effect system exists (AnimationManager.js: beam, impact, dart, etc.) but no per-weapon or per-skill unique animations
- [ ] **Boss/monster attack animations** — distinct visual feedback for different monster abilities
- [ ] **Status effect VFX** — visual indicators on units when burning, poisoned, stunned
- [ ] **General graphic enhancements** — dungeon theme variety, room transitions, particles, screen shake
- [ ] **Add raid info to help/encyclopedia** — raids aren't covered in in-game help

---

## Equipment & RPG Overhaul — "Make Gear Matter"

Full plan in session transcript. 5 phases, currently on Phase 2.

### Phase 1: Paper Doll & Component Architecture (v0.2.7) ✅
- Decomposed `EquipmentScreen.jsx` (430→~100 lines) into 6 focused subcomponents under `src/components/equipment/`
- New 3-column layout: Stats+Settings (w-48) | Paper Doll (w-56) | Inventory Grid (flex-1)
- Mobile responsive: collapses to single column with stats+doll side-by-side above grid
- Created `src/utils/rarityStyles.js` — `getRarityBorderClass(item)` helper
- Added rarity glow CSS: animated borders for rare (blue 3s), epic (purple 2.5s), legendary (gold 2s), plus infused/ascended shimmer overlays
- Modal size changed from `xl` to `full` in ModalManager
- No state changes, no migration

### Phase 2: Stat Breakdown & Build Visibility (v0.2.8) ✅ (code done, needs visual testing)
- Added `calculateHeroStatsWithBreakdown(hero, allHeroes, homesteadBonuses)` to `statCalculator.js` (~120 lines)
- Mirrors the 9-stage stat pipeline, recording each source's contribution
- Created `StatBreakdown.jsx` — tree-view display with source icons, labels, +/- values
- Stats in `StatsSummary.jsx` are now clickable — toggle expandable breakdown panel
- Re-exported from `gameStore.js`
- **NEEDS TESTING:** Click each stat, verify breakdown totals match displayed stats. Test with homestead bonuses, skills, party auras, specialization, ascension.
- No state changes, no migration

### Phase 3: Affix Synergy System (v0.2.9) — NOT STARTED
### Phase 4: Enhanced Tooltips & Loot Feel (v0.3.0) — NOT STARTED
### Phase 5: Polish & Progression (v0.3.1) — NOT STARTED

---

## Handoff Notes

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
- **Still needs visual feedback testing — breakdown hasn't been verified in-browser yet**

**Next session:** Visually test the equipment screen + stat breakdowns in-browser. Then proceed to Phase 3 (affix synergies) or Phase 4 (enhanced tooltips).

### Session 17 (2026-02-20) — v0.2.5 Notification Settings & Raid QoL

Completed Priority 3 in full (notification audit + raid re-entry friction):

**Part A: Notification Settings & Audit**
- Save migration v9→v10: `notificationSettings: { level: 'full' }` and `raidPreferences` state
- `economySlice.js`: Added `notificationSettings` initial state + `setNotificationLevel(level)` action
- `inventorySlice.js`: Filtering logic at top of `addLootNotification` — checks `notificationSettings.level` before creating notification. Matrix: auto-sold suppressed in reduced+, common/uncommon auto-equip suppressed in reduced+, looted + partial milestones suppressed in minimal
- `inventorySlice.js`: Removed redundant `unique-drop` loot notification from `processUniqueDrop` (celebration modal is primary feedback)
- `economySlice.js`: Added homestead unlock toasts in `upgradeBuilding` for non-partySlot unlocks
- `GameHUD.jsx`: Added Full/Reduced/Minimal toggle in settings dropdown above Reset button

**Part B: Raid Re-entry Friction**
- `dungeonSlice.js`: Added `raidPreferences` state + `setRaidDifficulty(raidId, difficulty)` / `setLastRaid(raidId, difficulty)` actions
- `enterRaid()` and `completeRaid()` both call `setLastRaid()` to persist the most recent raid
- `RaidRecapScreen.jsx`: Added "Run Again" button (primary) alongside existing "Continue" button. Uses `setTimeout(100)` delay after clearing recap to let state settle
- `RaidSelectorModal.jsx`: `RaidCard` initializes difficulty from `raidPreferences.difficultyPerRaid[raid.id]`. Difficulty changes persist via `setRaidDifficulty`
- `IdleScreen.jsx`: Quick Raid button shows if `raidPreferences.lastRaidId` exists and is unlocked. One-click re-entry with persisted difficulty

**Technical notes:**
- Build passes: 1,106KB bundle (unchanged)
- Lint at 77 errors (below ~83 baseline, 3 fewer than before — fixed conditional hooks in IdleScreen)
- All hooks in IdleScreen moved above early returns to satisfy rules-of-hooks
- `gameStore.js` merge and resetGame both handle the two new state fields

### Session 16 (2026-02-20) — v0.2.4 DPS Meter & Run History

Completed Priority 2 in full across 5 implementation phases:

**Phase 1: Combat Timing Infrastructure**
- `combatSlice.js`: Added `combatStartTime`, `totalCombatTime`, `currentRoomCombatStart` fields to runStats
- `combatSlice.js`: Created `startRoomCombat()`, `endRoomCombat()`, `saveRunToHistory()` actions
- `useCombat.js`: Wired timing to phase transitions — starts on COMBAT phase entry, ends on CLEARING/DEFEAT
- Combat time accumulates across multi-room dungeons

**Phase 2: DPS Display**
- `constants.js`: Added `formatTime(seconds)` helper for MM:SS formatting
- Renamed `ContributionMeter.jsx` → `DPSMeter.jsx` with complete rewrite
- Shows live DPS/HPS/DTPS (role-aware): damage dealers get DPS, healers get HPS, tanks get damage taken per second
- Displays elapsed combat time and total party DPS
- `Sidebar.jsx`: Updated import to use DPSMeter

**Phase 3: Run History Storage**
- `combatSlice.js`: Added `runHistory: []` state (max 50 runs, FIFO)
- `dungeonSlice.js`: Enhanced `endDungeon()` to calculate DPS metrics (averageDPS, per-hero dps/hps/dtps)
- Run snapshot includes: level, success, timestamp, totalCombatTime, averageDPS, MVP, biggestHit, full heroStats with per-second rates
- Saved on both victory and defeat

**Phase 4: Recent Runs Tab**
- `StatsScreen.jsx`: Added 5th tab "Recent Runs" alongside Overview/Combat/Heroes/Journey
- Created `RunHistoryCard` component with expand/collapse per-hero breakdown
- Filter controls: All/Victories/Defeats with run counts
- Table view shows: hero, DPS, HPS, damage out, damage in, healing, kills
- Empty state messaging for filtered views

**Phase 5: RunSummary Improvements**
- Added DPS and duration display to stats grid (3-column: Total Damage, Average DPS, Duration)
- Completely removed entire Key Insight section — cleaner, faster feedback
- Added "View Details" button (opens StatsScreen to stats modal, though tab routing not fully wired)
- Biggest Hit moved to separate row below main stats

**Technical notes:**
- No save migration needed — new fields default correctly via initial state and spread
- Build passes: 1,100KB bundle (unchanged from baseline)
- Lint at 77 errors (baseline ~78-83, no new errors added)
- All timing logic uses `Date.now()` and converts to seconds for display
- RunHistory capped at 50 entries to avoid localStorage bloat
- DPSMeter uses `useThrottledDisplay` pattern for performance (not implemented yet, but follows existing ContributionMeter pattern)

**Known limitations:**
- "View Details" button in RunSummary opens StatsScreen but doesn't navigate to Recent Runs tab automatically (needs modal tab parameter support)
- Very short combats (< 0.1s) will show inflated DPS but accurate duration
- Summons (pet_, clone_, undead_) filtered out of DPS meter display

### Session 15 (2026-02-19) — PROGRESS.md Audit

Full codebase audit of PROGRESS.md against actual code. Key findings:
- 9 of 12 Priority 1 bugs were phantom issues (not broken). Trimmed to 3 real bugs.
- All v0.2.2 features confirmed shipped and working as described.
- Fixed duplicate "Priority 9" numbering (was Raids + Balance, now P9 + P10).
- Added code-level context to each priority item (what exists, what's missing, where it lives).
- Boss phase system confirmed working (phases, ability rotations, enrage at low HP).
- Animation system exists (AnimationManager.js) but effects are generic, not per-weapon/skill.
- 18 total modals confirmed — very modal-heavy architecture.
- `getMaxPartySize` caps at 7; `ascensionCount` param is unused (underscore-prefixed).

### Session 14 (2026-02-19) — v0.2.2 UI Design Pass

Redesigned information hierarchy across 7 files. Key architectural notes:
- `NavBar.jsx` now splits buttons into `CORE_IDS` array (inline) vs overflow (dropdown). "More" button shows aggregate badge if any overflow item has a badge. Click-outside-to-close pattern.
- `GameHUD.jsx` has a settings gear dropdown with click-outside-to-close. Reset triggers same `onReset` → confirmation modal flow as before.
- `IdleScreen.jsx` now imports from `gameStore` (calculateSkillPoints, calculateUsedSkillPoints) and uses `compareToEquipped` store action for upgrade detection. Has `HeroReadinessRow` sub-component with clickable badges that open modals.
- `Sidebar.jsx` HeroCard computes `badges` via useMemo keyed on `[inDungeon, hero, inventory, compareToEquipped]`. ContributionMeter imported and rendered in sidebar (combat-only).
- `DungeonHeader.jsx` no longer receives `upcomingUnlocks` prop. Removed `LockIcon` import and `tierSize` variable.
- `GameLayout.jsx` no longer imports ContributionMeter. Combat log div simplified (no flex wrapper needed).

### Session 13 (2026-02-19) — v0.2.1 UI Compaction

Header, sidebar, and spacing compaction pass.

### Session 12 (2026-02-18) — v0.2.0 Quality Pass Complete

Executed Phase 7 (final phase) directly: scaled 17 achievement rewards, reduced homestead costMultiplier 2.8→2.2, consolidated changelog, verified no broken refs to cut systems. Build clean (1,089KB), lint at 78 errors (below 83 baseline).

**Architecture post-quality-pass:**
- 10 cut systems have stub exports (no broken imports)
- Save migration at v7 (or v8 with specialization)
- `statCalculator.js` chain: base → homestead → equipment → affixes → skills → party auras → specialization → ascension
- Module-level mutable state pattern: `currentAscensionCount`, `currentPartyAuras` in statCalculator
- Three-column CSS grid at 1440px+ with collapsible run stats panel
- Lint baseline: 78 errors (pre-existing, mostly canvas files + React hooks)
