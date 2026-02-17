# Implementation Progress — Design Rethink

**Current Phase: Phase 5 — v0.3.1 — Surprise Me**

---

## Phase 0: Data Prep (no engineering, data definitions only) ✅
*Reference: DESIGN_RETHINK.md Section 19*
*Goal: Define all data tables that later phases reference.*

- [x] Affix tag assignments for all 20 affixes → added `tags` field to each entry in `src/data/itemAffixes.js`
- [x] Affix synergy bonus table → created `AFFIX_SYNERGY_BONUSES` + `getActiveSynergies()` in `src/data/itemAffixes.js`
- [x] Affix pool assignments per dungeon theme (favored drops) → added `favoredAffixes` to all 6 themes in `src/data/dungeonThemes.js`
- [x] Status effect combo table → created `STATUS_COMBOS` + `getActiveCombos()` in `src/data/statusEffects.js`
- [x] Hero trait pool (14 traits with stat effects) → created `src/data/heroTraits.js` with weighted rolling
- [x] Unique item synergy tag assignments for all 33 uniques → added `tags` to every entry in `src/data/uniqueItems.js`
- [x] Room event definitions (10 events) → created `src/data/roomEvents.js` with weighted rolling
- [x] Dungeon affix definitions (8 types) → created `src/data/dungeonAffixes.js` with weighted rolling
- [x] Ascension milestone reward table → created `src/data/ascensionMilestones.js` with helper functions
- [x] Achievement definitions (30 achievements) → created `src/data/achievements.js` across 5 categories

---

