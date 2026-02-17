# Castles & Clickers — Design Rethink

**Version:** v0.1.28 | **Date:** February 2026

This document is a health check and design direction for the next phase of Castles & Clickers. The game has strong bones — the combat engine, skill system, and pixel art identity are working. But the game loop completes too quickly, player choice thins out after the first few hours, and several features fight each other for what the game wants to be.

The goal: **RPG-first, idle-friendly.** Players should feel like they're building and mastering a party, not just watching numbers tick up. The idle wrapper should make the RPG accessible, not replace it.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [The Loop Today](#2-the-loop-today)
3. [Combat Feedback & The DPS Meter](#3-combat-feedback--the-dps-meter)
4. [The Preparation Phase](#4-the-preparation-phase)
5. [Equipment & Loot](#5-equipment--loot)
6. [Party Synergy](#6-party-synergy)
7. [Dungeon Variety](#7-dungeon-variety)
8. [Ascension](#8-ascension)
9. [Challenge Modes](#9-challenge-modes)
10. [Raids That Matter](#10-raids-that-matter)
11. [Unique Items — Build-Defining](#11-unique-items--build-defining)
12. [Hero Identity & Attachment](#12-hero-identity--attachment)
13. [Economy](#13-economy)
14. [Layout Overhaul](#14-layout-overhaul)
15. [Progressive Disclosure](#15-progressive-disclosure)
16. [Design Guardrails](#16-design-guardrails)
17. [Decisions (Formerly Open Questions)](#17-decisions)
18. [What We Cut & Why](#18-what-we-cut--why)
19. [Priority & Sequencing](#19-priority--sequencing)

---

## 1. Design Philosophy

### The Identity Problem

The game is split between two identities:

**Idle signals:** Fully automated combat, auto-equip, auto-sell, auto-advance, homestead passive bonuses, speed controls, "set it and forget it" loop.

**RPG signals:** 10 classes with distinct stat profiles, 180 skills across tiered trees, initiative-based combat with A* pathfinding, 34 unique items with complex triggers, 5 multi-boss raids, affix system on loot.

The problem isn't that both exist — it's that the **idle systems undercut the RPG systems.** When gear auto-equips, the player never learns what stats matter. When combat is 100% automated with no feedback, skill tree choices feel abstract. When the loop auto-advances, there's no moment to appreciate what the party just accomplished.

### The Five Pillars

Every feature decision in this document is evaluated against these five principles:

**1. Make existing systems visible.** The game has 180 skills, 34 uniques, 18 affixes, 10 classes. Players interact with almost none of it because auto-systems hide everything. Before adding new systems, surface what's already there.

**2. Every decision gets feedback within 60 seconds.** If a player reforges an item, they see the result in the next combat. If they swap a skill, the DPS meter reflects it immediately. Slow feedback kills engagement.

**3. Build systems that remix content, not pipelines that produce content.** A difficulty slider turns 30 dungeons into 90. Affix synergy bonuses create emergent gear sets from existing data. Stacked modifiers make Mythic raids infinitely variable. Zero new art needed.

**4. Run the numbers.** Power budgets, gold flow calculations, and cost curves must be defined before implementation. Don't guess — calculate.

**5. Design for emotions, not just systems.** Alternate tension (hard content), relief (victory), discovery (new loot/unlock), and anticipation (next goal visible). Every feature should answer: "What does the player *feel*?"

### The Automation Spectrum

Not all automation is equal. Each auto-system is classified as either tedium-removal (keep) or decision-removal (change):

| System | Current | Classification | Action |
|--------|---------|----------------|--------|
| Auto-advance dungeons | Automatic | Tedium-removal | Keep |
| Auto-equip gear | Automatic, silent | Decision-removal | Change to suggest + confirm above rare |
| Auto-sell loot | Automatic | Decision-removal | Change to filtered auto-sell with review |
| Speed controls | 1x/2x/3x | Tedium-reduction | Keep |
| Skill point allocation | Manual | Decision | Keep manual |
| Combat targeting | Fully automatic | Tedium-removal | Keep, but surface *why* via DPS meter |
| Dungeon navigation | Automatic A* | Tedium-removal | Keep |

**The litmus test for every new system:** Does it make an existing system more visible, or does it add a new system? For v0.2.x, the answer should almost always be the former.

**The idle baseline test:** For every new system, define what happens if the player never touches it. If the answer is "they fall behind," the system violates idle accessibility. If the answer is "they miss optional depth," it's healthy opt-in complexity.

---

## 2. The Loop Today

```
Recruit heroes -> Pick skills -> Enter dungeon -> Watch combat -> Get loot -> Repeat
                                                                      |
                                                              (loop ends at D30)
```

### What Works

- The core 15-minute loop of "push a new dungeon level" feels good through mid-game
- Skill point decisions at level-ups create genuine "what do I pick" moments
- Unique item drops are exciting (celebration modal, cyan glow)
- Raid structure with wing bosses is cool conceptually

### What Breaks Down

- After D15, the loop is just "same thing but slower"
- No meaningful decisions between dungeon runs besides "go again"
- Equipment is invisible — auto-equip handles everything, player never engages
- Combat log shows events but no *understanding* — player can't tell why they won or lost
- Party of 4-6 heroes but no reason to think about composition after initial pick
- Raids are just harder dungeons with more rooms — no unique strategy required
- D30 is a wall. Nothing after it. Gold piles up. Uniques finish collecting. Done.
- The gold dead zone actually starts around D20-D25 when homestead maxes, not D30

### The Economy Numbers

At D30 with maxed treasury (100% gold find bonus), a single dungeon yields ~17,520 gold. A player farming D30 on 3x speed does roughly 3-4 dungeons per hour, so ~60,000 gold/hour. Homestead costs ~4.2M total gold and is the only current sink. Once it maxes (around D20-D25), gold becomes meaningless for the final 5-10 dungeon levels.

### Target Feelings

Each of these represents a specific player emotion. They are achievable with targeted changes, not wholesale rewrites:

- **"I switched my Rogue's skills after seeing the DPS meter and her damage jumped 40%"** — requires: DPS meter (Section 3)
- **"My Rogue with Serpent's Fang is carrying — look at that chain crit damage"** — requires: DPS meter + unique visibility
- **"I need to farm Crystal Caves for a Freezing prefix to complete my build"** — requires: loot targeting (Section 5)
- **"I finally beat the challenge dungeon that's been walling me for days"** — requires: challenge modes (Section 9)

### Three Session Profiles

Every feature must serve at least one of these profiles:

| Profile | Duration | Activities |
|---------|----------|------------|
| **Morning check** | 2 min | Collect offline rewards, start a run, leave |
| **Lunch break** | 15 min | Push a dungeon level, tweak a build, reforge an item |
| **Evening session** | 1 hr | Raid attempt, build optimization, challenge dungeon, ascension decision |

The preparation phase and run summary serve the lunch break. Offline progress serves the morning check. Raids and challenges serve the evening session.

---

## 3. Combat Feedback & The DPS Meter

### The Problem

The player has no idea how well their party is performing. The combat log shows individual events ("Rogue ATK Goblin -47") but there's no aggregate view. The player can't answer basic questions during gameplay:

- Which hero is pulling their weight?
- Is my tank actually mitigating meaningful damage?
- Did that new skill I unlocked make a difference?
- Why did I wipe on that boss?

### Role-Aware Contribution Meter

Not a raw DPS meter — a **contribution meter** that makes every role feel valuable:

```
+-- Party Meter ----------------+
| Rogue     847 dmg  ########## |   Damage Dealt
| Mage      612 dmg  #######    |   Damage Dealt
| Ranger    438 dmg  #####      |   Damage Dealt
| Warrior   312 mit  ####       |   Damage Prevented
| Cleric    289 heal ###        |   Effective Healing
| Knight    487 mit  ######     |   Damage Prevented
|-------------------------------|
| Total DPS: 1,897  Time: 1:23  |
+-------------------------------+
```

**Role-specific metrics:**
- **DPS classes:** Damage dealt (raw numbers)
- **Tanks:** Damage prevented (damage absorbed + enemies taunted away from squishies)
- **Healers:** Effective healing (healing that restored missing HP, not overheal)
- **CC classes:** Control time (total seconds enemies were stunned/slowed)

This prevents the "Rogue good, Knight bad" problem that raw DPS meters create. Every role has a number to be proud of.

**Per-encounter reset:** Reset stats per room clear, not per run. "My Rogue crushed that elite" is more actionable than "my Rogue averaged 847 across 12 rooms." Show both: per-room live meter + cumulative run totals.

**Contribution percentage:** Display "Rogue: 42% of total damage" alongside raw numbers. Players respond strongly to relative performance — it makes evaluation instant even when absolute numbers are meaningless.

### Implementation

The data infrastructure already exists in `combatSlice.js`:
- `stats.heroStats` tracks per-hero `totalDamageDealt`, `totalDamageTaken`, `totalHealingDone`, `totalHealingReceived`
- `useCombat` computes `totalDamageDealtThisTurn`, `damageTakenByHero`, `healingDoneByHero` per tick

What's needed:
- Add a `runStats` object to `combatSlice` state, initialized on `startDungeon`, structured as `{ [heroId]: { damageDealt, healingDone, damageTaken, damagePrevented, controlTime, turnsTaken } }`
- Update per-tick in `useCombat` end-of-turn cleanup (10-15 lines alongside existing `incrementStat` calls)
- Create a `ContributionMeter` component reading `runStats` via `useThrottledDisplay`-style polling (not direct Zustand subscription)
- Calculate DPS as `damageDealt / (currentTick * tickDuration / gameSpeed)` — ticks-based, not wall-clock, to handle speed changes

### Run Summary

After every dungeon completion, show a **celebration popup**:

```
+-- Run Complete! ----------------+
|                                  |
|  MVP: Rogue (42% of damage)     |
|  Biggest Hit: 347 (Fireball)    |
|  Total Damage: 12,847           |
|  Total Healing: 3,210           |
|  Time: 2:34                     |
|                                  |
|  Positive: "Your Paladin's      |
|  heals kept the party alive     |
|  through 3 critical moments"    |
|                                  |
|  [Continue]  [View Details]      |
+----------------------------------+
```

This creates a moment of reflection between runs that the game currently lacks. It celebrates what worked, not just what failed. For idle players with auto-advance on, auto-dismiss after 5 seconds but flash the summary briefly.

### Death Recap

When the party wipes, show the facts — no automated suggestions:

```
+-- Defeat Breakdown ---------------+
|  Wiped on: Elite Ogre (Room 7/12) |
|                                    |
|  Knight died first (Turn 4)       |
|   - 340 dmg taken, 0 heals recv  |
|  Cleric died (Turn 6)            |
|   - 89 dps incoming > 67 hps out |
|  Rogue died (Turn 8)             |
|   - No tank, focused by 3 mobs   |
|                                    |
|  Your party took 2,340 fire dmg   |
|  this run. Consider: fire resist? |
|  More healing? More defense?      |
|                                    |
|  [Retry]  [Change Party]          |
+------------------------------------+
```

**Data, not prescription.** Show facts and frame questions. "Your Knight took 340 damage with 0 healing received" is actionable. "Need more DEF" is prescriptive and will be wrong in many cases. Trust the player's intelligence.

The "Change Party" button links directly to the preparation phase (Section 4), creating a feedback-to-action loop.

---

## 4. The Preparation Phase

### The Problem

The game has **no between-run decision space.** After a dungeon, auto-advance immediately starts the next one. There is no camp screen, no shop, no loadout review. The player never pauses to think "what should I change?" This is the single biggest structural gap in the game loop.

This is the "camp" in Darkest Dungeon, the "shop" in Balatro, the map screen in Slay the Spire, the mirror in Hades. It's where theory-crafting happens, where build identity forms, where the player feels like a strategist rather than a spectator.

### The Pre-Run Screen

After a dungeon completes (or before the first dungeon of a session), show:

```
+-- Prepare for D16: Volcanic Depths -----------+
|                                                 |
|  PARTY                    DUNGEON INFO          |
|  [Rogue *] Lv14 HP:340   Theme: Volcanic       |
|  [Knight]  Lv13 HP:520   Rooms: 10             |
|  [Cleric]  Lv13 HP:280   Boss: Magma Golem     |
|  [Mage]    Lv14 HP:260   Favored Drops:        |
|  [Ranger]  Lv12 HP:300    Blazing, Berserker's |
|                                                 |
|  DIFFICULTY  [===|====] 1.8x                    |
|  Enemies: +80%  Drops: +80%                     |
|                                                 |
|  MODIFIER (if unlocked):                        |
|  [Fortified] Monsters +25% DEF                  |
|                                                 |
|  MILESTONES                                     |
|  - Ranger: 200 XP to Whirlwind                  |
|  - 2 of 4 Sunken Temple uniques found           |
|  - 3 more clears to unlock Heroic raids         |
|                                                 |
|  [Enter Dungeon]  [Change Party]  [Skills]      |
+-------------------------------------------------+
```

### Key Elements

**Party overview** with quick-access to skill trees and gear. Click a hero to jump to their management panel.

**Dungeon preview** showing theme, room count, boss, and — critically — **favored drops** (see Section 5 on loot targeting). This makes dungeon selection a meaningful choice: "I'm going to Volcanic Depths because I need a Blazing prefix."

**Difficulty slider** (see Section 7). The player sets the risk/reward multiplier before entering.

**Milestone widget** showing 2-3 nearest goals. The player should *never* wonder "what am I working toward?" This is the most powerful retention element on the screen. Examples:
- "Ranger: 200 XP to Whirlwind"
- "2 of 4 Sunken Temple uniques found"
- "3 more clears to unlock Heroic raids"
- "7,500 gold to next reforge"

**For idle players:** If auto-advance is on, this screen auto-dismisses after 5 seconds. The information flashes by — the *option* to pause and decide exists, but the idle loop is unbroken.

### Implementation

Currently `endDungeon` in `dungeonSlice.js` transitions straight to idle, and `useGameLoop` calls `startDungeon` immediately if auto-advance is on. Insert a `POST_RUN` phase between dungeon completion and the next start. Modify `useGameLoop` to check for this phase and pause auto-advance until the screen is dismissed (or auto-dismiss after timeout).

---

## 5. Equipment & Loot

### The Problem

Auto-equip picks the highest score. The player never looks at gear. The 18 affixes across 3 tiers, 6 rarity levels, and class-specific equipment templates are all invisible content that already exists but generates zero engagement.

### 5.1 Equipment Comparison & Smart Auto-Equip

**Change auto-equip from silent swap to suggest + confirm** for items above a threshold (rare+ rarity, or score within 10% of current, or items with affixes the hero has never seen). Below that threshold, auto-equip continues silently — this is tedium-removal.

When a meaningful item drops, show a notification:

```
+-- New Item Found! ------------------+
|  Blazing Longsword (Rare)           |
|  ATK: 47 (+12)  SPD: 8 (+3)        |
|  Affix: Blazing (fire dmg on hit)   |
|                                      |
|  vs. Current: Steel Longsword       |
|  ATK: 35       SPD: 5               |
|  Affix: none                         |
|                                      |
|  [Equip]  [Keep Current]  [Compare] |
+--------------------------------------+
```

The `compareToEquipped` function already exists in `inventorySlice.js` and computes per-stat diffs. This is primarily a UI change, not a systems change.

### 5.2 Affix Synergy Bonuses (Replaces Gear Sets)

Instead of traditional gear sets (which require designing sets, creating new items, and ongoing maintenance), use **emergent synergy from the existing affix pool.**

If a hero equips items whose affixes share a keyword tag, they get a bonus:

| Affix Pair | Synergy Bonus |
|------------|---------------|
| Two "fire" affixes (Blazing + Scorching) | +15% fire damage |
| Two "speed" affixes (Swift + of Haste) | +10% dodge chance |
| Two "vampiric" affixes (Leeching + Draining) | +10% lifesteal |
| Two "fortify" affixes (Armored + Shielding) | +10% damage reduction |

This creates "sets" emergently from the existing 18 affixes in `itemAffixes.js`. No new art, no set definitions, no maintenance pipeline. Players naturally chase affix combinations on gear they already find.

**Implementation:** Add a `tags: ['fire']` field to each affix definition. In `calculateHeroStats`, count matching tags across equipped items and apply flat bonuses from a `AFFIX_SYNERGY_BONUSES` lookup table. Computed once per cache miss, not per tick.

### 5.3 Enchantment / Reforging

Spend gold to reroll an item's affixes, or lock one affix and reroll the others.

**Escalating cost curve per session:**

| Reroll # | Cost |
|----------|------|
| 1st | 2,000 |
| 2nd | 3,000 |
| 3rd | 5,000 |
| 4th | 8,000 |
| 5th | 12,000 |
| 6th+ | +5,000 each |

Cost resets after completing a dungeon run. This creates the "one more roll" gambling loop with natural breakpoints — the player decides when to stop based on their gold and satisfaction with the result.

**Locking one affix** costs 2x the base reroll price. This is the premium option for targeted builds.

**Cost scaling with ascension:** `displayedCost = baseCost * (1 + ascensionCount * 0.5)`. This keeps reforging relevant across multiple ascension cycles without manual rebalancing.

**Implementation:** Add a `reforgeItem(itemId, lockedAffixIndex)` action to `inventorySlice` that regenerates affixes using the existing `generateEquipment` affix logic. Items need a mutable `affixes` array (currently immutable). This is a data model change that requires save migration.

### 5.4 Loot Targeting via Themed Dungeon Pools

Assign affix pools to dungeon themes. Each theme has 2-3 favored affixes that drop at 2x normal rate:

| Dungeon Theme | Favored Affixes |
|---------------|----------------|
| Crystal Caves | Freezing, of Haste |
| Volcanic Depths | Blazing, Berserker's |
| Shadow Crypts | Leeching, Vampiric |
| Ancient Ruins | Armored, Fortified |
| Sky Towers | Swift, Shocking |
| Abyssal Depths | Corrupting, of Thorns |

This uses existing data in `dungeonThemes.js` + `itemAffixes.js` and creates a reason to revisit earlier dungeons: "I need to farm Crystal Caves at 2x difficulty for a Freezing prefix." It turns the dungeon map from a linear track into a purposeful decision space.

Show the favored drops in the preparation phase screen so the player can make an informed choice.

**Implementation:** Add a `favoredAffixes: ['freezing', 'of_haste']` field to each dungeon theme. In loot generation, double the weight of favored affixes for the current theme. This is a weighted random roll change — minimal code.

---

## 6. Party Synergy

### The Problem

Party composition matters (tank/healer/DPS) but there's no mechanical synergy between heroes beyond role coverage. Two Warrior+Cleric+Rogue+Mage parties play identically.

### 6.1 Status Effect Combos

Instead of position-based formation bonuses (which conflict with the automated A* movement system), use **status effect interactions** that leverage existing data in `statusEffects.js`:

| Condition | Effect |
|-----------|--------|
| Attack a **Frozen** target | Always crits |
| **Burning** + **Poisoned** on same target | +25% DOT damage |
| Attack a **Stunned** target | +50% damage |
| **Bleeding** target takes a crit | Bleed duration refreshes |
| **Sundered** target hit by magic | +25% magic damage |

These create party-building puzzles purely from skill tree selection. "If I bring a Mage for Freeze and a Rogue for crit, the Rogue will always crit frozen targets" is a genuine theory-crafting moment.

**Crucially, these are build checks, not execution checks.** The player solves the puzzle at the party screen by choosing classes and skills that create combos. The combat AI triggers them automatically. This respects the idle contract — the player doesn't need to watch combat to benefit.

**Implementation:** In `combatDamageResolution.js`, before applying damage, check the target's status effects against a `STATUS_COMBOS` lookup table. Apply the modifier. This is 20-30 lines of code in the damage resolution path. Show combo triggers in the combat log with distinct styling ("COMBO! Rogue crits Frozen Goblin for 347!").

### 6.2 Passive Aura Buffs on Capstone Skills

Add a `partyBuff` field to 3-4 capstone skills (the final skill in each tree). When the hero with that capstone is in the party, all allies receive the buff:

- **Warrior capstone "Warlord":** Party gains +10% attack
- **Cleric capstone "Divine Grace":** Party heals 2% HP per turn
- **Knight capstone "Iron Wall":** Party gains +15% defense when any hero drops below 50% HP

These are always-on passives applied in `statCalculator.js`. No AI changes needed. They immediately make party composition interesting: "Do I bring a Knight for the defensive aura, or a second DPS?"

### 6.3 Party Size — Ascension-Gated

Party stays at 6 for the first playthrough. Ascension unlocks additional slots:

- **Ascension 1:** 7th hero slot (role-flexible)
- **Ascension 3:** 8th hero slot (role-flexible)

**Cap at 8.** With 10 total classes, 8 active heroes still forces meaningful composition choices (you leave 2 classes out). The 7th slot as an odd number creates interesting tension: 3 DPS + 2 tanks + 2 healers, or 4 DPS + 2 tanks + 1 healer?

After the first ascension, remove strict role slot requirements. Let the player run 4 DPS if they want. This creates a meaningful pre-ascension game (learn roles) and a meaningful post-ascension game (experiment with unorthodox compositions).

**Implementation:** Modify `getMaxPartySize` in `milestones.js` to accept an `ascensionCount` parameter. Add ascension-unlocked slots as "flex" slots with no role requirement. The canvas grid (20x15 tiles) can accommodate 8 heroes + summons + monsters without visual clutter.

---

## 7. Dungeon Variety

### The Problem

Every dungeon run of the same level plays identically. The maze layout changes but the player doesn't interact with the maze — combat is automated, movement is automated, room order doesn't matter. Two runs of D20 are mechanically interchangeable.

### 7.1 Difficulty Slider (Risk/Reward)

A slider on the preparation phase screen, ranging from 1.0x to 3.0x:

| Multiplier | Enemy Stats | Drop Quality |
|------------|-------------|-------------|
| 1.0x | Normal | Normal |
| 1.5x | +50% HP/ATK/DEF | +50% drop rate, +1 rarity tier chance |
| 2.0x | +100% | +100%, access to "Infused" gear (guaranteed extra affix) |
| 2.5x | +150% | +150%, higher Infused gear rate |
| 3.0x | +200% | +200%, access to "Ascended" gear (unique modifier pool) |

**Exclusive loot tiers** make the slider meaningful at every progression point, not just for gold/XP:
- **Infused gear** (2.0x+): Normal items with a guaranteed bonus affix. These are the reforging base items players chase.
- **Ascended gear** (3.0x+): Items with modifiers that can't roll naturally — exclusive to high-difficulty runs.

This is the single cheapest high-impact feature in this document. One field in `dungeonSettings`, one multiplier in `useDungeon` monster setup, one multiplier in loot drop logic.

### 7.2 Room Events

8-10 random event types with a 15% chance per room. These use existing systems (combat, gold, buffs) in novel combinations:

| Event | Description | Uses |
|-------|-------------|------|
| **Trapped Chest** | Fight a mimic for bonus loot | Existing combat + loot |
| **Imprisoned NPC** | Free them for a party buff this run | Existing buff system |
| **Cursed Altar** | Trade 20% current HP for 500 gold | Existing HP + gold |
| **Healing Spring** | Full party heal, one use per run | Existing HP system |
| **Merchant** | Buy a random rare+ item for gold | Existing equipment gen |
| **Monster Ambush** | Double monster pack, double XP | Existing combat |
| **Ancient Library** | Random hero gains 2x XP this room | Existing XP system |
| **Crumbling Floor** | Skip room but no loot/XP | Existing navigation |

Room events are the only proposal that addresses **within-run variety.** Every other modifier is per-run; these make individual rooms surprising. Even 8 event types at 15% per room means roughly 1-2 events per 10-room dungeon — enough to break monotony without overwhelming the idle flow.

**Implementation:** In room generation within `mazeGenerator.js`, roll for events. Store the event type on the room object. In `useDungeon`, check for room events at room entry and trigger the appropriate handler. Each handler is 10-20 lines calling existing store actions.

### 7.3 Dungeon Affixes (Later Phase)

Per-run random modifiers the player sees before entering, similar to Diablo rift affixes:

| Affix | Effect |
|-------|--------|
| **Fortified** | Monsters +25% DEF |
| **Vampiric** | Monsters heal 5% of damage dealt |
| **Haste** | Monster speed +30% |
| **Thorns** | Attackers take 10% reflected damage |
| **Bolstering** | Monsters gain +10% stats per room cleared |
| **Bountiful** | +50% gold drops |

These pair with the difficulty slider for combinatorial variety. "Volcanic Depths at 2.5x with Vampiric and Haste" is a genuinely different challenge from the base dungeon.

**Saved for later phases** because each affix needs implementation in the combat engine and visual communication. The difficulty slider alone provides enough per-run variance for initial launch.

---

## 8. Ascension

### The Problem

The game ends at D30. Unique collection finishes. Gold has no sink. The loop stops. This is the single most impactful problem to solve.

### The Ascension Loop

When a player completes D30 (or defeats the final raid boss), they can **ascend:**

**What resets:**
- Dungeon progress returns to D10 (not D1 — skip the tutorial phase, the player has proven mastery of early game)
- Hero levels reset to level 10 (matching the dungeon reset)
- Equipment clears from inventory (but not equipped items on heroes — they keep what they're wearing)
- Gold resets to 10,000 (a starter fund, not zero)

**What persists:**
- Hero classes, names, traits, and prestige stars
- Skill trees stay unlocked, but **skill points redistribute** — the player gets all earned points back and can reallocate. Each ascension is a natural respec opportunity: "Now that I've seen D30, what build do I actually want?"
- Owned unique items (collection is permanent)
- Homestead levels
- Lifetime stats, achievements, and raid mastery progress

**What you gain:**
Each ascension unlocks something concrete — not just invisible stat bonuses:

| Ascension | Permanent Stat Bonus | Structural Unlock |
|-----------|---------------------|-------------------|
| 1 | +10% all stats | 7th party slot + Void Throne access |
| 2 | +20% all stats | Hero trait rerolling + challenge dungeon access |
| 3 | +30% all stats | 8th party slot + Mythic raid tier |
| 5 | +50% all stats | New capstone skill per class |
| 10 | +100% all stats | Prestige class variants (Dark Knight, Arch Mage, etc.) |

The moment of ascension should feel like **gaining something, not just losing progress.** The new party slot + Void Throne access makes the reset feel like a door opening.

**Dungeon cap increases:** D30 -> D35 -> D40 -> D45 -> D50 per ascension. New dungeon tiers beyond D30 use scaled versions of existing monster data with higher stat multipliers and new affix combinations, not entirely new content.

### Power Budget

**Target:** At ascension 10 with full investment, the player should be approximately **3x as powerful** as ascension 0. Back-calculate each bonus system to hit that cap:

| Source | Max Contribution |
|--------|-----------------|
| Ascension stat bonus | +100% (2x) at A10 |
| Hero prestige (all heroes at 3 stars) | +18% (6 heroes * 3%) |
| Homestead bonuses | +30% (already exists) |
| Affix synergies | +15-25% (depends on gear) |
| Unique item effects | Variable (already exists) |
| **Total multiplicative** | **~3.0-3.5x at max investment** |

Define diminishing returns or soft caps on stacking systems. Without them, ascension bonuses + prestige bonuses + affix synergies + homestead bonuses compound multiplicatively into absurd power levels.

### Implementation

- Add `ascension: { count: 0, maxDungeonLevel: 30 }` to store state
- Create an `ascend` action: snapshot preserved state, call a selective reset, increment count, recalculate caps
- Replace all references to `maxDungeonLevel: 30` with `ascension.maxDungeonLevel`
- In `calculateHeroStats`, apply `1 + (ascensionCount * 0.10)` multiplier after all other bonuses
- Save migration: `ascension: persistedState?.ascension || { count: 0, maxDungeonLevel: 30 }`
- Scale all gold sink costs with `baseCost * (1 + ascensionCount * 0.5)` to maintain economy health

### The Re-Leveling Experience

With XP curve `100 * 1.25^(n-1)`, resetting to level 10:
- First 5 levels after reset require ~2,700 total XP (very fast, feels powerful)
- By level 20, the player is making meaningful skill point decisions again
- The ascension stat bonus makes early dungeons feel breezy — reinforcing the "I'm stronger" feeling
- Skill point redistribution means the early-to-mid game involves genuinely different build decisions, not repeating the same picks

---

## 9. Challenge Modes

### Tower of Trials

Endless floors. No healing between floors. Score = highest floor reached. Uses existing monster data with scaling difficulty per floor. The floor counter is the chase — "I hit floor 47 last time, can I break 50?"

Available permanently after Ascension 2. No rotation, no timer, no server needed.

**Seed display:** Show a hash of the current run's random state so players can screenshot and share interesting seeds. The "leaderboard" is self-organized sharing requiring zero server infrastructure.

### Boss Rush (Later Phase)

Fight raid bosses back-to-back, no breaks. Time-based scoring. Requires existing raid boss data. Deferred because it needs the raid difficulty tier system to feel complete.

### Survival Arena (Later Phase)

Waves of increasingly powerful enemies. Deferred because it's the most content-dependent of the three modes.

### Implementation

Add a `challengeMode` type alongside `normal` and `raid` in dungeon settings. Tower mode disables `resetHeroHp` between rooms, spawns increasingly scaled monsters from existing definitions. Track high scores in `challengeScores: { tower: { best: 0 } }` in the store.

---

## 10. Raids That Matter

### The Problem

Raids are structurally different (multi-wing, persistent HP) but don't feel mechanically different from dungeons. There's no unique strategy required.

### 10.1 Raid Modifiers — Build Checks, Not Execution Checks

Each raid should require the player to adapt their party **before entering**, not react during combat. This respects the idle contract.

**Use soft gates, not hard gates.** "Ghosts take 75% reduced physical damage" (player can attempt with any comp, but feels the difference) — not "ghosts immune to physical" (hard-locks players out and feels punishing).

**Tiered implementation by engineering cost:**

**Tier 1 — Data only, no engine changes (ship first):**

| Raid | Mechanic | Implementation |
|------|----------|----------------|
| **Sunken Temple** | Water curse: all heroes start with -20% speed debuff | Apply status effect at raid start |
| **Cursed Manor** | Ghosts: 75% physical damage reduction on all enemies | Multiplier on physical damage calc |

**Tier 2 — Minor engine changes (ship second):**

| Raid | Mechanic | Implementation |
|------|----------|----------------|
| **The Abyss** | Darkness: reduced `VISION_RANGE` to 3 (from default) | Make vision range configurable per dungeon |
| **Sky Fortress** | Storm: party takes 5% max HP lightning damage per turn if more than 3 heroes share the same row | Row-count check in per-turn processing |

**Tier 3 — Significant engine changes (ship last):**

| Raid | Mechanic | Implementation |
|------|----------|----------------|
| **Void Throne** | Reality warps: 1-2 random dungeon affixes applied per wing | Reuse dungeon affix system from Section 7.3 |

### 10.2 Raid Mastery

Track clears per raid. At milestones, unlock **raid-specific** permanent buffs (not global — avoids "rich get richer"):

| Clears | Reward |
|--------|--------|
| 5 | +5% stats in this raid |
| 10 | +10% stats in this raid, cosmetic title |
| 25 | +15% stats in this raid, exclusive unique drop rate boost |

With 5 raids and 3 milestones each, that's 15 mastery goals using 100% existing raid content.

### 10.3 Raid Difficulty Tiers

| Tier | Stat Multiplier | Unlock | Special |
|------|----------------|--------|---------|
| **Normal** | 1.0x | Default | Teaches mechanics |
| **Heroic** | 1.5x | 50,000 gold per raid | Better unique drop rates |
| **Mythic** | 2.0x + 2 stacked dungeon affixes | Requires Ascension 3 | Random affixes make each attempt different |

**Mythic uses stacked modifiers, not hand-crafted new phases.** "Mythic Sunken Temple with Fortified + Vampiric" is a genuine puzzle from 100% existing systems, creating infinite variety without a content pipeline.

---

## 11. Unique Items — Build-Defining

### The Problem

Unique items have great mechanical depth (34 items, 13 trigger types, complex effects) but they're treated as collectibles. Once obtained, they're "equipped and forgotten."

### 11.1 Synergy Tags

Add tags to each unique definition. Show them in the UI:

| Tag | Example Uniques |
|-----|----------------|
| **Crit** | Serpent's Fang, Shadowfang |
| **AoE** | Stormcaller's Rod, Magma Core |
| **Sustain** | Vampire's Embrace, Blood Pendant |
| **Control** | Frostbite Orb, Mind Shackle |

When a unique drops, show **computed synergy** with the player's current heroes: "Best match: your Rogue (crit-focused skill tree)." Dynamic, always correct, zero ongoing maintenance — unlike static build guides.

Assign consistent tags per raid's loot table: Sunken Temple drops "Sustain" + "Crit" uniques, Sky Fortress drops "AoE" + "Speed." This creates clear farming paths.

### 11.2 Conditional Unique Leveling

Each unique gains XP through **two channels:**

- **Lifetime XP** (passive): The unique accumulates XP equal to a fraction of its wielder's combat XP, regardless of whether it's currently equipped. This allows swapping without penalty.
- **Conditional bonus XP** (active, 2-3x rate): Tied to the unique's identity. Examples:
  - Serpent's Fang: Bonus XP when the wielder crits
  - Ancient Bark: Bonus XP when the wielder absorbs shield damage
  - Stormcaller's Rod: Bonus XP when the wielder deals AoE damage

This creates engagement without punishing experimentation. The player can swap uniques freely (lifetime XP continues) but is rewarded for leaning into a unique's playstyle (conditional bonus).

At level thresholds, the unique's stats improve. At max level, spend rare materials (from challenge dungeons) to **awaken** — unlocking a second power or enhancing the first.

**Implementation:** Add `xp: 0, level: 1, awakened: false` to unique item instances. Create a `gainUniqueXp(itemId, amount)` action in `inventorySlice`. The save migration converts `ownedUniques: ['id1', 'id2']` to `ownedUniques: [{ id: 'id1', xp: 0, level: 1, awakened: false }, ...]` — handle in the `merge` function.

### 11.3 One Unique Per Hero

Enforce one unique item per hero. Choosing which unique to equip IS the build decision. When a hero has multiple applicable uniques, show a comparison screen highlighting what you gain and lose from each.

### 11.4 Duplicate Fusion (Replaces Sacrifice)

Combine two copies of the **same** unique to instantly advance its level. This feels like gaining ("my unique got stronger") rather than losing ("I destroyed three items").

No sacrifice-three-to-create-one. No random crafting from consumed items. Duplicates are progress, not currency.

---

## 12. Hero Identity & Attachment

### The Problem

Heroes are interchangeable mechanical units. Two Warriors with the same skills are identical. The player doesn't feel ownership over specific heroes.

### 12.1 Random Traits on Recruit

Each hero rolls 1-2 random traits at recruitment from a weighted pool:

| Trait | Effect |
|-------|--------|
| Quick Learner | +15% XP gained |
| Iron Will | +10% stun resist |
| Glass Cannon | +20% damage, -15% HP |
| Tough | +15% HP, -5% speed |
| Lucky | +5% crit chance, +5% dodge |
| Steady Hand | +10% accuracy |

Traits persist through prestige and ascension. They are permanent to the hero. This makes recruitment a decision: "Do I take this Glass Cannon Rogue, or wait for a Lucky one?"

`heroGenerator.js` already has a `trait` field — currently cosmetic. Make it affect stats by adding a `traitBonuses` step in `calculateHeroStats` after base stat calculation. Include trait ID in the cache key (traits are immutable per hero, so they never independently invalidate the cache).

**No mastery/affinity system.** Use-based bonuses that grow from repeated skill use would create sunk-cost traps that punish experimentation — directly contradicting the linear respec costs designed to encourage it. Hero depth comes from traits + prestige stars, not invisible hidden stats.

### 12.2 Combat History

Track and display per-hero lifetime stats:

- Total kills
- Dungeons survived
- Highest single hit
- Boss kills
- Times downed / revived

Show this on the hero card. "47 kills, survived 12 dungeons, dealt the killing blow to the Abyss boss" makes Hero #3 different from Hero #4 beyond their stat block.

This data already exists in `stats.heroStats` — it just needs a display component.

### 12.3 Prestige Stars (Ascension-Surviving)

A hero at level 25+ can **prestige**: reset to level 10 but gain a permanent star and +3% all stats. Prestige stars are **permanent across all ascensions** — they are the "deep investment" track while ascension is the "wide reset" track.

Visual indicator: star count on hero portrait, border glow at 3+ stars.

A 3-star Rogue who's been through 5 ascensions tells a story. That attachment keeps the player engaged even when the numbers stop mattering.

**Implementation:** Add `prestige: { count: 0 }` to hero objects. In `heroSlice`, add `prestigeHero(heroId)` that resets level/XP, preserves everything else, increments prestige count. In `calculateHeroStats`, apply `1 + (hero.prestige.count * 0.03)` multiplier. Prestige data is excluded from the ascension reset.

---

## 13. Economy

### The Problem

Gold has no late-game sink. After homestead maxes (~4.2M gold), income piles up. At D30 with maxed treasury, a dungeon yields ~17,520 gold. Farming generates ~60,000 gold/hour with nothing to spend it on.

### 13.1 Gold Sinks

Every sink is tied to a system from a previous section. Sinks ship alongside their parent features:

| Sink | Base Cost | Repeatable? | Scales With | Tied To |
|------|-----------|-------------|-------------|---------|
| Enchantment/reforging | 2,000 escalating | Yes | Session + Ascension | Section 5.3 |
| Challenge dungeon entry | 1,000-5,000 | Yes | Dungeon level | Section 9 |
| Hero prestige reset | 25,000 scaling | Yes | Prestige count | Section 12.3 |
| Unique awakening | 50,000-100,000 | Per unique | Ascension count | Section 11.2 |
| Raid difficulty unlock | 50,000 per tier/raid | Once | Fixed | Section 10.3 |
| Hero trait reroll | 10,000 escalating | Yes | Reroll count | Section 12.1 |

**All costs scale with ascension:** `displayedCost = baseCost * (1 + ascensionCount * 0.5)`. At Ascension 5, a base 2,000 reforge costs 5,000. This keeps sinks relevant without manual rebalancing per cycle.

### 13.2 One Secondary Currency (Not Three)

Start with **one** secondary currency: **Essence**, earned from raids and challenge dungeons (not regular dungeons). Spends on:
- Unique awakening materials
- High-tier enchanting (lock + reroll)
- Rare cosmetics

One currency, multiple earn paths, multiple spend paths. Fix gold's economy first. Add a second currency (Ascension Shards) only if the ascension loop proves sticky enough to warrant its own track.

**Why not three currencies:** Each currency needs earn rates, spend rates, display space, and player understanding. Three currencies triple the economy design surface area and create "too many resources" confusion. Melvor Idle ran on gold alone for over a year. Start simple.

---

## 14. Layout Overhaul

### Why This Is Phase 4, Not Phase 1

The 16:9 three-column layout is the correct long-term vision. But it's the single highest-effort item in this document — a near-complete refactor of `GameLayout.jsx` (857 lines, 12 modal overlays, orchestrates all game hooks). It produces zero new gameplay. Every gameplay feature in Phases 1-3 can ship in the current layout.

**Build the features first. Let them tell you what the layout needs.**

### Interim Approach (Ships With Features)

As features are added, make incremental layout improvements:
- **DPS meter:** Floating overlay on current canvas, or added to existing Sidebar
- **Preparation phase:** A modal screen (reuses existing ModalOverlay pattern)
- **Equipment comparison:** Tooltip overlay on existing equipment views
- **Run summary:** Modal popup (same as UniqueDropCelebration pattern)
- **Death recap:** Modal popup
- **Milestone widget:** Small persistent element in existing HUD bar

### Full Layout (Phase 4+)

When enough features exist to justify simultaneous visibility, restructure:

**Stage 1:** Extract `GameLayout.jsx` into composable pieces — `LayoutShell`, `ModalManager`, `DungeonHeader`, `GameOrchestrator`. Pure refactoring, no visual change.

**Stage 2:** CSS grid three-column layout for desktop (>1440px). Center column = existing canvas + log. Left column = new `PartyPanel`. Right column = collapsible panel that slides over canvas on demand. Media query falls back to current layout on smaller screens.

**Stage 3:** Migrate SkillTreeScreen and EquipmentScreen to work as both modals (mobile) and inline panels (desktop right column) via a `compact` prop.

### The Vision (Unchanged)

```
+-------------------------------------------------------------+
|  HUD Bar: Gold | Dungeon Info | Speed | Milestones | Menu   |
+-----------+-----------------------------+-------------------+
|           |                             |                   |
|  LEFT     |     DUNGEON CANVAS          |   RIGHT           |
|  PANEL    |     (expanded)              |   PANEL           |
|           |                             |   (collapsible)   |
|  Party    |                             |   - Skill tree    |
|  cards    |                             |   - Equipment     |
|  + HP     |                             |   - Combat stats  |
|           |                             |   - Minimap       |
|  Contrib  |                             |                   |
|  Meter    +-----------------------------+                   |
|           |  Combat Log                 |                   |
+-----------+-----------------------------+-------------------+
|  Tab Bar: Skills | Gear | Heroes | Shop | Raids | Stats    |
+-------------------------------------------------------------+
```

---

## 15. Progressive Disclosure

Don't dump all systems on the player at once. Unlock complexity in response to player mastery:

| Milestone | Unlock | Celebration |
|-----------|--------|-------------|
| First dungeon clear | Tutorial complete, full UI visible | "Welcome to Castles & Clickers!" |
| First wipe | DPS meter + death recap | "New tool unlocked: Contribution Meter" |
| D5 | Equipment comparison tooltips | "You can now compare gear drops" |
| D10 | Difficulty slider | "Risk vs. Reward: try harder dungeons for better loot" |
| D15 | Reforging/enchantment | "The Forge is open: spend gold to improve your gear" |
| D20 | Loot targeting info (favored drops visible) | "Dungeon Intel: each zone favors different loot" |
| D30 | Ascension prompt | "You have mastered the dungeon. A new path awaits..." |
| Ascension 1 | 7th slot + Void Throne + Prestige Stars | "Ascension unlocked! Your heroes grow stronger" |
| Ascension 2 | Challenge dungeons + trait rerolling | "The Tower of Trials awaits the bold" |
| Ascension 3 | 8th slot + Mythic raids | "Mythic difficulty: the ultimate test" |

Each unlock is a **celebration moment** — pixel-art styled popup with a brief explanation. The UI complexity grows with the player's competence. Factorio does this masterfully — simple at hour 1, overwhelming at hour 100, and the player never notices the transition.

**The key principle:** No more than one new system introduced per 5 dungeon levels. Players need time to learn each system before the next arrives.

---

## 16. Design Guardrails

Things to **preserve** as the game evolves:

### 1. The pixel art identity
Every new UI element uses the existing `pixel-panel`/`pixel-btn` system and 16x16 SVG icon language. No design drift.

### 2. Idle accessibility
Auto-advance, auto-equip (below rare threshold), and speed controls stay. New systems have sensible defaults so casual players aren't overwhelmed. Complexity is opt-in. **For every new system, define the "zero-engagement default"** — what happens if the player never touches it? If the answer is "they fall behind," redesign until the answer is "they miss optional depth."

### 3. Session flexibility
A player gets something done in 2 minutes (morning check), 15 minutes (lunch break), or 2 hours (evening session). Don't gate progress behind long mandatory sessions.

### 4. Transparent mechanics
Show the player the math. DPS meter, damage formulas in tooltips, clear "why" behind recommendations. Trust the player to engage with systems when they're visible.

### 5. Visible next-goal
At every point in the game, the player can see their next meaningful milestone surfaced in the UI. "3 more clears until Heroic raids." "200 XP from Whirlwind." "2 of 4 Sunken Temple uniques." The player should **never** wonder "what am I working toward?"

### 6. Feedback within 60 seconds
Every player decision must have visible feedback within 60 seconds. If a player reforges an item, they see the result in the next combat. If they swap a skill, the meter reflects it. If the player can't see the effect of their decision within a minute, the system needs better feedback.

### 7. Emotional pacing
Alternate tension (hard content), relief (victory), discovery (new loot/unlock), and anticipation (next goal visible). The game should have peaks and valleys, not a flat emotional line. Celebrate victories (run summary), acknowledge defeats (death recap), surprise the player (room events), and always show what's next (milestone widget).

---

## 17. Decisions (Formerly Open Questions)

These are no longer open. Answers are final unless new evidence contradicts them.

### 1. Ascension Scope
**Partial reset.** Reset to D10/Level 10 (skip tutorial), clear inventory (keep equipped items), reset gold to 10,000. Keep classes, skills (redistribute points), uniques, homestead, lifetime stats, prestige stars. Grant permanent stat multiplier + structural unlock per ascension. See Section 8 for full details.

### 2. Combat Interactivity
**No mid-combat input.** The entire combat engine is designed for non-interactive execution. Adding input means pausing the tick loop and waiting for player action — a fundamentally different architecture. Player expression belongs in **pre-combat decisions** (party comp, gear, skills, difficulty) and **post-combat feedback** (DPS meter, death recap). The combat itself stays automated. A "target priority" pre-combat setting is acceptable if needed later.

### 3. Offline Progress
**Yes, modest.** On game load, calculate elapsed time since last save. Award gold and XP at 25% of estimated active rate, capped at 8 hours. Show a "Welcome back!" screen with what was earned. This gives the morning-check player a reason to open the game. `calculateOfflineProgress` in `economySlice.js` already partially handles this — enhance rather than replace.

### 4. Multiplayer/Social
**No. This is a single-player game.** The architecture (localStorage, Zustand) cannot support multiplayer without a complete rewrite. Leaving this open costs design clarity. If social features are ever desired, start with async-only: exportable run summaries, screenshot-friendly layouts, seed sharing for challenge dungeons.

### 5. Party Size Target
**8 max, ascension-gated.** 6 base + 7th at Ascension 1 + 8th at Ascension 3. Role slot restrictions lift after first ascension. See Section 6.3.

### 6. Content Pipeline
**Systems over content.** The sustainable cadence is: one new raid per major version, 3-5 new uniques per minor version, new dungeon affixes as the lowest-effort content addition. Prioritize systems that make existing content replayable (difficulty slider, ascension, challenge modes, room events, loot targeting) over creating new content from scratch. New monsters can be created in 30-60 minutes each (data entry + SVG sprite). New raids are 4-8 hours each.

---

## 18. What We Cut & Why

These ideas were considered and rejected. This section exists to prevent them from being re-proposed without new justification.

### Traditional Gear Sets
**Cut.** Replaced by affix synergy bonuses (Section 5.2). Gear sets require designing sets, creating new items that belong to each set, balancing set bonuses against non-set alternatives, and ongoing maintenance when new items are added. Affix synergy bonuses create emergent sets from existing data with zero new content. Diablo 3 spent years regretting how sets warped their game.

### Combo Skills (Position-Based)
**Cut.** Replaced by status effect combos (Section 6.1) and passive aura buffs (Section 6.2). Position-based combos require the player to control formations in an automated combat system — the A* pathfinding handles movement, not the player. Status effect combos trigger automatically from existing skill interactions and are solvable as pre-combat build decisions.

### Formation Bonuses
**Cut.** Same reason as combo skills. Heroes move via A* pathfinding. The player has no formation control during combat. Passive aura buffs deliver the party synergy benefit without requiring a spatial awareness system.

### Hero Prestige as a Separate System
**Restructured.** Hero prestige still exists as prestige stars (Section 12.3) but is no longer a competing reset loop alongside ascension. Stars are permanent, ascension-surviving investments. The confusing two-axis reset problem ("do I prestige before or after ascending?") is eliminated.

### Mastery/Affinity (Use-Based Skill Bonuses)
**Cut.** Heroes gaining permanent bonuses from repeated skill use creates sunk-cost traps that punish experimentation. A Warrior with 500 uses of Power Strike would never switch to a different build. This directly contradicts the linear respec costs designed to encourage experimentation, and violates the "transparent mechanics" guardrail (invisible history affecting stats). Hero depth comes from traits + prestige stars instead.

### Currency Diversification (Three New Currencies)
**Cut to one.** Raid Tokens, Ascension Shards, and Glory replaced by a single "Essence" currency. Each currency needs earn rates, spend rates, display space, and player understanding. Three currencies triple the economy design surface area. Melvor Idle ran on gold alone for over a year. Fix gold first. See Section 13.2.

### Unique Sacrifice (Three-For-One)
**Cut.** Replaced by duplicate fusion (Section 11.4). Sacrificing items feels bad — the player is trained to be excited about unique drops (celebration modal, cyan glow) and then asked to destroy three. Fusion converts duplicates into progress on the same item, which feels like gaining rather than losing.

### Static In-Game Build Guides
**Cut.** Replaced by computed synergy scores (Section 11.1). Static guides for 34 uniques across 10 classes would require ongoing authored text that becomes stale on every rebalance. Dynamic synergy computation is always correct and costs zero maintenance.

### Multiplayer / Leaderboards
**Cut for now.** The localStorage + Zustand architecture cannot support it without a complete backend rewrite. Seed sharing for challenge dungeons is the minimum viable social feature and requires no server infrastructure.

### The 16:9 Layout in Phase 1
**Deferred to Phase 4.** It's the single largest UI refactor in the project, touches every component, and produces zero new gameplay. Every gameplay feature ships in the current layout first. The layout overhaul happens after the features exist and tell us what needs simultaneous visibility. See Section 14.

---

## 19. Priority & Sequencing

### Phase 0: Data Prep (Now, 1-2 days)

Zero-engineering content design work that clarifies direction for all subsequent phases:

- [ ] Achievement definitions (conditions + rewards for 20-30 achievements)
- [ ] Affix tag assignments for all 18 affixes
- [ ] Affix pool assignments per dungeon theme (favored drops)
- [ ] Unique item synergy tag assignments for all 34 uniques
- [ ] Room event definitions (8-10 events with trigger conditions)
- [ ] Dungeon affix definitions (6-8 affix types with effects)
- [ ] Status effect combo table (which combinations trigger what)
- [ ] Hero trait pool (10-15 traits with stat effects)
- [ ] Ascension milestone reward table

### v0.2.0: See What's Happening (2-3 days)

**Player feeling:** *"I can see what's happening and why."*

| Feature | Effort | Builds On |
|---------|--------|-----------|
| Role-aware contribution meter | Low | Existing `stats.heroStats` + `useCombat` per-tick data |
| Run summary popup (MVP, biggest hit, totals) | Low | Existing stats + modal pattern |
| Preparation phase screen (party + dungeon preview) | Low-Med | New `POST_RUN` phase in game loop |
| Milestone widget (2-3 nearest goals) | Low | Existing progression data |

### v0.2.1: Know What To Do (2 days)

**Player feeling:** *"I know what went wrong and what to change."*

| Feature | Effort | Builds On |
|---------|--------|-----------|
| Death recap (data only, no suggestions) | Low | Snapshot of `runStats` on defeat |
| Equipment comparison tooltips | Low | Existing `compareToEquipped` function |
| Smart auto-equip (suggest + confirm for rare+) | Low | Existing `processLootDrop` branching |

### v0.2.2: Make Real Choices (2-3 days)

**Player feeling:** *"I'm making real choices that change outcomes."*

| Feature | Effort | Builds On |
|---------|--------|-----------|
| Difficulty slider (1.0x-3.0x) | Low | Multiplier on monster stats + loot |
| Hero traits on recruit (gameplay-affecting) | Low | Existing `trait` field in `heroGenerator` |
| Loot targeting (themed affix pools per dungeon) | Low | Weighted random in loot generation |
| Infused/Ascended gear tiers at 2x/3x | Low-Med | New item quality flags |

### v0.3.0: A New Chapter (1 week)

**Player feeling:** *"The game just opened up. There's so much more."*

| Feature | Effort | Builds On |
|---------|--------|-----------|
| Ascension system (full — Section 8) | Med | Selective `resetGame` + new persistent state |
| 7th party slot (Ascension 1 reward) | Low | `getMaxPartySize` + flex slot |
| Offline progress enhancement | Low | Existing `calculateOfflineProgress` |
| Save migration system (versioned) | Med | Replace ad-hoc `merge` with `v1_to_v2` pattern |

### v0.3.1: Surprise Me (3-4 days)

**Player feeling:** *"Every run is different now."*

| Feature | Effort | Builds On |
|---------|--------|-----------|
| Room random events (8-10 types) | Med | Event handlers using existing systems |
| Tower of Trials (endless challenge mode) | Med | Challenge mode type + no-heal-between-rooms |

### v0.3.2: Craft My Build (3-4 days)

**Player feeling:** *"I'm shaping my heroes exactly how I want."*

| Feature | Effort | Builds On |
|---------|--------|-----------|
| Reforging / enchantment (escalating costs) | Med | Mutable affix arrays + gold sink |
| Affix synergy bonuses | Low | Tag matching in `calculateHeroStats` |
| Status effect combos | Low-Med | Lookup table in `combatDamageResolution` |

### v0.4.0: The Full Picture (1 week)

**Player feeling:** *"This feels like a real game."*

| Feature | Effort | Builds On |
|---------|--------|-----------|
| Layout overhaul (three-column, Section 14) | High | All prior features dictate layout needs |
| Passive aura buffs on capstone skills | Low | `partyBuff` field + `statCalculator` |
| Unique conditional leveling + fusion | Med | XP tracking per unique + save migration |
| Hero prestige stars | Low-Med | Per-hero persistent bonus |

### v0.5.0+: Depth (Ongoing)

| Feature | Effort |
|---------|--------|
| Raid difficulty tiers (Normal/Heroic/Mythic) | Med |
| Raid-specific mechanics (Tier 1 first, then Tier 2) | Med |
| 8th party slot (Ascension 3) | Low |
| Dungeon affixes (per-run modifiers) | Med |
| Achievement system with constraint challenges | Med |
| Essence currency + awakening system | Med |
| Progressive disclosure (gated feature unlocks) | Low-Med |

### Architectural Prerequisites

These should happen before or alongside their dependent features:

1. **Extract `GameLayout.jsx`** into composable pieces (`LayoutShell`, `ModalManager`, `DungeonHeader`, `GameOrchestrator`). Do this before v0.4.0. Pure refactoring, no visual change, but makes the layout restructure possible.

2. **Add `runStats` accumulator to `combatSlice`** before v0.2.0. Currently per-run combat stats don't exist as a first-class concept. This data layer serves the DPS meter, death recap, run summary, and eventually challenge dungeon scoring.

3. **Build a versioned save migration system** at v0.3.0. Replace the ad-hoc `merge` function with sequential migration functions (`v1_to_v2`, `v2_to_v3`). Ascension, unique leveling, hero prestige, and affix synergies all add new persistent state that needs clean migration paths.

---

## Appendix: Discovery & Surprise

Explorer-type players need things to find that aren't on any progression track. These are small, low-effort additions that create "wait, THAT works?" moments and word-of-mouth stories:

- **Hidden achievements** for emergent interactions: "Trigger a 3-way status effect combo," "Clear a room in a single turn," "Have a hero survive at 1 HP"
- **Rare room events** with very low spawn rates (1-2%): "A mysterious stranger offers a choice between three blessings," "A portal to a bonus room with elite monsters and guaranteed rare loot"
- **Unique item Easter eggs**: One or two uniques with bizarre effects that don't fit any meta but are fun to experiment with (e.g., "Jester's Cap: all damage numbers are randomized between 1 and 999, but averages the same")
- **Combat log rare messages** for extremely unlikely events: "Rogue dodged 5 attacks in a row!", "Cleric's heal crit saved Knight at 1 HP!"

These cost almost nothing to implement and create the stories players share. They are not on any critical path and can be added opportunistically at any phase.
