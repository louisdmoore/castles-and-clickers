# Progress

**Current Version: v0.2.2**
**Next: Bug Fixes & UI Polish**

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

## Next: Bug Fixes & UI Polish

### Priority 1: Layout Bugs (ship-blocking)
- [ ] **Combat log off-screen** — log panel renders below the visible viewport
- [ ] **Run stats toggle clashes with dungeon header** — toggle button overlaps the zone header bar
- [ ] **Contribution meter off-screen** — meter renders outside the visible area
- [ ] **Save indicator stuck on "Saved just now"** — always shows "just now" regardless of actual save time
- [ ] **Loot drop toasts positioned wrong** — notifications appear in a weird spot
- [ ] **PrepScreen z-index** — advancing dungeon screen covers modals; should render *under* them
- [ ] **Auto-advance too fast** — pace between dungeons too quick to register what happened
- [ ] **Unique celebration stars overflow** — star particles from unique item modal render outside the modal bounds
- [ ] **Party slot unlock inconsistent** — slots don't unlock reliably. Investigate: homestead Barracks levels vs old dungeon-clear/ascension gating may be conflicting or not fully wired
- [ ] **Skills screen broken with large party** — UI breaks when party has 5+ heroes; layout doesn't handle the extra hero tabs/panels
- [ ] **Healers not casting revive** — revive spells don't seem to trigger. Investigate skill selection logic in `chooseBestSkill`/`skillEngine.js` — revive may not be prioritized or may have broken targeting (no valid dead allies found)
- [ ] **Boss/monster sprite mismatch** — canvas dungeon sprites and UI icon sprites (sidebar, modals, tooltips) look different for the same monsters/bosses. Should be visually consistent across canvas and UI.

### Priority 2: DPS Meter & Stats Rework
- [ ] **Replace contribution meter with real DPS meter** — actual damage/second per hero, updating live during combat (Recount/Details-style)
- [ ] **Move detailed run stats to stats screen** — stats screen becomes the "after action report" location; removes the clashing toggle panel from dungeon view

### Priority 3: Player Guidance & Notification Audit
- [ ] **Evaluate Key Insight usefulness** — currently not very helpful. Options: improve (more specific advice), simplify (fewer rules, punchier), or remove entirely
- [ ] **Notification/guidance audit** — are we guiding the player enough between systems? Too many notifications? Too few? Is there clutter? Audit the full notification surface: toasts, loot cards, unlock celebrations, auto-equip suggestions. Decide what earns a notification vs. what should be silent.
- [ ] **Raid re-entry friction** — too many clicks to re-run a raid. Consider: "Run Again" button on raid completion, or a quick-start option that skips the selector modal

### Priority 4: Difficulty System Rethink
- [ ] **Move difficulty to top-level setting** — persistent global "world difficulty" instead of per-dungeon slider on PrepScreen

### Priority 5: Equipment Screen Overhaul
- [ ] **Diablo-inspired item UI** — paper doll, hover-to-compare, rarity glow, clearer affix display, inventory grid with sort/filter. *Plan separately — significant undertaking.*

### Priority 6: Reduce Modal Dependency
- [ ] **Surface more info in dungeon view** — skills, items, key info shown inline instead of full-screen modals that hide the gameplay canvas. Consider: inline skill bar, sidebar panels, floating tooltips.

### Priority 7: UI Polish Passes
- [ ] **Overview/stats screen** — layout, spacing, information hierarchy
- [ ] **Dungeon view** — canvas, header bar, combat area proportions
- [ ] **All modals audit** — consistent sizing, padding, scroll, close buttons, mobile
- [ ] **Homestead screen** — visual improvements, unlock previews, progression feel
- [ ] **Achievement improvements** — polish UI, rename away from "achieve" terminology, progress indicators, celebration effects, category filtering
- [ ] **Status effect icon consistency** — unify status effect icons across all contexts (combat log, sidebar hero cards, tooltips, dungeon canvas). Same icon set everywhere.
- [ ] **HUD top-right info rethink** — evaluate the resource/stat bar at top-right. Feels good but could be tighter or more informative. Polish pass.
- [ ] **Overall UX pass** — general friction points, click counts to common actions, information discoverability
- [ ] **Shop & consumables rework** — current shop feels weak. Consumables especially need more variety, clearer value proposition, and better UI. Consider: more consumable types, bulk buying, pre-dungeon loadout, visible buff durations, shop inventory that feels worth checking

### Priority 8: Skill Management UX
- [ ] **Reduce skill management tedium** — managing skill points across 5-7 heroes is busywork. Options: auto-spend with manual override, skill templates/saved builds per class, batch level-up screen for all heroes at once, or fewer/bigger skill choices that require less frequent interaction.

### Priority 9: Raid Rethink
- [ ] **Raids gate ascension** — require clearing a specific raid before ascending. One-time checkpoint ("prove you're ready") rather than repeating blocker. Keeps core dungeon loop unblocked but gives raids real stakes.
- [ ] **More raid loot** — raids should feel rewarding beyond uniques. Consider: raid-exclusive gear sets, homestead materials, large gold payouts, cosmetic rewards, crafting currencies. Make re-running raids worthwhile.
- [ ] **Raid re-entry friction** (see P3) — if raids matter more, getting back into one needs to be frictionless
- [ ] **Raid selector UI overhaul** — current modal with dropdown is underwhelming. Replace with a visual raid selection screen: raid cards with art/theme, difficulty indicators, loot previews, clear history. Should feel like picking a destination, not filling out a form.

### Priority 9: Balance Pass
- [ ] **Rethink party size** — is 7-8 slots too many? Does it dilute individual hero identity? Consider: fewer slots with more impactful choices, or keep large parties but make composition matter more (role requirements, synergy bonuses for balanced teams, penalties for stacking)
- [ ] **Monster scaling vs party size** — with more party slots available, the game gets noticeably easier. Monster HP/damage/count needs to scale with party size so larger parties feel like a strategic choice, not a free power boost.
- [ ] **Overall difficulty curve audit** — verify D1-D30+ feels right with homestead bonuses, specializations, and larger parties all stacking

### Priority 10: Combat & Graphics
- [ ] **Boss mechanics** — investigate adding real boss abilities/phases beyond stat scaling. Telegraphed attacks, enrage timers, phase transitions, etc.
- [ ] **Raid mechanics depth** — more interesting raid-specific modifiers beyond stat multipliers. Environmental hazards, unique boss patterns, raid-wide effects.
- [ ] **Attack/skill animations** — unique canvas animations for different attack types, skill activations, and spell effects. Currently everything looks the same.
- [ ] **Boss/monster attack animations** — distinct visual feedback for different monster abilities. Boss attacks should feel impactful.
- [ ] **Status effect VFX** — visual indicators on units when burning, poisoned, stunned, etc. Currently only shown as icons.
- [ ] **General graphic enhancements** — more visual variety in dungeon themes, better room transitions, particle effects, screen shake on big hits
- [ ] **Add raid info to help/encyclopedia** — raids aren't covered in the in-game help section

---

## Handoff Notes

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
