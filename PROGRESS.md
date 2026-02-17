# Implementation Progress — Design Rethink

**Current Phase: Phase 1 — v0.2.0 — See What's Happening**

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
- [ ] Preparation phase screen — `POST_RUN` phase between dungeon end and next start, party overview, dungeon preview, auto-dismiss for idle players (Section 4)
- [ ] Milestone widget — 2-3 nearest goals shown on prep screen / HUD (Section 4)

---

## Phase 2: v0.2.1 — Know What To Do
*Reference: DESIGN_RETHINK.md Sections 3, 5*
*Goal: Player knows what went wrong and what to change.*

- [ ] Death recap popup on party wipe — data-focused, shows kill order, damage taken vs healing, dominant damage type (Section 3)
- [ ] Equipment comparison tooltips — use existing `compareToEquipped`, show stat diffs on hover/drop (Section 5.1)
- [ ] Smart auto-equip — suggest + confirm for rare+ items, silent equip below threshold (Section 5.1)

---

## Phase 3: v0.2.2 — Make Real Choices
*Reference: DESIGN_RETHINK.md Sections 5, 7, 12*
*Goal: Player makes real choices that change outcomes.*

- [ ] Difficulty slider on prep screen (1.0x–3.0x) — multiplier on monster stats + loot quality (Section 7.1)
- [ ] Hero traits on recruit — gameplay-affecting random traits from trait pool (Section 12.1)
- [ ] Loot targeting — themed affix pools per dungeon, favored affixes at 2x rate (Section 5.4)
- [ ] Infused/Ascended gear tiers at 2x/3x difficulty (Section 7.1)

---

## Phase 4: v0.3.0 — A New Chapter
*Reference: DESIGN_RETHINK.md Section 8*
*Goal: The game opens up with ascension.*
*Prereq: Versioned save migration system (architectural prereq #3)*

- [ ] **PREREQ:** Build versioned save migration system — replace ad-hoc `merge` with `v1_to_v2` pattern
- [ ] Ascension system (full Section 8) — partial reset, persistent state, stat bonuses, structural unlocks
- [ ] 7th party slot (Ascension 1 reward) — modify `getMaxPartySize`, add flex slot
- [ ] Offline progress enhancement — expand `calculateOfflineProgress`, add welcome-back screen

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