## Phase 1: v0.2.0 — See What's Happening
*Reference: DESIGN_RETHINK.md Sections 3, 4*
*Goal: Player can see what's happening and why.*
*Prereq: Add `runStats` accumulator to `combatSlice` (architectural prereq #2)*

- [x] **PREREQ:** Add `runStats` object to `combatSlice.js` state — `{ [heroId]: { damageDealt, healingDone, damageTaken, damagePrevented, controlTime, turnsTaken, kills, biggestHit } }`, initialized on `startDungeon`, updated per-tick in `useCombat`
- [x] Role-aware contribution meter component (`ContributionMeter`) — reads `runStats`, shows per-hero contribution with role-specific metrics (Section 3)
- [x] Run summary popup on dungeon completion — MVP, biggest hit, totals, positive message (Section 3)
- [x] Preparation phase screen — `POST_RUN` phase between dungeon end and next start, party overview, dungeon preview, auto-dismiss for idle players (Section 4)
- [x] Milestone widget — 2-3 nearest goals shown on prep screen / HUD (Section 4)

---

## Phase 2: v0.2.1 — Know What To Do ✅
*Reference: DESIGN_RETHINK.md Sections 3, 5*
*Goal: Player knows what went wrong and what to change.*

- [x] Death recap popup on party wipe — data-focused, shows kill order, damage taken vs healing, dominant damage type (Section 3)
- [x] Equipment comparison tooltips — use existing `compareToEquipped`, show stat diffs on hover/drop (Section 5.1)
- [x] Smart auto-equip — suggest + confirm for rare+ items, silent equip below threshold (Section 5.1)

---

## Phase 3: v0.2.2 — Make Real Choices ✅
*Reference: DESIGN_RETHINK.md Sections 5, 7, 12*
*Goal: Player makes real choices that change outcomes.*

- [x] Difficulty slider on prep screen (1.0x–3.0x) — multiplier on monster stats + loot quality (Section 7.1)
- [x] Hero traits on recruit — gameplay-affecting random traits from trait pool (Section 12.1)
- [x] Loot targeting — themed affix pools per dungeon, favored affixes at 2x rate (Section 5.4)
- [x] Infused/Ascended gear tiers at 2x/3x difficulty (Section 7.1)

---

## Phase 4: v0.3.0 — A New Chapter ✅
*Reference: DESIGN_RETHINK.md Section 8*
*Goal: The game opens up with ascension.*
*Prereq: Versioned save migration system (architectural prereq #3)*

- [x] **PREREQ:** Build versioned save migration system — replace ad-hoc `merge` with `v1_to_v2` pattern
- [x] Ascension system (full Section 8) — partial reset, persistent state, stat bonuses, structural unlocks
- [x] 7th party slot (Ascension 1 reward) — modify `getMaxPartySize`, add flex slot
- [x] Offline progress enhancement — expand `calculateOfflineProgress`, add welcome-back screen

---

## Phase 5: v0.3.1 — Surprise Me
*Reference: DESIGN_RETHINK.md Sections 7, 9*
*Goal: Every run feels different.*

- [ ] Room random events (8-10 types, 15% per room) — event handlers using existing systems (Section 7.2)
- [ ] Tower of Trials (endless challenge mode) — no healing between floors, high score tracking (Section 9)

---

## Phase 6: v0.3.2 — Craft My Build
*Reference: DESIGN_RETHINK.md Sections 5, 6*
*Goal: Player shapes heroes exactly how they want.*

- [ ] Reforging / enchantment — escalating costs, lock-one-affix option, mutable affix arrays (Section 5.3)
- [ ] Affix synergy bonuses — tag matching in `calculateHeroStats` (Section 5.2)
- [ ] Status effect combos — lookup table in `combatDamageResolution` (Section 6.1)

---

## Phase 7: v0.4.0 — The Full Picture
*Reference: DESIGN_RETHINK.md Sections 6, 11, 12, 14*
*Goal: Feels like a real game.*
*Prereq: Extract `GameLayout.jsx` into composable pieces (architectural prereq #1)*

- [ ] **PREREQ:** Extract `GameLayout.jsx` → `LayoutShell`, `ModalManager`, `DungeonHeader`, `GameOrchestrator`
- [ ] Layout overhaul — three-column CSS grid for desktop (Section 14)
- [ ] Passive aura buffs on capstone skills — `partyBuff` field + `statCalculator` (Section 6.2)
- [ ] Unique conditional leveling + duplicate fusion (Section 11.2, 11.4)
- [ ] Hero prestige stars — permanent across ascension, +3% per star (Section 12.3)

---

## Phase 8: v0.5.0+ — Depth
*Reference: DESIGN_RETHINK.md Sections 6, 7, 9, 10, 13, 15*

- [ ] Raid difficulty tiers (Normal/Heroic/Mythic) (Section 10.3)
- [ ] Raid-specific mechanics — Tier 1 data-only first (Section 10.1)
- [ ] 8th party slot (Ascension 3) (Section 6.3)
- [ ] Dungeon affixes (per-run modifiers) (Section 7.3)
- [ ] Achievement system with constraint challenges
- [ ] Essence currency + unique awakening (Section 13.2, 11.2)
- [ ] Raid mastery tracking (Section 10.2)
- [ ] Progressive disclosure / gated feature unlocks (Section 15)

---

## Handoff Notes

*Space for sessions to leave notes for the next session. Most recent first.*

### Session 5 (2026-02-17) — Phase 4 Complete (v0.3.0)

**Completed:** All 4 Phase 4 tasks (1 prereq + 3 features).

**Design decisions:**
- Save migration v2→v3: Added `ascension: { count: 0 }` and `maxDungeonLevel: 30` to persisted state. Migration system uses numbered functions in `migrations.js` (`SAVE_VERSION = 3`).
- Ascension system: `performAscension` in dungeonSlice does selective reset — heroes reset to level 10 with skills cleared (equipped gear preserved), gold reset to 10k, inventory cleared, dungeon progress reset to D9/D10. Persistent across ascension: heroes themselves, equipped gear, homestead, uniques, stats, bench heroes. Each ascension grants +10% all stats (multiplicative via `getAscensionStatMultiplier`) and increases dungeon cap (+5 per ascension via `getAscensionDungeonCap`).
- Stat multiplier uses module-level `currentAscensionCount` in statCalculator.js (avoids threading ascension count through every call site). Initialized in `gameStore.js` merge on load, updated in `performAscension`. Ascension count is part of the cache key (`a${count}`) so stat caches auto-invalidate on ascension.
- AscensionModal shows current bonuses, what you gain, what resets, what's preserved. Confirmation flow with "I Understand, Ascend" button. Accessible from PrepScreen when at max dungeon level.
- 7th/8th party slots: Extended PARTY_SLOTS from 4 to 8 entries. Slots 5-6 are role-restricted (DPS at D10, Healer at D20). Slots 7-8 are flex slots (`role: null`, ascensionRequired: 1/3) — any class can fill them. `getClassesByRole(null)` returns all classes. Updated all slot iteration sites (heroSlice, HeroManagement, HeroPortraitBar, HeroRecruitment, NavBar, GameLayout) to use `maxPartySize` instead of `PARTY_SLOTS.length`.
- `getMaxPartySize(highestDungeonCleared, ascensionCount)` now takes two parameters. All call sites updated.
- Offline progress: `calculateOfflineProgress` already read `maxDungeonLevel` from state (which is now dynamic from ascension). Added `ascensionCount` to the return object. WelcomeBackModal shows ascension tier when count > 0.
- Version bumped to v0.3.0 in changelog.js.

**Notes for next session:**
- The `regenPercent` trait (Enduring), `controlResist` trait (Iron Will), and `healingMultiplier`/`healingReceivedMultiplier` traits (Devoted) are still not wired into combat processing. Carried forward from Session 4 notes.
- MilestoneWidget has a pre-existing bug: duplicate `style` attribute on the progress bar `div` (line ~146). The second `style` overrides the first. Not a blocker but should be fixed eventually.
- Pre-existing lint errors (~84) are unchanged. No new errors introduced.
- `usedSlotDiscounts` array tracks which slots have used their first-recruit discount. Flex slots (7-8) have `cost: 0` so discount tracking doesn't apply to them.

**Next up:** Phase 5 — Room random events, Tower of Trials.

### Session 4 (2026-02-17) — Phase 3 Complete (v0.2.2)

**Completed:** All 4 Phase 3 tasks.

**Design decisions:**
- Difficulty slider: 5 stops (1.0/1.5/2.0/2.5/3.0x) stored in `dungeonSettings.difficultyMultiplier`, carried on `dungeon` object. Applied as `statMultiplier` to `placeMonsters` (multiplicative with raid multiplier), and as `lootMultiplier` to drop rate + `generateEquipment` rarity bonus. DifficultySlider component is a `memo`'d sub-component of PrepScreen.
- Hero traits: Replaced old cosmetic trait system (inline array in heroGenerator) with `rollHeroTraits()` from heroTraits.js. Heroes store `traits: ['id1', 'id2']` (array of IDs). Stat multipliers (HP/ATK/DEF/SPD) applied in `calculateHeroStats` after base stats. Combat bonuses (crit, dodge, lifesteal, damage reduction) applied in `applyPassiveEffects` alongside skill passives. XP multiplier applied in `addXpToHero`. Traits displayed on HeroCard as amber-colored pills with tooltip.
- Loot targeting: `rollAffix` in itemAffixes.js now accepts `favoredAffixes` parameter for weighted selection (2x). Favored affixes stored on `dungeon` object via `getDungeonTier(level).theme` → `DUNGEON_THEMES[theme].favoredAffixes`. Passed through `generateEquipment` → local `rollAffix` wrapper → `rollAffixFromPool`.
- Infused/Ascended gear: `quality` field on items (`'infused'` or `'ascended'`). Infused = guaranteed bonus affix (20-40% chance at 2.0x+). Ascended = 1.3x stat boost + bonus affix (15% chance at 3.0x). Visual: emerald green (#34d399) for Infused, pink (#f472b6) for Ascended (overrides rarity color). Name prefixed with "Infused"/"Ascended".
- Combat heroes now include `traits` array for access in combat resolution code.

**Notes for next session:**
- Phase 4 requires versioned save migration system as a prerequisite. The existing `merge` function in gameStore.js handles backwards compatibility, but a proper `v1_to_v2` migration pattern is needed for the ascension system's persistent state.
- The `regenPercent` trait (Enduring: 1% HP/turn) and `controlResist` trait (Iron Will: +10% stun resist) are defined but not yet wired into combat processing. These need handlers in `combatStatusEffects.js` (for regen) and status effect application code (for resist). Can be deferred.
- `healingMultiplier`/`healingReceivedMultiplier` traits (Devoted) are defined but not yet applied in healing code. Need handlers in skill execution healing path.

**Next up:** Phase 4 — versioned save migration, ascension system, 7th party slot, offline progress.

### Session 3 (2026-02-17) — Phase 2 Complete (v0.2.1)

**Completed:** All 3 Phase 2 tasks.

**Design decisions:**
- Death recap uses `deathLog` array in combatSlice, populated by `recordHeroDeath` called from 3 death sites (combatDamageResolution, combatSkillExecution, combatStatusEffects). DOT deaths use the DOT type name (Burn/Poison/Bleed) as killer. `lastDeathRecap` built by endDungeon on defeat, auto-dismisses after 8s.
- Equipment comparison tooltips wrap EquippedSlot and InventoryRow in existing `Tooltip` + `EquipmentTooltip` components. Uses existing `compareToEquipped` for stat diffs.
- Smart auto-equip: `processLootDrop` now checks two thresholds before auto-equipping: (1) rare+ rarity, (2) score improvement within 10% of current (close call). Items meeting either threshold go to inventory with a `suggest-equip` notification showing stat diffs and [Equip]/[Keep Current] buttons. Common/uncommon clear upgrades still auto-equip silently. Suggest-equip notifications get 8s auto-dismiss (vs 4.5s for regular).
- `clearOldNotifications` uses 9s cutoff for suggest-equip (vs 5s regular) to avoid premature server-side cleanup before the 8s client-side timer fires.

**Next up:** Phase 3 — difficulty slider, hero traits, loot targeting, infused/ascended gear tiers.

### Session 2 (2026-02-17) — Phase 1 Complete (v0.2.0)

**Completed:** All 5 Phase 1 tasks (1 prereq + 4 features).

**Design decisions:**
- `runStats` accumulator tracks per-hero stats per-run: damageDealt, healingDone, damageTaken, damagePrevented, controlTime, turnsTaken, kills, biggestHit. Updated per tick in useCombat alongside existing lifetime stats.
- ContributionMeter shows role-aware bars: tanks=blue (damage taken), healers=green (healing done), DPS=red (damage dealt).
- RunSummary uses `lastRunSummary` state (excluded from persistence) that snapshots runStats before endDungeon clears it. Auto-dismisses after 5s when auto-advance is on.
- Preparation phase uses `prepPhase` state set by endDungeon. Removed auto-start setTimeout from useGameLoop; PrepScreen component now handles auto-advance via its own 5s timer.
- Flow: dungeon COMPLETE → 2s transition animation → PrepScreen visible (RunSummary modal on top if applicable) → RunSummary auto-dismisses → PrepScreen auto-dismisses (5s) → next dungeon starts.
- MilestoneWidget computes 2-3 nearest goals: hero level-up proximity, dungeon unlock distance, unique collection progress, homestead upgrade affordability. Sorted by completion proximity.
- Removed `combatPauseUntil` unused reactive selector from useGameLoop (was only read imperatively inside gameTick).

**Next up:** Phase 2 — death recap popup, equipment comparison tooltips, smart auto-equip.

### Session 1 (2026-02-17) — Phase 0 Complete

**Completed:** All 10 Phase 0 data definition tasks.

**Design decisions:**
- Affix tags chosen to create 6 achievable synergy pairs: speed, fortify, healing, execution, berserker, sustain. Tags like `fire`/`frost`/`lightning` exist on affixes but can't form pairs yet (all are weapon-only prefixes). Pairs will become possible when reforging or new affixes are added.
- Gave `of_fortitude` both `fortify` and `berserker` tags (defensive but low-HP themed), and `of_the_titan` both `fortify` and `berserker` tags (HP + damage taken). This creates cross-slot berserker synergy: `berserker` weapon prefix + `of_fortitude`/`of_the_titan` armor suffix.
- Status combos include 6 interactions: Shatter (frozen), Toxic Fire (burn+poison), Punish (stunned), Hemorrhage (bleed+crit), Exposed Wound (vulnerable+DOT), Cripple (weakness+slow).
- Hero traits: 14 traits with weighted rolling. 60% chance of 1 trait, 40% chance of 2.
- Design doc says "18 affixes" but the file has 20 (10 prefixes + 10 suffixes). Tagged all 20.
- Design doc says "34 uniques" but the file has 33. Tagged all 33.
- Each new data file includes helper functions (roll, get, getAll) to minimize boilerplate when the engineering phases reference them.

**Next up:** Phase 1 prereq — add `runStats` accumulator to `combatSlice.js`.
