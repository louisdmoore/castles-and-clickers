# Progress

**Current Version: v0.2.2**
**Next: Bug Fixes & Gameplay Polish**

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

### Priority 2: DPS Meter & Stats Rework
- [ ] **Replace contribution meter with real DPS meter** — Current `ContributionMeter` shows total contribution percentages (damage dealt/taken/healed), not per-second rates. No elapsed-time tracking exists in `runStats`. Needs: add `startTime` to runStats, compute DPS live during combat, display Recount/Details-style breakdown.
- [ ] **Move detailed run stats to stats screen** — `RunSummary` modal shows per-run breakdown. `StatsScreen` has 4 tabs (Overview, Combat, Heroes, Journey) but only lifetime stats. Move per-run data to StatsScreen's Heroes tab so the dungeon view stays clean.

### Priority 3: Player Guidance & Notification Audit
- [ ] **Improve or remove Key Insight** — `RunSummary.jsx` has 6 conditional insights. 4 are specific and actionable (damage concentration, healer overexposed, healing deficit, flawless run). 2 are vague filler ("solid run", "tough fight"). Either sharpen the weak ones or cut them. Death log data exists but isn't used for insights.
- [ ] **Notification surface audit** — 8 loot notification types + toasts + celebrations + run summary + death recap. Three fixed-position zones (top-right toasts, bottom-right loot, full-screen celebrations). Auto-dismiss timings vary (3s-8s). Audit for: redundancy, spam during idle, missing notifications (homestead unlocks, skill points available), player-configurable verbosity.
- [ ] **Raid re-entry friction** — 3-4 clicks to re-run a raid (nav → select → difficulty → enter). No "Run Again" button on raid completion. Difficulty not persisted per raid.

### Priority 4: Difficulty System
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
- [ ] **Overall UX pass** — friction points, click counts, information discoverability
- [ ] **Shop & consumables rework** — current shop feels weak. More consumable types, bulk buying, pre-dungeon loadout, visible buff durations

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

## Handoff Notes

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
