# Castles & Clickers — Weak Points Analysis

**Version:** v0.3.6 | **Date:** February 2026

This document catalogs every verified weakness in the game across code quality, game balance, player experience, and accessibility. Each finding includes exact file locations, code evidence, and severity ratings.

---

## Table of Contents

1. [Error Handling & Resilience](#1-error-handling--resilience)
2. [Shop System](#2-shop-system)
3. [Gold Economy](#3-gold-economy)
4. [Progression Pacing](#4-progression-pacing)
5. [Class & Combat Balance](#5-class--combat-balance)
6. [Technical Debt](#6-technical-debt)
7. [Accessibility](#7-accessibility)
8. [Player Experience Gaps](#8-player-experience-gaps)
9. [Minor Polish Issues](#9-minor-polish-issues)
10. [What's Working Well](#10-whats-working-well)

---

## 1. Error Handling & Resilience

**Severity: Critical** → **Partially resolved in v0.1.17**

~~The game has almost no defensive error handling.~~ Core error handling was added in v0.1.17: ErrorBoundary, localStorage protection, save flush on unload, canvas null guards. Some items remain open.

### 1.1 ~~No React Error Boundary~~ — **FIXED (v0.1.17)**

~~Neither `App.jsx` nor `main.jsx` wraps the component tree in an ErrorBoundary.~~ ErrorBoundary now wraps `<GameLayout />` in `App.jsx`.

### 1.2 ~~Only Two Try-Catch Blocks~~ — **Expanded (v0.1.17+)**

~~Only two try-catch blocks existed in the entire codebase.~~ Error handling has been expanded:

| File | What It Protects |
|------|------------------|
| `src/hooks/useGameLoop.js` | Game tick execution (try-finally — exceptions still not caught, but game loop continues) |
| `src/canvas/SpriteManager.js` | SVG-to-bitmap rendering (promise rejection handler) |
| `src/components/ErrorBoundary.jsx` | React error boundary with localStorage cleanup **(NEW v0.1.17)** |
| `src/store/helpers/throttledStorage.js` | 4 try-catch blocks protecting getItem, setItem, removeItem, flush **(NEW v0.1.17)** |

Combat calculations, equipment generation, and canvas rendering still run without protection.

### 1.3 ~~Unprotected localStorage~~ — **FIXED (v0.1.17)**

~~No try-catch around localStorage calls.~~ `throttledStorage` now has try-catch protection and a `flush()` method. `beforeunload` handler flushes pending saves on page close.

### 1.4 ~~Throttled Saves Risk Data Loss~~ — **FIXED (v0.1.17)**

~~No immediate save on critical events.~~ All critical game events (level-ups, rare drops, skill unlocks) now call `throttledStorage.flush()` for immediate saves.

### 1.5 ~~Canvas Null Checks Missing~~ — **FIXED (v0.1.17)**

~~Multiple canvas context acquisitions happen without null checks.~~ Canvas `getContext('2d')` null guards added to 7 locations across canvas files.

### 1.6 ~~NaN Propagation Risks~~ — **Mostly FIXED (v0.1.17+)**

- ~~`src/data/equipment.js`: If `getEquipmentByTier(tier)` returns an empty array, `possibleItems[0]` is undefined.~~ **FIXED** — defensive fallback to `EQUIPMENT_LIST` when array is empty.
- ~~`src/data/equipment.js`: If `RARITY[rarity]` is undefined, `rarityData.multiplier` is undefined → NaN.~~ **FIXED** — fallback to `RARITY.common`.
- `src/hooks/useGameLoop.js`: If `dungeon.level` is undefined, `Math.floor(100 * dungeon.level * goldMultiplier)` produces NaN gold. (Theoretical risk — `dungeon.level` should always exist when this code runs.)

### 1.7 ~~Grid Access Without Bounds Check~~ — **FIXED (v0.1.17+)**

~~`CanvasDungeonView.jsx` used `grid[y][x]` without optional chaining.~~ Both `CanvasDungeonView.jsx` and `TerrainLayer.js` now use `grid[y]?.[x]` with optional chaining.

---

## 2. Shop System

**Severity: Major** → **Partially resolved (rarity scaling added)**

~~The shop becomes irrelevant by mid-game and has no late-game purpose.~~ Rarity scaling was added in v0.1.20+, keeping the shop relevant longer.

### 2.1 ~~Forced Rarity Cap~~ — **FIXED (v0.1.20+)**

~~Any item generated above Uncommon was forcibly downgraded.~~ Shop rarity now scales with dungeon progress via `src/data/milestones.js`:

| Highest Dungeon Cleared | Max Shop Rarity |
|--------------------------|-----------------|
| D1–D9 | Uncommon |
| D10–D19 | Rare |
| D20–D24 | Epic |
| D25+ | Legendary |

`economySlice.js` retries generation up to 5 times if an item exceeds the cap, with a final fallback to force-regenerate at the max allowed rarity.

### 2.2 Pricing & Refresh — **Partially improved**

- Shop price = 1.75× sell value (unchanged)
- 4 items per refresh (unchanged)
- ~~4-hour auto-refresh timer~~ **Reduced to 2 hours**
- ~~Manual refresh costs a flat 50 gold~~ **Now scales**: `50 + floor(highestDungeon / 5) × 10`, capped at 200 gold

### 2.3 Dungeon Loot Still Outpaces Shop

The rarity scaling helps, but dungeon drops still outpace shop offerings due to volume — each dungeon clear can drop many items while the shop offers only 4 per refresh. The gap narrows at higher levels where shop Epic/Legendary items become available.

### 2.4 What's Still Missing

- ~~No rarity scaling with dungeon progress~~ **FIXED**
- No rotating "featured item" slot with higher rarity
- No consumables, scrolls, or non-equipment purchases
- No bulk buy/sell interface
- No shop specialization or themed inventories

---

## 3. Gold Economy

**Severity: Major**

The economy is well-balanced through mid-game but has a significant late-game sink problem.

### 3.1 Income Sources

| Source | Formula | Example (D15) | Example (D30) |
|--------|---------|---------------|---------------|
| Monster kills | Base gold × 1.09^(level-1) × (1 + Treasury bonus) | ~80 gold/kill | ~400 gold/kill |
| Dungeon completion | 100 × level × (1 + goldFind) | 1,950 gold | 6,000 gold |
| Equipment sells | Sum of stats × rarity multiplier | ~50–200 gold | ~200–800 gold |
| **Total per clear** | | **~5,400 gold** | **~46,000 gold** |

### 3.2 Gold Sinks

| Sink | Formula | Scaling |
|------|---------|---------|
| Homestead upgrades | baseCost × 2.5^level (or 3.0^ for Academy) | Exponential |
| Hero recruitment | 50 + (level × 30) + equipment + traits | Linear |
| Skill respec | 250 × usedSkillPoints | Linear (changed v0.1.20) |
| Shop purchases | 1.75× sell value | Flat |
| Shop refresh | 50 + floor(D/5) × 10, cap 200 | Scaling |

### 3.3 Total Homestead Cost to Max

| Building | Max Level | Total Gold to Max |
|----------|-----------|-------------------|
| Barracks (+5% HP/lv) | 10 | 635,064 |
| Armory (+5% ATK/lv) | 10 | 635,064 |
| Fortress (+5% DEF/lv) | 10 | 635,064 |
| Training Grounds (+10% XP/lv) | 10 | 952,589 |
| Treasury (+10% Gold/lv) | 10 | 952,589 |
| Academy (-1 CD/lv) | 5 | 36,300 |
| Infirmary (+2% heal/lv) | 5 | 16,109 |
| **Total** | | **~4,263,779 gold** |

### 3.4 Economy By Stage

| Stage | Income/Clear | Typical Upgrade Cost | Clears to Afford | State |
|-------|-------------|---------------------|-------------------|-------|
| D5 (Early) | ~1,100 | 100–250 | 0.1–0.2 | **Surplus** |
| D15 (Mid) | ~5,400 | 3,000–5,000 | 0.6–1 | **Balanced** |
| D25 (Late) | ~23,400 | 60,000+ | 2.5–4 | **Deficit** |
| D30 (Endgame) | ~46,000 | 300,000+ | 6–8 | **Severe grind** |

### 3.5 The Post-Homestead Void

Once all 7 buildings are maxed (~30 dungeon clears at D30), gold has **no remaining sink**:

- Shop purchases scale with rarity milestones but still offer only 4 items per refresh
- Recruitment costs are trivial compared to income
- Skill respecs are the only scaling cost, but players rarely respec repeatedly
- No consumables, cosmetics, or prestige system to absorb excess

**Result:** Gold piles up infinitely with nothing to spend it on.

---

## 4. Progression Pacing

**Severity: Major**

### 4.1 XP Curve

Formula: `xpForLevel(level) = floor(100 × 1.25^(level-1))`

| Level | XP Required | Cumulative XP |
|-------|------------|---------------|
| 1→2 | 100 | 100 |
| 5→6 | 244 | 820 |
| 10→11 | 745 | 3,323 |
| 15→16 | 2,273 | 10,964 |
| 20→21 | 6,938 | 34,287 |
| 25→26 | 21,175 | 105,469 |
| 30→31 | 64,623 | 322,705 |

The 1.25× multiplier creates a steep wall after level 20. Getting from level 20 to 30 requires ~288,000 XP — nearly 10× the total needed to reach level 10.

### 4.2 Skill Points Come Slowly

~~Formula: `calculateSkillPoints(level) = floor(level / 3)`~~ **Fixed in v0.1.20.**

Formula: `level < 2 → 0; level < 3 → 1; else 1 + floor(level / 3)`

- First skill point at level 2, second at level 3
- Heroes no longer auto-unlock a starter skill — players choose their first skill
- 5 points at level 12
- 11 points at level 30 (max meaningful count)
- **17 skills available per class**, but only 11 can be unlocked at level 30

### 4.3 Party Size Milestones Are Sparse

| Party Size | Unlock Condition | Approx. Playtime |
|-----------|-----------------|-------------------|
| 4 heroes | Default | 0 min |
| 5 heroes | Clear dungeon level 10 | ~90 min |
| 6 heroes | Clear dungeon level 20 | ~4+ hours |

Only 2 party expansion moments across 30 dungeon levels. Between dungeon 10 and 20, there's no party-related progression for potentially hours of play.

### 4.4 Elite Mob Difficulty Spike

~~Elite mobs begin spawning at dungeon level 10~~ **Changed to D8 in v0.1.20.** Elite mobs begin spawning at dungeon level 8 with:
- 1.5× HP, Attack, Defense over normal monsters
- 2× XP and Gold rewards
- Special affixes (+25–50% damage, lifesteal, reflect damage)

This represents a sharp difficulty jump that can wall players who haven't invested in gear upgrades.

### 4.5 Raid Unlock Gaps

| Raid | Unlock Level | Gap from Previous |
|------|-------------|-------------------|
| Sunken Temple | D12 | — |
| Cursed Manor | D18 | 6 levels |
| Sky Fortress | D24 | 6 levels |
| The Abyss | D30 | 6 levels |
| Void Throne | D35 | 5 levels (beyond dungeon cap?) |

Raids are evenly spaced but each 6-level gap represents significant grind time at higher levels. The Void Throne at D35 may be unreachable if dungeons cap at 30.

### 4.6 Respec Costs Lock In Builds

~~Exponential formula `50 × 2^(n-1)`.~~ **Fixed in v0.1.20 — now linear: `250 × usedSkillPoints`.**

| Skill Points Used | Old Cost | New Cost (v0.1.20) |
|-------------------|----------|---------------------|
| 1 | 50 gold | 250 gold |
| 3 | 200 gold | 750 gold |
| 5 | 800 gold | 1,250 gold |
| 7 | 3,200 gold | 1,750 gold |
| 10 | 25,600 gold | 2,500 gold |

Linear scaling encourages build experimentation while still being meaningful early on.

---

## 5. Class & Combat Balance

**Severity: Medium**

### 5.1 Speed Stat Dominance

Speed controls three separate mechanics, making it disproportionately powerful:

| Mechanic | Formula | Impact |
|----------|---------|--------|
| Dodge chance | (speed - 4) × 6% (cap 70%) | Survivability |
| Double attack | speedDiff × 3% (cap 30%) | DPS multiplier |
| Move distance | min(3, 1 + floor(speed/8)) | Positioning |

A Rogue (speed 12) vs a Knight (speed 3) gets:
- 48% base dodge
- Up to 27% double attack chance
- 2 tiles movement vs 1

This creates a DPS hierarchy where fast classes significantly outperform slow ones, even accounting for the slow class's higher raw stats.

### 5.2 Class Speed Spread

| Class | Base Speed | Role | Dodge at Base |
|-------|-----------|------|---------------|
| Knight | 3 | Tank | 0% |
| Paladin | 4 | Tank | 0% |
| Warrior | 5 | Tank | 6% |
| Cleric | 4 | Healer | 0% |
| Druid | 5 | Healer | 6% |
| Shaman | 5 | Healer | 6% |
| Necromancer | 5 | DPS | 6% |
| Mage | 6 | DPS | 12% |
| Ranger | 9 | DPS | 30% |
| Rogue | 12 | DPS | 48% |

Knights, Paladins, and Clerics can **never dodge** at base speed. The Rogue's 48% base dodge plus double-attack potential still dominates.

### 5.3 Mage Range Advantage

Mages have range 4 (highest) with AoE damage skills. Combined with speed 6 (decent dodge) and 18 base attack (highest DPS base), they can deal multi-target damage from safety. No other class combines this range + AoE + raw attack.

### 5.4 Tank Damage Irrelevance

All tanks deal low damage by design, but the game's idle nature means combat resolves automatically. Tanks that can't contribute damage just extend fight duration without meaningfully changing outcomes. Paladin's hybrid heal helps, but Knight and Warrior become pure HP sponges with no secondary value.

---

## 6. Technical Debt

**Severity: Major (maintainability), Low (player-facing)**

### 6.1 Oversized Files

| File | Lines | Responsibility | Status |
|------|-------|----------------|--------|
| ~~`src/hooks/useCombat.js`~~ | ~~3,508~~ → 568 | ~~Combat tick, damage calc, loot, status effects, death handling, XP/gold, viewport — all in one function~~ | **FIXED in v0.1.18** — Split into 6 files (orchestrator + 5 game modules) |
| ~~`src/store/gameStore.js`~~ | ~~2,929~~ → 234 | ~~46+ action methods, state init, validation, helpers, persistence — single Zustand store~~ | **FIXED in v0.1.19** — Split into 5 slices + 5 helpers |
| `src/components/icons/skills.jsx` | 2,697 | 143 SVG icon component exports |
| ~~`src/game/skillEngine.js`~~ | ~~2,067~~ → 906 | ~~Skill execution, passive effects (185-line switch), AI selection, effect handlers~~ Significantly reduced, likely refactored |
| `src/data/skillTrees.js` | 1,930 | Skill tree definitions (data file — acceptable) |
| `src/canvas/sprites/MonsterSprites.js` | 1,718 | Monster sprite data |
| `src/game/mazeGenerator.js` | 1,687 | Maze generation + A* pathfinding |
| `src/game/combatSimulator.js` | 1,657 | Balance testing tool |

~~The top 3 files each contain multiple concerns.~~ `useCombat.js` and `gameStore.js` have been split. `skillEngine.js` has been significantly reduced (2,067 → 906 lines).

### 6.2 Splitting Opportunities

**useCombat.js** — **COMPLETED (v0.1.18)**. Split into:
- `src/hooks/useCombat.js` — Thin orchestrator (~568 lines)
- `src/game/combatHelpers.js` — Pure utilities, targeting, death handling (~232 lines)
- `src/game/combatDamageResolution.js` — Basic attack damage + on-hit/kill/crit effects (~1,426 lines)
- `src/game/combatSkillExecution.js` — Hero skill and monster ability execution (~654 lines)
- `src/game/combatStatusEffects.js` — DOT/stun/buff per-turn processing (~429 lines)
- `src/game/combatMovement.js` — A* pathfinding and directional movement (~139 lines)

All functions share a mutable `ctx` object passed from the orchestrator. Game files never import `useGameStore` directly — store actions are wrapped as callbacks on `ctx`.

**gameStore.js** — **COMPLETED (v0.1.19)**. Split into:
- `src/store/gameStore.js` — Slim composition file, persist config, resetGame (~218 lines)
- `src/store/slices/heroSlice.js` — Hero CRUD, bench, tavern, XP, skills (~480 lines)
- `src/store/slices/inventorySlice.js` — Inventory, equipment, consumables, uniques, loot (~530 lines)
- `src/store/slices/combatSlice.js` — Combat state, heroHp, combatLog (~170 lines)
- `src/store/slices/dungeonSlice.js` — Dungeon lifecycle, raids, ascension (~330 lines)
- `src/store/slices/economySlice.js` — Gold, homestead, shop, stats, game speed (~310 lines)
- `src/store/helpers/throttledStorage.js` — Throttled localStorage IIFE (~60 lines)
- `src/store/helpers/statCalculator.js` — calculateHeroStats, caches, xpForLevel (~210 lines)
- `src/store/helpers/itemScoring.js` — STAT_PRIORITIES, calculateItemScore, calculateSellValue (~40 lines)
- `src/store/helpers/heroGenerator.js` — Name lists, generateTavernHero, createHero (~170 lines)
- `src/store/helpers/validation.js` — validateState, validationMiddleware (~85 lines)

All imports remain through `gameStore.js` — zero consumer changes required.

**skillEngine.js** — reduced from 2,067 to 906 lines (likely partially split or refactored). Further splitting could still separate:
- `passiveEffects.js` — passive effect handlers
- `skillAI.js` — chooseBestSkill, selection logic

### 6.3 ~~Magic Numbers~~ — **FIXED (v0.1.20+)**

~~Balance-critical values were hardcoded throughout the codebase.~~ A centralized `src/game/balanceConstants.js` (~61 lines) now exports named constants:

- `SPEED_THRESHOLD`, `BASE_DODGE_PER_SPEED` (0.06), `SPEED_BONUS_PER_DIFF` (0.05), `MAX_DODGE_CHANCE` (0.70)
- `DOUBLE_ATTACK_PER_SPEED` (0.03), `MAX_DOUBLE_ATTACK` (0.30)
- `DAMAGE_VARIANCE_MIN` (0.85), `DAMAGE_VARIANCE_RANGE` (0.30), `BASE_CRIT_MULTIPLIER` (1.5)
- `HP_CRITICAL` (0.25), `HP_LOW` (0.50), `HP_HURT` (0.75)
- `BOSS_LOOT_DROP_CHANCE`, `NORMAL_LOOT_DROP_CHANCE`, summon multipliers, movement, AoE, chain attack constants

These constants are imported across 8+ combat/game files.

### 6.4 Zero Test Coverage

No test files exist (`*.test.*`, `*.spec.*`, `__tests__/`). No jest or vitest configuration. The combat simulator (`window.runSimulation()`) provides manual balance testing but no automated regression safety.

### 6.5 Console Logging in Production

| File | Count | Type |
|------|-------|------|
| `src/game/combatSimulator.js` | 85+ | Intentional simulation output (ships to production) |
| `src/store/gameStore.js` | 2 | Validation warnings |
| `src/hooks/useDungeon.js` | 1 | Error log |
| `src/game/statusEngine.js` | 1 | Warning |
| `src/components/icons/index.jsx` | 1 | Missing icon warning |

The combat simulator's 85+ logs are intentional dev tooling but shouldn't ship in production builds.

### 6.6 ~~Unused TypeScript Packages~~ — **FIXED**

~~`@types/react` and `@types/react-dom` were installed in `package.json`.~~ Removed. The project is pure JavaScript with no TypeScript configuration.

### 6.7 No Circular Dependencies

Architecture is clean — dependencies flow one-way: `components/ → hooks/ → game/ → data/` and `components/ → store/ → data/`. No circular imports detected.

---

## 7. Accessibility

**Severity: Critical (compliance), Medium (player impact for this genre)** → **Largely resolved in v0.1.26**

### 7.1 ~~Zero ARIA Support~~ — **FIXED (v0.1.26)**

~~No `aria-*` attributes found across any component file.~~ ARIA attributes added to: GameHUD (hamburger button, version), NavBar (`aria-label`, `aria-disabled`, `aria-current`), CombatLog (`role="log"`, `aria-live`), LootNotifications (`role="status"`, `aria-live`), RaidSelectorModal (`aria-expanded`, `aria-controls`), ModalOverlay (`role="dialog"`, `aria-modal`, `aria-labelledby`), SkillNode (`aria-label` with skill name/tier/status).

### 7.2 ~~Keyboard Navigation Gaps~~ — **MOSTLY FIXED (v0.1.26)**

~~**Missing:**~~
- ~~No visible `:focus-visible` styling in CSS~~ **FIXED** — gold outline on buttons, blue outline on inputs
- ~~Skill tree nodes not keyboard navigable~~ **FIXED** — `onFocus`/`onBlur` shows tooltip, `aria-label` describes skill
- Canvas dungeon view has no keyboard alternative (acceptable — canvas is a visual display, not interactive)
- ~~No roving tabindex pattern anywhere~~ Not needed — all interactive elements use native `<button>` which is tabbable

### 7.3 ~~Focus Management in Modals~~ — **FIXED (v0.1.26)**

~~- No focus trap — focus can escape to background content~~
~~- No focus restoration — closing a modal returns focus to body, not the trigger~~
~~- No auto-focus on modal open~~

All fixed in `ModalOverlay.jsx`: focus trap (Tab/Shift+Tab wrap), auto-focus close button on open, focus restore to previous element on close. `aria-modal="true"` + focus trap replaces the `inert` attribute approach.

### 7.4 ~~Color Contrast Failures~~ — **FIXED (v0.1.26)**

~~The global `--color-text-dim: #a0a0b0` value is used throughout and likely fails contrast on dark backgrounds.~~

- `--color-text-dim` updated from `#a0a0b0` to `#b8b8c8` (~5.5:1 contrast on `#1a1a2e`)
- `--color-text-dark` updated from `#606070` to `#8a8a9a`
- `.pixel-label` and `.pixel-speed-btn` inherit the fix via CSS variables

### 7.5 ~~No Motion Safety~~ — **FIXED (v0.1.26)**

~~Zero instances of `@media (prefers-reduced-motion)` in the codebase.~~

Added `@media (prefers-reduced-motion: reduce)` block that sets `animation-duration: 0.01ms !important`, `animation-iteration-count: 1 !important`, and `transition-duration: 0.01ms !important` on all elements. Kills all 24+ keyframe animations and transitions for users who prefer reduced motion.

### 7.6 ~~Screen Reader Blind Spots~~ — **MOSTLY FIXED (v0.1.26)**

- ~~Icon-only buttons lack `aria-label`~~ **FIXED** — hamburger menu button has `aria-label`
- ~~Combat log updates have no `aria-live` region~~ **FIXED** — `role="log"` + `aria-live="off"` (too rapid for live announcements)
- ~~Loot notifications have no `role="status"`~~ **FIXED** — `role="status"` + `aria-live="polite"`
- Hero recruitment input has no associated `<label>` (still open)
- Buff/debuff icons rely solely on `title` tooltips (still open)

---

## 8. Player Experience Gaps

**Severity: Medium**

### 8.1 No Onboarding or Tutorial

No first-time player guidance exists:
- No welcome tutorial explaining the game loop
- No contextual help for combat, skills, equipment, or raids
- No feature unlock explanations
- Limited guidance exists via NavBar badges ("!" and "NEW") and locked feature title text

Players must discover mechanics entirely through trial and error.

### ~~8.2 No Save Feedback~~ (RESOLVED v0.1.27)

~~Auto-save runs on a 2-second throttle, completely invisible to the player.~~ Save indicator in GameHUD shows "Saved Xs ago" with green flash, warning on failure.

### ~~8.3 Silent Error States~~ (RESOLVED v0.1.27)

~~Most failure conditions produce no user-facing feedback.~~ Toast notification system shows errors for: insufficient gold, inventory full, skill prerequisites, max stack, unique sell attempt, save failure, and more.

### 8.4 No Loading States

No loading spinners, skeleton screens, or progress indicators for:
- Initial game startup (offline progress calculation)
- Dungeon generation
- Raid state transitions
- Large state calculations

If any async operation takes time, the UI freezes with no feedback.

---

## 9. Minor Polish Issues

**Severity: Low**

### ~~9.1 Unicode Symbols Instead of SVG Icons~~ — **FIXED (v0.1.28)**

~~6 instances remain where Unicode symbols are used instead of the pixel-art SVG system.~~ Replaced with pixel-art SVG icons (`ArrowUpIcon`, `SparkleIcon`, `ChevronIcon`, `CheckIcon`, `ArrowDownIcon`). Only `★` in a `title` attribute (plain text tooltip) remains — acceptable since it's not rendered UI.

### ~~9.2 Inline Style Inconsistency~~ — **FIXED (v0.1.28)**

~~Most components correctly use `pixel-panel` classes + Tailwind, but some use inline styles.~~ Static inline styles in `RaidSelectorModal.jsx`, `GameLayout.jsx`, and `BestiaryScreen.jsx` converted to Tailwind utilities. Remaining inline styles are for truly dynamic values (runtime colors, computed positions, complex gradients).

### ~~9.3 Canvas Skill Icon Gap~~ — **FIXED (v0.1.28)**

~~All 170 skills have SVG icons (100% coverage), but only 119 have canvas-optimized sprite implementations.~~ All 130 skills now have unique canvas sprite implementations. Added ~55 new drawer functions and updated `SKILL_ICON_MAP` to full coverage.

---

## 10. What's Working Well

For context, these systems are solid and should be preserved:

| System | Why It Works |
|--------|-------------|
| **Combat engine** | Initiative-based turns, A* pathfinding, status effects — complex and functional |
| **Canvas renderer** | 4-layer architecture, adaptive FPS (60→30), terrain caching, excellent performance |
| **Skill system** | ~180 skills, 58 passive types, 26 handler functions, zero dead code |
| **Unique items** | 53 dedicated icons, 6 CSS animations, celebration modal, collection screen |
| **SVG icon library** | 360+ custom 16×16 pixel-art icons with consistent style |
| **Mobile support** | Media queries, hamburger menu, touch handlers, responsive modals, 2-tap skill tree |
| **State management** | Smart stat caching with O(1) invalidation, batched updates, imperative access |
| **Architecture** | Clean one-way dependency flow, no circular imports, well-separated concerns at the module level |
| **Affix system** | Prefix/suffix generation, stat modification, visual display — complete pipeline |
| **Monster scaling** | Exponential difficulty with elite affixes creates natural progression gates |

---

## Priority Matrix

| # | Issue | Severity | Player Impact | Effort |
|---|-------|----------|---------------|--------|
| 1 | ~~No ErrorBoundary~~ | ~~Critical~~ | ~~White screen crashes~~ | **DONE (v0.1.17)** |
| 2 | ~~Unprotected localStorage~~ | ~~Critical~~ | ~~Silent data loss~~ | **DONE (v0.1.17)** |
| 3 | ~~No save flush on page unload~~ | ~~Critical~~ | ~~Lost progress~~ | **DONE (v0.1.17)** |
| 4 | ~~Shop rarity cap~~ | ~~Major~~ | ~~Entire system irrelevant~~ | **DONE (v0.1.20+)** — milestone-based rarity scaling |
| 5 | Post-homestead gold void | Major | No late-game progression | Medium |
| 6 | Slow early skill unlocks | Major | New player retention | Low |
| 7 | Speed stat dominance | Major | Class balance | Medium |
| 8 | No onboarding | Medium | New player confusion | High |
| 9 | ~~Accessibility (ARIA, keyboard)~~ **MOSTLY DONE** | ~~Medium–Critical~~ | ~~Excludes disabled players~~ | **DONE (v0.1.26)** |
| 10 | ~~File splitting (useCombat + gameStore)~~ **DONE** | ~~Major~~ | ~~Maintainability~~ | **DONE (v0.1.18 + v0.1.19)** |
| 11 | ~~Magic numbers~~ | ~~Medium~~ | ~~Balance tuning difficulty~~ | **DONE (v0.1.20+)** — `balanceConstants.js` |
| 12 | ~~Unicode → SVG icons~~ | ~~Low~~ | ~~Art consistency~~ | **DONE (v0.1.28)** |
| 13 | Zero test coverage | Major | Regression risk | Very High |
| 14 | ~~Motion safety~~ | ~~Medium~~ | ~~Vestibular/seizure risk~~ | **DONE (v0.1.26)** |
| 15 | Console logs in production | Low | Performance/noise | Low |
